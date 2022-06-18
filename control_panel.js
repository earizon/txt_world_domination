// import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { html, Component } from './preact.standalone.module.js';

import { TXTDBEngine } from './txt_ddbb_engine.js';

class Topic extends Component {

    state = {
      TC_id_selected : { /*topic coord.id selected: bool*/ }
    }

    constructor( CP /* CP: "parent" Control Pannel */) {
        super(); 
        this.CP = CP;
    }

    tcSwitch(TC_id, e) {
        e.stopImmediatePropagation();
        const TC_id_l = this.props.CP.txtDBEngine.topicBlockDB.getSubtopicsIDList(TC_id);
        const newState = ! this.state.TC_id_selected[TC_id_l[0]];
        TC_id_l.forEach( (TC_id_i) => {
          this.state.TC_id_selected[TC_id_i] = newState;
        });
        this.setState({ TC_id_selected : this.state.TC_id_selected });
        this.props.CP.onTopicCoordOnOff(this.props.topicName, this.state.TC_id_selected);
    }

    render( { topicName, topicCoord_id_l } ) {
      return (html`
        <pre class="topicClass">
        <div class="topic">${topicName}</div>:
        ${ topicCoord_id_l.map( (TC_id) => {
           return html`[<span key=${TC_id} class='${this.state.TC_id_selected[TC_id]?"selected":""}'
              onclick=${(e) => this.tcSwitch(TC_id,e)} >
              ${TC_id.replace(topicName+".","")}</span>]` 
           } )
        }
        </pre>`
      ); 
    }
}

class ControlPanel extends Component {

    static thisPtr;
    injected_TC_id_selected = {} // injected_TC_id_selected is by childen component's UI-state.
                                 // It's not part of this component state, but injected/updated
                                 // by its children.

    state = {
      timerDoFind      : 0,
      showTopics       : true,
      showLineNumbers  : false,
      grep             : [ { input: "", before: 5, after: 5 } ],
      topicParentDepth : 0,
      showIndex        : true 
    }

    getIndexTable = () => {
       const result = []
       this.txtDBEngine.indexRoot.children.forEach( (entry) => {
         result.push(`${entry.txt_line}, ${entry.lineNumber}`);
         entry.children.forEach( (entry2) => {
           result.push(`  ├─ ${entry2.txt_line}, ${entry2.lineNumber}`);
         }) 
       })
       return result;
    }

    switchTopicView = ()=> { 
        this.setState ( { showTopics: !this.state.showTopics } );
    }

    switchIndexView = ()=> { 
        this.setState ( { showIndex: !this.state.showIndex } );
    }

    setTopicMatchDepth(inc) {
        if (inc==-1 && this.state.topicParentDepth == 0) return;
        this.setState ( {topicParentDepth:  this.state.topicParentDepth + inc } );

        this.execSearch();
    }

    constructor({ url_txt_source }) {
      super({ url_txt_source });
      this.txtDBEngine = new TXTDBEngine(url_txt_source);
      ControlPanel.thisPtr = this;
    }

    async componentDidMount() {
      const thisPtr = this;
      const auxFunc = async () => {
        await this.txtDBEngine.init(this.state.showLineNumbers);
        this.execSearch();
        this.setState({ showTopics: this.state.showTopics});
        setTimeout(auxFunc, 50000000);
      };
      auxFunc();
    }

    execSearch = () => {
      if (this.state.timerDoFind !== null) { clearTimeout(this.state.timerDoFind) }
      this.state.timerDoFind = setTimeout(
        () => {
          document.getElementById("dbEngineOutput").innerHTML = 
                this.txtDBEngine.grep(this.state.grep[0], this.injected_TC_id_selected, this.state.topicParentDepth)
        }, 400)
    }

    onGrepRegexChanged = (inputEvent) => {
      this.state.grep[0].input = inputEvent.target.value
      this.execSearch()
    }

    onTopicCoordOnOff(topicName, TC_id_selected) {
      ControlPanel.thisPtr.injected_TC_id_selected[topicName] = TC_id_selected; 
      ControlPanel.thisPtr.execSearch();
    }

    lpad = function(value, padding) {
    // https://stackoverflow.com/questions/10841773/javascript-format-number-to-day-with-always-3-digits
      var zeroes = new Array(padding+1).join("0");
      return (zeroes + value).slice(-padding);
    }

    setGrepBounds = (flag, delta) => {
      if ( flag == 'b'/*before*/ ) this.state.grep[0].before += delta
      if ( this.state.grep[0].before < 0 ) this.state.grep[0].before = 0
      if ( flag == 'a'/*after */ ) this.state.grep[0].after  += delta
      if ( this.state.grep[0].after < 0 ) this.state.grep[0].after = 0
      this.setState ( { grep : this.state.grep } )
      this.execSearch()
    }

    async switchShowLineNum() {
      await this.txtDBEngine.init(!this.state.showLineNumbers);
      this.setState({ showLineNumbers : !this.state.showLineNumbers});
      this.execSearch();
    }

    render( props ) {
      return ( 
       html`
       <span onClick=${ (e) => this.setGrepBounds('b',+1)}>[+]</span>
       ${this.lpad(this.state.grep[0].before,3)}
       <span onClick=${ (e) => this.setGrepBounds('b',-1)}>[-]</span>
         <input value='${this.state.grep[0].input}' placeholder='grep'
           onInput=${ (e) => this.onGrepRegexChanged(e) } >
         </input>${this.state.after}
        <span onClick=${ (e) => this.setGrepBounds('a',-1)}>[-]</span>
        ${this.lpad(this.state.grep[0].after,3)}
        <span onClick=${ (e) => this.setGrepBounds('a',+1)}>[+]</span><span>   </span>
        <span onClick=${ (e) => this.switchShowLineNum() }
          class='${this.state.showLineNumbers?"selected":""}'>[Line Number]</span>
        <br/>
          ${ this.state.showTopics &&
             html`
               <span onclick=${() => this.switchTopicView()}>[- hide topics]</span>
               <span>  </span>Match parents up to:
                 <span onClick=${ (e) => this.setTopicMatchDepth(-1)}>[-]</span>
                 ${this.state.topicParentDepth}
                 <span onClick=${ (e) => this.setTopicMatchDepth(+1)}>[+]</span>
                ───────────<br/>

               ${ this.txtDBEngine.topicsDB.getDimensionList()
                  .map( (dimI) => { 
                      return html`<${Topic}
                      CP=${this}
                      key=${dimI}
                      topicName=${dimI}
                      topicCoord_id_l=${this.txtDBEngine.topicsDB.getCoordForDim(dimI)}
                      onTopicCoordOnOff=${this.onTopicCoordOnOff}
                      //>
                      ` 
                  })
               }
             `
          }
          ${ ! this.state.showTopics && 
             html`<span onclick=${() => this.switchTopicView()}>
                  [+ show topics] ──────────────────────────────</span>`
          }
          ${ this.state.showIndex && 
             html`
               <span onclick=${() => this.switchIndexView()}>[- hide Index]</span>
               <span>──────────────────────────────</span><br/>
               ${ this.getIndexTable().map( (line) => {
                    return html`${line}<br/>`
                })
               }
             `
            }
          ${ ! this.state.showIndex && 
             html`<span onclick=${() => this.switchIndexView()}>[+ show index]</span>
               <span>──────────────────────────────</span>`
          }
      `);
    }
}

export{
  ControlPanel
}
