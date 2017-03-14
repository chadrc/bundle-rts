/**
 * Created by chad on 3/14/17.
 */

function cmdComponent(args: Arguments) {

}

function cmdModule(args: Arguments) {

}

function cmdProject(args: Arguments) {

}

function cmdManifest(args: Arguments) {

}

class Arguments {
    private _noStyles: boolean;
    private _noModule: boolean;
    private _noComponent: boolean;
    private _noView: boolean;
    private _noTypes: boolean;

    argv: string[];

    constructor(argv: string[]) {
        this.argv = argv;
        this._noStyles = this.hasArg("--no-styles");
        this._noModule = this.hasArg("--no-mod");
        this._noComponent = this.hasArg("--no-comp");
        this._noView = this.hasArg("--no-view");
        this._noTypes = this.hasArg("--no-types");
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

    private hasArg(arg: AcceptedArguments): boolean {
        return this.argv.indexOf(arg.toLocaleLowerCase()) !== -1;
    }
}

type AcceptedArguments = "--no-styles" | "--no-mod" | "--no-comp" | "--no-view" | "--no-types";

export function Run(command, argv) {
    let remainingArgs: Arguments = new Arguments(argv);
    switch (command) {
        case "component":
            cmdComponent(remainingArgs);
            break;

        case "module":
            cmdModule(remainingArgs);
            break;

        case "project":
            cmdProject(remainingArgs);
            break;

        case "manifest":
            cmdManifest(remainingArgs);
            break;
    }
}