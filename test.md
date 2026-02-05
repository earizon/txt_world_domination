### Embedded HTML

Embedded HTML is disabled except for &gt;br&lt; and HTML comments.

# ABOUT TESTS <!-- { test start -->

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

--------------------------------------------
