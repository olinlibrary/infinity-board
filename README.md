# InfinityBoard
## Kyle Combes, Matt Brucker, Tobias Shapinsky

InfinityBoard is a digital canvas with real-time collaborative editing
for sharing pictures and text. The ability to pan infinitely means
you'll never run out of collaborative and creative space.

![InfinityBoard screenshot](https://imgur.com/eg5OZmF.png)

# Documentation

  * [Frontend React app](http://htmlpreview.github.io/?https://github.com/olinlibrary/infinity-board/blob/master/docs/app.html)
  * [Backend server](http://htmlpreview.github.io/?https://github.com/olinlibrary/infinity-board/blob/master/docs/server.html)

![](docs/UMLDiagram.png)

# Running InfinityBoard locally

In order to run a local instance of InfinityBoard, you'll need to do a
few things.

## Setup MongoDB

InfinityBoard uses a MongoDB database to store the board data. Using the
MongoDB Atlas cloud hosting can make setting up a MongoDB instance a breeze.
The [Getting Started guide](https://docs.atlas.mongodb.com/getting-started/)
is a great resource to help setting that up.

## Setup an AWS S3 bucket

This step is more involved than the prior, but [these instructions](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html)
can help you get one configured.

## Backend server

#### Set environment variables

First, make create a file called `.env` in the root of the project.
Then paste the following in that file and fill in the appropriate values:
```
# MongoDB Settings
MONGO_USERNAME=""
MONGO_PASSWORD=""
MONGO_PORT=
MONGO_CLUSTER1=""
MONGO_CLUSTER2=""
MONGO_CLUSTER3=""
MONGO_DB_NAME=""
MONGO_REPLICA_SET=""

# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET_NAME=""
AWS_IDENTITY_POOL_ID=""
```

#### Install Node.js >8.5.0

If you don't have Node.js v8.5.0 or greater, as determined by running
`node --version`,
[do that first](http://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/).

If you can, install Yarn instead of NPM for package management (it's a lot faster).
If not, simply replace "yarn" with "npm" below.

#### Install dependencies

To install React, Express, and all the other Node modules needed by
InfinityBoard, simply run the following:

```bash
yarn install
```

#### Start the server

```
yarn run server
```

## Running the frontend app

In a separate terminal, simply run the following to launch the web app:

```bash
yarn run start
```

# Tests

To run the Jest tests, run:
```bash
yarn run test
```

# Acknowledgements
Infinity Board is based on the original [FutureBoard](https://github.com/olinlibrary/oldfutureboard) project from Hacking the Library 2017.

