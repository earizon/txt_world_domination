[[ { PM.ADR ]]
# TEXT WORLD DOMINATION <br/>ARCHITECTURAL DECISSION RECORDS (ADR)<br/><br/>

<br/> <br/> <br/>
<!-- { -->
# ADR 1: plaing text preferred over binary formats as "core" database

## Summary 1

* In the context of: taking notes for tens of years 
* facing: the problem of keeping content updated, classified and with no duplicates
* we decided for: a plain text data format 
* to achieve : an always maintanable solution
* accepting : lower performance.

## Discussion 1

* Notes are schema-less on their own nature. Using a binary format
  will provide little or no advantage over plain (unicode) text and lot of headaches.
* Binary formats are not human friendly, not text-editor, neither text-utils
  (grep, sed, sort, cut,...) friendly.
* Binary formats do not take advantage of common file-systems in 
  Linux/Mac/Windows.
* Binary formats are not resilient to buggy storage (magnetic/solid-state disks,...)
  A unique "broken" bit or segments will require non standard.
* Binary formats and not Git friendly. We loose a powerful, battle-tested and
  well-known versioning tool that also allows for offline distributed
  workgroup collaboration.
* If perfomance is needed, a periodic batch job can index and "zip" the text
  and deal with data in non-yet planned ways. If it works and scales for search
  engines like Google, it will also work for non-Internet scale projects.<br/>
  Documents for a company with  100.000 employees can be considered 
  "small data" if proper formats - markdown/text- is used. Modern SSD drivers
  and CPUs will digest the documents in a few minutes. <br/>
  In such sense the text document becomes a "source of true" or "event source",
  while binary formats will become a "view".

##  Solution 1

* Markdown was selected. It is human and computer friendly and keeps
  enough information to adapt to different display technologies:
  * electronic displays (converted to html then rendered by web browsers),
  * printed paper (as "raw" markdown or printed html page).
* Markdown is also very easy to extend to custom needs.

##  Consequences 1

* An initial markdown engine was created to render as "HTML" in browser.
* It works properly and shows a very decent speed for documents up to ~500 pages
  using not so modern hardware and software.
<!-- } -->

<!-- { -->
# ADR 2: Content classification

## Summary 2

* In the context of: keeping notes ordered and being able to browse based on "cross-cutting" concerns.
* facing: that standard markdown do not provide a direct solution
* we decided for: adding a **minimal** markdown extension providing the posibility to classify 
  content by topics and subtopics ("coordinates and sub-coordinates").
* to achieve: the possiblity to browse and classify content in orthogonal "subsets".
* accepting: a minimal non-standard extension to the markdown format.

## Discussion 2

* Human memory is finity. Many times we take notes "by intuition", without enough 
  time to check whether similar content was already in place or the was something
  related ... also
* notes must be arbitrarely ordered. Most of the times from "simple content" to
  advanced topics. This is how text-books works  but ... throughout the years
  we will need to work of the content by different cross-cutting concerns
  * document or project management related:
    * What's new/old, what's pending.
    * What client and/or project some document relates to.
    * What is the cost implication of some solution/s given in the document.
    * Calendar related.
  * Industry related:
    * What sections of a given document/s apply to a given industry/sector.
  * Technology/area-of-expertise related:
    * What sections of a given document/s require or apply to some type of
      technology or area of expertise.
  * ...
  
  
##  Solution 3

 A simple "tagging" extension in markdown allows to mark content into 
[[ $topic1.subtopicA, $topic2.subtopicB,...]  with paragraph granularity.

## Consequences 3

* The system works as expected and allows to navigate content in "cross-cutting" 
  concerns "paths".
* Unfortunatelly creating the correct classification of topics/subtopics ("taxonomy")
  looks to be much harder that innitially expected. Sometimes, a full taxonomy 
  "refactor" is needed as we gain experience in a given area of expertise.
* At the same time we gain a powerful tool to create taxonomies and a potential
  base for future complex "ontologies".
* The topic.subtopic classification is also very useful for machine 
  learning "pipelines" potentially allowing to reduce dimensionality and 
  computation orders of magnitude (when compared to non tagged text).
* As an added bonus, the content classification works nicely when embedded as
  comments in the source code of any programming language.
<!-- } -->

<!-- { -->
# ADR 3: Concatinating markdowns 

## Summary 3

* In the context of: using markdown as "database format"
* facing: the ever increasing content managed
* we decided for: adding a "payload" extension allowing to split content in 
  different files while still loading them all as a single unit of content.
* to achieve: better maintenaibility of the solution and (much) fewer conflicts
  when working with git in distributed groups.
* accepting: no downsides detected.

## Discussion 3

  Markdown does not offer any solution to concatenate different markdown source
files into a single "big" markdown, but when reading the information it is really
useful to read everything as a "single book".

##  Solution 3

 A "*.payload" extension was added as an "index" of markdown files that must 
be considered a single "document" or book.

## Consequences 3

* The solution works as expected and is completely compatible with standard markdown,
  since this "*.payload" file is just external and ignored by markdown.
* It also can be applied to create "books" from source code in any programming
  language.
* Payload comments allows also to introduce metadata (for example status of the
  full document -OK, WiP; ...-)
* We detected our current solution can be extended to be used as a "documentation"
  protocol (on top of HTTP or other lower level protocols). While the current 
  implementation focus on an HTML client parsing the markdown to HTML and an
  embedded JS engine following some basic rules for topic/subtopics, any other
  client/middleware/backend module can process the document following the same
  rules to extract the content, or cache/transform to some other internal format,
  quite similar to semantic HTML, but with a more human and machine friendly language.
  (no need anymore for "dirty" and complex tagging).
  
  

<!-- } -->

<!--
------ ADR Template ----------------------

* REF: <https://github.com/joelparkerhenderson/architecture-decision-record/tree/main/locales/en/templates/decision-record-template-for-alexandrian-pattern> 

{
# Title
## Summary

* In the context of: (use case)
* facing: (concern)
* we decided for: (option)
* to achieve: (quality)
* accepting: (downside).

## Discussion 

Explains the forces at play (technical, political, social, project).
This is the story explaining the problem we are looking to resolve.

##  Solution

(Explains how the decision will solve the problem.)

## Consequences

(Explains the results of the decision over the long term.
 Did it work, not work, was changed, upgraded, etc.)
}
-->
[[  PM.ADR } ]]
