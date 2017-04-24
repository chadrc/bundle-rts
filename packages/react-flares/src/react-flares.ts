/**
 * Created by chad on 3/11/17.
 */

import React = require("react");
export = ReactFlares;
namespace ReactFlares {

    export interface ModuleLoadResult {
        moduleName: string;
        jsLoaded: boolean;
        cssLoaded: boolean;
    }

    let moduleLoadResults: {[key:string]: ModuleLoadResult} = {};

    let jsRoot: string = "js/";
    let cssRoot: string = "css/";

    let components: {[name: string]: any} = {};

    export function registerComponent<T extends React.Component<any, any>>(name: string, component: {new(...args: any[]): T}): void {
        if (!components[name]) {
            components[name] = component;
        }
    }

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
        private _moduleName: string;
        private _loaded: boolean;
        private _callback: (result: ModuleLoadResult) => void;
        private _jsStatus: boolean = null;
        private _cssStatus: boolean = null;

        constructor(moduleName: string) {
            this._moduleName = moduleName;
            this._loaded = false;
        }

        load(callback: (result: ModuleLoadResult) => void) {
            let name = this._moduleName;
            if (name in moduleLoadResults) {
                let mod = moduleLoadResults[name];
                callback(mod);
            } else {
                this.loadJs(`${jsRoot}${name}.bundle.js`);
                this.loadStyle(`${cssRoot}${name}.bundle.css`);
                this._callback = callback;
            }
        }

        loadStyle(resource: string) {
            let link = document.createElement("link");
            let head = document.getElementsByTagName("head")[0];
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", resource);
            link.setAttribute("type", "text/css");
            link.addEventListener("load", () => this.cssReceived(true));
            link.addEventListener("error", () => this.cssReceived(false));
            head.appendChild(link);
        }

        loadJs(resource: string) {
            let script = document.createElement("script");
            let head = document.getElementsByTagName("head")[0];
            script.setAttribute("src", resource);
            script.addEventListener("load", () => this.jsReceived(true));
            script.addEventListener("error", () => this.jsReceived(false));
            head.appendChild(script);
        }

        cssReceived(success: boolean) {
            this._cssStatus = success;
            this.checkSendCallback()
        }

        jsReceived(success: boolean) {
            this._jsStatus = success;
            this.checkSendCallback();
        }

        checkSendCallback() {
            if (this._cssStatus !== null && this._jsStatus !== null) {
                let loadResult: ModuleLoadResult = {
                    moduleName: this._moduleName,
                    jsLoaded: this._jsStatus,
                    cssLoaded: this._cssStatus
                };
                moduleLoadResults[this._moduleName] = loadResult;
                if (this._callback !== null) {
                    this._callback(loadResult);
                }
            }
        }
    }

    export function loadModule(name: string, callback: (result: ModuleLoadResult) => void) {
        new ModuleLoader(name).load(callback);
    }

    export function getComponent(name: string): {new(): any} {
        return components[name];
    }

    export interface ComponentFlareProps {
        componentId?: string
    }

    export interface ComponentFlareState {
        component: {new(...args: any[]): React.Component<any, any>}
    }

    export class ComponentFlare<T extends ComponentFlareProps> extends React.Component<T, ComponentFlareState> {

        constructor(props: T) {
            super(props);
            this.state = {
                component: null
            };

            let cid = this.props.componentId || this.componentId;
            if (!cid) {
                throw "Cannot create ComponentFlare without a componentId.";
            }

            let split: string[] = cid.split(":");
            if (split.length != 2) {
                throw `Invalid componentId: ${cid}\n` + "componentIds are formatted:\n'ModuleName:ComponentName'";
            }

            let moduleName = split[0];
            let componentName = split[1];
            loadModule(moduleName, (result: ModuleLoadResult) => {
                if (result.jsLoaded) {
                    this.setState({
                        component: getComponent(componentName)
                    });
                }
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