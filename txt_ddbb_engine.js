"use strict"
import {parseMD2HTML} from "./lightmarkdown.js";

const debug_topics_101=false
const debug_fetch=false
const debug_topic_proximity=false

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
        this.id    = [this.dim,this.coord].join(".")
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

   /**
    * Given a topic01 and a reference set of
    * topics (for example topics selected in a UI), 
    * return if the topic01 is close (in a matching block)
    * to any of the topics in the reference set.
    * "Close" is an arbitrary "close" measure.
    */
   isTopicClose(tc_id_01, tc_ref_l /* topicCoordinate list */) {
     const numberOfCoincidences = function(tc_id_array1, tc_id_array2) {
       let result = 0;
       tc_id_array2.forEach(tc_id2 => {
           if (tc_id_array1.indexOf(tc_id2)>=0) {  result = result+1 }
       })
       if (debug_topic_proximity) {
           console.log(`tc_id_array1:${tc_id_array1}`)
           console.log(`tc_id_array2:${tc_id_array2}`)
           console.log("numberOfCoincidences: " + result) 
       }
       if (result>=3) result = 3;
       return result
     }
     const blockStackDepth = 0; // TODO:(0) Parameterize
     const tc01 = new TopicCoordinate(tc_id_01)
     const blocks_matching_topic01_l = this._db[tc01.dim][tc01.coord]
     const tc_id_d = {} // ¹
     /* ¹ keys in tc_id_d represent topics (id) "meeting" tc_id_01 
      *   in one or more blocks */
     blocks_matching_topic01_l.forEach(block => {
       Object.keys(block.topic_d).forEach(
         tc_id => { 
           const depth = block.topic_d[tc_id]
           if (depth > blockStackDepth) { return; }
           tc_id_d[tc_id] = true;
         }
       )
     })
     const tc_id_matching_l = Object.keys(tc_id_d) // Only keys are important.
     const result = numberOfCoincidences(tc_id_matching_l, tc_ref_l)
     return result
   }

   getBlocks(TC_id /*topicCoordinate_id*/, topicParentDepth) {
    const tc = TopicCoordinate.id2Instance[TC_id];
    try {
       let result = this._db[tc.dim][tc.coord].filter(block => {
           return (block.topic_d[tc.id]<=topicParentDepth);}
       );
       return result;
    }catch(err){
      console.log("TC_id:"+TC_id);
      console.dir(err);
      console.dir(this._db);
      console.dir(TopicCoordinate.id2Instance);
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

   getMatchingLinesForTopicCoord(ddbbRowLength, TC_id_l,  topicParentDepth, isTopicFilterAnd) {
     const setUnion = function(...sets) { 
       // REF: https://stackoverflow.com/questions/32000865/simplest-way-to-merge-es6-maps-sets
       return sets.reduce((combined, list) => {
         return new Set([...combined, ...list]);
       }, new Set());
     }

     if (TC_id_l.length==0) return Array(ddbbRowLength).fill(true);

     let global_MatchSet = isTopicFilterAnd 
            ? new Set(Array.from(Array(ddbbRowLength).keys()))
            : new Set() ;
     let setIntersect = function(set1, set2) { 
       // https://stackoverflow.com/questions/32000865/simplest-way-to-merge-es6-maps-sets
       let newSet = new Set();
       for (let item of set1) {
         if (set2.has(item)) {
             newSet.add(item);
         }
       }
       return newSet;
     }

     TC_id_l.forEach(TC_id => {
         const TC_matching_set = new Set();
         const block_l = this.getBlocks(TC_id, topicParentDepth);
         block_l.forEach(block => {
           for (let idx = block.bounds[0]; idx <= block.bounds[1]; idx++) {
               TC_matching_set.add(idx);
           }
         });
         if (isTopicFilterAnd) {
             global_MatchSet = setIntersect(global_MatchSet,TC_matching_set);
         } else /* union */ {
             global_MatchSet = setUnion(global_MatchSet,TC_matching_set);
         }
     });
     const result_l = Array(ddbbRowLength).fill(false);
     global_MatchSet.forEach(it => result_l[it] = true)
     return result_l;
   }

}//                                                                           [}]

class Block {
    constructor(bounds, topic_d, parent) {
        this.bounds = bounds // /*[paragraphStart,paragraphEnd]
        this.topic_d = {}
        this.parent = parent
    }
}

var txt_loadError_l = [];
var txt_loadOK_l = [];
class TXTDBEngine {

    fetchPayload = async function (url) {
      if (debug_fetch) { console.log("fetchPayload url:"+url) }
      const xhr  = new XMLHttpRequest();
      // ( () => {
      //   if (url.indexOf("127.0.0")>=0 ||
      //       url.indexOf("localhost")>=0 ) return;
      //   navigator.sendBeacon("http://www.oficina24x7.com/visitedTXT/"+escape(document.location),"-");
      //  // this.timerUserActivityTrace = setInterval(
      //  // (() => {
      //  //   ImageObject = new Image();
      //  //   ImageObject.src = "http://www.oficina24x7.com/visitedTXT/"+escape(document.location);
      //  //   setTimeout(()=> {ImageObject = null;}, 1000)
      //  // }),
      //  //   60*1000 /* log every min */
      //  // );
      // } )()

      return new Promise( (resolve,reject) => {
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Cache-Control', 'no-cache')
        xhr.onerror = function(err) {
            console.error("url:"+url+", GET error: "+ err);
        };
        xhr.onreadystatechange = function() {
          // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
          // Value  State             Description
          // 0      UNSENT            Client has been created. open() not called yet.
          // 1      OPENED            open() has been called.
          // 2      HEADERS_RECEIVED  send() has been called, and headers and status are available.
          // 3      LOADING           Downloading; responseText holds partial data.
          // 4      DONE              The operation is complete.
          if (xhr.readyState != 4  /* UNSENT, ... LOADING */  ) {
            return
          }
          if (xhr.status      != 200 ) {
            txt_loadError_l.push({ href: url, err: xhr.status})
            console.error("url:"+url+", error: xhr.status: "+xhr.status);
            resolve( "" )
            return
          } else { 
            txt_loadOK_l.push({ href: url})
            const responseText = (
                    url.toLowerCase().endsWith(".payload" ) ||
                    url.toLowerCase().endsWith(".md" )      ||
                    url.toLowerCase().endsWith(".txt")      ||
                    url.toLowerCase().endsWith(".svg") )
                  ? xhr.responseText 
                  : "<hr/>```"+`${url}\n${xhr.responseText}`+"```"
            resolve( responseText )
          }
        }
        xhr.send()
      } )
    }

    buildTopicsDB() {
      this.docBlock         = new Block ( [0,this.paragraphN], {}, null )
      const parseCtrlTokens = function (paragraphN) {
        let result="";
        paragraphN.split("\n")
        .filter (lineN => {return lineN.indexOf("[[")>0})
        .forEach(lineN => {
          while (lineN.indexOf("[[")>=0) {
            lineN=lineN.slice(lineN.indexOf("[[")+2);
            if (lineN.indexOf("]]")<0) break
            result+=lineN.slice(0,lineN.indexOf("]]"))
            lineN=lineN.slice(lineN.indexOf("]]")+2)
            result+=","
          }
        })
        if ( result.indexOf("$") > 0 ) {
            // '$' forbidden. Avoid conflicts with shell like expressions:
            // if [[ ${var} ]] ...
            return ""; 
        }
        result = result.toUpperCase().replaceAll(" ","");
        return result
      }
      const blockStack = []; // Active stack for a given txt-line-input
      let maxStackLength = -1;
      this.topicsDB = new TopicBlockDB();
      for (let idx = 0; idx < this.paragraphN; idx++) {
        const paragraph = this.immutableDDBB[idx];
        const ctrlToken_l = parseCtrlTokens(paragraph).split(/([{}])/);
        ctrlToken_l.forEach( segment => {
          if ( segment == '') { return; }
          if ( segment == '{') {
              blockStack.push( new Block ( [idx], {}, blockStack.at(-1) ) )
              if (maxStackLength<blockStack.length){
                maxStackLength=blockStack.length;
                // console.log(`maxStackLength ${maxStackLength},idx: ${idx+1}, ctrlToken_l:${ctrlToken_l}, paragraph: ${paragraph}`)
              }
              return;
          }
          if ( segment == '}') {
              const block = blockStack.pop();
              if (!!block) { block.bounds.push(idx) }
              return;
          }

          const paragraph_topicCoords_l = segment.split(',');
          paragraph_topicCoords_l
            .map(
              TC_id => TopicCoordinate.parseTaintedTC(TC_id) )
            .filter( TC_id => { return ( TC_id != null  && TC_id != "" ) })
            .forEach ( TC_id => {
              if ( TC_id.indexOf('.')<0 ) TC_id = `${TC_id}.*`
              let stackDepth = blockStack.length-1;
              blockStack.forEach(block => {
                const TC = new TopicCoordinate(TC_id)
                block.topic_d[TC.getTC_id()] = stackDepth;
             // console.log(`TC_id: ${TC_id} , stackDepth: ${stackDepth}`)
                this.topicsDB.add(TC, block);
                stackDepth--;
              })
            })
        })
      }
      let block;
      while (block = blockStack.pop()) { block.bounds.push(this.paragraphN); }
      if (debug_topics_101) {
         console.log("buildTopicsDB() final results:")
         console.log("this.topicsDB._db:")
         console.dir(this.topicsDB._db)
         console.log("TopicCoordinate.id2Instance:")
         console.dir(TopicCoordinate.id2Instance)
      }
    }

    constructor( URL_SOURCE ) {
      this.base_url = document.location.href
                       .replace(document.location.search,"")
                       .replace(/[/][^/]*[?]?$/,"")
      this.topicsDB         = new TopicBlockDB();
      this.URL_SOURCE = URL_SOURCE
    }

    /**
     * If the url contains payload, return (recursively) the list of files 
     * pointed in payload. (the promise actually)
     * Otherwise, return the url as is.
     * NOTE: txt file can be a markdown, or any other text file (source code, ...)
     */ 
    async url2PayloadPromiseList(url_txt_source) {
      if (!url_txt_source.endsWith(".payload")){
console.dir([ url_txt_source ]);
        return [ url_txt_source ]
      } else {
        /*
         * url_txt_source will be like:
         * ../../../XXXX.payload
         *               └─────┴─ Identify file as payload (list of other files)
         *          └──────────┴─ doesn't matter.
         * └───────┴─ base 
         */
        const base = url_txt_source.split("/").slice(0,-1).join("/")
        const regexReplaceCommentsInPayload = new RegExp("[ \t]*(//|#).*$", '' /*flags */);
        const thisPtr = this
        const payload_l = (await this
                       .fetchPayload(url_txt_source)) // Get txt with file (payload) list
                       .split(/\n/g)                  // split lines into array
                       .map(line => line.replace(regexReplaceCommentsInPayload,"")) 
                       .filter(line => !!line)
                       .map(async (line) => {
                           return line.endsWith(".payload")
                           ? await Promise.all( await thisPtr.url2PayloadPromiseList(`${base}/${line}`) )
                           : `${base}/${line}`
                       })
         return payload_l.flat()
      }
    }

    async init() {
      const url_tree = await Promise.all( await this.url2PayloadPromiseList(this.URL_SOURCE))
      const url_list_with_dups = url_tree.filter(it => { return it.length>0 }).flat()
      /*
       * url_list_with_dups can contain (maybe) duplicates, if different "payloads"
       * point to the same file. This is a mostly undesired behaviour when grouping many
       * payloads. (do not repeat). Arbitrarely, next line keep csv order, removing 
       * duplicates after first.
       */
      const url_list =  [...new Set(url_list_with_dups)];
      this.url_txt_source_l = url_list
           .map( (url_txt_source) =>
                  url_txt_source.startsWith("http")
                ? new URL(url_txt_source)
                : new URL(`${this.base_url}/${url_txt_source}`)
           )
      if (debug_fetch) {
          console.log(`this.url_txt_source_l: ${this.url_txt_source_l}`)
      }
      this.relative_path_l = this.url_txt_source_l
                             .map( (url_txt_source) => {
                                 url_txt_source.href
                                 .replace(url_txt_source.search,"")
                                 .replace(/[/][^/]*[?]?$/,"")
                               } )
      txt_loadError_l = []
      txt_loadOK_l = []
      this.immutableDDBB    =  
        ( await Promise.all(this.url_txt_source_l
          .map( async (url_txt_source) => {
              const payload = await this.fetchPayload(url_txt_source.href);
              const CACHE_PARAGRAPH_L =
                parseMD2HTML( payload , this.relative_path );
            return CACHE_PARAGRAPH_L
          } )) ).flat()
      if (txt_loadError_l.length != 0 ) {
          this.immutableDDBB = [
              ... txt_loadError_l.map(it => `<code style="color:red;">${it.href}</code>, `),
              ... this.immutableDDBB ]
      }
      if (txt_loadOK_l.length != 0 ) {
          this.immutableDDBB = [
              ... txt_loadOK_l.map(it => `<code style="color:blue;"><a href="${it.href}" target="_blank">${it.href}</a></code>, `),
              ... this.immutableDDBB ]
      }
      /*
       *  this.immutableDDBB looks like:
       *  index (== paragraph)    | paragraph
       *  0                       | ..... [[{topic1]]
       *  1                       | ...
       *  ...                     | ...
       *  100                     | ...   [[topic1}]]
       *  ^^^^
       *  block topic1 will have index 0 as start and index 100 as end.
       */
      this.paragraphN  = this.immutableDDBB.length;
      this.cacheResult = this.immutableDDBB.join("");
      this.buildTopicsDB()

    }

    grep( grep0, selectedCoordinatesByTopic , topicParentDepth, isTopicFilterAnd /* @ma */) {
      let selectedTopicsIds = [];
      Object.keys(selectedCoordinatesByTopic)
        .forEach( topicName => {
         const TC_id_d = selectedCoordinatesByTopic[topicName];
         Object.keys(TC_id_d)
           .filter(TC_id => { return (TC_id_d[TC_id]==true); })
           .forEach( TC_id => { selectedTopicsIds.push(TC_id); });
      });

      // REF: https://simonwillison.net/2004/Sep/20/newlines/
      // '.*' will never match multiline. Use [\s\S] instead
      const grepInput = grep0.input.replaceAll(/\ +/g,"[\\s\\S]*")
      if (!!! grepInput && selectedTopicsIds.length == 0) {
        // Nothing to do. Return cacheResult
        return this.cacheResult;
      }
      const grepRegex = new RegExp(grepInput, 'gim');
      let result_l = Array(this.paragraphN).fill(false);
      if (grepInput == "") {
          result_l = [...this.immutableDDBB];
      } else {
        for (let idx=0; idx < this.paragraphN; idx++) {
          const paragraphN = this.immutableDDBB[idx];
          let isMatch = paragraphN.match(grepRegex);
          if (!isMatch) continue;
          let start = idx - grep0.before;
          if (start < 0) start = 0;
          let end  = idx + grep0.after;
          if (end > this.paragraphN) end = this.paragraphN;
          for (let idx2 = start; idx2 <= end; idx2++) {
              if (idx2 == idx) {
                  result_l[idx] = paragraphN.replace( grepRegex, (str) => `<span class='grepMatch'>${str}</span>`);
              } else {
                  if (result_l[idx2] == false) {
                     result_l[idx2] = this.immutableDDBB[idx2];
                  }
              }
          }
        }
      }
      for (let idx=0; idx < this.paragraphN; idx++) {
        const current_row_false = !!result_l[idx];
        const    next_row_false = !!result_l[idx+1];
        if (current_row_false == false  && next_row_false == true ) {
            result_l[idx]="- grep block -------------------------------\n";
        }
      }

      const topicMatchingLines_l = this.topicsDB.getMatchingLinesForTopicCoord(
          this.paragraphN, selectedTopicsIds, topicParentDepth, isTopicFilterAnd)
      for (let idx = 0 ; idx < this.paragraphN; idx++) {
          if (topicMatchingLines_l[idx]==false) result_l[idx] = false;
      }
      const result = result_l.filter( row => (row != false) ).join("");
      // console.log(result)
      return result
    }

    isTopicClose(tc01, tc_ref_l /* topicCoordinate list */) {
       return this.topicsDB.isTopicClose(tc01, tc_ref_l)
    }
}

export {
  TXTDBEngine
}
