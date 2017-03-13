/**
 * Created by chad on 3/11/17.
 */

import jquery = require("jquery");

export interface Props {
    className?: string,
    children?: any[]
}

export interface State {

}
export interface Data {
    props: Props,
    state: State
}

export interface View {
    make(self: any): JSX.Element;
}

export interface Module {
    name: string;
    components: {[name:string]: any}
}

class StylePromise {
    private _callback: () => void;
    private _fail: () => void;

    constructor(styleUri: string) {
        let link = document.createElement("link");
        let head = document.getElementsByTagName("head")[0];
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", styleUri);
        link.setAttribute("type", "text/css");
        link.addEventListener("load", () => this.cssReceived());
        link.addEventListener("error", () => this.cssReceived());
        head.appendChild(link);
    }

    cssReceived() {
        if (this._callback != null) {
            this._callback();
        }
    }

    cssError() {
        if (this._fail != null) {
            this._fail();
        }
    }

    then(callback:() => void, failFallback?: () => void) {
        this._callback = callback;
        this._fail = failFallback;
    }
}

class ModulePromise {
    private _jsPromise: JQueryXHR;
    private _cssPromise: StylePromise;

    private _jsReceived: boolean;
    private _cssReceived: boolean;

    private _callback: ()=>void;

    constructor(jsPromise: JQueryXHR, cssPromise: StylePromise) {
        this._jsPromise = jsPromise;
        this._cssPromise = cssPromise;
        this._jsPromise.then(() => {
            this.onJsReceived(true)
        }, () => {
            this.onJsReceived(false);
        });
        this._cssPromise.then(() => {
            this.onCssReceived(true)
        }, () => {
            this.onCssReceived(false);
        });
        this._jsReceived = false;
        this._cssReceived = false;
    }

    onJsReceived(received: boolean) {
        this._jsReceived = received;
        if ( (this._cssPromise === null || this._cssReceived)
            && this._callback != null) {
            this._callback();
        }
    }

    onCssReceived(received: boolean) {
        this._cssReceived = received;
        if ( (this._jsPromise === null || this._jsReceived)
            && this._callback != null) {
            this._callback();
        }
    }

    then(callback: ()=>void) {
        this._callback = callback;
    }
}

class ModuleLoader {
    private static _moduleMap: {[name:string]: ModuleLoader} = {};
    private _moduleName: string;
    private _loaded: boolean;
    private _module: Module;
    private _promise: ModulePromise;
    private _callback: () => void;

    constructor(moduleName: string) {
        this._moduleName = moduleName;
        this._loaded = false;
        this._module = null;
    }

    load(callback: () => void) {
        let name = this._moduleName;
        if (name in ModuleLoader._moduleMap) {
            let info = ModuleLoader._moduleMap[name];
            // Already loaded
        } else {
            let jsPromise = $.getScript(`/react-expr-002/dist/js/${name}.bundle.js`);
            let cssPromise = new StylePromise(`/react-expr-002/dist/styles/${name}.bundle.css`);
            this._promise = new ModulePromise(jsPromise, cssPromise);
            this._promise.then(() => {this.onModuleLoaded();});
            this._callback = callback;
        }
    }

    onModuleLoaded() {
        if (this._callback !== null) {
            this._callback();
        }
    }
}

export function loadModule(name: string, callback: () => void) {
    new ModuleLoader(name).load(callback);
}

export function getModule(name: string): Module {
    return (<any>window)[name];
}

export interface ModuleDetails {
    name: string,
    hasStyles: boolean
}

export class App {
    constructor(modules: ModuleDetails[]) {
    }
}

