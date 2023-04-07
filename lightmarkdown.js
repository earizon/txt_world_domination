// https://codepen.io/kvendrik/pen/bGKeEE

const doMarkdownTXTExtension = (input, relative_path) => {
  let H = input
  // NEXT) replace anchors link
  H = H.replace(
      /[#]\[([^\]]*)\]/g,
      "◆<span id='$1'>#$1</span>◆")

  // NEXT) replace relative/absolute external links.
  // TODO: Improve relative handling. There can be:
  //       links to unrelated to viewer content (normal case)
  //       links indicating viewer to reload current content
  //       -non-standard links that jut the viewer will understand.
  H = H.replace(
      /@\[((http|[.][/]).?[^\]\n]*)\]/g,
      " ▶<a target='_blank' href='$1'>$1</a>◀")

  // NEXT) replace internal link
  H = H.replace(
      /@\[(#[^\]\n]*)\]/g,
      " ▷<a onClick='window.scrollInto(\"$1\")'>$1</a>◁")

  // NEXT) Replace External absolute URL images: i[http://.../test.svg|width=3em]
  H = H.replace(
    /i\[((http).?[^|\]\n]*)[|]?([^\]\n]*)\]/g,
    "<img src='$1' style='$2' />")
  // NEXT) Replace External relative URL images: i[./test.svg|width=3em]
  //       Note that relative images are relative to txt document
  //       (vs html viewer)
  H = H.replace(
    /i\[((\.\/)?[^|\]\n]*)[|]?([^\]\n]*)\]/g,
    "<img src='"+relative_path+"/$1' style='$2' />")


  // NEXT) Add style to topic blocks
  H = H.replace(
      /(\[\[[^\]\n]*\]\])/g,
      "<span class='txtblock'>$1</span>")

  return H
}



let debug_n=1;
function parseMD2HTML(md, relative_path){

  const funReplaceList = function(match) {
    return match
  }
  if (false) {
    md = md.replace(/^\s.*\n\*/gm, '<ul>\n*');
    md = md.replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2');
    md = md.replace(/^\*(.+)/gm, '<li>$1</li>');
  } else {
    const ulStart = "^$\n^[*] "
    const intTerm = "(.+\n)*"
 // const ulEnd   = "\n\*\s.*\n^$"
    const ulEnd   = "(^$\n)?"
//  const sULregex = ulStart + intTerm + ulEnd
    const sULregex = ulStart + intTerm + ulEnd
// console.log(sULregex)
    const ulRegex = new RegExp(sULregex, 'gm');
    md = md.replace(ulRegex, funReplaceList);
  }

  const CLEAN_BUILD_ID_REGEX_0=new RegExp('\\[\\[([^\\[])*\\]\\]',"g");
  const CLEAN_BUILD_ID_REGEX_1=new RegExp('[^",a-z\,A-Z,0-9,_,\']', 'g');

  //h
  const funReplaceHeader = function(match, m1){
    const tag = match.startsWith("# "     ) ? "h1"
              : match.startsWith("● "     ) ? "h1"
              : match.startsWith("## "    ) ? "h2"
              : match.startsWith("• "     ) ? "h1"
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
if (match.indexOf('[[')>=0) {
//  console.log(`${debug_n}: m1:${m1}`);
  console.log(`${debug_n}: match:${match}`);
  console.log(`${debug_n}: id:${id}`);
}
debug_n=debug_n+1;
    const result = `<${tag} class='h_anchor' id='${id}'>${m1.trim()}</${tag}><br/>\n`;
    return result
  }

  md = md.replace(/[\#]{6}[ ](.+)/g, funReplaceHeader);
  md = md.replace(/[\#]{5}[ ](.+)/g, funReplaceHeader);
  md = md.replace(/[\#]{4}[ ](.+)/g, funReplaceHeader);
  md = md.replace(/[\#]{3}[ ](.+)/g, funReplaceHeader);
  md = md.replace(/[\#]{2}[ ](.+)/g, funReplaceHeader);
  md = md.replace(/[\#]{1}[ ](.+)/g, funReplaceHeader);


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
