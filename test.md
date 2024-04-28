### Embedded HTML

Embedded HTML is disabled except for &gt;br&lt; and HTML comments.

### Block Quotes

> You can insert quotes by
  preceeding each line with `>`.<br/>
  like in this example/test.  
  yet another quotation line.


### Task lists

- [ ] Task 1
- [x] Task 2
- [ ] Task 3
- Regular list item


## Tables  <!-- { -->

| Column 1 | Column 2 | Column 3 | Column 4
|----------|:---------|:--------:|---------:
| default | left | center | right
<!-- } -->

### Table of image file types

| Header                    | Mime type    | Extensions | Description
|---------------------------|--------------|------------|-------------
| `89 50 4E 47 0D 0A 1A 0A` | image/png    | png        | PNG image
| `47 49 46 38 39 61`       | image/gif    | gif        | GIF image
| `FF D8 FF`                | image/jpeg   | jpg jpeg   | JPEG image
| `4D 4D 00 2B`             | image/tiff   | tif tiff   | TIFF image
| `42 4D`                   | image/bmp    | bmp        | Bitmap image
| `00 00 01 00`             | image/x-icon | ico        | Icon image


# TESTS START <!-- { test start -->

# Apropos:

* The original `test_xx_...md` markdown files has two purposes:<br/>
  1. Serve as input data used by functional tests.<br/>
  2. Final up-to-date documentation for users.<br/>

* The original source files for the test is available at:<br/>
  <https://github.com/earizon/txt_world_domination/> (test_XX_...md files)
* The rendered markdown is available at:<br/>
  <https://earizon.github.io/txt_world_domination/viewer.html?payload=test.md>

Some low-level mardown parsing follows:

<!-- } -->

## TEST: scaped p and html tags must be displayed properly:

  ```
  <p> <html>
  └───┬────┘
  (vs hidden as html tags)
  ```

## TEST: MAP ONE-TO-ONE TO DOCUMENTATION: 

[[{DOC_HAS.KEY-POINT]]
* By reading the tests you can learn how to write txt files
  compatible with the TXT World Domination Project.
* By documenting the tests we (developers) can have up-to-date
  documentation for users in a single place.
[[}]]

## TEST: dimensions and coordinates

```
|[[{ topic01.1,{ topic01.2,{ topic01.3]]  <- · topics(dimensions) and subtopics (coord.) must be
|Lorem Ipsum │ topic01.2 │ topic01.3           detected properly and rendered into menu->topics
|│ topic01.1 │ topic01.2 └ topic01.3 [[}]]   · Concatenated blocks declatarions must work properly.
```
```
 │ topic01.1 └ topic01.2 [[}]]               · Termination of blocks must work properly.
```
```
 │ topic01.1                                   When selecting topic01.3, topic01.2, tests01.1
 └ topic01.1 [[}]]                             only the corresponding text inside each block
```

```
    [[{ topic01.1 ]]                           topic01.1 belongs to level 1 block.
```

```
      │        [[{ topic01.2]]                 topic01.2 belongs to level 1 and 2 blocks.
```
```
      │          │        [[{ topic01.3]]      topic01.3 belongs to level 1, 2 and 3:
      │ topic01.1 │ topic01.2 │ topic01.3
      │ topic01.1 │ topic01.2 └ topic01.3      TEST: Select topic01.3 in menu. Level 3 block
      │ topic01.1 │ topic01.2 [[}]]                 must be displayed.
```
```
      │ topic01.1 └ [[}]]                      TEST: Select match parent-blocks up to 1
      │ topic01.1                                    level 2 and 3 block must be displayed.
      │ topic01.1                              TEST: Select match parent-blocks up to 2
      └ [[}]]                                       level 1, 2 and 3 block must be displayed.
```

```
  ┌─[[{topic02. 1.]]  <- TEST: must be parsed as topic02.1
  └─[[}]]                     ignoring whitespaces and final dots(TODO:fix)
```

