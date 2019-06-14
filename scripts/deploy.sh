#!/bin/sh
set -e

echo "Deploying application"
echo "setting up now variable"
now="npx now --debug --token=$NOW_TOKEN"
${now} secret add webhook_secret ${WEBHOOK_SECRET}
${now} secret add client_secret ${CLIENT_SECRET}
${now} secret add private_key ${PRIVATE_KEY}
echo "$ now --no-verify"
${now} --no-verify
