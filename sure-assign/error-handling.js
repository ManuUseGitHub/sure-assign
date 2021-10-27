"use strict";
exports.__esModule = true;
exports.ErrorHandler = void 0;
var ErrorHandler = /** @class */ (function () {
    function ErrorHandler(assigner) {
        this.assigner = assigner;
    }
    ErrorHandler.prototype.logOnVerbose = function (message, methodName) {
        if (methodName === void 0) { methodName = "log"; }
        if (this.assigner.options.verbose) {
            console[methodName](message);
        }
    };
    ErrorHandler.prototype.onFaillure = function (onError, checks) {
        var message = onError.message, reason = onError.reason;
        if (!checks) {
            return;
        }
        if (!this.assigner.options.complient) {
            throw message;
        }
        else {
            this.logOnVerbose(message, "warn");
            checks.reasons.push(reason);
        }
    };
    ErrorHandler.prototype.checkExistance = function (check) {
        var ciblingClassName = check.ciblingClassName, json = check.json, checks = check.checks;
        var assigner = this.assigner;
        var options = assigner.options;
        if (options.unsure) {
            this.onFaillure({
                message: "These fields .* will been assigned to your object of type " + ciblingClassName,
                reason: "unexists"
            }, checks);
        }
        else if (json == null || json == undefined) {
            this.onFaillure({
                message: "Assignement failed : Cannot assign a null or unexisting object to an instance of " + ciblingClassName,
                reason: "unexists"
            }, checks);
        }
    };
    ErrorHandler.prototype.checkConsistancy = function (check) {
        var ciblingClassName = check.ciblingClassName, json = check.json, checks = check.checks;
        // The instance is not an object of a class
        if (typeof json !== "object") {
            this.onFaillure({
                message: "Assignement failed : Cannot assign < " + json + " > of type " + json.constructor.name + " with an instance of type " + ciblingClassName,
                reason: "unconsistant"
            }, checks);
        }
    };
    ErrorHandler.prototype.checkSimilarity = function (check) {
        var instance = check.instance, json = check.json, checks = check.checks;
        var ciblingClassName = check.ciblingClassName;
        ciblingClassName =
            ciblingClassName === "Object" ? "Annonymous-Object" : ciblingClassName;
        // The instance and Json are the same object
        if (Object.is(instance, json)) {
            this.onFaillure({
                message: "Assignement failed : Cannot assign instance of type " + ciblingClassName + " to itself\"",
                reason: "similar"
            }, checks);
        }
    };
    ErrorHandler.prototype.checkFieldMatch = function (check) {
        var ciblingClassName = check.ciblingClassName, instance = check.instance, checks = check.checks, key = check.key;
        var assigner = this.assigner;
        var options = assigner.options;
        if (options.unsure)
            return;
        // The instance does not have field that we want to merge to
        if (key !== undefined && !(key in instance)) {
            // writing the message
            var message = "Assignement failed : >" + key + "< is a property missing from " + ciblingClassName + ".";
            // when the assignment is not complient
            if (assigner && !assigner.options.complient) {
                // throw an error
                throw message;
                // otherwise
            }
            else {
                // log the error
                this.logOnVerbose(message, "warn");
                checks.subset.push(key);
            }
        }
    };
    /**
     * final test. the json should be an object of the same level as the instance or lower.
     * if not, the json is an extension full of maybe things unwanted ... if so, it will throw
     * @param check
     */
    ErrorHandler.prototype.checkSizes = function (check) {
        var _this = this;
        var instance = check.instance, json = check.json, checks = check.checks, ciblingClassName = check.ciblingClassName;
        if (!checks.reasons.includes("unexists") &&
            !checks.reasons.includes("unconsistant")) {
            if (json) {
                Object.keys(json).forEach(function (key) {
                    _this.checkFieldMatch({
                        ciblingClassName: ciblingClassName,
                        instance: instance,
                        json: json,
                        checks: checks,
                        key: key
                    });
                });
            }
        }
    };
    ErrorHandler.prototype.validateAssignement = function (instance, json) {
        var ciblingClassName = instance.constructor.name;
        var checks = { reasons: [], subset: [] };
        var check = { ciblingClassName: ciblingClassName, instance: instance, json: json, checks: checks };
        this.checkExistance(check);
        this.checkSimilarity(check);
        this.checkConsistancy(check);
        this.checkSizes({ ciblingClassName: ciblingClassName, instance: instance, json: json, checks: checks });
        if (checks.subset.length) {
            checks.subset.forEach(function (key) { return delete json[key]; });
            checks.reasons.push("missing property");
        }
        return checks;
    };
    return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
