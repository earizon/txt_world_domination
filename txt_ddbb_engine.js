class TXTDBEngine  {

    constructor( payload ) {
        this.payload = payload
    }

    grep( grepInput ) {
        if (!!! grepInput ) return this.payload
        const result = 
            this.payload.split("\n").filter( lineN => {
                let isMatch = lineN.indexOf(grepInput) > 0
console.log(isMatch +","+ lineN)
                return isMatch
            })
        return result.join("\n")
    }
}

export{
  TXTDBEngine
}
