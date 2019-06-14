#!/bin/sh
set -e

echo "Deploying application"
echo "setting up now variable"
now="npx now --debug --token=$NOW_TOKEN"
echo "$ now --no-verify"
${now}
