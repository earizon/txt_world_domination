# Pre-formated and tabulated links

```
┌─ HEAD-Quarters ───────────────────────────────────┐
│<https://github.com/earizon/txt_world_domination/> │
├───────────────────────────────────────────────────┤
│ Quick Links:                                      │
│ (#uml) @[#bpmn]                                   │
│ @[#TXTGeometricsymbols]  @[#TXTMathsymbols]       │
│ @[#TXTWorldDominationAmmunition]  link ext        │
│ @[#TXTWorldDominationCellebration] link ext       │
└───────────────────────────────────────────────────┘
```

## Markdown extension to remove initial whitespaces in pre-formated code

* Allows to work with indented/tabulated spaces in source markdown while removing 
  them in final output, saving precious space in small mobile screens.
        ```
indented colummns
removed from output
vvvvvv
      | Font Styles respect white-space                                       |    
      | (column alignment) in monospace/pre blocks.                           |    
      | ┌─────────────────────┬───────────────────────┬──────────────────────┐|    
      | │_This is a paragraph_│__This is a paragraph__│~~This is an strike~~ │|    
      | │_ with style italic_ │__with style bold__    │~~through paragraph~~ │|    
      | └─────────────────────┴───────────────────────┴──────────────────────┘|    
      ·                                                                       · 
└─────┘                                                                       └────┘
| The Pipe symbol (|) can be used to eliminate whitespace columns to left and right. |
| (Markdown extension, recommended). Pipe symbol itself will be eliminated.          |
         |
         | Yet another indented section.
        ```

* Pre-formated code is a first class citizen. It allows to show txt diagrams,
  asci-art and tabular data profiting for the 2 dimmensions in our monitor.
  2D diagrams content allows to read/walk-over in arbitraty order,
  while standard text is 1-dimensional with a well defined read/walk-over
  order.<br/>
  * Mathematically, they are completly different:
    * Brain likes reading and learning in 1 dimension but ...
      ```
      | input ··> input ··> input ··> input ··> input ··> input ··> ...
      ```
    * Real world and real information is not unidimensional.
      ```
      |  ┌─·· input <······┐
      |  v                 ·
      |input ···> input ··─┤
      |  ·                 ····> input 
      |  ·
      |  └─··> ...
      ```
  * **Dimensions are scarse in the Universe, don't waste them!** [[{doc_has.keypoint}]]


