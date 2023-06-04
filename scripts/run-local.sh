#!/bin/bash
# arg1: environment used to pick config file to use in /config.
set -e
source .env.local

# cd to project root directory
cd "$(dirname "$(dirname "$0")")"

# Set environment variable (used for config) to staging by default
[[ ! -z "$1" ]] && ENVIRONMENT="$1" || ENVIRONMENT=staging

#ln -sf config/config.${ENVIRONMENT}.json public/config.json
NODE_OPTIONS="--openssl-legacy-provider" yarn start
