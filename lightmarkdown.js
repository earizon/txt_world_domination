const QUOT/*ationMark*/='ºq '
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
            : match.startsWith("● "     ) ? "h1"
            : match.startsWith("## "    ) ? "h2"
            : match.startsWith("• "     ) ? "h2"
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
           rowStart = '<tr>'          ,   rowEnd = '</tr>',
          headStart = '<th>'          ,  headEnd = '</th>',
           colStart = '<td>'          ,   colEnd = '</td>';
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
  let split_l = p.split("```")
  if (split_l.length==1) { return p; }
  let isPre=false;
  let md_l = split_l
     .map(block => {
      let result = isPre
        ? "<pre>"+block.trimEnd()+"</pre>"
        : block
      isPre=!isPre;
      return result
    })
  let result = md_l.join("")
      result = result
               .replaceAll(/[\n]^[^|\n]*[|]/gm,"\n ")
               .replaceAll(/[|]\s*$/gm,"")
               .replaceAll(/  *$/mg,"") // avoid <br/> problems
    ;
  return result;

}

const ulistRegex_l=[/^[*] /gm   ,
                   /^ {2,3}[*] /gm  ,
                   /^ {4,6}[*] /gm  ]
function handleUnorderedLists(nLevel, p/*aragraph*/) {
   if (nLevel>ulistRegex_l.length-1) return p;
   const li_list = p.split(ulistRegex_l[nLevel])
   if (li_list.length == 1) return p;
   return li_list[0]+"<ul>"+li_list.slice(1).map(li=>"<li>"+handleOrderedLists(nLevel+1,handleUnorderedLists(nLevel+1,li))+"</li>").join("\n")+"</ul>"
}

const olistRegex_l=[      /^([0-9,.]+\. )/gm,
                    /^ {2,3}([0-9,.]+\. )/gm,
                    /^ {4,6}([0-9,.]+\. )/gm,
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
function _01_standardMarkdownParsing(p/*aragraph*/, relative_path){
  p = handlePre(p);
  p = handleUnorderedLists(0, p);
  p = handleOrderedLists  (0, p);
  p = handleTables(p);
  p = handleHeaders(p);
  p = handleImages(p); 
  p = handleLinks(p); 
  p = handleFontStyles(p); 
  p = handleBlockQuotes(p);
  p = p.replaceAll(/  $/mg,"º[br/]º"  )
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
  p = p.replace(/(\[\[[^\]\n]*\]\])/g, "<span class='txtblock'>$1</span>")

  return p
}

function parseMD2HTML(md, relative_path){
  md = _00_documentCleaning(md, relative_path)
  const paragraph_l = md.split(PARAGRAPH_MARK_REGEX).filter(p => p.length>0)
  const result = paragraph_l
        .map(p/*aragraph*/ => {
          return _01_standardMarkdownParsing(p, relative_path)
        })
        .map(p/*aragraph*/ => {
          return _02_markdown_extension     (p, relative_path)
        })
  return result;
}

export {
   parseMD2HTML
}
