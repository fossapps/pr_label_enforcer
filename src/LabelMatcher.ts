export interface IGithubConfig {
    version: string;
    invalidStatus: "failed" | "pending";
    labelRule: ILabelEndsWithRule | ILabelStartsWithRule | ILabelEqualsRule |
               ILabelDoesntEndWithRule | ILabelDoesntStartWithRule | ILabelNotRule | {};
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

export interface ILabelNotRule {
    not: string[];
}

export interface ILabelDoesntStartWithRule {
    doesntStartWith: string[];
}

export interface ILabelDoesntEndWithRule {
    doesntEndWith: string[];
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

    public not(config: ILabelNotRule): boolean {
        return !this.labels.some((x) => config.not.includes(x.name));
    }

    public doesntStartWith(config: ILabelDoesntStartWithRule): boolean {
        return !this.labels.some((x) => {
            return config.doesntStartWith.some((ruleLabel) => x.name.startsWith(ruleLabel));
        });
    }

    public doesntEndWith(config: ILabelDoesntEndWithRule): boolean {
        return !this.labels.some((x) => {
            return config.doesntEndWith.some((ruleLabel) => x.name.endsWith(ruleLabel));
        });
    }

    public matches(config: IGithubConfig): boolean {
        return Object.keys(config.labelRule).every((x) => {
            switch (x) {
                case "endsWith":
                    return this.endsWith(config.labelRule as ILabelEndsWithRule);
                case "startsWith":
                    return this.startsWith(config.labelRule as ILabelStartsWithRule);
                case "values":
                    return this.contains(config.labelRule as ILabelEqualsRule);
                case "not":
                    return this.not(config.labelRule as ILabelNotRule);
                case "doesntStartWith":
                    return this.doesntStartWith(config.labelRule as ILabelDoesntStartWithRule);
                case "doesntEndWith":
                    return this.doesntEndWith(config.labelRule as ILabelDoesntEndWithRule);
                default:
                    throw new Error(`rule ${x} not supported`);
            }
        });
    }
}
