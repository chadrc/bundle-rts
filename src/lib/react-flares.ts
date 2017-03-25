/**
 * Created by chad on 3/11/17.
 */

import jquery = require("jquery");
import React = require("react");

export = ReactFlares;

namespace ReactFlares {
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

    let jsRoot: string = "dist/js/";
    let cssRoot: string = "dist/css/";

    export function setJsRoot(root: string) {
        if (!root) {
            jsRoot = "";
        } else {
            jsRoot = root + (root.charAt(root.length-1) === "/" ? "" : "/");
        }
    }

    export function setCssRoot(root: string) {
        if (!root) {
            cssRoot = "";
        } else {
            cssRoot = root + (root.charAt(root.length-1) === "/" ? "" : "/");
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
                let jsPromise = $.getScript(`${jsRoot}${name}.bundle.js`);
                let cssPromise = new StylePromise(`${cssRoot}${name}.bundle.css`);
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

    export interface ComponentFlareProps extends Props {
        componentId?: string
    }

    export interface ComponentFlareState extends State {
        component: any
    }

    export class ComponentFlare extends React.Component<ComponentFlareProps, ComponentFlareState> {

        constructor(props: ComponentFlareProps) {
            super(props);
            this.state = {
                component: null
            };

            let cid = this.props.componentId || this.componentId;
            if (!cid) {
                throw "Cannot create ComponentFlare without a componentId.";
            }

            let split: string[] = this.props.componentId.split(":");
            if (split.length != 2) {
                throw `Invalid componentId: ${cid}\n` + "componentIds are formatted:\n'ModuleName:ComponentName'";
            }

            let moduleName = split[0];
            let componentName = split[1];
            loadModule(moduleName, () => {
                this.setState({
                    component: getModule(moduleName).components[componentName]
                });
            })
        }

        get componentId(): string {
            return this.props.componentId;
        }

        render() {
            return this.state.component === null ? null :
                React.createElement(this.state.component, this.props, this.props.children);
        }
    }
}