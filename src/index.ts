import {Probot} from "probot";
// import setup from "probot/lib/apps/setup";
import app from "./app";
interface IAppConfig {
    secret: string;
    id: number;
    cert: string;
}
const getAppConfig = (): IAppConfig => {
    if (!process.env.APP_ID) {
        throw new Error("APP_ID not set");
    }
    if (!process.env.WEBHOOK_SECRET) {
        throw new Error("WEBHOOK_SECRET not set");
    }
    if (!process.env.PRIVATE_KEY_ENCODED) {
        throw new Error("PRIVATE_KEY_ENCODEDs not set");
    }
    const id = parseInt(process.env.APP_ID, 10);
    return {
        id,
        secret: process.env.WEBHOOK_SECRET,
        cert: Buffer.from(process.env.PRIVATE_KEY_ENCODED, "base64").toString("ascii")
    };
};
const probot = new Probot(getAppConfig());
// probot.load(setup);
probot.load(app);

// tslint:disable-next-line:export-name
export = probot.server;
