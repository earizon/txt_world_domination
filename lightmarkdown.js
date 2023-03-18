// https://codepen.io/kvendrik/pen/bGKeEE
function parseMD2HTML(md){

  const funReplaceList = function(match) {
    console.debug(`match: ${match}`);
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
console.log(sULregex)
    const ulRegex = new RegExp(sULregex, 'gm');
    md = md.replace(ulRegex, funReplaceList);
  }

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

    const id=match.replace(new RegExp('[^a-zA-Z0-9_\']', 'g'), '');
    const result = `<${tag} class='h_anchor' id='${id}'>${m1.trim()}</${tag}>`;
if (id == "EVM") {
    console.log(result)
}
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