## TEST subdimensions

  ```
  ┌─[[{topic03]]       topic03.1      <- TEST: selected topic03 must also de/select
  └─[[}]]              topic03.1               topic03.*
  ```


  ```
  ┌─[[{topic03.1]]     topic03.1      <- TEST: selected topic03.1 must also de/select
  └─[[}]]              topic03.1               topic03.1.*
  ```


  ```
  ┌─ [[{topic03.1.1]]  topic03.1.1    <- TEST: selected topic03.1.1 must also de/select
  └─ [[}]]             topic03.1.1             topic03.1.1.
  ```


  ```
  ┌─ [[{topic03.1.1.1]]topic03.1.1.1
  └─ [[}]]             topic03.1.1.1
  ```


  ```
  ┌─ [[{topic03.2]]    topic03.2
  └─ [[}]]             topic03.2
  ```

## TEST: Avoiding clonflicts with Shell-script syntax:

  ```
  [[{forbidden_topic.$}]]            <- TEST: topics including '$' character must be ignored
  [[{$forbidden_topic} ]]               to avoid synxtax conflicts with shell conditional-expressions
  [[{forbidden_topic $}]]               if [[ ... ${SOME_VARIABLE} ... ]]
                                        (This is also useful to create "comments" inside tags)
     └──────┬────────┘
            └ those topics must not appear in topics menu.
  ```

## TEST: grep regex search '*grep.*gex' must display this line.

## TEST: Unicode and AsciiArt by extension must display properly
  (blame OS of if it doesn't).

  ```
  | │ ┌─────┐┌─────────┐┌─────┐ │ ┌─┬─┬┈┈┈┈┬╌──┬─┐ ┐┎─┰┄─┄┰┅┅┒
  | │ │socks││underwear││shirt│ │ │ ┊ ┆╌╌╌╌│     │ ╵┃ ┃   ┃  ┃
  | │ └┬────┘└┬─┬──────┘└┬─┬──┘ │ │ ┊ ┆    │   │ │ │┃ ┃   ┃  ┃
  | │  │      │┌v─────┐  │┌v──┐ │ │ ┊ ┆    │   │ │ │┃ ┃   ┃  ┃
  | └───────────────────────────┘ ├─┼─┼────┼───┼─┤ ┤┠─╂───╂──┨
  |                               └─┴─┴────┴───┴─┘ ┘┖─┸───┸──┚
  | ╔═╦═╗  ╓──╥──╖ ╒══╤══╕ ⎧ ⎧  ⎫
  | ║ ║ ║  ║  ║  ║ │  │  │ ⎪ ⎪  ⎪
  | ╠═╬═╣  ╟──╫──╢ ╞══╪══╡ ⎪ ⎨  ⎬
  | ║ ║ ║  ║  ║  ║ │  │  │ ⎪ ⎪  ⎪
  | ╚═╩═╝  ╙──╨──╜ ╘══╧══╛ ⎭ ⎩  ⎭
  ```

## topic0, topic5 outside any block and must NOT be displayed [[topic0,topic5]]
   in topics menu.

--------------------------------------------

<!-- } tests end -->
  .
  .
  .
ENOUGH WITH TESTING. TIME FOR ...

# TXT World Domination Ammunition !!!

  ```
  | World Domination Tools !!!
  |
  |   World Domination !!!
  |
  |      WORLD DOMINATION !!!
  |
  |      W O R L D    D O M I N A T I O O O O O O O N ! ! !
  |
  |               Ah Ah Ah Ah Ah Ahhhh !!!! >:Ḑ-+-<
  ```

