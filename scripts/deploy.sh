#!/bin/sh
set -e

echo "Deploying application"
echo "setting up now variable"
now="npx now --debug --token=$NOW_TOKEN -e WEBHOOK_SECRET=$WEBHOOK_SECRET -e CLIENT_SECRET=$CLIENT_SECRET -e APP_ID=$APP_ID"

echo "$ now --no-verify"
${now} --no-verify
