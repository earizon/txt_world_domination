"use strict"
class ReadLinesBuffer { // keep last N lines in memory
    constructor(length) {
      this.length = length 
      this.buffer = [] 
    };
    get() {return this.buffer;}
    push(item){
       if (this.buffer.length == this.length) { this.buffer.shift() }
       this.buffer.push(item)
    } 
    reset() { this.buffer = []; }
};

class TopicCoordinate {
    static id2Instance = {}
    constructor ( sTopic ) {
        /*
         * dimension.subtopic1.subtopic2 <- sTopic 
         * └──┬────┘ └───┬───┘ └─┬─────┘
         *    │          │     "sub-coordinate"
         *    │          └──── "finite" dimensional "coordinate"
         *    └─────────────── "main topic" / dimmension axe
         */
        const token_l = sTopic.split(".")
        this.id    = token_l.join(".") 
        this.dim   = token_l.shift() 
        this.coord = token_l.join(".")
        TopicCoordinate.id2Instance[this.id] = this
    }
}

class TopicBlockDB {
   constructor ()  {}
   _db = {}
   /*    ^^
    *  topic1 : {
    *    coordinate1 : [ block1, block2, ... ]
    *    coordinate2 : [ block3, ... ] 
    *  },
    *  topic2 : {
    *    coordinate1 : [ block1, block2, ... ]
    *    coordinate2 : [ block3, ... ] 
    *  },
    *  ...
    */ 
   add(tc /*topicCoordinate*/, block ) {
       if (! this._db[tc.dim] )
          this._db[tc.dim] = {"*"/* coord. */: [] /*blocks*/}
       if (! this._db[tc.dim][tc.coord] ) 
          this._db[tc.dim][tc.coord] = []
       if (! (block in this._db[tc.dim][tc.coord]) ) {
          this._db[tc.dim][tc.coord].push(block);
       }
       if (! (block in this._db[tc.dim]["*"]) ) {
          this._db[tc.dim]["*"].push(block);
       }
   }

   getDimensionList() { return(Object.keys(this._db).sort()); }

   getCoordForDim(dim) { return(Object.keys(this._db[dim]).sort()); }
}

class Block {
    constructor(bound, topic_d, parent) {
        this.bound = bound // /*[lineStart,lineEnd]
        this.topic_d = {}
        this.parent = parent 
    }
    setLineEnd(lineEnd) { this.bound[1] = lineEnd; }
}

class TXTDBEngine  {

    buildIndexes() {
      const parseTopicsInLine = function (lineIn) {
        const idx0 = lineIn.indexOf('[[') ; if (idx0 < 0) return []
        const idx1 = lineIn.indexOf(']]') ; if (idx1 < 0) return []
        if (idx0 > idx1) return []
        const sInput = lineIn.substring(idx0+2,idx1).toLowerCase() .replaceAll(" ","");
        const unchecked_topic_l = sInput.split(","),
                checked_topic_l = unchecked_topic_l
          .map( (uchktopic) => { return uchktopic.trim().replaceAll(" ","") } )
          .map( (uchktopic) => {
             while (uchktopic.endsWith(".")) {
                 uchktopic = uchktopic.substring(0,uchktopic.length-1) }
             return uchktopic;
           })
          .filter( (uchktopic) => { return uchktopic != "" } )
        const topicCoordinate_l = checked_topic_l
          .map( sTopic => { return new TopicCoordinate(sTopic) } );
        return topicCoordinate_l;
      }

      const blockStack = []; // Active stack for a given txt-line-input
      const block_l = [];
      this.topicBlockDB = new TopicBlockDB();
      for (let lineIdx = 0; lineIdx < this.inmutableDDBB.length; lineIdx++) {
        const line = this.inmutableDDBB[lineIdx];
        if ( line.indexOf('[{]') >= 0 ) {
            blockStack.push( new Block ( [lineIdx], {}, blockStack.at(-1) ) )
        }
        const line_topicCoords_l = parseTopicsInLine(line);
        blockStack.forEach( block => {
          line_topicCoords_l.forEach ( topicCoord => {
console.log("("+topicCoord.id+" in block.topic_d)"+(topicCoord.id in block.topic_d))
            if (topicCoord.id in block.topic_d) { return }
            block.topic_d[topicCoord.id] = true; 
            this.topicBlockDB.add(topicCoord, block);
          })
        })
        if ( line.indexOf('[}]') >= 0 ) {
          const block = blockStack.pop()
          if (!!block) { block.bound.push(lineIdx) }
          block_l.push(block)
        }
      }
      return this.topicBlockDB
    }

    constructor( payload ) {
      this.payload          = payload
      this.inmutableDDBB    = payload.split("\n")
      this.topicsDB         = this.buildIndexes()
      // console.dir(this.topicsDB._db)
    }

    grep( grep0 ) {
      const grepInput = grep0.input
      if (!!! grepInput ) return this.payload
      const beforeRB        = new ReadLinesBuffer(grep0.before)
      const result = [];
      let afterPending = 0
      this.inmutableDDBB.forEach( lineN => {
        let isMatch = (lineN.indexOf(grepInput) > 0) 

        if ( !isMatch && afterPending > 0 ) {
            afterPending=afterPending-1
            result.push(lineN)
            if (afterPending==0) {
            }
        }
        if (isMatch) {
           result.push("------grep ------------------")
           beforeRB.get().forEach(bLine => result.push(bLine))
           beforeRB.reset()
           result.push(lineN)
           afterPending = grep0.after
        } else {
           beforeRB.push(lineN)
        }
      })
      return result.join("\n")
    }
}

export {
  TXTDBEngine
}
