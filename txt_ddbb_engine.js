class RingBuffer {

    constructor(length) {
      this.length = length 
      this.buffer = [] 
    }
    get   = function(){return this.buffer;}
    push  = function(item){
       if (this.buffer.length == this.length) { this.buffer.shift() }
       this.buffer.push(item)
    } 
    reset = function() { this.buffer = []; }
};

class TXTDBEngine  {

    constructor( payload ) {
        this.payload = payload
    }

    grep( grep0 ) {
      const grepInput = grep0.input
      if (!!! grepInput ) return this.payload
      const beforeRB        = new RingBuffer(grep0.before)
      const result = [];
      let afterPending = 0
      this.payload.split("\n").forEach( lineN => {
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

export{
  TXTDBEngine
}
