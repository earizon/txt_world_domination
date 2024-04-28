# Hyperlinks

1. Hello [**link**](https://rsms.me/) lol "cat"
2. Hello from *[link](https://rsms.me/)* to __everyone__ `reading this`
3.  Here's an [**important** anchor link](#example).

## TEST: internal links must be converted properly:
 @[#internalLink1] @[#internalLink2]

## TEST: External links must be converted properly:
*  Go to <https://www.w3.org/>
*  Go to <https://www.ietf.org/>
*  Go to <https://www.ieee.org/>

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
## TEST: Internal Links:

 ```
 | #[internalLink1] must link here.
 | ^              ^
 | └──────────────┴ - width of original text must not change when replaced by
 |                  - html anchor.
 |                  - text must be converted to anchor with correct sytles.
 |
 |  Pressing back in browser must scroll up to original link
 |
 |
 |
 |
 |
 |
 |
 |
 |
 |  --------------------------------------------
 | #[internalLink2] must link here.
 | ^              ^
 | └──────────────┴ - width of original text must not change when replaced by
 |                  - html anchor.
 |                  - text must be converted to anchor with correct sytles.
 |  Pressing back in browser must scroll up to original link
```



