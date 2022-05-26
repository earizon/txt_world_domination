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

class TXTDBEngine  {

    parseTopicsInLine(lineIn) {
      const idx0 = lineIn.indexOf('[[') ; if (idx0 < 0) return []
      const idx1 = lineIn.indexOf(']]') ; if (idx1 < 0) return []
      if (idx0 > idx1) return []
      const sInput = lineIn.substring(idx0+2,idx1).toLowerCase().replaceAll(" ","");
      return sInput.split(",")
    }

    buildIndexes() {
      const topic2BlockList = { /* key: topic, value: block_list */  } 
      const BLCK0 = { bound: [0, this.inmutableDDBB.length-1], topic_d:{}, parent: null }
      const blockStack = [ ]
      const block_l = [ BLCK0 ]
      for (let lineIdx = 0; lineIdx < this.inmutableDDBB.length; lineIdx++) {
        const line = this.inmutableDDBB[lineIdx];
        if ( line.indexOf('[{]') >= 0 ) {
            blockStack.push( { bound: [lineIdx], topic_d:{}, parent: blockStack[blockStack.length-1]} )
        }
        const line_topic_l = this.parseTopicsInLine(line);
        line_topic_l.forEach(topic => {
            if (!!!topic2BlockList[topic]) { topic2BlockList[topic] = [] }
        })
        blockStack.forEach( block => {
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
