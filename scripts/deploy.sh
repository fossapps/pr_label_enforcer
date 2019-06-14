#!/bin/sh
set -e

now="npx now --debug --token=$NOW_TOKEN"

echo "$ now --no-verify"
$now --no-verify
