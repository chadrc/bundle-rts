/// <reference types="react" />
export interface Props {
    className?: string;
    children?: any[];
}
export interface State {
}
export interface Data {
    props: Props;
    state: State;
}
export interface View {
    make(self: any): JSX.Element;
}
export interface Module {
    name: string;
    components: {
        [name: string]: any;
    };
}
export declare function loadModule(name: string, callback: () => void): void;
export declare function getModule(name: string): Module;
export interface ModuleDetails {
    name: string;
    hasStyles: boolean;
}
export declare class App {
    constructor(modules: ModuleDetails[]);
}
