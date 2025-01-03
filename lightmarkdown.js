const debug_latex=true
const debug_pre=true
const QUOT/*ationMark*/='ºq '


// REF: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions#about-writing-mathematical-expressions
let sRETexInline="[$]"                     // RegEx starts with a '$'
    sRETexInline=sRETexInline+"([^$]+)"    // It continues until finding another '$'
                                           // (matching anything that is not $$)
    sRETexInline=sRETexInline+"[$]"        // and ends including the $
if (debug_latex) { console.log("RegeExg_TeX Inline: "+sRETexInline); }
const RE_TeX_INLINE=new RegExp(sRETexInline,"g")

let sRETexBlock="[$][$]"                     // RegEx starts with a '$$'
    sRETexBlock=sRETexBlock+"([^$][^$]+)"   // It continues until finding another '$$'
                                             // (matching anything that is not $$)
    sRETexBlock=sRETexBlock+"[$][$]"        // and ends including the $$
if (debug_latex) { console.log("RegeExg_TeX Block: "+sRETexBlock); }
const RE_TeX_BLOCK=new RegExp(sRETexBlock,"g")

// A single empty line delimits paragraphs
const PARAGRAPH_MARK_REGEX=/^\n/gm
function _00_documentCleaning(md, relative_path){

  // NEXT) Replace external link <http...> link

  // NEXT) Clean/replace conflictive chars.
  md = md
         .replaceAll('<!--'   ,'º[!--' ) // TODO:(document) No native HTML allowed
         .replaceAll('-->'    ,'--]º' ) // except comments, since '<'... '>' is 
         .replaceAll('<br/>'  ,'º[br/]º' )
         .replaceAll('<br>'   ,'º[br/]º' )
         .replaceAll('<hr/>'  ,'º[hr/]º' )
         .replaceAll('<hr xxl/>'  ,'º[hr xxl/]º' )
         .replace(/\<((https?|\.\/).*[^>\n]+)\>/g," º[a target='_blank' href='$1']º$1º[/a]º ")
         .replaceAll(/^[>] /mg,QUOT   )
         .replaceAll('<'      ,'&lt;' ) // always replaced.
         .replaceAll('>'      ,'&gt;' )
         .replaceAll(/^[-] /mg,'* '   )
  //     .replaceAll(/  $/mg,'<br/>'  ) <·· Commented. 
  return md
}

const funReplaceHeader = function(match, m1){
  const CLEAN_BUILD_ID_REGEX_0=new RegExp('\\[\\[([^\\[])*\\]\\]' , 'g');
  const CLEAN_BUILD_ID_REGEX_1=new RegExp('[^",a-z\,A-Z,0-9,_,\']', 'g');
  const tag = match.startsWith("# "     ) ? "h1"
            : match.startsWith("## "    ) ? "h2"
            : match.startsWith("### "   ) ? "h3"
            : match.startsWith("#### "  ) ? "h4"
            : match.startsWith("##### " ) ? "h5"
            : match.startsWith("###### ") ? "h6"
            : ""
  if (tag === "") return match
  const id=match
    .replace(CLEAN_BUILD_ID_REGEX_0, '')
    .replace(CLEAN_BUILD_ID_REGEX_1, '')
    .replaceAll('"', '') // for some weird reason '"' is not replaced by regex.
  const result = `<${tag} class='h_anchor' id='${id}'>${m1.trim()}</${tag}>\n`;
  return result
}

const REGEX_MAYBE_IS_TABLE=/^[|][^|]+[|].*\n[|][^|]+[|]/gs
function handleTables(p/*aragraph*/) {
  if (! (p.match(REGEX_MAYBE_IS_TABLE) /*table*/)) { return p; }

  p = p.trim()
  const  tableStart = '<table cellspacing="0"><tbody>', tableEnd = '</tbody></table>',
           rowStart = '<tr>'          ,   rowEnd = '\n</tr>',
          headStart = '<th>'          ,  headEnd = '\n</th>',
           colStart = '<td>'          ,   colEnd = '\n</td>';
  /*                                                ^^
   * Adding a "next line" help to parse properly other elements inside
   * the <tr>,<th>,<td> (TeX expressions for example).
   */
  const row_l = p.split('\n')
  let content = '';
  for (let i=0; i < row_l.length; i += 1) {
    let i_res = row_l[i]
    let column_l = i_res.split('|')
    let k = 0
    let inner = ''
    for (k; k < column_l.length; k += 1) {
      if (k == 0) {continue;}
      let k_res = column_l[k].trim()
      inner += i==0 ? `${headStart}${k_res}${headEnd}\n`
                    :  `${colStart}${k_res}${colEnd}\n`
    }
    content += `${rowStart}${inner}${rowEnd}`
    i_res = row_l[i + 1]
  }
  let result = (content) ? `${tableStart}${content}${tableEnd}` : '';
  return result
}

