#!/usr/bin/env node
import {Arguments} from "./Arguments";
import { ensureDir} from "./Utils";
import {componentCommand, moduleCommand, projectCommand} from "./commands";
const spawn = require("child_process").spawn;

function execute(cmd: string, options: string[], callback: (code: number) => void) {
    const webpack = spawn(`./node_modules/.bin/${cmd}`, options);
    webpack.stdout.on("data", (data: BufferSource) => {
        console.log(data.toString());
    });

    webpack.stderr.on("data", (data: BufferSource) => {
        console.error(data.toString());
    });

    webpack.on("close", (code: number) => {
        callback(code);
    });
}

const settings = require('../package.json');

let args = new Arguments(process.argv);
args.skip(2); // skip node executable and command name

if (args.isEmpty) {
    console.log('No Arguments Given');
} else {
    let command = args.next();

    let appDir = "/app/";
    ensureDir(appDir);
    let wpArgs = args.argv;
    if (wpArgs.indexOf("--config") === -1) {
        wpArgs.unshift("--config", "./node_modules/react-flares/seed/webpack.config.js");
    }

    switch (command) {
        case "component":
            let componentPath = args.next();
            componentCommand(componentPath, args.noView, args.noTypes);
            break;

        case "module":
            let moduleName = args.next();
            moduleCommand(moduleName, args.noComponent, args.noStyles, args.noTypes, args.noView);
            break;

        case "project":
            let appName = args.next();
            projectCommand(appName, settings.version,
                args.noModule, args.noComponent, args.noStyles, args.noView, args.noTypes);
            break;

        case "build":
            execute("webpack", wpArgs, (code) => {
                console.log(`build exited with code ${code}`);
            });
            break;

        case "start":
            execute("webpack-dev-server", wpArgs, (code) => {
                console.log(`start exited with code ${code}`);
            });
            break;

        default:
            console.error("No such command: " + command);
    }
}