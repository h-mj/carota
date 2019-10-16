#! /bin/sh

# Build all packages
yarn lerna run build

# Move built web applcation to build/public folder
mv packages/web/build packages/server/build/public
