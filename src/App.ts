import * as Webhooks from "@octokit/webhooks";
import {Application, Context} from "probot";
import {getAppConfig} from "./AppConfig";
import {IGithubConfig, LabelMatcher} from "./LabelMatcher";
import {CheckStatus, StatusChecksManager} from "./StatusChecksManager";

export class App {

    public static handle(context: Application): void {
        context.on(["pull_request.opened", "pull_request.reopened", "pull_request.labeled", "pull_request.unlabeled"], App.handleEvent);
    }

    private static handleEvent(context: Context<Webhooks.WebhookPayloadPullRequest>): Promise<void> {
        context.log.info(`handling ${context.event} event`);
        const app = new App();
        return app.handleEvent(context);
    }

    public async handleEvent(context: Context<Webhooks.WebhookPayloadPullRequest>): Promise<void> {
        const data: IGithubConfig = await context.config<IGithubConfig>("pr_labels.yml");
        if (!data) {
            return;
        }
        const matcher = new LabelMatcher(context.payload.pull_request.labels);
        const targetStatus = matcher.matches(data) ? CheckStatus.SUCCESS : data.invalidStatus === "failed" ? CheckStatus.FAILED : CheckStatus.PENDING;
        const statusChecksManager = new StatusChecksManager(context, getAppConfig().checkName);
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
    }
}