## TXT Diagrams

  ```
  | ┌ <https://arthursonzogni.com/Diagon/>  ───────────────────────────────────────┐
  | │  Quickly create sequence Diagrams, GRAPHs, FlowCharts, Tables, ....          │
  | │  ┌─ Gallery ───────────────────────────────────────┐                         │[[{]]
  | │  │ DIRECTED ACYCLIC GRAPH    │ SEQUENCE DIAGRAM    │                         │[[doc_has.diagram,doc_has.template.UML]]
  | │  │                           │                     │                         │[[doc_has.template.math,PM.low_code]]
  | │  │ ┌─────┐┌─────────┐┌─────┐ │ ┌─────┐       ┌───┐ │                         │[[tool.online,tool.desktop]]
  | │  │ │socks││underwear││shirt│ │ │Alice│       │Bob│ │                         │
  | │  │ └┬────┘└┬─┬──────┘└┬─┬──┘ │ └──┬──┘       └─┬─┘ │                         │
  | │  │  │      │┌v─────┐  │┌v──┐ │    │ Hello Bob! │   │                         │
  | │  │  │      ││pants │  ││tie│ │    │───────────>│   │                         │
  | │  │  │      │└┬──┬──┘  │└───┘ │    │Hello Alice!│   │                         │
  | │  │ ┌v──────v─v┐┌v─────v┐     │    │<───────────│   │                         │
  | │  │ │shoes     ││belt   │     │ ┌──┴──┐       ┌─┴─┐ │                         │
  | │  │ └──────────┘└───────┘     │ │Alice│       │Bob│ │                         │
  | │  │                           │ └─────┘       └───┘ │                         │
  | │  │───────────────────────────┼─────────────────────│                         │
  | │  │  TREE EXAMPLE             │   MATH EXPRESSION   │                         │
  | │  │  Linux                    │                     │                         │
  | │  │   ├─Android               │    1            3   │                         │
  | │  │   ├─Debian                │    ⌠  2        n    │                         │
  | │  │   │  ├─Ubuntu             │    ⌡ x  · dx = ──   │                         │
  | │  │   │  │  ├─Lubuntu         │    0            3   │                         │
  | │  │   │  │  └─Xubuntu         │                     │                         │
  | │  │   │  └─Mint               │                     │                         │
  | │  └─────────────────────────────────────────────────┘                         │
  | └──────────────────────────────────────────────────────────────────────────────┘[[}]]
  ```


## Asciiflow: Box-like drawing with TXT

  ```
  | ┌ <https://asciiflow.com/#/> (Free BOX-like TXT Drawing)  ─────────────────────┐[[{]]
  | │         ┌───────┐    ┌──────┐     IO PORTS                                   │  [[doc_has.template.diagram]]
  | │         │xxxxxxx│    │xxxxxx│     ┌┐┌┐ ┌┐┌┐                                  │  [[doc_has.template.UML]]
  | │         │xxxxxxx│    │xxxxxx│     ││││ ││││                                  │  [[tool.online]]
  | │   ┌─────┴───────┴────┴──────┴─┬───┴┴┴┴┬┴┴┴┴┐                                 │
  | │   │ ┌─Comp.1────┐             │┼┼┼┼┼┼┼│    │                                 │
  | │   │ │           ├────────┐    └───────┘    │                                 │
  | │   │ ├───────────┘        │                 │                                 │
  | │   │ │ ┌──────────┐       │                 │                                 │
  | │   │ └─► GPU UNIT │       │     ┌─Dev.9─────┤                                 │
  | │   │   └─────┬────┘       │     │consectetur│                                 │
  | │   │      ┌──┴────┐  ┌────┴────┐└───────────┤                                 │
  | │   │      │ CACHE │  │ ETH.DEV │  ┌Dev.10───┤                                 │
  | │   └──────┴───────┴──┴─────────┴──┴─────────┘                                 │
  | └──────────────────────────────────────────────────────────────────────────────┘ [[}]]
  ```

## CSVkit: TXT as database

  ```
  | ┌ <https://csvkit.readthedocs.io/en/latest/>  ─────────────────────────────────┐ [[{]]]
  | │ Convert from/to CSV/Excel/SQL-DDBB.      [[tool.desktop,doc_has.CSV]]]       │
  | │ Query CSV using SQL.                                                         │
  | │ No-code statistics on CSV data.                                              │
  | └──────────────────────────────────────────────────────────────────────────────┘ [[}]]
  ```

## GNU Text Utils: Standard TXT utilities in Linux/MacOSX

  ```
  | ┌  <http://gnu.ist.utl.pt/software/textutils/textutils.html> ──────────────────┐ [[{tool.desktop]]]
  | │  sort     : sort lines of text files                                         │
  | │  tsort    : perform topological sort                                         │
  | │  uniq     : remove duplicate lines from a sorted file                        │
  | │  join     : join lines in two files based on common field                    │
  | │  ptx      : produce permuted index of file contents                          │
  | │  cut      : remove columns on each line                                      │
  | │  ...                                                                         │
  | └──────────────────────────────────────────────────────────────────────────────┘ [[}]]
  ```

