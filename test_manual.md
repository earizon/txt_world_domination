# Markdown extensions Basic Rules

* The TXT engine searchs for instructions codified along the normal
  text in the file. To do so, the next delimiters are used
  to "scape" or distingüish the instructions from normal text.
  ```
  [[ - topics go here - ]]
  ```
*  A BLOCK-OF-RELATED-CONTENT starts with
  ```
  [[{]]
  ```
  and ends with
  ```
  [[}]]
  ```
* New blocks can be placed inside existing blocks forming a tree of [[{DOC_HAS.template.tree]]
  blocks. Graphically you can imagine them as:
  ```
  txt file
  ├─ block
  │  ├──── block
  │  │     └──── block
  │  └──── block
  ├─ block
  │  └──── block
  ├─ block
  ┊
  ```
  [[}]]

* each block (paragraph, ordered/unordered list, pre-formatted 2D) can be
  "tagged" with on or more topics using the syntax
  ```
  [[{ topic1,...,topicB]]
  ```
  The tag can be almost "anyware" (top/bottom, left/right or in the midst).

# Tagging paragraphs with topics

* Topic tags can be added anywhere before the start and end of a
  block. Next examples are equivalent. Repeating topic 

  ```
  | [[ { ]] <·· opening block
  | some important paragraph about topicA. [[ topicA ]]
  |                               
  | some important paragraph about topicB. [[ topicB ]]
  | [[ } ]] <·· closing block
  ```

  ```
  | [[ { topicA, topicB ]] 
  | some important paragraph about topicA.
  |                               
  | some important paragraph about topicB.
  | [[ topicA } ]]  <·· No problem with retagging with topicA.
  ```

[[ { PM.ADR ]]
Notice also that a pre-formated (2D content) code is considered
a single paragraph so the following example is also equivalent:
  ```
  | [[ { topicA, topicB } ]] ¹ 
  | some important paragraph about topicA.
  |                               
  | some important paragraph about topicB.
  | 
  ```
* ¹ Architecture Decission Record (ADR): <br/>
  For normal (non preformated) text, topicA and B will just tag 
  the first paragraph, with pre-formated text, both visual 
  paragraph are part of the same "logical" paragraph. 
  Ussually, preformated 2D diagrams and tables are displayed
  with random paragraphs, but we don't want to manage them 
  separately.

[[ PM.ADR } ]]


* Each topic can be subclassified in subtopics following the syntax
  ```
  [[ topicA.subtopic ]]
  ```
* Rarely, sub-subtopics are also required for finer classifications.<br/>
  ```
  [[ topicA.subtopic.subsubtopic ]]
  ```


* Think of a topic as a first or principal clasification of content.          [[{doc_has.KEY-POINT]]
  For example in a document about Project Management main topics/coordinates
  could be HHRR, PLANNING, DOCUMENTATION, RISK MANAGEMENT, ...
* Think of a subtopic as a (finite) coordinate inside the topic dimension.
  For example in the HHRR they could be:<br/>
  ```
  HHRR.policies, HHRR.recruitment, HHRR.hiring, HHRR.Training, HHRR.Payroll, ...
  ```
  In PM (Project Management) they coudl be:
  ```
  PM.BACKLOG,PM.TODO,PM.WiP,PM.TEST,PM.BLOCKED,PM.DONE,
  ```
  (Subtopics can be seen as the taxonomy used for each main topic,
  and sub-subtopics as a way to further detail and classify each subtopic).
* Think of subtopics as "meter" coordinate, and a subsubtopics as a 
  "milimiter" coordinates in the "topic" dimension.

* Graphically you can imagine them as: <!-- { --> 
  ```
  [[{doc_has.graph}]]
  | NOTE: each p represents a "paragraph" of random size.
  |
  |  normal book:
  |                    
  |                     
  |   p p p p p p p p p p p p p p  <·· Chapter 1
  |   p p p p p p p p p p p p p p 
  |   p p p p p p p p p p p p p p 
  |   p p p p p p p p p p p p p p 
  |   p p p p p p p p p p p p p p  <·· Chapter 2
  |   p p p p p p p p p p p p p p 
  |   p p p p p p p p p p p p p p 
  |   p p p p p p p p p p p p p p  <·· Chapter 3
  |   p p p p p p p p p p p p p p 
  |   p p p p p p p p p p p p p p 
  |   ...
  |
  | Wise Book by TXT World Domination
  |
  |                 topicA
  |                   ^
  |                   │  ... 
  |                   │       ┌─·················─┐
  | topicA.subtopic ··┼········p p p p p p p p p p·
  |                   │       └─·····┼···········─┘                         
  |                   │              ·                  
  |                 ┌ ┼·······┌─·····┼···········─┐
  | topicA.subtopic · │       ·p p p p p p p p p p·
  |                 · │       ·p p p p p p p p p p·
  |                 └ ┼·······└─·····┼···········─┘
  |                   │       ·      ·                  
  |                   │       ·      ·            ·  
  |                   │       ·      ·            ·   
  |                   ·───────┼──────┼────────────┼───── topicB
  |                  ╱        ·      ²            ·  
  |                 ╱         ·                   ·  
  |                ╱          └─· topicB.subtopic ┘  
  |               ╱           
  |              ╱               ² topicB.subtopic.subsubtopic               
  |             ╱                 
  |         topicC
  ```
 As it can be seen graphically, topics.subtopics allows to navigate content based on
 "concerns". <br/>

 A simple use case can be to tag paragraphs in student's text book according to complexity
 level. Then an student can "navigate" through simple to complex levels.<br/>

  There is no need to create new books that either duplicate content or just 
 forget to reference important basic information. Students with different skills 
 and knowledge can use the same book and choose at will what to read/ignore filtering
 content in/out at will.

  Students books with multi-level content is just an example.  topics/subtopics 
 can be used for "anything", even to create complex project management dashboards
 with no need for ad-hoc software or "cheat-sheets with steroids" to simplify 
 daily tasks, or multidimensional web-maps, again with no need for custom software,
 and so on. [[{doc_has.key-point}]]

 AI machine learning algorithms can scan a set of paragraphs, and based on tags,
 reduce the classification problem dimensionality while training by orders of magnitude:

<!-- } -->

* The relation among blocks and topics.subtopics can be visualized like:  [[{doc_has.graph]]
  ```
       ├─ block                  topicA
       │  ├──── block                       topicB
       │  │     └──── block                             topicC
       │  └──── block                                   topicC.subtopic1
       ├─ block                             topicB
       │  └──── block                                   topicC.subtopic1
       ├─ block                  topicA
       ┊                         .subtopic3
  ```
[[doc_has.graph}]]
[[KEY-POINT}]]


