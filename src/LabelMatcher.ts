export interface IGithubConfig {
    version: string;
    invalidStatus: "failed" | "pending";
    labelRule: ILabelEndsWithRule | ILabelStartsWithRule | ILabelEqualsRule | {};
}

export interface IGithubLabel {
    id?: number;
    node_id?: string;
    url?: string;
    name: string;
    color?: string;
    default?: boolean;
}

export interface ILabelEqualsRule {
    values: string[];
}

export interface ILabelEndsWithRule {
    endsWith: string[];
}

export interface ILabelStartsWithRule {
    startsWith: string[];
}

export class LabelMatcher {
    constructor(private labels: IGithubLabel[]) {}

    public contains(config: ILabelEqualsRule): boolean {
        return this.labels.some((x) => config.values.includes(x.name));
    }

    public startsWith(config: ILabelStartsWithRule): boolean {
        return this.labels.some((x) => {
            return config.startsWith.some((ruleLabel) => x.name.startsWith(ruleLabel));
        });
    }

    public endsWith(config: ILabelEndsWithRule): boolean {
        return this.labels.some((x) => {
            return config.endsWith.some((ruleLabel) => x.name.endsWith(ruleLabel));
        });
    }

    public matches(config: IGithubConfig): boolean {
        return Object.keys(config.labelRule).every((x) => {
            if (x === "endsWith") {
                return this.endsWith(config.labelRule as ILabelEndsWithRule);
            }
            if (x === "startsWith") {
                return this.startsWith(config.labelRule as ILabelStartsWithRule);
            }
            if (x === "values") {
                return this.contains(config.labelRule as ILabelEqualsRule);
            }
            throw new Error(`rule ${x} not supported`);
        });
    }
}
