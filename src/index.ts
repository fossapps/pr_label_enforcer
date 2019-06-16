import {Probot} from "probot";
import setup from "probot/lib/apps/setup";
import app from "./app";

const probot = new Probot(
    {
        secret: process.env.WEBHOOK_SECRET,
        id: 32985,
        port: 3000,
        cert: process.env.KEY
    });
probot.load(setup);
probot.load(app);

// tslint:disable-next-line:export-name
export = probot.server;
