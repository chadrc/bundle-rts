# react-flares
A small utility library for lazy loading React components. Also contains a scaffolding cli designed around library. Uses React, TypeScript and Webpack in scaffolding for implementation and bundling.

*Currently in development and will more than likely change.*

## Table of Contents
[Installation](#installation)

[Usage](#usage)

[Flares](#flares)

[Configuration](#configuration)

---

## Installation
```bash
npm install -g react-flares
```
## Usage
### Project Setup
Run these commands to create default project set up:
```bash
react-flares project MyProject
npm install
```
Webpack dev server comes installed with the setup. Start it with:
```bash
npm start
```
### Commands
#### Create a project. Should only be used once per project.
```bash
react-flares project ProjectName
```
#### Create a module with a default component.
```bash
react-flares module ModuleName 
```
#### Create a component with a view and types file.
```base
# Create a component within a module
react-flares component ModuleName:ComponentName

# Create a component outside of module
react-flares component ~:ComponentName

# Create a sub-component (Allows more organization than changing functionality of the component.)
react-flares component ModuleName:ComponentName/SubComponentName
```
Options:
* --no-mod - Prevents create of default module and all its associated files. (project)
* --no-styles - Prevents creation of styles file. (project, module)
* --no-comp - Prevents creation of default component and all its associated files. (project, module)
* --no-view - Prevents creation of default components view file. (project, module, component)
* --no-types - Prevents creation of default components types file. (project, module, component)
## Flares
Flares are a way of lazy loading a component. They are used just like normal React components but are set up to load their corresponding component before trying to render it.
```tsx
ReactDom.render(
    <MyComponentFlare />
    , document.getElementById("content")
);
```
The component flare files are generated when ever a component is generated with the cli tool. However their implementation is simple if you have to make one yourself.
```ts
import * as ReactFlares from 'react-flares';
import {MyComponentProps} from "../../modules/MyModule/MyComponent.types";

// Importing the component's props from its types file allows you to pass the same props to the flare as you would to the regular component
export class MyComponentFlare extends ReactFlares.ComponentFlare<ReactFlares.ComponentFlareProps & MyComponentProps> {
    get componentId(): string {return "MyModule:MyComponent";}
```
You may also choose to use a flare directly without of inheritance.
```tsx
ReactDom.render(
    <ReactFlares.ComponentFlare componentId="MyModule:MyComponent" />
    , document.getElementById("content")
);
```
### Resolution
Modules correspond to bundles created by webpack. The default setup creates a bundle from each .module.ts file. When a module is created its default component is imported and registered in its constructor.
```ts
export class MyModuleModule implements ReactFlares.Module {
    private _components: {[name:string]: any};
    constructor() {
        this._components = {};
        this._components["MyComponent"] = MyComponent;
    }
}
```
When you need additional components to be fetchable with flares, you'll need to add similar lines to their module's constructor.
## Configuration
You can set a different root for flares to load .js and .css files from. Defaults are "js/" and "css/", which corresponds to how webpack-dev-server is setup to load them.
```ts
import * as ReactFlares from "react-flares";

ReactFlares.setJsRoot("path/to/js/");
ReactFlares.setCssRoot("path/to/css/");
```

