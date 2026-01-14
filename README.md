# TXT World Domination

Serverless CMS (**just plain text!!!**) based on markdown with extensions for
multidimensional taxonomy classification, allowing to navigate the content based
on topics (axes) and subtopics (coordinates).

 This projects aims to provide an easy-to-use tool for "long life" (years or tens of years) 
documentation management.

 Recommended to safely store and classify research (PhD) work, complex software documentation,
complex procedures, book writing, "industrial" web pages. 

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

## Why not using vector databases instead?

This system is fully compatible and complements vector databases but it is oriented to humans and controlled 
by humans.

With a vector database, each token in a paragraph can potentially be converted to an array of vectors (representation)
that allows to keep semantics of the content. On each vector dimension, an "obscure" float (or N-byte) is assigned
according to some embedding algorithm and model. It requires installation of custom software (vector databases) and
changes to the content require slow and frequent reindexing (the content is read only).

With the markdown extension, each block of text or paragraph (or code function/code block) (vs each token) is represented
by the vector (topic1.subtopicA,topic2.subtopicB,...). 
 Humans are in full control of the vector dimensions and, for each vector, a set of well defined 
and human controlled named coordianates are assigned. (vs obscure ML model controlled floats).
 It does not require any custom vector database. The current implementation just run smoothly "inside" a web browser
in a laptop or mobile phone. When the document is loaded, it is quickly parsed (a few tens of seconds for around 1000 pages)
and the vectors updated. The content can be edited (with a notepad) and the vector database will updated in real time.

NOTE 1: I'm using the vector nomenclature for readers used to ML and the vector database world. The running database is
not actually using vectors, because, for a given paragraph a "vector" can be tagged with N different coordinates for
the same dimension axis. For example, we can use a simple markdown to replace bloated JIRA boards. It can be frequent to
see a given paragraph tagged with a "vector" like:
```
HHRR.Linus_Torlvald,HHRR.Ingo_Molnár,HHRR.Moshe_Bar,sprint.01,sprint.02,sprint.03,component.FS,component.Scheduler,...
```

Of course, an LLM or the like can be used to autocomplete the topic.subtopic and vice versa, the topic.subtopic can be 
used to train or help to fine-tune the model. The topic.subtopic can also guide to choose the dimensions for a LoRa 
decomposition matrix, et ce tera.

 Yet, compared from another point of view. A key principle in this project is that the information must be owned by
users and it must continue to be accesible when printing to paper. Scalability or speed is secundary.
Security, independency and full control is paramount. Think of a personal or SME ledger, a human resource
"tableau", a minute book, your notes for a PhD. For book-like content, it is more agile and even faster.
"big libraries" are out of the scope.

NOTE 2: LLMs have become widely known for its emerging capacities. They can be used for task that they were not
previously being training after being trained with billions of data (and probably millions of dollars).

To some extend, this is also the case with this note taking system. As the content is manually "trained" 
(users tag and classify blocks of text) and as the content size increases, emerging relations arise
between content that, aparently, was completly disconnected or decoupled.

## Taking and classifying notes in the era of LLMs and prompt Engineering

Why taking notes in the era of Machine Learning and Large Language Models?

Simply put. They complement each other in a recursive infinite loop:

- LLMs training can be highly improved by providing embedding hints (topics,
subtopics with well defined dimensions vs randomly trained dimensions in 
embeddings).
- Unclassified markdown (and code, and "JIRA" tasks") can make use of LLMs to 
tag current content using the previously defined taxonomy or improving/detailing
the taxonomy.


Also, it's possible through advanced prompt-engineering to make AI return 
contextual and correct answers .. **but advanced prompt-engineering is way more difficult
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

 Before modern "autopilots" the supercheat-sheets created by this project
were probably the best way to help writing code. New big LLM models based
tools can create high quality code with easy. Still, throught out the years,
code will grow out of control and it will be difficult to find duplicated
or pottentially reusable or refactorizable code. By tagging it based on
concerns (security, FE, persistence, integration, ...) and subtopics 
(security.authentication, security.DoS, security....) code management will
be much simpler, both for humans and IAs.


