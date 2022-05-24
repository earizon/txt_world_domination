// import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { html, Component, render } from './preact.standalone.module.js';

import { TXTDBEngine } from './txt_ddbb_engine.js';

class ControlPanel extends Component {

    state = {
      timerDoFind : 0,
      dbEngineOutput : "",
      grep : [ { input: "", before: 5, after: 5 } ]
    }

    constructor({ payload }) {
      super({ payload });
      this.state.dbEngineOutput = payload
      this.txtDBEngine = new TXTDBEngine(payload)
      new TXTDBEngine(payload)
    }

    onGrepInputChanged = () => {
      if (this.state.timerDoFind !== null) {
        clearTimeout(this.state.timerDoFind)
      }
      this.state.timerDoFind = setTimeout(
        () => {
          const dbEngineOutput = this.txtDBEngine.grep(this.state.grep[0])
          this.setState ( { dbEngineOutput : dbEngineOutput } )
        }, 200)
    }

    onGrepRegexChanged = (inputEvent) => {
      this.state.grep[0].input = inputEvent.target.value
      this.onGrepInputChanged()
    }

    doTxtPreProcessing = (input) => {
       let H = input
       // NEXT) replace html scape chars 
    // H = H.replaceAll('<','&lt;') 
    //      .replaceAll('>','&gt;')
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

    componentDidMount() { this.componentDidUpdate() }

    componentDidUpdate = () => {
      document.getElementById("dbEngineOutput").innerHTML =
           this.doTxtPreProcessing(this.state.dbEngineOutput)
    }

    setGrepBound = (flag, delta) => {
      if ( flag == 'b'/*before*/ ) this.state.grep[0].before += delta
      if ( flag == 'a'/*after */ ) this.state.grep[0].after  += delta
      this.setState ( { grep : this.state.grep } )
      this.onGrepInputChanged()
    }
    render( props ) {
      return html`
        grep:
          <span onClick=${ (e) => this.setGrepBound('b',-1)}>-</span>
          ${this.state.grep[0].before}
          <span onClick=${ (e) => this.setGrepBound('b',+1)}>+</span>
            <input value='${this.state.grep[0].input}'
              onInput=${ (e) => this.onGrepRegexChanged(e) } >
             </input>${this.state.after}
          <span onClick=${ (e) => this.setGrepBound('a',-1)}>-</span>
          ${this.state.grep[0].after }
          <span onClick=${ (e) => this.setGrepBound('a',+1)}>+</span>
      `;
    }
}

export{
  ControlPanel
}
