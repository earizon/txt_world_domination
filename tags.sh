#!/bin/bash

INPUT_L=""
if [[ $# == 0 ]]; then
   INPUT_L=$(find ./ -maxdepth 2 -type f -iname "*txt") # def. to all files in dir and subdirs.
else
   INPUT_L="$*"
fi
cat ${INPUT_L} | \
grep -E "\[\[[^]]*\]\]" | \
 sed -E "s/^.*\[\[[{]?//" | \
 sed -E "s/[}]?\]\].*//" | \
 tr "," "\n" | \
 grep -v "^$" | \
 grep -iv "binary.file" | \
 sed "s/ *//" | \
 tr [:lower:] [:upper:]  | \
 sort | uniq | \
cat -