function handlePre(p/*aragraph*/) {
  if (debug_pre) { console.log(p) }
  let result = "<pre>"
             + ( p.trimEnd()
                 .replaceAll(/^\s*[|]/gm,"")
              /* .replaceAll(/[|]\s*$/gm,'') commented. Not standard, not documented */
              /* .replaceAll(/\s\s*$/mg,"") // avoid problems */
               )
             + "</pre>"
    ;
  if (debug_pre) { console.log(result) }
  return result;

}

const ulistRegex_l=[/^[*-] /gm   ,
                   /^ {2,3}[*-] /gm  ,
                   /^ {4,6}[*-] /gm  ,
                   /^ {7,8}[*-] /gm  ,
]
function handleUnorderedLists(nLevel, p/*aragraph*/) {
   if (nLevel>ulistRegex_l.length-1) return p;
   const li_list = p.split(ulistRegex_l[nLevel])
   if (li_list.length == 1) return p;
   return li_list[0]+"<ul>"+li_list.slice(1).map(li=>"<li>"+handleOrderedLists(nLevel+1,handleUnorderedLists(nLevel+1,li))+"</li>").join("\n")+"</ul>"
}

const olistRegex_l=[      /^([0-9,.]+\. )/gm,
                    /^ {2,3}([0-9,.]+\. )/gm,
                    /^ {4,6}([0-9,.]+\. )/gm,
                    /^ {7,8}([0-9,.]+\. )/gm,
                   ]
function handleOrderedLists(nLevel, p/*aragraph*/) {
  if (nLevel>olistRegex_l.length-1) return p;
  const li_list = p.split(olistRegex_l[nLevel])
  if (li_list.length == 1) return p;
  let even=true;
  const l = li_list
    .slice(1)
    .map(it => { 
       even = !even
       if (even) {
           const liContent=
               handleUnorderedLists(nLevel+1,
                   handleOrderedLists(nLevel+1,it))
               
           return `${liContent}</li>`
       } else {
           if (it == "1. ") return "<li>"
           it = it.replace(". ","")
           return `<li value="${it}">`
       }
    }).join("\n")
  return `${li_list[0]}<ol>${l}</ol>`
}

