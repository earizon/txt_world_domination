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
        const TC_id_l = this.props.CP.txtDBEngine.topicsDB.getSubtopicsIDList(TC_id);
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
              ${TC_id.replace(topicName+".","")}</span>] `
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
    menuSize2Icon = {
      1 : "▾▹▵",
      2 : "▿▸▵",
      3 : "▿▹▴",
    }

    state = {
      timerDoFind      : 0,
      showSettings     : false,
      showTopics       : false,
      showLineNumbers  : false,
      grep             : [ { input: "", before: 5, after: 5 } ],
      topicParentDepth : 0,
      showIndex        : false
    }

    getIndexTableAsHTML = () => { // @ma
      const idxTable=document.createElement("div")
      document.querySelectorAll(".anchor").forEach( anchorEl => {
         const parentTag = anchorEl.parentElement
console.log(`parentTag.tagName ${parentTag.tagName}` )
         if (parentTag.tagName=="H1") {
            idxTable.append(parentTag)
         }
      })
      window.debug=idxTable
      return "TODO"
    }

    showSubMenu = () => {
      return this.state.showSettings ||
             this.state.showTopics   ||
             this.state.showIndex
    }
    switchSettingsView = () => {
        const newState =  !this.state.showSettings;
        this.setState ( { showSettings: newState } );
        this.setState ( { showTopics: this.state.showTopics && !newState } );
        this.setState ( { showIndex : this.state.showIndex  && !newState } );
    }
    switchTopicView = ()=> {
        const newState =  !this.state.showTopics;
        this.setState ( { showTopics  : newState } );
        this.setState ( { showSettings: this.state.showSettings && !newState } );
        this.setState ( { showIndex   : this.state.showIndex    && !newState } );
    }
    switchIndexView = ()=> {
        const newState =  !this.state.showIndex;
        this.setState ( { showIndex   : newState } );
        this.setState ( { showSettings: this.state.showSettings  && !newState } );
        this.setState ( { showTopics  : this.state.showTopics && !newState } );
    }

    switchTypeWritterFont = ()=> {
        const new_value = this.state.settings_font == 5 ? 0 : this.state.settings_font+1;
        this.setState ( { settings_font : new_value });
        document.getElementById("dbEngineOutput")
            .setAttribute("font","font"+new_value);
    }

    switchColorStyle = ()=> {
        const new_value = this.state.color_style == 6 ? 1 : this.state.color_style+1;
        this.setState ( { color_style : new_value });
        document.getElementById("dbEngineOutput")
            .setAttribute("colorstyle","s"+new_value);
    }


    switchBackground = ()=> {
        const new_value = this.state.bckg_texture == 4 ? 1 : this.state.bckg_texture+1;
        this.setState ( { bckg_texture : new_value });
        document.getElementById("dbEngineOutput")
            .setAttribute("background","b"+new_value);
    }


    switchLineHeight = ()=> {
        const new_value = this.state.settings_lineheight == 4 ? 1 : this.state.settings_lineheight+1;
        this.setState ( { settings_lineheight : new_value });
        document.getElementById("dbEngineOutput")
            .setAttribute("lineheight","height"+new_value);
    }

    switchFontSize = ()=> {
        const new_value = this.state.settings_fontsize == 4 ? 0 : this.state.settings_fontsize+1;
        this.setState ( { settings_fontsize : new_value });
        document.getElementById("dbEngineOutput")
            .setAttribute("fontSize","s"+new_value);
    }

    switchLineBreak = ()=> {
        this.setState ( { settings_linebreak : !this.state.settings_linebreak });
        document.getElementById("dbEngineOutput")
            .setAttribute("linebreak",`${!!!this.state.settings_linebreak}`);
    }

    setTopicMatchDepth(inc) {
        if (inc==-1 && this.state.topicParentDepth == 0) return;
        this.setState ( {topicParentDepth:  this.state.topicParentDepth + inc } );

        this.execSearch();
    }

    constructor({ url_txt_source }) {
      super({ url_txt_source });
   // const aux = url_txt_source.lastIndexOf("..")>0
   // window.document.title = aux>=0 ? url_txt_source.substring(aux+3) : url_txt_source
      window.document.title = url_txt_source.split("/").pop()
      this.txtDBEngine = new TXTDBEngine(url_txt_source);
      this.timerRefresh = 0;
      this.state.settings_secsRefreshInterval = 3600;
      this.state.settings_font = 1;
      this.state.color_style = 1;
      this.state.bckg_texture = 1;
      this.state.settings_lineheight = 1;
      this.state.settings_fontsize = 2;
      this.state.settings_showbaseline = false;
      this.state.settings_linebreak = false;
      this.state.showSettings = true;
      ControlPanel.thisPtr = this;
    }

    async componentDidMount() {
      const thisPtr = this;
      const auxFunc = async () => {
        await this.txtDBEngine.init(this.state.showLineNumbers);
        this.execSearch();
        this.setState({ showTopics: this.state.showTopics});
        this.timerRefresh = setTimeout(auxFunc, this.state.settings_secsRefreshInterval*1000);
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

    onUpdateTimeChanged = (inputEvent) => {
      this.state.settings_secsRefreshInterval = inputEvent.target.value;
      clearTimeout(this.timerRefresh);
      this.componentDidMount();
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
       <div id="nonFixedMenu" style="display: ${this.showSubMenu() ? "": "none"}">
          ${ this.state.showSettings &&
             html`
               <span>  ● Refresh content source every </span>
               <input style='width:3em; text-align:right;' value='${this.state.settings_secsRefreshInterval}' placeholder='update time'
                   onInput=${ (e) => this.onUpdateTimeChanged(e) } >
               </input> secs <br/>
               <span>  ● Font: <span onClick=${() => this.switchTypeWritterFont() }>[type ${this.state.settings_font}]</span> </span>
               <span>, <span onClick=${() => this.switchFontSize()        }>[size ${this.state.settings_fontsize}]</span> </span><br/>
               <span>  ● Style: <span onClick=${() => this.switchBackground()      }>[BCK ${this.state.bckg_texture}]</span> </span>
               <span>, <span onClick=${() => this.switchColorStyle() }>[Color ${this.state.color_style}]</span> </span> <br/>
               <span>  ● Line: <span onClick=${() => this.switchLineHeight()      }>[height ${this.state.settings_lineheight}]</span> </span>
               <span>, <span onClick=${() => this.switchLineBreak()}  class='${this.state.settings_linebreak?"selected":""}'>[line break]</span> </span><br/>
             `
          }
          ${ this.state.showTopics &&
             html`
               <pre id="idTableTopics" size=s2>
               <span>  </span>Match parents up to:
                 <span onClick=${ (e) => this.setTopicMatchDepth(-1)}>[-]</span>
                 ${this.state.topicParentDepth}
                 <span onClick=${ (e) => this.setTopicMatchDepth(+1)}>[+]</span>
                <br/>

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
               </pre>
             `
          }
          ${ this.state.showIndex &&
             html`
               <pre id="idTableIndex" size=s2>
                  ${this.getIndexTableAsHTML()}
               </pre>
             `
            }
          </div>
          <div id="fixedMenu">
            <span id="grepMenu">
            <span class="buttonCompact" onClick=${ (e) => this.setGrepBounds('b',+1)}>+</span>
            ${this.lpad(this.state.grep[0].before,2)}
            <span class="buttonCompact" onClick=${ (e) => this.setGrepBounds('b',-1)}>-</span>
              ▲<input value='${this.state.grep[0].input}' placeholder='search' id='idGrepInput' onInput=${ (e) => this.onGrepRegexChanged(e) } >
              </input>▼${this.state.after}
             <span class="buttonCompact" onClick=${ (e) => this.setGrepBounds('a',-1)}>-</span>
             ${this.lpad(this.state.grep[0].after,2)}
             <span class="buttonCompact" onClick=${ (e) => this.setGrepBounds('a',+1)}>+</span>
             <span> </span>
             <span onClick=${ (e) => this.switchShowLineNum() }
               class='buttonCompact ${this.state.showLineNumbers?"selected":""}'> # Line </span>
            </span>
          ${ html `<span class="button ${this.state.showSettings?'selected':''}" onClick=${() => this.switchSettingsView()} >⚙</span> ` }
          ${ html `<span class="button ${this.state.showTopics  ?'selected':''}" onClick=${() => this.switchTopicView()   } >∷</span> ` }
          ${ html `<span class="button ${this.state.showIndex   ?'selected':''}" onClick=${() => this.switchIndexView()   } >≣</span>` }
          </div>
      `);
    }
}

export{
  ControlPanel
}
