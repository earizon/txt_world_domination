// import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { html, Component, render } from './preact.standalone.module.js';


function doSearch(grepInput) {
    alert(grepInput)
}

class ControlPanel extends Component {

    state = {
      grepInput   : "",
      timerDoFind : 0
    }

    constructor({ grepInput }) {
      super({ grepInput });
      this.state.grepInput = grepInput
    }

    onGrepInputChanged = (inputEvent) => {
      if (this.state.timerDoFind !== null) {
        clearTimeout(this.state.timerDoFind)
      }
      this.state.timerDoFind = setTimeout(() => doSearch(inputEvent.target.value), 1000)
    }

    render( props ) {
      return html`
        grep: <input value='${this.state.grepInput}' onInput=${ (e) => this.onGrepInputChanged(e) } ></input>
      `;
    }
}

export{
  ControlPanel
}
