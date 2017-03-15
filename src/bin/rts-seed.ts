#!/usr/bin/env node

import {Arguments} from "./Arguments";
import {ComponentCommand} from "./ComponentCommand";
import {ModuleCommand} from "./ModuleCommand";
import {ProjectCommand} from "./ProjectCommand";
import {ManifestCommand} from "./ManifestCommand";

let args = new Arguments(process.argv);
args.skip(2); // skip node executable and command name

if (args.isEmpty) {
    console.log('No Arguments Given');
} else {

    let command = args.next();

    switch (command) {
        case "component":
            ComponentCommand(args);
            break;

        case "module":
            ModuleCommand(args);
            break;

        case "project":
            ProjectCommand(args);
            break;

        case "manifest":
            ManifestCommand(args);
            break;
    }
}