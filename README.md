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
* [Cryptography notes](https://earizon.github.io/txt_world_domination/viewer.html?payload=../cryptography/ALL.payload)
* [Software Architecture](https://earizon.github.io/txt_world_domination/viewer.html?payload=../SoftwareArchitecture/ALL.payload)
* [PostgreSQL Architecture](https://earizon.github.io/txt_world_domination/viewer.html?payload=../PostgreSQL/notes.txt)

## Taking and classifying notes "vs" LLM AI and prompt Engineering

Why taking notes in the era of Machine Learning and Large Language Models?

Simply put. They complement each other:

- LLM responses are just stochastic answers. They look to make sense, but
they completely ignore the real world outside its "buffer" context.
- When taking notes we can just "reuse" the knowledge of experts posting in
magazines, research papers, reddit, coffee chats, ...

 AI works "fine" when applied to limited (not necesarely small) contexts,
for example, basic programming tasks or (not so basic) math-like tasks with
a well defined set and operations (algebraic problems, chess-like problems, ...). 

I work in the software development world. Let me summarize my experience:

 - When asking AI bots about some well defined programming code, it works. 
   Really Nice! 
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

 We can ask an LLM bot about solving a task and many times it will work.
Some questions arise:

  * how do we know that we are asking the correct question in first place?
    **Maybe the LLM ends up given the correct answer to the wrong question**.
  * how do we know that an answer was the best answer?.
  * Will the proposed solution evolve with time?.
  * Is there some other area of knowledge, technology, standard or
    trending are that also works and maybe was better in the long 
    term?.

 We are asking the LLM because we ignore the solution in first place,
so we probably ignore alternative solutions and probably we ignore 
many other things (remember the **risk of the unknown unknowns**.).
If we take notes about related tasks, and related alternatives for 
similar problems, we can now add such information to our prompt and 
we can also consider filling with "orthogonal" aspects (QA, security, 
standarization, best patterns, ...). In this way we help the LLM to 
reduce the problem dimensionality and our prompt will be a much more 
efficient prompt.

 Needeless to say, an LLM can also help us to design our taxonomy by
suggesting topics and subtopics. In that sense, both systems can feed
each other in an infinite loop. Great, isn't it?
