"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.sureAssignDefautOptions = exports.ConsistentAssigner = void 0;
var error_handling_1 = require("./error-handling");
// OPTIONS with defaults values set ----------
var __defaults = {
    complient: true,
    verbose: true,
    passmiss: false,
    sort: "no",
    unsure: false
};
var ConsistentAssigner = /** @class */ (function () {
    function ConsistentAssigner() {
        this.options = {};
        this.initOptions();
        this.errorHandler = new error_handling_1.ErrorHandler(this);
    }
    ConsistentAssigner.prototype.assign = function (instance) {
        var _this = this;
        var candidates = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            candidates[_i - 1] = arguments[_i];
        }
        // working on a copy
        var result = Object.assign({}, instance);
        // looping through all candidates list or given objects
        candidates.forEach(function (json) {
            // polpulate the checks if complient or throw if not
            var checks = _this.errorHandler.validateAssignement(instance, json);
            var _a = _this.options, complient = _a.complient, passmiss = _a.passmiss;
            var encouteredAMissing = checks.reasons.includes("missing property");
            // conditions to be complient on missing props :
            var complientOnMissing = 
            // - we already have a missing property,
            encouteredAMissing &&
                // - we dont pass the missed 
                // - and we are complient
                complient && !passmiss;
            // if we want to assign even if we have missmatchings
            var unsure = _this.options.unsure;
            // if nothing bad happened or if we accept missing properties
            if (!checks.reasons.length || complientOnMissing || unsure) {
                result = Object.assign(result, json);
            }
        });
        return this.sort(result);
    };
    ConsistentAssigner.prototype.sort = function (result) {
        var sorted = result;
        var regularSort = function (a, b) { return (a < b ? -1 : 1); };
        var sortInverse = function (a, b) { return (a < b ? 1 : -1); };
        var applySort = function (algo) {
            return Object.entries(result)
                .sort(function (_a, _b) {
                var a = _a[0];
                var b = _b[0];
                return algo(a, b);
            })
                .reduce(function (r, _a) {
                var _b;
                var k = _a[0], v = _a[1];
                return (__assign(__assign({}, r), (_b = {}, _b[k] = v, _b)));
            }, {});
        };
        if (this.options.sort === "asc") {
            sorted = applySort(regularSort);
        }
        else if (this.options.sort === "dsc") {
            sorted = applySort(sortInverse);
        }
        return sorted;
    };
    ConsistentAssigner.prototype["with"] = function (options) {
        if (options === void 0) { options = __defaults; }
        // even check if the options are correct
        this.errorHandler.validateAssignement(__defaults, options);
        // defaults if not set
        var _a = options.complient, complient = _a === void 0 ? __defaults.complient : _a, _b = options.verbose, verbose = _b === void 0 ? __defaults.verbose : _b, _c = options.passmiss, passmiss = _c === void 0 ? __defaults.passmiss : _c, _d = options.sort, sort = _d === void 0 ? __defaults.sort : _d, _e = options.unsure, unsure = _e === void 0 ? __defaults.unsure : _e;
        this.options = Object.assign(this.options, {
            complient: complient,
            passmiss: passmiss,
            verbose: verbose,
            sort: sort,
            unsure: unsure
        });
        return this;
    };
    ConsistentAssigner.prototype.initOptions = function () {
        // defaults applied no matter what
        this.options = Object.assign(this.options, __defaults);
    };
    return ConsistentAssigner;
}());
exports.ConsistentAssigner = ConsistentAssigner;
var sureAssignDefautOptions = __defaults;
exports.sureAssignDefautOptions = sureAssignDefautOptions;
