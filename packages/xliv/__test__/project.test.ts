import {projectCommand} from "../src/commands";
import {getFileData} from "./setup";
import * as fse from "fs-extra";

const pkgJsonFilePath =     "/package.json";
const indexHtmlFilePath =   "/app/index.html";
const indexTsxFilePath =    "/app/index.tsx";

const moduleFilePath =      "/app/modules/MyProject/MyProject.module.ts";
const stylesFilePath =      "/app/modules/MyProject/MyProject.scss";
const componentFilePath =   "/app/modules/MyProject/MyProject.component.ts";
const viewFilePath =        "/app/modules/MyProject/MyProject.view.tsx";
const typesFilePath =       "/app/modules/MyProject/MyProject.types.ts";

test("creates project with all default files", () => {
    projectCommand("MyProject", "1.0", false, false, false, false);

    expect(getFileData(pkgJsonFilePath)).toBeTruthy();
    expect(getFileData(indexHtmlFilePath)).toBeTruthy();
    expect(getFileData(indexTsxFilePath)).toBeTruthy();

    expect(getFileData(moduleFilePath)).toBeTruthy();
    expect(getFileData(stylesFilePath)).toBeTruthy();
    expect(() => getFileData(componentFilePath)).toThrow();
    expect(getFileData(viewFilePath)).toBeTruthy();
    expect(getFileData(typesFilePath)).toBeTruthy();
});

test("creates project without module", () => {
    projectCommand("MyProject", "1.0", true, false, false, false);

    expect(getFileData(pkgJsonFilePath)).toBeTruthy();
    expect(getFileData(indexHtmlFilePath)).toBeTruthy();
    expect(getFileData(indexTsxFilePath)).toBeTruthy();

    expect(() => getFileData(moduleFilePath)).toThrow();
    expect(() => getFileData(stylesFilePath)).toThrow();
    expect(() => getFileData(componentFilePath)).toThrow();
    expect(() => getFileData(viewFilePath)).toThrow();
    expect(() => getFileData(typesFilePath)).toThrow();
});

test('created package.json file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false);

    let data = getFileData(pkgJsonFilePath);

    // Lower case project name because npm requires it
    let expectedComponentText = `\
{
  "name": "myproject",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "xliv build --optimize-minimize",
    "start": "xliv start --open"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "xliv": "1.0"
  },
  "devDependencies": {
  
  }
}
`;
    expect(data).toBe(expectedComponentText);
});

test('existing package.json should be updated with xliv library value', () => {
     fse.writeFileSync(process.cwd() + pkgJsonFilePath, `\
{
  "custom": "my custom value"
}
`);
    projectCommand("MyProject", "1.0", false, false, false, false);

    let data = getFileData(pkgJsonFilePath);

    let pkgJson = JSON.parse(data);

    expect(pkgJson.dependencies.xliv).toBe("1.0");
    expect(pkgJson.scripts.build).toBe("xliv build");
    expect(pkgJson.scripts.start).toBe("xliv start --open");
    expect(pkgJson.custom).toBe("my custom value");
});

test('created index.html file should match output', () => {
    projectCommand("MyProject", "1.0", false, false, false, false);

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
    projectCommand("MyProject", "1.0", false, false, false, false);

    let data = getFileData(indexTsxFilePath);

    let expectedComponentText = `\
import * as React from "react";
import * as ReactDom from "react-dom";
import {MyProjectFlare} from "flares/MyProject/MyProject.flare";
import * as ENV from "env/base.env";

require("index.html");

window.addEventListener("load", () => {
    ReactDom.render(
        <MyProjectFlare>
            {ENV.APP_NAME} - Ready
        </MyProjectFlare>
        , document.getElementById("content")
    );
});
`;
    expect(data).toBe(expectedComponentText);
});

test('created index.tsx file without initial module should match output', () => {
    projectCommand("MyProject", "1.0", true, false, false, false);

    let data = getFileData(indexTsxFilePath);

    let expectedComponentText = `\
import * as React from "react";
import * as ReactDom from "react-dom";
import * as ENV from "env/base.env";

require("index.html");

window.addEventListener("load", () => {
    ReactDom.render(
        <section>
            {ENV.APP_NAME} - Ready
        </section>
        , document.getElementById("content")
    );
});
`;
    expect(data).toBe(expectedComponentText);
});