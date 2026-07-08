# TXT World Domination. "The Wise Books"

 Serverless CMS (**just plain text!!!**) based on markdown with a set of
minimal extensions providing **emerging knowledge** without all the burden of
expending thousands of millions in data centers and GPUs, just vanilla text
with best pattern classification practices.

## Daily use

1. Using your favourite text editor, you write arbitrary content in mardown.
  A single markdown can represent a quick note, a new idea, a draft,
  some TO-DO task, ... anything.
2. On each paragraph you add different tags like `[[topic_A.subtopic01,topic_B.subtopic02]]`.<br/>
  You can think of it as the Twitter "#hastags" ... but don't get cheated:<br/>
  using "topic" as "dimension" or "dimension axis" and subtopics as "coordinate"
  (position relative or projected into to the topic "dimension axis") will
  provide you and your notes super-powers in the long term.
3. Once your notes in markdown are in place, you can group them togheter
  forming a full chapter, and then you can group a set of chapters into
  a book using payloads. A payload is just a simple txt files similar to:
4. Emerging knowledge arise for free  "a la LLM" as you add more content
   and keeps tagging content based on cross-related content.

  ```
  |    Arbitrary set               Arbitrary set
  |    of markdown files           of markdown files
  |    and payload files           and payload files
  |          ·                            ·
  |          v                            v
  | ┌─ full_book.payload ───┐ ┌>┌ chapter01/ALL.payload ┐ ┌>┌ chapter01/basic_concepts.md ─────┐
  | │                       │ │ │                       │ │ │                                  │
  | │ introduction.md       │ │ │ basic_concepts.md     ··┘ │ # A brief tour of ...            │
  | │ chapter01/ALL.payload··─┘ │ advanced_concepts.md  │   │ [[{PM.WiP,doc_has.tutorial]]     │
  | │ chapter02/ALL.payload │   │ lab_exercises.md      │   │ Let's examine the principles and │
  | │ chapter03/ALL.payload │   │ TO_DO_complete.md     │   │ building blocks of this materia. │
  | │ ...                   │   │ ...                   │   │ ...                              │
  | │ final_notes.md        │   │ ...                   │   │ ...                              │
  | └───────────────────────┘   └───────────────────────┘   └─────^────────────────────────────┘
  |                                                               ·
  | ┌─ basics_book.payload ─┐ ┌─>┌ chapter01/101.payload ┐        ·
  | │ chapter01/101.payload··─┘  │ basic_concepts.md  ···········─┘
  | │ chapter02/101.payload··─┐  └───────────────────────┘
  | │ chapter03/101.payload │ │
  | │ ...                   │ └─>┌ chapter02/101.payload ┐
  | └───────────────────────┘    │ basic_concepts.md     │
  |                              └───────────────────────┘
  |
  |  File system layout (local files and folders):
  |
  |   <some base folder>/
  |   ├─ introduction.md
  |   ├─ full_book.payload
  |   ├─ basics_book.payload
  |   ├─ final_notes.md
  |   ├─ chapter01/
  |      ├─ basic_concepts.md
  |      ├─ advanced_concepts.md
  |      ├─ ...
  |   ├─ chapter02/
  |      ├─ ...
  |   ├─ ...
  ```

4. Use the free and open source viewer provided in this project to profit from
   the tag and payload extensions to standard markdown (hopefully a new version
   of markdown will standarize it and make them available to any other viewer).

 This projects aims to provide an easy-to-use tool for "long life" (years or tens of years)
documentation management:
- Information is written tagged, classified, updated and then grouped in a single place,
  (either by humans or AI agents), versioned in git and consulted as a book or as book
  "views".


## Use cases

- store and classify research (PhD) work.
- complex software documentation.
- complex procedures.
- technical book writing.
- industrial web pages. (not fancy, but quick).
- AI Prompt database:<br/>
   As a new army of "awesome prompts" continue to
  grow, you need some place to keep them stored
  and classified.

 Since content is just plain text (vs some weird binary database format) it means that many tools can
