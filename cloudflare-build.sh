#!/bin/bash
npm run generate
if [ ! -d "dist" ]; then
  mkdir dist
  mv .output/public/* dist/
fi