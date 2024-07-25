# TXT World Domination

$$ int{}

Serverless CMS (**just plain text!!!**) with a supporting
[ligtweight HTML viewer](https://github.com/earizon/txt_world_domination/blob/main/viewer.html) and
a [micro db-engine](https://github.com/earizon/txt_world_domination/blob/main/txt_ddbb_engine.js)
supporting multidimensional taxonomy classification to navigate the content based on topics and subtopics.

 This projects aims to provide an easy-to-use tool for "long life" (years or tens of years) 
documentation management.

 Recommended to safely store and classify research (PhD) work, complex software documentation,
complex procedures, book writing, "industrial" web pages.

get an idea of daily ussage.

Since content is just plain text (vs some weird binary database format) it means that many tools can be reused to
[edit](https://en.wikipedia.org/wiki/Comparison_of_text_editors) and
[manage](https://ftp.gnu.org/old-gnu/Manuals/textutils-2.0/html_mono/textutils.html) the content
following the "Do one thing and do it right!" UNIX philosophy.

By reusing standard text (markdown) next features comes for free:

- offline work. No need for server-client (and network) setup. 
  
- No need for complex tooling. Notepad must be good enough.
  
- Git friendly. Advanced peer-2-peer collaboration and content versioning out of the box !!!
  
- No vendor lock-in into binary formats. 

- Resilient to attack vectors. The source database can be printed to paper and
  it will still be readable when the hackers knock down the Internet.<br/>

  - Git like systems provide "automatic" distributed content replication and advanced
    audits of changes.

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