function handleHeaders(p/*aragraph*/) {
  return p.replace(/^[\#]{1,6}[ ](.+)/mg, funReplaceHeader);
}
const imageRegex=/\!\[([^\]]+)\]\(([^\)]+)\){([^}]+)}?/g
//                                                        
function handleImages(p/*aragraph*/) {
  return p.replace(imageRegex,
        '<img src="$2" alt="$1" style="$3" />');
}
function handleLinks(p/*aragraph*/) {
  return p.replace(
        /[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g ,
        '<a href="$2" title="$4">$1</a>');
}

const stylesParseHelp={
  "bold"          : ["<b>"  ,"</b>"  , /\b[\*\_]{2}|[\*\_]{2}\b/, "  ","  "],
  "italic"        : ["<i>"  ,"</i>"  , /\b[\*\_]{1}|[\*\_]{1}\b/, " " ," " ],
  "strikethrough" : ["<del>","</del>", /\b[\~]{2}|[\~]{2}\b/    , "  ","  "],
}
const styleList = Object.keys(stylesParseHelp)
function handleFontStyles(p/*aragraph*/) {
  if (p.match(PARAGRAPH_MARK_REGEX /* Markdown collides with LaTex. LaTex takes precedence.*/)) { return p; }
  for (let styleIdx=0; styleIdx < styleList.length; styleIdx++){ 
    let even=true; // due to next slice(1)
    const  styleKey=styleList[styleIdx]
    const  oTag=stylesParseHelp[styleKey][0], // openTag
           cTag=stylesParseHelp[styleKey][1], // closeTag
          regex=stylesParseHelp[styleKey][2], // split regex
             oW=stylesParseHelp[styleKey][3], // open white-space
             cW=stylesParseHelp[styleKey][4]; // close white-space
    const list = p.split(regex)
    if (list.length==1) continue;
    p = list.slice(0,-1).map(it => {
         even = !even
         if (even) { return `${it}${cTag}${cW}` }
         else      { return `${it}${oW}${oTag}` }
      }).join("")+list.slice(-1)
    if (list.length%2==0) { 
        p=p+cTag+cW // Finally close any open tag.
    }
  }
  return p
}

function handleBlockQuotes(p/*aragraph*/) {
  if (! (p.startsWith(QUOT) /* quotations */ )) { return p; }
  return "<blockquote>"+p.replaceAll(QUOT, "")+"</blockquote>"
}

/**
 * Apply markdown to each paragraph.
 */
function _01_standardMarkdownParsing(p_m/*paragraph meta*/, relative_path){
  let p = p_m.content;
  if (p_m.isPre) {
    p = handlePre(p);
  } else {
  p = handleUnorderedLists(0, p);
  p = handleOrderedLists  (0, p);
  p = handleTables(p);
  p = handleHeaders(p);
  p = handleImages(p); 
  p = handleFontStyles(p); 
  p = handleBlockQuotes(p);
  p = p.replaceAll(/  $/mg,"º[br/]º"  ) // space + space + end-of-line == new html line in markdown
  }
  p = handleLinks(p)
       .replaceAll("º[","<") 
       .replaceAll("]º",">") 
  return p.length>0 ? "\n<p>"+p+"</p>" : "";
}

/* step 2: markdown txt extensions for pre-like */
const _02_markdown_extension = (p, relative_path) => {
  // NEXT) TXTWD extension. replace anchors link #[target_id]
  p = p.replace( /[#]\[([^\]]*)\]/g, "◆<span id='$1'>#$1</span>◆")

  // NEXT) TXTWD extension. replace relative links @[#internal_link]
  // TODO: Improve relative handling. There can be:
  // 1. links to external but relative to viewer content (normal case)
  // 2. links indicating viewer to reload current content
  //    (non-standard) links that just the TXTWD parser/viewer will understand.
  p = p.replace(
      /@\[(#[^\]\n]*)\]/g,
      " ◐<a onClick='window.scrollInto(\"$1\")'>$1</a>◑")

  // TODO:(0) move to standard markdown (paragraph) parsing
  //       Note that relative images are relative to txt document
  //       (vs html viewer)
  p = p.replace(
    /i\[((\.\/)?[^|\]\n]*)[|]?([^\]\n]*)\]/g,
    "<img src='"+relative_path+"/$1' style='$2' />")

  // NEXT) TXTWD extension. Add style to topic blocks [[topic1,topic2.subtopicA,...]]
  p = p.replace(/(\[\[[^\]\n]*\]\])/g, "<div class='txtblock'>$1</div>")

  return p
}

function handleLatext(p/*aragraph*/) {
  if (! (p.match(REGEX_MAYBE_IS_TABLE) /*table*/)) { return p; }

//p = p.trim()
//const  tableStart = '<table cellspacing="0"><tbody>', tableEnd = '</tbody></table>',
//         rowStart = '<tr>'          ,   rowEnd = '</tr>',
//        headStart = '<th>'          ,  headEnd = '</th>',
//         colStart = '<td>'          ,   colEnd = '</td>';
//const row_l = p.split('\n')
//let content = '';
//for (let i=0; i < row_l.length; i += 1) {
//  let i_res = row_l[i]
//  let column_l = i_res.split('|')
//  let k = 0
//  let inner = ''
//  for (k; k < column_l.length; k += 1) {
//    if (k == 0) {continue;}
//    let k_res = column_l[k].trim()
//    inner += i==0 ? `${headStart}${k_res}${headEnd}\n`
//                  :  `${colStart}${k_res}${colEnd}\n`
//  }
//  content += `${rowStart}${inner}${rowEnd}`
//  i_res = row_l[i + 1]
//}
//let result = (content) ? `${tableStart}${content}${tableEnd}` : '';
//return result
}
const HAS_REGEX_LATEX=/[$]([^$]+)[$]/gs
const _03_latex_extension = (p, relative_path) => {
  if (! (p.match(HAS_REGEX_LATEX) )) { return p; }
  if (debug_latex) { console.log(`paragraph with Tex found: ${p}`) }
  
  // NEXT) Replace LaTex expression with SVG
  const funReplaceTeXInLine = function(match, m1) {
    if (debug_latex) {
      console.log(match);
      console.log(m1);
    }
    return MathJax.tex2mml(m1); // TODO:(0) Recheck .tex2SVG not found ¿?
  }
  const funReplaceTeXBlock = function(match, m1) {
    return `<div>${funReplaceTeXInLine(match, m1)}</div>`
  }
  // Blocks must be replaced first.
  /* 1) */ p = p.replace( RE_TeX_BLOCK , funReplaceTeXBlock) 
  /* 2) */ p = p.replace( RE_TeX_INLINE, funReplaceTeXInLine)


  return p
}

function parseMD2HTML(md_payload, relative_path){
  md_payload = _00_documentCleaning(md_payload, relative_path)
  let even=true
//const paragraph_l = md_payload.split(PARAGRAPH_MARK_REGEX).filter(p => p.length>0)
  const paragraph_l = md_payload.split("```").map(it => {
    const p_list = (even)
                   ? it.split(PARAGRAPH_MARK_REGEX).filter(it => it!="") 
                   : [it]
    const result = p_list.map(it2 => { return { isPre:!even, content:it2 } })
    even = !even
    // console.log(result)
    return result
  }).flat()
  const result = paragraph_l
        .map(p/*aragraph*/ => {
          return _01_standardMarkdownParsing(p, relative_path)
        })
        .map(p/*aragraph*/ => {
          return _02_markdown_extension     (p, relative_path)
        })
     // .map(p/*aragraph*/ => {
     //   return _03_latex_extension        (p, relative_path)
     // })

  return result;
}

export {
   parseMD2HTML
}
