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

# Topic Testing

* Topic tags can be added anywhere before the start and end of a
  block.
  ```
__Example A__                  _Example B_
                                                          [[{topicA]]
  Lorem Ipsum will dominate     Lorem Ipsum will dominate [[topicB]]
  the World                     the World
                                                          [[}]]
  └──────────┬────────────┘     └──────────────┬────────────────────┘
             │                                 │
             └─────────────┬───────────────────┘
  Both ways of tagging content with topic tags end up with the same result
  (except for maybe some extra whitespace).
  Placing
  ```

* Each topic can be subclassified in subtopics following the syntax
  ```
  [[ { topicA.subtopic.subsubtopic } ]]
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

* Graphically you can imagine them as: <!-- { --> 
  ```
  [[{doc_has.graph]]
  |                 topicA
  |                   ^
  |                 ┌ ┤       ┌·························┐
  |                 · │       · block of text related to·
  | topicA.subtopic · │       · topicA.subtopic and     ·
  |                 · │       · topicB.subtopic.subsubtopic
  |                 └ ┤       └·························┘
  |                   │
  |                   +───────┬────────────────────────────topicB
  |                  ╱        └─······················─┘
  |                 ╱          topicB.subtopic.subsubtopic
  |                ╱    └─····························─┘
  |               ╱           topicB.subtopic
  |              ╱
  |             ╱
  |         topicC
  [[doc_has.graph}]]
  ```
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


