#!/bin/bash
set -e

# Define the container name
container_name=mongodb

# Get the database name from command-line argument
database_name="$1"

# Check if the database name is provided
if [ -z "$database_name" ]; then
    echo "Error: Database name not provided."
    exit 1
fi

# Connect to the MongoDB container and execute the drop database command
docker exec -it "$container_name" bash -c "mongosh $database_name --eval 'db.dropDatabase()'"