## ASCiinema: TXT Video recording

  ```
  | ┌  <https://asciinema.org/> ASCII VIDEO ───────────────────────────────────────┐ [[{]]
  | │ Record+share terminal sessions, the simple way.                              │ [[tool.desktop,tool.online]]
  | │ Enjoy a lightweight, purely text-based approach to terminal recording.       │ [[security.audit]]
  | │ Example:  <https://asciinema.org/a/421164>                                   │
  | └──────────────────────────────────────────────────────────────────────────────┘ [[}]]
  ```

## Vim Editor: The King of Text:

  ```
  | ┌─ vim: Then King of text ─────────────────────────────────────────────────────┐ [[{tool.desktop]]
  | │ · Use Ctrl + V for visual block mode ("Paint mode")                          │
  | │ · Pass selected text as STDIN to external txt-command and                    │
  | │   replace it with external txt-command's STDOUT with                         │
  | │   :.!txt-command                                                             │
  | │ · Quick create macros with qq ... (macro) ... q                              │
  | │ · Navigate among block start/end curly braces with                           │
  | │   Alt key + '[' + '{' : Jump to block start.                                 │
  | │   Alt key + '[' + '}' : Jump to block end.                                   │
  | │ · Transform selected text to shell script / tool pipeline with               │
  | │   :.!sh              <- Interpret selected input as shell script.            │
  | │                         replace selection with execution result.             │
  | │   :.!fold -w 70 -s   <- fold is standard in POSIX like systems.              │
  | │                         Any other tool/script accepting STDIN as             │
  | │                         input and writing results to STDOUT will             │
  | │                         work.                                                │
  | └──────────────────────────────────────────────────────────────────────────────┘ [[}]]
  ```

## GNU Core Utils: Txt standard formating tools in Linux/MacOSX

  ```
  | ┌─ <https://www.gnu.org/software/coreutils/> ──────────────────────────────────┐ [[{tool.desktop]]
  | │ · fold: Wrap input lines to fit in specified width                           │
  | │ · fmt : Reformat paragraph text                                              │
  | │ · pr  : Paginate or columnate files for printing                             │
  | └──────────────────────────────────────────────────────────────────────────────┘ [[}]]
  ```

## TXT Bullets

[[{doc_has.template,doc_has.template.bullets]]
  ```
  | ┌─────────────────────────────────────────┐
  | │ Bullets   : · • ●                       │
  | │             ○ ◉ ◙ □   ■    ◔ ◗          │
  | │             ◦ ◌ ◎ ▫ ◘ ▪    ● ◕          │
  | │   SubIndex: ₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₔₕₖₗₘₙₚₛₜ│
  | │ SuperIndex: ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁱⁿ           │
  | └─────────────────────────────────────────┘
  |  ◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛
  |  ◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡
  |    ▲      ▴      ▵      ◓    ◸ ◹   ◜ ◝
  |  ◄ ■ ►  ◂ ▪ ▸  ◃ ◊ ▹  ◐   ◑   ◦
  |    ▼      ▾      ▿      ◒    ◺ ◿   ◟ ◞
  |  ◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡
  |  ◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛◚◛
  |  ▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯
  |  ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮
  ```
[[}]]

## TXT Arrows <!-- { -->

  ```
  [[{doc_has.template.arrows}]]
  | ┌ <https://en.wikipedia.org/wiki/Arrows>
  | │ (Unicode_block) │
  | │ ↖ ↑ ↗  ↔ ↕ ↨    │
  | │ ← ↑ →           │
  | │ ↙ ↓ ↘           │
  | └─────────────────┘
  ```

<!-- } -->

