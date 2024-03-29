#!/bin/sh

files=$(find ./packages/flow-cadut/src -path ./packages/flow-cadut/src/templates -prune -false -o -name \*.js -type f -print0 | xargs -0 egrep -L '(Licensed under the Apache License)|(Code generated from|by)')
if [ -n "$files" ]; then
  echo "Missing license header in:"
  echo "$files"
  exit 1
fi
