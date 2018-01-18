#!/usr/bin/env bash
# build for production
npm install
npm run build
rm -fr ./build/data/
sed -i.bak s/\\.\\//\\/SDT\\/html\\/fileReader\\//g build/index.html
rm -f build/index.html.bak
