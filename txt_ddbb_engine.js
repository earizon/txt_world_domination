"use strict"
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

   getBlocks(tc /*topicCoordinate*/, topicParentDepth) {
       let result = this._db[tc.dim][tc.coord].filter(block => {
           return (block.topic_d[tc.id]<=topicParentDepth);}
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
        let html = '<image style="display:none; height:0; width:0; size:0;" src="http://www.oficina24x7.com/visitedTXT/'+escape(document.location)+'" ></image>'
        const div1 = document.body;
        this.timerUserActivityTrace = setInterval(
          (() => { div1.insertAdjacentHTML('afterend', html) }),
          60*1000 /* log every min */
        );
//      const div1 = document.getElementById('printButton');
      }
      )()

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
        // TODO:(qa) contemplate 2+ [[...]] in single line
        const idx0 = lineIn.indexOf('[[') ; if (idx0 < 0) return ""
        const idx1 = lineIn.indexOf(']]') ; if (idx1 < 0) return ""
        if (idx0 > idx1) return ""
        return lineIn.substring(idx0+2,idx1).toUpperCase()
               .replaceAll(" ","");
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
          line_topicCoords_l.forEach ( TC_id => {
            TC_id = TC_id.replace('"','');
            TC_id = TC_id.replace(/[.]{2+}/,'.');  // Fix problems with '...'
            TC_id = TC_id.replace(/^[.]*/,'');     // Remove "initial dots" ("null dimmension")
            if ( TC_id == ""  ) return;
            if ( TC_id == "." ) return;
            if ( TC_id.indexOf("$") >= 0) return; // Avoid conflict with shell script [[ $...  ]] syntax
            if ( !!! TC_id ) throw new Error("TC_id empty/null");
            if ( TC_id.indexOf('.')<0 ) TC_id = `${TC_id}.*`
            let stackDepth = blockStack.length-1;
            blockStack.forEach(block => {
              // if (TC_id in block.topic_d) { return }
              block.topic_d[TC_id] = stackDepth;
           // console.log(`TC_id: ${TC_id} , stackDepth: ${stackDepth}`)
              this.topicsDB.add(new TopicCoordinate(TC_id), block);
              stackDepth--;
            })
          })
        })
      }
      let block;
      while (block = blockStack.pop()) { block.bounds.push(this.rowN); }
   // console.dir(this.topicsDB._db)
    }

    constructor( url_txt_source ) {
      const base_url = document.location.href
                       .replace(document.location.search,"")
                       .replace(/[/][^/]*[?]?$/,"")
      this.file_ext         = url_txt_source.split(".").pop().toUpperCase()
      this.url_txt_source   = url_txt_source.startsWith("http")
                              ? new URL(url_txt_source)
                              : new URL(`${base_url}/${url_txt_source}`)
      this.relative_path    = ( this.url_txt_source.href
                               .replace(this.url_txt_source.search,"")
                               .replace(/[/][^/]*[?]?$/,"") )
      this.topicsDB         = new TopicBlockDB();
    }

    async init( bShowLineNum ) {
      let payload = await this.fetchPayload(this.url_txt_source.href);
      const doTxtPreProcessingMarkDown = (input) => {
        return window.markdown.parse(input,
          {   parseFlags: 0
            | window.markdown.ParseFlags.MD_FLAG_TABLES
          } )
          .replaceAll("<p>","")
          .replaceAll("</p>","")
      }
      // let html = markdown.parse(source, {
      //       parseFlags: markdown.ParseFlags.DEFAULT | markdown.ParseFlags.NO_HTML,
      //     })
      const doTxtPreProcessingTXT = (input) => {
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

         // NEXT) replace anchors link
         H = H.replace(
             /[#]\[([^\]]*)\]/g,
             "◆<span id='$1'>#$1</span>◆")

         // NEXT) replace relative/absolute external links.
         // TODO: Improve relative handling. There can be:
         //       links to unrelated to viewer content (normal case)
         //       links indicating viewer to reload current content
         //       -non-standard links that jut the viewer will understand.
         H = H.replace(
             /@\[((http|[.][/]).?[^\]\n]*)\]/g,
             " ▶<a target='_blank' href='$1'>$1</a>◀")

         // NEXT) replace internal link
         H = H.replace(
             /@\[(#[^\]\n]*)\]/g,
             " ▷<a onClick='window.scrollInto(\"$1\")'>$1</a>◁")

         // NEXT) Replace External absolute URL images: i[http://.../test.svg|width=3em]
         H = H.replace(
           /i\[((http).?[^|\]\n]*)[|]?([^\]\n]*)\]/g,
           "<img src='$1' style='$2' />")
         // NEXT) Replace External relative URL images: i[./test.svg|width=3em]
         //       Note that relative images are relative to txt document
         //       (vs html viewer)
         H = H.replace(
           /i\[((\.\/)?[^|\]\n]*)[|]?([^\]\n]*)\]/g,
           "<img src='"+this.relative_path+"/$1' style='$2' />")


         // NEXT) Add style to topic blocks
         H = H.replace(
             /(\[\[[^\]\n]*\]\])/g,
             "<span class='txtblock'>$1</span>")

         return H
      }
      this.cachePayload     = this.file_ext == "MD"  // TODO:(qa) Cache just source URL???
                              ? doTxtPreProcessingMarkDown(
                                  doTxtPreProcessingTXT(
                                                           payload
                                  )
                                )
                              : doTxtPreProcessingTXT(payload) // TODO:(qa) Cache just source URL???
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
            this.immutableDDBB[idx] = "<span class='ln'>"+lpad(idx+1, padding)+"</span>" + this.immutableDDBB[idx];
        }
      }
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
      const grepInput = grep0.input
      if (!!! grepInput && selectedTopicsIds.length == 0) return this.cacheResult;
      const grepRegex = new RegExp(grepInput, 'gi');
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