## TXT UML <!-- { -->

  ```
  [[{doc_has.template.UML}]]
  | ┌ UML (Unified Modeling Language) TXT template ───────────────┐ 
  | │  ┌────────────┐   message      ^ dependency  |              │
  | │ ─┼─ UML       │   ─────────►   | ----------> |              │
  | │ ─┼─ Component │                | dependency  |              │
  | │  │            │                | <---------- v              │
  | │  └────────────┘                                             │
  | │  ╭─────╮ ● Initi.state   ◄──  ASSOCIATION ──►  ▲            │
  | │  │state│ ◉ Final.state                         │            │
  | │  ╰─────╯                                       ▼            │
  | │                                                             │
  | │ * GENERALIZATION     │^   * REALIZATION  ^                  │
  | │     par.<───── child ││     ○<╴╴╴╴...   ┆┆                  │
  | │     child ────> par. v│     ···╶╶╶╶>○   v                   │
  | │   "IS A" inheritance        ○ Interfaz                      │
  | │                             ··· Implementation              │
  | │ ● DELEGATION:                                               │
  | │  par.◊───── child          ┌────────┐         ┌────────┐    │
  | │                            │ClassA  │       ┌─│ Shape  │    │
  | │  Makes child part of       ├────────┤       │ ├────────┤    │
  | │  parent class by using     │ shape  ·◊──────┘ │ ...    │    │
  | │  aggregation.              ├────────┤         ├────────┤    │
  | │                            │ draw() │         │ draw() │    │
  | │                            └────────┘         └─▵──────┘    │
  | │ ● COMPOSITION: Every car has an           "IS A"│           │
  | │ ┌────────┐ engine  ┌────────┐        ┌──────────┴─┬───···   │
  | │ │ Car    │◄►-------┤ Engine │     ┌──┴─────┐   ┌──┴────┐    │
  | │ └────────┘         └────────┘     │ Circle │   │Ellipse│    │
  | │ ● Aggregation: Cars may have      COMPOSITION+AGGREGATION   │
  | │ ┌────────┐passengers┌──────────┐  allow  DELEGATION as a    │
  | │ │ Car    │◊─────────┤Passengers│  (SAFER) alternative to the│
  | │ └────────┘          └──────────┘  "IS A" inheritance.       │
  | └─────────────────────────────────────────────────────────────┘
  ```
<!-- } -->


## TXT BPMN: <!-- { -->
(Use Vim block-mode -Ctrl+v- to edit them)

  ```
  | ┌─ BPMN (Business Process Management Network) ────────────────────────────────────────┐
  | │ See also: https://github.com/bpmn-io/bpmn-font/tree/master/dist/font                │
  | │ ○ Start Event, ◎ Intermediary/Boundary Event, ◇ Gateway,                            │
  | │ ◷ Timer Start Event,  ◈ Complex Gateway,                                            │
  | │     ┌──────┐  ┌─────────────┐                ┌──────────────────┬──────────────────┐│
  | │     │ Task │  │○ Expanded   │   ▴            │     Actor A      │    Actor B       ││
  | │     └──────┘  │  Subproccess│  ◂ ▸           ├──────────────────┼──────────────────┤│
  | │               └─────────────┘   ▾            │      ○           │                  ││
  | │  ┌─┬─ Pool Participant "A" ─────────────────┐│      ·           │    ┌──────────┐  ││
  | │  │A│                            Some con-   ││      ▼           │ ┌·▸│○ Expanded│  ││
  | │  │c│    ┌──────┐  ┌──────────┐     • dition?││   ┌──────┐       │ │  │  Subproc.│  ││
  | │  │t│○··▸│ Task •·▸│○ Expanded│    ╱ ╲       ││   │ Task •·········┘  └───•──────┘  ││
  | │  │o│    └──────┘  │  Subproc.•··▸• ? ▸ No   ││   └──────┘       │        ▾ Some    ││
  | │  │r│              └──────────┘    ╲ ╱       ││                  │       ╱ ╲ condi- ││
  | │  │ │                               ▾        ││                  │    NO◂   • tion? ││
  | │  │A│                              Yes       ││                  │       ╲ ╱        ││
  | │  └─┴────────────────────────────────────────┘│                  │        ▾         ││
  | │                                              │                  │       YES        ││
  | └─────────────────────────────────────────────────────────────────────────────────────┘
  ```
<!-- } -->

