/**
 * Created by chad on 3/14/17.
 */

export class Arguments {
    private _noStyles: boolean;
    private _noModule: boolean;
    private _noView: boolean;
    private _noTypes: boolean;
    private _tsOnly: boolean;
    private _makeFlare: boolean;
    private _production: boolean;
    private _development: boolean;
    private _env: string;

    argv: string[];

    constructor(argv: string[]) {
        this.argv = argv;
        this._noStyles = this.hasArg("--no-styles");
        this._noModule = this.hasArg("--no-mod");
        this._noView = this.hasArg("--no-view");
        this._noTypes = this.hasArg("--no-types");
        this._tsOnly = this.hasArg("--ts-only");
        this._makeFlare = this.hasArg("--mk-flare");
        this._production = this.hasArg("--prod");
        this._development = this.hasArg("--dev");

        let toDelete: number[] = [];
        for (let arg of argv) {
            if (arg.startsWith("--env")) {
                let parts = arg.split("=");
                if (parts.length === 2) {
                    this._env = parts[1];
                }
                toDelete.push(argv.indexOf(arg));
            }
        }

        for (let index of toDelete) {
            argv.splice(index, 1);
        }
    }

    get noStyles(): boolean {
        return this._noStyles;
    }

    get noModule(): boolean {
        return this._noModule;
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

    get makeFlare(): boolean {
        return this._makeFlare;
    }

    get production(): boolean {
        return this._production;
    }

    get development(): boolean {
        return this._development;
    }

    get env(): string {
        return this._env;
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
        let index = this.argv.indexOf(arg.toLocaleLowerCase());
        let has = index !== -1;
        if (has) {
            this.argv.splice(index, 1);
        }
        return has;
    }
}