const QUOT/*ationMark*/='ºq'
function _00_documentCleaning(md, relative_path){
  md = md
         .replaceAll('<!--'   ,'º--'  ) // TODO:(document) No native HTML allowed
         .replaceAll('-->'    ,'--º'  ) // except comments, since '<'... '>' is 
         .replaceAll('<br/>'  ,'ºbrº' )
         .replaceAll('<br>'   ,'ºbrº' )
         .replaceAll('<'      ,'&lt;' ) // always replaced. 
         .replaceAll(/^[>] /mg,QUOT   )
         .replaceAll('>'      ,'&gt;' )
         .replaceAll('º--'    ,'<!--' ) 
         .replaceAll('--º'    ,'-->', )
         .replaceAll('ºbrº'   ,'<br/>')
         .replaceAll(/^[-] /mg,'* '   )
         .replaceAll(/  $/mg,'<br/>'  )
  let isPre=false;
  let md_l = md.split("```")
    .map(p/*aragraph*/ => {
      let result = isPre
        ? "<pre>"+p.replaceAll("\n\n","\n \n")+"</pre>" 
        //                             ^                         
        // ┌───────────────────────────┘                         
        // enough to avoid splitting a pre block in two logical paragraphs
        // later on. Otherwise when filtering by topics a paragraph inside
        // a pre will enter into the "grep" and another one out, breaking 
        // layout.
        // TODO:(improvement) allow to split pre into logical topic blocks
        // (in a transparent way to final user).
        : p 
      isPre=!isPre;
       return result
    })
  return md_l.join("");
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

function mdTables(str) {
  str = str.trim()
  const  tableStart = '<table><tbody>', tableEnd = '</tbody></table>',
           rowStart = '<tr>'          ,   rowEnd = '</tr>',
          headStart = '<th>'          ,  headEnd = '</th>',
           colStart = '<td>'          ,   colEnd = '</td>';
  const row_l = str.split('\n')
  let content = '';
  for (let i=0; i < row_l.length; i += 1) {
    let i_res = row_l[i]
    let column_l = i_res.split('|')
    let k = 0
    let inner = ''
    for (k; k < column_l.length; k += 1) {
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

//const REGEX_PRE=new RegExp('```([^\n]*)(.*)```',"gs");

function _01_standardMarkdownParsing(p/*aragraph*/, relative_path){

//if (p.indexOf("```")>0 /* pre */) {
//  // https://stackoverflow.com/questions/1068280/javascript-regex-multiline-text-between-two-tags
//  p = p.replace(REGEX_PRE,'<pre style="$1_lang">$2</pre>')
//}

  if (true /* ul */) {
    if (p.startsWith("* ") /* ul li */) {
      p = "<ul>"+p.split(/^[*] /gm).filter(li=>li.length>0).map(li=>"<li>"+li+"</li>").join("\n")+"</ul>"
    }
  }

  const REGEX_MAY_IS_TABLE=/^[|][^|]+[|].*\n[|][^|]+[|]/gs
  if (p.match(REGEX_MAY_IS_TABLE) /*table*/) {
    p = mdTables(p)
  }

  if (true/* headers */) {
    p = p.replace(/^[\#]{1,6}[ ](.+)/mg, funReplaceHeader);
  }

  if (true /* images */) {
    p = p.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');
  }

  if (true /* links */) { 
    p = p.replace(
        /[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g ,
        '<a href="$2" title="$4">$1</a>');
  }

  if (true/* font styles */) { 
    p = p.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, '<b>  $1  </b>');
    p = p.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '  <del>$1</del>  ');
  }

  if (p.startsWith(QUOT) /* quotations */ ) {
    p = "<blockquote>"+p.replaceAll(QUOT, "")+"</blockquote>"
  }

  return p.length>0 ? "\n<p>"+p+"</p>" : "";
}

/* step 2: markdown txt extensions for pre-like */
const _02_markdown_extension = (p, relative_path) => {
  // NEXT) md++ extension. replace anchors link #[target_id]
  p = p.replace( /[#]\[([^\]]*)\]/g, "◆<span id='$1'>#$1</span>◆")

  // NEXT) md++ extension. replace external link @[http... link]
  p = p.replace( /@\[((http|[.][/]).?[^\]\n]*)\]/g,
      " <<a target='_blank' href='$1'>$1</a>>")


  // NEXT) md++ extension. replace relative links @[#internal_link]
  // TODO: Improve relative handling. There can be:
  // 1. links to external but relative to viewer content (normal case)
  // 2. links indicating viewer to reload current content
  //    (non-standard) links that just the md++ parser/viewer will understand.
  p = p.replace(
      /@\[(#[^\]\n]*)\]/g,
      " ><a onClick='window.scrollInto(\"$1\")'>$1</a><")

  // NEXT) md++ extension. Replace External absolute URL images: i[http://.../test.svg|width=3em]
  p = p.replace(
    /i\[((http).?[^|\]\n]*)[,]?([^\]\n]*)\]/g,
    "<img src='$1' style='$2' />")
  // NEXT) md++ extension. Replace External relative URL images: i[./test.svg|width=3em]
  //       Note that relative images are relative to txt document
  //       (vs html viewer)
  p = p.replace(
    /i\[((\.\/)?[^|\]\n]*)[|]?([^\]\n]*)\]/g,
    "<img src='"+relative_path+"/$1' style='$2' />")

  // NEXT) md++ extension. Add style to topic blocks [[topic1,topic2.subtopicA,...]]
  p = p.replace( /(\[\[[^\]\n]*\]\])/g, "<span class='txtblock'>$1</span>")

  return p
}

function parseMD2HTML(md, relative_path){
  md = _00_documentCleaning(md, relative_path)
  const paragraph_l = md.split(/^\n/gm).filter(p => p.length>0)
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