## TXT Geometric symbols <!-- { -->

  ```
  | <https://www.w3schools.com/charsets/ref_utf_geometric.asp>
  |   ▴   ▵          ◸ ◹ ◜ ◝ ◠  ◄ ► │
  |  ◂ ▸ ◃ ▹         ◺ ◿ ◟ ◞ ◡  ◊   │
  |   ▾   ▿          ◴ ◵ ◶ ◷        │
  | 
  | ┌─┬─┬┈┈┈┈┬╌──┬─┐ ┐┎─┰┄─┄┰┅┅┒ ╔═╦═╗  ╓──╥──╖ ╒══╤══╕ ⎧⎧ ⎧     ⎫
  | │ ┊ ┆╌╌╌╌│     │ ╵┃ ┃   ┃  ┃ ║ ║ ║  ║  ║  ║ │  │  │ ⎭⎪ ⎪⎧   ⎫⎪
  | │ ┊ ┆    │   │ │ │┃ ┃   ┃  ┃ ╠═╬═╣  ╟──╫──╢ ╞══╪══╡  ⎪ ⎨⎨   ⎬⎬
  | │ ┊ ┆    │   │ │ │┃ ┃   ┃  ┃ ║ ║ ║  ║  ║  ║ │  │  │  ⎪ ⎪⎩   ⎭⎪
  | ├─┼─┼────┼───┼─┤ ┤┠─╂───╂──┨ ╚═╩═╝  ╙──╨──╜ ╘══╧══╛  ⎭ ⎩     ⎭
  | │ │ ┇    │   │ │ │┃ ┃   ┃  ┃ xxx       ╲ ╱ ╱╲  ╱╲    •     ▴
  | │ │ ┇    │   │ │ │┃ ┃   ┃  ┃ └ yyy      ╳  ╲╱ ╱◜◝╲  ╱ ╲   ╱ ╲
  | │ │ ┇    │   │ │ ╷┃ ┃   ┃  ┃   ├ zzz   ╱ ╲    ╲◟◞╱ •   • ◂   ▸
  | └─┴─┴────┴───┴─┘ ┘┖─┸───┸──┚   └ ...           ╲╱   ╲ ╱   ╲ ╱
  | └╴──┴─────╶┘                                         •     ▾
  ```
<!-- } -->

