import * as Webhooks from "@octokit/webhooks";
import {Context, Octokit} from "probot";

export enum CheckStatus {
    SUCCESS,
    PENDING,
    UNAVAILABLE,
    FAILED
}

export class StatusChecksManager {
    constructor(private readonly context: Context<Webhooks.WebhookPayloadPullRequest>, private readonly name: string) {
    }
    public async getCheck(): Promise<CheckStatus> {
        const response = await this.context
            .github
            .checks
            .listForRef(this.context.repo({ref: this.context.payload.pull_request.head.sha, check_name: this.name}));
        if (response.data.check_runs.length === 0) {
            return CheckStatus.UNAVAILABLE;
        }
        const check = response.data.check_runs[0];
        if (check.conclusion === "success") {
            return CheckStatus.SUCCESS;
        }
        if (check.status === "in_progress") {
            return CheckStatus.PENDING;
        }
        if (check.conclusion === "failure") {
            return CheckStatus.FAILED;
        }
        const errorMessage = `Can't handle ${check.conclusion} to determine check status`;
        this.context.log.error(errorMessage);
        throw new Error(errorMessage);
    }
    public async setFailed(): Promise<Octokit.Response<Octokit.ChecksCreateResponse>> {
        const checkOptions = {
            name: this.name,
            head_branch: "",
            head_sha: this.context.payload.pull_request.head.sha,
            status: "completed" as "completed" | "queued" | "in_progress",
            conclusion: "failure" as "success" | "failure" | "neutral" | "cancelled" | "timed_out" | "action_required",
            completed_at: new Date().toISOString(),
            request: {
                retries: 3,
                retryAfter: 3
            },
            output: {
                title: "Labels mismatch",
                summary: "Please check your labels to ensure success status"
            }
        };
        return this.context.github.checks.create(this.context.repo(checkOptions));
    }
    public async setPending(): Promise<Octokit.Response<Octokit.ChecksCreateResponse>> {
        const checkOptions = {
            name: this.name,
            head_branch: "",
            head_sha: this.context.payload.pull_request.head.sha,
            status: "in_progress" as "completed" | "queued" | "in_progress",
            request: {
                retries: 3,
                retryAfter: 3
            },
            output: {
                title: "Labels not setup correctly",
                summary: "Labels matched as defined on file"
            }
        };
        return await this.context.github.checks.create(this.context.repo(checkOptions));
    }
    public async setSuccess(): Promise<Octokit.Response<Octokit.ChecksCreateResponse>> {
        const checkOptions = {
            name: this.name,
            head_branch: "",
            head_sha: this.context.payload.pull_request.head.sha,
            status: "completed" as "completed" | "queued" | "in_progress",
            conclusion: "success" as "success" | "failure" | "neutral" | "cancelled" | "timed_out" | "action_required",
            completed_at: new Date().toISOString(),
            request: {
                retries: 3,
                retryAfter: 3
            },
            output: {
                title: "All labels match",
                summary: "Labels matched as defined on file"
            }
        };
        return await this.context.github.checks.create(this.context.repo(checkOptions));
    }
}
