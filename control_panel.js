// import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { html, Component } from './preact.standalone.module.js';

import { TXTDBEngine } from './txt_ddbb_engine.js';

class Topic extends Component {

    constructor( { CP } /* CP: "parent" Control Pannel */) {
        super();
        this.CP = CP;
    }

    tcSwitch(TC_id, e) {
        e.stopImmediatePropagation();
        const TC_id_l = this.props.CP.txtDBEngine.topicsDB.getSubtopicsIDList(TC_id);
        const newState = ! this.CP.state.TC_id_selected[TC_id_l[0]];
        TC_id_l.forEach( (TC_id_i) => {
          this.CP.state.TC_id_selected[TC_id_i] = newState;
        });
        this.setState({ TC_id_selected : this.CP.state.TC_id_selected });
        this.props.CP.onTopicCoordOnOff(this.props.topicName, this.CP.state.TC_id_selected);
        this.CP.updateHideCtrPanelTimeout();
    }

    render( { topicName, topicCoord_id_l } ) {
      return (html`
        <div class="topicClass">
        <div class="topic">${topicName}</div>
        ${ topicCoord_id_l.map( (TC_id) => {
           return html`<div key=${TC_id} class='topicButtom ${this.CP.state.TC_id_selected[TC_id]?"selected":""}'
              onclick=${(e) => this.tcSwitch(TC_id,e)} >
              ${TC_id.replace(topicName+".","")}</div>`
           } )
        }
        </div>`
      );
    }
}

