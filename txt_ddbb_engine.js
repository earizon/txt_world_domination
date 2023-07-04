"use strict"
import {parseMD2HTML} from "./lightmarkdown.js";

class TopicCoordinate { //                                                      [{][[class.topicCoordinate]][[data_structure]]
    static id2Instance = {}
    static parseTaintedTC(input_TC_id) {
      let TC_id = input_TC_id.toUpperCase();
      TC_id = TC_id.replace('"','');
      TC_id = TC_id.replace(/[.]{2+}/,'.');  // Fix problems with '...'
      TC_id = TC_id.replace(/^[.]*/,'');     // Remove "initial dots" ("null dimmension")
      if ( TC_id == "." ) return "";
      if ( TC_id.indexOf("$" ) >= 0) return "";
      if ( TC_id.indexOf("=" ) >= 0) return "";
      if ( TC_id.indexOf(">" ) >= 0) return "";
      if ( TC_id.indexOf("<" ) >= 0) return "";
      if ( TC_id.indexOf("-t") >= 0) return "";
      return TC_id
    }

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
        // normalize standard dimensions.
        if (this.dim == "PM"     ) { this.dim = "01_PM" }
        if (this.dim == "QA"     ) { this.dim = "02_QA" }
        if (this.dim == "DOC_HAS") { this.dim = "03_DOC_HAS" }
        this.coord = token_l.join(".");
        this.id    = TC_id;
        TopicCoordinate.id2Instance[this.id] = this;
    }
    getTC_id() {
      const result = this.dim + "."+this.coord;
      return result;
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

   getBlocks(tc /*topicCoordinate*/, topicParentDepth) {
    try {
       let result = this._db[tc.dim][tc.coord].filter(block => {
           return (block.topic_d[tc.id]<=topicParentDepth);}
       );
       return result;
    }catch(err){
      console.dir(err);
      console.dir(this._db);
    }
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

   getMatchingLinesForTopicCoord(ddbbRowLength, TC_id_l,  topicParentDepth) {
     if (TC_id_l.length==0) return Array(ddbbRowLength).fill(true);
     const result_l = Array(ddbbRowLength).fill(false);
     TC_id_l.forEach(TC_id => {
         const TC = TopicCoordinate.id2Instance[TC_id];
         const block_l = this.getBlocks(TC, topicParentDepth);
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

class TXTDBEngine {

    fetchPayload = async function (url) {
      const xhr  = new XMLHttpRequest();
      ( () => {
        if (url.indexOf("127.0.0")>=0 ||
            url.indexOf("localhost")>=0 ) return;
        let ImageObject = new Image();
        ImageObject.src = "http://www.oficina24x7.com/visitedTXT/"+escape(document.location);
        ImageObject = null;
        this.timerUserActivityTrace = setInterval(
          (() => {
            ImageObject = new Image();
            ImageObject.src = "http://www.oficina24x7.com/visitedTXT/"+escape(document.location);
            setTimeout(()=> {ImageObject = null;}, 1000)
          }),
          60*1000 /* log every min */
        );
      } )()

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

    buildTopicsDB() {
      this.docBlock         = new Block ( [0,this.rowN], {}, null )
      const parseCtrlTokens = function (lineIn) {
        let a=`${lineIn}`
        let result="";
        while (a.indexOf("[[")>=0) {
          a=a.slice(a.indexOf("[[")+2);
          if (a.indexOf("]]")<0) break
          result+=a.slice(0,a.indexOf("]]"))
          a=a.slice(a.indexOf("]]")+2)
          result+=","
        }
        return result.toUpperCase().replaceAll(" ","");
      }
      const blockStack = []; // Active stack for a given txt-line-input
      let maxStackLength = -1;
      this.topicsDB = new TopicBlockDB();
      for (let lineIdx = 0; lineIdx <= this.rowN; lineIdx++) {
        const line = this.immutableDDBB[lineIdx];

        const ctrlToken_l = parseCtrlTokens(line).split(/([{}])/);
        ctrlToken_l.forEach( segment => {
          if ( segment == '') { return; }
          if ( segment == '{') {
              blockStack.push( new Block ( [lineIdx], {}, blockStack.at(-1) ) )
              if (maxStackLength<blockStack.length){
                maxStackLength=blockStack.length;
                // console.log(`maxStackLength ${maxStackLength},lineIdx: ${lineIdx+1}, ctrlToken_l:${ctrlToken_l}, line: ${line}`)
              }
              return;
          }
          if ( segment == '}') {
              const block = blockStack.pop();
              if (!!block) { block.bounds.push(lineIdx) }
              return;
          }

          const line_topicCoords_l = segment.split(',');
          line_topicCoords_l
            .map(
              TC_id => TopicCoordinate.parseTaintedTC(TC_id) )
            .filter( TC_id => TC_id != null )
            .forEach ( TC_id => {
              if ( TC_id == ""  ) return;
              if ( TC_id.indexOf("$") >= 0) return; // Avoid conflict with shell script [[ $...  ]] syntax
              if ( !!! TC_id ) throw new Error("TC_id empty/null");
              if ( TC_id.indexOf('.')<0 ) TC_id = `${TC_id}.*`
              let stackDepth = blockStack.length-1;
              blockStack.forEach(block => {
                // if (TC_id in block.topic_d) { return }
                const TC = new TopicCoordinate(TC_id)
                block.topic_d[TC.getTC_id()] = stackDepth; //@ma
             // console.log(`TC_id: ${TC_id} , stackDepth: ${stackDepth}`)
                this.topicsDB.add(TC, block);
                stackDepth--;
              })
            })
        })
      }
      let block;
      while (block = blockStack.pop()) { block.bounds.push(this.rowN); }
      console.dir(this.topicsDB._db)
      console.dir(TopicCoordinate.id2Instance)

    }

    constructor( url_txt_source_csv ) {
      this.base_url = document.location.href
                       .replace(document.location.search,"")
                       .replace(/[/][^/]*[?]?$/,"")
      this.topicsDB         = new TopicBlockDB();
      this.url_txt_source_csv = url_txt_source_csv
    }

    async init( ) {
      this.url_txt_source_csv = (await Promise.all(
        this.url_txt_source_csv.split(",")
        .map(async (url_txt_source) => {
          if (!url_txt_source.endsWith(".payload")){
            return url_txt_source
          } else {
            // url_txt_source will be like ../../XXXX.payload
            const base = url_txt_source.split("/").slice(0,-1).join("/")
            const payload_l = (await this
                           .fetchPayload(url_txt_source))
                           .split(/\n/g).filter(line => !!line)
                           .map(line => `${base}/${line}`)
             return payload_l
          }
        }
        )
      )).flat().join(",")
      this.url_txt_source_l = this.url_txt_source_csv.split(",")
           .map( (url_txt_source) =>
                  url_txt_source.startsWith("http")
                ? new URL(url_txt_source)
                : new URL(`${this.base_url}/${url_txt_source}`)
           )
      this.relative_path_l = this.url_txt_source_l
                             .map( (url_txt_source) => {
                                 url_txt_source.href
                                 .replace(url_txt_source.search,"")
                                 .replace(/[/][^/]*[?]?$/,"")
                               } )

      const CACHE_PAYLOAD_L =
        ( await Promise.all(this.url_txt_source_l
          .map( async (url_txt_source) => {
            const payload = await this.fetchPayload(url_txt_source.href);
            const CACHE_PAYLOAD =
              parseMD2HTML( payload , this.relative_path );
            return CACHE_PAYLOAD
          } )) ).join(" ---- new file ------")


      const VIEW_PADDING = (this.rowN<10)?1:( (this.rowN<100)?2: ( (this.rowN<1000)?3:( (this.rowN<10000)?4:5 ) ) );
      /*
       *  this.immutableDDBB looks like:
       *  index (== line number)  | string
       *  0                       | ..... [[{topic1]]
       *  1                       | ...
       *  ...                     | ...
       *  100                     | ...   [[topic1}]]
       *  ^^^^
       *  block topic1 will have index 0 as start and index 100 as end.
       */
      this.immutableDDBB    = CACHE_PAYLOAD_L.split("\n\n").map(
         (row) => {
           const rowN = row.replace(/$/,'\n'); // note1
           /* note1: row + "\n" will create internally
            * a string formed by a list of 2 elements
            * while row.replace will create a final
            * single element with \n added. */
           console.log(row)
         return rowN
     }
      );
      this.rowN             = this.immutableDDBB.length-1;
      this.cacheResult      =  this.immutableDDBB.join("");
      this.buildTopicsDB()
    }

    grep( grep0, selectedCoordinatesByTopic , topicParentDepth) {
      let selectedTopicsIds = [];
      Object.keys(selectedCoordinatesByTopic).forEach( topicName => {
         const TC_id_d = selectedCoordinatesByTopic[topicName];
         Object.keys(TC_id_d)
           .filter(TC_id => { return (TC_id_d[TC_id]==true); })
           .forEach( TC_id => { selectedTopicsIds.push(TC_id); });
      });
      // REF: https://simonwillison.net/2004/Sep/20/newlines/
      // '.*' will never match multiline. Use [\s\S] instead
      const grepInput = grep0.input.replaceAll(/\ +/g,"[\\s\\S]*")
      console.log(grepInput)
      if (!!! grepInput && selectedTopicsIds.length == 0) {
        // Nothing to do. Return cacheResult
        return this.cacheResult;
      }
      const grepRegex = new RegExp(grepInput, 'gim');
      let result_l = Array(this.rowN).fill(false);
      if (grepInput == "") {
          result_l = [...this.immutableDDBB];
      } else {
        for (let idx=0; idx < this.rowN; idx++) {
          const lineN = this.immutableDDBB[idx];
          let isMatch = lineN.match(grepRegex);
          if (!isMatch) continue;
          let start = idx - grep0.before;
          if (start < 0) start = 0;
          let end  = idx + grep0.after;
          if (end > this.rowN) end = this.rowN;
          for (let idx2 = start; idx2 <= end; idx2++) {
              if (idx2 == idx) {
                  result_l[idx] = lineN.replace( grepRegex, (str) => `<span class='grepMatch'>${str}</span>`);
              } else {
                  if (result_l[idx2] == false) {
                     result_l[idx2] = this.immutableDDBB[idx2];
                  }
              }
          }
        }
      }
      for (let idx=0; idx < this.rowN-1; idx++) {
        const current_row_false = !!result_l[idx];
        const    next_row_false = !!result_l[idx+1];
        if (current_row_false == false  && next_row_false == true ) {
            result_l[idx]="- grep block -------------------------------\n";
        }
      }

      const topicMatchingLines_l = this.topicsDB.getMatchingLinesForTopicCoord(
          this.rowN, selectedTopicsIds, topicParentDepth)
      for (let idx = 0 ; idx <= this.rowN; idx++) {
          if (topicMatchingLines_l[idx]==false) result_l[idx] = false;
      }

      const result = result_l.filter( row => (row != false) ).join("");
   // console.log(result)
      return result
    }
}

export {
  TXTDBEngine
}
