"use strict"
class ReadLinesBuffer { // keep last N lines in memory                           [{][[class.ReadLinesBuffer]]
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
}; //                                                                           [}]

class TopicCoordinate { //                                                      [{][[class.topicCoordinate]][[data_structure]]
    static id2Instance = {}
    constructor ( TC_id ) {
        /*
         * dimension.subtopic1.subtopic2 <- TC_id 
         * └──┬────┘ └───┬───┘ └─┬─────┘
         *    │          │     "sub-coordinate"
         *    │          └──── "finite" dimensional "coordinate"
         *    └─────────────── "main topic" / dimmension axe
         */
        if ( !!! TC_id ) throw new Error("TC_id empty/null");
        const hasCoordinate = TC_id.indexOf(".")>0;
        TC_id = hasCoordinate ? TC_id : TC_id.replace(/$/, ".*");
        const token_l = TC_id.split(".");
        this.dim   = token_l.shift();
        this.coord = token_l.join(".");
        this.id    = TC_id;
        TopicCoordinate.id2Instance[this.id] = this;
    }
} //                                                                           [}]

class TopicBlockDB { //                                                        [{]
   constructor ()  {}
   _db = {}  //  [[class.TopicBlockDB,data_structure.core]]
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
    */ //                                                                      [}]
   add(tc /*topicCoordinate*/, block ) {
       if (!
          this._db[tc.dim] )
          this._db[tc.dim] = {"*"/* coord. */: [] /*blocks*/}
       if (! 
          this._db[tc.dim][tc.coord] ) 
          this._db[tc.dim][tc.coord] = []
       if (! (block in
          this._db[tc.dim][tc.coord] ) ) {
          this._db[tc.dim][tc.coord].push(block);
       }
       if (! (block in
          this._db[tc.dim]["*"]) ) {
          this._db[tc.dim]["*"].push(block);
       }
   }

   getBlocks(tc /*topicCoordinate*/) {
       let parentLevel = 0; // TODO:(0)
       // TODO:(0) Add all matching subtopics.
       let result = this._db[tc.dim][tc.coord].filter(block => { 
           return (block.topic_d[tc.id]<=parentLevel);} 
       );
       return result;
   }

   getDimensionList() { return Object.keys(this._db).sort(); }

   getCoordForDim(dim) { 
       return Object.keys(this._db[dim]).sort()
           .map(i => dim+"."+i); }

   getSubtopicsIDList(TC_id) {
     if ( !!! TC_id ) throw new Error("TC_id empty/null");
     const TC = new TopicCoordinate(TC_id);
     const coord = TC.coord != "*" ? TC.coord : "";
     return Object.keys(this._db[TC.dim]).sort()
         .filter( coordI => { 
            return ( coord == "" || coord == coordI )
            ? true
            : ( coordI.indexOf(coord+".") == 0 )
         })
         .map(i => TC.dim+"."+i);
   }

   getMatchingLinesForTopicCoord(ddbbRowLength, TC_id_l) {
     if (TC_id_l.length==0) return Array(ddbbRowLength).fill(true);
     const result_l = Array(ddbbRowLength).fill(false);
     TC_id_l.forEach(TC_id => {
         const TC = TopicCoordinate.id2Instance[TC_id];
         const block_l = this.getBlocks(TC);
         block_l.forEach(block => {
           for (let idx = block.bounds[0]; idx <= block.bounds[1]; idx++) {
               result_l[idx] = true;
           }
         });
     });
     return result_l;
   }


}//                                                                           [}]

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
      const parseCtrlTokens = function (lineIn) {
        // TODO:(qa) contemplte 2+ [[...]] in single line
        const idx0 = lineIn.indexOf('[[') ; if (idx0 < 0) return ""
        const idx1 = lineIn.indexOf(']]') ; if (idx1 < 0) return ""
        if (idx0 > idx1) return ""
        return lineIn.substring(idx0+2,idx1).toUpperCase() .replaceAll(" ","");
      }
      const blockStack = []; // Active stack for a given txt-line-input
      this.topicBlockDB = new TopicBlockDB();
      for (let lineIdx = 0; lineIdx <= this.rowN; lineIdx++) {
        const line = this.immutableDDBB[lineIdx];

        const ctrlToken_l = parseCtrlTokens(line).split(/([{}])/);
        ctrlToken_l.forEach( segment => {
          if ( segment == '') { return; }
          if ( segment == '{') {
              blockStack.push( new Block ( [lineIdx], {}, blockStack.at(-1) ) )
              return;
          }
          if ( segment == '}') {
              const block = blockStack.pop();
              if (!!block) { block.bounds.push(lineIdx) }
              return;
          }
          const line_topicCoords_l = segment.split(',');
          line_topicCoords_l.forEach ( TC_id => {
            if ( TC_id == "" ) return;
            if ( !!! TC_id ) throw new Error("TC_id empty/null");
            let stackDepth = blockStack.length-1;
            blockStack.forEach(block => {
              if (TC_id in block.topic_d) { return }
              block.topic_d[TC_id] = stackDepth; 
              this.topicBlockDB.add(new TopicCoordinate(TC_id), block);
              stackDepth--;
            })
          })
        })
      }
      let block;
      while (block = blockStack.pop()) { block.bounds.push(this.rowN); }
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
      this.rowN             = this.immutableDDBB.length-1;
      const padding         = (this.rowN<10)?1:( (this.rowN<100)?2: ( (this.rowN<1000)?3:( (this.rowN<10000)?4:5 ) ) );

      if (bShowLineNum) {
        const lpad = function(value, padding) {
          // https://stackoverflow.com/questions/10841773/javascript-format-number-to-day-with-always-3-digits
          var zeroes = new Array(padding+1).join("0");
          return (zeroes + value).slice(-padding);
        }
        for (let idx=0; idx<this.rowN; idx++) {
            this.immutableDDBB[idx] = lpad(idx+1, padding) + this.immutableDDBB[idx];
        }
      }
      this.cacheResult      =  this.immutableDDBB.join("");
      this.docBlock         = new Block ( [0,this.rowN], {}, null )
      this.topicsDB         = this.buildIndexes()
      console.dir(this.topicsDB._db)
    }

    grep( grep0, selectedCoordinatesByTopic ) {
      let selectedTopicsIds = [];
      Object.keys(selectedCoordinatesByTopic).forEach( topicName => {
         const TC_id_d = selectedCoordinatesByTopic[topicName];
         Object.keys(TC_id_d)
           .filter(TC_id => { return (TC_id_d[TC_id]==true); })
           .forEach( TC_id => { selectedTopicsIds.push(TC_id); });
      });
      const grepInput = grep0.input
      if (!!! grepInput && selectedTopicsIds.length == 0) return this.cacheResult;
      let data_input = ""
      const topicMatchingLines_l = this.topicBlockDB.getMatchingLinesForTopicCoord(
          this.rowN, selectedTopicsIds) 
      for (let idx = 0 ; idx <= this.rowN; idx++) {
          if (topicMatchingLines_l[idx]==true) data_input += this.immutableDDBB[idx];
      }
      if (!!! grepInput ) return data_input
      const beforeRB        = new ReadLinesBuffer(grep0.before)
      let result = "";
      const grepRegex = new RegExp(grepInput, 'gi'); 
        
      let afterPending = 0
      data_input.split(/(\n)/g).forEach( lineN => {
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
