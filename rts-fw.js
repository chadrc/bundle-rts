/**
 * Created by chad on 3/11/17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StylePromise = (function () {
    function StylePromise(styleUri) {
        var _this = this;
        var link = document.createElement("link");
        var head = document.getElementsByTagName("head")[0];
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", styleUri);
        link.setAttribute("type", "text/css");
        link.addEventListener("load", function () { return _this.cssReceived(); });
        link.addEventListener("error", function () { return _this.cssReceived(); });
        head.appendChild(link);
    }
    StylePromise.prototype.cssReceived = function () {
        if (this._callback != null) {
            this._callback();
        }
    };
    StylePromise.prototype.cssError = function () {
        if (this._fail != null) {
            this._fail();
        }
    };
    StylePromise.prototype.then = function (callback, failFallback) {
        this._callback = callback;
        this._fail = failFallback;
    };
    return StylePromise;
}());
var ModulePromise = (function () {
    function ModulePromise(jsPromise, cssPromise) {
        var _this = this;
        this._jsPromise = jsPromise;
        this._cssPromise = cssPromise;
        this._jsPromise.then(function () {
            _this.onJsReceived(true);
        }, function () {
            _this.onJsReceived(false);
        });
        this._cssPromise.then(function () {
            _this.onCssReceived(true);
        }, function () {
            _this.onCssReceived(false);
        });
        this._jsReceived = false;
        this._cssReceived = false;
    }
    ModulePromise.prototype.onJsReceived = function (received) {
        this._jsReceived = received;
        if ((this._cssPromise === null || this._cssReceived)
            && this._callback != null) {
            this._callback();
        }
    };
    ModulePromise.prototype.onCssReceived = function (received) {
        this._cssReceived = received;
        if ((this._jsPromise === null || this._jsReceived)
            && this._callback != null) {
            this._callback();
        }
    };
    ModulePromise.prototype.then = function (callback) {
        this._callback = callback;
    };
    return ModulePromise;
}());
var ModuleLoader = (function () {
    function ModuleLoader(moduleName) {
        this._moduleName = moduleName;
        this._loaded = false;
        this._module = null;
    }
    ModuleLoader.prototype.load = function (callback) {
        var _this = this;
        var name = this._moduleName;
        if (name in ModuleLoader._moduleMap) {
            var info = ModuleLoader._moduleMap[name];
            // Already loaded
        }
        else {
            var jsPromise = $.getScript("/react-expr-002/dist/js/" + name + ".bundle.js");
            var cssPromise = new StylePromise("/react-expr-002/dist/styles/" + name + ".bundle.css");
            this._promise = new ModulePromise(jsPromise, cssPromise);
            this._promise.then(function () { _this.onModuleLoaded(); });
            this._callback = callback;
        }
    };
    ModuleLoader.prototype.onModuleLoaded = function () {
        if (this._callback !== null) {
            this._callback();
        }
    };
    return ModuleLoader;
}());
ModuleLoader._moduleMap = {};
function loadModule(name, callback) {
    new ModuleLoader(name).load(callback);
}
exports.loadModule = loadModule;
function getModule(name) {
    return window[name];
}
exports.getModule = getModule;
var App = (function () {
    function App(modules) {
    }
    return App;
}());
exports.App = App;
//# sourceMappingURL=rts-fw.js.map