be reused to [edit](https://en.wikipedia.org/wiki/Comparison_of_text_editors) and
[manage](https://ftp.gnu.org/old-gnu/Manuals/textutils-2.0/html_mono/textutils.html) the content
following the "Do one thing and do it right!" UNIX philosophy.

Next features come for free:
- offline work. No need for server-client (and network) setup.
- No need for complex tooling:<br/>
  - Notepad must be good enough.
  - Notepad++ will make of you a proffesional "Wise Book" maker.
  - [vim](https://www.vim.org/)/[neovim](https://neovim.io/) will provide you with super-powers.
- Git friendly automatically providing for:
  - Advanced peer-2-peer collaboration.
  - Content versioning.
  - Distributed content replication.
  - advanced audits of changes.
- No vendor lock-in into binary formats.
- Resilient to attack vectors. The source content database can be printed
  to paper.<br/>

Do you want to use AI to help you with your notes?

Go ahead!!!. It's all plain text, so any LLM or agentic flow
will feel at home with the Wise Books.

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

## Markdown sets

* Sets or subsets of text files (markdown, source code) can be grouped
  into a single "big" final virtual file through "payload" lists.
   The list is just a normal txt file indicating on a each new line the
  list of markdown files to concatenate in order to form the final
  markdown document. Example:

- Example (Opinionated) Content layout:<br/>
  The content is divided in chapters, and is chapter contains 5 sections related to
  101 (basic/introductory) content, intermediate level, advanced, best patterns
  and security related notes.

  ```
  |  ────────────────────────────────────────────────────────────────────────────────────
  |  Full content ───────────────────────────────────────────────────────────────────────
  |  ────────────────────────────────────────────────────────────────────────────────────
  |
  |  CHAPTER1/101.md             CHAPTER2/101.md               CHAPTER3/101.md
  |  CHAPTER1/intermediate.md    CHAPTER2/intermediate.md      CHAPTER3/intermediate.md
  |  CHAPTER1/advanced.md        CHAPTER2/advanced.md          CHAPTER3/advanced.md
  |  CHAPTER1/best_patterns.md   CHAPTER2/best_patterns.md     CHAPTER3/best_patterns.md
  |  CHAPTER1/security.md        CHAPTER2/security.md          CHAPTER3/security.md
  |
  |  CHAPTER4/...                CHAPTER5/...                  CHAPTER6/...
  |  ...
  |
  |  CHAPTER7/...                CHAPTER8/...                  CHAPTER9/...
  |  ...
  |
  |
  |  ────────────────────────────────────────────────────────────────────────────────────
  |  content sets (sub-books) == payload file ───────────────────────────────────────────
  |  ────────────────────────────────────────────────────────────────────────────────────
  |
  |  101.payload           intermediate.payload         advanced.payload
  |  ---------------       --------------------         --------------------
  |  CHAPTER1/101.md       CHAPTER1/intermediate.md     CHAPTER1/advanced.md
  |  CHAPTER2/101.md       CHAPTER2/intermediate.md     CHAPTER2/advanced.md
  |  CHAPTER3/101.md       CHAPTER3/intermediate.md     CHAPTER3/advanced.md
  |  CHAPTER4/101.md       CHAPTER4/intermediate.md     CHAPTER4/advanced.md
  |  CHAPTER5/101.md       CHAPTER5/intermediate.md     CHAPTER5/advanced.md
  |  CHAPTER6/101.md       CHAPTER6/intermediate.md     CHAPTER6/advanced.md
  |  CHAPTER7/101.md       CHAPTER7/intermediate.md     CHAPTER7/advanced.md
  |  CHAPTER8/101.md       CHAPTER8/intermediate.md     CHAPTER8/advanced.md
  |  CHAPTER9/101.md       CHAPTER9/intermediate.md     CHAPTER9/advanced.md
  |
  |
  |  best_patterns.payload        security.payload
  |  ----------------------       --------------------
  |  CHAPTER1/best_patterns.md    CHAPTER1/security.md
  |  CHAPTER2/best_patterns.md    CHAPTER2/security.md
  |  CHAPTER3/best_patterns.md    CHAPTER3/security.md
  |  CHAPTER4/best_patterns.md    CHAPTER4/security.md
  |  CHAPTER5/best_patterns.md    CHAPTER5/security.md
  |  CHAPTER6/best_patterns.md    CHAPTER6/security.md
  |  CHAPTER7/best_patterns.md    CHAPTER7/security.md
  |  CHAPTER8/best_patterns.md    CHAPTER8/security.md
  |  CHAPTER9/best_patterns.md    CHAPTER9/security.md
  |
  |
  |
  |  ────────────────────────────────────────────────────────────────────────────────────
  |  Full book ("standar book) = ALL.payload with subpayloads. ──────────────────────────
  |  ────────────────────────────────────────────────────────────────────────────────────
  |
  |  CHAPTER1/ALL.payload <·· Each CHAPTER"N"/ALL.payload just list
  |  CHAPTER2/ALL.payload     all the files in the CHAPTER
  |  CHAPTER3/...
  |  ...                      CHAPTER1/ALL.payload
  |                           --------------------
  |                           101.md
  |                           intermediate.md
  |                           advanced.md
  |                           best_patterns.md
  |                           security.md
  |
  |  ALL.payload
  |  -----------
  |  CHAPTER1/ALL.payload
  |  CHAPTER2/ALL.payload
  |  CHAPTER3/ALL.payload
  |  CHAPTER4/ALL.payload
  |  CHAPTER5/ALL.payload
  |  CHAPTER6/ALL.payload
  |  CHAPTER7/ALL.payload
  |  CHAPTER8/ALL.payload
  |  CHAPTER9/ALL.payload
  ```

## Wise Books for Advanced Project Management


- Project management becomes just another set of payloads and markdown files
  that you can track at will in a git repository.

  ```
  |  TASKS.payload     
  |  -----------------
  |  CHAPTER1/TASKS.md
  |  CHAPTER2/TASKS.md         
  |  CHAPTER3/TASKS.md      
  |  CHAPTER4/TASKS.md         
  |  CHAPTER5/TASKS.md         
  |  CHAPTER6/TASKS.md         
  |  CHAPTER7/TASKS.md         
  |  CHAPTER8/TASKS.md         
  |  CHAPTER9/TASKS.md         
  |                            
  |                            
  |  Tag TASKS.md content with any suitable "topic.subtopic" in order to
  |  track and control your topic at will. Example topic/subtopics:
  |                                                                       
  |    TOPIC       .SUBTOPICs
  |  ┌─────────┐ ┌───────────────────────────────────────────────────────┐
  |  │ PM      │ │ .SPRINT_N   .BACKLOG     .RADAR     .BLOCKED   .RISK  │
  |  │ HHRR    │ │ .Unassigned .John        .Catherine                   │
  |  │ DOC_HAS │ │ .report     .comparative .keypoint  .meeting_out  ... │
  |  │ domain  │ │ .domain1    .domain2     .domain3   ....              │
  |  │ ...     │ │ ...                                                   │
  |  └─────────┘ └───────────────────────────────────────────────────────┘

  ```

- Now you can apply all that you learn in expensive Project Management
  courses without depending on any opinionated software.

- **Your brain is the software and your project is a wise book now**!!!

## Real World Documentation

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

## Future work: Wise Books as Agentic Memory

  While the purpose of the project was to make content easy to retrieve and
classify for human beings, it is pretty clear that the new Agentic World also
love markdown, "zipped" notes and simple RAGs that allows to quickly retrive
context information for the next prompt and yeah!!!  the wise books is also a
wise agent memory!

 Semantic database and custom token embeddings can still be used to retrive
new context for you next GPT prompt but ... most probably filtering by topic.suptopic
is more than enough in many scenarios **if you (and/or your agent) took care of
properly tagging with consistent taxonomies/topic coordinates**!.

  Not only that, topic/subtopic filtering and retrieval is deterministic and you
are in full control. In contrats, vector embedding and semantic search are obscure
and opaque and they just work by "brute force", by creating hundreds of dimensions
and uncontrolled floating point for each and every one of the thousands of tokens
in a given "book". Worst even, they ussually don't match the final embedding
using by your GPT when doing inference, so they need to be converted back to
human text and many tricks applied.
