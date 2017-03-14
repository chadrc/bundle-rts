/**
 * Created by chad on 3/14/17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Arguments = (function () {
    function Arguments(argv) {
        this.argv = argv;
        this._noStyles = this.hasArg("--no-styles");
        this._noModule = this.hasArg("--no-mod");
        this._noComponent = this.hasArg("--no-comp");
        this._noView = this.hasArg("--no-view");
        this._noTypes = this.hasArg("--no-types");
    }
    Object.defineProperty(Arguments.prototype, "noStyles", {
        get: function () {
            return this._noStyles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arguments.prototype, "noModule", {
        get: function () {
            return this._noModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arguments.prototype, "noComponent", {
        get: function () {
            return this._noComponent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arguments.prototype, "noView", {
        get: function () {
            return this._noView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arguments.prototype, "noTypes", {
        get: function () {
            return this._noTypes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arguments.prototype, "isEmpty", {
        get: function () {
            return this.argv.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Arguments.prototype.next = function () {
        return this.argv.shift();
    };
    Arguments.prototype.skip = function (count) {
        if (count === void 0) { count = 1; }
        for (var i = 0; i < count; i++) {
            this.argv.shift();
        }
    };
    Arguments.prototype.hasArg = function (arg) {
        return this.argv.indexOf(arg.toLocaleLowerCase()) !== -1;
    };
    return Arguments;
}());
exports.Arguments = Arguments;
