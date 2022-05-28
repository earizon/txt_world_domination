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
        const sInput = lineIn.substring(idx0+2,idx1).toLowerCase().replaceAll(" ","");
        const unchecked_topic_l = sInput.split(","),
                checked_topic_l = unchecked_topic_l
          .map( (uchktopic) => { return uchktopic.trim().replaceAll(" ","") } )
          .map( (uchktopic) => {
             while (uchktopic.endsWith(".")) {
                 uchktopic = uchktopic.substring(0,uchktopic.length-1) }
             return uchktopic
           })
          .filter( (uchktopic) => { return uchktopic != "" } )
        return checked_topic_l
      }

      const topic2BlockList = { /* key: topic, value: block_list */  } ;
      const BLCK0 = new Block( [0, this.inmutableDDBB.length-1], {}, null );
      const blockStack = [ ]
      const block_l = [ BLCK0 ]
      for (let lineIdx = 0; lineIdx < this.inmutableDDBB.length; lineIdx++) {
        const line = this.inmutableDDBB[lineIdx];
        if ( line.indexOf('[{]') >= 0 ) {
            blockStack.push( new Block ( [lineIdx], {}, blockStack.at(-1) ) )
        }
        const line_topic_l = parseTopicsInLine(line);
        line_topic_l.forEach(topic => {
            if (!!!topic2BlockList[topic]) { topic2BlockList[topic] = [] }
        })
        blockStack.forEach( block => { // For each block in stack add topics found in line
          line_topic_l.forEach ( topic => {
            if (! (topic in block.topic_d) ) {
                block.topic_d[topic] = block
                topic2BlockList[topic].push(block)
            }
            if (! (topic in BLCK0.topic_d) ) {
                BLCK0.topic_d[topic] = block
                topic2BlockList[topic].push(BLCK0)
            }
          })
        }) 

        if ( line.indexOf('[}]') >= 0 ) {
            const block = blockStack.pop()
            if (!!block) { block.bound.push(lineIdx) }
            block_l.push(block)
        }
      }
      this.BLCK0 = BLCK0;
console.dir(topic2BlockList)
      return topic2BlockList
    }

    constructor( payload ) {
        this.payload          = payload
        this.inmutableDDBB    = payload.split("\n")
        this.topicToBlockList = this.buildIndexes()

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
