#!/bin/sh -ex

# Based on: https://github.com/remix-run/indie-stack/blob/main/start.sh
# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

npx prisma migrate deploy
node dist/server.prod.js
