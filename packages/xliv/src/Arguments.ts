/**
 * Created by chad on 3/14/17.
 */

export class Arguments {
    private _noStyles: boolean;
    private _noModule: boolean;
    private _noComponent: boolean;
    private _noView: boolean;
    private _noTypes: boolean;
    private _tsOnly: boolean;

    argv: string[];

    constructor(argv: string[]) {
        this.argv = argv;
        this._noStyles = this.hasArg("--no-styles");
        this._noModule = this.hasArg("--no-mod");
        this._noComponent = this.hasArg("--no-comp");
        this._noView = this.hasArg("--no-view");
        this._noTypes = this.hasArg("--no-types");
        this._tsOnly = this.hasArg("--ts-only");
    }
    get noStyles(): boolean {
        return this._noStyles;
    }

    get noModule(): boolean {
        return this._noModule;
    }

    get noComponent(): boolean {
        return this._noComponent;
    }

    get noView(): boolean {
        return this._noView;
    }

    get noTypes(): boolean {
        return this._noTypes;
    }

    get tsOnly(): boolean {
        return this._tsOnly;
    }

    get isEmpty(): boolean {
        return this.argv.length === 0;
    }

    next(): string {
        return this.argv.shift();
    }

    skip(count: number = 1): void {
        for (let i: number = 0; i<count; i++) {
            this.argv.shift();
        }
    }

    private hasArg(arg: string): boolean {
        return this.argv.indexOf(arg.toLocaleLowerCase()) !== -1;
    }
}