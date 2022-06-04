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

   getBlocks(tc /*topicCoordinate*/) {
       return this._db[tc.dim][tc.coord].slice(1 /* remove docBlock */);
   }

   getDimensionList() { return Object.keys(this._db).sort(); }

   getCoordForDim(dim) { return Object.keys(this._db[dim]).sort().map(i => dim+"."+i); }

   getMatchingLinesForTopicCoord(docLastLine, TC_id_l) {
     if (TC_id_l.length==0) return Array(docLastLine).fill(true);
     const result_l = Array(docLastLine).fill(false);
     TC_id_l.forEach(TC_id => {
         const TC = TopicCoordinate.id2Instance[TC_id];
         const block_l = this.getBlocks(TC);
         block_l.slice(length-length-1).forEach(block => {
           for (let idx = block.bounds[0]; idx <= block.bounds[1]; idx++) {
               result_l[idx] = true;
           }
         });
     });
     return result_l;
   }
}

class Block {
    constructor(bounds, topic_d, parent) {
        this.bounds = bounds // /*[lineStart,lineEnd]
        this.topic_d = {}
        this.parent = parent 
    }
    setLineEnd(lineEnd) { this.bounds[1] = lineEnd; }
}

class TXTDBEngine  {

    fetchPayload = async function (url) {
      const xhr = new XMLHttpRequest();
      return new Promise( (resolve,reject) => {
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Cache-Control', 'no-cache')
        xhr.onreadystatechange = function() {
          if (xhr.readyState != 4) return
          if (xhr.status != 200) return
          resolve(
             xhr.responseText
          )
        }
        xhr.send()
      } )
    }

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
      this.topicBlockDB = new TopicBlockDB();
      for (let lineIdx = 0; lineIdx < this.immutableDDBB.length; lineIdx++) {
        const line = this.immutableDDBB[lineIdx];
        if ( line.indexOf('[{]') >= 0 ) {
            blockStack.push( new Block ( [lineIdx], {}, blockStack.at(-1) ) )
        }
        const line_topicCoords_l = parseTopicsInLine(line);
        blockStack.forEach( block => {
          line_topicCoords_l.forEach ( topicCoord => {
            if (topicCoord.id in block.topic_d) { return }
            block.topic_d[topicCoord.id] = true; 
            this.topicBlockDB.add(topicCoord, block);
          })
        })
        if ( line.indexOf('[}]') >= 0 ) {
          const block = blockStack.pop()
          if (!!block) { block.bounds.push(lineIdx) }
        }
      }
     
      return this.topicBlockDB
    }

    constructor( url_txt_source ) {
      this.url_txt_source   = url_txt_source;
      this.topicsDB         = new TopicBlockDB();
    }

    async init( bShowLineNum ) {
      let payload = await this.fetchPayload(this.url_txt_source);
      const doTxtPreProcessing = (input) => {
         /*
          * apply simple utility-like replacements (convert @[...] to HTML links, 
          * scape < chars , ... that in general will apply to any type of txt content.
          * Other custom (future) transformations will apply for selected blocks
          * (markdown, csv-to-table, ..) using some custom filter.
          */
         let H = input
         // NEXT) replace html scape chars 
         H = H.replaceAll('<','&lt;') 
              .replaceAll('>','&gt;')
         // NEXT) replace External links
         H = H.replace(
             /@\[((http|[.][/]).?[^\]]*)\]/g,
             " ▶<a target='_blank' href='$1'>$1</a>◀")   
      
         // NEXT) replace relative (to page) link
         H = H.replace(
             /@\[([^\]]*)\]/g,
             " ▷<a href='$1'>$1</a>◁")
         return H
      }
      this.cachePayload     = doTxtPreProcessing(payload) // TODO:(qa) Cache just source URL???
      this.immutableDDBB    = this.cachePayload.split("\n").map(row => row.replace(/$/,'\n') );
      const rowN            = this.immutableDDBB.length;
      const padding         = (rowN<10)?1:( (rowN<100)?2: ( (rowN<1000)?3:( (rowN<10000)?4:5 ) ) );

      if (bShowLineNum) {
        const lpad = function(value, padding) {
          // https://stackoverflow.com/questions/10841773/javascript-format-number-to-day-with-always-3-digits
          var zeroes = new Array(padding+1).join("0");
          return (zeroes + value).slice(-padding);
        }
        for (let idx=0; idx<rowN; idx++) {
            this.immutableDDBB[idx] = lpad(idx, padding) + this.immutableDDBB[idx];
        }
      }
      this.cacheResult      =  this.immutableDDBB.join("");
      this.docBlock         = new Block ( [0,this.immutableDDBB.length-1], {}, null )
      this.topicsDB         = this.buildIndexes()
      // console.dir(this.topicsDB._db)
    }

    grep( grep0, selectedCoordinatesIds) {
      let selectedTopicsIds = [];
      Object.keys(selectedCoordinatesIds).forEach( topicName => {
          const TC_id_d = selectedCoordinatesIds[topicName];
         Object.keys(TC_id_d).forEach( TC_id => {
             if (TC_id_d[TC_id] == true) {
                 selectedTopicsIds.push(TC_id);
             }
         });
      });
      const grepInput = grep0.input
      if (!!! grepInput && selectedTopicsIds.length == 0) return this.cacheResult;
      let data_input = ""
      const topicMatchingLines_l = this.topicBlockDB.getMatchingLinesForTopicCoord(
          this.immutableDDBB.length-1,selectedTopicsIds) 
      for (let idx = 0 ; idx <  this.immutableDDBB.length; idx++) {
          if (topicMatchingLines_l[idx]==true) data_input += this.immutableDDBB[idx];
      }
      if (!!! grepInput ) return data_input
      const beforeRB        = new ReadLinesBuffer(grep0.before)
      let result = "";
      const grepRegex = new RegExp(grepInput, 'gi');
        
      let afterPending = 0

      data_input.forEach( lineN => {
        // let isMatch = (lineN.indexOf(grepInput) > 0) 
        let isMatch = lineN.match(grepRegex);
        

        if ( !isMatch && afterPending > 0 ) {
            afterPending=afterPending-1
            result += lineN;
            if (afterPending==0) {
            }
        }
        if (isMatch) {
           result += "------grep ------------------\n";
           beforeRB.get().forEach(bLine => result += bLine)
           beforeRB.reset();
           const highligthedLineN = lineN
              .replace( grepRegex, (str) => `<span class='grepMatch'>${str}</span>`);
           result += highligthedLineN;
           afterPending = grep0.after
        } else {
           beforeRB.push(lineN)
        }
      })
      return result
    }
}

export {
  TXTDBEngine
}