class ControlPanel extends Component {
    static isFirstRender = true;
    static thisPtr;
    static topicToRemoveRegex = /\[\[[^\]]*\]\]/g
    state = {
      timerDoFind      : 0,
      showSettings     : false,
      showTopics       : false,
      grep             : [ { input: "", before: 1, after: 1 } ],
      topicParentDepth : 0,
      showIndex        : false,
      hideCtrPanel     : true,
      TC_id_selected   : { /*topic coord.id selected: bool*/ },
      timerHideCtrPanel: 0
    }

    const
    refreshIndexTableAsHTML = (newState) => {
      const idxTable=document.getElementById("idTableIndex")
      idxTable.innerText = "";
      if (newState == false) { return; }

      document.querySelectorAll(".h_anchor").forEach( anchorEl => {
        if (["H1","H2"].indexOf(anchorEl.tagName)>=0) {
           const H = anchorEl.cloneNode(true)
           H.classList=[anchorEl.tagName]
           H.innerText = anchorEl.innerText
           const A = document.createElement("A");
                 A.setAttribute("href", "#"+H.id);
                 A.innerHTML = H.innerHTML.replaceAll(ControlPanel.topicToRemoveRegex,"")
           H.id = ""
           H.innerHTML = ""
           H.append(A)
           idxTable.append(H)
        }
      })
    }

    showRule = () => { return true; }
    showSubMenu = () => {
      return this.state.showSettings ||
             this.state.showTopics   ||
             this.state.showIndex
    }

    updateHideCtrPanelTimeout = () => {
        this.resetHideCtrPanelTimeout()
        let thisPtr = this;
        // timeout must match #progressBarTimer.timeout animation
        let timer = setTimeout(thisPtr.switchCtrPanelView, 20*1000)
        setTimeout( () => {
          thisPtr.setState ( { timerHideCtrPanel   :  timer } )
        }, 100);
    }
    resetHideCtrPanelTimeout = () => {
      if (this.state.timerHideCtrPanel != 0) {
        clearTimeout(this.state.timerHideCtrPanel)
        this.setState ( { timerHideCtrPanel   : 0 } );
      }
    }
    switchSettingsView = () => {
        this.resetHideCtrPanelTimeout()
        const newState =  !this.state.showSettings;
        this.setState ( { showSettings: newState } );
        this.setState ( { showTopics: this.state.showTopics && !newState } );
        this.setState ( { showIndex : this.state.showIndex  && !newState } );
    }
    switchTopicView = ()=> {
        this.resetHideCtrPanelTimeout()
        const newState =  !this.state.showTopics;
        this.setState ( { showTopics  : newState } );
        this.setState ( { showSettings: this.state.showSettings && !newState } );
        this.setState ( { showIndex   : this.state.showIndex    && !newState } );
    }
    switchIndexView = ()=> {
        this.resetHideCtrPanelTimeout()
        const newState =  !this.state.showIndex;
        this.setState ( { showIndex   : newState } );
        this.setState ( { showSettings: this.state.showSettings  && !newState } );
        this.setState ( { showTopics  : this.state.showTopics && !newState } );
        this.refreshIndexTableAsHTML()
    }
    switchCtrPanelView = ()=> {
        this.resetHideCtrPanelTimeout()
        this.setState ( { timerHideCtrPanel   : 0 } );
        const newState = !this.state.hideCtrPanel;
        this.setState ( { hideCtrPanel   : newState } );
        this.setState ( { showSettings   : this.state.showSettings  && newState } );
        this.setState ( { showTopics     : this.state.showTopics && newState } );
        this.setState ( { showIndex      : this.state.showIndex  && newState } );
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

    switchRulesOnOff = () => {
        this.setState ( { settings_ruleOnOff : !this.state.settings_ruleOnOff });
    }

    switchFontSize = ()=> {
        const new_value = this.state.settings_fontsize == 4 ? 0 : this.state.settings_fontsize+1;
        this.setState ( { settings_fontsize : new_value });
        document.getElementById("dbEngineOutput")
            .setAttribute("fontSize","s"+new_value);
    }

    switchMarging = ()=> {
        const new_value = this.state.margin == 5 ? 0 : this.state.margin+1;
        this.setState ( { margin : new_value });
        document.body.setAttribute("margin","margin"+new_value);
    }



    setTopicMatchDepth(inc) {
        if (inc==-1 && this.state.topicParentDepth == 0) return;
        this.setState ( {topicParentDepth:  this.state.topicParentDepth + inc } );

        this.execSearch();
    }

    constructor({ url_txt_source_csv }) {
      super({ url_txt_source_csv });
      window.document.title = url_txt_source_csv.split(",")
                              .map(URL => {
                                URL.split("/").pop().replaceAll(/[.][^.]*$/g,"")
                              }).join(" ")
      // Arbitrarely we take last file for in CSV list for file extension
      // TODO:(0) Improve
      this.file_ext_upper   = url_txt_source_csv.split(".").pop().toUpperCase()
      this.txtDBEngine = new TXTDBEngine( url_txt_source_csv );
      this.timerRefresh = 0;
      this.state.settings_secsRefreshInterval = 3600;
      this.state.settings_font = 1;
      this.state.color_style = 1;
      this.state.bckg_texture = 1;
      this.state.settings_lineheight = 1;
      this.state.settings_fontsize = 1;
      this.state.margin = 0;
      this.state.settings_showbaseline = false;
      this.state.settings_ruleOnOff = true;
      ControlPanel.thisPtr = this;
      // Add Keyboard sortcuts
      window.document.body
        .addEventListener('keyup', (e) => {
            if (e.key == "Escape") {
                ControlPanel.thisPtr.switchCtrPanelView();
            }
        });
      document.getElementById("dbEngineOutput")
        .onclick=() => {
          if (ControlPanel.thisPtr.state.hideCtrPanel) {
            ControlPanel.thisPtr.switchCtrPanelView(); 
          }
        }
    }

    async componentDidMount() {
      const thisPtr = this;
      const auxFunc = async () => {
        await this.txtDBEngine.init();
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
                this.txtDBEngine.grep(this.state.grep[0], this.state.TC_id_selected, this.state.topicParentDepth)
          if (ControlPanel.isFirstRender) {
            ControlPanel.isFirstRender = false;
            setTimeout(this.switchIndexView, 1);
          }
          if (this.state.showIndex == true) {
            this.refreshIndexTableAsHTML()
          }
        }, 400)

    }


    onGrepRegexChanged = (inputEvent) => {
      // No need for timer. It ends up calling execSearch that already contains it.
      this.state.grep[0].input = inputEvent.target.value
      this.execSearch()
    }

    onUpdateTimeChanged = (inputEvent) => {
      this.state.settings_secsRefreshInterval = inputEvent.target.value;
      clearTimeout(this.timerRefresh);
      this.componentDidMount();
    }

    onTopicCoordOnOff(topicName, TC_id_selected) {
      ControlPanel.thisPtr.state.TC_id_selected[topicName] = TC_id_selected;
      ControlPanel.thisPtr.execSearch();
    }

    lpad = function(value, padding) {
    // https://stackoverflow.com/questions/10841773/javascript-format-number-to-day-with-always-3-digits
      var zeroes = new Array(padding+1).join("0");
      return (zeroes + value).slice(-padding);
    }

    setGrepBounds = (flag, delta) => {
      if ( flag == 'b'/*before*/ && this.state.grep[0].before >9 ) { delta = delta * 10 }
      if ( flag == 'a'/*before*/ && this.state.grep[0].after  >9 ) { delta = delta * 10 }
      if ( flag == 'b'/*before*/ ) this.state.grep[0].before += delta
      if ( this.state.grep[0].before < 0 ) this.state.grep[0].before = 0
      if ( flag == 'a'/*after */ ) this.state.grep[0].after  += delta
      if ( this.state.grep[0].after < 0 ) this.state.grep[0].after = 0
      this.setState ( { grep : this.state.grep } )
      this.execSearch()
    }

    render( props ) {
      return (
       html`
       <div id="rule1" class='${!this.state.settings_ruleOnOff && html`off`}  '>
       </div>

       <div id="nonFixedMenu" style="display: ${this.showSubMenu() ? "": "none"}">
          ${ this.state.showSettings &&
             html`
             <div id="idSettingsMenu">
               Refresh content source every:
               <input style='width:3em; text-align:right;' value='${this.state.settings_secsRefreshInterval}' placeholder='update time'
                   onInput=${ (e) => this.onUpdateTimeChanged(e) } >
               </input> secs <br/>
               ● Font: <span class="button2" onClick=${() => this.switchTypeWritterFont() }>type ${this.state.settings_font}/5</span>
                <span class="button2" onClick=${() => this.switchFontSize()        }>size ${this.state.settings_fontsize}/4</span>
                 <br/>
               ● Style: <span class="button2" onClick=${() => this.switchBackground()      }>BCK ${this.state.bckg_texture}/4</span>
                 <span class="button2" onClick=${() => this.switchColorStyle() }>Color ${this.state.color_style}/6</span>
               <br/>
               ● Line: <span class="button2" onClick=${() => this.switchLineHeight()      }>height ${this.state.settings_lineheight}/4</span><br/>
               ● Margin: <span class="button2" onClick=${() => this.switchMarging()       }>Margin ${this.state.margin}/5</span><br/>
               ● Rules: <span class="button2 ${this.state.settings_ruleOnOff && html`selected`}" onClick=${() => this.switchRulesOnOff()      }>Switch ON/OFF</span><br/>
             </div>
             `
          }
          ${ this.state.showTopics &&
             html`
               <div id="idTableTopics" size=s2>
                 <div id="progressBarTimer" val="${this.state.timerHideCtrPanel}" class="${(this.state.timerHideCtrPanel!=0)?'timeout':''}"></div>
               <span>  </span>Match parent blocks up to:
                 <span class="buttonCompact" onClick=${ (e) => this.setTopicMatchDepth(-1)}>-</span>
                 ${this.state.topicParentDepth}
                 <span class="buttonCompact" onClick=${ (e) => this.setTopicMatchDepth(+1)}>+</span>
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
               </div>
             `
          }
          <div id="idTableIndex" style="display:${this.state.showIndex?"":"none"}" size=s2></div>
          </div>
          <div id="fixedMenu">
              ${ this.state.hideCtrPanel == true &&
              html`
              <span id="fixesMenu01">
                <span id="grepMenu">
                  <span class="buttonCompact" onClick=${ (e) => this.setGrepBounds('b',+1)}>↑</span>
 
                  <span class="grepState">${this.lpad(this.state.grep[0].before,2)}</span>
                  <span class="buttonCompact" onClick=${ (e) => this.setGrepBounds('b',-1)}>↓</span>
                  <input value='${this.state.grep[0].input}' placeholder='search' id='idGrepInput' onInput=${ (e) => this.onGrepRegexChanged(e) } >
                    </input>${this.state.after}
                   <span class="buttonCompact" onClick=${ (e) => this.setGrepBounds('a',-1)}>↑</span>
                   <span class="grepState">${this.lpad(this.state.grep[0].after,2)}</span>
                   <span class="buttonCompact" onClick=${ (e) => this.setGrepBounds('a',+1)}>↓</span>
                 </span>
                 <br/>
              </span>` }
              <span class="button ${this.state.hideCtrPanel?'selected':''}" 
                    onClick=${() => this.switchCtrPanelView()}  
                    id="hideButtom"    >◂</span>
              <span class="button ${this.state.showIndex   ?'selected':''}" 
                    onClick=${() => this.switchIndexView()   }
                    id="indexButton"   >≣</span>
              <span class="button ${this.state.showTopics  ?'selected':''}" 
                    onClick=${() => this.switchTopicView()   }
                    id="topicsButton"  >∷</span>
              <span class="button ${this.state.showSettings?'selected':''}" 
                    onClick=${() => this.switchSettingsView()} 
                    id="settingsButton">⚙</span>
           </div>
       `
       );
    }
}

export{
  ControlPanel
}
