#! /bin/sh

# Build the API
cd api
yarn build

# Build web application
cd ../web
yarn build

# Move built web applcation to build/public folder
mv build ../api/build/public
