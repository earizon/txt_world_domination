// https://codepen.io/kvendrik/pen/bGKeEE

const debug_li_regex=true;

const doMarkdownTXTExtension = (input, relative_path) => {
  let H = input
  // NEXT) md++ extension. replace anchors link #[target_id]
  H = H.replace( /[#]\[([^\]]*)\]/g, "◆<span id='$1'>#$1</span>◆")

  // NEXT) md++ extension. replace external link @[http... link]
  H = H.replace( /@\[((http|[.][/]).?[^\]\n]*)\]/g,
      " ▶<a target='_blank' href='$1'>$1</a>◀")


  // NEXT) md++ extension. replace relative links @[#internal_link]
  // TODO: Improve relative handling. There can be:
  // 1. links to external but relative to viewer content (normal case)
  // 2. links indicating viewer to reload current content
  //    (non-standard) links that just the md++ parser/viewer will understand.
  H = H.replace(
      /@\[(#[^\]\n]*)\]/g,
      " ▷<a onClick='window.scrollInto(\"$1\")'>$1</a>◁")

  // NEXT) md++ extension. Replace External absolute URL images: i[http://.../test.svg|width=3em]
  H = H.replace(
    /i\[((http).?[^|\]\n]*)[|]?([^\]\n]*)\]/g,
    "<img src='$1' style='$2' />")
  // NEXT) md++ extension. Replace External relative URL images: i[./test.svg|width=3em]
  //       Note that relative images are relative to txt document
  //       (vs html viewer)
  H = H.replace(
    /i\[((\.\/)?[^|\]\n]*)[|]?([^\]\n]*)\]/g,
    "<img src='"+relative_path+"/$1' style='$2' />")

  // NEXT) md++ extension. Add style to topic blocks [[topic1,topic2.subtopicA,...]]
  H = H.replace( /(\[\[[^\]\n]*\]\])/g, "<span class='txtblock'>$1</span>")

  return H
}



let debug_n=1;
function parseMD2HTML(md, relative_path){
  md = md.replaceAll('<','&lt;') // TODO:(document) No native HTML allowed
         .replaceAll('>','&gt;') //      since '<'... '>' is always replaced.

  const funULReplaceList = (match) => {
    console.log("ul block match:"+match)
    return "<ul>"+match+"</ul>"
  }
  if (false) {
    md = md.replace(/^\s.*\n\*/gm, '<ul>\n*');
    md = md.replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2');
    md = md.replace(/^\*(.+)/gm, '<li>$1</li>');
  } else {
    const ulStart = "^$\n[\*] " // ul start with empty line followed by * ...
    const intTerm = "([\s\S]*)"   // \s\S match all white-space and all non-white-space chars
    const ulEnd   = "^$"      // ul ends  with empty line
    const sULregex = ulStart + intTerm + ulEnd
    if (debug_li_regex) {
       console.log(`regex matching ul start/end: ${sULregex}`)
    }
    const ulRegex = new RegExp(sULregex, 'gm'); // match global (all document) and multiline
    md = md.replace(ulRegex, funULReplaceList);
  }

  const CLEAN_BUILD_ID_REGEX_0=new RegExp('\\[\\[([^\\[])*\\]\\]',"g");
  const CLEAN_BUILD_ID_REGEX_1=new RegExp('[^",a-z\,A-Z,0-9,_,\']', 'g');

  //h
  const funReplaceHeader = function(match, m1){
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

  md = md.replace(/^[\#]{1,6}[ ](.+)/mg, funReplaceHeader);

  //images
  md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');

  //links
  md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');

  //font styles
  md = md.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, '<b>  $1  </b>');
  md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '  <del>$1</del>  ');

  if (true) { // Apply custom markdown extension
    return doMarkdownTXTExtension(md, relative_path)
  }
  return md;
}

// var rawMode = true;
//     mdEl = document.getElementById('markdown'),
//     outputEl = document.getElementById('output-html'),
//     parse = function(){
//       outputEl[rawMode ? "innerText" : "innerHTML"] = parseMd(mdEl.innerText);
//     };
//
// parse();
// mdEl.addEventListener('keyup', parse, false);
//
// //Raw mode trigger btn
// (function(){
//
//   var trigger = document.getElementById('raw-switch'),
//       status = trigger.getElementsByTagName('span')[0],
//       updateStatus = function(){
//         status.innerText = rawMode ? 'On' : 'Off';
//       };
//
//   updateStatus();
//   trigger.addEventListener('click', function(e){
//     e.preventDefault();
//     rawMode = rawMode ? false : true;
//     updateStatus();
//     parse();
//   }, false);
//
// }());


export {
   parseMD2HTML
}
