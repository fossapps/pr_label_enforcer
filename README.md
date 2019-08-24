# pr_label_enforcer

[![Greenkeeper badge](https://badges.greenkeeper.io/fossapps/pr_label_enforcer.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.com/fossapps/pr_label_enforcer.svg)](https://travis-ci.com/fossapps/pr_label_enforcer)
[![GitHub issues](https://img.shields.io/github/issues/fossapps/pr_label_enforcer.svg)](https://github.com/fossapps/pr_label_enforcer/issues)
[![devDependencies Status](https://david-dm.org/fossapps/pr_label_enforcer/dev-status.svg)](https://david-dm.org/fossapps/pr_label_enforcer?type=dev)
[![dependencies Status](https://david-dm.org/fossapps/pr_label_enforcer/status.svg)](https://david-dm.org/fossapps/pr_label_enforcer)
[![codecov](https://codecov.io/gh/fossapps/pr_label_enforcer/branch/master/graph/badge.svg)](https://codecov.io/gh/fossapps/pr_label_enforcer)

Github app to run your issue body and pull request's body through handlebar to generate new bodies

- Typescript 3.x
- Automatically deploys to now.sh
- uses jest for testing
- uses travis and now.sh for deployment
- uses linting and git hooks to increase code quality.

## Contributing

Initially you should:

- create your test app (or do live and see what happens :) )
- clone this repository
- npm install
- npm start
- create .env file and ensure you import those env (this project doesn't care about .env files)
- npm start
- forward your port so gh can send you events locally
- make changes
- push to your fork
- create pull request