## TXT Math symbols <!-- { -->

  ```
  | Unicode Symbols                                                                  |
  |  <https://www.unicode.org/charts/PDF/U2200.pdf>                                  |
  | ● ORDER RELATIONS             ● LOGICAL OPs                                      |
  |   ≺ ≻ PRECEDES/SUCCEEDS         ∧ LOGICAL AND                                    |
  |                                 ∨ LOGICAL OR                                     |
  |   ≼ ≽ PRECEDES/SUCCEEDS OR EQUALS                                                |
  |   ≾ ≿ PRECEDES/SUCCEEDS OR EQUIVALENT-TO                                         |
  |   ⊀ ⊁ DOES NOT PREC./SUCC.                                                       |
  |                                                                                  |
  | ● MISCELLANEOUS               ● SET MEMBERSHIP                                   |
  |   ∞   INFINITY                  ∈ ∉ ELEMENT OF                                   |
  |   π   PI                        ∋ ∌ CONTAINS AS MEMBER                           |
  |   ∀   FOR ALL                 ● SET RELATIONS:                                   |
  |   ʗ   COMPLEMENT                ⊂ ⊄ (NOT) A SUBSET OF                            |
  |   ∂   PARTIAL DIFFERENTIAL      ⊃ ⊅ (NOT) SUPERSET OF                            |
  |   ∃ ∄ THERE DOES(/NOT) EXISTS   ⊆ ⊇ SUB/SUPER-SET OF OR = TO                     |
  |   Ø   EMPTY SET               ● SET OPERATIONS:                                  |
  |   Δ   "DELTA" Inc|Laplace Op    ∩ INTERSECTION                                   |
  |   ∇   "NABLA" gradient,         ∪ UNION                                          |
  |   ∴ ∵ THEREFORE,  BECAUSE       ⋃  n-ary UNION                                   |
  |                                                                                  |
  | ● N-ary operators        ● OPERATORS             ● INTEGRALS                     |
  |   (N inputs, 1 output)     ±                       ∫ ∫∫ ∫∫∫  (DOUBLE/...)        |
  |   ∏ N-ARY PRODUCT          ∘ RING OPERATOR         ∲ ∲ (ANTI)CONTOUR INT.        |
  |   ∐ N-ARY COPRODUCT        √∛∜ SQUARE/... ROOT     ∲∲ ∲∲∲ SURFACE/VOLUME         |
  |   Σ N-ARY SUMMATION        α PROPORTIONAL TO       ∱ CLOCKWISE INTEGRAL          |
  |                                                                                  |
  | ● RELATION                      ● "QUANTITATIVE" RELATIONS                       |
  |   ∣ ∤ DOES (NOT) DIVIDES          ≤ ≥ LESS/GREATER-THAN OR = TO                  |
  |   ǁ ∦ (NOT) PARALLEL TO           ≦ ≧ LESS/GREATER-THAN OVER = TO                |
  |   ∶   RATIO                       ≨ ≩ LESS/GREATER-THAN BUT NOT = TO             |
  |   ∷   PROPORTION                  ≮ ≯ NOT LESS/GREATER-THAN                      |
  |   ∺   GEOMETRIC PROPORTION        ≰ ≱ NEITHER LESS/GREA.-THAN NOR = TO           |
  |   ≃ ≄ (!) ASYMPTOTICALLY = TO     ≲ ≳ LESS/GREA.-THAN OR EQUIVALENT TO           |
  |   ≅   APPROX. EQUAL TO            ≴ ≵ NEITHER LESS/GREATER-THAN                  |
  |   ≆   APPROX. BUT NOT EQUAL           NOR EQUIVALENT TO                          |
  |   ≇   NEITHER APPROX. NOR ACTUA.  ≶ ≷ LESS/GREATER-THAN OR GREATER-THAN          |
  |   ≈ ≉ (!) ALMOST EQUAL TO         ≸ ≹ NEITHER LESS/GREATER-THAN                  |
  |   ≊   ALMOST EQUAL OR EQUAL TO        NOR GREATER-THAN                           |
  |   ≍ ≭ (!) EQUIVALENT TO                                                          |
  |   ≖   RING-IN EQUAL TO          ● GROUP RELATIONS                                |
  |   ≗   RING EQUAL                  ⊲ ⋪ (NOT) NORMAL SUBGROUP OF                   |
  |   ≝   EQUAL TO BY DEFINITION      ⊴ ⋬ (NOT) NORMAL SUBGROUP OF                   |
  |   ≞   MEASURED BY                     OR = TO                                    |
  |   ≟   QUESTIONED EQUAL TO         ⊳ ⋫ DOES (NOT) CONTAIN AS                      |
  |   ≠   NOT EQUAL TO                    NORMAL SUBGROUP                            |
  |   ≡ ≢ (NOT) IDENTICAL TO          ⋭ ⊵ DOES (NOT) CONTAIN AS                      |
  |   ≣   STRICTLY EQUIVALENT TO          NORMAL SUBGROUP                            |
  |                                                                                  |
  | ● https://en.wikipedia.org/wiki/Mathematical_Operators_(Unicode_block)           |
  |     0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F                |
  | U+220x  ∀   ∁   ∂   ∃   ∄   ∅   ∆   ∇   ∈   ∉   ∊   ∋   ∌   ∍   ∎   ∏            |
  | U+221x  ∐   ∑   −   ∓   ∔   ∕   ∖   ∗   ∘   ∙   √   ∛   ∜   ∝   ∞   ∟            |
  | U+222x  ∠   ∡   ∢   ∣   ∤   ∥   ∦   ∧   ∨   ∩   ∪               ∮   ∯            |
  | U+223x  ∰   ∱   ∲   ∳   ∴   ∵   ∶   ∷   ∸   ∹   ∺   ∻   ∼   ∽   ∾   ∿            |
  | U+224x  ≀   ≁   ≂   ≃   ≄   ≅   ≆   ≇   ≈   ≉   ≊   ≋   ≌   ≍   ≎   ≏            |
  | U+225x  ≐   ≑   ≒   ≓   ≔   ≕   ≖   ≗   ≘   ≙   ≚   ≛   ≜   ≝   ≞   ≟            |
  | U+226x  ≠   ≡   ≢   ≣   ≤   ≥   ≦   ≧   ≨   ≩   ≪   ≫   ≬   ≭   ≮   ≯            |
  | U+227x  ≰   ≱   ≲   ≳   ≴   ≵   ≶   ≷   ≸   ≹   ≺   ≻   ≼   ≽   ≾   ≿            |
  | U+228x  ⊀   ⊁   ⊂   ⊃   ⊄   ⊅   ⊆   ⊇   ⊈   ⊉   ⊊   ⊋   ⊌   ⊍   ⊎   ⊏            |
  | U+229x  ⊐   ⊑   ⊒   ⊓   ⊔   ⊕   ⊖   ⊗   ⊘   ⊙   ⊚   ⊛   ⊜   ⊝   ⊞   ⊟            |
  | U+22Ax  ⊠   ⊡   ⊢   ⊣   ⊤   ⊥   ⊦   ⊧   ⊨   ⊩   ⊪   ⊫   ⊬   ⊭   ⊮   ⊯            |
  | U+22Bx  ⊰   ⊱   ⊲   ⊳   ⊴   ⊵   ⊶   ⊷   ⊸   ⊹   ⊺   ⊻   ⊼   ⊽   ⊾   ⊿            |
  | U+22Cx  ⋀   ⋁   ⋂   ⋃   ⋄   ⋅   ⋆   ⋇   ⋈   ⋉   ⋊   ⋋   ⋌   ⋍   ⋎   ⋏            |
  | U+22Dx  ⋐   ⋑   ⋒   ⋓   ⋔   ⋕   ⋖   ⋗   ⋘   ⋙   ⋚   ⋛   ⋜   ⋝   ⋞   ⋟            |
  | U+22Ex  ⋠   ⋡   ⋢   ⋣   ⋤   ⋥   ⋦   ⋧   ⋨   ⋩   ⋪   ⋫   ⋬   ⋭   ⋮   ⋯            |
  | U+22Fx                  ⋴   ⋵   ⋶   ⋷   ⋸   ⋹   ⋺   ⋻   ⋼   ⋽   ⋾   ⋿            |
  ```
