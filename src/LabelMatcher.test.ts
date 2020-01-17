import {IGithubLabel, LabelMatcher} from "./LabelMatcher";

describe("LabelMatcher", () => {
    describe("accepts github labels on constructor", () => {
        it("should not throw any errors when IGithubLabel is passed", () => {
            expect(() => {
                new LabelMatcher([]); // tslint:disable-line
            }).not.toThrow();
        });
    });
    it("LabelMatcher.contains should return match if any of Github labels matches provided config labels", () => {
        const labels: IGithubLabel[] = [
            {name: "bug"},
            {name: "feat"},
            {name: "test"}
        ];
        const matcher = new LabelMatcher(labels);
        expect(matcher.contains({values: ["one", "two", "three"]})).toBeFalsy();
        expect(matcher.contains({values: ["one", "two", "three", "test"]})).toBeTruthy();
    });
    it("LabelMatcher.not should not return match if any of Github labels matches provided config labels", () => {
        const labels: IGithubLabel[] = [
            {name: "bug"},
            {name: "feat"},
            {name: "test"}
        ];
        const matcher = new LabelMatcher(labels);
        expect(matcher.not({not: ["one", "two", "three"]})).toBeTruthy();
        expect(matcher.not({not: ["one", "two", "three", "test"]})).toBeFalsy();
    });
    it("LabelMatcher.startsWith should return match if any of Github labels matches provided config labels", () => {
        const labels: IGithubLabel[] = [
            {name: "bug"},
            {name: "feat"},
            {name: "test"}
        ];
        const matcher = new LabelMatcher(labels);
        const tests = [
            {input: ["one", "two", "three"], result: false},
            {input: ["one", "two", "three", "b"], result: true},
            {input: ["one", "two", "three", "bu"], result: true},
            {input: ["one", "two", "three", "bug"], result: true},
            {input: ["one", "two", "t", "bug"], result: true},
            {input: ["one", "two", "te", "bug"], result: true},
            {input: ["one", "two", "tes", "bug"], result: true},
            {input: ["one", "two", "test", "bug"], result: true}
        ];
        tests.forEach((x) => {
            expect(matcher.startsWith({startsWith: x.input})).toBe(x.result);
        });
    });
    it("LabelMatcher.doesntStartWith shouldn't return match if any of Github labels matches provided config labels", () => {
        const labels: IGithubLabel[] = [
            {name: "bug"},
            {name: "feat"},
            {name: "test"}
        ];
        const matcher = new LabelMatcher(labels);
        const tests = [
            {input: ["one", "two", "three"], result: true},
            {input: ["one", "two", "three", "b"], result: false},
            {input: ["one", "two", "three", "bu"], result: false},
            {input: ["one", "two", "three", "bug"], result: false},
            {input: ["one", "two", "t", "bug"], result: false},
            {input: ["one", "two", "te", "bug"], result: false},
            {input: ["one", "two", "tes", "bug"], result: false},
            {input: ["one", "two", "test", "bug"], result: false}
        ];
        tests.forEach((x) => {
            expect(matcher.doesntStartWith({doesntStartWith: x.input})).toBe(x.result);
        });
    });
    it("LabelMatcher.endsWith should return match if any of Github labels matches provided config labels", () => {
        const labels: IGithubLabel[] = [
            {name: "bug"},
            {name: "feat"},
            {name: "test"}
        ];
        const matcher = new LabelMatcher(labels);
        const tests = [
            {input: ["one", "two", "three"], result: false},
            {input: ["one", "two", "three", "b"], result: false},
            {input: ["one", "two", "three", "bu"], result: false},
            {input: ["one", "two", "three", "bug"], result: true},
            {input: ["one", "two", "t", "bu"], result: true},
            {input: ["one", "two", "st", "bu"], result: true}
        ];
        tests.forEach((x) => {
            expect(matcher.endsWith({endsWith: x.input})).toBe(x.result);
        });
    });
    it("LabelMatcher.doesntEndWith shouldn't return match if any of Github labels matches provided config labels", () => {
        const labels: IGithubLabel[] = [
            {name: "bug"},
            {name: "feat"},
            {name: "test"}
        ];
        const matcher = new LabelMatcher(labels);
        const tests = [
            {input: ["one", "two", "three"], result: true},
            {input: ["one", "two", "three", "b"], result: true},
            {input: ["one", "two", "three", "bu"], result: true},
            {input: ["one", "two", "three", "bug"], result: false},
            {input: ["one", "two", "t", "bu"], result: false},
            {input: ["one", "two", "st", "bu"], result: false}
        ];
        tests.forEach((x) => {
            expect(matcher.doesntEndWith({doesntEndWith: x.input})).toBe(x.result);
        });
    });
    describe("LabelMatcher.matches should have match", () => {
        it("should return true if config is completely empty", () => {
            const matcher = new LabelMatcher([]);
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {}})).toBeTruthy();
        });
        it("should return true if config has something matching", () => {
            const matcher = new LabelMatcher([{name: "bug"}]);
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {values: ["bug"]}})).toBeTruthy();
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {startsWith: ["b"]}})).toBeTruthy();
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {endsWith: ["g"]}})).toBeTruthy();
        });
        it("should be able to combine multiple rules", () => {
            const matcher = new LabelMatcher([{name: "bug"}]);
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {startsWith: ["b"], values: ["bug"]}})).toBeTruthy();
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {startsWith: ["bug"], values: ["bug"]}})).toBeTruthy();
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {startsWith: ["b"], values: ["feat"]}})).toBeFalsy();
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {startsWith: ["b"], endsWith: ["g"], values: ["feat"]}})).toBeFalsy();
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {startsWith: ["b"], endsWith: ["g"], values: ["bug"]}})).toBeTruthy();
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {doesntStartWith: ["b"], doesntEndWith: ["g"], not: ["feat"]}})).toBeFalsy();
            expect(matcher.matches({version: "2", invalidStatus: "failed", labelRule: {doesntStartWith: ["a"], doesntEndWith: ["b"], not: ["feat"]}})).toBeTruthy();
        });
    });

});
