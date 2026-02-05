## TEST: dimensions and coordinates "dirty" (low level) tests.

  topics(dimensions) and subtopics (coord.) must be detected properly 
and rendered into menu->topics Concatenated blocks declatarions must 
work properly:

```
|[[{ topic01.1, { topic01.2, { topic01.3 ]]  <·· "dirty" anidated { start blocks must work properly.
|Lorem Ipsum │ topic01.2 │ topic01.3      
|│ topic01.1 │ topic01.2 └ topic01.3 [[}]]
```
```
 │ topic01.1 └ topic01.2 [[}]]               · Termination of blocks must work properly.
```
```
 │ topic01.1                                   When selecting topic01.3, topic01.2, tests01.1
 └ topic01.1 [[}]]                             only the corresponding text inside each block is displayed
```

```
    [[{ topic01.1 ]]                           topic01.1 belongs to level 1 block.
```

```
      │        [[{ topic01.2]]                 topic01.2 belongs to level 1 and 2 blocks.
```
```
      │           │        [[{ topic01.3]]      topic01.3 belongs to level 1, 2 and 3:
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

## TEST: horphan topics

topic0, topic5 outside any block and must NOT be displayed in topics menu. [[topic0,topic5]]

## TEST: "fine" vs "coarse" paragraph topic tagging.


[[{ topicA.coarse ]]  **START OF TOPIC A (and C)**.
paragraph A: Lorem Ipsum to dominate the World
bla bla bla .....<br/>
When filtering by topicA.coarse all paragraphs up to
closing curly braces will be displayed. This includes
paragraph A, B and C.

paragraph B: Lorem Ipsum to dominate the World
bla bla bla ....  [[{ topicB.fine } ]] ¹
**start-end of topicB** (notice the curly braces).<br/>
displayed. We need to select "match parent blocks up to 1" 
to display also the "surrounding" parent block.

paragraph C: Lorem Ipsum to dominate the World
bla bla bla ....  [[ topicC.coarse ]] ¹
** topicC.coarse added "along" with topicA.coarse in the same
block . (notice there are not new curly braces). </br>
When filtering by topicC.coarse all paragraphs from opening
to closing (current) curly braces will be displayed.
This includes paragraph A, B and C. 

[[ topicA.coarse }]]  **END OF TOPIC A (and C)**.

paragraph D: Yet another paragraph tagged with topicB.file [[{topicB.fine}]].<br/>
Notice, that when filtering by "topicB.fine" this paragraph is
displayed along with paragraphB, but when adding "AND" "topicA.coarse"
only paragraph B will be displayed, but not this one.
topicA.coarse will filter out anything not tagged with this topic.subtopic,
then topicB.fine will filter even more.

A best practice is not to abuse of "fine" block tagging, since we loose 
"surrounding" context with easy.



