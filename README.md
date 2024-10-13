# TXT World Domination

Serverless CMS (**just plain text!!!**) based on markdown with extensions for
multidimensional taxonomy classification, allowing to navigate the content based
on topics (axes) and subtopics (coordinates).

 This projects aims to provide an easy-to-use tool for "long life" (years or tens of years) 
documentation management.

 Recommended to safely store and classify research (PhD) work, complex software documentation,
complex procedures, book writing, "industrial" web pages. A few examples for the impatient:

Since content is just plain text (vs some weird binary database format) it means that many tools can 
be reused to [edit](https://en.wikipedia.org/wiki/Comparison_of_text_editors) and
[manage](https://ftp.gnu.org/old-gnu/Manuals/textutils-2.0/html_mono/textutils.html) the content
following the "Do one thing and do it right!" UNIX philosophy.

Next features come for free:
- offline work. No need for server-client (and network) setup. 
- No need for complex tooling. Notepad must be good enough.
- Git friendly automatically providing for:
  - Advanced peer-2-peer collaboration.
  - Content versioning.
  - Distributed content replication.
  - advanced audits of changes.
- No vendor lock-in into binary formats. 
- Resilient to attack vectors. The source content database can be printed
  to paper.<br/>

## Server CMS vs Static Site Generator vs TXT World Domination Project

   ```
   ┌──────────────────────────────────────────────────────────────┐
   ├─  CONVENTIONAL CMS (CONFLUENCE, SHAREPOINT, ...) ────────────┤
   ├──────────────────────────────────────────────────────────────┤
   │                                                              │
   │1) Central CMS Server                      2) "Fool" Browser  │
   │   ──────────────────                         ────────────────│
   │   DDBB                     <··· network···>  Render conent   │
   │   Single place of failure                                    │
   │   (single place of attack)                                   │
   │   Binary format                                              │
   │   Server/CMS/Network Admins                                  │
   │                                                              │
   ├──────────────────────────────────────────────────────────────┤
   ├─  STATIC SITE GENERATOR (NEXT, ...) ─────────────────────────┤
   ├──────────────────────────────────────────────────────────────┤
   │                                                              │
   │1) "Source" Content           3) Web Server                   │
   │   ─────────────────      ┌····> ──────────── ···┐            │
   │   (git versioned, p2p    ·      Publish         ·            │
   │    distributed)          ·      "compiled" html ·            │
   │          ·               ·                      ·            │
   │          ·               ·                      ·            │
   │          ·               ·                      v            │
   │          ·      2) Compile                  4)"Fool" Browser │
   │          └─····>  ─────────────────           ────────────── │
   │                   Generates HTML              Render content │
   │                   in opinionated ways                        │
   │                   using "complex" tooling                    │
   │                   (npm, transpilers, modules,                │
   │                    packagers, ...)                           │
   │                                                              │
   ├──────────────────────────────────────────────────────────────┤
   ├─  TXT WORLD DOMINATION PROJECT ──────────────────────────────┤
   ├──────────────────────────────────────────────────────────────┤
   │                                                              │
   │1) "Source" Content            2) "Inteligent" Browser        │
   │   ───────────────────────── ··>  ─────────────────────────── │
   │   markdown+topic.sub. tags       Fetch local/remote "payload"│
   │   (git versioned, p2p            Processes it. Generate      │
   │    distributed)                  HTML, taxonomy, indexes,    │
   │           ·                      extensions, ...             │
   │           ·                                                  │
   │           ├─·· or  ··········>2) Printer                     │
   │           ·                      ─────────────────────────── │
   │           ·                      Print to paper              │
   │           ·                      (extensions ignored)        │
   │           ·                                                  │
   │           ├─·· or  ··········>2) LLM Learning Algorithm      │
   │           ·                      ─────────────────────────── │
   │           ·                      - LLM training algorithm.   │
   │           ·                        topics/subtopics provide  │
   │           ·                        (huge) dimensionality     │
   │           ·                        reduction!!!              │
   │           ·                                                  │
   │           ├─·· or ···········>2) JAVA/Rust/Python/... IDE    │
   │           ·                      ─────────────────────────── │
   │           ·                      Improve source code         │
   │           ·                      navigation based on         │
   │           ·                      topics.subtopics concerns   │
   │           ·                      like UI, QA, security, .... │
   │           ·                                                  │
   │           ├─·· or ···········>2) (Fill with new ideas and    │
   │           ·                      use-cases)                  │
   └──────────────────────────────────────────────────────────────┘
   ```

## Markdown sets.
* Sets or subsets of text files (markdown, source code) can be grouped
  into a single "big" final virtual file through "payload" lists.
   The list is just a normal txt file indicating on a each new line the 
  list of markdown files to concatenate in order to form the final
  markdown document. Example:

  ```
  full_book.payload  security_book.payload   frontend_book.payload 
  -----------------  ---------------------   --------------------- 
  ./introduction.md  ./chapter4.md           ./chapter1.md
  ./chapter1.md      ./chapter5.md           ./chapter2.md
  ./chapter2.md      ./chapter9.md           ./chapter9.md
  ./chapter3.md              
  ./chapter4.md                    
  ./chapter5.md                    
  ./chapter6.md                    
  ./chapter7.md                    
  ./chapter8.md                    
  ./chapter9.md                    
  ```

## Real World Documentation:

 Just a few examples on how this project is being used to document real 
  world documentation:
* [Java Documentation](https://earizon.github.io/txt_world_domination/viewer.html?payload=../JAVA/ALL.payload)
* [Cryptography notes](https://earizon.github.io/txt_world_domination/viewer.html?payload=../cryptography/notes.txt)
* [Software Architecture](https://earizon.github.io/txt_world_domination/viewer.html?payload=../SoftwareArchitecture/ALL.payload)
* [PostgreSQL Architecture](https://earizon.github.io/txt_world_domination/viewer.html?payload=../PostgreSQL/notes.txt)

## Taking and classifying notes "vs" LLM AI

* Why taking notes in the era of Machine Learning and Large Language Models.

Simply puts. They complement each other:

  AI responses are just stochastic answers. They look to make sense, but
they completely ignore the real world outside its "buffer" context.

 When taking notes we can just "reuse" the knowledge of experts posting in
magazines, research papers, reddit, coffee chats, ...

 AI works "fine" when applied to limited contexts, for example, basic
programming tasks or (not so basic) math-like tasks with a well defined set
and operations (algebraic problems, chess-like problems, ...). 

I work in the software development world. Let me summarize my experience:

 - When asking AI bots about some well defined programming code, it works. Really Nice! 
 - When asking AI bots about some blur administration task related to 
   operation of systems with many opinionated tools, undefined context, 
   competing companies shelling overlapping products, ... **AI miserably 
   fails**.

  On the other side, when taking notes from experts we can tag 
competing products, highlight pros/cons, take cheat-sheets, annotate 
with use-cases, pending features, stuff like that.<br/>
  We can fetch some "information" and complete some previous note 
(maybe written 4 years ago) so that content that was incomplete starts
to "make sense". Finally, we can take much more sensible decisions.

 It's possible through advanced prompt-engineering to make AI return 
sensible answers .. **but advanced prompt-engineering is way more difficult
and time consuming that just taking and classifying notes**.
 In fact, I would say that taking and classifying notes, **creating a
well defined and stable taxonomy is a "MUST" for "advanced" prompt-engineering**.

