# txt_world_domination
Serverless CMS (**just plain text!!!**) with a supporting
[ligtweight HTML viewer](https://github.com/earizon/txt_world_domination/blob/main/viewer.html) and
a [micro db-engine](https://github.com/earizon/txt_world_domination/blob/main/txt_ddbb_engine.js)
supporting multidimensional taxonomy classification.

Daily Use:
1. Create documentation in standard markdown.
2. Tag paragraphs or blocks of paragrpahs with tags like `[[{topic.subtopic]]...[[topic.subtopic}]]`

YOU ARE DONE!!!. An standard markdown reader with no support (yet) for the tags extension, will
render such tags as vanilla text.

 A markdown reader supporting the tag extension will transparently create an internal database and allow
to navigate the content based on topics and subtopics.

  Right now this project contains the reference markdown reader with tag extension support and an
always growning number of features to browse the content. You can copy and embed it into your project
for free. It's just an standard set of html+js+css+fonts files.
   
Refer to the [test page](https://earizon.github.io/txt_world_domination/viewer.html?payload=test.txt) and
the original [txt file](https://raw.githubusercontent.com/earizon/txt_world_domination/main/test.txt) to 
get an idea of daily ussage.

Since content is just plain text (vs some weird binary database format) it means that many tools can be reused to 
[edit](https://en.wikipedia.org/wiki/Comparison_of_text_editors) 
and
[manage](https://ftp.gnu.org/old-gnu/Manuals/textutils-2.0/html_mono/textutils.html) the content
following the "Do one thing and do it right!" UNIX philosophy.



