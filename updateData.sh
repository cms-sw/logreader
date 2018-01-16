#!/usr/bin/env bash

# this script downloads testing data from the git repository for development purpose
rm -fr ./public/data/
svn checkout https://github.com/cms-sw/cms-sw.github.io/trunk/_data
mv ./_data ./public/data/
