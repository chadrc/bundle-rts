import {projectCommand} from "../commands";
import {fileExists, getFileData} from "./setup";

const pkgJsonFilePath =     "/package.json";
const indexHtmlFilePath =   "/app/index.html";
const indexTsxFilePath =    "/app/index.tsx";

const moduleFilePath =      "/app/modules/MyProject/MyProject.module.ts";
const stylesFilePath =      "/app/modules/MyProject/MyProject.scss";
const componentFilePath =   "/app/modules/MyProject/MyProject.component.ts";
const viewFilePath =        "/app/modules/MyProject/MyProject.view.tsx";
const typesFilePath =       "/app/modules/MyProject/MyProject.types.ts";

test("creates project with all default files", () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);

    expect(fileExists(pkgJsonFilePath)).toBeTruthy();
    expect(fileExists(indexHtmlFilePath)).toBeTruthy();
    expect(fileExists(indexTsxFilePath)).toBeTruthy();

    expect(fileExists(moduleFilePath)).toBeTruthy();
    expect(fileExists(stylesFilePath)).toBeTruthy();
    expect(fileExists(componentFilePath)).toBeTruthy();
    expect(fileExists(viewFilePath)).toBeTruthy();
    expect(fileExists(typesFilePath)).toBeTruthy();
});

test("creates project without module", () => {
    projectCommand("MyProject", "1.0", true, false, false, false, false);

    expect(fileExists(pkgJsonFilePath)).toBeTruthy();
    expect(fileExists(indexHtmlFilePath)).toBeTruthy();
    expect(fileExists(indexTsxFilePath)).toBeTruthy();

    expect(fileExists(moduleFilePath)).toBeFalsy();
    expect(fileExists(stylesFilePath)).toBeFalsy();
    expect(fileExists(componentFilePath)).toBeFalsy();
    expect(fileExists(viewFilePath)).toBeFalsy();
    expect(fileExists(typesFilePath)).toBeFalsy();
});

test('created package.json file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);

    let data = getFileData(pkgJsonFilePath);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
{
  "name": "myproject",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack",
    "start": "webpack-dev-server --open",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "react": "^15.4.2",
    "react-dom": "^15.4.2",
    "react-flares": "1.0"
  },
  "devDependencies": {
    "@types/node": "^7.0.11",
    "@types/react": "^15.0.16",
    "@types/react-dom": "^0.14.23",
    "awesome-typescript-loader": "^3.1.2",
    "css-loader": "^0.27.1",
    "extract-text-webpack-plugin": "^2.1.0",
    "file-loader": "^0.10.1",
    "glob": "^7.1.1",
    "node-sass": "^4.5.0",
    "sass-loader": "^6.0.3",
    "source-map-loader": "^0.2.0",
    "style-loader": "^0.13.2",
    "typescript": "^2.2.1",
    "webpack": "^2.2.1",
    "webpack-dev-server": "^2.4.2"
  }
}  
`;
    expect(data).toBe(expectedComponentText);
});

test('created index.html file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);

    let data = getFileData(indexHtmlFilePath);

    let expectedComponentText = `\
<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>MyProject</title>
        </head>
    <body>
        <main id="content">
            <p>Loading...</p>
        </main>
        
        <!-- Dependencies -->
        <script src="../js/vendor.bundle.js"></script>
        
        <!-- Main -->
        <script src="../js/app.bundle.js"></script>
    </body>
</html>
`;
    expect(data).toBe(expectedComponentText);
});

test('created index.tsx file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false, false);

    let data = getFileData(indexTsxFilePath);

    let expectedComponentText = `\
import * as React from "react";
import * as ReactDom from "react-dom";
import * as ReactFlares from "react-flares";
import {MyProjectFlare} from "./flares/MyProject/MyProject.flare";

require("./index.html");

window.addEventListener("load", () => {
    ReactDom.render(
        <MyProjectFlare />
        , document.getElementById("content")
    );
});
`;
    expect(data).toBe(expectedComponentText);
});

test('created index.tsx file without initial component should match output', () => {
    projectCommand("MyProject", "1.0", false, true, false, false, false);

    let data = getFileData(indexTsxFilePath);

    let expectedComponentText = `\
import * as React from "react";
import * as ReactDom from "react-dom";
import * as ReactFlares from "react-flares";

require("./index.html");

window.addEventListener("load", () => {
    ReactDom.render(
        <section>
            <h1>MyProject - Ready</h1>
        </section>
        , document.getElementById("content")
    );
});
`;
    expect(data).toBe(expectedComponentText);
});