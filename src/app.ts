import * as Webhooks from "@octokit/webhooks";
import {Application} from "probot";
import {OnCallback} from "probot/lib/application";
import {Config} from "./Config";
import {IGithubConfig, LabelMatcher} from "./LabelMatcher";
import {CheckStatus, StatusChecksManager} from "./StatusChecksManager";

const handleStatus: OnCallback<Webhooks.WebhookPayloadPullRequest> = async (context) => {
    try {
        const data: IGithubConfig = await context.config<IGithubConfig>("pr_labels.yml");
        context.log.info(data);
        if (!data) {
            return;
        }
        // const {owner, name: repo} = context.payload.repository;
        // const _ = context.payload.number;
        const matcher = new LabelMatcher(context.payload.pull_request.labels);
        const targetStatus = matcher.matches(data) ? CheckStatus.SUCCESS : data.invalidStatus === "failed" ? CheckStatus.FAILED : CheckStatus.PENDING;

        // before we set status for a PR we should check because too many status change will cost us (gh has rate limit)
        // look into wip bot on how to implement this
        const statusChecksManager = new StatusChecksManager(context, Config.CHECK_NAME);
        const status = await statusChecksManager.getCheck();
        if (targetStatus === status) {
            return;
        }
        switch (targetStatus) {
            case CheckStatus.PENDING:
                await statusChecksManager.setPending();
                break;
            case CheckStatus.FAILED:
                await statusChecksManager.setFailed();
                break;
            case CheckStatus.SUCCESS:
                await statusChecksManager.setSuccess();
                break;
            default:
                const errorMessage = `not able to handle ${targetStatus}`;
                throw new Error(errorMessage);
        }
    } catch (e) {
        context.log.error(e.toString());
    }
};

const app = (context: Application) => {
    context.on("pull_request.opened", handleStatus);
    context.on("pull_request.reopened", handleStatus);
    context.on("pull_request.unlabeled", handleStatus);
    context.on("pull_request.labeled", handleStatus);
};

export {app};
