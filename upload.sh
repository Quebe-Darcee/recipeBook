#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER="darcee@darcee.me"

# update code
rsync -avh $DIR $SERVER:~/ --delete