<!-- } -->

## Greek&Related Symbols ("Physics symbols")  <!-- { -->

  ```
  | Alpha   A,α   Eta     Η,η     nu       Ν,ν     Tau     Τ,τ     |
  | Beta    B,β   Theta   Θ,θ│ϑ   Xi       Ξ,ξ     Upsilon Υ,υ│ϒ   |
  | Gamma   Γ,γ   Iota    Ι,ι     Omicron  Ο,ο     Phi     Φ,φ     |
  | Delta   Δ,δ   Kappa   Κ,κ     Pi       Π,π│ϖ   Chi     Χ,χ     |
  | Epsilon Ε,ε   Lamda   Λ,λ     Rho      Ρ,ρ     Psi     Ψ,ψ     |
  | Zeta    Ζ,ζ   Mu      Μ,μ     Sigma    Σ,ς│σ   Omega   Ω,ω     |
  ```
<!-- } -->

<br/><br/>
# ─────────────────────────────────────────────────

 If you are reading this paragraph, TXT already dominates the World,
 Time for Fun and Celebration!!

# TXT World Domination Cellebration
## TXT GAMES!!! <!-- { -->

* Tetrisfy your TXT enemies with this Tetris clone for terminals:
  <http://fph.altervista.org/prog/bastet.html> [[{games.tetris}]]

* Puzzle your terminal:</br>
  <https://github.com/bfontaine/term2048> [[{games.puzzle}]]

* The World is now under control, time for TXT Moon Domination!!!
  <https://www.seehuhn.de/pages/moon-buggy> [[{games.moon_buggy}]]

* TXT is not afraid of Dungeons and Dragons!!! 
  <https://www.nethack.org/>  [[{games.NetHack,doc_has.dragon}]]


* Defend your TXT from alien invaders!!! <br/>
  <https://linuxcommandlibrary.com/man/ninvaders> 
  [[{games.ninvaders,PM.TODO.save_the_planet}]]


* Don't let your TXT eat itself!!! <br/>
  <https://askubuntu.com/questions/376558/how-to-play-snake-in-terminal>
  [[{games.snake}]]

* Pacman is here!!! <br/>
  <https://howtoinstall.co/en/pacman4console>
  [[{games.pacman,HHRR.staff.pacman}]]

<!-- } -->
