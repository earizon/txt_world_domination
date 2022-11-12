#!/bin/bash

cat $* | \
grep -E "\[\[[^]]*\]\]" | \
 sed -E "s/^.*\[\[[{]?//" | \
 sed -E "s/[}]?\]\].*//" | \
 tr "," "\n" | \
 grep -v "^$" | \
 grep -iv "binary.file" | \
 tr [:lower:] [:upper:]  | \
 sort | uniq | \
cat -
