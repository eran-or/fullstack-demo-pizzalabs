#!/bin/bash

if [ "$1" == "production" ]; then
    cp .env.production .env
else
    cp .env.development .env
fi

# Shift the positional parameters to the left, so $1 becomes $2, $2 becomes $3 and so on.
# $1 (the environment name) is discarded.
shift

# After shift, $@ contains all the parameters except the first one (environment name).
# Pass these parameters to docker-compose.
docker-compose up --build "$@"
