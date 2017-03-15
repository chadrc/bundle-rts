#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Arguments_1 = require("./Arguments");
var ComponentCommand_1 = require("./ComponentCommand");
var ModuleCommand_1 = require("./ModuleCommand");
var ProjectCommand_1 = require("./ProjectCommand");
var ManifestCommand_1 = require("./ManifestCommand");
var args = new Arguments_1.Arguments(process.argv);
args.skip(2); // skip node executable and command name
if (args.isEmpty) {
    console.log('No Arguments Given');
}
else {
    var command = args.next();
    switch (command) {
        case "component":
            ComponentCommand_1.ComponentCommand(args);
            break;
        case "module":
            ModuleCommand_1.ModuleCommand(args);
            break;
        case "project":
            ProjectCommand_1.ProjectCommand(args);
            break;
        case "manifest":
            ManifestCommand_1.ManifestCommand(args);
            break;
    }
}
