class RingBuffer {

    constructor(length) {
      this.length = length 
      this.pointer = 0
      this.buffer = [] 
    }

    // https://stackoverflow.com/questions/1583123/circular-buffer-in-javascript
    
    get   = function(){return this.buffer.slice(0,this.pointer+1)};
    push  = function(item){
       this.buffer[this.pointer] = item;
       this.pointer = (this.length + this.pointer +1) % this.length;
    } 
    reset = function() { this.buffer = []; this.pointer = 0; }

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
              result.push("<<<")
            }
        }
        if (isMatch) {
           result.push(">>>")
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
