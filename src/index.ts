// tslint:disable-next-line:no-require-imports no-var-requires
const {serverless} = require("@chadfawcett/probot-serverless-now");
import {app} from "./app";

module.exports = serverless(app);
