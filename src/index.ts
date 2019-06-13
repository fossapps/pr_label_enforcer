import * as Webhooks from "@octokit/webhooks";
import {Application} from "probot";
import {OnCallback} from "probot/lib/application";

const handleStatus: OnCallback<Webhooks.WebhookPayloadPullRequest> = async (context) => {
    const {owner, name: repo} = context.payload.repository;
    const num = context.payload.number;

    const data = await context.config("pr_labels.yml");
    context.log.info(data, repo, owner, num);
    context.log.info(context.payload.pull_request.labels);
};

const handler = (context: Application) => {
    context.on("pull_request.opened", handleStatus);
    context.on("pull_request.reopened", handleStatus);
    context.on("pull_request.unlabeled", handleStatus);
};
// tslint:disable-next-line:no-default-export export-name
export default handler;