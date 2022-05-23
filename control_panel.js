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

    onGrepInputChanged = (inputEvent) => {
      if (this.state.timerDoFind !== null) {
        clearTimeout(this.state.timerDoFind)
      }
      this.state.timerDoFind = setTimeout(
        () => {
          this.state.grep[0].input = inputEvent.target.value
          const dbEngineOutput = this.txtDBEngine.grep(this.state.grep[0])
          this.setState ( { dbEngineOutput :  dbEngineOutput, grep : this.state.grep } )
        }, 200)
    }

    render( props ) {
      return html`
        grep:<input value='${this.state.grep[0].input}'
              onInput=${ (e) => this.onGrepInputChanged(e) } ></input>
        <hr/>
        ${this.state.dbEngineOutput}
      `;
    }
}

export{
  ControlPanel
}
