/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9139:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
const core_1 = __nccwpck_require__(2186);
const service_management_1 = __nccwpck_require__(8887);
function handleServiceNotFound(inputs) {
    const { name, failIfNoMatch } = inputs;
    const message = `Service '${name}' not found.`;
    if (failIfNoMatch)
        throw message;
    core_1.info(message);
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputs = {
            name: core_1.getInput("name"),
            cluster: core_1.getInput("cluster"),
            failIfNoMatch: core_1.getInput("fail-if-no-match") == "true",
        };
        const service = yield service_management_1.getService(inputs);
        if (!service) {
            handleServiceNotFound(inputs);
            return;
        }
        core_1.info(`Scaling service '${service.serviceName}' down to zero tasks...`);
        yield service_management_1.scaleServiceDownToZeroTasks(inputs);
        core_1.info("...done!");
        core_1.info(`Deleting service '${service.serviceName}'...`);
        yield service_management_1.deleteService(inputs);
        core_1.info(`...done!`);
        core_1.setOutput("service-arn", service.serviceArn);
        return 0;
    });
}
exports.run = run;
//# sourceMappingURL=action.js.map

/***/ }),

/***/ 3109:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__nccwpck_require__(9139), exports);
__exportStar(__nccwpck_require__(8887), exports);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 8887:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteService = exports.getService = exports.scaleServiceDownToZeroTasks = void 0;
const ecs_1 = __importDefault(__nccwpck_require__(6615));
function getClient() {
    return new ecs_1.default({
        customUserAgent: "icalia-actions/aws-action",
        region: process.env.AWS_DEFAULT_REGION,
    });
}
function scaleServiceDownToZeroTasks(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cluster, name } = inputs;
        const { service } = yield getClient()
            .updateService({
            service: name,
            cluster,
            desiredCount: 0,
        })
            .promise();
        return service;
    });
}
exports.scaleServiceDownToZeroTasks = scaleServiceDownToZeroTasks;
function getService(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cluster, name } = inputs;
        const { services, failures } = yield getClient()
            .describeServices({
            cluster,
            services: [name],
        })
            .promise();
        if (failures === null || failures === void 0 ? void 0 : failures.length)
            return;
        const service = services === null || services === void 0 ? void 0 : services.pop();
        if ((service === null || service === void 0 ? void 0 : service.status) == "INACTIVE")
            return;
        return service;
    });
}
exports.getService = getService;
function deleteService(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cluster, name } = inputs;
        const { service } = yield getClient()
            .deleteService({
            cluster,
            service: name,
        })
            .promise();
        return service;
    });
}
exports.deleteService = deleteService;
//# sourceMappingURL=service-management.js.map

/***/ }),

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 8291:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

__nccwpck_require__(3639);
var AWS = __nccwpck_require__(8437);
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['cognitoidentity'] = {};
AWS.CognitoIdentity = Service.defineService('cognitoidentity', ['2014-06-30']);
Object.defineProperty(apiLoader.services['cognitoidentity'], '2014-06-30', {
  get: function get() {
    var model = __nccwpck_require__(6102);
    model.paginators = __nccwpck_require__(796)/* .pagination */ .o;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.CognitoIdentity;


/***/ }),

/***/ 6615:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

__nccwpck_require__(3639);
var AWS = __nccwpck_require__(8437);
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['ecs'] = {};
AWS.ECS = Service.defineService('ecs', ['2014-11-13']);
Object.defineProperty(apiLoader.services['ecs'], '2014-11-13', {
  get: function get() {
    var model = __nccwpck_require__(8155);
    model.paginators = __nccwpck_require__(3629)/* .pagination */ .o;
    model.waiters = __nccwpck_require__(4199)/* .waiters */ .V;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.ECS;


/***/ }),

/***/ 7513:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

__nccwpck_require__(3639);
var AWS = __nccwpck_require__(8437);
var Service = AWS.Service;
var apiLoader = AWS.apiLoader;

apiLoader.services['sts'] = {};
AWS.STS = Service.defineService('sts', ['2011-06-15']);
__nccwpck_require__(1055);
Object.defineProperty(apiLoader.services['sts'], '2011-06-15', {
  get: function get() {
    var model = __nccwpck_require__(8976);
    model.paginators = __nccwpck_require__(2952)/* .pagination */ .o;
    return model;
  },
  enumerable: true,
  configurable: true
});

module.exports = AWS.STS;


/***/ }),

/***/ 2793:
/***/ ((module) => {

function apiLoader(svc, version) {
  if (!apiLoader.services.hasOwnProperty(svc)) {
    throw new Error('InvalidService: Failed to load api for ' + svc);
  }
  return apiLoader.services[svc][version];
}

/**
 * @api private
 *
 * This member of AWS.apiLoader is private, but changing it will necessitate a
 * change to ../scripts/services-table-generator.ts
 */
apiLoader.services = {};

/**
 * @api private
 */
module.exports = apiLoader;


/***/ }),

/***/ 8110:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
__nccwpck_require__(3819);
__nccwpck_require__(6965);
var PromisesDependency;

/**
 * The main configuration class used by all service objects to set
 * the region, credentials, and other options for requests.
 *
 * By default, credentials and region settings are left unconfigured.
 * This should be configured by the application before using any
 * AWS service APIs.
 *
 * In order to set global configuration options, properties should
 * be assigned to the global {AWS.config} object.
 *
 * @see AWS.config
 *
 * @!group General Configuration Options
 *
 * @!attribute credentials
 *   @return [AWS.Credentials] the AWS credentials to sign requests with.
 *
 * @!attribute region
 *   @example Set the global region setting to us-west-2
 *     AWS.config.update({region: 'us-west-2'});
 *   @return [AWS.Credentials] The region to send service requests to.
 *   @see http://docs.amazonwebservices.com/general/latest/gr/rande.html
 *     A list of available endpoints for each AWS service
 *
 * @!attribute maxRetries
 *   @return [Integer] the maximum amount of retries to perform for a
 *     service request. By default this value is calculated by the specific
 *     service object that the request is being made to.
 *
 * @!attribute maxRedirects
 *   @return [Integer] the maximum amount of redirects to follow for a
 *     service request. Defaults to 10.
 *
 * @!attribute paramValidation
 *   @return [Boolean|map] whether input parameters should be validated against
 *     the operation description before sending the request. Defaults to true.
 *     Pass a map to enable any of the following specific validation features:
 *
 *     * **min** [Boolean] &mdash; Validates that a value meets the min
 *       constraint. This is enabled by default when paramValidation is set
 *       to `true`.
 *     * **max** [Boolean] &mdash; Validates that a value meets the max
 *       constraint.
 *     * **pattern** [Boolean] &mdash; Validates that a string value matches a
 *       regular expression.
 *     * **enum** [Boolean] &mdash; Validates that a string value matches one
 *       of the allowable enum values.
 *
 * @!attribute computeChecksums
 *   @return [Boolean] whether to compute checksums for payload bodies when
 *     the service accepts it (currently supported in S3 only).
 *
 * @!attribute convertResponseTypes
 *   @return [Boolean] whether types are converted when parsing response data.
 *     Currently only supported for JSON based services. Turning this off may
 *     improve performance on large response payloads. Defaults to `true`.
 *
 * @!attribute correctClockSkew
 *   @return [Boolean] whether to apply a clock skew correction and retry
 *     requests that fail because of an skewed client clock. Defaults to
 *     `false`.
 *
 * @!attribute sslEnabled
 *   @return [Boolean] whether SSL is enabled for requests
 *
 * @!attribute s3ForcePathStyle
 *   @return [Boolean] whether to force path style URLs for S3 objects
 *
 * @!attribute s3BucketEndpoint
 *   @note Setting this configuration option requires an `endpoint` to be
 *     provided explicitly to the service constructor.
 *   @return [Boolean] whether the provided endpoint addresses an individual
 *     bucket (false if it addresses the root API endpoint).
 *
 * @!attribute s3DisableBodySigning
 *   @return [Boolean] whether to disable S3 body signing when using signature version `v4`.
 *     Body signing can only be disabled when using https. Defaults to `true`.
 *
 * @!attribute s3UsEast1RegionalEndpoint
 *   @return ['legacy'|'regional'] when region is set to 'us-east-1', whether to send s3
 *     request to global endpoints or 'us-east-1' regional endpoints. This config is only
 *     applicable to S3 client;
 *     Defaults to 'legacy'
 * @!attribute s3UseArnRegion
 *   @return [Boolean] whether to override the request region with the region inferred
 *     from requested resource's ARN. Only available for S3 buckets
 *     Defaults to `true`
 *
 * @!attribute useAccelerateEndpoint
 *   @note This configuration option is only compatible with S3 while accessing
 *     dns-compatible buckets.
 *   @return [Boolean] Whether to use the Accelerate endpoint with the S3 service.
 *     Defaults to `false`.
 *
 * @!attribute retryDelayOptions
 *   @example Set the base retry delay for all services to 300 ms
 *     AWS.config.update({retryDelayOptions: {base: 300}});
 *     // Delays with maxRetries = 3: 300, 600, 1200
 *   @example Set a custom backoff function to provide delay values on retries
 *     AWS.config.update({retryDelayOptions: {customBackoff: function(retryCount, err) {
 *       // returns delay in ms
 *     }}});
 *   @return [map] A set of options to configure the retry delay on retryable errors.
 *     Currently supported options are:
 *
 *     * **base** [Integer] &mdash; The base number of milliseconds to use in the
 *       exponential backoff for operation retries. Defaults to 100 ms for all services except
 *       DynamoDB, where it defaults to 50ms.
 *
 *     * **customBackoff ** [function] &mdash; A custom function that accepts a
 *       retry count and error and returns the amount of time to delay in
 *       milliseconds. If the result is a non-zero negative value, no further
 *       retry attempts will be made. The `base` option will be ignored if this
 *       option is supplied. The function is only called for retryable errors.
 *
 * @!attribute httpOptions
 *   @return [map] A set of options to pass to the low-level HTTP request.
 *     Currently supported options are:
 *
 *     * **proxy** [String] &mdash; the URL to proxy requests through
 *     * **agent** [http.Agent, https.Agent] &mdash; the Agent object to perform
 *       HTTP requests with. Used for connection pooling. Note that for
 *       SSL connections, a special Agent object is used in order to enable
 *       peer certificate verification. This feature is only supported in the
 *       Node.js environment.
 *     * **connectTimeout** [Integer] &mdash; Sets the socket to timeout after
 *       failing to establish a connection with the server after
 *       `connectTimeout` milliseconds. This timeout has no effect once a socket
 *       connection has been established.
 *     * **timeout** [Integer] &mdash; The number of milliseconds a request can
 *       take before automatically being terminated.
 *       Defaults to two minutes (120000).
 *     * **xhrAsync** [Boolean] &mdash; Whether the SDK will send asynchronous
 *       HTTP requests. Used in the browser environment only. Set to false to
 *       send requests synchronously. Defaults to true (async on).
 *     * **xhrWithCredentials** [Boolean] &mdash; Sets the "withCredentials"
 *       property of an XMLHttpRequest object. Used in the browser environment
 *       only. Defaults to false.
 * @!attribute logger
 *   @return [#write,#log] an object that responds to .write() (like a stream)
 *     or .log() (like the console object) in order to log information about
 *     requests
 *
 * @!attribute systemClockOffset
 *   @return [Number] an offset value in milliseconds to apply to all signing
 *     times. Use this to compensate for clock skew when your system may be
 *     out of sync with the service time. Note that this configuration option
 *     can only be applied to the global `AWS.config` object and cannot be
 *     overridden in service-specific configuration. Defaults to 0 milliseconds.
 *
 * @!attribute signatureVersion
 *   @return [String] the signature version to sign requests with (overriding
 *     the API configuration). Possible values are: 'v2', 'v3', 'v4'.
 *
 * @!attribute signatureCache
 *   @return [Boolean] whether the signature to sign requests with (overriding
 *     the API configuration) is cached. Only applies to the signature version 'v4'.
 *     Defaults to `true`.
 *
 * @!attribute endpointDiscoveryEnabled
 *   @return [Boolean|undefined] whether to call operations with endpoints
 *     given by service dynamically. Setting this config to `true` will enable
 *     endpoint discovery for all applicable operations. Setting it to `false`
 *     will explicitly disable endpoint discovery even though operations that
 *     require endpoint discovery will presumably fail. Leaving it to
 *     `undefined` means SDK only do endpoint discovery when it's required.
 *     Defaults to `undefined`
 *
 * @!attribute endpointCacheSize
 *   @return [Number] the size of the global cache storing endpoints from endpoint
 *     discovery operations. Once endpoint cache is created, updating this setting
 *     cannot change existing cache size.
 *     Defaults to 1000
 *
 * @!attribute hostPrefixEnabled
 *   @return [Boolean] whether to marshal request parameters to the prefix of
 *     hostname. Defaults to `true`.
 *
 * @!attribute stsRegionalEndpoints
 *   @return ['legacy'|'regional'] whether to send sts request to global endpoints or
 *     regional endpoints.
 *     Defaults to 'legacy'
 */
AWS.Config = AWS.util.inherit({
  /**
   * @!endgroup
   */

  /**
   * Creates a new configuration object. This is the object that passes
   * option data along to service requests, including credentials, security,
   * region information, and some service specific settings.
   *
   * @example Creating a new configuration object with credentials and region
   *   var config = new AWS.Config({
   *     accessKeyId: 'AKID', secretAccessKey: 'SECRET', region: 'us-west-2'
   *   });
   * @option options accessKeyId [String] your AWS access key ID.
   * @option options secretAccessKey [String] your AWS secret access key.
   * @option options sessionToken [AWS.Credentials] the optional AWS
   *   session token to sign requests with.
   * @option options credentials [AWS.Credentials] the AWS credentials
   *   to sign requests with. You can either specify this object, or
   *   specify the accessKeyId and secretAccessKey options directly.
   * @option options credentialProvider [AWS.CredentialProviderChain] the
   *   provider chain used to resolve credentials if no static `credentials`
   *   property is set.
   * @option options region [String] the region to send service requests to.
   *   See {region} for more information.
   * @option options maxRetries [Integer] the maximum amount of retries to
   *   attempt with a request. See {maxRetries} for more information.
   * @option options maxRedirects [Integer] the maximum amount of redirects to
   *   follow with a request. See {maxRedirects} for more information.
   * @option options sslEnabled [Boolean] whether to enable SSL for
   *   requests.
   * @option options paramValidation [Boolean|map] whether input parameters
   *   should be validated against the operation description before sending
   *   the request. Defaults to true. Pass a map to enable any of the
   *   following specific validation features:
   *
   *   * **min** [Boolean] &mdash; Validates that a value meets the min
   *     constraint. This is enabled by default when paramValidation is set
   *     to `true`.
   *   * **max** [Boolean] &mdash; Validates that a value meets the max
   *     constraint.
   *   * **pattern** [Boolean] &mdash; Validates that a string value matches a
   *     regular expression.
   *   * **enum** [Boolean] &mdash; Validates that a string value matches one
   *     of the allowable enum values.
   * @option options computeChecksums [Boolean] whether to compute checksums
   *   for payload bodies when the service accepts it (currently supported
   *   in S3 only)
   * @option options convertResponseTypes [Boolean] whether types are converted
   *     when parsing response data. Currently only supported for JSON based
   *     services. Turning this off may improve performance on large response
   *     payloads. Defaults to `true`.
   * @option options correctClockSkew [Boolean] whether to apply a clock skew
   *     correction and retry requests that fail because of an skewed client
   *     clock. Defaults to `false`.
   * @option options s3ForcePathStyle [Boolean] whether to force path
   *   style URLs for S3 objects.
   * @option options s3BucketEndpoint [Boolean] whether the provided endpoint
   *   addresses an individual bucket (false if it addresses the root API
   *   endpoint). Note that setting this configuration option requires an
   *   `endpoint` to be provided explicitly to the service constructor.
   * @option options s3DisableBodySigning [Boolean] whether S3 body signing
   *   should be disabled when using signature version `v4`. Body signing
   *   can only be disabled when using https. Defaults to `true`.
   * @option options s3UsEast1RegionalEndpoint ['legacy'|'regional'] when region
   *   is set to 'us-east-1', whether to send s3 request to global endpoints or
   *   'us-east-1' regional endpoints. This config is only applicable to S3 client.
   *   Defaults to `legacy`
   * @option options s3UseArnRegion [Boolean] whether to override the request region
   *   with the region inferred from requested resource's ARN. Only available for S3 buckets
   *   Defaults to `true`
   *
   * @option options retryDelayOptions [map] A set of options to configure
   *   the retry delay on retryable errors. Currently supported options are:
   *
   *   * **base** [Integer] &mdash; The base number of milliseconds to use in the
   *     exponential backoff for operation retries. Defaults to 100 ms for all
   *     services except DynamoDB, where it defaults to 50ms.
   *   * **customBackoff ** [function] &mdash; A custom function that accepts a
   *     retry count and error and returns the amount of time to delay in
   *     milliseconds. If the result is a non-zero negative value, no further
   *     retry attempts will be made. The `base` option will be ignored if this
   *     option is supplied. The function is only called for retryable errors.
   * @option options httpOptions [map] A set of options to pass to the low-level
   *   HTTP request. Currently supported options are:
   *
   *   * **proxy** [String] &mdash; the URL to proxy requests through
   *   * **agent** [http.Agent, https.Agent] &mdash; the Agent object to perform
   *     HTTP requests with. Used for connection pooling. Defaults to the global
   *     agent (`http.globalAgent`) for non-SSL connections. Note that for
   *     SSL connections, a special Agent object is used in order to enable
   *     peer certificate verification. This feature is only available in the
   *     Node.js environment.
   *   * **connectTimeout** [Integer] &mdash; Sets the socket to timeout after
   *     failing to establish a connection with the server after
   *     `connectTimeout` milliseconds. This timeout has no effect once a socket
   *     connection has been established.
   *   * **timeout** [Integer] &mdash; Sets the socket to timeout after timeout
   *     milliseconds of inactivity on the socket. Defaults to two minutes
   *     (120000).
   *   * **xhrAsync** [Boolean] &mdash; Whether the SDK will send asynchronous
   *     HTTP requests. Used in the browser environment only. Set to false to
   *     send requests synchronously. Defaults to true (async on).
   *   * **xhrWithCredentials** [Boolean] &mdash; Sets the "withCredentials"
   *     property of an XMLHttpRequest object. Used in the browser environment
   *     only. Defaults to false.
   * @option options apiVersion [String, Date] a String in YYYY-MM-DD format
   *   (or a date) that represents the latest possible API version that can be
   *   used in all services (unless overridden by `apiVersions`). Specify
   *   'latest' to use the latest possible version.
   * @option options apiVersions [map<String, String|Date>] a map of service
   *   identifiers (the lowercase service class name) with the API version to
   *   use when instantiating a service. Specify 'latest' for each individual
   *   that can use the latest available version.
   * @option options logger [#write,#log] an object that responds to .write()
   *   (like a stream) or .log() (like the console object) in order to log
   *   information about requests
   * @option options systemClockOffset [Number] an offset value in milliseconds
   *   to apply to all signing times. Use this to compensate for clock skew
   *   when your system may be out of sync with the service time. Note that
   *   this configuration option can only be applied to the global `AWS.config`
   *   object and cannot be overridden in service-specific configuration.
   *   Defaults to 0 milliseconds.
   * @option options signatureVersion [String] the signature version to sign
   *   requests with (overriding the API configuration). Possible values are:
   *   'v2', 'v3', 'v4'.
   * @option options signatureCache [Boolean] whether the signature to sign
   *   requests with (overriding the API configuration) is cached. Only applies
   *   to the signature version 'v4'. Defaults to `true`.
   * @option options dynamoDbCrc32 [Boolean] whether to validate the CRC32
   *   checksum of HTTP response bodies returned by DynamoDB. Default: `true`.
   * @option options useAccelerateEndpoint [Boolean] Whether to use the
   *   S3 Transfer Acceleration endpoint with the S3 service. Default: `false`.
   * @option options clientSideMonitoring [Boolean] whether to collect and
   *   publish this client's performance metrics of all its API requests.
   * @option options endpointDiscoveryEnabled [Boolean|undefined] whether to
   *   call operations with endpoints given by service dynamically. Setting this
   * config to `true` will enable endpoint discovery for all applicable operations.
   *   Setting it to `false` will explicitly disable endpoint discovery even though
   *   operations that require endpoint discovery will presumably fail. Leaving it
   *   to `undefined` means SDK will only do endpoint discovery when it's required.
   *   Defaults to `undefined`
   * @option options endpointCacheSize [Number] the size of the global cache storing
   *   endpoints from endpoint discovery operations. Once endpoint cache is created,
   *   updating this setting cannot change existing cache size.
   *   Defaults to 1000
   * @option options hostPrefixEnabled [Boolean] whether to marshal request
   *   parameters to the prefix of hostname.
   *   Defaults to `true`.
   * @option options stsRegionalEndpoints ['legacy'|'regional'] whether to send sts request
   *   to global endpoints or regional endpoints.
   *   Defaults to 'legacy'.
   */
  constructor: function Config(options) {
    if (options === undefined) options = {};
    options = this.extractCredentials(options);

    AWS.util.each.call(this, this.keys, function (key, value) {
      this.set(key, options[key], value);
    });
  },

  /**
   * @!group Managing Credentials
   */

  /**
   * Loads credentials from the configuration object. This is used internally
   * by the SDK to ensure that refreshable {Credentials} objects are properly
   * refreshed and loaded when sending a request. If you want to ensure that
   * your credentials are loaded prior to a request, you can use this method
   * directly to provide accurate credential data stored in the object.
   *
   * @note If you configure the SDK with static or environment credentials,
   *   the credential data should already be present in {credentials} attribute.
   *   This method is primarily necessary to load credentials from asynchronous
   *   sources, or sources that can refresh credentials periodically.
   * @example Getting your access key
   *   AWS.config.getCredentials(function(err) {
   *     if (err) console.log(err.stack); // credentials not loaded
   *     else console.log("Access Key:", AWS.config.credentials.accessKeyId);
   *   })
   * @callback callback function(err)
   *   Called when the {credentials} have been properly set on the configuration
   *   object.
   *
   *   @param err [Error] if this is set, credentials were not successfully
   *     loaded and this error provides information why.
   * @see credentials
   * @see Credentials
   */
  getCredentials: function getCredentials(callback) {
    var self = this;

    function finish(err) {
      callback(err, err ? null : self.credentials);
    }

    function credError(msg, err) {
      return new AWS.util.error(err || new Error(), {
        code: 'CredentialsError',
        message: msg,
        name: 'CredentialsError'
      });
    }

    function getAsyncCredentials() {
      self.credentials.get(function(err) {
        if (err) {
          var msg = 'Could not load credentials from ' +
            self.credentials.constructor.name;
          err = credError(msg, err);
        }
        finish(err);
      });
    }

    function getStaticCredentials() {
      var err = null;
      if (!self.credentials.accessKeyId || !self.credentials.secretAccessKey) {
        err = credError('Missing credentials');
      }
      finish(err);
    }

    if (self.credentials) {
      if (typeof self.credentials.get === 'function') {
        getAsyncCredentials();
      } else { // static credentials
        getStaticCredentials();
      }
    } else if (self.credentialProvider) {
      self.credentialProvider.resolve(function(err, creds) {
        if (err) {
          err = credError('Could not load credentials from any providers', err);
        }
        self.credentials = creds;
        finish(err);
      });
    } else {
      finish(credError('No credentials to load'));
    }
  },

  /**
   * @!group Loading and Setting Configuration Options
   */

  /**
   * @overload update(options, allowUnknownKeys = false)
   *   Updates the current configuration object with new options.
   *
   *   @example Update maxRetries property of a configuration object
   *     config.update({maxRetries: 10});
   *   @param [Object] options a map of option keys and values.
   *   @param [Boolean] allowUnknownKeys whether unknown keys can be set on
   *     the configuration object. Defaults to `false`.
   *   @see constructor
   */
  update: function update(options, allowUnknownKeys) {
    allowUnknownKeys = allowUnknownKeys || false;
    options = this.extractCredentials(options);
    AWS.util.each.call(this, options, function (key, value) {
      if (allowUnknownKeys || Object.prototype.hasOwnProperty.call(this.keys, key) ||
          AWS.Service.hasService(key)) {
        this.set(key, value);
      }
    });
  },

  /**
   * Loads configuration data from a JSON file into this config object.
   * @note Loading configuration will reset all existing configuration
   *   on the object.
   * @!macro nobrowser
   * @param path [String] the path relative to your process's current
   *    working directory to load configuration from.
   * @return [AWS.Config] the same configuration object
   */
  loadFromPath: function loadFromPath(path) {
    this.clear();

    var options = JSON.parse(AWS.util.readFileSync(path));
    var fileSystemCreds = new AWS.FileSystemCredentials(path);
    var chain = new AWS.CredentialProviderChain();
    chain.providers.unshift(fileSystemCreds);
    chain.resolve(function (err, creds) {
      if (err) throw err;
      else options.credentials = creds;
    });

    this.constructor(options);

    return this;
  },

  /**
   * Clears configuration data on this object
   *
   * @api private
   */
  clear: function clear() {
    /*jshint forin:false */
    AWS.util.each.call(this, this.keys, function (key) {
      delete this[key];
    });

    // reset credential provider
    this.set('credentials', undefined);
    this.set('credentialProvider', undefined);
  },

  /**
   * Sets a property on the configuration object, allowing for a
   * default value
   * @api private
   */
  set: function set(property, value, defaultValue) {
    if (value === undefined) {
      if (defaultValue === undefined) {
        defaultValue = this.keys[property];
      }
      if (typeof defaultValue === 'function') {
        this[property] = defaultValue.call(this);
      } else {
        this[property] = defaultValue;
      }
    } else if (property === 'httpOptions' && this[property]) {
      // deep merge httpOptions
      this[property] = AWS.util.merge(this[property], value);
    } else {
      this[property] = value;
    }
  },

  /**
   * All of the keys with their default values.
   *
   * @constant
   * @api private
   */
  keys: {
    credentials: null,
    credentialProvider: null,
    region: null,
    logger: null,
    apiVersions: {},
    apiVersion: null,
    endpoint: undefined,
    httpOptions: {
      timeout: 120000
    },
    maxRetries: undefined,
    maxRedirects: 10,
    paramValidation: true,
    sslEnabled: true,
    s3ForcePathStyle: false,
    s3BucketEndpoint: false,
    s3DisableBodySigning: true,
    s3UsEast1RegionalEndpoint: 'legacy',
    s3UseArnRegion: undefined,
    computeChecksums: true,
    convertResponseTypes: true,
    correctClockSkew: false,
    customUserAgent: null,
    dynamoDbCrc32: true,
    systemClockOffset: 0,
    signatureVersion: null,
    signatureCache: true,
    retryDelayOptions: {},
    useAccelerateEndpoint: false,
    clientSideMonitoring: false,
    endpointDiscoveryEnabled: undefined,
    endpointCacheSize: 1000,
    hostPrefixEnabled: true,
    stsRegionalEndpoints: 'legacy'
  },

  /**
   * Extracts accessKeyId, secretAccessKey and sessionToken
   * from a configuration hash.
   *
   * @api private
   */
  extractCredentials: function extractCredentials(options) {
    if (options.accessKeyId && options.secretAccessKey) {
      options = AWS.util.copy(options);
      options.credentials = new AWS.Credentials(options);
    }
    return options;
  },

  /**
   * Sets the promise dependency the SDK will use wherever Promises are returned.
   * Passing `null` will force the SDK to use native Promises if they are available.
   * If native Promises are not available, passing `null` will have no effect.
   * @param [Constructor] dep A reference to a Promise constructor
   */
  setPromisesDependency: function setPromisesDependency(dep) {
    PromisesDependency = dep;
    // if null was passed in, we should try to use native promises
    if (dep === null && typeof Promise === 'function') {
      PromisesDependency = Promise;
    }
    var constructors = [AWS.Request, AWS.Credentials, AWS.CredentialProviderChain];
    if (AWS.S3) {
      constructors.push(AWS.S3);
      if (AWS.S3.ManagedUpload) {
        constructors.push(AWS.S3.ManagedUpload);
      }
    }
    AWS.util.addPromises(constructors, PromisesDependency);
  },

  /**
   * Gets the promise dependency set by `AWS.config.setPromisesDependency`.
   */
  getPromisesDependency: function getPromisesDependency() {
    return PromisesDependency;
  }
});

/**
 * @return [AWS.Config] The global configuration object singleton instance
 * @readonly
 * @see AWS.Config
 */
AWS.config = new AWS.Config();


/***/ }),

/***/ 5566:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
/**
 * @api private
 */
function validateRegionalEndpointsFlagValue(configValue, errorOptions) {
  if (typeof configValue !== 'string') return undefined;
  else if (['legacy', 'regional'].indexOf(configValue.toLowerCase()) >= 0) {
    return configValue.toLowerCase();
  } else {
    throw AWS.util.error(new Error(), errorOptions);
  }
}

/**
 * Resolve the configuration value for regional endpoint from difference sources: client
 * config, environmental variable, shared config file. Value can be case-insensitive
 * 'legacy' or 'reginal'.
 * @param originalConfig user-supplied config object to resolve
 * @param options a map of config property names from individual configuration source
 *  - env: name of environmental variable that refers to the config
 *  - sharedConfig: name of shared configuration file property that refers to the config
 *  - clientConfig: name of client configuration property that refers to the config
 *
 * @api private
 */
function resolveRegionalEndpointsFlag(originalConfig, options) {
  originalConfig = originalConfig || {};
  //validate config value
  var resolved;
  if (originalConfig[options.clientConfig]) {
    resolved = validateRegionalEndpointsFlagValue(originalConfig[options.clientConfig], {
      code: 'InvalidConfiguration',
      message: 'invalid "' + options.clientConfig + '" configuration. Expect "legacy" ' +
      ' or "regional". Got "' + originalConfig[options.clientConfig] + '".'
    });
    if (resolved) return resolved;
  }
  if (!AWS.util.isNode()) return resolved;
  //validate environmental variable
  if (Object.prototype.hasOwnProperty.call(process.env, options.env)) {
    var envFlag = process.env[options.env];
    resolved = validateRegionalEndpointsFlagValue(envFlag, {
      code: 'InvalidEnvironmentalVariable',
      message: 'invalid ' + options.env + ' environmental variable. Expect "legacy" ' +
      ' or "regional". Got "' + process.env[options.env] + '".'
    });
    if (resolved) return resolved;
  }
  //validate shared config file
  var profile = {};
  try {
    var profiles = AWS.util.getProfilesFromSharedConfig(AWS.util.iniLoader);
    profile = profiles[process.env.AWS_PROFILE || AWS.util.defaultProfile];
  } catch (e) {};
  if (profile && Object.prototype.hasOwnProperty.call(profile, options.sharedConfig)) {
    var fileFlag = profile[options.sharedConfig];
    resolved = validateRegionalEndpointsFlagValue(fileFlag, {
      code: 'InvalidConfiguration',
      message: 'invalid ' + options.sharedConfig + ' profile config. Expect "legacy" ' +
      ' or "regional". Got "' + profile[options.sharedConfig] + '".'
    });
    if (resolved) return resolved;
  }
  return resolved;
}

module.exports = resolveRegionalEndpointsFlag;


/***/ }),

/***/ 8437:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * The main AWS namespace
 */
var AWS = { util: __nccwpck_require__(7985) };

/**
 * @api private
 * @!macro [new] nobrowser
 *   @note This feature is not supported in the browser environment of the SDK.
 */
var _hidden = {}; _hidden.toString(); // hack to parse macro

/**
 * @api private
 */
module.exports = AWS;

AWS.util.update(AWS, {

  /**
   * @constant
   */
  VERSION: '2.888.0',

  /**
   * @api private
   */
  Signers: {},

  /**
   * @api private
   */
  Protocol: {
    Json: __nccwpck_require__(83),
    Query: __nccwpck_require__(761),
    Rest: __nccwpck_require__(8200),
    RestJson: __nccwpck_require__(5883),
    RestXml: __nccwpck_require__(5143)
  },

  /**
   * @api private
   */
  XML: {
    Builder: __nccwpck_require__(3546),
    Parser: null // conditionally set based on environment
  },

  /**
   * @api private
   */
  JSON: {
    Builder: __nccwpck_require__(7495),
    Parser: __nccwpck_require__(5474)
  },

  /**
   * @api private
   */
  Model: {
    Api: __nccwpck_require__(7657),
    Operation: __nccwpck_require__(8083),
    Shape: __nccwpck_require__(1349),
    Paginator: __nccwpck_require__(5938),
    ResourceWaiter: __nccwpck_require__(1368)
  },

  /**
   * @api private
   */
  apiLoader: __nccwpck_require__(2793),

  /**
   * @api private
   */
  EndpointCache: __nccwpck_require__(6323)/* .EndpointCache */ .$
});
__nccwpck_require__(5948);
__nccwpck_require__(8903);
__nccwpck_require__(8110);
__nccwpck_require__(1556);
__nccwpck_require__(4995);
__nccwpck_require__(8652);
__nccwpck_require__(8743);
__nccwpck_require__(9925);
__nccwpck_require__(9897);
__nccwpck_require__(9127);

/**
 * @readonly
 * @return [AWS.SequentialExecutor] a collection of global event listeners that
 *   are attached to every sent request.
 * @see AWS.Request AWS.Request for a list of events to listen for
 * @example Logging the time taken to send a request
 *   AWS.events.on('send', function startSend(resp) {
 *     resp.startTime = new Date().getTime();
 *   }).on('complete', function calculateTime(resp) {
 *     var time = (new Date().getTime() - resp.startTime) / 1000;
 *     console.log('Request took ' + time + ' seconds');
 *   });
 *
 *   new AWS.S3().listBuckets(); // prints 'Request took 0.285 seconds'
 */
AWS.events = new AWS.SequentialExecutor();

//create endpoint cache lazily
AWS.util.memoizedProperty(AWS, 'endpointCache', function() {
  return new AWS.EndpointCache(AWS.config.endpointCacheSize);
}, true);


/***/ }),

/***/ 3819:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);

/**
 * Represents your AWS security credentials, specifically the
 * {accessKeyId}, {secretAccessKey}, and optional {sessionToken}.
 * Creating a `Credentials` object allows you to pass around your
 * security information to configuration and service objects.
 *
 * Note that this class typically does not need to be constructed manually,
 * as the {AWS.Config} and {AWS.Service} classes both accept simple
 * options hashes with the three keys. These structures will be converted
 * into Credentials objects automatically.
 *
 * ## Expiring and Refreshing Credentials
 *
 * Occasionally credentials can expire in the middle of a long-running
 * application. In this case, the SDK will automatically attempt to
 * refresh the credentials from the storage location if the Credentials
 * class implements the {refresh} method.
 *
 * If you are implementing a credential storage location, you
 * will want to create a subclass of the `Credentials` class and
 * override the {refresh} method. This method allows credentials to be
 * retrieved from the backing store, be it a file system, database, or
 * some network storage. The method should reset the credential attributes
 * on the object.
 *
 * @!attribute expired
 *   @return [Boolean] whether the credentials have been expired and
 *     require a refresh. Used in conjunction with {expireTime}.
 * @!attribute expireTime
 *   @return [Date] a time when credentials should be considered expired. Used
 *     in conjunction with {expired}.
 * @!attribute accessKeyId
 *   @return [String] the AWS access key ID
 * @!attribute secretAccessKey
 *   @return [String] the AWS secret access key
 * @!attribute sessionToken
 *   @return [String] an optional AWS session token
 */
AWS.Credentials = AWS.util.inherit({
  /**
   * A credentials object can be created using positional arguments or an options
   * hash.
   *
   * @overload AWS.Credentials(accessKeyId, secretAccessKey, sessionToken=null)
   *   Creates a Credentials object with a given set of credential information
   *   as positional arguments.
   *   @param accessKeyId [String] the AWS access key ID
   *   @param secretAccessKey [String] the AWS secret access key
   *   @param sessionToken [String] the optional AWS session token
   *   @example Create a credentials object with AWS credentials
   *     var creds = new AWS.Credentials('akid', 'secret', 'session');
   * @overload AWS.Credentials(options)
   *   Creates a Credentials object with a given set of credential information
   *   as an options hash.
   *   @option options accessKeyId [String] the AWS access key ID
   *   @option options secretAccessKey [String] the AWS secret access key
   *   @option options sessionToken [String] the optional AWS session token
   *   @example Create a credentials object with AWS credentials
   *     var creds = new AWS.Credentials({
   *       accessKeyId: 'akid', secretAccessKey: 'secret', sessionToken: 'session'
   *     });
   */
  constructor: function Credentials() {
    // hide secretAccessKey from being displayed with util.inspect
    AWS.util.hideProperties(this, ['secretAccessKey']);

    this.expired = false;
    this.expireTime = null;
    this.refreshCallbacks = [];
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
      var creds = arguments[0].credentials || arguments[0];
      this.accessKeyId = creds.accessKeyId;
      this.secretAccessKey = creds.secretAccessKey;
      this.sessionToken = creds.sessionToken;
    } else {
      this.accessKeyId = arguments[0];
      this.secretAccessKey = arguments[1];
      this.sessionToken = arguments[2];
    }
  },

  /**
   * @return [Integer] the number of seconds before {expireTime} during which
   *   the credentials will be considered expired.
   */
  expiryWindow: 15,

  /**
   * @return [Boolean] whether the credentials object should call {refresh}
   * @note Subclasses should override this method to provide custom refresh
   *   logic.
   */
  needsRefresh: function needsRefresh() {
    var currentTime = AWS.util.date.getDate().getTime();
    var adjustedTime = new Date(currentTime + this.expiryWindow * 1000);

    if (this.expireTime && adjustedTime > this.expireTime) {
      return true;
    } else {
      return this.expired || !this.accessKeyId || !this.secretAccessKey;
    }
  },

  /**
   * Gets the existing credentials, refreshing them if they are not yet loaded
   * or have expired. Users should call this method before using {refresh},
   * as this will not attempt to reload credentials when they are already
   * loaded into the object.
   *
   * @callback callback function(err)
   *   When this callback is called with no error, it means either credentials
   *   do not need to be refreshed or refreshed credentials information has
   *   been loaded into the object (as the `accessKeyId`, `secretAccessKey`,
   *   and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   */
  get: function get(callback) {
    var self = this;
    if (this.needsRefresh()) {
      this.refresh(function(err) {
        if (!err) self.expired = false; // reset expired flag
        if (callback) callback(err);
      });
    } else if (callback) {
      callback();
    }
  },

  /**
   * @!method  getPromise()
   *   Returns a 'thenable' promise.
   *   Gets the existing credentials, refreshing them if they are not yet loaded
   *   or have expired. Users should call this method before using {refresh},
   *   as this will not attempt to reload credentials when they are already
   *   loaded into the object.
   *
   *   Two callbacks can be provided to the `then` method on the returned promise.
   *   The first callback will be called if the promise is fulfilled, and the second
   *   callback will be called if the promise is rejected.
   *   @callback fulfilledCallback function()
   *     Called if the promise is fulfilled. When this callback is called, it
   *     means either credentials do not need to be refreshed or refreshed
   *     credentials information has been loaded into the object (as the
   *     `accessKeyId`, `secretAccessKey`, and `sessionToken` properties).
   *   @callback rejectedCallback function(err)
   *     Called if the promise is rejected.
   *     @param err [Error] if an error occurred, this value will be filled
   *   @return [Promise] A promise that represents the state of the `get` call.
   *   @example Calling the `getPromise` method.
   *     var promise = credProvider.getPromise();
   *     promise.then(function() { ... }, function(err) { ... });
   */

  /**
   * @!method  refreshPromise()
   *   Returns a 'thenable' promise.
   *   Refreshes the credentials. Users should call {get} before attempting
   *   to forcibly refresh credentials.
   *
   *   Two callbacks can be provided to the `then` method on the returned promise.
   *   The first callback will be called if the promise is fulfilled, and the second
   *   callback will be called if the promise is rejected.
   *   @callback fulfilledCallback function()
   *     Called if the promise is fulfilled. When this callback is called, it
   *     means refreshed credentials information has been loaded into the object
   *     (as the `accessKeyId`, `secretAccessKey`, and `sessionToken` properties).
   *   @callback rejectedCallback function(err)
   *     Called if the promise is rejected.
   *     @param err [Error] if an error occurred, this value will be filled
   *   @return [Promise] A promise that represents the state of the `refresh` call.
   *   @example Calling the `refreshPromise` method.
   *     var promise = credProvider.refreshPromise();
   *     promise.then(function() { ... }, function(err) { ... });
   */

  /**
   * Refreshes the credentials. Users should call {get} before attempting
   * to forcibly refresh credentials.
   *
   * @callback callback function(err)
   *   When this callback is called with no error, it means refreshed
   *   credentials information has been loaded into the object (as the
   *   `accessKeyId`, `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @note Subclasses should override this class to reset the
   *   {accessKeyId}, {secretAccessKey} and optional {sessionToken}
   *   on the credentials object and then call the callback with
   *   any error information.
   * @see get
   */
  refresh: function refresh(callback) {
    this.expired = false;
    callback();
  },

  /**
   * @api private
   * @param callback
   */
  coalesceRefresh: function coalesceRefresh(callback, sync) {
    var self = this;
    if (self.refreshCallbacks.push(callback) === 1) {
      self.load(function onLoad(err) {
        AWS.util.arrayEach(self.refreshCallbacks, function(callback) {
          if (sync) {
            callback(err);
          } else {
            // callback could throw, so defer to ensure all callbacks are notified
            AWS.util.defer(function () {
              callback(err);
            });
          }
        });
        self.refreshCallbacks.length = 0;
      });
    }
  },

  /**
   * @api private
   * @param callback
   */
  load: function load(callback) {
    callback();
  }
});

/**
 * @api private
 */
AWS.Credentials.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
  this.prototype.getPromise = AWS.util.promisifyMethod('get', PromiseDependency);
  this.prototype.refreshPromise = AWS.util.promisifyMethod('refresh', PromiseDependency);
};

/**
 * @api private
 */
AWS.Credentials.deletePromisesFromClass = function deletePromisesFromClass() {
  delete this.prototype.getPromise;
  delete this.prototype.refreshPromise;
};

AWS.util.addPromises(AWS.Credentials);


/***/ }),

/***/ 7083:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var STS = __nccwpck_require__(7513);

/**
 * Represents temporary credentials retrieved from {AWS.STS}. Without any
 * extra parameters, credentials will be fetched from the
 * {AWS.STS.getSessionToken} operation. If an IAM role is provided, the
 * {AWS.STS.assumeRole} operation will be used to fetch credentials for the
 * role instead.
 *
 * AWS.ChainableTemporaryCredentials differs from AWS.TemporaryCredentials in
 * the way masterCredentials and refreshes are handled.
 * AWS.ChainableTemporaryCredentials refreshes expired credentials using the
 * masterCredentials passed by the user to support chaining of STS credentials.
 * However, AWS.TemporaryCredentials recursively collapses the masterCredentials
 * during instantiation, precluding the ability to refresh credentials which
 * require intermediate, temporary credentials.
 *
 * For example, if the application should use RoleA, which must be assumed from
 * RoleB, and the environment provides credentials which can assume RoleB, then
 * AWS.ChainableTemporaryCredentials must be used to support refreshing the
 * temporary credentials for RoleA:
 *
 * ```javascript
 * var roleACreds = new AWS.ChainableTemporaryCredentials({
 *   params: {RoleArn: 'RoleA'},
 *   masterCredentials: new AWS.ChainableTemporaryCredentials({
 *     params: {RoleArn: 'RoleB'},
 *     masterCredentials: new AWS.EnvironmentCredentials('AWS')
 *   })
 * });
 * ```
 *
 * If AWS.TemporaryCredentials had been used in the previous example,
 * `roleACreds` would fail to refresh because `roleACreds` would
 * use the environment credentials for the AssumeRole request.
 *
 * Another difference is that AWS.ChainableTemporaryCredentials creates the STS
 * service instance during instantiation while AWS.TemporaryCredentials creates
 * the STS service instance during the first refresh. Creating the service
 * instance during instantiation effectively captures the master credentials
 * from the global config, so that subsequent changes to the global config do
 * not affect the master credentials used to refresh the temporary credentials.
 *
 * This allows an instance of AWS.ChainableTemporaryCredentials to be assigned
 * to AWS.config.credentials:
 *
 * ```javascript
 * var envCreds = new AWS.EnvironmentCredentials('AWS');
 * AWS.config.credentials = envCreds;
 * // masterCredentials will be envCreds
 * AWS.config.credentials = new AWS.ChainableTemporaryCredentials({
 *   params: {RoleArn: '...'}
 * });
 * ```
 *
 * Similarly, to use the CredentialProviderChain's default providers as the
 * master credentials, simply create a new instance of
 * AWS.ChainableTemporaryCredentials:
 *
 * ```javascript
 * AWS.config.credentials = new ChainableTemporaryCredentials({
 *   params: {RoleArn: '...'}
 * });
 * ```
 *
 * @!attribute service
 *   @return [AWS.STS] the STS service instance used to
 *     get and refresh temporary credentials from AWS STS.
 * @note (see constructor)
 */
AWS.ChainableTemporaryCredentials = AWS.util.inherit(AWS.Credentials, {
  /**
   * Creates a new temporary credentials object.
   *
   * @param options [map] a set of options
   * @option options params [map] ({}) a map of options that are passed to the
   *   {AWS.STS.assumeRole} or {AWS.STS.getSessionToken} operations.
   *   If a `RoleArn` parameter is passed in, credentials will be based on the
   *   IAM role. If a `SerialNumber` parameter is passed in, {tokenCodeFn} must
   *   also be passed in or an error will be thrown.
   * @option options masterCredentials [AWS.Credentials] the master credentials
   *   used to get and refresh temporary credentials from AWS STS. By default,
   *   AWS.config.credentials or AWS.config.credentialProvider will be used.
   * @option options tokenCodeFn [Function] (null) Function to provide
   *   `TokenCode`, if `SerialNumber` is provided for profile in {params}. Function
   *   is called with value of `SerialNumber` and `callback`, and should provide
   *   the `TokenCode` or an error to the callback in the format
   *   `callback(err, token)`.
   * @example Creating a new credentials object for generic temporary credentials
   *   AWS.config.credentials = new AWS.ChainableTemporaryCredentials();
   * @example Creating a new credentials object for an IAM role
   *   AWS.config.credentials = new AWS.ChainableTemporaryCredentials({
   *     params: {
   *       RoleArn: 'arn:aws:iam::1234567890:role/TemporaryCredentials'
   *     }
   *   });
   * @see AWS.STS.assumeRole
   * @see AWS.STS.getSessionToken
   */
  constructor: function ChainableTemporaryCredentials(options) {
    AWS.Credentials.call(this);
    options = options || {};
    this.errorCode = 'ChainableTemporaryCredentialsProviderFailure';
    this.expired = true;
    this.tokenCodeFn = null;

    var params = AWS.util.copy(options.params) || {};
    if (params.RoleArn) {
      params.RoleSessionName = params.RoleSessionName || 'temporary-credentials';
    }
    if (params.SerialNumber) {
      if (!options.tokenCodeFn || (typeof options.tokenCodeFn !== 'function')) {
        throw new AWS.util.error(
          new Error('tokenCodeFn must be a function when params.SerialNumber is given'),
          {code: this.errorCode}
        );
      } else {
        this.tokenCodeFn = options.tokenCodeFn;
      }
    }
    var config = AWS.util.merge(
      {
        params: params,
        credentials: options.masterCredentials || AWS.config.credentials
      },
      options.stsConfig || {}
    );
    this.service = new STS(config);
  },

  /**
   * Refreshes credentials using {AWS.STS.assumeRole} or
   * {AWS.STS.getSessionToken}, depending on whether an IAM role ARN was passed
   * to the credentials {constructor}.
   *
   * @callback callback function(err)
   *   Called when the STS service responds (or fails). When
   *   this callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see AWS.Credentials.get
   */
  refresh: function refresh(callback) {
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },

  /**
   * @api private
   * @param callback
   */
  load: function load(callback) {
    var self = this;
    var operation = self.service.config.params.RoleArn ? 'assumeRole' : 'getSessionToken';
    this.getTokenCode(function (err, tokenCode) {
      var params = {};
      if (err) {
        callback(err);
        return;
      }
      if (tokenCode) {
        params.TokenCode = tokenCode;
      }
      self.service[operation](params, function (err, data) {
        if (!err) {
          self.service.credentialsFrom(data, self);
        }
        callback(err);
      });
    });
  },

  /**
   * @api private
   */
  getTokenCode: function getTokenCode(callback) {
    var self = this;
    if (this.tokenCodeFn) {
      this.tokenCodeFn(this.service.config.params.SerialNumber, function (err, token) {
        if (err) {
          var message = err;
          if (err instanceof Error) {
            message = err.message;
          }
          callback(
            AWS.util.error(
              new Error('Error fetching MFA token: ' + message),
              { code: self.errorCode}
            )
          );
          return;
        }
        callback(null, token);
      });
    } else {
      callback(null);
    }
  }
});


/***/ }),

/***/ 3498:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var CognitoIdentity = __nccwpck_require__(8291);
var STS = __nccwpck_require__(7513);

/**
 * Represents credentials retrieved from STS Web Identity Federation using
 * the Amazon Cognito Identity service.
 *
 * By default this provider gets credentials using the
 * {AWS.CognitoIdentity.getCredentialsForIdentity} service operation, which
 * requires either an `IdentityId` or an `IdentityPoolId` (Amazon Cognito
 * Identity Pool ID), which is used to call {AWS.CognitoIdentity.getId} to
 * obtain an `IdentityId`. If the identity or identity pool is not configured in
 * the Amazon Cognito Console to use IAM roles with the appropriate permissions,
 * then additionally a `RoleArn` is required containing the ARN of the IAM trust
 * policy for the Amazon Cognito role that the user will log into. If a `RoleArn`
 * is provided, then this provider gets credentials using the
 * {AWS.STS.assumeRoleWithWebIdentity} service operation, after first getting an
 * Open ID token from {AWS.CognitoIdentity.getOpenIdToken}.
 *
 * In addition, if this credential provider is used to provide authenticated
 * login, the `Logins` map may be set to the tokens provided by the respective
 * identity providers. See {constructor} for an example on creating a credentials
 * object with proper property values.
 *
 * ## Refreshing Credentials from Identity Service
 *
 * In addition to AWS credentials expiring after a given amount of time, the
 * login token from the identity provider will also expire. Once this token
 * expires, it will not be usable to refresh AWS credentials, and another
 * token will be needed. The SDK does not manage refreshing of the token value,
 * but this can be done through a "refresh token" supported by most identity
 * providers. Consult the documentation for the identity provider for refreshing
 * tokens. Once the refreshed token is acquired, you should make sure to update
 * this new token in the credentials object's {params} property. The following
 * code will update the WebIdentityToken, assuming you have retrieved an updated
 * token from the identity provider:
 *
 * ```javascript
 * AWS.config.credentials.params.Logins['graph.facebook.com'] = updatedToken;
 * ```
 *
 * Future calls to `credentials.refresh()` will now use the new token.
 *
 * @!attribute params
 *   @return [map] the map of params passed to
 *     {AWS.CognitoIdentity.getId},
 *     {AWS.CognitoIdentity.getOpenIdToken}, and
 *     {AWS.STS.assumeRoleWithWebIdentity}. To update the token, set the
 *     `params.WebIdentityToken` property.
 * @!attribute data
 *   @return [map] the raw data response from the call to
 *     {AWS.CognitoIdentity.getCredentialsForIdentity}, or
 *     {AWS.STS.assumeRoleWithWebIdentity}. Use this if you want to get
 *     access to other properties from the response.
 * @!attribute identityId
 *   @return [String] the Cognito ID returned by the last call to
 *     {AWS.CognitoIdentity.getOpenIdToken}. This ID represents the actual
 *     final resolved identity ID from Amazon Cognito.
 */
AWS.CognitoIdentityCredentials = AWS.util.inherit(AWS.Credentials, {
  /**
   * @api private
   */
  localStorageKey: {
    id: 'aws.cognito.identity-id.',
    providers: 'aws.cognito.identity-providers.'
  },

  /**
   * Creates a new credentials object.
   * @example Creating a new credentials object
   *   AWS.config.credentials = new AWS.CognitoIdentityCredentials({
   *
   *     // either IdentityPoolId or IdentityId is required
   *     // See the IdentityPoolId param for AWS.CognitoIdentity.getID (linked below)
   *     // See the IdentityId param for AWS.CognitoIdentity.getCredentialsForIdentity
   *     // or AWS.CognitoIdentity.getOpenIdToken (linked below)
   *     IdentityPoolId: 'us-east-1:1699ebc0-7900-4099-b910-2df94f52a030',
   *     IdentityId: 'us-east-1:128d0a74-c82f-4553-916d-90053e4a8b0f'
   *
   *     // optional, only necessary when the identity pool is not configured
   *     // to use IAM roles in the Amazon Cognito Console
   *     // See the RoleArn param for AWS.STS.assumeRoleWithWebIdentity (linked below)
   *     RoleArn: 'arn:aws:iam::1234567890:role/MYAPP-CognitoIdentity',
   *
   *     // optional tokens, used for authenticated login
   *     // See the Logins param for AWS.CognitoIdentity.getID (linked below)
   *     Logins: {
   *       'graph.facebook.com': 'FBTOKEN',
   *       'www.amazon.com': 'AMAZONTOKEN',
   *       'accounts.google.com': 'GOOGLETOKEN',
   *       'api.twitter.com': 'TWITTERTOKEN',
   *       'www.digits.com': 'DIGITSTOKEN'
   *     },
   *
   *     // optional name, defaults to web-identity
   *     // See the RoleSessionName param for AWS.STS.assumeRoleWithWebIdentity (linked below)
   *     RoleSessionName: 'web',
   *
   *     // optional, only necessary when application runs in a browser
   *     // and multiple users are signed in at once, used for caching
   *     LoginId: 'example@gmail.com'
   *
   *   }, {
   *      // optionally provide configuration to apply to the underlying service clients
   *      // if configuration is not provided, then configuration will be pulled from AWS.config
   *
   *      // region should match the region your identity pool is located in
   *      region: 'us-east-1',
   *
   *      // specify timeout options
   *      httpOptions: {
   *        timeout: 100
   *      }
   *   });
   * @see AWS.CognitoIdentity.getId
   * @see AWS.CognitoIdentity.getCredentialsForIdentity
   * @see AWS.STS.assumeRoleWithWebIdentity
   * @see AWS.CognitoIdentity.getOpenIdToken
   * @see AWS.Config
   * @note If a region is not provided in the global AWS.config, or
   *   specified in the `clientConfig` to the CognitoIdentityCredentials
   *   constructor, you may encounter a 'Missing credentials in config' error
   *   when calling making a service call.
   */
  constructor: function CognitoIdentityCredentials(params, clientConfig) {
    AWS.Credentials.call(this);
    this.expired = true;
    this.params = params;
    this.data = null;
    this._identityId = null;
    this._clientConfig = AWS.util.copy(clientConfig || {});
    this.loadCachedId();
    var self = this;
    Object.defineProperty(this, 'identityId', {
      get: function() {
        self.loadCachedId();
        return self._identityId || self.params.IdentityId;
      },
      set: function(identityId) {
        self._identityId = identityId;
      }
    });
  },

  /**
   * Refreshes credentials using {AWS.CognitoIdentity.getCredentialsForIdentity},
   * or {AWS.STS.assumeRoleWithWebIdentity}.
   *
   * @callback callback function(err)
   *   Called when the STS service responds (or fails). When
   *   this callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see AWS.Credentials.get
   */
  refresh: function refresh(callback) {
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },

  /**
   * @api private
   * @param callback
   */
  load: function load(callback) {
    var self = this;
    self.createClients();
    self.data = null;
    self._identityId = null;
    self.getId(function(err) {
      if (!err) {
        if (!self.params.RoleArn) {
          self.getCredentialsForIdentity(callback);
        } else {
          self.getCredentialsFromSTS(callback);
        }
      } else {
        self.clearIdOnNotAuthorized(err);
        callback(err);
      }
    });
  },

  /**
   * Clears the cached Cognito ID associated with the currently configured
   * identity pool ID. Use this to manually invalidate your cache if
   * the identity pool ID was deleted.
   */
  clearCachedId: function clearCache() {
    this._identityId = null;
    delete this.params.IdentityId;

    var poolId = this.params.IdentityPoolId;
    var loginId = this.params.LoginId || '';
    delete this.storage[this.localStorageKey.id + poolId + loginId];
    delete this.storage[this.localStorageKey.providers + poolId + loginId];
  },

  /**
   * @api private
   */
  clearIdOnNotAuthorized: function clearIdOnNotAuthorized(err) {
    var self = this;
    if (err.code == 'NotAuthorizedException') {
      self.clearCachedId();
    }
  },

  /**
   * Retrieves a Cognito ID, loading from cache if it was already retrieved
   * on this device.
   *
   * @callback callback function(err, identityId)
   *   @param err [Error, null] an error object if the call failed or null if
   *     it succeeded.
   *   @param identityId [String, null] if successful, the callback will return
   *     the Cognito ID.
   * @note If not loaded explicitly, the Cognito ID is loaded and stored in
   *   localStorage in the browser environment of a device.
   * @api private
   */
  getId: function getId(callback) {
    var self = this;
    if (typeof self.params.IdentityId === 'string') {
      return callback(null, self.params.IdentityId);
    }

    self.cognito.getId(function(err, data) {
      if (!err && data.IdentityId) {
        self.params.IdentityId = data.IdentityId;
        callback(null, data.IdentityId);
      } else {
        callback(err);
      }
    });
  },


  /**
   * @api private
   */
  loadCredentials: function loadCredentials(data, credentials) {
    if (!data || !credentials) return;
    credentials.expired = false;
    credentials.accessKeyId = data.Credentials.AccessKeyId;
    credentials.secretAccessKey = data.Credentials.SecretKey;
    credentials.sessionToken = data.Credentials.SessionToken;
    credentials.expireTime = data.Credentials.Expiration;
  },

  /**
   * @api private
   */
  getCredentialsForIdentity: function getCredentialsForIdentity(callback) {
    var self = this;
    self.cognito.getCredentialsForIdentity(function(err, data) {
      if (!err) {
        self.cacheId(data);
        self.data = data;
        self.loadCredentials(self.data, self);
      } else {
        self.clearIdOnNotAuthorized(err);
      }
      callback(err);
    });
  },

  /**
   * @api private
   */
  getCredentialsFromSTS: function getCredentialsFromSTS(callback) {
    var self = this;
    self.cognito.getOpenIdToken(function(err, data) {
      if (!err) {
        self.cacheId(data);
        self.params.WebIdentityToken = data.Token;
        self.webIdentityCredentials.refresh(function(webErr) {
          if (!webErr) {
            self.data = self.webIdentityCredentials.data;
            self.sts.credentialsFrom(self.data, self);
          }
          callback(webErr);
        });
      } else {
        self.clearIdOnNotAuthorized(err);
        callback(err);
      }
    });
  },

  /**
   * @api private
   */
  loadCachedId: function loadCachedId() {
    var self = this;

    // in the browser we source default IdentityId from localStorage
    if (AWS.util.isBrowser() && !self.params.IdentityId) {
      var id = self.getStorage('id');
      if (id && self.params.Logins) {
        var actualProviders = Object.keys(self.params.Logins);
        var cachedProviders =
          (self.getStorage('providers') || '').split(',');

        // only load ID if at least one provider used this ID before
        var intersect = cachedProviders.filter(function(n) {
          return actualProviders.indexOf(n) !== -1;
        });
        if (intersect.length !== 0) {
          self.params.IdentityId = id;
        }
      } else if (id) {
        self.params.IdentityId = id;
      }
    }
  },

  /**
   * @api private
   */
  createClients: function() {
    var clientConfig = this._clientConfig;
    this.webIdentityCredentials = this.webIdentityCredentials ||
      new AWS.WebIdentityCredentials(this.params, clientConfig);
    if (!this.cognito) {
      var cognitoConfig = AWS.util.merge({}, clientConfig);
      cognitoConfig.params = this.params;
      this.cognito = new CognitoIdentity(cognitoConfig);
    }
    this.sts = this.sts || new STS(clientConfig);
  },

  /**
   * @api private
   */
  cacheId: function cacheId(data) {
    this._identityId = data.IdentityId;
    this.params.IdentityId = this._identityId;

    // cache this IdentityId in browser localStorage if possible
    if (AWS.util.isBrowser()) {
      this.setStorage('id', data.IdentityId);

      if (this.params.Logins) {
        this.setStorage('providers', Object.keys(this.params.Logins).join(','));
      }
    }
  },

  /**
   * @api private
   */
  getStorage: function getStorage(key) {
    return this.storage[this.localStorageKey[key] + this.params.IdentityPoolId + (this.params.LoginId || '')];
  },

  /**
   * @api private
   */
  setStorage: function setStorage(key, val) {
    try {
      this.storage[this.localStorageKey[key] + this.params.IdentityPoolId + (this.params.LoginId || '')] = val;
    } catch (_) {}
  },

  /**
   * @api private
   */
  storage: (function() {
    try {
      var storage = AWS.util.isBrowser() && window.localStorage !== null && typeof window.localStorage === 'object' ?
          window.localStorage : {};

      // Test set/remove which would throw an error in Safari's private browsing
      storage['aws.test-storage'] = 'foobar';
      delete storage['aws.test-storage'];

      return storage;
    } catch (_) {
      return {};
    }
  })()
});


/***/ }),

/***/ 6965:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);

/**
 * Creates a credential provider chain that searches for AWS credentials
 * in a list of credential providers specified by the {providers} property.
 *
 * By default, the chain will use the {defaultProviders} to resolve credentials.
 * These providers will look in the environment using the
 * {AWS.EnvironmentCredentials} class with the 'AWS' and 'AMAZON' prefixes.
 *
 * ## Setting Providers
 *
 * Each provider in the {providers} list should be a function that returns
 * a {AWS.Credentials} object, or a hardcoded credentials object. The function
 * form allows for delayed execution of the credential construction.
 *
 * ## Resolving Credentials from a Chain
 *
 * Call {resolve} to return the first valid credential object that can be
 * loaded by the provider chain.
 *
 * For example, to resolve a chain with a custom provider that checks a file
 * on disk after the set of {defaultProviders}:
 *
 * ```javascript
 * var diskProvider = new AWS.FileSystemCredentials('./creds.json');
 * var chain = new AWS.CredentialProviderChain();
 * chain.providers.push(diskProvider);
 * chain.resolve();
 * ```
 *
 * The above code will return the `diskProvider` object if the
 * file contains credentials and the `defaultProviders` do not contain
 * any credential settings.
 *
 * @!attribute providers
 *   @return [Array<AWS.Credentials, Function>]
 *     a list of credentials objects or functions that return credentials
 *     objects. If the provider is a function, the function will be
 *     executed lazily when the provider needs to be checked for valid
 *     credentials. By default, this object will be set to the
 *     {defaultProviders}.
 *   @see defaultProviders
 */
AWS.CredentialProviderChain = AWS.util.inherit(AWS.Credentials, {

  /**
   * Creates a new CredentialProviderChain with a default set of providers
   * specified by {defaultProviders}.
   */
  constructor: function CredentialProviderChain(providers) {
    if (providers) {
      this.providers = providers;
    } else {
      this.providers = AWS.CredentialProviderChain.defaultProviders.slice(0);
    }
    this.resolveCallbacks = [];
  },

  /**
   * @!method  resolvePromise()
   *   Returns a 'thenable' promise.
   *   Resolves the provider chain by searching for the first set of
   *   credentials in {providers}.
   *
   *   Two callbacks can be provided to the `then` method on the returned promise.
   *   The first callback will be called if the promise is fulfilled, and the second
   *   callback will be called if the promise is rejected.
   *   @callback fulfilledCallback function(credentials)
   *     Called if the promise is fulfilled and the provider resolves the chain
   *     to a credentials object
   *     @param credentials [AWS.Credentials] the credentials object resolved
   *       by the provider chain.
   *   @callback rejectedCallback function(error)
   *     Called if the promise is rejected.
   *     @param err [Error] the error object returned if no credentials are found.
   *   @return [Promise] A promise that represents the state of the `resolve` method call.
   *   @example Calling the `resolvePromise` method.
   *     var promise = chain.resolvePromise();
   *     promise.then(function(credentials) { ... }, function(err) { ... });
   */

  /**
   * Resolves the provider chain by searching for the first set of
   * credentials in {providers}.
   *
   * @callback callback function(err, credentials)
   *   Called when the provider resolves the chain to a credentials object
   *   or null if no credentials can be found.
   *
   *   @param err [Error] the error object returned if no credentials are
   *     found.
   *   @param credentials [AWS.Credentials] the credentials object resolved
   *     by the provider chain.
   * @return [AWS.CredentialProviderChain] the provider, for chaining.
   */
  resolve: function resolve(callback) {
    var self = this;
    if (self.providers.length === 0) {
      callback(new Error('No providers'));
      return self;
    }

    if (self.resolveCallbacks.push(callback) === 1) {
      var index = 0;
      var providers = self.providers.slice(0);

      function resolveNext(err, creds) {
        if ((!err && creds) || index === providers.length) {
          AWS.util.arrayEach(self.resolveCallbacks, function (callback) {
            callback(err, creds);
          });
          self.resolveCallbacks.length = 0;
          return;
        }

        var provider = providers[index++];
        if (typeof provider === 'function') {
          creds = provider.call();
        } else {
          creds = provider;
        }

        if (creds.get) {
          creds.get(function (getErr) {
            resolveNext(getErr, getErr ? null : creds);
          });
        } else {
          resolveNext(null, creds);
        }
      }

      resolveNext();
    }

    return self;
  }
});

/**
 * The default set of providers used by a vanilla CredentialProviderChain.
 *
 * In the browser:
 *
 * ```javascript
 * AWS.CredentialProviderChain.defaultProviders = []
 * ```
 *
 * In Node.js:
 *
 * ```javascript
 * AWS.CredentialProviderChain.defaultProviders = [
 *   function () { return new AWS.EnvironmentCredentials('AWS'); },
 *   function () { return new AWS.EnvironmentCredentials('AMAZON'); },
 *   function () { return new AWS.SharedIniFileCredentials(); },
 *   function () { return new AWS.ECSCredentials(); },
 *   function () { return new AWS.ProcessCredentials(); },
 *   function () { return new AWS.TokenFileWebIdentityCredentials(); },
 *   function () { return new AWS.EC2MetadataCredentials() }
 * ]
 * ```
 */
AWS.CredentialProviderChain.defaultProviders = [];

/**
 * @api private
 */
AWS.CredentialProviderChain.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
  this.prototype.resolvePromise = AWS.util.promisifyMethod('resolve', PromiseDependency);
};

/**
 * @api private
 */
AWS.CredentialProviderChain.deletePromisesFromClass = function deletePromisesFromClass() {
  delete this.prototype.resolvePromise;
};

AWS.util.addPromises(AWS.CredentialProviderChain);


/***/ }),

/***/ 3379:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
__nccwpck_require__(5768);

/**
 * Represents credentials received from the metadata service on an EC2 instance.
 *
 * By default, this class will connect to the metadata service using
 * {AWS.MetadataService} and attempt to load any available credentials. If it
 * can connect, and credentials are available, these will be used with zero
 * configuration.
 *
 * This credentials class will by default timeout after 1 second of inactivity
 * and retry 3 times.
 * If your requests to the EC2 metadata service are timing out, you can increase
 * these values by configuring them directly:
 *
 * ```javascript
 * AWS.config.credentials = new AWS.EC2MetadataCredentials({
 *   httpOptions: { timeout: 5000 }, // 5 second timeout
 *   maxRetries: 10, // retry 10 times
 *   retryDelayOptions: { base: 200 } // see AWS.Config for information
 * });
 *
 * If your requests are timing out in connecting to the metadata service, such
 * as when testing on a development machine, you can use the connectTimeout
 * option, specified in milliseconds, which also defaults to 1 second.
 * ```
 *
 * @see AWS.Config.retryDelayOptions
 *
 * @!macro nobrowser
 */
AWS.EC2MetadataCredentials = AWS.util.inherit(AWS.Credentials, {
  constructor: function EC2MetadataCredentials(options) {
    AWS.Credentials.call(this);

    options = options ? AWS.util.copy(options) : {};
    options = AWS.util.merge(
      {maxRetries: this.defaultMaxRetries}, options);
    if (!options.httpOptions) options.httpOptions = {};
    options.httpOptions = AWS.util.merge(
      {timeout: this.defaultTimeout,
        connectTimeout: this.defaultConnectTimeout},
       options.httpOptions);

    this.metadataService = new AWS.MetadataService(options);
    this.metadata = {};
  },

  /**
   * @api private
   */
  defaultTimeout: 1000,

   /**
   * @api private
   */
  defaultConnectTimeout: 1000,

  /**
   * @api private
   */
  defaultMaxRetries: 3,

  /**
   * Loads the credentials from the instance metadata service
   *
   * @callback callback function(err)
   *   Called when the instance metadata service responds (or fails). When
   *   this callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh(callback) {
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },

  /**
   * @api private
   * @param callback
   */
  load: function load(callback) {
    var self = this;
    self.metadataService.loadCredentials(function(err, creds) {
      if (!err) {
        var currentTime = AWS.util.date.getDate();
        var expireTime = new Date(creds.Expiration);
        if (expireTime < currentTime) {
          err = AWS.util.error(
            new Error('EC2 Instance Metadata Serivce provided expired credentials'),
            { code: 'EC2MetadataCredentialsProviderFailure' }
          );
        } else {
          self.expired = false;
          self.metadata = creds;
          self.accessKeyId = creds.AccessKeyId;
          self.secretAccessKey = creds.SecretAccessKey;
          self.sessionToken = creds.Token;
          self.expireTime = expireTime;
        }
      }
      callback(err);
    });
  }
});


/***/ }),

/***/ 645:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);

/**
 * Represents credentials received from relative URI specified in the ECS container.
 *
 * This class will request refreshable credentials from the relative URI
 * specified by the AWS_CONTAINER_CREDENTIALS_RELATIVE_URI or the
 * AWS_CONTAINER_CREDENTIALS_FULL_URI environment variable. If valid credentials
 * are returned in the response, these will be used with zero configuration.
 *
 * This credentials class will by default timeout after 1 second of inactivity
 * and retry 3 times.
 * If your requests to the relative URI are timing out, you can increase
 * the value by configuring them directly:
 *
 * ```javascript
 * AWS.config.credentials = new AWS.ECSCredentials({
 *   httpOptions: { timeout: 5000 }, // 5 second timeout
 *   maxRetries: 10, // retry 10 times
 *   retryDelayOptions: { base: 200 } // see AWS.Config for information
 * });
 * ```
 *
 * @see AWS.Config.retryDelayOptions
 *
 * @!macro nobrowser
 */
AWS.ECSCredentials = AWS.RemoteCredentials;


/***/ }),

/***/ 7714:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);

/**
 * Represents credentials from the environment.
 *
 * By default, this class will look for the matching environment variables
 * prefixed by a given {envPrefix}. The un-prefixed environment variable names
 * for each credential value is listed below:
 *
 * ```javascript
 * accessKeyId: ACCESS_KEY_ID
 * secretAccessKey: SECRET_ACCESS_KEY
 * sessionToken: SESSION_TOKEN
 * ```
 *
 * With the default prefix of 'AWS', the environment variables would be:
 *
 *     AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN
 *
 * @!attribute envPrefix
 *   @readonly
 *   @return [String] the prefix for the environment variable names excluding
 *     the separating underscore ('_').
 */
AWS.EnvironmentCredentials = AWS.util.inherit(AWS.Credentials, {

  /**
   * Creates a new EnvironmentCredentials class with a given variable
   * prefix {envPrefix}. For example, to load credentials using the 'AWS'
   * prefix:
   *
   * ```javascript
   * var creds = new AWS.EnvironmentCredentials('AWS');
   * creds.accessKeyId == 'AKID' // from AWS_ACCESS_KEY_ID env var
   * ```
   *
   * @param envPrefix [String] the prefix to use (e.g., 'AWS') for environment
   *   variables. Do not include the separating underscore.
   */
  constructor: function EnvironmentCredentials(envPrefix) {
    AWS.Credentials.call(this);
    this.envPrefix = envPrefix;
    this.get(function() {});
  },

  /**
   * Loads credentials from the environment using the prefixed
   * environment variables.
   *
   * @callback callback function(err)
   *   Called after the (prefixed) ACCESS_KEY_ID, SECRET_ACCESS_KEY, and
   *   SESSION_TOKEN environment variables are read. When this callback is
   *   called with no error, it means that the credentials information has
   *   been loaded into the object (as the `accessKeyId`, `secretAccessKey`,
   *   and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh(callback) {
    if (!callback) callback = AWS.util.fn.callback;

    if (!process || !process.env) {
      callback(AWS.util.error(
        new Error('No process info or environment variables available'),
        { code: 'EnvironmentCredentialsProviderFailure' }
      ));
      return;
    }

    var keys = ['ACCESS_KEY_ID', 'SECRET_ACCESS_KEY', 'SESSION_TOKEN'];
    var values = [];

    for (var i = 0; i < keys.length; i++) {
      var prefix = '';
      if (this.envPrefix) prefix = this.envPrefix + '_';
      values[i] = process.env[prefix + keys[i]];
      if (!values[i] && keys[i] !== 'SESSION_TOKEN') {
        callback(AWS.util.error(
          new Error('Variable ' + prefix + keys[i] + ' not set.'),
        { code: 'EnvironmentCredentialsProviderFailure' }
        ));
        return;
      }
    }

    this.expired = false;
    AWS.Credentials.apply(this, values);
    callback();
  }

});


/***/ }),

/***/ 7454:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);

/**
 * Represents credentials from a JSON file on disk.
 * If the credentials expire, the SDK can {refresh} the credentials
 * from the file.
 *
 * The format of the file should be similar to the options passed to
 * {AWS.Config}:
 *
 * ```javascript
 * {accessKeyId: 'akid', secretAccessKey: 'secret', sessionToken: 'optional'}
 * ```
 *
 * @example Loading credentials from disk
 *   var creds = new AWS.FileSystemCredentials('./configuration.json');
 *   creds.accessKeyId == 'AKID'
 *
 * @!attribute filename
 *   @readonly
 *   @return [String] the path to the JSON file on disk containing the
 *     credentials.
 * @!macro nobrowser
 */
AWS.FileSystemCredentials = AWS.util.inherit(AWS.Credentials, {

  /**
   * @overload AWS.FileSystemCredentials(filename)
   *   Creates a new FileSystemCredentials object from a filename
   *
   *   @param filename [String] the path on disk to the JSON file to load.
   */
  constructor: function FileSystemCredentials(filename) {
    AWS.Credentials.call(this);
    this.filename = filename;
    this.get(function() {});
  },

  /**
   * Loads the credentials from the {filename} on disk.
   *
   * @callback callback function(err)
   *   Called after the JSON file on disk is read and parsed. When this callback
   *   is called with no error, it means that the credentials information
   *   has been loaded into the object (as the `accessKeyId`, `secretAccessKey`,
   *   and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh(callback) {
    if (!callback) callback = AWS.util.fn.callback;
    try {
      var creds = JSON.parse(AWS.util.readFileSync(this.filename));
      AWS.Credentials.call(this, creds);
      if (!this.accessKeyId || !this.secretAccessKey) {
        throw AWS.util.error(
          new Error('Credentials not set in ' + this.filename),
        { code: 'FileSystemCredentialsProviderFailure' }
        );
      }
      this.expired = false;
      callback();
    } catch (err) {
      callback(err);
    }
  }

});


/***/ }),

/***/ 371:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var proc = __nccwpck_require__(3129);
var iniLoader = AWS.util.iniLoader;

/**
 * Represents credentials loaded from shared credentials file
 * (defaulting to ~/.aws/credentials or defined by the
 * `AWS_SHARED_CREDENTIALS_FILE` environment variable).
 *
 * ## Using process credentials
 *
 * The credentials file can specify a credential provider that executes
 * a given process and attempts to read its stdout to recieve a JSON payload
 * containing the credentials:
 *
 *     [default]
 *     credential_process = /usr/bin/credential_proc
 *
 * Automatically handles refreshing credentials if an Expiration time is
 * provided in the credentials payload. Credentials supplied in the same profile
 * will take precedence over the credential_process.
 *
 * Sourcing credentials from an external process can potentially be dangerous,
 * so proceed with caution. Other credential providers should be preferred if
 * at all possible. If using this option, you should make sure that the shared
 * credentials file is as locked down as possible using security best practices
 * for your operating system.
 *
 * ## Using custom profiles
 *
 * The SDK supports loading credentials for separate profiles. This can be done
 * in two ways:
 *
 * 1. Set the `AWS_PROFILE` environment variable in your process prior to
 *    loading the SDK.
 * 2. Directly load the AWS.ProcessCredentials provider:
 *
 * ```javascript
 * var creds = new AWS.ProcessCredentials({profile: 'myprofile'});
 * AWS.config.credentials = creds;
 * ```
 *
 * @!macro nobrowser
 */
AWS.ProcessCredentials = AWS.util.inherit(AWS.Credentials, {
  /**
   * Creates a new ProcessCredentials object.
   *
   * @param options [map] a set of options
   * @option options profile [String] (AWS_PROFILE env var or 'default')
   *   the name of the profile to load.
   * @option options filename [String] ('~/.aws/credentials' or defined by
   *   AWS_SHARED_CREDENTIALS_FILE process env var)
   *   the filename to use when loading credentials.
   * @option options callback [Function] (err) Credentials are eagerly loaded
   *   by the constructor. When the callback is called with no error, the
   *   credentials have been loaded successfully.
   */
  constructor: function ProcessCredentials(options) {
    AWS.Credentials.call(this);

    options = options || {};

    this.filename = options.filename;
    this.profile = options.profile || process.env.AWS_PROFILE || AWS.util.defaultProfile;
    this.get(options.callback || AWS.util.fn.noop);
  },

  /**
   * @api private
   */
  load: function load(callback) {
    var self = this;
    try {
      var profiles = AWS.util.getProfilesFromSharedConfig(iniLoader, this.filename);
      var profile = profiles[this.profile] || {};

      if (Object.keys(profile).length === 0) {
        throw AWS.util.error(
          new Error('Profile ' + this.profile + ' not found'),
          { code: 'ProcessCredentialsProviderFailure' }
        );
      }

      if (profile['credential_process']) {
        this.loadViaCredentialProcess(profile, function(err, data) {
          if (err) {
            callback(err, null);
          } else {
            self.expired = false;
            self.accessKeyId = data.AccessKeyId;
            self.secretAccessKey = data.SecretAccessKey;
            self.sessionToken = data.SessionToken;
            if (data.Expiration) {
              self.expireTime = new Date(data.Expiration);
            }
            callback(null);
          }
        });
      } else {
        throw AWS.util.error(
          new Error('Profile ' + this.profile + ' did not include credential process'),
          { code: 'ProcessCredentialsProviderFailure' }
        );
      }
    } catch (err) {
      callback(err);
    }
  },

  /**
  * Executes the credential_process and retrieves
  * credentials from the output
  * @api private
  * @param profile [map] credentials profile
  * @throws ProcessCredentialsProviderFailure
  */
  loadViaCredentialProcess: function loadViaCredentialProcess(profile, callback) {
    proc.exec(profile['credential_process'], function(err, stdOut, stdErr) {
      if (err) {
        callback(AWS.util.error(
          new Error('credential_process returned error'),
          { code: 'ProcessCredentialsProviderFailure'}
        ), null);
      } else {
        try {
          var credData = JSON.parse(stdOut);
          if (credData.Expiration) {
            var currentTime = AWS.util.date.getDate();
            var expireTime = new Date(credData.Expiration);
            if (expireTime < currentTime) {
              throw Error('credential_process returned expired credentials');
            }
          }

          if (credData.Version !== 1) {
            throw Error('credential_process does not return Version == 1');
          }
          callback(null, credData);
        } catch (err) {
          callback(AWS.util.error(
            new Error(err.message),
            { code: 'ProcessCredentialsProviderFailure'}
          ), null);
        }
      }
    });
  },

  /**
   * Loads the credentials from the credential process
   *
   * @callback callback function(err)
   *   Called after the credential process has been executed. When this
   *   callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh(callback) {
    iniLoader.clearCachedFiles();
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  }
});


/***/ }),

/***/ 8764:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437),
  ENV_RELATIVE_URI = 'AWS_CONTAINER_CREDENTIALS_RELATIVE_URI',
  ENV_FULL_URI = 'AWS_CONTAINER_CREDENTIALS_FULL_URI',
  ENV_AUTH_TOKEN = 'AWS_CONTAINER_AUTHORIZATION_TOKEN',
  FULL_URI_UNRESTRICTED_PROTOCOLS = ['https:'],
  FULL_URI_ALLOWED_PROTOCOLS = ['http:', 'https:'],
  FULL_URI_ALLOWED_HOSTNAMES = ['localhost', '127.0.0.1'],
  RELATIVE_URI_HOST = '169.254.170.2';

/**
 * Represents credentials received from specified URI.
 *
 * This class will request refreshable credentials from the relative URI
 * specified by the AWS_CONTAINER_CREDENTIALS_RELATIVE_URI or the
 * AWS_CONTAINER_CREDENTIALS_FULL_URI environment variable. If valid credentials
 * are returned in the response, these will be used with zero configuration.
 *
 * This credentials class will by default timeout after 1 second of inactivity
 * and retry 3 times.
 * If your requests to the relative URI are timing out, you can increase
 * the value by configuring them directly:
 *
 * ```javascript
 * AWS.config.credentials = new AWS.RemoteCredentials({
 *   httpOptions: { timeout: 5000 }, // 5 second timeout
 *   maxRetries: 10, // retry 10 times
 *   retryDelayOptions: { base: 200 } // see AWS.Config for information
 * });
 * ```
 *
 * @see AWS.Config.retryDelayOptions
 *
 * @!macro nobrowser
 */
AWS.RemoteCredentials = AWS.util.inherit(AWS.Credentials, {
  constructor: function RemoteCredentials(options) {
    AWS.Credentials.call(this);
    options = options ? AWS.util.copy(options) : {};
    if (!options.httpOptions) options.httpOptions = {};
    options.httpOptions = AWS.util.merge(
      this.httpOptions, options.httpOptions);
    AWS.util.update(this, options);
  },

  /**
   * @api private
   */
  httpOptions: { timeout: 1000 },

  /**
   * @api private
   */
  maxRetries: 3,

  /**
   * @api private
   */
  isConfiguredForEcsCredentials: function isConfiguredForEcsCredentials() {
    return Boolean(
        process &&
        process.env &&
        (process.env[ENV_RELATIVE_URI] || process.env[ENV_FULL_URI])
    );
  },

  /**
   * @api private
   */
  getECSFullUri: function getECSFullUri() {
    if (process && process.env) {
      var relative = process.env[ENV_RELATIVE_URI],
          full = process.env[ENV_FULL_URI];
      if (relative) {
        return 'http://' + RELATIVE_URI_HOST + relative;
      } else if (full) {
        var parsed = AWS.util.urlParse(full);
        if (FULL_URI_ALLOWED_PROTOCOLS.indexOf(parsed.protocol) < 0) {
          throw AWS.util.error(
            new Error('Unsupported protocol:  AWS.RemoteCredentials supports '
              + FULL_URI_ALLOWED_PROTOCOLS.join(',') + ' only; '
              + parsed.protocol + ' requested.'),
            { code: 'ECSCredentialsProviderFailure' }
          );
        }

        if (FULL_URI_UNRESTRICTED_PROTOCOLS.indexOf(parsed.protocol) < 0 &&
            FULL_URI_ALLOWED_HOSTNAMES.indexOf(parsed.hostname) < 0) {
          throw AWS.util.error(
            new Error('Unsupported hostname: AWS.RemoteCredentials only supports '
              + FULL_URI_ALLOWED_HOSTNAMES.join(',') + ' for ' + parsed.protocol + '; '
              + parsed.protocol + '//' + parsed.hostname + ' requested.'),
            { code: 'ECSCredentialsProviderFailure' }
          );
        }

        return full;
      } else {
        throw AWS.util.error(
          new Error('Variable ' + ENV_RELATIVE_URI + ' or ' + ENV_FULL_URI +
            ' must be set to use AWS.RemoteCredentials.'),
          { code: 'ECSCredentialsProviderFailure' }
        );
      }
    } else {
      throw AWS.util.error(
        new Error('No process info available'),
        { code: 'ECSCredentialsProviderFailure' }
      );
    }
  },

  /**
   * @api private
   */
  getECSAuthToken: function getECSAuthToken() {
    if (process && process.env && process.env[ENV_FULL_URI]) {
      return process.env[ENV_AUTH_TOKEN];
    }
  },

  /**
   * @api private
   */
  credsFormatIsValid: function credsFormatIsValid(credData) {
    return (!!credData.accessKeyId && !!credData.secretAccessKey &&
      !!credData.sessionToken && !!credData.expireTime);
  },

  /**
   * @api private
   */
  formatCreds: function formatCreds(credData) {
    if (!!credData.credentials) {
      credData = credData.credentials;
    }

    return {
      expired: false,
      accessKeyId: credData.accessKeyId || credData.AccessKeyId,
      secretAccessKey: credData.secretAccessKey || credData.SecretAccessKey,
      sessionToken: credData.sessionToken || credData.Token,
      expireTime: new Date(credData.expiration || credData.Expiration)
    };
  },

  /**
   * @api private
   */
  request: function request(url, callback) {
    var httpRequest = new AWS.HttpRequest(url);
    httpRequest.method = 'GET';
    httpRequest.headers.Accept = 'application/json';
    var token = this.getECSAuthToken();
    if (token) {
      httpRequest.headers.Authorization = token;
    }
    AWS.util.handleRequestWithRetries(httpRequest, this, callback);
  },

  /**
   * Loads the credentials from the relative URI specified by container
   *
   * @callback callback function(err)
   *   Called when the request to the relative URI responds (or fails). When
   *   this callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, `sessionToken`, and `expireTime` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh(callback) {
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },

  /**
   * @api private
   */
  load: function load(callback) {
    var self = this;
    var fullUri;

    try {
      fullUri = this.getECSFullUri();
    } catch (err) {
      callback(err);
      return;
    }

    this.request(fullUri, function(err, data) {
      if (!err) {
        try {
          data = JSON.parse(data);
          var creds = self.formatCreds(data);
          if (!self.credsFormatIsValid(creds)) {
            throw AWS.util.error(
              new Error('Response data is not in valid format'),
              { code: 'ECSCredentialsProviderFailure' }
            );
          }
          AWS.util.update(self, creds);
        } catch (dataError) {
          err = dataError;
        }
      }
      callback(err, creds);
    });
  }
});


/***/ }),

/***/ 5037:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var STS = __nccwpck_require__(7513);

/**
 * Represents credentials retrieved from STS SAML support.
 *
 * By default this provider gets credentials using the
 * {AWS.STS.assumeRoleWithSAML} service operation. This operation
 * requires a `RoleArn` containing the ARN of the IAM trust policy for the
 * application for which credentials will be given, as well as a `PrincipalArn`
 * representing the ARN for the SAML identity provider. In addition, the
 * `SAMLAssertion` must be set to the token provided by the identity
 * provider. See {constructor} for an example on creating a credentials
 * object with proper `RoleArn`, `PrincipalArn`, and `SAMLAssertion` values.
 *
 * ## Refreshing Credentials from Identity Service
 *
 * In addition to AWS credentials expiring after a given amount of time, the
 * login token from the identity provider will also expire. Once this token
 * expires, it will not be usable to refresh AWS credentials, and another
 * token will be needed. The SDK does not manage refreshing of the token value,
 * but this can be done through a "refresh token" supported by most identity
 * providers. Consult the documentation for the identity provider for refreshing
 * tokens. Once the refreshed token is acquired, you should make sure to update
 * this new token in the credentials object's {params} property. The following
 * code will update the SAMLAssertion, assuming you have retrieved an updated
 * token from the identity provider:
 *
 * ```javascript
 * AWS.config.credentials.params.SAMLAssertion = updatedToken;
 * ```
 *
 * Future calls to `credentials.refresh()` will now use the new token.
 *
 * @!attribute params
 *   @return [map] the map of params passed to
 *     {AWS.STS.assumeRoleWithSAML}. To update the token, set the
 *     `params.SAMLAssertion` property.
 */
AWS.SAMLCredentials = AWS.util.inherit(AWS.Credentials, {
  /**
   * Creates a new credentials object.
   * @param (see AWS.STS.assumeRoleWithSAML)
   * @example Creating a new credentials object
   *   AWS.config.credentials = new AWS.SAMLCredentials({
   *     RoleArn: 'arn:aws:iam::1234567890:role/SAMLRole',
   *     PrincipalArn: 'arn:aws:iam::1234567890:role/SAMLPrincipal',
   *     SAMLAssertion: 'base64-token', // base64-encoded token from IdP
   *   });
   * @see AWS.STS.assumeRoleWithSAML
   */
  constructor: function SAMLCredentials(params) {
    AWS.Credentials.call(this);
    this.expired = true;
    this.params = params;
  },

  /**
   * Refreshes credentials using {AWS.STS.assumeRoleWithSAML}
   *
   * @callback callback function(err)
   *   Called when the STS service responds (or fails). When
   *   this callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh(callback) {
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },

  /**
   * @api private
   */
  load: function load(callback) {
    var self = this;
    self.createClients();
    self.service.assumeRoleWithSAML(function (err, data) {
      if (!err) {
        self.service.credentialsFrom(data, self);
      }
      callback(err);
    });
  },

  /**
   * @api private
   */
  createClients: function() {
    this.service = this.service || new STS({params: this.params});
  }

});


/***/ }),

/***/ 3754:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var STS = __nccwpck_require__(7513);
var iniLoader = AWS.util.iniLoader;

var ASSUME_ROLE_DEFAULT_REGION = 'us-east-1';

/**
 * Represents credentials loaded from shared credentials file
 * (defaulting to ~/.aws/credentials or defined by the
 * `AWS_SHARED_CREDENTIALS_FILE` environment variable).
 *
 * ## Using the shared credentials file
 *
 * This provider is checked by default in the Node.js environment. To use the
 * credentials file provider, simply add your access and secret keys to the
 * ~/.aws/credentials file in the following format:
 *
 *     [default]
 *     aws_access_key_id = AKID...
 *     aws_secret_access_key = YOUR_SECRET_KEY
 *
 * ## Using custom profiles
 *
 * The SDK supports loading credentials for separate profiles. This can be done
 * in two ways:
 *
 * 1. Set the `AWS_PROFILE` environment variable in your process prior to
 *    loading the SDK.
 * 2. Directly load the AWS.SharedIniFileCredentials provider:
 *
 * ```javascript
 * var creds = new AWS.SharedIniFileCredentials({profile: 'myprofile'});
 * AWS.config.credentials = creds;
 * ```
 *
 * @!macro nobrowser
 */
AWS.SharedIniFileCredentials = AWS.util.inherit(AWS.Credentials, {
  /**
   * Creates a new SharedIniFileCredentials object.
   *
   * @param options [map] a set of options
   * @option options profile [String] (AWS_PROFILE env var or 'default')
   *   the name of the profile to load.
   * @option options filename [String] ('~/.aws/credentials' or defined by
   *   AWS_SHARED_CREDENTIALS_FILE process env var)
   *   the filename to use when loading credentials.
   * @option options disableAssumeRole [Boolean] (false) True to disable
   *   support for profiles that assume an IAM role. If true, and an assume
   *   role profile is selected, an error is raised.
   * @option options preferStaticCredentials [Boolean] (false) True to
   *   prefer static credentials to role_arn if both are present.
   * @option options tokenCodeFn [Function] (null) Function to provide
   *   STS Assume Role TokenCode, if mfa_serial is provided for profile in ini
   *   file. Function is called with value of mfa_serial and callback, and
   *   should provide the TokenCode or an error to the callback in the format
   *   callback(err, token)
   * @option options callback [Function] (err) Credentials are eagerly loaded
   *   by the constructor. When the callback is called with no error, the
   *   credentials have been loaded successfully.
   * @option options httpOptions [map] A set of options to pass to the low-level
   *   HTTP request. Currently supported options are:
   *   * **proxy** [String] &mdash; the URL to proxy requests through
   *   * **agent** [http.Agent, https.Agent] &mdash; the Agent object to perform
   *     HTTP requests with. Used for connection pooling. Defaults to the global
   *     agent (`http.globalAgent`) for non-SSL connections. Note that for
   *     SSL connections, a special Agent object is used in order to enable
   *     peer certificate verification. This feature is only available in the
   *     Node.js environment.
   *   * **connectTimeout** [Integer] &mdash; Sets the socket to timeout after
   *     failing to establish a connection with the server after
   *     `connectTimeout` milliseconds. This timeout has no effect once a socket
   *     connection has been established.
   *   * **timeout** [Integer] &mdash; The number of milliseconds a request can
   *     take before automatically being terminated.
   *     Defaults to two minutes (120000).
   */
  constructor: function SharedIniFileCredentials(options) {
    AWS.Credentials.call(this);

    options = options || {};

    this.filename = options.filename;
    this.profile = options.profile || process.env.AWS_PROFILE || AWS.util.defaultProfile;
    this.disableAssumeRole = Boolean(options.disableAssumeRole);
    this.preferStaticCredentials = Boolean(options.preferStaticCredentials);
    this.tokenCodeFn = options.tokenCodeFn || null;
    this.httpOptions = options.httpOptions || null;
    this.get(options.callback || AWS.util.fn.noop);
  },

  /**
   * @api private
   */
  load: function load(callback) {
    var self = this;
    try {
      var profiles = AWS.util.getProfilesFromSharedConfig(iniLoader, this.filename);
      var profile = profiles[this.profile] || {};

      if (Object.keys(profile).length === 0) {
        throw AWS.util.error(
          new Error('Profile ' + this.profile + ' not found'),
          { code: 'SharedIniFileCredentialsProviderFailure' }
        );
      }

      /*
      In the CLI, the presence of both a role_arn and static credentials have
      different meanings depending on how many profiles have been visited. For
      the first profile processed, role_arn takes precedence over any static
      credentials, but for all subsequent profiles, static credentials are
      used if present, and only in their absence will the profile's
      source_profile and role_arn keys be used to load another set of
      credentials. This var is intended to yield compatible behaviour in this
      sdk.
      */
      var preferStaticCredentialsToRoleArn = Boolean(
        this.preferStaticCredentials
        && profile['aws_access_key_id']
        && profile['aws_secret_access_key']
      );

      if (profile['role_arn'] && !preferStaticCredentialsToRoleArn) {
        this.loadRoleProfile(profiles, profile, function(err, data) {
          if (err) {
            callback(err);
          } else {
            self.expired = false;
            self.accessKeyId = data.Credentials.AccessKeyId;
            self.secretAccessKey = data.Credentials.SecretAccessKey;
            self.sessionToken = data.Credentials.SessionToken;
            self.expireTime = data.Credentials.Expiration;
            callback(null);
          }
        });
        return;
      }

      this.accessKeyId = profile['aws_access_key_id'];
      this.secretAccessKey = profile['aws_secret_access_key'];
      this.sessionToken = profile['aws_session_token'];

      if (!this.accessKeyId || !this.secretAccessKey) {
        throw AWS.util.error(
          new Error('Credentials not set for profile ' + this.profile),
          { code: 'SharedIniFileCredentialsProviderFailure' }
        );
      }
      this.expired = false;
      callback(null);
    } catch (err) {
      callback(err);
    }
  },

  /**
   * Loads the credentials from the shared credentials file
   *
   * @callback callback function(err)
   *   Called after the shared INI file on disk is read and parsed. When this
   *   callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh(callback) {
    iniLoader.clearCachedFiles();
    this.coalesceRefresh(
      callback || AWS.util.fn.callback,
      this.disableAssumeRole
    );
  },

  /**
   * @api private
   */
  loadRoleProfile: function loadRoleProfile(creds, roleProfile, callback) {
    if (this.disableAssumeRole) {
      throw AWS.util.error(
        new Error('Role assumption profiles are disabled. ' +
                  'Failed to load profile ' + this.profile +
                  ' from ' + creds.filename),
        { code: 'SharedIniFileCredentialsProviderFailure' }
      );
    }

    var self = this;
    var roleArn = roleProfile['role_arn'];
    var roleSessionName = roleProfile['role_session_name'];
    var externalId = roleProfile['external_id'];
    var mfaSerial = roleProfile['mfa_serial'];
    var sourceProfileName = roleProfile['source_profile'];

    // From experimentation, the following behavior mimics the AWS CLI:
    //
    // 1. Use region from the profile if present.
    // 2. Otherwise fall back to N. Virginia (global endpoint).
    //
    // It is necessary to do the fallback explicitly, because if
    // 'AWS_STS_REGIONAL_ENDPOINTS=regional', the underlying STS client will
    // otherwise throw an error if region is left 'undefined'.
    //
    // Experimentation shows that the AWS CLI (tested at version 1.18.136)
    // ignores the following potential sources of a region for the purposes of
    // this AssumeRole call:
    //
    // - The [default] profile
    // - The AWS_REGION environment variable
    //
    // Ignoring the [default] profile for the purposes of AssumeRole is arguably
    // a bug in the CLI since it does use the [default] region for service
    // calls... but right now we're matching behavior of the other tool.
    var profileRegion = roleProfile['region'] || ASSUME_ROLE_DEFAULT_REGION;

    if (!sourceProfileName) {
      throw AWS.util.error(
        new Error('source_profile is not set using profile ' + this.profile),
        { code: 'SharedIniFileCredentialsProviderFailure' }
      );
    }

    var sourceProfileExistanceTest = creds[sourceProfileName];

    if (typeof sourceProfileExistanceTest !== 'object') {
      throw AWS.util.error(
        new Error('source_profile ' + sourceProfileName + ' using profile '
          + this.profile + ' does not exist'),
        { code: 'SharedIniFileCredentialsProviderFailure' }
      );
    }

    var sourceCredentials = new AWS.SharedIniFileCredentials(
      AWS.util.merge(this.options || {}, {
        profile: sourceProfileName,
        preferStaticCredentials: true
      })
    );

    this.roleArn = roleArn;
    var sts = new STS({
      credentials: sourceCredentials,
      region: profileRegion,
      httpOptions: this.httpOptions
    });

    var roleParams = {
      RoleArn: roleArn,
      RoleSessionName: roleSessionName || 'aws-sdk-js-' + Date.now()
    };

    if (externalId) {
      roleParams.ExternalId = externalId;
    }

    if (mfaSerial && self.tokenCodeFn) {
      roleParams.SerialNumber = mfaSerial;
      self.tokenCodeFn(mfaSerial, function(err, token) {
        if (err) {
          var message;
          if (err instanceof Error) {
            message = err.message;
          } else {
            message = err;
          }
          callback(
            AWS.util.error(
              new Error('Error fetching MFA token: ' + message),
              { code: 'SharedIniFileCredentialsProviderFailure' }
            ));
          return;
        }

        roleParams.TokenCode = token;
        sts.assumeRole(roleParams, callback);
      });
      return;
    }
    sts.assumeRole(roleParams, callback);
  }
});


/***/ }),

/***/ 7360:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var STS = __nccwpck_require__(7513);

/**
 * Represents temporary credentials retrieved from {AWS.STS}. Without any
 * extra parameters, credentials will be fetched from the
 * {AWS.STS.getSessionToken} operation. If an IAM role is provided, the
 * {AWS.STS.assumeRole} operation will be used to fetch credentials for the
 * role instead.
 *
 * @note AWS.TemporaryCredentials is deprecated, but remains available for
 *   backwards compatibility. {AWS.ChainableTemporaryCredentials} is the
 *   preferred class for temporary credentials.
 *
 * To setup temporary credentials, configure a set of master credentials
 * using the standard credentials providers (environment, EC2 instance metadata,
 * or from the filesystem), then set the global credentials to a new
 * temporary credentials object:
 *
 * ```javascript
 * // Note that environment credentials are loaded by default,
 * // the following line is shown for clarity:
 * AWS.config.credentials = new AWS.EnvironmentCredentials('AWS');
 *
 * // Now set temporary credentials seeded from the master credentials
 * AWS.config.credentials = new AWS.TemporaryCredentials();
 *
 * // subsequent requests will now use temporary credentials from AWS STS.
 * new AWS.S3().listBucket(function(err, data) { ... });
 * ```
 *
 * @!attribute masterCredentials
 *   @return [AWS.Credentials] the master (non-temporary) credentials used to
 *     get and refresh temporary credentials from AWS STS.
 * @note (see constructor)
 */
AWS.TemporaryCredentials = AWS.util.inherit(AWS.Credentials, {
  /**
   * Creates a new temporary credentials object.
   *
   * @note In order to create temporary credentials, you first need to have
   *   "master" credentials configured in {AWS.Config.credentials}. These
   *   master credentials are necessary to retrieve the temporary credentials,
   *   as well as refresh the credentials when they expire.
   * @param params [map] a map of options that are passed to the
   *   {AWS.STS.assumeRole} or {AWS.STS.getSessionToken} operations.
   *   If a `RoleArn` parameter is passed in, credentials will be based on the
   *   IAM role.
   * @param masterCredentials [AWS.Credentials] the master (non-temporary) credentials
   *  used to get and refresh temporary credentials from AWS STS.
   * @example Creating a new credentials object for generic temporary credentials
   *   AWS.config.credentials = new AWS.TemporaryCredentials();
   * @example Creating a new credentials object for an IAM role
   *   AWS.config.credentials = new AWS.TemporaryCredentials({
   *     RoleArn: 'arn:aws:iam::1234567890:role/TemporaryCredentials',
   *   });
   * @see AWS.STS.assumeRole
   * @see AWS.STS.getSessionToken
   */
  constructor: function TemporaryCredentials(params, masterCredentials) {
    AWS.Credentials.call(this);
    this.loadMasterCredentials(masterCredentials);
    this.expired = true;

    this.params = params || {};
    if (this.params.RoleArn) {
      this.params.RoleSessionName =
        this.params.RoleSessionName || 'temporary-credentials';
    }
  },

  /**
   * Refreshes credentials using {AWS.STS.assumeRole} or
   * {AWS.STS.getSessionToken}, depending on whether an IAM role ARN was passed
   * to the credentials {constructor}.
   *
   * @callback callback function(err)
   *   Called when the STS service responds (or fails). When
   *   this callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh (callback) {
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },

  /**
   * @api private
   */
  load: function load (callback) {
    var self = this;
    self.createClients();
    self.masterCredentials.get(function () {
      self.service.config.credentials = self.masterCredentials;
      var operation = self.params.RoleArn ?
        self.service.assumeRole : self.service.getSessionToken;
      operation.call(self.service, function (err, data) {
        if (!err) {
          self.service.credentialsFrom(data, self);
        }
        callback(err);
      });
    });
  },

  /**
   * @api private
   */
  loadMasterCredentials: function loadMasterCredentials (masterCredentials) {
    this.masterCredentials = masterCredentials || AWS.config.credentials;
    while (this.masterCredentials.masterCredentials) {
      this.masterCredentials = this.masterCredentials.masterCredentials;
    }

    if (typeof this.masterCredentials.get !== 'function') {
      this.masterCredentials = new AWS.Credentials(this.masterCredentials);
    }
  },

  /**
   * @api private
   */
  createClients: function () {
    this.service = this.service || new STS({params: this.params});
  }

});


/***/ }),

/***/ 1017:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var fs = __nccwpck_require__(5747);
var STS = __nccwpck_require__(7513);
var iniLoader = AWS.util.iniLoader;

/**
 * Represents OIDC credentials from a file on disk
 * If the credentials expire, the SDK can {refresh} the credentials
 * from the file.
 *
 * ## Using the web identity token file
 *
 * This provider is checked by default in the Node.js environment. To use
 * the provider simply add your OIDC token to a file (ASCII encoding) and
 * share the filename in either AWS_WEB_IDENTITY_TOKEN_FILE environment
 * variable or web_identity_token_file shared config variable
 *
 * The file contains encoded OIDC token and the characters are
 * ASCII encoded. OIDC tokens are JSON Web Tokens (JWT).
 * JWT's are 3 base64 encoded strings joined by the '.' character.
 *
 * This class will read filename from AWS_WEB_IDENTITY_TOKEN_FILE
 * environment variable or web_identity_token_file shared config variable,
 * and get the OIDC token from filename.
 * It will also read IAM role to be assumed from AWS_ROLE_ARN
 * environment variable or role_arn shared config variable.
 * This provider gets credetials using the {AWS.STS.assumeRoleWithWebIdentity}
 * service operation
 *
 * @!macro nobrowser
 */
AWS.TokenFileWebIdentityCredentials = AWS.util.inherit(AWS.Credentials, {

  /**
   * @example Creating a new credentials object
   *  AWS.config.credentials = new AWS.TokenFileWebIdentityCredentials(
   *   // optionally provide configuration to apply to the underlying AWS.STS service client
   *   // if configuration is not provided, then configuration will be pulled from AWS.config
   *   {
   *     // specify timeout options
   *     httpOptions: {
   *       timeout: 100
   *     }
   *   });
   * @see AWS.Config
   */
  constructor: function TokenFileWebIdentityCredentials(clientConfig) {
    AWS.Credentials.call(this);
    this.data = null;
    this.clientConfig = AWS.util.copy(clientConfig || {});
  },

  /**
   * Returns params from environment variables
   *
   * @api private
   */
  getParamsFromEnv: function getParamsFromEnv() {
    var ENV_TOKEN_FILE = 'AWS_WEB_IDENTITY_TOKEN_FILE',
        ENV_ROLE_ARN = 'AWS_ROLE_ARN';
    if (process.env[ENV_TOKEN_FILE] && process.env[ENV_ROLE_ARN]) {
      return [{
        envTokenFile: process.env[ENV_TOKEN_FILE],
        roleArn: process.env[ENV_ROLE_ARN],
        roleSessionName: process.env['AWS_ROLE_SESSION_NAME']
      }];
    }
  },

  /**
   * Returns params from shared config variables
   *
   * @api private
   */
  getParamsFromSharedConfig: function getParamsFromSharedConfig() {
    var profiles = AWS.util.getProfilesFromSharedConfig(iniLoader);
    var profileName = process.env.AWS_PROFILE || AWS.util.defaultProfile;
    var profile = profiles[profileName] || {};

    if (Object.keys(profile).length === 0) {
      throw AWS.util.error(
        new Error('Profile ' + profileName + ' not found'),
        { code: 'TokenFileWebIdentityCredentialsProviderFailure' }
      );
    }

    var paramsArray = [];

    while (!profile['web_identity_token_file'] && profile['source_profile']) {
      paramsArray.unshift({
        roleArn: profile['role_arn'],
        roleSessionName: profile['role_session_name']
      });
      var sourceProfile = profile['source_profile'];
      profile = profiles[sourceProfile];
    }

    paramsArray.unshift({
      envTokenFile: profile['web_identity_token_file'],
      roleArn: profile['role_arn'],
      roleSessionName: profile['role_session_name']
    });

    return paramsArray;
  },

  /**
   * Refreshes credentials using {AWS.STS.assumeRoleWithWebIdentity}
   *
   * @callback callback function(err)
   *   Called when the STS service responds (or fails). When
   *   this callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see AWS.Credentials.get
   */
  refresh: function refresh(callback) {
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },

  /**
   * @api private
  */
  assumeRoleChaining: function assumeRoleChaining(paramsArray, callback) {
    var self = this;
    if (paramsArray.length === 0) {
      self.service.credentialsFrom(self.data, self);
      callback();
    } else {
      var params = paramsArray.shift();
      self.service.config.credentials = self.service.credentialsFrom(self.data, self);
      self.service.assumeRole(
        {
          RoleArn: params.roleArn,
          RoleSessionName: params.roleSessionName || 'token-file-web-identity'
        },
        function (err, data) {
          self.data = null;
          if (err) {
            callback(err);
          } else {
            self.data = data;
            self.assumeRoleChaining(paramsArray, callback);
          }
        }
      );
    }
  },

  /**
   * @api private
   */
  load: function load(callback) {
    var self = this;
    try {
      var paramsArray = self.getParamsFromEnv();
      if (!paramsArray) {
        paramsArray = self.getParamsFromSharedConfig();
      }
      if (paramsArray) {
        var params = paramsArray.shift();
        var oidcToken = fs.readFileSync(params.envTokenFile, {encoding: 'ascii'});
        if (!self.service) {
          self.createClients();
        }
        self.service.assumeRoleWithWebIdentity(
          {
            WebIdentityToken: oidcToken,
            RoleArn: params.roleArn,
            RoleSessionName: params.roleSessionName || 'token-file-web-identity'
          },
          function (err, data) {
            self.data = null;
            if (err) {
              callback(err);
            } else {
              self.data = data;
              self.assumeRoleChaining(paramsArray, callback);
            }
          }
        );
      }
    } catch (err) {
      callback(err);
    }
  },

  /**
   * @api private
   */
  createClients: function() {
    if (!this.service) {
      var stsConfig = AWS.util.merge({}, this.clientConfig);
      this.service = new STS(stsConfig);

      // Retry in case of IDPCommunicationErrorException or InvalidIdentityToken
      this.service.retryableError = function(error) {
        if (error.code === 'IDPCommunicationErrorException' || error.code === 'InvalidIdentityToken') {
          return true;
        } else {
          return AWS.Service.prototype.retryableError.call(this, error);
        }
      };
    }
  }
});


/***/ }),

/***/ 4998:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var STS = __nccwpck_require__(7513);

/**
 * Represents credentials retrieved from STS Web Identity Federation support.
 *
 * By default this provider gets credentials using the
 * {AWS.STS.assumeRoleWithWebIdentity} service operation. This operation
 * requires a `RoleArn` containing the ARN of the IAM trust policy for the
 * application for which credentials will be given. In addition, the
 * `WebIdentityToken` must be set to the token provided by the identity
 * provider. See {constructor} for an example on creating a credentials
 * object with proper `RoleArn` and `WebIdentityToken` values.
 *
 * ## Refreshing Credentials from Identity Service
 *
 * In addition to AWS credentials expiring after a given amount of time, the
 * login token from the identity provider will also expire. Once this token
 * expires, it will not be usable to refresh AWS credentials, and another
 * token will be needed. The SDK does not manage refreshing of the token value,
 * but this can be done through a "refresh token" supported by most identity
 * providers. Consult the documentation for the identity provider for refreshing
 * tokens. Once the refreshed token is acquired, you should make sure to update
 * this new token in the credentials object's {params} property. The following
 * code will update the WebIdentityToken, assuming you have retrieved an updated
 * token from the identity provider:
 *
 * ```javascript
 * AWS.config.credentials.params.WebIdentityToken = updatedToken;
 * ```
 *
 * Future calls to `credentials.refresh()` will now use the new token.
 *
 * @!attribute params
 *   @return [map] the map of params passed to
 *     {AWS.STS.assumeRoleWithWebIdentity}. To update the token, set the
 *     `params.WebIdentityToken` property.
 * @!attribute data
 *   @return [map] the raw data response from the call to
 *     {AWS.STS.assumeRoleWithWebIdentity}. Use this if you want to get
 *     access to other properties from the response.
 */
AWS.WebIdentityCredentials = AWS.util.inherit(AWS.Credentials, {
  /**
   * Creates a new credentials object.
   * @param (see AWS.STS.assumeRoleWithWebIdentity)
   * @example Creating a new credentials object
   *   AWS.config.credentials = new AWS.WebIdentityCredentials({
   *     RoleArn: 'arn:aws:iam::1234567890:role/WebIdentity',
   *     WebIdentityToken: 'ABCDEFGHIJKLMNOP', // token from identity service
   *     RoleSessionName: 'web' // optional name, defaults to web-identity
   *   }, {
   *     // optionally provide configuration to apply to the underlying AWS.STS service client
   *     // if configuration is not provided, then configuration will be pulled from AWS.config
   *
   *     // specify timeout options
   *     httpOptions: {
   *       timeout: 100
   *     }
   *   });
   * @see AWS.STS.assumeRoleWithWebIdentity
   * @see AWS.Config
   */
  constructor: function WebIdentityCredentials(params, clientConfig) {
    AWS.Credentials.call(this);
    this.expired = true;
    this.params = params;
    this.params.RoleSessionName = this.params.RoleSessionName || 'web-identity';
    this.data = null;
    this._clientConfig = AWS.util.copy(clientConfig || {});
  },

  /**
   * Refreshes credentials using {AWS.STS.assumeRoleWithWebIdentity}
   *
   * @callback callback function(err)
   *   Called when the STS service responds (or fails). When
   *   this callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh(callback) {
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },

  /**
   * @api private
   */
  load: function load(callback) {
    var self = this;
    self.createClients();
    self.service.assumeRoleWithWebIdentity(function (err, data) {
      self.data = null;
      if (!err) {
        self.data = data;
        self.service.credentialsFrom(data, self);
      }
      callback(err);
    });
  },

  /**
   * @api private
   */
  createClients: function() {
    if (!this.service) {
      var stsConfig = AWS.util.merge({}, this._clientConfig);
      stsConfig.params = this.params;
      this.service = new STS(stsConfig);
    }
  }

});


/***/ }),

/***/ 5313:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var util = __nccwpck_require__(7985);
var endpointDiscoveryEnabledEnvs = ['AWS_ENABLE_ENDPOINT_DISCOVERY', 'AWS_ENDPOINT_DISCOVERY_ENABLED'];

/**
 * Generate key (except resources and operation part) to index the endpoints in the cache
 * If input shape has endpointdiscoveryid trait then use
 *   accessKey + operation + resources + region + service as cache key
 * If input shape doesn't have endpointdiscoveryid trait then use
 *   accessKey + region + service as cache key
 * @return [map<String,String>] object with keys to index endpoints.
 * @api private
 */
function getCacheKey(request) {
  var service = request.service;
  var api = service.api || {};
  var operations = api.operations;
  var identifiers = {};
  if (service.config.region) {
    identifiers.region = service.config.region;
  }
  if (api.serviceId) {
    identifiers.serviceId = api.serviceId;
  }
  if (service.config.credentials.accessKeyId) {
    identifiers.accessKeyId = service.config.credentials.accessKeyId;
  }
  return identifiers;
}

/**
 * Recursive helper for marshallCustomIdentifiers().
 * Looks for required string input members that have 'endpointdiscoveryid' trait.
 * @api private
 */
function marshallCustomIdentifiersHelper(result, params, shape) {
  if (!shape || params === undefined || params === null) return;
  if (shape.type === 'structure' && shape.required && shape.required.length > 0) {
    util.arrayEach(shape.required, function(name) {
      var memberShape = shape.members[name];
      if (memberShape.endpointDiscoveryId === true) {
        var locationName = memberShape.isLocationName ? memberShape.name : name;
        result[locationName] = String(params[name]);
      } else {
        marshallCustomIdentifiersHelper(result, params[name], memberShape);
      }
    });
  }
}

/**
 * Get custom identifiers for cache key.
 * Identifies custom identifiers by checking each shape's `endpointDiscoveryId` trait.
 * @param [object] request object
 * @param [object] input shape of the given operation's api
 * @api private
 */
function marshallCustomIdentifiers(request, shape) {
  var identifiers = {};
  marshallCustomIdentifiersHelper(identifiers, request.params, shape);
  return identifiers;
}

/**
 * Call endpoint discovery operation when it's optional.
 * When endpoint is available in cache then use the cached endpoints. If endpoints
 * are unavailable then use regional endpoints and call endpoint discovery operation
 * asynchronously. This is turned off by default.
 * @param [object] request object
 * @api private
 */
function optionalDiscoverEndpoint(request) {
  var service = request.service;
  var api = service.api;
  var operationModel = api.operations ? api.operations[request.operation] : undefined;
  var inputShape = operationModel ? operationModel.input : undefined;

  var identifiers = marshallCustomIdentifiers(request, inputShape);
  var cacheKey = getCacheKey(request);
  if (Object.keys(identifiers).length > 0) {
    cacheKey = util.update(cacheKey, identifiers);
    if (operationModel) cacheKey.operation = operationModel.name;
  }
  var endpoints = AWS.endpointCache.get(cacheKey);
  if (endpoints && endpoints.length === 1 && endpoints[0].Address === '') {
    //endpoint operation is being made but response not yet received
    //or endpoint operation just failed in 1 minute
    return;
  } else if (endpoints && endpoints.length > 0) {
    //found endpoint record from cache
    request.httpRequest.updateEndpoint(endpoints[0].Address);
  } else {
    //endpoint record not in cache or outdated. make discovery operation
    var endpointRequest = service.makeRequest(api.endpointOperation, {
      Operation: operationModel.name,
      Identifiers: identifiers,
    });
    addApiVersionHeader(endpointRequest);
    endpointRequest.removeListener('validate', AWS.EventListeners.Core.VALIDATE_PARAMETERS);
    endpointRequest.removeListener('retry', AWS.EventListeners.Core.RETRY_CHECK);
    //put in a placeholder for endpoints already requested, prevent
    //too much in-flight calls
    AWS.endpointCache.put(cacheKey, [{
      Address: '',
      CachePeriodInMinutes: 1
    }]);
    endpointRequest.send(function(err, data) {
      if (data && data.Endpoints) {
        AWS.endpointCache.put(cacheKey, data.Endpoints);
      } else if (err) {
        AWS.endpointCache.put(cacheKey, [{
          Address: '',
          CachePeriodInMinutes: 1 //not to make more endpoint operation in next 1 minute
        }]);
      }
    });
  }
}

var requestQueue = {};

/**
 * Call endpoint discovery operation when it's required.
 * When endpoint is available in cache then use cached ones. If endpoints are
 * unavailable then SDK should call endpoint operation then use returned new
 * endpoint for the api call. SDK will automatically attempt to do endpoint
 * discovery. This is turned off by default
 * @param [object] request object
 * @api private
 */
function requiredDiscoverEndpoint(request, done) {
  var service = request.service;
  var api = service.api;
  var operationModel = api.operations ? api.operations[request.operation] : undefined;
  var inputShape = operationModel ? operationModel.input : undefined;

  var identifiers = marshallCustomIdentifiers(request, inputShape);
  var cacheKey = getCacheKey(request);
  if (Object.keys(identifiers).length > 0) {
    cacheKey = util.update(cacheKey, identifiers);
    if (operationModel) cacheKey.operation = operationModel.name;
  }
  var cacheKeyStr = AWS.EndpointCache.getKeyString(cacheKey);
  var endpoints = AWS.endpointCache.get(cacheKeyStr); //endpoint cache also accepts string keys
  if (endpoints && endpoints.length === 1 && endpoints[0].Address === '') {
    //endpoint operation is being made but response not yet received
    //push request object to a pending queue
    if (!requestQueue[cacheKeyStr]) requestQueue[cacheKeyStr] = [];
    requestQueue[cacheKeyStr].push({request: request, callback: done});
    return;
  } else if (endpoints && endpoints.length > 0) {
    request.httpRequest.updateEndpoint(endpoints[0].Address);
    done();
  } else {
    var endpointRequest = service.makeRequest(api.endpointOperation, {
      Operation: operationModel.name,
      Identifiers: identifiers,
    });
    endpointRequest.removeListener('validate', AWS.EventListeners.Core.VALIDATE_PARAMETERS);
    addApiVersionHeader(endpointRequest);

    //put in a placeholder for endpoints already requested, prevent
    //too much in-flight calls
    AWS.endpointCache.put(cacheKeyStr, [{
      Address: '',
      CachePeriodInMinutes: 60 //long-live cache
    }]);
    endpointRequest.send(function(err, data) {
      if (err) {
        request.response.error = util.error(err, { retryable: false });
        AWS.endpointCache.remove(cacheKey);

        //fail all the pending requests in batch
        if (requestQueue[cacheKeyStr]) {
          var pendingRequests = requestQueue[cacheKeyStr];
          util.arrayEach(pendingRequests, function(requestContext) {
            requestContext.request.response.error = util.error(err, { retryable: false });
            requestContext.callback();
          });
          delete requestQueue[cacheKeyStr];
        }
      } else if (data) {
        AWS.endpointCache.put(cacheKeyStr, data.Endpoints);
        request.httpRequest.updateEndpoint(data.Endpoints[0].Address);

        //update the endpoint for all the pending requests in batch
        if (requestQueue[cacheKeyStr]) {
          var pendingRequests = requestQueue[cacheKeyStr];
          util.arrayEach(pendingRequests, function(requestContext) {
            requestContext.request.httpRequest.updateEndpoint(data.Endpoints[0].Address);
            requestContext.callback();
          });
          delete requestQueue[cacheKeyStr];
        }
      }
      done();
    });
  }
}

/**
 * add api version header to endpoint operation
 * @api private
 */
function addApiVersionHeader(endpointRequest) {
  var api = endpointRequest.service.api;
  var apiVersion = api.apiVersion;
  if (apiVersion && !endpointRequest.httpRequest.headers['x-amz-api-version']) {
    endpointRequest.httpRequest.headers['x-amz-api-version'] = apiVersion;
  }
}

/**
 * If api call gets invalid endpoint exception, SDK should attempt to remove the invalid
 * endpoint from cache.
 * @api private
 */
function invalidateCachedEndpoints(response) {
  var error = response.error;
  var httpResponse = response.httpResponse;
  if (error &&
    (error.code === 'InvalidEndpointException' || httpResponse.statusCode === 421)
  ) {
    var request = response.request;
    var operations = request.service.api.operations || {};
    var inputShape = operations[request.operation] ? operations[request.operation].input : undefined;
    var identifiers = marshallCustomIdentifiers(request, inputShape);
    var cacheKey = getCacheKey(request);
    if (Object.keys(identifiers).length > 0) {
      cacheKey = util.update(cacheKey, identifiers);
      if (operations[request.operation]) cacheKey.operation = operations[request.operation].name;
    }
    AWS.endpointCache.remove(cacheKey);
  }
}

/**
 * If endpoint is explicitly configured, SDK should not do endpoint discovery in anytime.
 * @param [object] client Service client object.
 * @api private
 */
function hasCustomEndpoint(client) {
  //if set endpoint is set for specific client, enable endpoint discovery will raise an error.
  if (client._originalConfig && client._originalConfig.endpoint && client._originalConfig.endpointDiscoveryEnabled === true) {
    throw util.error(new Error(), {
      code: 'ConfigurationException',
      message: 'Custom endpoint is supplied; endpointDiscoveryEnabled must not be true.'
    });
  };
  var svcConfig = AWS.config[client.serviceIdentifier] || {};
  return Boolean(AWS.config.endpoint || svcConfig.endpoint || (client._originalConfig && client._originalConfig.endpoint));
}

/**
 * @api private
 */
function isFalsy(value) {
  return ['false', '0'].indexOf(value) >= 0;
}

/**
 * If endpoint discovery should perform for this request when no operation requires endpoint
 * discovery for the given service.
 * SDK performs config resolution in order like below:
 * 1. If set in client configuration.
 * 2. If set in env AWS_ENABLE_ENDPOINT_DISCOVERY.
 * 3. If set in shared ini config file with key 'endpoint_discovery_enabled'.
 * @param [object] request request object.
 * @returns [boolean|undefined] if endpoint discovery config is not set in any source, this
 *  function returns undefined
 * @api private
 */
function resolveEndpointDiscoveryConfig(request) {
  var service = request.service || {};
  if (service.config.endpointDiscoveryEnabled !== undefined) {
    return service.config.endpointDiscoveryEnabled;
  }

  //shared ini file is only available in Node
  //not to check env in browser
  if (util.isBrowser()) return undefined;

  // If any of recognized endpoint discovery config env is set
  for (var i = 0; i < endpointDiscoveryEnabledEnvs.length; i++) {
    var env = endpointDiscoveryEnabledEnvs[i];
    if (Object.prototype.hasOwnProperty.call(process.env, env)) {
      if (process.env[env] === '' || process.env[env] === undefined) {
        throw util.error(new Error(), {
          code: 'ConfigurationException',
          message: 'environmental variable ' + env + ' cannot be set to nothing'
        });
      }
      return !isFalsy(process.env[env]);
    }
  }

  var configFile = {};
  try {
    configFile = AWS.util.iniLoader ? AWS.util.iniLoader.loadFrom({
      isConfig: true,
      filename: process.env[AWS.util.sharedConfigFileEnv]
    }) : {};
  } catch (e) {}
  var sharedFileConfig = configFile[
    process.env.AWS_PROFILE || AWS.util.defaultProfile
  ] || {};
  if (Object.prototype.hasOwnProperty.call(sharedFileConfig, 'endpoint_discovery_enabled')) {
    if (sharedFileConfig.endpoint_discovery_enabled === undefined) {
      throw util.error(new Error(), {
        code: 'ConfigurationException',
        message: 'config file entry \'endpoint_discovery_enabled\' cannot be set to nothing'
      });
    }
    return !isFalsy(sharedFileConfig.endpoint_discovery_enabled);
  }
  return undefined;
}

/**
 * attach endpoint discovery logic to request object
 * @param [object] request
 * @api private
 */
function discoverEndpoint(request, done) {
  var service = request.service || {};
  if (hasCustomEndpoint(service) || request.isPresigned()) return done();

  var operations = service.api.operations || {};
  var operationModel = operations[request.operation];
  var isEndpointDiscoveryRequired = operationModel ? operationModel.endpointDiscoveryRequired : 'NULL';
  var isEnabled = resolveEndpointDiscoveryConfig(request);
  var hasRequiredEndpointDiscovery = service.api.hasRequiredEndpointDiscovery;
  if (isEnabled || hasRequiredEndpointDiscovery) {
    // Once a customer enables endpoint discovery, the SDK should start appending
    // the string endpoint-discovery to the user-agent on all requests.
    request.httpRequest.appendToUserAgent('endpoint-discovery');
  }
  switch (isEndpointDiscoveryRequired) {
    case 'OPTIONAL':
      if (isEnabled || hasRequiredEndpointDiscovery) {
        // For a given service; if at least one operation requires endpoint discovery then the SDK must enable endpoint discovery
        // by default for all operations of that service, including operations where endpoint discovery is optional.
        optionalDiscoverEndpoint(request);
        request.addNamedListener('INVALIDATE_CACHED_ENDPOINTS', 'extractError', invalidateCachedEndpoints);
      }
      done();
      break;
    case 'REQUIRED':
      if (isEnabled === false) {
        // For a given operation; if endpoint discovery is required and it has been disabled on the SDK client,
        // then the SDK must return a clear and actionable exception.
        request.response.error = util.error(new Error(), {
          code: 'ConfigurationException',
          message: 'Endpoint Discovery is disabled but ' + service.api.className + '.' + request.operation +
                    '() requires it. Please check your configurations.'
        });
        done();
        break;
      }
      request.addNamedListener('INVALIDATE_CACHED_ENDPOINTS', 'extractError', invalidateCachedEndpoints);
      requiredDiscoverEndpoint(request, done);
      break;
    case 'NULL':
    default:
      done();
      break;
  }
}

module.exports = {
  discoverEndpoint: discoverEndpoint,
  requiredDiscoverEndpoint: requiredDiscoverEndpoint,
  optionalDiscoverEndpoint: optionalDiscoverEndpoint,
  marshallCustomIdentifiers: marshallCustomIdentifiers,
  getCacheKey: getCacheKey,
  invalidateCachedEndpoint: invalidateCachedEndpoints,
};


/***/ }),

/***/ 3727:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var eventMessageChunker = __nccwpck_require__(3630).eventMessageChunker;
var parseEvent = __nccwpck_require__(2123).parseEvent;

function createEventStream(body, parser, model) {
    var eventMessages = eventMessageChunker(body);

    var events = [];

    for (var i = 0; i < eventMessages.length; i++) {
        events.push(parseEvent(parser, eventMessages[i], model));
    }

    return events;
}

/**
 * @api private
 */
module.exports = {
    createEventStream: createEventStream
};


/***/ }),

/***/ 8518:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(8437).util;
var Transform = __nccwpck_require__(2413).Transform;
var allocBuffer = util.buffer.alloc;

/** @type {Transform} */
function EventMessageChunkerStream(options) {
    Transform.call(this, options);

    this.currentMessageTotalLength = 0;
    this.currentMessagePendingLength = 0;
    /** @type {Buffer} */
    this.currentMessage = null;

    /** @type {Buffer} */
    this.messageLengthBuffer = null;
}

EventMessageChunkerStream.prototype = Object.create(Transform.prototype);

/**
 *
 * @param {Buffer} chunk
 * @param {string} encoding
 * @param {*} callback
 */
EventMessageChunkerStream.prototype._transform = function(chunk, encoding, callback) {
    var chunkLength = chunk.length;
    var currentOffset = 0;

    while (currentOffset < chunkLength) {
        // create new message if necessary
        if (!this.currentMessage) {
            // working on a new message, determine total length
            var bytesRemaining = chunkLength - currentOffset;
            // prevent edge case where total length spans 2 chunks
            if (!this.messageLengthBuffer) {
                this.messageLengthBuffer = allocBuffer(4);
            }
            var numBytesForTotal = Math.min(
                4 - this.currentMessagePendingLength, // remaining bytes to fill the messageLengthBuffer
                bytesRemaining // bytes left in chunk
            );

            chunk.copy(
                this.messageLengthBuffer,
                this.currentMessagePendingLength,
                currentOffset,
                currentOffset + numBytesForTotal
            );

            this.currentMessagePendingLength += numBytesForTotal;
            currentOffset += numBytesForTotal;

            if (this.currentMessagePendingLength < 4) {
                // not enough information to create the current message
                break;
            }
            this.allocateMessage(this.messageLengthBuffer.readUInt32BE(0));
            this.messageLengthBuffer = null;
        }

        // write data into current message
        var numBytesToWrite = Math.min(
            this.currentMessageTotalLength - this.currentMessagePendingLength, // number of bytes left to complete message
            chunkLength - currentOffset // number of bytes left in the original chunk
        );
        chunk.copy(
            this.currentMessage, // target buffer
            this.currentMessagePendingLength, // target offset
            currentOffset, // chunk offset
            currentOffset + numBytesToWrite // chunk end to write
        );
        this.currentMessagePendingLength += numBytesToWrite;
        currentOffset += numBytesToWrite;

        // check if a message is ready to be pushed
        if (this.currentMessageTotalLength && this.currentMessageTotalLength === this.currentMessagePendingLength) {
            // push out the message
            this.push(this.currentMessage);
            // cleanup
            this.currentMessage = null;
            this.currentMessageTotalLength = 0;
            this.currentMessagePendingLength = 0;
        }
    }

    callback();
};

EventMessageChunkerStream.prototype._flush = function(callback) {
    if (this.currentMessageTotalLength) {
        if (this.currentMessageTotalLength === this.currentMessagePendingLength) {
            callback(null, this.currentMessage);
        } else {
            callback(new Error('Truncated event message received.'));
        }
    } else {
        callback();
    }
};

/**
 * @param {number} size Size of the message to be allocated.
 * @api private
 */
EventMessageChunkerStream.prototype.allocateMessage = function(size) {
    if (typeof size !== 'number') {
        throw new Error('Attempted to allocate an event message where size was not a number: ' + size);
    }
    this.currentMessageTotalLength = size;
    this.currentMessagePendingLength = 4;
    this.currentMessage = allocBuffer(size);
    this.currentMessage.writeUInt32BE(size, 0);
};

/**
 * @api private
 */
module.exports = {
    EventMessageChunkerStream: EventMessageChunkerStream
};


/***/ }),

/***/ 3630:
/***/ ((module) => {

/**
 * Takes in a buffer of event messages and splits them into individual messages.
 * @param {Buffer} buffer
 * @api private
 */
function eventMessageChunker(buffer) {
    /** @type Buffer[] */
    var messages = [];
    var offset = 0;

    while (offset < buffer.length) {
        var totalLength = buffer.readInt32BE(offset);

        // create new buffer for individual message (shares memory with original)
        var message = buffer.slice(offset, totalLength + offset);
        // increment offset to it starts at the next message
        offset += totalLength;

        messages.push(message);
    }

    return messages;
}

/**
 * @api private
 */
module.exports = {
    eventMessageChunker: eventMessageChunker
};


/***/ }),

/***/ 3773:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Transform = __nccwpck_require__(2413).Transform;
var parseEvent = __nccwpck_require__(2123).parseEvent;

/** @type {Transform} */
function EventUnmarshallerStream(options) {
    options = options || {};
    // set output to object mode
    options.readableObjectMode = true;
    Transform.call(this, options);
    this._readableState.objectMode = true;

    this.parser = options.parser;
    this.eventStreamModel = options.eventStreamModel;
}

EventUnmarshallerStream.prototype = Object.create(Transform.prototype);

/**
 *
 * @param {Buffer} chunk
 * @param {string} encoding
 * @param {*} callback
 */
EventUnmarshallerStream.prototype._transform = function(chunk, encoding, callback) {
    try {
        var event = parseEvent(this.parser, chunk, this.eventStreamModel);
        this.push(event);
        return callback();
    } catch (err) {
        callback(err);
    }
};

/**
 * @api private
 */
module.exports = {
    EventUnmarshallerStream: EventUnmarshallerStream
};


/***/ }),

/***/ 8583:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(8437).util;
var toBuffer = util.buffer.toBuffer;

/**
 * A lossless representation of a signed, 64-bit integer. Instances of this
 * class may be used in arithmetic expressions as if they were numeric
 * primitives, but the binary representation will be preserved unchanged as the
 * `bytes` property of the object. The bytes should be encoded as big-endian,
 * two's complement integers.
 * @param {Buffer} bytes
 *
 * @api private
 */
function Int64(bytes) {
    if (bytes.length !== 8) {
        throw new Error('Int64 buffers must be exactly 8 bytes');
    }
    if (!util.Buffer.isBuffer(bytes)) bytes = toBuffer(bytes);

    this.bytes = bytes;
}

/**
 * @param {number} number
 * @returns {Int64}
 *
 * @api private
 */
Int64.fromNumber = function(number) {
    if (number > 9223372036854775807 || number < -9223372036854775808) {
        throw new Error(
            number + ' is too large (or, if negative, too small) to represent as an Int64'
        );
    }

    var bytes = new Uint8Array(8);
    for (
        var i = 7, remaining = Math.abs(Math.round(number));
        i > -1 && remaining > 0;
        i--, remaining /= 256
    ) {
        bytes[i] = remaining;
    }

    if (number < 0) {
        negate(bytes);
    }

    return new Int64(bytes);
};

/**
 * @returns {number}
 *
 * @api private
 */
Int64.prototype.valueOf = function() {
    var bytes = this.bytes.slice(0);
    var negative = bytes[0] & 128;
    if (negative) {
        negate(bytes);
    }

    return parseInt(bytes.toString('hex'), 16) * (negative ? -1 : 1);
};

Int64.prototype.toString = function() {
    return String(this.valueOf());
};

/**
 * @param {Buffer} bytes
 *
 * @api private
 */
function negate(bytes) {
    for (var i = 0; i < 8; i++) {
        bytes[i] ^= 0xFF;
    }
    for (var i = 7; i > -1; i--) {
        bytes[i]++;
        if (bytes[i] !== 0) {
            break;
        }
    }
}

/**
 * @api private
 */
module.exports = {
    Int64: Int64
};


/***/ }),

/***/ 2123:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var parseMessage = __nccwpck_require__(866).parseMessage;

/**
 *
 * @param {*} parser
 * @param {Buffer} message
 * @param {*} shape
 * @api private
 */
function parseEvent(parser, message, shape) {
    var parsedMessage = parseMessage(message);

    // check if message is an event or error
    var messageType = parsedMessage.headers[':message-type'];
    if (messageType) {
        if (messageType.value === 'error') {
            throw parseError(parsedMessage);
        } else if (messageType.value !== 'event') {
            // not sure how to parse non-events/non-errors, ignore for now
            return;
        }
    }

    // determine event type
    var eventType = parsedMessage.headers[':event-type'];
    // check that the event type is modeled
    var eventModel = shape.members[eventType.value];
    if (!eventModel) {
        return;
    }

    var result = {};
    // check if an event payload exists
    var eventPayloadMemberName = eventModel.eventPayloadMemberName;
    if (eventPayloadMemberName) {
        var payloadShape = eventModel.members[eventPayloadMemberName];
        // if the shape is binary, return the byte array
        if (payloadShape.type === 'binary') {
            result[eventPayloadMemberName] = parsedMessage.body;
        } else {
            result[eventPayloadMemberName] = parser.parse(parsedMessage.body.toString(), payloadShape);
        }
    }

    // read event headers
    var eventHeaderNames = eventModel.eventHeaderMemberNames;
    for (var i = 0; i < eventHeaderNames.length; i++) {
        var name = eventHeaderNames[i];
        if (parsedMessage.headers[name]) {
            // parse the header!
            result[name] = eventModel.members[name].toType(parsedMessage.headers[name].value);
        }
    }

    var output = {};
    output[eventType.value] = result;
    return output;
}

function parseError(message) {
    var errorCode = message.headers[':error-code'];
    var errorMessage = message.headers[':error-message'];
    var error = new Error(errorMessage.value || errorMessage);
    error.code = error.name = errorCode.value || errorCode;
    return error;
}

/**
 * @api private
 */
module.exports = {
    parseEvent: parseEvent
};


/***/ }),

/***/ 866:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Int64 = __nccwpck_require__(8583).Int64;

var splitMessage = __nccwpck_require__(2225).splitMessage;

var BOOLEAN_TAG = 'boolean';
var BYTE_TAG = 'byte';
var SHORT_TAG = 'short';
var INT_TAG = 'integer';
var LONG_TAG = 'long';
var BINARY_TAG = 'binary';
var STRING_TAG = 'string';
var TIMESTAMP_TAG = 'timestamp';
var UUID_TAG = 'uuid';

/**
 * @api private
 *
 * @param {Buffer} headers
 */
function parseHeaders(headers) {
    var out = {};
    var position = 0;
    while (position < headers.length) {
        var nameLength = headers.readUInt8(position++);
        var name = headers.slice(position, position + nameLength).toString();
        position += nameLength;
        switch (headers.readUInt8(position++)) {
            case 0 /* boolTrue */:
                out[name] = {
                    type: BOOLEAN_TAG,
                    value: true
                };
                break;
            case 1 /* boolFalse */:
                out[name] = {
                    type: BOOLEAN_TAG,
                    value: false
                };
                break;
            case 2 /* byte */:
                out[name] = {
                    type: BYTE_TAG,
                    value: headers.readInt8(position++)
                };
                break;
            case 3 /* short */:
                out[name] = {
                    type: SHORT_TAG,
                    value: headers.readInt16BE(position)
                };
                position += 2;
                break;
            case 4 /* integer */:
                out[name] = {
                    type: INT_TAG,
                    value: headers.readInt32BE(position)
                };
                position += 4;
                break;
            case 5 /* long */:
                out[name] = {
                    type: LONG_TAG,
                    value: new Int64(headers.slice(position, position + 8))
                };
                position += 8;
                break;
            case 6 /* byteArray */:
                var binaryLength = headers.readUInt16BE(position);
                position += 2;
                out[name] = {
                    type: BINARY_TAG,
                    value: headers.slice(position, position + binaryLength)
                };
                position += binaryLength;
                break;
            case 7 /* string */:
                var stringLength = headers.readUInt16BE(position);
                position += 2;
                out[name] = {
                    type: STRING_TAG,
                    value: headers.slice(
                        position,
                        position + stringLength
                    ).toString()
                };
                position += stringLength;
                break;
            case 8 /* timestamp */:
                out[name] = {
                    type: TIMESTAMP_TAG,
                    value: new Date(
                        new Int64(headers.slice(position, position + 8))
                            .valueOf()
                    )
                };
                position += 8;
                break;
            case 9 /* uuid */:
                var uuidChars = headers.slice(position, position + 16)
                    .toString('hex');
                position += 16;
                out[name] = {
                    type: UUID_TAG,
                    value: uuidChars.substr(0, 8) + '-' +
                        uuidChars.substr(8, 4) + '-' +
                        uuidChars.substr(12, 4) + '-' +
                        uuidChars.substr(16, 4) + '-' +
                        uuidChars.substr(20)
                };
                break;
            default:
                throw new Error('Unrecognized header type tag');
        }
    }
    return out;
}

function parseMessage(message) {
    var parsed = splitMessage(message);
    return { headers: parseHeaders(parsed.headers), body: parsed.body };
}

/**
 * @api private
 */
module.exports = {
    parseMessage: parseMessage
};


/***/ }),

/***/ 2225:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(8437).util;
var toBuffer = util.buffer.toBuffer;

// All prelude components are unsigned, 32-bit integers
var PRELUDE_MEMBER_LENGTH = 4;
// The prelude consists of two components
var PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
// Checksums are always CRC32 hashes.
var CHECKSUM_LENGTH = 4;
// Messages must include a full prelude, a prelude checksum, and a message checksum
var MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;

/**
 * @api private
 *
 * @param {Buffer} message
 */
function splitMessage(message) {
    if (!util.Buffer.isBuffer(message)) message = toBuffer(message);

    if (message.length < MINIMUM_MESSAGE_LENGTH) {
        throw new Error('Provided message too short to accommodate event stream message overhead');
    }

    if (message.length !== message.readUInt32BE(0)) {
        throw new Error('Reported message length does not match received message length');
    }

    var expectedPreludeChecksum = message.readUInt32BE(PRELUDE_LENGTH);

    if (
        expectedPreludeChecksum !== util.crypto.crc32(
            message.slice(0, PRELUDE_LENGTH)
        )
    ) {
        throw new Error(
            'The prelude checksum specified in the message (' +
            expectedPreludeChecksum +
            ') does not match the calculated CRC32 checksum.'
        );
    }

    var expectedMessageChecksum = message.readUInt32BE(message.length - CHECKSUM_LENGTH);

    if (
        expectedMessageChecksum !== util.crypto.crc32(
            message.slice(0, message.length - CHECKSUM_LENGTH)
        )
    ) {
        throw new Error(
            'The message checksum did not match the expected value of ' +
                expectedMessageChecksum
        );
    }

    var headersStart = PRELUDE_LENGTH + CHECKSUM_LENGTH;
    var headersEnd = headersStart + message.readUInt32BE(PRELUDE_MEMBER_LENGTH);

    return {
        headers: message.slice(headersStart, headersEnd),
        body: message.slice(headersEnd, message.length - CHECKSUM_LENGTH),
    };
}

/**
 * @api private
 */
module.exports = {
    splitMessage: splitMessage
};


/***/ }),

/***/ 9643:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * What is necessary to create an event stream in node?
 *  - http response stream
 *  - parser
 *  - event stream model
 */

var EventMessageChunkerStream = __nccwpck_require__(8518).EventMessageChunkerStream;
var EventUnmarshallerStream = __nccwpck_require__(3773).EventUnmarshallerStream;

function createEventStream(stream, parser, model) {
    var eventStream = new EventUnmarshallerStream({
        parser: parser,
        eventStreamModel: model
    });

    var eventMessageChunker = new EventMessageChunkerStream();

    stream.pipe(
        eventMessageChunker
    ).pipe(eventStream);

    stream.on('error', function(err) {
        eventMessageChunker.emit('error', err);
    });

    eventMessageChunker.on('error', function(err) {
        eventStream.emit('error', err);
    });

    return eventStream;
}

/**
 * @api private
 */
module.exports = {
    createEventStream: createEventStream
};


/***/ }),

/***/ 4995:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var SequentialExecutor = __nccwpck_require__(5948);
var DISCOVER_ENDPOINT = __nccwpck_require__(5313).discoverEndpoint;
/**
 * The namespace used to register global event listeners for request building
 * and sending.
 */
AWS.EventListeners = {
  /**
   * @!attribute VALIDATE_CREDENTIALS
   *   A request listener that validates whether the request is being
   *   sent with credentials.
   *   Handles the {AWS.Request~validate 'validate' Request event}
   *   @example Sending a request without validating credentials
   *     var listener = AWS.EventListeners.Core.VALIDATE_CREDENTIALS;
   *     request.removeListener('validate', listener);
   *   @readonly
   *   @return [Function]
   * @!attribute VALIDATE_REGION
   *   A request listener that validates whether the region is set
   *   for a request.
   *   Handles the {AWS.Request~validate 'validate' Request event}
   *   @example Sending a request without validating region configuration
   *     var listener = AWS.EventListeners.Core.VALIDATE_REGION;
   *     request.removeListener('validate', listener);
   *   @readonly
   *   @return [Function]
   * @!attribute VALIDATE_PARAMETERS
   *   A request listener that validates input parameters in a request.
   *   Handles the {AWS.Request~validate 'validate' Request event}
   *   @example Sending a request without validating parameters
   *     var listener = AWS.EventListeners.Core.VALIDATE_PARAMETERS;
   *     request.removeListener('validate', listener);
   *   @example Disable parameter validation globally
   *     AWS.EventListeners.Core.removeListener('validate',
   *       AWS.EventListeners.Core.VALIDATE_REGION);
   *   @readonly
   *   @return [Function]
   * @!attribute SEND
   *   A request listener that initiates the HTTP connection for a
   *   request being sent. Handles the {AWS.Request~send 'send' Request event}
   *   @example Replacing the HTTP handler
   *     var listener = AWS.EventListeners.Core.SEND;
   *     request.removeListener('send', listener);
   *     request.on('send', function(response) {
   *       customHandler.send(response);
   *     });
   *   @return [Function]
   *   @readonly
   * @!attribute HTTP_DATA
   *   A request listener that reads data from the HTTP connection in order
   *   to build the response data.
   *   Handles the {AWS.Request~httpData 'httpData' Request event}.
   *   Remove this handler if you are overriding the 'httpData' event and
   *   do not want extra data processing and buffering overhead.
   *   @example Disabling default data processing
   *     var listener = AWS.EventListeners.Core.HTTP_DATA;
   *     request.removeListener('httpData', listener);
   *   @return [Function]
   *   @readonly
   */
  Core: {} /* doc hack */
};

/**
 * @api private
 */
function getOperationAuthtype(req) {
  if (!req.service.api.operations) {
    return '';
  }
  var operation = req.service.api.operations[req.operation];
  return operation ? operation.authtype : '';
}

AWS.EventListeners = {
  Core: new SequentialExecutor().addNamedListeners(function(add, addAsync) {
    addAsync('VALIDATE_CREDENTIALS', 'validate',
        function VALIDATE_CREDENTIALS(req, done) {
      if (!req.service.api.signatureVersion && !req.service.config.signatureVersion) return done(); // none
      req.service.config.getCredentials(function(err) {
        if (err) {
          req.response.error = AWS.util.error(err,
            {code: 'CredentialsError', message: 'Missing credentials in config, if using AWS_CONFIG_FILE, set AWS_SDK_LOAD_CONFIG=1'});
        }
        done();
      });
    });

    add('VALIDATE_REGION', 'validate', function VALIDATE_REGION(req) {
      if (!req.service.isGlobalEndpoint) {
        var dnsHostRegex = new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/);
        if (!req.service.config.region) {
          req.response.error = AWS.util.error(new Error(),
            {code: 'ConfigError', message: 'Missing region in config'});
        } else if (!dnsHostRegex.test(req.service.config.region)) {
          req.response.error = AWS.util.error(new Error(),
            {code: 'ConfigError', message: 'Invalid region in config'});
        }
      }
    });

    add('BUILD_IDEMPOTENCY_TOKENS', 'validate', function BUILD_IDEMPOTENCY_TOKENS(req) {
      if (!req.service.api.operations) {
        return;
      }
      var operation = req.service.api.operations[req.operation];
      if (!operation) {
        return;
      }
      var idempotentMembers = operation.idempotentMembers;
      if (!idempotentMembers.length) {
        return;
      }
      // creates a copy of params so user's param object isn't mutated
      var params = AWS.util.copy(req.params);
      for (var i = 0, iLen = idempotentMembers.length; i < iLen; i++) {
        if (!params[idempotentMembers[i]]) {
          // add the member
          params[idempotentMembers[i]] = AWS.util.uuid.v4();
        }
      }
      req.params = params;
    });

    add('VALIDATE_PARAMETERS', 'validate', function VALIDATE_PARAMETERS(req) {
      if (!req.service.api.operations) {
        return;
      }
      var rules = req.service.api.operations[req.operation].input;
      var validation = req.service.config.paramValidation;
      new AWS.ParamValidator(validation).validate(rules, req.params);
    });

    addAsync('COMPUTE_SHA256', 'afterBuild', function COMPUTE_SHA256(req, done) {
      req.haltHandlersOnError();
      if (!req.service.api.operations) {
        return;
      }
      var operation = req.service.api.operations[req.operation];
      var authtype = operation ? operation.authtype : '';
      if (!req.service.api.signatureVersion && !authtype && !req.service.config.signatureVersion) return done(); // none
      if (req.service.getSignerClass(req) === AWS.Signers.V4) {
        var body = req.httpRequest.body || '';
        if (authtype.indexOf('unsigned-body') >= 0) {
          req.httpRequest.headers['X-Amz-Content-Sha256'] = 'UNSIGNED-PAYLOAD';
          return done();
        }
        AWS.util.computeSha256(body, function(err, sha) {
          if (err) {
            done(err);
          }
          else {
            req.httpRequest.headers['X-Amz-Content-Sha256'] = sha;
            done();
          }
        });
      } else {
        done();
      }
    });

    add('SET_CONTENT_LENGTH', 'afterBuild', function SET_CONTENT_LENGTH(req) {
      var authtype = getOperationAuthtype(req);
      var payloadMember = AWS.util.getRequestPayloadShape(req);
      if (req.httpRequest.headers['Content-Length'] === undefined) {
        try {
          var length = AWS.util.string.byteLength(req.httpRequest.body);
          req.httpRequest.headers['Content-Length'] = length;
        } catch (err) {
          if (payloadMember && payloadMember.isStreaming) {
            if (payloadMember.requiresLength) {
              //streaming payload requires length(s3, glacier)
              throw err;
            } else if (authtype.indexOf('unsigned-body') >= 0) {
              //unbounded streaming payload(lex, mediastore)
              req.httpRequest.headers['Transfer-Encoding'] = 'chunked';
              return;
            } else {
              throw err;
            }
          }
          throw err;
        }
      }
    });

    add('SET_HTTP_HOST', 'afterBuild', function SET_HTTP_HOST(req) {
      req.httpRequest.headers['Host'] = req.httpRequest.endpoint.host;
    });

    add('RESTART', 'restart', function RESTART() {
      var err = this.response.error;
      if (!err || !err.retryable) return;

      this.httpRequest = new AWS.HttpRequest(
        this.service.endpoint,
        this.service.region
      );

      if (this.response.retryCount < this.service.config.maxRetries) {
        this.response.retryCount++;
      } else {
        this.response.error = null;
      }
    });

    var addToHead = true;
    addAsync('DISCOVER_ENDPOINT', 'sign', DISCOVER_ENDPOINT, addToHead);

    addAsync('SIGN', 'sign', function SIGN(req, done) {
      var service = req.service;
      var operations = req.service.api.operations || {};
      var operation = operations[req.operation];
      var authtype = operation ? operation.authtype : '';
      if (!service.api.signatureVersion && !authtype && !service.config.signatureVersion) return done(); // none

      service.config.getCredentials(function (err, credentials) {
        if (err) {
          req.response.error = err;
          return done();
        }

        try {
          var date = service.getSkewCorrectedDate();
          var SignerClass = service.getSignerClass(req);
          var signer = new SignerClass(req.httpRequest,
            service.getSigningName(req),
            {
              signatureCache: service.config.signatureCache,
              operation: operation,
              signatureVersion: service.api.signatureVersion
            });
          signer.setServiceClientId(service._clientId);

          // clear old authorization headers
          delete req.httpRequest.headers['Authorization'];
          delete req.httpRequest.headers['Date'];
          delete req.httpRequest.headers['X-Amz-Date'];

          // add new authorization
          signer.addAuthorization(credentials, date);
          req.signedAt = date;
        } catch (e) {
          req.response.error = e;
        }
        done();
      });
    });

    add('VALIDATE_RESPONSE', 'validateResponse', function VALIDATE_RESPONSE(resp) {
      if (this.service.successfulResponse(resp, this)) {
        resp.data = {};
        resp.error = null;
      } else {
        resp.data = null;
        resp.error = AWS.util.error(new Error(),
          {code: 'UnknownError', message: 'An unknown error occurred.'});
      }
    });

    addAsync('SEND', 'send', function SEND(resp, done) {
      resp.httpResponse._abortCallback = done;
      resp.error = null;
      resp.data = null;

      function callback(httpResp) {
        resp.httpResponse.stream = httpResp;
        var stream = resp.request.httpRequest.stream;
        var service = resp.request.service;
        var api = service.api;
        var operationName = resp.request.operation;
        var operation = api.operations[operationName] || {};

        httpResp.on('headers', function onHeaders(statusCode, headers, statusMessage) {
          resp.request.emit(
            'httpHeaders',
            [statusCode, headers, resp, statusMessage]
          );

          if (!resp.httpResponse.streaming) {
            if (AWS.HttpClient.streamsApiVersion === 2) { // streams2 API check
              // if we detect event streams, we're going to have to
              // return the stream immediately
              if (operation.hasEventOutput && service.successfulResponse(resp)) {
                // skip reading the IncomingStream
                resp.request.emit('httpDone');
                done();
                return;
              }

              httpResp.on('readable', function onReadable() {
                var data = httpResp.read();
                if (data !== null) {
                  resp.request.emit('httpData', [data, resp]);
                }
              });
            } else { // legacy streams API
              httpResp.on('data', function onData(data) {
                resp.request.emit('httpData', [data, resp]);
              });
            }
          }
        });

        httpResp.on('end', function onEnd() {
          if (!stream || !stream.didCallback) {
            if (AWS.HttpClient.streamsApiVersion === 2 && (operation.hasEventOutput && service.successfulResponse(resp))) {
              // don't concatenate response chunks when streaming event stream data when response is successful
              return;
            }
            resp.request.emit('httpDone');
            done();
          }
        });
      }

      function progress(httpResp) {
        httpResp.on('sendProgress', function onSendProgress(value) {
          resp.request.emit('httpUploadProgress', [value, resp]);
        });

        httpResp.on('receiveProgress', function onReceiveProgress(value) {
          resp.request.emit('httpDownloadProgress', [value, resp]);
        });
      }

      function error(err) {
        if (err.code !== 'RequestAbortedError') {
          var errCode = err.code === 'TimeoutError' ? err.code : 'NetworkingError';
          err = AWS.util.error(err, {
            code: errCode,
            region: resp.request.httpRequest.region,
            hostname: resp.request.httpRequest.endpoint.hostname,
            retryable: true
          });
        }
        resp.error = err;
        resp.request.emit('httpError', [resp.error, resp], function() {
          done();
        });
      }

      function executeSend() {
        var http = AWS.HttpClient.getInstance();
        var httpOptions = resp.request.service.config.httpOptions || {};
        try {
          var stream = http.handleRequest(resp.request.httpRequest, httpOptions,
                                          callback, error);
          progress(stream);
        } catch (err) {
          error(err);
        }
      }
      var timeDiff = (resp.request.service.getSkewCorrectedDate() - this.signedAt) / 1000;
      if (timeDiff >= 60 * 10) { // if we signed 10min ago, re-sign
        this.emit('sign', [this], function(err) {
          if (err) done(err);
          else executeSend();
        });
      } else {
        executeSend();
      }
    });

    add('HTTP_HEADERS', 'httpHeaders',
        function HTTP_HEADERS(statusCode, headers, resp, statusMessage) {
      resp.httpResponse.statusCode = statusCode;
      resp.httpResponse.statusMessage = statusMessage;
      resp.httpResponse.headers = headers;
      resp.httpResponse.body = AWS.util.buffer.toBuffer('');
      resp.httpResponse.buffers = [];
      resp.httpResponse.numBytes = 0;
      var dateHeader = headers.date || headers.Date;
      var service = resp.request.service;
      if (dateHeader) {
        var serverTime = Date.parse(dateHeader);
        if (service.config.correctClockSkew
            && service.isClockSkewed(serverTime)) {
          service.applyClockOffset(serverTime);
        }
      }
    });

    add('HTTP_DATA', 'httpData', function HTTP_DATA(chunk, resp) {
      if (chunk) {
        if (AWS.util.isNode()) {
          resp.httpResponse.numBytes += chunk.length;

          var total = resp.httpResponse.headers['content-length'];
          var progress = { loaded: resp.httpResponse.numBytes, total: total };
          resp.request.emit('httpDownloadProgress', [progress, resp]);
        }

        resp.httpResponse.buffers.push(AWS.util.buffer.toBuffer(chunk));
      }
    });

    add('HTTP_DONE', 'httpDone', function HTTP_DONE(resp) {
      // convert buffers array into single buffer
      if (resp.httpResponse.buffers && resp.httpResponse.buffers.length > 0) {
        var body = AWS.util.buffer.concat(resp.httpResponse.buffers);
        resp.httpResponse.body = body;
      }
      delete resp.httpResponse.numBytes;
      delete resp.httpResponse.buffers;
    });

    add('FINALIZE_ERROR', 'retry', function FINALIZE_ERROR(resp) {
      if (resp.httpResponse.statusCode) {
        resp.error.statusCode = resp.httpResponse.statusCode;
        if (resp.error.retryable === undefined) {
          resp.error.retryable = this.service.retryableError(resp.error, this);
        }
      }
    });

    add('INVALIDATE_CREDENTIALS', 'retry', function INVALIDATE_CREDENTIALS(resp) {
      if (!resp.error) return;
      switch (resp.error.code) {
        case 'RequestExpired': // EC2 only
        case 'ExpiredTokenException':
        case 'ExpiredToken':
          resp.error.retryable = true;
          resp.request.service.config.credentials.expired = true;
      }
    });

    add('EXPIRED_SIGNATURE', 'retry', function EXPIRED_SIGNATURE(resp) {
      var err = resp.error;
      if (!err) return;
      if (typeof err.code === 'string' && typeof err.message === 'string') {
        if (err.code.match(/Signature/) && err.message.match(/expired/)) {
          resp.error.retryable = true;
        }
      }
    });

    add('CLOCK_SKEWED', 'retry', function CLOCK_SKEWED(resp) {
      if (!resp.error) return;
      if (this.service.clockSkewError(resp.error)
          && this.service.config.correctClockSkew) {
        resp.error.retryable = true;
      }
    });

    add('REDIRECT', 'retry', function REDIRECT(resp) {
      if (resp.error && resp.error.statusCode >= 300 &&
          resp.error.statusCode < 400 && resp.httpResponse.headers['location']) {
        this.httpRequest.endpoint =
          new AWS.Endpoint(resp.httpResponse.headers['location']);
        this.httpRequest.headers['Host'] = this.httpRequest.endpoint.host;
        resp.error.redirect = true;
        resp.error.retryable = true;
      }
    });

    add('RETRY_CHECK', 'retry', function RETRY_CHECK(resp) {
      if (resp.error) {
        if (resp.error.redirect && resp.redirectCount < resp.maxRedirects) {
          resp.error.retryDelay = 0;
        } else if (resp.retryCount < resp.maxRetries) {
          resp.error.retryDelay = this.service.retryDelays(resp.retryCount, resp.error) || 0;
        }
      }
    });

    addAsync('RESET_RETRY_STATE', 'afterRetry', function RESET_RETRY_STATE(resp, done) {
      var delay, willRetry = false;

      if (resp.error) {
        delay = resp.error.retryDelay || 0;
        if (resp.error.retryable && resp.retryCount < resp.maxRetries) {
          resp.retryCount++;
          willRetry = true;
        } else if (resp.error.redirect && resp.redirectCount < resp.maxRedirects) {
          resp.redirectCount++;
          willRetry = true;
        }
      }

      // delay < 0 is a signal from customBackoff to skip retries
      if (willRetry && delay >= 0) {
        resp.error = null;
        setTimeout(done, delay);
      } else {
        done();
      }
    });
  }),

  CorePost: new SequentialExecutor().addNamedListeners(function(add) {
    add('EXTRACT_REQUEST_ID', 'extractData', AWS.util.extractRequestId);
    add('EXTRACT_REQUEST_ID', 'extractError', AWS.util.extractRequestId);

    add('ENOTFOUND_ERROR', 'httpError', function ENOTFOUND_ERROR(err) {
      function isDNSError(err) {
        return err.errno === 'ENOTFOUND' ||
          typeof err.errno === 'number' &&
          typeof AWS.util.getSystemErrorName === 'function' &&
          ['EAI_NONAME', 'EAI_NODATA'].indexOf(AWS.util.getSystemErrorName(err.errno) >= 0);
      }
      if (err.code === 'NetworkingError' && isDNSError(err)) {
        var message = 'Inaccessible host: `' + err.hostname +
          '\'. This service may not be available in the `' + err.region +
          '\' region.';
        this.response.error = AWS.util.error(new Error(message), {
          code: 'UnknownEndpoint',
          region: err.region,
          hostname: err.hostname,
          retryable: true,
          originalError: err
        });
      }
    });
  }),

  Logger: new SequentialExecutor().addNamedListeners(function(add) {
    add('LOG_REQUEST', 'complete', function LOG_REQUEST(resp) {
      var req = resp.request;
      var logger = req.service.config.logger;
      if (!logger) return;
      function filterSensitiveLog(inputShape, shape) {
        if (!shape) {
          return shape;
        }
        if (inputShape.isSensitive) {
          return '***SensitiveInformation***';
        }
        switch (inputShape.type) {
          case 'structure':
            var struct = {};
            AWS.util.each(shape, function(subShapeName, subShape) {
              if (Object.prototype.hasOwnProperty.call(inputShape.members, subShapeName)) {
                struct[subShapeName] = filterSensitiveLog(inputShape.members[subShapeName], subShape);
              } else {
                struct[subShapeName] = subShape;
              }
            });
            return struct;
          case 'list':
            var list = [];
            AWS.util.arrayEach(shape, function(subShape, index) {
              list.push(filterSensitiveLog(inputShape.member, subShape));
            });
            return list;
          case 'map':
            var map = {};
            AWS.util.each(shape, function(key, value) {
              map[key] = filterSensitiveLog(inputShape.value, value);
            });
            return map;
          default:
            return shape;
        }
      }

      function buildMessage() {
        var time = resp.request.service.getSkewCorrectedDate().getTime();
        var delta = (time - req.startTime.getTime()) / 1000;
        var ansi = logger.isTTY ? true : false;
        var status = resp.httpResponse.statusCode;
        var censoredParams = req.params;
        if (
          req.service.api.operations &&
              req.service.api.operations[req.operation] &&
              req.service.api.operations[req.operation].input
        ) {
          var inputShape = req.service.api.operations[req.operation].input;
          censoredParams = filterSensitiveLog(inputShape, req.params);
        }
        var params = __nccwpck_require__(1669).inspect(censoredParams, true, null);
        var message = '';
        if (ansi) message += '\x1B[33m';
        message += '[AWS ' + req.service.serviceIdentifier + ' ' + status;
        message += ' ' + delta.toString() + 's ' + resp.retryCount + ' retries]';
        if (ansi) message += '\x1B[0;1m';
        message += ' ' + AWS.util.string.lowerFirst(req.operation);
        message += '(' + params + ')';
        if (ansi) message += '\x1B[0m';
        return message;
      }

      var line = buildMessage();
      if (typeof logger.log === 'function') {
        logger.log(line);
      } else if (typeof logger.write === 'function') {
        logger.write(line + '\n');
      }
    });
  }),

  Json: new SequentialExecutor().addNamedListeners(function(add) {
    var svc = __nccwpck_require__(83);
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  Rest: new SequentialExecutor().addNamedListeners(function(add) {
    var svc = __nccwpck_require__(8200);
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  RestJson: new SequentialExecutor().addNamedListeners(function(add) {
    var svc = __nccwpck_require__(5883);
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  RestXml: new SequentialExecutor().addNamedListeners(function(add) {
    var svc = __nccwpck_require__(5143);
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  }),

  Query: new SequentialExecutor().addNamedListeners(function(add) {
    var svc = __nccwpck_require__(761);
    add('BUILD', 'build', svc.buildRequest);
    add('EXTRACT_DATA', 'extractData', svc.extractData);
    add('EXTRACT_ERROR', 'extractError', svc.extractError);
  })
};


/***/ }),

/***/ 1556:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var inherit = AWS.util.inherit;

/**
 * The endpoint that a service will talk to, for example,
 * `'https://ec2.ap-southeast-1.amazonaws.com'`. If
 * you need to override an endpoint for a service, you can
 * set the endpoint on a service by passing the endpoint
 * object with the `endpoint` option key:
 *
 * ```javascript
 * var ep = new AWS.Endpoint('awsproxy.example.com');
 * var s3 = new AWS.S3({endpoint: ep});
 * s3.service.endpoint.hostname == 'awsproxy.example.com'
 * ```
 *
 * Note that if you do not specify a protocol, the protocol will
 * be selected based on your current {AWS.config} configuration.
 *
 * @!attribute protocol
 *   @return [String] the protocol (http or https) of the endpoint
 *     URL
 * @!attribute hostname
 *   @return [String] the host portion of the endpoint, e.g.,
 *     example.com
 * @!attribute host
 *   @return [String] the host portion of the endpoint including
 *     the port, e.g., example.com:80
 * @!attribute port
 *   @return [Integer] the port of the endpoint
 * @!attribute href
 *   @return [String] the full URL of the endpoint
 */
AWS.Endpoint = inherit({

  /**
   * @overload Endpoint(endpoint)
   *   Constructs a new endpoint given an endpoint URL. If the
   *   URL omits a protocol (http or https), the default protocol
   *   set in the global {AWS.config} will be used.
   *   @param endpoint [String] the URL to construct an endpoint from
   */
  constructor: function Endpoint(endpoint, config) {
    AWS.util.hideProperties(this, ['slashes', 'auth', 'hash', 'search', 'query']);

    if (typeof endpoint === 'undefined' || endpoint === null) {
      throw new Error('Invalid endpoint: ' + endpoint);
    } else if (typeof endpoint !== 'string') {
      return AWS.util.copy(endpoint);
    }

    if (!endpoint.match(/^http/)) {
      var useSSL = config && config.sslEnabled !== undefined ?
        config.sslEnabled : AWS.config.sslEnabled;
      endpoint = (useSSL ? 'https' : 'http') + '://' + endpoint;
    }

    AWS.util.update(this, AWS.util.urlParse(endpoint));

    // Ensure the port property is set as an integer
    if (this.port) {
      this.port = parseInt(this.port, 10);
    } else {
      this.port = this.protocol === 'https:' ? 443 : 80;
    }
  }

});

/**
 * The low level HTTP request object, encapsulating all HTTP header
 * and body data sent by a service request.
 *
 * @!attribute method
 *   @return [String] the HTTP method of the request
 * @!attribute path
 *   @return [String] the path portion of the URI, e.g.,
 *     "/list/?start=5&num=10"
 * @!attribute headers
 *   @return [map<String,String>]
 *     a map of header keys and their respective values
 * @!attribute body
 *   @return [String] the request body payload
 * @!attribute endpoint
 *   @return [AWS.Endpoint] the endpoint for the request
 * @!attribute region
 *   @api private
 *   @return [String] the region, for signing purposes only.
 */
AWS.HttpRequest = inherit({

  /**
   * @api private
   */
  constructor: function HttpRequest(endpoint, region) {
    endpoint = new AWS.Endpoint(endpoint);
    this.method = 'POST';
    this.path = endpoint.path || '/';
    this.headers = {};
    this.body = '';
    this.endpoint = endpoint;
    this.region = region;
    this._userAgent = '';
    this.setUserAgent();
  },

  /**
   * @api private
   */
  setUserAgent: function setUserAgent() {
    this._userAgent = this.headers[this.getUserAgentHeaderName()] = AWS.util.userAgent();
  },

  getUserAgentHeaderName: function getUserAgentHeaderName() {
    var prefix = AWS.util.isBrowser() ? 'X-Amz-' : '';
    return prefix + 'User-Agent';
  },

  /**
   * @api private
   */
  appendToUserAgent: function appendToUserAgent(agentPartial) {
    if (typeof agentPartial === 'string' && agentPartial) {
      this._userAgent += ' ' + agentPartial;
    }
    this.headers[this.getUserAgentHeaderName()] = this._userAgent;
  },

  /**
   * @api private
   */
  getUserAgent: function getUserAgent() {
    return this._userAgent;
  },

  /**
   * @return [String] the part of the {path} excluding the
   *   query string
   */
  pathname: function pathname() {
    return this.path.split('?', 1)[0];
  },

  /**
   * @return [String] the query string portion of the {path}
   */
  search: function search() {
    var query = this.path.split('?', 2)[1];
    if (query) {
      query = AWS.util.queryStringParse(query);
      return AWS.util.queryParamsToString(query);
    }
    return '';
  },

  /**
   * @api private
   * update httpRequest endpoint with endpoint string
   */
  updateEndpoint: function updateEndpoint(endpointStr) {
    var newEndpoint = new AWS.Endpoint(endpointStr);
    this.endpoint = newEndpoint;
    this.path = newEndpoint.path || '/';
    if (this.headers['Host']) {
      this.headers['Host'] = newEndpoint.host;
    }
  }
});

/**
 * The low level HTTP response object, encapsulating all HTTP header
 * and body data returned from the request.
 *
 * @!attribute statusCode
 *   @return [Integer] the HTTP status code of the response (e.g., 200, 404)
 * @!attribute headers
 *   @return [map<String,String>]
 *      a map of response header keys and their respective values
 * @!attribute body
 *   @return [String] the response body payload
 * @!attribute [r] streaming
 *   @return [Boolean] whether this response is being streamed at a low-level.
 *     Defaults to `false` (buffered reads). Do not modify this manually, use
 *     {createUnbufferedStream} to convert the stream to unbuffered mode
 *     instead.
 */
AWS.HttpResponse = inherit({

  /**
   * @api private
   */
  constructor: function HttpResponse() {
    this.statusCode = undefined;
    this.headers = {};
    this.body = undefined;
    this.streaming = false;
    this.stream = null;
  },

  /**
   * Disables buffering on the HTTP response and returns the stream for reading.
   * @return [Stream, XMLHttpRequest, null] the underlying stream object.
   *   Use this object to directly read data off of the stream.
   * @note This object is only available after the {AWS.Request~httpHeaders}
   *   event has fired. This method must be called prior to
   *   {AWS.Request~httpData}.
   * @example Taking control of a stream
   *   request.on('httpHeaders', function(statusCode, headers) {
   *     if (statusCode < 300) {
   *       if (headers.etag === 'xyz') {
   *         // pipe the stream, disabling buffering
   *         var stream = this.response.httpResponse.createUnbufferedStream();
   *         stream.pipe(process.stdout);
   *       } else { // abort this request and set a better error message
   *         this.abort();
   *         this.response.error = new Error('Invalid ETag');
   *       }
   *     }
   *   }).send(console.log);
   */
  createUnbufferedStream: function createUnbufferedStream() {
    this.streaming = true;
    return this.stream;
  }
});


AWS.HttpClient = inherit({});

/**
 * @api private
 */
AWS.HttpClient.getInstance = function getInstance() {
  if (this.singleton === undefined) {
    this.singleton = new this();
  }
  return this.singleton;
};


/***/ }),

/***/ 2310:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var Stream = AWS.util.stream.Stream;
var TransformStream = AWS.util.stream.Transform;
var ReadableStream = AWS.util.stream.Readable;
__nccwpck_require__(1556);
var CONNECTION_REUSE_ENV_NAME = 'AWS_NODEJS_CONNECTION_REUSE_ENABLED';

/**
 * @api private
 */
AWS.NodeHttpClient = AWS.util.inherit({
  handleRequest: function handleRequest(httpRequest, httpOptions, callback, errCallback) {
    var self = this;
    var endpoint = httpRequest.endpoint;
    var pathPrefix = '';
    if (!httpOptions) httpOptions = {};
    if (httpOptions.proxy) {
      pathPrefix = endpoint.protocol + '//' + endpoint.hostname;
      if (endpoint.port !== 80 && endpoint.port !== 443) {
        pathPrefix += ':' + endpoint.port;
      }
      endpoint = new AWS.Endpoint(httpOptions.proxy);
    }

    var useSSL = endpoint.protocol === 'https:';
    var http = useSSL ? __nccwpck_require__(7211) : __nccwpck_require__(8605);
    var options = {
      host: endpoint.hostname,
      port: endpoint.port,
      method: httpRequest.method,
      headers: httpRequest.headers,
      path: pathPrefix + httpRequest.path
    };

    if (!httpOptions.agent) {
      options.agent = this.getAgent(useSSL, {
        keepAlive: process.env[CONNECTION_REUSE_ENV_NAME] === '1' ? true : false
      });
    }

    AWS.util.update(options, httpOptions);
    delete options.proxy; // proxy isn't an HTTP option
    delete options.timeout; // timeout isn't an HTTP option

    var stream = http.request(options, function (httpResp) {
      if (stream.didCallback) return;

      callback(httpResp);
      httpResp.emit(
        'headers',
        httpResp.statusCode,
        httpResp.headers,
        httpResp.statusMessage
      );
    });
    httpRequest.stream = stream; // attach stream to httpRequest
    stream.didCallback = false;

    // connection timeout support
    if (httpOptions.connectTimeout) {
      var connectTimeoutId;
      stream.on('socket', function(socket) {
        if (socket.connecting) {
          connectTimeoutId = setTimeout(function connectTimeout() {
            if (stream.didCallback) return; stream.didCallback = true;

            stream.abort();
            errCallback(AWS.util.error(
              new Error('Socket timed out without establishing a connection'),
              {code: 'TimeoutError'}
            ));
          }, httpOptions.connectTimeout);
          socket.on('connect', function() {
            clearTimeout(connectTimeoutId);
            connectTimeoutId = null;
          });
        }
      });
    }

    // timeout support
    stream.setTimeout(httpOptions.timeout || 0, function() {
      if (stream.didCallback) return; stream.didCallback = true;

      var msg = 'Connection timed out after ' + httpOptions.timeout + 'ms';
      errCallback(AWS.util.error(new Error(msg), {code: 'TimeoutError'}));
      stream.abort();
    });

    stream.on('error', function() {
      if (connectTimeoutId) {
        clearTimeout(connectTimeoutId);
        connectTimeoutId = null;
      }
      if (stream.didCallback) return; stream.didCallback = true;
      errCallback.apply(stream, arguments);
    });

    var expect = httpRequest.headers.Expect || httpRequest.headers.expect;
    if (expect === '100-continue') {
      stream.once('continue', function() {
        self.writeBody(stream, httpRequest);
      });
    } else {
      this.writeBody(stream, httpRequest);
    }

    return stream;
  },

  writeBody: function writeBody(stream, httpRequest) {
    var body = httpRequest.body;
    var totalBytes = parseInt(httpRequest.headers['Content-Length'], 10);

    if (body instanceof Stream) {
      // For progress support of streaming content -
      // pipe the data through a transform stream to emit 'sendProgress' events
      var progressStream = this.progressStream(stream, totalBytes);
      if (progressStream) {
        body.pipe(progressStream).pipe(stream);
      } else {
        body.pipe(stream);
      }
    } else if (body) {
      // The provided body is a buffer/string and is already fully available in memory -
      // For performance it's best to send it as a whole by calling stream.end(body),
      // Callers expect a 'sendProgress' event which is best emitted once
      // the http request stream has been fully written and all data flushed.
      // The use of totalBytes is important over body.length for strings where
      // length is char length and not byte length.
      stream.once('finish', function() {
        stream.emit('sendProgress', {
          loaded: totalBytes,
          total: totalBytes
        });
      });
      stream.end(body);
    } else {
      // no request body
      stream.end();
    }
  },

  /**
   * Create the https.Agent or http.Agent according to the request schema.
   */
  getAgent: function getAgent(useSSL, agentOptions) {
    var http = useSSL ? __nccwpck_require__(7211) : __nccwpck_require__(8605);
    if (useSSL) {
      if (!AWS.NodeHttpClient.sslAgent) {
        AWS.NodeHttpClient.sslAgent = new http.Agent(AWS.util.merge({
          rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0' ? false : true
        }, agentOptions || {}));
        AWS.NodeHttpClient.sslAgent.setMaxListeners(0);

        // delegate maxSockets to globalAgent, set a default limit of 50 if current value is Infinity.
        // Users can bypass this default by supplying their own Agent as part of SDK configuration.
        Object.defineProperty(AWS.NodeHttpClient.sslAgent, 'maxSockets', {
          enumerable: true,
          get: function() {
            var defaultMaxSockets = 50;
            var globalAgent = http.globalAgent;
            if (globalAgent && globalAgent.maxSockets !== Infinity && typeof globalAgent.maxSockets === 'number') {
              return globalAgent.maxSockets;
            }
            return defaultMaxSockets;
          }
        });
      }
      return AWS.NodeHttpClient.sslAgent;
    } else {
      if (!AWS.NodeHttpClient.agent) {
        AWS.NodeHttpClient.agent = new http.Agent(agentOptions);
      }
      return AWS.NodeHttpClient.agent;
    }
  },

  progressStream: function progressStream(stream, totalBytes) {
    if (typeof TransformStream === 'undefined') {
      // for node 0.8 there is no streaming progress
      return;
    }
    var loadedBytes = 0;
    var reporter = new TransformStream();
    reporter._transform = function(chunk, encoding, callback) {
      if (chunk) {
        loadedBytes += chunk.length;
        stream.emit('sendProgress', {
          loaded: loadedBytes,
          total: totalBytes
        });
      }
      callback(null, chunk);
    };
    return reporter;
  },

  emitter: null
});

/**
 * @!ignore
 */

/**
 * @api private
 */
AWS.HttpClient.prototype = AWS.NodeHttpClient.prototype;

/**
 * @api private
 */
AWS.HttpClient.streamsApiVersion = ReadableStream ? 2 : 1;


/***/ }),

/***/ 7495:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(7985);

function JsonBuilder() { }

JsonBuilder.prototype.build = function(value, shape) {
  return JSON.stringify(translate(value, shape));
};

function translate(value, shape) {
  if (!shape || value === undefined || value === null) return undefined;

  switch (shape.type) {
    case 'structure': return translateStructure(value, shape);
    case 'map': return translateMap(value, shape);
    case 'list': return translateList(value, shape);
    default: return translateScalar(value, shape);
  }
}

function translateStructure(structure, shape) {
  var struct = {};
  util.each(structure, function(name, value) {
    var memberShape = shape.members[name];
    if (memberShape) {
      if (memberShape.location !== 'body') return;
      var locationName = memberShape.isLocationName ? memberShape.name : name;
      var result = translate(value, memberShape);
      if (result !== undefined) struct[locationName] = result;
    }
  });
  return struct;
}

function translateList(list, shape) {
  var out = [];
  util.arrayEach(list, function(value) {
    var result = translate(value, shape.member);
    if (result !== undefined) out.push(result);
  });
  return out;
}

function translateMap(map, shape) {
  var out = {};
  util.each(map, function(key, value) {
    var result = translate(value, shape.value);
    if (result !== undefined) out[key] = result;
  });
  return out;
}

function translateScalar(value, shape) {
  return shape.toWireFormat(value);
}

/**
 * @api private
 */
module.exports = JsonBuilder;


/***/ }),

/***/ 5474:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(7985);

function JsonParser() { }

JsonParser.prototype.parse = function(value, shape) {
  return translate(JSON.parse(value), shape);
};

function translate(value, shape) {
  if (!shape || value === undefined) return undefined;

  switch (shape.type) {
    case 'structure': return translateStructure(value, shape);
    case 'map': return translateMap(value, shape);
    case 'list': return translateList(value, shape);
    default: return translateScalar(value, shape);
  }
}

function translateStructure(structure, shape) {
  if (structure == null) return undefined;

  var struct = {};
  var shapeMembers = shape.members;
  util.each(shapeMembers, function(name, memberShape) {
    var locationName = memberShape.isLocationName ? memberShape.name : name;
    if (Object.prototype.hasOwnProperty.call(structure, locationName)) {
      var value = structure[locationName];
      var result = translate(value, memberShape);
      if (result !== undefined) struct[name] = result;
    }
  });
  return struct;
}

function translateList(list, shape) {
  if (list == null) return undefined;

  var out = [];
  util.arrayEach(list, function(value) {
    var result = translate(value, shape.member);
    if (result === undefined) out.push(null);
    else out.push(result);
  });
  return out;
}

function translateMap(map, shape) {
  if (map == null) return undefined;

  var out = {};
  util.each(map, function(key, value) {
    var result = translate(value, shape.value);
    if (result === undefined) out[key] = null;
    else out[key] = result;
  });
  return out;
}

function translateScalar(value, shape) {
  return shape.toType(value);
}

/**
 * @api private
 */
module.exports = JsonParser;


/***/ }),

/***/ 5768:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
__nccwpck_require__(1556);
var inherit = AWS.util.inherit;

/**
 * Represents a metadata service available on EC2 instances. Using the
 * {request} method, you can receieve metadata about any available resource
 * on the metadata service.
 *
 * You can disable the use of the IMDS by setting the AWS_EC2_METADATA_DISABLED
 * environment variable to a truthy value.
 *
 * @!attribute [r] httpOptions
 *   @return [map] a map of options to pass to the underlying HTTP request:
 *
 *     * **timeout** (Number) &mdash; a timeout value in milliseconds to wait
 *       before aborting the connection. Set to 0 for no timeout.
 *
 * @!macro nobrowser
 */
AWS.MetadataService = inherit({
  /**
   * @return [String] the hostname of the instance metadata service
   */
  host: '169.254.169.254',

  /**
   * @!ignore
   */

  /**
   * Default HTTP options. By default, the metadata service is set to not
   * timeout on long requests. This means that on non-EC2 machines, this
   * request will never return. If you are calling this operation from an
   * environment that may not always run on EC2, set a `timeout` value so
   * the SDK will abort the request after a given number of milliseconds.
   */
  httpOptions: { timeout: 0 },

  /**
   * when enabled, metadata service will not fetch token
   */
  disableFetchToken: false,

  /**
   * Creates a new MetadataService object with a given set of options.
   *
   * @option options host [String] the hostname of the instance metadata
   *   service
   * @option options httpOptions [map] a map of options to pass to the
   *   underlying HTTP request:
   *
   *   * **timeout** (Number) &mdash; a timeout value in milliseconds to wait
   *     before aborting the connection. Set to 0 for no timeout.
   * @option options maxRetries [Integer] the maximum number of retries to
   *   perform for timeout errors
   * @option options retryDelayOptions [map] A set of options to configure the
   *   retry delay on retryable errors. See AWS.Config for details.
   */
  constructor: function MetadataService(options) {
    AWS.util.update(this, options);
  },

  /**
   * Sends a request to the instance metadata service for a given resource.
   *
   * @param path [String] the path of the resource to get
   *
   * @param options [map] an optional map used to make request
   *
   *   * **method** (String) &mdash; HTTP request method
   *
   *   * **headers** (map<String,String>) &mdash; a map of response header keys and their respective values
   *
   * @callback callback function(err, data)
   *   Called when a response is available from the service.
   *   @param err [Error, null] if an error occurred, this value will be set
   *   @param data [String, null] if the request was successful, the body of
   *     the response
   */
  request: function request(path, options, callback) {
    if (arguments.length === 2) {
      callback = options;
      options = {};
    }

    if (process.env[AWS.util.imdsDisabledEnv]) {
      callback(new Error('EC2 Instance Metadata Service access disabled'));
      return;
    }

    path = path || '/';
    var httpRequest = new AWS.HttpRequest('http://' + this.host + path);
    httpRequest.method = options.method || 'GET';
    if (options.headers) {
      httpRequest.headers = options.headers;
    }
    AWS.util.handleRequestWithRetries(httpRequest, this, callback);
  },

  /**
  * @api private
  */
  loadCredentialsCallbacks: [],

  /**
   * Fetches metadata token used for getting credentials
   *
   * @api private
   * @callback callback function(err, token)
   *   Called when token is loaded from the resource
   */
  fetchMetadataToken: function fetchMetadataToken(callback) {
    var self = this;
    var tokenFetchPath = '/latest/api/token';
    self.request(
      tokenFetchPath,
      {
        'method': 'PUT',
        'headers': {
          'x-aws-ec2-metadata-token-ttl-seconds': '21600'
        }
      },
      callback
    );
  },

  /**
   * Fetches credentials
   *
   * @api private
   * @callback cb function(err, creds)
   *   Called when credentials are loaded from the resource
   */
  fetchCredentials: function fetchCredentials(options, cb) {
    var self = this;
    var basePath = '/latest/meta-data/iam/security-credentials/';

    self.request(basePath, options, function (err, roleName) {
      if (err) {
        self.disableFetchToken = !(err.statusCode === 401);
        cb(AWS.util.error(
          err,
          {
            message: 'EC2 Metadata roleName request returned error'
          }
        ));
        return;
      }
      roleName = roleName.split('\n')[0]; // grab first (and only) role
      self.request(basePath + roleName, options, function (credErr, credData) {
        if (credErr) {
          self.disableFetchToken = !(credErr.statusCode === 401);
          cb(AWS.util.error(
            credErr,
            {
              message: 'EC2 Metadata creds request returned error'
            }
          ));
          return;
        }
        try {
          var credentials = JSON.parse(credData);
          cb(null, credentials);
        } catch (parseError) {
          cb(parseError);
        }
      });
    });
  },

  /**
   * Loads a set of credentials stored in the instance metadata service
   *
   * @api private
   * @callback callback function(err, credentials)
   *   Called when credentials are loaded from the resource
   *   @param err [Error] if an error occurred, this value will be set
   *   @param credentials [Object] the raw JSON object containing all
   *     metadata from the credentials resource
   */
  loadCredentials: function loadCredentials(callback) {
    var self = this;
    self.loadCredentialsCallbacks.push(callback);
    if (self.loadCredentialsCallbacks.length > 1) { return; }

    function callbacks(err, creds) {
      var cb;
      while ((cb = self.loadCredentialsCallbacks.shift()) !== undefined) {
        cb(err, creds);
      }
    }

    if (self.disableFetchToken) {
      self.fetchCredentials({}, callbacks);
    } else {
      self.fetchMetadataToken(function(tokenError, token) {
        if (tokenError) {
          if (tokenError.code === 'TimeoutError') {
            self.disableFetchToken = true;
          } else if (tokenError.retryable === true) {
            callbacks(AWS.util.error(
              tokenError,
              {
                message: 'EC2 Metadata token request returned error'
              }
            ));
            return;
          } else if (tokenError.statusCode === 400) {
            callbacks(AWS.util.error(
              tokenError,
              {
                message: 'EC2 Metadata token request returned 400'
              }
            ));
            return;
          }
        }
        var options = {};
        if (token) {
          options.headers = {
            'x-aws-ec2-metadata-token': token
          };
        }
        self.fetchCredentials(options, callbacks);
      });

    }
  }
});

/**
 * @api private
 */
module.exports = AWS.MetadataService;


/***/ }),

/***/ 7657:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Collection = __nccwpck_require__(1965);
var Operation = __nccwpck_require__(8083);
var Shape = __nccwpck_require__(1349);
var Paginator = __nccwpck_require__(5938);
var ResourceWaiter = __nccwpck_require__(1368);
var metadata = __nccwpck_require__(9497);

var util = __nccwpck_require__(7985);
var property = util.property;
var memoizedProperty = util.memoizedProperty;

function Api(api, options) {
  var self = this;
  api = api || {};
  options = options || {};
  options.api = this;

  api.metadata = api.metadata || {};

  var serviceIdentifier = options.serviceIdentifier;
  delete options.serviceIdentifier;

  property(this, 'isApi', true, false);
  property(this, 'apiVersion', api.metadata.apiVersion);
  property(this, 'endpointPrefix', api.metadata.endpointPrefix);
  property(this, 'signingName', api.metadata.signingName);
  property(this, 'globalEndpoint', api.metadata.globalEndpoint);
  property(this, 'signatureVersion', api.metadata.signatureVersion);
  property(this, 'jsonVersion', api.metadata.jsonVersion);
  property(this, 'targetPrefix', api.metadata.targetPrefix);
  property(this, 'protocol', api.metadata.protocol);
  property(this, 'timestampFormat', api.metadata.timestampFormat);
  property(this, 'xmlNamespaceUri', api.metadata.xmlNamespace);
  property(this, 'abbreviation', api.metadata.serviceAbbreviation);
  property(this, 'fullName', api.metadata.serviceFullName);
  property(this, 'serviceId', api.metadata.serviceId);
  if (serviceIdentifier && metadata[serviceIdentifier]) {
      property(this, 'xmlNoDefaultLists', metadata[serviceIdentifier].xmlNoDefaultLists, false);
  }

  memoizedProperty(this, 'className', function() {
    var name = api.metadata.serviceAbbreviation || api.metadata.serviceFullName;
    if (!name) return null;

    name = name.replace(/^Amazon|AWS\s*|\(.*|\s+|\W+/g, '');
    if (name === 'ElasticLoadBalancing') name = 'ELB';
    return name;
  });

  function addEndpointOperation(name, operation) {
    if (operation.endpointoperation === true) {
      property(self, 'endpointOperation', util.string.lowerFirst(name));
    }
    if (operation.endpointdiscovery && !self.hasRequiredEndpointDiscovery) {
      property(
        self,
        'hasRequiredEndpointDiscovery',
        operation.endpointdiscovery.required === true
      );
    }
  }

  property(this, 'operations', new Collection(api.operations, options, function(name, operation) {
    return new Operation(name, operation, options);
  }, util.string.lowerFirst, addEndpointOperation));

  property(this, 'shapes', new Collection(api.shapes, options, function(name, shape) {
    return Shape.create(shape, options);
  }));

  property(this, 'paginators', new Collection(api.paginators, options, function(name, paginator) {
    return new Paginator(name, paginator, options);
  }));

  property(this, 'waiters', new Collection(api.waiters, options, function(name, waiter) {
    return new ResourceWaiter(name, waiter, options);
  }, util.string.lowerFirst));

  if (options.documentation) {
    property(this, 'documentation', api.documentation);
    property(this, 'documentationUrl', api.documentationUrl);
  }
}

/**
 * @api private
 */
module.exports = Api;


/***/ }),

/***/ 1965:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var memoizedProperty = __nccwpck_require__(7985).memoizedProperty;

function memoize(name, value, factory, nameTr) {
  memoizedProperty(this, nameTr(name), function() {
    return factory(name, value);
  });
}

function Collection(iterable, options, factory, nameTr, callback) {
  nameTr = nameTr || String;
  var self = this;

  for (var id in iterable) {
    if (Object.prototype.hasOwnProperty.call(iterable, id)) {
      memoize.call(self, id, iterable[id], factory, nameTr);
      if (callback) callback(id, iterable[id]);
    }
  }
}

/**
 * @api private
 */
module.exports = Collection;


/***/ }),

/***/ 8083:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Shape = __nccwpck_require__(1349);

var util = __nccwpck_require__(7985);
var property = util.property;
var memoizedProperty = util.memoizedProperty;

function Operation(name, operation, options) {
  var self = this;
  options = options || {};

  property(this, 'name', operation.name || name);
  property(this, 'api', options.api, false);

  operation.http = operation.http || {};
  property(this, 'endpoint', operation.endpoint);
  property(this, 'httpMethod', operation.http.method || 'POST');
  property(this, 'httpPath', operation.http.requestUri || '/');
  property(this, 'authtype', operation.authtype || '');
  property(
    this,
    'endpointDiscoveryRequired',
    operation.endpointdiscovery ?
      (operation.endpointdiscovery.required ? 'REQUIRED' : 'OPTIONAL') :
    'NULL'
  );

  memoizedProperty(this, 'input', function() {
    if (!operation.input) {
      return new Shape.create({type: 'structure'}, options);
    }
    return Shape.create(operation.input, options);
  });

  memoizedProperty(this, 'output', function() {
    if (!operation.output) {
      return new Shape.create({type: 'structure'}, options);
    }
    return Shape.create(operation.output, options);
  });

  memoizedProperty(this, 'errors', function() {
    var list = [];
    if (!operation.errors) return null;

    for (var i = 0; i < operation.errors.length; i++) {
      list.push(Shape.create(operation.errors[i], options));
    }

    return list;
  });

  memoizedProperty(this, 'paginator', function() {
    return options.api.paginators[name];
  });

  if (options.documentation) {
    property(this, 'documentation', operation.documentation);
    property(this, 'documentationUrl', operation.documentationUrl);
  }

  // idempotentMembers only tracks top-level input shapes
  memoizedProperty(this, 'idempotentMembers', function() {
    var idempotentMembers = [];
    var input = self.input;
    var members = input.members;
    if (!input.members) {
      return idempotentMembers;
    }
    for (var name in members) {
      if (!members.hasOwnProperty(name)) {
        continue;
      }
      if (members[name].isIdempotent === true) {
        idempotentMembers.push(name);
      }
    }
    return idempotentMembers;
  });

  memoizedProperty(this, 'hasEventOutput', function() {
    var output = self.output;
    return hasEventStream(output);
  });
}

function hasEventStream(topLevelShape) {
  var members = topLevelShape.members;
  var payload = topLevelShape.payload;

  if (!topLevelShape.members) {
    return false;
  }

  if (payload) {
    var payloadMember = members[payload];
    return payloadMember.isEventStream;
  }

  // check if any member is an event stream
  for (var name in members) {
    if (!members.hasOwnProperty(name)) {
      if (members[name].isEventStream === true) {
        return true;
      }
    }
  }
  return false;
}

/**
 * @api private
 */
module.exports = Operation;


/***/ }),

/***/ 5938:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var property = __nccwpck_require__(7985).property;

function Paginator(name, paginator) {
  property(this, 'inputToken', paginator.input_token);
  property(this, 'limitKey', paginator.limit_key);
  property(this, 'moreResults', paginator.more_results);
  property(this, 'outputToken', paginator.output_token);
  property(this, 'resultKey', paginator.result_key);
}

/**
 * @api private
 */
module.exports = Paginator;


/***/ }),

/***/ 1368:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(7985);
var property = util.property;

function ResourceWaiter(name, waiter, options) {
  options = options || {};
  property(this, 'name', name);
  property(this, 'api', options.api, false);

  if (waiter.operation) {
    property(this, 'operation', util.string.lowerFirst(waiter.operation));
  }

  var self = this;
  var keys = [
    'type',
    'description',
    'delay',
    'maxAttempts',
    'acceptors'
  ];

  keys.forEach(function(key) {
    var value = waiter[key];
    if (value) {
      property(self, key, value);
    }
  });
}

/**
 * @api private
 */
module.exports = ResourceWaiter;


/***/ }),

/***/ 1349:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Collection = __nccwpck_require__(1965);

var util = __nccwpck_require__(7985);

function property(obj, name, value) {
  if (value !== null && value !== undefined) {
    util.property.apply(this, arguments);
  }
}

function memoizedProperty(obj, name) {
  if (!obj.constructor.prototype[name]) {
    util.memoizedProperty.apply(this, arguments);
  }
}

function Shape(shape, options, memberName) {
  options = options || {};

  property(this, 'shape', shape.shape);
  property(this, 'api', options.api, false);
  property(this, 'type', shape.type);
  property(this, 'enum', shape.enum);
  property(this, 'min', shape.min);
  property(this, 'max', shape.max);
  property(this, 'pattern', shape.pattern);
  property(this, 'location', shape.location || this.location || 'body');
  property(this, 'name', this.name || shape.xmlName || shape.queryName ||
    shape.locationName || memberName);
  property(this, 'isStreaming', shape.streaming || this.isStreaming || false);
  property(this, 'requiresLength', shape.requiresLength, false);
  property(this, 'isComposite', shape.isComposite || false);
  property(this, 'isShape', true, false);
  property(this, 'isQueryName', Boolean(shape.queryName), false);
  property(this, 'isLocationName', Boolean(shape.locationName), false);
  property(this, 'isIdempotent', shape.idempotencyToken === true);
  property(this, 'isJsonValue', shape.jsonvalue === true);
  property(this, 'isSensitive', shape.sensitive === true || shape.prototype && shape.prototype.sensitive === true);
  property(this, 'isEventStream', Boolean(shape.eventstream), false);
  property(this, 'isEvent', Boolean(shape.event), false);
  property(this, 'isEventPayload', Boolean(shape.eventpayload), false);
  property(this, 'isEventHeader', Boolean(shape.eventheader), false);
  property(this, 'isTimestampFormatSet', Boolean(shape.timestampFormat) || shape.prototype && shape.prototype.isTimestampFormatSet === true, false);
  property(this, 'endpointDiscoveryId', Boolean(shape.endpointdiscoveryid), false);
  property(this, 'hostLabel', Boolean(shape.hostLabel), false);

  if (options.documentation) {
    property(this, 'documentation', shape.documentation);
    property(this, 'documentationUrl', shape.documentationUrl);
  }

  if (shape.xmlAttribute) {
    property(this, 'isXmlAttribute', shape.xmlAttribute || false);
  }

  // type conversion and parsing
  property(this, 'defaultValue', null);
  this.toWireFormat = function(value) {
    if (value === null || value === undefined) return '';
    return value;
  };
  this.toType = function(value) { return value; };
}

/**
 * @api private
 */
Shape.normalizedTypes = {
  character: 'string',
  double: 'float',
  long: 'integer',
  short: 'integer',
  biginteger: 'integer',
  bigdecimal: 'float',
  blob: 'binary'
};

/**
 * @api private
 */
Shape.types = {
  'structure': StructureShape,
  'list': ListShape,
  'map': MapShape,
  'boolean': BooleanShape,
  'timestamp': TimestampShape,
  'float': FloatShape,
  'integer': IntegerShape,
  'string': StringShape,
  'base64': Base64Shape,
  'binary': BinaryShape
};

Shape.resolve = function resolve(shape, options) {
  if (shape.shape) {
    var refShape = options.api.shapes[shape.shape];
    if (!refShape) {
      throw new Error('Cannot find shape reference: ' + shape.shape);
    }

    return refShape;
  } else {
    return null;
  }
};

Shape.create = function create(shape, options, memberName) {
  if (shape.isShape) return shape;

  var refShape = Shape.resolve(shape, options);
  if (refShape) {
    var filteredKeys = Object.keys(shape);
    if (!options.documentation) {
      filteredKeys = filteredKeys.filter(function(name) {
        return !name.match(/documentation/);
      });
    }

    // create an inline shape with extra members
    var InlineShape = function() {
      refShape.constructor.call(this, shape, options, memberName);
    };
    InlineShape.prototype = refShape;
    return new InlineShape();
  } else {
    // set type if not set
    if (!shape.type) {
      if (shape.members) shape.type = 'structure';
      else if (shape.member) shape.type = 'list';
      else if (shape.key) shape.type = 'map';
      else shape.type = 'string';
    }

    // normalize types
    var origType = shape.type;
    if (Shape.normalizedTypes[shape.type]) {
      shape.type = Shape.normalizedTypes[shape.type];
    }

    if (Shape.types[shape.type]) {
      return new Shape.types[shape.type](shape, options, memberName);
    } else {
      throw new Error('Unrecognized shape type: ' + origType);
    }
  }
};

function CompositeShape(shape) {
  Shape.apply(this, arguments);
  property(this, 'isComposite', true);

  if (shape.flattened) {
    property(this, 'flattened', shape.flattened || false);
  }
}

function StructureShape(shape, options) {
  var self = this;
  var requiredMap = null, firstInit = !this.isShape;

  CompositeShape.apply(this, arguments);

  if (firstInit) {
    property(this, 'defaultValue', function() { return {}; });
    property(this, 'members', {});
    property(this, 'memberNames', []);
    property(this, 'required', []);
    property(this, 'isRequired', function() { return false; });
  }

  if (shape.members) {
    property(this, 'members', new Collection(shape.members, options, function(name, member) {
      return Shape.create(member, options, name);
    }));
    memoizedProperty(this, 'memberNames', function() {
      return shape.xmlOrder || Object.keys(shape.members);
    });

    if (shape.event) {
      memoizedProperty(this, 'eventPayloadMemberName', function() {
        var members = self.members;
        var memberNames = self.memberNames;
        // iterate over members to find ones that are event payloads
        for (var i = 0, iLen = memberNames.length; i < iLen; i++) {
          if (members[memberNames[i]].isEventPayload) {
            return memberNames[i];
          }
        }
      });

      memoizedProperty(this, 'eventHeaderMemberNames', function() {
        var members = self.members;
        var memberNames = self.memberNames;
        var eventHeaderMemberNames = [];
        // iterate over members to find ones that are event headers
        for (var i = 0, iLen = memberNames.length; i < iLen; i++) {
          if (members[memberNames[i]].isEventHeader) {
            eventHeaderMemberNames.push(memberNames[i]);
          }
        }
        return eventHeaderMemberNames;
      });
    }
  }

  if (shape.required) {
    property(this, 'required', shape.required);
    property(this, 'isRequired', function(name) {
      if (!requiredMap) {
        requiredMap = {};
        for (var i = 0; i < shape.required.length; i++) {
          requiredMap[shape.required[i]] = true;
        }
      }

      return requiredMap[name];
    }, false, true);
  }

  property(this, 'resultWrapper', shape.resultWrapper || null);

  if (shape.payload) {
    property(this, 'payload', shape.payload);
  }

  if (typeof shape.xmlNamespace === 'string') {
    property(this, 'xmlNamespaceUri', shape.xmlNamespace);
  } else if (typeof shape.xmlNamespace === 'object') {
    property(this, 'xmlNamespacePrefix', shape.xmlNamespace.prefix);
    property(this, 'xmlNamespaceUri', shape.xmlNamespace.uri);
  }
}

function ListShape(shape, options) {
  var self = this, firstInit = !this.isShape;
  CompositeShape.apply(this, arguments);

  if (firstInit) {
    property(this, 'defaultValue', function() { return []; });
  }

  if (shape.member) {
    memoizedProperty(this, 'member', function() {
      return Shape.create(shape.member, options);
    });
  }

  if (this.flattened) {
    var oldName = this.name;
    memoizedProperty(this, 'name', function() {
      return self.member.name || oldName;
    });
  }
}

function MapShape(shape, options) {
  var firstInit = !this.isShape;
  CompositeShape.apply(this, arguments);

  if (firstInit) {
    property(this, 'defaultValue', function() { return {}; });
    property(this, 'key', Shape.create({type: 'string'}, options));
    property(this, 'value', Shape.create({type: 'string'}, options));
  }

  if (shape.key) {
    memoizedProperty(this, 'key', function() {
      return Shape.create(shape.key, options);
    });
  }
  if (shape.value) {
    memoizedProperty(this, 'value', function() {
      return Shape.create(shape.value, options);
    });
  }
}

function TimestampShape(shape) {
  var self = this;
  Shape.apply(this, arguments);

  if (shape.timestampFormat) {
    property(this, 'timestampFormat', shape.timestampFormat);
  } else if (self.isTimestampFormatSet && this.timestampFormat) {
    property(this, 'timestampFormat', this.timestampFormat);
  } else if (this.location === 'header') {
    property(this, 'timestampFormat', 'rfc822');
  } else if (this.location === 'querystring') {
    property(this, 'timestampFormat', 'iso8601');
  } else if (this.api) {
    switch (this.api.protocol) {
      case 'json':
      case 'rest-json':
        property(this, 'timestampFormat', 'unixTimestamp');
        break;
      case 'rest-xml':
      case 'query':
      case 'ec2':
        property(this, 'timestampFormat', 'iso8601');
        break;
    }
  }

  this.toType = function(value) {
    if (value === null || value === undefined) return null;
    if (typeof value.toUTCString === 'function') return value;
    return typeof value === 'string' || typeof value === 'number' ?
           util.date.parseTimestamp(value) : null;
  };

  this.toWireFormat = function(value) {
    return util.date.format(value, self.timestampFormat);
  };
}

function StringShape() {
  Shape.apply(this, arguments);

  var nullLessProtocols = ['rest-xml', 'query', 'ec2'];
  this.toType = function(value) {
    value = this.api && nullLessProtocols.indexOf(this.api.protocol) > -1 ?
      value || '' : value;
    if (this.isJsonValue) {
      return JSON.parse(value);
    }

    return value && typeof value.toString === 'function' ?
      value.toString() : value;
  };

  this.toWireFormat = function(value) {
    return this.isJsonValue ? JSON.stringify(value) : value;
  };
}

function FloatShape() {
  Shape.apply(this, arguments);

  this.toType = function(value) {
    if (value === null || value === undefined) return null;
    return parseFloat(value);
  };
  this.toWireFormat = this.toType;
}

function IntegerShape() {
  Shape.apply(this, arguments);

  this.toType = function(value) {
    if (value === null || value === undefined) return null;
    return parseInt(value, 10);
  };
  this.toWireFormat = this.toType;
}

function BinaryShape() {
  Shape.apply(this, arguments);
  this.toType = function(value) {
    var buf = util.base64.decode(value);
    if (this.isSensitive && util.isNode() && typeof util.Buffer.alloc === 'function') {
  /* Node.js can create a Buffer that is not isolated.
   * i.e. buf.byteLength !== buf.buffer.byteLength
   * This means that the sensitive data is accessible to anyone with access to buf.buffer.
   * If this is the node shared Buffer, then other code within this process _could_ find this secret.
   * Copy sensitive data to an isolated Buffer and zero the sensitive data.
   * While this is safe to do here, copying this code somewhere else may produce unexpected results.
   */
      var secureBuf = util.Buffer.alloc(buf.length, buf);
      buf.fill(0);
      buf = secureBuf;
    }
    return buf;
  };
  this.toWireFormat = util.base64.encode;
}

function Base64Shape() {
  BinaryShape.apply(this, arguments);
}

function BooleanShape() {
  Shape.apply(this, arguments);

  this.toType = function(value) {
    if (typeof value === 'boolean') return value;
    if (value === null || value === undefined) return null;
    return value === 'true';
  };
}

/**
 * @api private
 */
Shape.shapes = {
  StructureShape: StructureShape,
  ListShape: ListShape,
  MapShape: MapShape,
  StringShape: StringShape,
  BooleanShape: BooleanShape,
  Base64Shape: Base64Shape
};

/**
 * @api private
 */
module.exports = Shape;


/***/ }),

/***/ 3639:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(7985);

util.isBrowser = function() { return false; };
util.isNode = function() { return true; };

// node.js specific modules
util.crypto.lib = __nccwpck_require__(6417);
util.Buffer = __nccwpck_require__(4293).Buffer;
util.domain = __nccwpck_require__(5229);
util.stream = __nccwpck_require__(2413);
util.url = __nccwpck_require__(8835);
util.querystring = __nccwpck_require__(1191);
util.environment = 'nodejs';
util.createEventStream = util.stream.Readable ?
  __nccwpck_require__(9643).createEventStream : __nccwpck_require__(3727).createEventStream;
util.realClock = __nccwpck_require__(1370);
util.clientSideMonitoring = {
  Publisher: __nccwpck_require__(6807).Publisher,
  configProvider: __nccwpck_require__(1822),
};
util.iniLoader = __nccwpck_require__(9697)/* .iniLoader */ .b;
util.getSystemErrorName = __nccwpck_require__(1669).getSystemErrorName;

var AWS;

/**
 * @api private
 */
module.exports = AWS = __nccwpck_require__(8437);

__nccwpck_require__(3819);
__nccwpck_require__(6965);
__nccwpck_require__(7360);
__nccwpck_require__(7083);
__nccwpck_require__(4998);
__nccwpck_require__(3498);
__nccwpck_require__(5037);
__nccwpck_require__(371);

// Load the xml2js XML parser
AWS.XML.Parser = __nccwpck_require__(6752);

// Load Node HTTP client
__nccwpck_require__(2310);

__nccwpck_require__(5417);

// Load custom credential providers
__nccwpck_require__(1017);
__nccwpck_require__(3379);
__nccwpck_require__(8764);
__nccwpck_require__(645);
__nccwpck_require__(7714);
__nccwpck_require__(7454);
__nccwpck_require__(3754);
__nccwpck_require__(371);

// Setup default chain providers
// If this changes, please update documentation for
// AWS.CredentialProviderChain.defaultProviders in
// credentials/credential_provider_chain.js
AWS.CredentialProviderChain.defaultProviders = [
  function () { return new AWS.EnvironmentCredentials('AWS'); },
  function () { return new AWS.EnvironmentCredentials('AMAZON'); },
  function () { return new AWS.SharedIniFileCredentials(); },
  function () { return new AWS.ECSCredentials(); },
  function () { return new AWS.ProcessCredentials(); },
  function () { return new AWS.TokenFileWebIdentityCredentials(); },
  function () { return new AWS.EC2MetadataCredentials(); }
];

// Update configuration keys
AWS.util.update(AWS.Config.prototype.keys, {
  credentials: function () {
    var credentials = null;
    new AWS.CredentialProviderChain([
      function () { return new AWS.EnvironmentCredentials('AWS'); },
      function () { return new AWS.EnvironmentCredentials('AMAZON'); },
      function () { return new AWS.SharedIniFileCredentials({ disableAssumeRole: true }); }
    ]).resolve(function(err, creds) {
      if (!err) credentials = creds;
    });
    return credentials;
  },
  credentialProvider: function() {
    return new AWS.CredentialProviderChain();
  },
  logger: function () {
    return process.env.AWSJS_DEBUG ? console : null;
  },
  region: function() {
    var env = process.env;
    var region = env.AWS_REGION || env.AMAZON_REGION;
    if (env[AWS.util.configOptInEnv]) {
      var toCheck = [
        {filename: env[AWS.util.sharedCredentialsFileEnv]},
        {isConfig: true, filename: env[AWS.util.sharedConfigFileEnv]}
      ];
      var iniLoader = AWS.util.iniLoader;
      while (!region && toCheck.length) {
        var configFile = {};
        var fileInfo = toCheck.shift();
        try {
          configFile = iniLoader.loadFrom(fileInfo);
        } catch (err) {
          if (fileInfo.isConfig) throw err;
        }
        var profile = configFile[env.AWS_PROFILE || AWS.util.defaultProfile];
        region = profile && profile.region;
      }
    }
    return region;
  }
});

// Reset configuration
AWS.config = new AWS.Config();


/***/ }),

/***/ 9127:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);

/**
 * @api private
 */
AWS.ParamValidator = AWS.util.inherit({
  /**
   * Create a new validator object.
   *
   * @param validation [Boolean|map] whether input parameters should be
   *     validated against the operation description before sending the
   *     request. Pass a map to enable any of the following specific
   *     validation features:
   *
   *     * **min** [Boolean] &mdash; Validates that a value meets the min
   *       constraint. This is enabled by default when paramValidation is set
   *       to `true`.
   *     * **max** [Boolean] &mdash; Validates that a value meets the max
   *       constraint.
   *     * **pattern** [Boolean] &mdash; Validates that a string value matches a
   *       regular expression.
   *     * **enum** [Boolean] &mdash; Validates that a string value matches one
   *       of the allowable enum values.
   */
  constructor: function ParamValidator(validation) {
    if (validation === true || validation === undefined) {
      validation = {'min': true};
    }
    this.validation = validation;
  },

  validate: function validate(shape, params, context) {
    this.errors = [];
    this.validateMember(shape, params || {}, context || 'params');

    if (this.errors.length > 1) {
      var msg = this.errors.join('\n* ');
      msg = 'There were ' + this.errors.length +
        ' validation errors:\n* ' + msg;
      throw AWS.util.error(new Error(msg),
        {code: 'MultipleValidationErrors', errors: this.errors});
    } else if (this.errors.length === 1) {
      throw this.errors[0];
    } else {
      return true;
    }
  },

  fail: function fail(code, message) {
    this.errors.push(AWS.util.error(new Error(message), {code: code}));
  },

  validateStructure: function validateStructure(shape, params, context) {
    this.validateType(params, context, ['object'], 'structure');

    var paramName;
    for (var i = 0; shape.required && i < shape.required.length; i++) {
      paramName = shape.required[i];
      var value = params[paramName];
      if (value === undefined || value === null) {
        this.fail('MissingRequiredParameter',
          'Missing required key \'' + paramName + '\' in ' + context);
      }
    }

    // validate hash members
    for (paramName in params) {
      if (!Object.prototype.hasOwnProperty.call(params, paramName)) continue;

      var paramValue = params[paramName],
          memberShape = shape.members[paramName];

      if (memberShape !== undefined) {
        var memberContext = [context, paramName].join('.');
        this.validateMember(memberShape, paramValue, memberContext);
      } else if (paramValue !== undefined && paramValue !== null) {
        this.fail('UnexpectedParameter',
          'Unexpected key \'' + paramName + '\' found in ' + context);
      }
    }

    return true;
  },

  validateMember: function validateMember(shape, param, context) {
    switch (shape.type) {
      case 'structure':
        return this.validateStructure(shape, param, context);
      case 'list':
        return this.validateList(shape, param, context);
      case 'map':
        return this.validateMap(shape, param, context);
      default:
        return this.validateScalar(shape, param, context);
    }
  },

  validateList: function validateList(shape, params, context) {
    if (this.validateType(params, context, [Array])) {
      this.validateRange(shape, params.length, context, 'list member count');
      // validate array members
      for (var i = 0; i < params.length; i++) {
        this.validateMember(shape.member, params[i], context + '[' + i + ']');
      }
    }
  },

  validateMap: function validateMap(shape, params, context) {
    if (this.validateType(params, context, ['object'], 'map')) {
      // Build up a count of map members to validate range traits.
      var mapCount = 0;
      for (var param in params) {
        if (!Object.prototype.hasOwnProperty.call(params, param)) continue;
        // Validate any map key trait constraints
        this.validateMember(shape.key, param,
                            context + '[key=\'' + param + '\']');
        this.validateMember(shape.value, params[param],
                            context + '[\'' + param + '\']');
        mapCount++;
      }
      this.validateRange(shape, mapCount, context, 'map member count');
    }
  },

  validateScalar: function validateScalar(shape, value, context) {
    switch (shape.type) {
      case null:
      case undefined:
      case 'string':
        return this.validateString(shape, value, context);
      case 'base64':
      case 'binary':
        return this.validatePayload(value, context);
      case 'integer':
      case 'float':
        return this.validateNumber(shape, value, context);
      case 'boolean':
        return this.validateType(value, context, ['boolean']);
      case 'timestamp':
        return this.validateType(value, context, [Date,
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/, 'number'],
          'Date object, ISO-8601 string, or a UNIX timestamp');
      default:
        return this.fail('UnkownType', 'Unhandled type ' +
                         shape.type + ' for ' + context);
    }
  },

  validateString: function validateString(shape, value, context) {
    var validTypes = ['string'];
    if (shape.isJsonValue) {
      validTypes = validTypes.concat(['number', 'object', 'boolean']);
    }
    if (value !== null && this.validateType(value, context, validTypes)) {
      this.validateEnum(shape, value, context);
      this.validateRange(shape, value.length, context, 'string length');
      this.validatePattern(shape, value, context);
      this.validateUri(shape, value, context);
    }
  },

  validateUri: function validateUri(shape, value, context) {
    if (shape['location'] === 'uri') {
      if (value.length === 0) {
        this.fail('UriParameterError', 'Expected uri parameter to have length >= 1,'
          + ' but found "' + value +'" for ' + context);
      }
    }
  },

  validatePattern: function validatePattern(shape, value, context) {
    if (this.validation['pattern'] && shape['pattern'] !== undefined) {
      if (!(new RegExp(shape['pattern'])).test(value)) {
        this.fail('PatternMatchError', 'Provided value "' + value + '" '
          + 'does not match regex pattern /' + shape['pattern'] + '/ for '
          + context);
      }
    }
  },

  validateRange: function validateRange(shape, value, context, descriptor) {
    if (this.validation['min']) {
      if (shape['min'] !== undefined && value < shape['min']) {
        this.fail('MinRangeError', 'Expected ' + descriptor + ' >= '
          + shape['min'] + ', but found ' + value + ' for ' + context);
      }
    }
    if (this.validation['max']) {
      if (shape['max'] !== undefined && value > shape['max']) {
        this.fail('MaxRangeError', 'Expected ' + descriptor + ' <= '
          + shape['max'] + ', but found ' + value + ' for ' + context);
      }
    }
  },

  validateEnum: function validateRange(shape, value, context) {
    if (this.validation['enum'] && shape['enum'] !== undefined) {
      // Fail if the string value is not present in the enum list
      if (shape['enum'].indexOf(value) === -1) {
        this.fail('EnumError', 'Found string value of ' + value + ', but '
          + 'expected ' + shape['enum'].join('|') + ' for ' + context);
      }
    }
  },

  validateType: function validateType(value, context, acceptedTypes, type) {
    // We will not log an error for null or undefined, but we will return
    // false so that callers know that the expected type was not strictly met.
    if (value === null || value === undefined) return false;

    var foundInvalidType = false;
    for (var i = 0; i < acceptedTypes.length; i++) {
      if (typeof acceptedTypes[i] === 'string') {
        if (typeof value === acceptedTypes[i]) return true;
      } else if (acceptedTypes[i] instanceof RegExp) {
        if ((value || '').toString().match(acceptedTypes[i])) return true;
      } else {
        if (value instanceof acceptedTypes[i]) return true;
        if (AWS.util.isType(value, acceptedTypes[i])) return true;
        if (!type && !foundInvalidType) acceptedTypes = acceptedTypes.slice();
        acceptedTypes[i] = AWS.util.typeName(acceptedTypes[i]);
      }
      foundInvalidType = true;
    }

    var acceptedType = type;
    if (!acceptedType) {
      acceptedType = acceptedTypes.join(', ').replace(/,([^,]+)$/, ', or$1');
    }

    var vowel = acceptedType.match(/^[aeiou]/i) ? 'n' : '';
    this.fail('InvalidParameterType', 'Expected ' + context + ' to be a' +
              vowel + ' ' + acceptedType);
    return false;
  },

  validateNumber: function validateNumber(shape, value, context) {
    if (value === null || value === undefined) return;
    if (typeof value === 'string') {
      var castedValue = parseFloat(value);
      if (castedValue.toString() === value) value = castedValue;
    }
    if (this.validateType(value, context, ['number'])) {
      this.validateRange(shape, value, context, 'numeric value');
    }
  },

  validatePayload: function validatePayload(value, context) {
    if (value === null || value === undefined) return;
    if (typeof value === 'string') return;
    if (value && typeof value.byteLength === 'number') return; // typed arrays
    if (AWS.util.isNode()) { // special check for buffer/stream in Node.js
      var Stream = AWS.util.stream.Stream;
      if (AWS.util.Buffer.isBuffer(value) || value instanceof Stream) return;
    } else {
      if (typeof Blob !== void 0 && value instanceof Blob) return;
    }

    var types = ['Buffer', 'Stream', 'File', 'Blob', 'ArrayBuffer', 'DataView'];
    if (value) {
      for (var i = 0; i < types.length; i++) {
        if (AWS.util.isType(value, types[i])) return;
        if (AWS.util.typeName(value.constructor) === types[i]) return;
      }
    }

    this.fail('InvalidParameterType', 'Expected ' + context + ' to be a ' +
      'string, Buffer, Stream, Blob, or typed array object');
  }
});


/***/ }),

/***/ 7969:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util =  __nccwpck_require__(7985);
var AWS = __nccwpck_require__(8437);

/**
 * Prepend prefix defined by API model to endpoint that's already
 * constructed. This feature does not apply to operations using
 * endpoint discovery and can be disabled.
 * @api private
 */
function populateHostPrefix(request)  {
  var enabled = request.service.config.hostPrefixEnabled;
  if (!enabled) return request;
  var operationModel = request.service.api.operations[request.operation];
  //don't marshal host prefix when operation has endpoint discovery traits
  if (hasEndpointDiscover(request)) return request;
  if (operationModel.endpoint && operationModel.endpoint.hostPrefix) {
    var hostPrefixNotation = operationModel.endpoint.hostPrefix;
    var hostPrefix = expandHostPrefix(hostPrefixNotation, request.params, operationModel.input);
    prependEndpointPrefix(request.httpRequest.endpoint, hostPrefix);
    validateHostname(request.httpRequest.endpoint.hostname);
  }
  return request;
}

/**
 * @api private
 */
function hasEndpointDiscover(request) {
  var api = request.service.api;
  var operationModel = api.operations[request.operation];
  var isEndpointOperation = api.endpointOperation && (api.endpointOperation === util.string.lowerFirst(operationModel.name));
  return (operationModel.endpointDiscoveryRequired !== 'NULL' || isEndpointOperation === true);
}

/**
 * @api private
 */
function expandHostPrefix(hostPrefixNotation, params, shape) {
  util.each(shape.members, function(name, member) {
    if (member.hostLabel === true) {
      if (typeof params[name] !== 'string' || params[name] === '') {
        throw util.error(new Error(), {
          message: 'Parameter ' + name + ' should be a non-empty string.',
          code: 'InvalidParameter'
        });
      }
      var regex = new RegExp('\\{' + name + '\\}', 'g');
      hostPrefixNotation = hostPrefixNotation.replace(regex, params[name]);
    }
  });
  return hostPrefixNotation;
}

/**
 * @api private
 */
function prependEndpointPrefix(endpoint, prefix) {
  if (endpoint.host) {
    endpoint.host = prefix + endpoint.host;
  }
  if (endpoint.hostname) {
    endpoint.hostname = prefix + endpoint.hostname;
  }
}

/**
 * @api private
 */
function validateHostname(hostname) {
  var labels = hostname.split('.');
  //Reference: https://tools.ietf.org/html/rfc1123#section-2
  var hostPattern = /^[a-zA-Z0-9]{1}$|^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$/;
  util.arrayEach(labels, function(label) {
    if (!label.length || label.length < 1 || label.length > 63) {
      throw util.error(new Error(), {
        code: 'ValidationError',
        message: 'Hostname label length should be between 1 to 63 characters, inclusive.'
      });
    }
    if (!hostPattern.test(label)) {
      throw AWS.util.error(new Error(),
        {code: 'ValidationError', message: label + ' is not hostname compatible.'});
    }
  });
}

module.exports = {
  populateHostPrefix: populateHostPrefix
};


/***/ }),

/***/ 83:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(7985);
var JsonBuilder = __nccwpck_require__(7495);
var JsonParser = __nccwpck_require__(5474);
var populateHostPrefix = __nccwpck_require__(7969).populateHostPrefix;

function buildRequest(req) {
  var httpRequest = req.httpRequest;
  var api = req.service.api;
  var target = api.targetPrefix + '.' + api.operations[req.operation].name;
  var version = api.jsonVersion || '1.0';
  var input = api.operations[req.operation].input;
  var builder = new JsonBuilder();

  if (version === 1) version = '1.0';
  httpRequest.body = builder.build(req.params || {}, input);
  httpRequest.headers['Content-Type'] = 'application/x-amz-json-' + version;
  httpRequest.headers['X-Amz-Target'] = target;

  populateHostPrefix(req);
}

function extractError(resp) {
  var error = {};
  var httpResponse = resp.httpResponse;

  error.code = httpResponse.headers['x-amzn-errortype'] || 'UnknownError';
  if (typeof error.code === 'string') {
    error.code = error.code.split(':')[0];
  }

  if (httpResponse.body.length > 0) {
    try {
      var e = JSON.parse(httpResponse.body.toString());
      var code = e.__type || e.code || e.Code;
      if (code) {
        error.code = code.split('#').pop();
      }
      if (error.code === 'RequestEntityTooLarge') {
        error.message = 'Request body must be less than 1 MB';
      } else {
        error.message = (e.message || e.Message || null);
      }
    } catch (e) {
      error.statusCode = httpResponse.statusCode;
      error.message = httpResponse.statusMessage;
    }
  } else {
    error.statusCode = httpResponse.statusCode;
    error.message = httpResponse.statusCode.toString();
  }

  resp.error = util.error(new Error(), error);
}

function extractData(resp) {
  var body = resp.httpResponse.body.toString() || '{}';
  if (resp.request.service.config.convertResponseTypes === false) {
    resp.data = JSON.parse(body);
  } else {
    var operation = resp.request.service.api.operations[resp.request.operation];
    var shape = operation.output || {};
    var parser = new JsonParser();
    resp.data = parser.parse(body, shape);
  }
}

/**
 * @api private
 */
module.exports = {
  buildRequest: buildRequest,
  extractError: extractError,
  extractData: extractData
};


/***/ }),

/***/ 761:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var util = __nccwpck_require__(7985);
var QueryParamSerializer = __nccwpck_require__(5175);
var Shape = __nccwpck_require__(1349);
var populateHostPrefix = __nccwpck_require__(7969).populateHostPrefix;

function buildRequest(req) {
  var operation = req.service.api.operations[req.operation];
  var httpRequest = req.httpRequest;
  httpRequest.headers['Content-Type'] =
    'application/x-www-form-urlencoded; charset=utf-8';
  httpRequest.params = {
    Version: req.service.api.apiVersion,
    Action: operation.name
  };

  // convert the request parameters into a list of query params,
  // e.g. Deeply.NestedParam.0.Name=value
  var builder = new QueryParamSerializer();
  builder.serialize(req.params, operation.input, function(name, value) {
    httpRequest.params[name] = value;
  });
  httpRequest.body = util.queryParamsToString(httpRequest.params);

  populateHostPrefix(req);
}

function extractError(resp) {
  var data, body = resp.httpResponse.body.toString();
  if (body.match('<UnknownOperationException')) {
    data = {
      Code: 'UnknownOperation',
      Message: 'Unknown operation ' + resp.request.operation
    };
  } else {
    try {
      data = new AWS.XML.Parser().parse(body);
    } catch (e) {
      data = {
        Code: resp.httpResponse.statusCode,
        Message: resp.httpResponse.statusMessage
      };
    }
  }

  if (data.requestId && !resp.requestId) resp.requestId = data.requestId;
  if (data.Errors) data = data.Errors;
  if (data.Error) data = data.Error;
  if (data.Code) {
    resp.error = util.error(new Error(), {
      code: data.Code,
      message: data.Message
    });
  } else {
    resp.error = util.error(new Error(), {
      code: resp.httpResponse.statusCode,
      message: null
    });
  }
}

function extractData(resp) {
  var req = resp.request;
  var operation = req.service.api.operations[req.operation];
  var shape = operation.output || {};
  var origRules = shape;

  if (origRules.resultWrapper) {
    var tmp = Shape.create({type: 'structure'});
    tmp.members[origRules.resultWrapper] = shape;
    tmp.memberNames = [origRules.resultWrapper];
    util.property(shape, 'name', shape.resultWrapper);
    shape = tmp;
  }

  var parser = new AWS.XML.Parser();

  // TODO: Refactor XML Parser to parse RequestId from response.
  if (shape && shape.members && !shape.members._XAMZRequestId) {
    var requestIdShape = Shape.create(
      { type: 'string' },
      { api: { protocol: 'query' } },
      'requestId'
    );
    shape.members._XAMZRequestId = requestIdShape;
  }

  var data = parser.parse(resp.httpResponse.body.toString(), shape);
  resp.requestId = data._XAMZRequestId || data.requestId;

  if (data._XAMZRequestId) delete data._XAMZRequestId;

  if (origRules.resultWrapper) {
    if (data[origRules.resultWrapper]) {
      util.update(data, data[origRules.resultWrapper]);
      delete data[origRules.resultWrapper];
    }
  }

  resp.data = data;
}

/**
 * @api private
 */
module.exports = {
  buildRequest: buildRequest,
  extractError: extractError,
  extractData: extractData
};


/***/ }),

/***/ 8200:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(7985);
var populateHostPrefix = __nccwpck_require__(7969).populateHostPrefix;

function populateMethod(req) {
  req.httpRequest.method = req.service.api.operations[req.operation].httpMethod;
}

function generateURI(endpointPath, operationPath, input, params) {
  var uri = [endpointPath, operationPath].join('/');
  uri = uri.replace(/\/+/g, '/');

  var queryString = {}, queryStringSet = false;
  util.each(input.members, function (name, member) {
    var paramValue = params[name];
    if (paramValue === null || paramValue === undefined) return;
    if (member.location === 'uri') {
      var regex = new RegExp('\\{' + member.name + '(\\+)?\\}');
      uri = uri.replace(regex, function(_, plus) {
        var fn = plus ? util.uriEscapePath : util.uriEscape;
        return fn(String(paramValue));
      });
    } else if (member.location === 'querystring') {
      queryStringSet = true;

      if (member.type === 'list') {
        queryString[member.name] = paramValue.map(function(val) {
          return util.uriEscape(member.member.toWireFormat(val).toString());
        });
      } else if (member.type === 'map') {
        util.each(paramValue, function(key, value) {
          if (Array.isArray(value)) {
            queryString[key] = value.map(function(val) {
              return util.uriEscape(String(val));
            });
          } else {
            queryString[key] = util.uriEscape(String(value));
          }
        });
      } else {
        queryString[member.name] = util.uriEscape(member.toWireFormat(paramValue).toString());
      }
    }
  });

  if (queryStringSet) {
    uri += (uri.indexOf('?') >= 0 ? '&' : '?');
    var parts = [];
    util.arrayEach(Object.keys(queryString).sort(), function(key) {
      if (!Array.isArray(queryString[key])) {
        queryString[key] = [queryString[key]];
      }
      for (var i = 0; i < queryString[key].length; i++) {
        parts.push(util.uriEscape(String(key)) + '=' + queryString[key][i]);
      }
    });
    uri += parts.join('&');
  }

  return uri;
}

function populateURI(req) {
  var operation = req.service.api.operations[req.operation];
  var input = operation.input;

  var uri = generateURI(req.httpRequest.endpoint.path, operation.httpPath, input, req.params);
  req.httpRequest.path = uri;
}

function populateHeaders(req) {
  var operation = req.service.api.operations[req.operation];
  util.each(operation.input.members, function (name, member) {
    var value = req.params[name];
    if (value === null || value === undefined) return;

    if (member.location === 'headers' && member.type === 'map') {
      util.each(value, function(key, memberValue) {
        req.httpRequest.headers[member.name + key] = memberValue;
      });
    } else if (member.location === 'header') {
      value = member.toWireFormat(value).toString();
      if (member.isJsonValue) {
        value = util.base64.encode(value);
      }
      req.httpRequest.headers[member.name] = value;
    }
  });
}

function buildRequest(req) {
  populateMethod(req);
  populateURI(req);
  populateHeaders(req);
  populateHostPrefix(req);
}

function extractError() {
}

function extractData(resp) {
  var req = resp.request;
  var data = {};
  var r = resp.httpResponse;
  var operation = req.service.api.operations[req.operation];
  var output = operation.output;

  // normalize headers names to lower-cased keys for matching
  var headers = {};
  util.each(r.headers, function (k, v) {
    headers[k.toLowerCase()] = v;
  });

  util.each(output.members, function(name, member) {
    var header = (member.name || name).toLowerCase();
    if (member.location === 'headers' && member.type === 'map') {
      data[name] = {};
      var location = member.isLocationName ? member.name : '';
      var pattern = new RegExp('^' + location + '(.+)', 'i');
      util.each(r.headers, function (k, v) {
        var result = k.match(pattern);
        if (result !== null) {
          data[name][result[1]] = v;
        }
      });
    } else if (member.location === 'header') {
      if (headers[header] !== undefined) {
        var value = member.isJsonValue ?
          util.base64.decode(headers[header]) :
          headers[header];
        data[name] = member.toType(value);
      }
    } else if (member.location === 'statusCode') {
      data[name] = parseInt(r.statusCode, 10);
    }
  });

  resp.data = data;
}

/**
 * @api private
 */
module.exports = {
  buildRequest: buildRequest,
  extractError: extractError,
  extractData: extractData,
  generateURI: generateURI
};


/***/ }),

/***/ 5883:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(7985);
var Rest = __nccwpck_require__(8200);
var Json = __nccwpck_require__(83);
var JsonBuilder = __nccwpck_require__(7495);
var JsonParser = __nccwpck_require__(5474);

function populateBody(req) {
  var builder = new JsonBuilder();
  var input = req.service.api.operations[req.operation].input;

  if (input.payload) {
    var params = {};
    var payloadShape = input.members[input.payload];
    params = req.params[input.payload];
    if (params === undefined) return;

    if (payloadShape.type === 'structure') {
      req.httpRequest.body = builder.build(params, payloadShape);
      applyContentTypeHeader(req);
    } else { // non-JSON payload
      req.httpRequest.body = params;
      if (payloadShape.type === 'binary' || payloadShape.isStreaming) {
        applyContentTypeHeader(req, true);
      }
    }
  } else {
    var body = builder.build(req.params, input);
    if (body !== '{}' || req.httpRequest.method !== 'GET') { //don't send empty body for GET method
      req.httpRequest.body = body;
    }
    applyContentTypeHeader(req);
  }
}

function applyContentTypeHeader(req, isBinary) {
  var operation = req.service.api.operations[req.operation];
  var input = operation.input;

  if (!req.httpRequest.headers['Content-Type']) {
    var type = isBinary ? 'binary/octet-stream' : 'application/json';
    req.httpRequest.headers['Content-Type'] = type;
  }
}

function buildRequest(req) {
  Rest.buildRequest(req);

  // never send body payload on HEAD/DELETE
  if (['HEAD', 'DELETE'].indexOf(req.httpRequest.method) < 0) {
    populateBody(req);
  }
}

function extractError(resp) {
  Json.extractError(resp);
}

function extractData(resp) {
  Rest.extractData(resp);

  var req = resp.request;
  var operation = req.service.api.operations[req.operation];
  var rules = req.service.api.operations[req.operation].output || {};
  var parser;
  var hasEventOutput = operation.hasEventOutput;

  if (rules.payload) {
    var payloadMember = rules.members[rules.payload];
    var body = resp.httpResponse.body;
    if (payloadMember.isEventStream) {
      parser = new JsonParser();
      resp.data[payload] = util.createEventStream(
        AWS.HttpClient.streamsApiVersion === 2 ? resp.httpResponse.stream : body,
        parser,
        payloadMember
      );
    } else if (payloadMember.type === 'structure' || payloadMember.type === 'list') {
      var parser = new JsonParser();
      resp.data[rules.payload] = parser.parse(body, payloadMember);
    } else if (payloadMember.type === 'binary' || payloadMember.isStreaming) {
      resp.data[rules.payload] = body;
    } else {
      resp.data[rules.payload] = payloadMember.toType(body);
    }
  } else {
    var data = resp.data;
    Json.extractData(resp);
    resp.data = util.merge(data, resp.data);
  }
}

/**
 * @api private
 */
module.exports = {
  buildRequest: buildRequest,
  extractError: extractError,
  extractData: extractData
};


/***/ }),

/***/ 5143:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var util = __nccwpck_require__(7985);
var Rest = __nccwpck_require__(8200);

function populateBody(req) {
  var input = req.service.api.operations[req.operation].input;
  var builder = new AWS.XML.Builder();
  var params = req.params;

  var payload = input.payload;
  if (payload) {
    var payloadMember = input.members[payload];
    params = params[payload];
    if (params === undefined) return;

    if (payloadMember.type === 'structure') {
      var rootElement = payloadMember.name;
      req.httpRequest.body = builder.toXML(params, payloadMember, rootElement, true);
    } else { // non-xml payload
      req.httpRequest.body = params;
    }
  } else {
    req.httpRequest.body = builder.toXML(params, input, input.name ||
      input.shape || util.string.upperFirst(req.operation) + 'Request');
  }
}

function buildRequest(req) {
  Rest.buildRequest(req);

  // never send body payload on GET/HEAD
  if (['GET', 'HEAD'].indexOf(req.httpRequest.method) < 0) {
    populateBody(req);
  }
}

function extractError(resp) {
  Rest.extractError(resp);

  var data;
  try {
    data = new AWS.XML.Parser().parse(resp.httpResponse.body.toString());
  } catch (e) {
    data = {
      Code: resp.httpResponse.statusCode,
      Message: resp.httpResponse.statusMessage
    };
  }

  if (data.Errors) data = data.Errors;
  if (data.Error) data = data.Error;
  if (data.Code) {
    resp.error = util.error(new Error(), {
      code: data.Code,
      message: data.Message
    });
  } else {
    resp.error = util.error(new Error(), {
      code: resp.httpResponse.statusCode,
      message: null
    });
  }
}

function extractData(resp) {
  Rest.extractData(resp);

  var parser;
  var req = resp.request;
  var body = resp.httpResponse.body;
  var operation = req.service.api.operations[req.operation];
  var output = operation.output;

  var hasEventOutput = operation.hasEventOutput;

  var payload = output.payload;
  if (payload) {
    var payloadMember = output.members[payload];
    if (payloadMember.isEventStream) {
      parser = new AWS.XML.Parser();
      resp.data[payload] = util.createEventStream(
        AWS.HttpClient.streamsApiVersion === 2 ? resp.httpResponse.stream : resp.httpResponse.body,
        parser,
        payloadMember
      );
    } else if (payloadMember.type === 'structure') {
      parser = new AWS.XML.Parser();
      resp.data[payload] = parser.parse(body.toString(), payloadMember);
    } else if (payloadMember.type === 'binary' || payloadMember.isStreaming) {
      resp.data[payload] = body;
    } else {
      resp.data[payload] = payloadMember.toType(body);
    }
  } else if (body.length > 0) {
    parser = new AWS.XML.Parser();
    var data = parser.parse(body.toString(), output);
    util.update(resp.data, data);
  }
}

/**
 * @api private
 */
module.exports = {
  buildRequest: buildRequest,
  extractError: extractError,
  extractData: extractData
};


/***/ }),

/***/ 1822:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);

/**
 * Resolve client-side monitoring configuration from either environmental variables
 * or shared config file. Configurations from environmental variables have higher priority
 * than those from shared config file. The resolver will try to read the shared config file
 * no matter whether the AWS_SDK_LOAD_CONFIG variable is set.
 * @api private
 */
function resolveMonitoringConfig() {
  var config = {
    port: undefined,
    clientId: undefined,
    enabled: undefined,
    host: undefined
  };
  if (fromEnvironment(config) || fromConfigFile(config)) return toJSType(config);
  return toJSType(config);
}

/**
 * Resolve configurations from environmental variables.
 * @param {object} client side monitoring config object needs to be resolved
 * @returns {boolean} whether resolving configurations is done
 * @api private
 */
function fromEnvironment(config) {
  config.port = config.port || process.env.AWS_CSM_PORT;
  config.enabled = config.enabled || process.env.AWS_CSM_ENABLED;
  config.clientId = config.clientId || process.env.AWS_CSM_CLIENT_ID;
  config.host = config.host || process.env.AWS_CSM_HOST;
  return config.port && config.enabled && config.clientId && config.host ||
    ['false', '0'].indexOf(config.enabled) >= 0; //no need to read shared config file if explicitely disabled
}

/**
 * Resolve cofigurations from shared config file with specified role name
 * @param {object} client side monitoring config object needs to be resolved
 * @returns {boolean} whether resolving configurations is done
 * @api private
 */
function fromConfigFile(config) {
  var sharedFileConfig;
  try {
    var configFile = AWS.util.iniLoader.loadFrom({
      isConfig: true,
      filename: process.env[AWS.util.sharedConfigFileEnv]
    });
    var sharedFileConfig = configFile[
      process.env.AWS_PROFILE || AWS.util.defaultProfile
    ];
  } catch (err) {
    return false;
  }
  if (!sharedFileConfig) return config;
  config.port = config.port || sharedFileConfig.csm_port;
  config.enabled = config.enabled || sharedFileConfig.csm_enabled;
  config.clientId = config.clientId || sharedFileConfig.csm_client_id;
  config.host = config.host || sharedFileConfig.csm_host;
  return config.port && config.enabled && config.clientId && config.host;
}

/**
 * Transfer the resolved configuration value to proper types: port as number, enabled
 * as boolean and clientId as string. The 'enabled' flag is valued to false when set
 * to 'false' or '0'.
 * @param {object} resolved client side monitoring config
 * @api private
 */
function toJSType(config) {
    //config.XXX is either undefined or string
  var falsyNotations = ['false', '0', undefined];
  if (!config.enabled || falsyNotations.indexOf(config.enabled.toLowerCase()) >= 0) {
    config.enabled = false;
  } else {
    config.enabled = true;
  }
  config.port = config.port ? parseInt(config.port, 10) : undefined;
  return config;
}

module.exports = resolveMonitoringConfig;


/***/ }),

/***/ 6807:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(8437).util;
var dgram = __nccwpck_require__(6200);
var stringToBuffer = util.buffer.toBuffer;

var MAX_MESSAGE_SIZE = 1024 * 8; // 8 KB

/**
 * Publishes metrics via udp.
 * @param {object} options Paramters for Publisher constructor
 * @param {number} [options.port = 31000] Port number
 * @param {string} [options.clientId = ''] Client Identifier
 * @param {boolean} [options.enabled = false] enable sending metrics datagram
 * @api private
 */
function Publisher(options) {
    // handle configuration
    options = options || {};
    this.enabled = options.enabled || false;
    this.port = options.port || 31000;
    this.clientId = options.clientId || '';
    this.address = options.host || '127.0.0.1';
    if (this.clientId.length > 255) {
        // ClientId has a max length of 255
        this.clientId = this.clientId.substr(0, 255);
    }
    this.messagesInFlight = 0;
}

Publisher.prototype.fieldsToTrim = {
    UserAgent: 256,
    SdkException: 128,
    SdkExceptionMessage: 512,
    AwsException: 128,
    AwsExceptionMessage: 512,
    FinalSdkException: 128,
    FinalSdkExceptionMessage: 512,
    FinalAwsException: 128,
    FinalAwsExceptionMessage: 512

};

/**
 * Trims fields that have a specified max length.
 * @param {object} event ApiCall or ApiCallAttempt event.
 * @returns {object}
 * @api private
 */
Publisher.prototype.trimFields = function(event) {
    var trimmableFields = Object.keys(this.fieldsToTrim);
    for (var i = 0, iLen = trimmableFields.length; i < iLen; i++) {
        var field = trimmableFields[i];
        if (event.hasOwnProperty(field)) {
            var maxLength = this.fieldsToTrim[field];
            var value = event[field];
            if (value && value.length > maxLength) {
                event[field] = value.substr(0, maxLength);
            }
        }
    }
    return event;
};

/**
 * Handles ApiCall and ApiCallAttempt events.
 * @param {Object} event apiCall or apiCallAttempt event.
 * @api private
 */
Publisher.prototype.eventHandler = function(event) {
    // set the clientId
    event.ClientId = this.clientId;

    this.trimFields(event);

    var message = stringToBuffer(JSON.stringify(event));
    if (!this.enabled || message.length > MAX_MESSAGE_SIZE) {
        // drop the message if publisher not enabled or it is too large
        return;
    }

    this.publishDatagram(message);
};

/**
 * Publishes message to an agent.
 * @param {Buffer} message JSON message to send to agent.
 * @api private
 */
Publisher.prototype.publishDatagram = function(message) {
    var self = this;
    var client = this.getClient();

    this.messagesInFlight++;
    this.client.send(message, 0, message.length, this.port, this.address, function(err, bytes) {
        if (--self.messagesInFlight <= 0) {
            // destroy existing client so the event loop isn't kept open
            self.destroyClient();
        }
    });
};

/**
 * Returns an existing udp socket, or creates one if it doesn't already exist.
 * @api private
 */
Publisher.prototype.getClient = function() {
    if (!this.client) {
        this.client = dgram.createSocket('udp4');
    }
    return this.client;
};

/**
 * Destroys the udp socket.
 * @api private
 */
Publisher.prototype.destroyClient = function() {
    if (this.client) {
        this.client.close();
        this.client = void 0;
    }
};

module.exports = {
    Publisher: Publisher
};


/***/ }),

/***/ 5175:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(7985);

function QueryParamSerializer() {
}

QueryParamSerializer.prototype.serialize = function(params, shape, fn) {
  serializeStructure('', params, shape, fn);
};

function ucfirst(shape) {
  if (shape.isQueryName || shape.api.protocol !== 'ec2') {
    return shape.name;
  } else {
    return shape.name[0].toUpperCase() + shape.name.substr(1);
  }
}

function serializeStructure(prefix, struct, rules, fn) {
  util.each(rules.members, function(name, member) {
    var value = struct[name];
    if (value === null || value === undefined) return;

    var memberName = ucfirst(member);
    memberName = prefix ? prefix + '.' + memberName : memberName;
    serializeMember(memberName, value, member, fn);
  });
}

function serializeMap(name, map, rules, fn) {
  var i = 1;
  util.each(map, function (key, value) {
    var prefix = rules.flattened ? '.' : '.entry.';
    var position = prefix + (i++) + '.';
    var keyName = position + (rules.key.name || 'key');
    var valueName = position + (rules.value.name || 'value');
    serializeMember(name + keyName, key, rules.key, fn);
    serializeMember(name + valueName, value, rules.value, fn);
  });
}

function serializeList(name, list, rules, fn) {
  var memberRules = rules.member || {};

  if (list.length === 0) {
    fn.call(this, name, null);
    return;
  }

  util.arrayEach(list, function (v, n) {
    var suffix = '.' + (n + 1);
    if (rules.api.protocol === 'ec2') {
      // Do nothing for EC2
      suffix = suffix + ''; // make linter happy
    } else if (rules.flattened) {
      if (memberRules.name) {
        var parts = name.split('.');
        parts.pop();
        parts.push(ucfirst(memberRules));
        name = parts.join('.');
      }
    } else {
      suffix = '.' + (memberRules.name ? memberRules.name : 'member') + suffix;
    }
    serializeMember(name + suffix, v, memberRules, fn);
  });
}

function serializeMember(name, value, rules, fn) {
  if (value === null || value === undefined) return;
  if (rules.type === 'structure') {
    serializeStructure(name, value, rules, fn);
  } else if (rules.type === 'list') {
    serializeList(name, value, rules, fn);
  } else if (rules.type === 'map') {
    serializeMap(name, value, rules, fn);
  } else {
    fn(name, rules.toWireFormat(value).toString());
  }
}

/**
 * @api private
 */
module.exports = QueryParamSerializer;


/***/ }),

/***/ 1370:
/***/ ((module) => {

module.exports = {
  //provide realtime clock for performance measurement
  now: function now() {
    var second = process.hrtime();
    return second[0] * 1000 + (second[1] / 1000000);
  }
};


/***/ }),

/***/ 8262:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(7985);
var regionConfig = __nccwpck_require__(1765);

function generateRegionPrefix(region) {
  if (!region) return null;

  var parts = region.split('-');
  if (parts.length < 3) return null;
  return parts.slice(0, parts.length - 2).join('-') + '-*';
}

function derivedKeys(service) {
  var region = service.config.region;
  var regionPrefix = generateRegionPrefix(region);
  var endpointPrefix = service.api.endpointPrefix;

  return [
    [region, endpointPrefix],
    [regionPrefix, endpointPrefix],
    [region, '*'],
    [regionPrefix, '*'],
    ['*', endpointPrefix],
    ['*', '*']
  ].map(function(item) {
    return item[0] && item[1] ? item.join('/') : null;
  });
}

function applyConfig(service, config) {
  util.each(config, function(key, value) {
    if (key === 'globalEndpoint') return;
    if (service.config[key] === undefined || service.config[key] === null) {
      service.config[key] = value;
    }
  });
}

function configureEndpoint(service) {
  var keys = derivedKeys(service);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!key) continue;

    if (Object.prototype.hasOwnProperty.call(regionConfig.rules, key)) {
      var config = regionConfig.rules[key];
      if (typeof config === 'string') {
        config = regionConfig.patterns[config];
      }

      // set dualstack endpoint
      if (service.config.useDualstack && util.isDualstackAvailable(service)) {
        config = util.copy(config);
        config.endpoint = config.endpoint.replace(
          /{service}\.({region}\.)?/,
          '{service}.dualstack.{region}.'
        );
      }

      // set global endpoint
      service.isGlobalEndpoint = !!config.globalEndpoint;
      if (config.signingRegion) {
        service.signingRegion = config.signingRegion;
      }

      // signature version
      if (!config.signatureVersion) config.signatureVersion = 'v4';

      // merge config
      applyConfig(service, config);
      return;
    }
  }
}

function getEndpointSuffix(region) {
  var regionRegexes = {
    '^(us|eu|ap|sa|ca|me)\\-\\w+\\-\\d+$': 'amazonaws.com',
    '^cn\\-\\w+\\-\\d+$': 'amazonaws.com.cn',
    '^us\\-gov\\-\\w+\\-\\d+$': 'amazonaws.com',
    '^us\\-iso\\-\\w+\\-\\d+$': 'c2s.ic.gov',
    '^us\\-isob\\-\\w+\\-\\d+$': 'sc2s.sgov.gov'
  };
  var defaultSuffix = 'amazonaws.com';
  var regexes = Object.keys(regionRegexes);
  for (var i = 0; i < regexes.length; i++) {
    var regionPattern = RegExp(regexes[i]);
    var dnsSuffix = regionRegexes[regexes[i]];
    if (regionPattern.test(region)) return dnsSuffix;
  }
  return defaultSuffix;
}

/**
 * @api private
 */
module.exports = {
  configureEndpoint: configureEndpoint,
  getEndpointSuffix: getEndpointSuffix
};


/***/ }),

/***/ 8652:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var AcceptorStateMachine = __nccwpck_require__(8118);
var inherit = AWS.util.inherit;
var domain = AWS.util.domain;
var jmespath = __nccwpck_require__(7783);

/**
 * @api private
 */
var hardErrorStates = {success: 1, error: 1, complete: 1};

function isTerminalState(machine) {
  return Object.prototype.hasOwnProperty.call(hardErrorStates, machine._asm.currentState);
}

var fsm = new AcceptorStateMachine();
fsm.setupStates = function() {
  var transition = function(_, done) {
    var self = this;
    self._haltHandlersOnError = false;

    self.emit(self._asm.currentState, function(err) {
      if (err) {
        if (isTerminalState(self)) {
          if (domain && self.domain instanceof domain.Domain) {
            err.domainEmitter = self;
            err.domain = self.domain;
            err.domainThrown = false;
            self.domain.emit('error', err);
          } else {
            throw err;
          }
        } else {
          self.response.error = err;
          done(err);
        }
      } else {
        done(self.response.error);
      }
    });

  };

  this.addState('validate', 'build', 'error', transition);
  this.addState('build', 'afterBuild', 'restart', transition);
  this.addState('afterBuild', 'sign', 'restart', transition);
  this.addState('sign', 'send', 'retry', transition);
  this.addState('retry', 'afterRetry', 'afterRetry', transition);
  this.addState('afterRetry', 'sign', 'error', transition);
  this.addState('send', 'validateResponse', 'retry', transition);
  this.addState('validateResponse', 'extractData', 'extractError', transition);
  this.addState('extractError', 'extractData', 'retry', transition);
  this.addState('extractData', 'success', 'retry', transition);
  this.addState('restart', 'build', 'error', transition);
  this.addState('success', 'complete', 'complete', transition);
  this.addState('error', 'complete', 'complete', transition);
  this.addState('complete', null, null, transition);
};
fsm.setupStates();

/**
 * ## Asynchronous Requests
 *
 * All requests made through the SDK are asynchronous and use a
 * callback interface. Each service method that kicks off a request
 * returns an `AWS.Request` object that you can use to register
 * callbacks.
 *
 * For example, the following service method returns the request
 * object as "request", which can be used to register callbacks:
 *
 * ```javascript
 * // request is an AWS.Request object
 * var request = ec2.describeInstances();
 *
 * // register callbacks on request to retrieve response data
 * request.on('success', function(response) {
 *   console.log(response.data);
 * });
 * ```
 *
 * When a request is ready to be sent, the {send} method should
 * be called:
 *
 * ```javascript
 * request.send();
 * ```
 *
 * Since registered callbacks may or may not be idempotent, requests should only
 * be sent once. To perform the same operation multiple times, you will need to
 * create multiple request objects, each with its own registered callbacks.
 *
 * ## Removing Default Listeners for Events
 *
 * Request objects are built with default listeners for the various events,
 * depending on the service type. In some cases, you may want to remove
 * some built-in listeners to customize behaviour. Doing this requires
 * access to the built-in listener functions, which are exposed through
 * the {AWS.EventListeners.Core} namespace. For instance, you may
 * want to customize the HTTP handler used when sending a request. In this
 * case, you can remove the built-in listener associated with the 'send'
 * event, the {AWS.EventListeners.Core.SEND} listener and add your own.
 *
 * ## Multiple Callbacks and Chaining
 *
 * You can register multiple callbacks on any request object. The
 * callbacks can be registered for different events, or all for the
 * same event. In addition, you can chain callback registration, for
 * example:
 *
 * ```javascript
 * request.
 *   on('success', function(response) {
 *     console.log("Success!");
 *   }).
 *   on('error', function(error, response) {
 *     console.log("Error!");
 *   }).
 *   on('complete', function(response) {
 *     console.log("Always!");
 *   }).
 *   send();
 * ```
 *
 * The above example will print either "Success! Always!", or "Error! Always!",
 * depending on whether the request succeeded or not.
 *
 * @!attribute httpRequest
 *   @readonly
 *   @!group HTTP Properties
 *   @return [AWS.HttpRequest] the raw HTTP request object
 *     containing request headers and body information
 *     sent by the service.
 *
 * @!attribute startTime
 *   @readonly
 *   @!group Operation Properties
 *   @return [Date] the time that the request started
 *
 * @!group Request Building Events
 *
 * @!event validate(request)
 *   Triggered when a request is being validated. Listeners
 *   should throw an error if the request should not be sent.
 *   @param request [Request] the request object being sent
 *   @see AWS.EventListeners.Core.VALIDATE_CREDENTIALS
 *   @see AWS.EventListeners.Core.VALIDATE_REGION
 *   @example Ensuring that a certain parameter is set before sending a request
 *     var req = s3.putObject(params);
 *     req.on('validate', function() {
 *       if (!req.params.Body.match(/^Hello\s/)) {
 *         throw new Error('Body must start with "Hello "');
 *       }
 *     });
 *     req.send(function(err, data) { ... });
 *
 * @!event build(request)
 *   Triggered when the request payload is being built. Listeners
 *   should fill the necessary information to send the request
 *   over HTTP.
 *   @param (see AWS.Request~validate)
 *   @example Add a custom HTTP header to a request
 *     var req = s3.putObject(params);
 *     req.on('build', function() {
 *       req.httpRequest.headers['Custom-Header'] = 'value';
 *     });
 *     req.send(function(err, data) { ... });
 *
 * @!event sign(request)
 *   Triggered when the request is being signed. Listeners should
 *   add the correct authentication headers and/or adjust the body,
 *   depending on the authentication mechanism being used.
 *   @param (see AWS.Request~validate)
 *
 * @!group Request Sending Events
 *
 * @!event send(response)
 *   Triggered when the request is ready to be sent. Listeners
 *   should call the underlying transport layer to initiate
 *   the sending of the request.
 *   @param response [Response] the response object
 *   @context [Request] the request object that was sent
 *   @see AWS.EventListeners.Core.SEND
 *
 * @!event retry(response)
 *   Triggered when a request failed and might need to be retried or redirected.
 *   If the response is retryable, the listener should set the
 *   `response.error.retryable` property to `true`, and optionally set
 *   `response.error.retryDelay` to the millisecond delay for the next attempt.
 *   In the case of a redirect, `response.error.redirect` should be set to
 *   `true` with `retryDelay` set to an optional delay on the next request.
 *
 *   If a listener decides that a request should not be retried,
 *   it should set both `retryable` and `redirect` to false.
 *
 *   Note that a retryable error will be retried at most
 *   {AWS.Config.maxRetries} times (based on the service object's config).
 *   Similarly, a request that is redirected will only redirect at most
 *   {AWS.Config.maxRedirects} times.
 *
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *   @example Adding a custom retry for a 404 response
 *     request.on('retry', function(response) {
 *       // this resource is not yet available, wait 10 seconds to get it again
 *       if (response.httpResponse.statusCode === 404 && response.error) {
 *         response.error.retryable = true;   // retry this error
 *         response.error.retryDelay = 10000; // wait 10 seconds
 *       }
 *     });
 *
 * @!group Data Parsing Events
 *
 * @!event extractError(response)
 *   Triggered on all non-2xx requests so that listeners can extract
 *   error details from the response body. Listeners to this event
 *   should set the `response.error` property.
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *
 * @!event extractData(response)
 *   Triggered in successful requests to allow listeners to
 *   de-serialize the response body into `response.data`.
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *
 * @!group Completion Events
 *
 * @!event success(response)
 *   Triggered when the request completed successfully.
 *   `response.data` will contain the response data and
 *   `response.error` will be null.
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *
 * @!event error(error, response)
 *   Triggered when an error occurs at any point during the
 *   request. `response.error` will contain details about the error
 *   that occurred. `response.data` will be null.
 *   @param error [Error] the error object containing details about
 *     the error that occurred.
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *
 * @!event complete(response)
 *   Triggered whenever a request cycle completes. `response.error`
 *   should be checked, since the request may have failed.
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *
 * @!group HTTP Events
 *
 * @!event httpHeaders(statusCode, headers, response, statusMessage)
 *   Triggered when headers are sent by the remote server
 *   @param statusCode [Integer] the HTTP response code
 *   @param headers [map<String,String>] the response headers
 *   @param (see AWS.Request~send)
 *   @param statusMessage [String] A status message corresponding to the HTTP
 *                                 response code
 *   @context (see AWS.Request~send)
 *
 * @!event httpData(chunk, response)
 *   Triggered when data is sent by the remote server
 *   @param chunk [Buffer] the buffer data containing the next data chunk
 *     from the server
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *   @see AWS.EventListeners.Core.HTTP_DATA
 *
 * @!event httpUploadProgress(progress, response)
 *   Triggered when the HTTP request has uploaded more data
 *   @param progress [map] An object containing the `loaded` and `total` bytes
 *     of the request.
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *   @note This event will not be emitted in Node.js 0.8.x.
 *
 * @!event httpDownloadProgress(progress, response)
 *   Triggered when the HTTP request has downloaded more data
 *   @param progress [map] An object containing the `loaded` and `total` bytes
 *     of the request.
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *   @note This event will not be emitted in Node.js 0.8.x.
 *
 * @!event httpError(error, response)
 *   Triggered when the HTTP request failed
 *   @param error [Error] the error object that was thrown
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *
 * @!event httpDone(response)
 *   Triggered when the server is finished sending data
 *   @param (see AWS.Request~send)
 *   @context (see AWS.Request~send)
 *
 * @see AWS.Response
 */
AWS.Request = inherit({

  /**
   * Creates a request for an operation on a given service with
   * a set of input parameters.
   *
   * @param service [AWS.Service] the service to perform the operation on
   * @param operation [String] the operation to perform on the service
   * @param params [Object] parameters to send to the operation.
   *   See the operation's documentation for the format of the
   *   parameters.
   */
  constructor: function Request(service, operation, params) {
    var endpoint = service.endpoint;
    var region = service.config.region;
    var customUserAgent = service.config.customUserAgent;

    if (service.isGlobalEndpoint) {
      if (service.signingRegion) {
        region = service.signingRegion;
      } else {
        region = 'us-east-1';
      }
    }

    this.domain = domain && domain.active;
    this.service = service;
    this.operation = operation;
    this.params = params || {};
    this.httpRequest = new AWS.HttpRequest(endpoint, region);
    this.httpRequest.appendToUserAgent(customUserAgent);
    this.startTime = service.getSkewCorrectedDate();

    this.response = new AWS.Response(this);
    this._asm = new AcceptorStateMachine(fsm.states, 'validate');
    this._haltHandlersOnError = false;

    AWS.SequentialExecutor.call(this);
    this.emit = this.emitEvent;
  },

  /**
   * @!group Sending a Request
   */

  /**
   * @overload send(callback = null)
   *   Sends the request object.
   *
   *   @callback callback function(err, data)
   *     If a callback is supplied, it is called when a response is returned
   *     from the service.
   *     @context [AWS.Request] the request object being sent.
   *     @param err [Error] the error object returned from the request.
   *       Set to `null` if the request is successful.
   *     @param data [Object] the de-serialized data returned from
   *       the request. Set to `null` if a request error occurs.
   *   @example Sending a request with a callback
   *     request = s3.putObject({Bucket: 'bucket', Key: 'key'});
   *     request.send(function(err, data) { console.log(err, data); });
   *   @example Sending a request with no callback (using event handlers)
   *     request = s3.putObject({Bucket: 'bucket', Key: 'key'});
   *     request.on('complete', function(response) { ... }); // register a callback
   *     request.send();
   */
  send: function send(callback) {
    if (callback) {
      // append to user agent
      this.httpRequest.appendToUserAgent('callback');
      this.on('complete', function (resp) {
        callback.call(resp, resp.error, resp.data);
      });
    }
    this.runTo();

    return this.response;
  },

  /**
   * @!method  promise()
   *   Sends the request and returns a 'thenable' promise.
   *
   *   Two callbacks can be provided to the `then` method on the returned promise.
   *   The first callback will be called if the promise is fulfilled, and the second
   *   callback will be called if the promise is rejected.
   *   @callback fulfilledCallback function(data)
   *     Called if the promise is fulfilled.
   *     @param data [Object] the de-serialized data returned from the request.
   *   @callback rejectedCallback function(error)
   *     Called if the promise is rejected.
   *     @param error [Error] the error object returned from the request.
   *   @return [Promise] A promise that represents the state of the request.
   *   @example Sending a request using promises.
   *     var request = s3.putObject({Bucket: 'bucket', Key: 'key'});
   *     var result = request.promise();
   *     result.then(function(data) { ... }, function(error) { ... });
   */

  /**
   * @api private
   */
  build: function build(callback) {
    return this.runTo('send', callback);
  },

  /**
   * @api private
   */
  runTo: function runTo(state, done) {
    this._asm.runTo(state, done, this);
    return this;
  },

  /**
   * Aborts a request, emitting the error and complete events.
   *
   * @!macro nobrowser
   * @example Aborting a request after sending
   *   var params = {
   *     Bucket: 'bucket', Key: 'key',
   *     Body: Buffer.alloc(1024 * 1024 * 5) // 5MB payload
   *   };
   *   var request = s3.putObject(params);
   *   request.send(function (err, data) {
   *     if (err) console.log("Error:", err.code, err.message);
   *     else console.log(data);
   *   });
   *
   *   // abort request in 1 second
   *   setTimeout(request.abort.bind(request), 1000);
   *
   *   // prints "Error: RequestAbortedError Request aborted by user"
   * @return [AWS.Request] the same request object, for chaining.
   * @since v1.4.0
   */
  abort: function abort() {
    this.removeAllListeners('validateResponse');
    this.removeAllListeners('extractError');
    this.on('validateResponse', function addAbortedError(resp) {
      resp.error = AWS.util.error(new Error('Request aborted by user'), {
         code: 'RequestAbortedError', retryable: false
      });
    });

    if (this.httpRequest.stream && !this.httpRequest.stream.didCallback) { // abort HTTP stream
      this.httpRequest.stream.abort();
      if (this.httpRequest._abortCallback) {
         this.httpRequest._abortCallback();
      } else {
        this.removeAllListeners('send'); // haven't sent yet, so let's not
      }
    }

    return this;
  },

  /**
   * Iterates over each page of results given a pageable request, calling
   * the provided callback with each page of data. After all pages have been
   * retrieved, the callback is called with `null` data.
   *
   * @note This operation can generate multiple requests to a service.
   * @example Iterating over multiple pages of objects in an S3 bucket
   *   var pages = 1;
   *   s3.listObjects().eachPage(function(err, data) {
   *     if (err) return;
   *     console.log("Page", pages++);
   *     console.log(data);
   *   });
   * @example Iterating over multiple pages with an asynchronous callback
   *   s3.listObjects(params).eachPage(function(err, data, done) {
   *     doSomethingAsyncAndOrExpensive(function() {
   *       // The next page of results isn't fetched until done is called
   *       done();
   *     });
   *   });
   * @callback callback function(err, data, [doneCallback])
   *   Called with each page of resulting data from the request. If the
   *   optional `doneCallback` is provided in the function, it must be called
   *   when the callback is complete.
   *
   *   @param err [Error] an error object, if an error occurred.
   *   @param data [Object] a single page of response data. If there is no
   *     more data, this object will be `null`.
   *   @param doneCallback [Function] an optional done callback. If this
   *     argument is defined in the function declaration, it should be called
   *     when the next page is ready to be retrieved. This is useful for
   *     controlling serial pagination across asynchronous operations.
   *   @return [Boolean] if the callback returns `false`, pagination will
   *     stop.
   *
   * @see AWS.Request.eachItem
   * @see AWS.Response.nextPage
   * @since v1.4.0
   */
  eachPage: function eachPage(callback) {
    // Make all callbacks async-ish
    callback = AWS.util.fn.makeAsync(callback, 3);

    function wrappedCallback(response) {
      callback.call(response, response.error, response.data, function (result) {
        if (result === false) return;

        if (response.hasNextPage()) {
          response.nextPage().on('complete', wrappedCallback).send();
        } else {
          callback.call(response, null, null, AWS.util.fn.noop);
        }
      });
    }

    this.on('complete', wrappedCallback).send();
  },

  /**
   * Enumerates over individual items of a request, paging the responses if
   * necessary.
   *
   * @api experimental
   * @since v1.4.0
   */
  eachItem: function eachItem(callback) {
    var self = this;
    function wrappedCallback(err, data) {
      if (err) return callback(err, null);
      if (data === null) return callback(null, null);

      var config = self.service.paginationConfig(self.operation);
      var resultKey = config.resultKey;
      if (Array.isArray(resultKey)) resultKey = resultKey[0];
      var items = jmespath.search(data, resultKey);
      var continueIteration = true;
      AWS.util.arrayEach(items, function(item) {
        continueIteration = callback(null, item);
        if (continueIteration === false) {
          return AWS.util.abort;
        }
      });
      return continueIteration;
    }

    this.eachPage(wrappedCallback);
  },

  /**
   * @return [Boolean] whether the operation can return multiple pages of
   *   response data.
   * @see AWS.Response.eachPage
   * @since v1.4.0
   */
  isPageable: function isPageable() {
    return this.service.paginationConfig(this.operation) ? true : false;
  },

  /**
   * Sends the request and converts the request object into a readable stream
   * that can be read from or piped into a writable stream.
   *
   * @note The data read from a readable stream contains only
   *   the raw HTTP body contents.
   * @example Manually reading from a stream
   *   request.createReadStream().on('data', function(data) {
   *     console.log("Got data:", data.toString());
   *   });
   * @example Piping a request body into a file
   *   var out = fs.createWriteStream('/path/to/outfile.jpg');
   *   s3.service.getObject(params).createReadStream().pipe(out);
   * @return [Stream] the readable stream object that can be piped
   *   or read from (by registering 'data' event listeners).
   * @!macro nobrowser
   */
  createReadStream: function createReadStream() {
    var streams = AWS.util.stream;
    var req = this;
    var stream = null;

    if (AWS.HttpClient.streamsApiVersion === 2) {
      stream = new streams.PassThrough();
      process.nextTick(function() { req.send(); });
    } else {
      stream = new streams.Stream();
      stream.readable = true;

      stream.sent = false;
      stream.on('newListener', function(event) {
        if (!stream.sent && event === 'data') {
          stream.sent = true;
          process.nextTick(function() { req.send(); });
        }
      });
    }

    this.on('error', function(err) {
      stream.emit('error', err);
    });

    this.on('httpHeaders', function streamHeaders(statusCode, headers, resp) {
      if (statusCode < 300) {
        req.removeListener('httpData', AWS.EventListeners.Core.HTTP_DATA);
        req.removeListener('httpError', AWS.EventListeners.Core.HTTP_ERROR);
        req.on('httpError', function streamHttpError(error) {
          resp.error = error;
          resp.error.retryable = false;
        });

        var shouldCheckContentLength = false;
        var expectedLen;
        if (req.httpRequest.method !== 'HEAD') {
          expectedLen = parseInt(headers['content-length'], 10);
        }
        if (expectedLen !== undefined && !isNaN(expectedLen) && expectedLen >= 0) {
          shouldCheckContentLength = true;
          var receivedLen = 0;
        }

        var checkContentLengthAndEmit = function checkContentLengthAndEmit() {
          if (shouldCheckContentLength && receivedLen !== expectedLen) {
            stream.emit('error', AWS.util.error(
              new Error('Stream content length mismatch. Received ' +
                receivedLen + ' of ' + expectedLen + ' bytes.'),
              { code: 'StreamContentLengthMismatch' }
            ));
          } else if (AWS.HttpClient.streamsApiVersion === 2) {
            stream.end();
          } else {
            stream.emit('end');
          }
        };

        var httpStream = resp.httpResponse.createUnbufferedStream();

        if (AWS.HttpClient.streamsApiVersion === 2) {
          if (shouldCheckContentLength) {
            var lengthAccumulator = new streams.PassThrough();
            lengthAccumulator._write = function(chunk) {
              if (chunk && chunk.length) {
                receivedLen += chunk.length;
              }
              return streams.PassThrough.prototype._write.apply(this, arguments);
            };

            lengthAccumulator.on('end', checkContentLengthAndEmit);
            stream.on('error', function(err) {
              shouldCheckContentLength = false;
              httpStream.unpipe(lengthAccumulator);
              lengthAccumulator.emit('end');
              lengthAccumulator.end();
            });
            httpStream.pipe(lengthAccumulator).pipe(stream, { end: false });
          } else {
            httpStream.pipe(stream);
          }
        } else {

          if (shouldCheckContentLength) {
            httpStream.on('data', function(arg) {
              if (arg && arg.length) {
                receivedLen += arg.length;
              }
            });
          }

          httpStream.on('data', function(arg) {
            stream.emit('data', arg);
          });
          httpStream.on('end', checkContentLengthAndEmit);
        }

        httpStream.on('error', function(err) {
          shouldCheckContentLength = false;
          stream.emit('error', err);
        });
      }
    });

    return stream;
  },

  /**
   * @param [Array,Response] args This should be the response object,
   *   or an array of args to send to the event.
   * @api private
   */
  emitEvent: function emit(eventName, args, done) {
    if (typeof args === 'function') { done = args; args = null; }
    if (!done) done = function() { };
    if (!args) args = this.eventParameters(eventName, this.response);

    var origEmit = AWS.SequentialExecutor.prototype.emit;
    origEmit.call(this, eventName, args, function (err) {
      if (err) this.response.error = err;
      done.call(this, err);
    });
  },

  /**
   * @api private
   */
  eventParameters: function eventParameters(eventName) {
    switch (eventName) {
      case 'restart':
      case 'validate':
      case 'sign':
      case 'build':
      case 'afterValidate':
      case 'afterBuild':
        return [this];
      case 'error':
        return [this.response.error, this.response];
      default:
        return [this.response];
    }
  },

  /**
   * @api private
   */
  presign: function presign(expires, callback) {
    if (!callback && typeof expires === 'function') {
      callback = expires;
      expires = null;
    }
    return new AWS.Signers.Presign().sign(this.toGet(), expires, callback);
  },

  /**
   * @api private
   */
  isPresigned: function isPresigned() {
    return Object.prototype.hasOwnProperty.call(this.httpRequest.headers, 'presigned-expires');
  },

  /**
   * @api private
   */
  toUnauthenticated: function toUnauthenticated() {
    this._unAuthenticated = true;
    this.removeListener('validate', AWS.EventListeners.Core.VALIDATE_CREDENTIALS);
    this.removeListener('sign', AWS.EventListeners.Core.SIGN);
    return this;
  },

  /**
   * @api private
   */
  toGet: function toGet() {
    if (this.service.api.protocol === 'query' ||
        this.service.api.protocol === 'ec2') {
      this.removeListener('build', this.buildAsGet);
      this.addListener('build', this.buildAsGet);
    }
    return this;
  },

  /**
   * @api private
   */
  buildAsGet: function buildAsGet(request) {
    request.httpRequest.method = 'GET';
    request.httpRequest.path = request.service.endpoint.path +
                               '?' + request.httpRequest.body;
    request.httpRequest.body = '';

    // don't need these headers on a GET request
    delete request.httpRequest.headers['Content-Length'];
    delete request.httpRequest.headers['Content-Type'];
  },

  /**
   * @api private
   */
  haltHandlersOnError: function haltHandlersOnError() {
    this._haltHandlersOnError = true;
  }
});

/**
 * @api private
 */
AWS.Request.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
  this.prototype.promise = function promise() {
    var self = this;
    // append to user agent
    this.httpRequest.appendToUserAgent('promise');
    return new PromiseDependency(function(resolve, reject) {
      self.on('complete', function(resp) {
        if (resp.error) {
          reject(resp.error);
        } else {
          // define $response property so that it is not enumerable
          // this prevents circular reference errors when stringifying the JSON object
          resolve(Object.defineProperty(
            resp.data || {},
            '$response',
            {value: resp}
          ));
        }
      });
      self.runTo();
    });
  };
};

/**
 * @api private
 */
AWS.Request.deletePromisesFromClass = function deletePromisesFromClass() {
  delete this.prototype.promise;
};

AWS.util.addPromises(AWS.Request);

AWS.util.mixin(AWS.Request, AWS.SequentialExecutor);


/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Copyright 2012-2013 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You
 * may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 */

var AWS = __nccwpck_require__(8437);
var inherit = AWS.util.inherit;
var jmespath = __nccwpck_require__(7783);

/**
 * @api private
 */
function CHECK_ACCEPTORS(resp) {
  var waiter = resp.request._waiter;
  var acceptors = waiter.config.acceptors;
  var acceptorMatched = false;
  var state = 'retry';

  acceptors.forEach(function(acceptor) {
    if (!acceptorMatched) {
      var matcher = waiter.matchers[acceptor.matcher];
      if (matcher && matcher(resp, acceptor.expected, acceptor.argument)) {
        acceptorMatched = true;
        state = acceptor.state;
      }
    }
  });

  if (!acceptorMatched && resp.error) state = 'failure';

  if (state === 'success') {
    waiter.setSuccess(resp);
  } else {
    waiter.setError(resp, state === 'retry');
  }
}

/**
 * @api private
 */
AWS.ResourceWaiter = inherit({
  /**
   * Waits for a given state on a service object
   * @param service [Service] the service object to wait on
   * @param state [String] the state (defined in waiter configuration) to wait
   *   for.
   * @example Create a waiter for running EC2 instances
   *   var ec2 = new AWS.EC2;
   *   var waiter = new AWS.ResourceWaiter(ec2, 'instanceRunning');
   */
  constructor: function constructor(service, state) {
    this.service = service;
    this.state = state;
    this.loadWaiterConfig(this.state);
  },

  service: null,

  state: null,

  config: null,

  matchers: {
    path: function(resp, expected, argument) {
      try {
        var result = jmespath.search(resp.data, argument);
      } catch (err) {
        return false;
      }

      return jmespath.strictDeepEqual(result,expected);
    },

    pathAll: function(resp, expected, argument) {
      try {
        var results = jmespath.search(resp.data, argument);
      } catch (err) {
        return false;
      }

      if (!Array.isArray(results)) results = [results];
      var numResults = results.length;
      if (!numResults) return false;
      for (var ind = 0 ; ind < numResults; ind++) {
        if (!jmespath.strictDeepEqual(results[ind], expected)) {
          return false;
        }
      }
      return true;
    },

    pathAny: function(resp, expected, argument) {
      try {
        var results = jmespath.search(resp.data, argument);
      } catch (err) {
        return false;
      }

      if (!Array.isArray(results)) results = [results];
      var numResults = results.length;
      for (var ind = 0 ; ind < numResults; ind++) {
        if (jmespath.strictDeepEqual(results[ind], expected)) {
          return true;
        }
      }
      return false;
    },

    status: function(resp, expected) {
      var statusCode = resp.httpResponse.statusCode;
      return (typeof statusCode === 'number') && (statusCode === expected);
    },

    error: function(resp, expected) {
      if (typeof expected === 'string' && resp.error) {
        return expected === resp.error.code;
      }
      // if expected is not string, can be boolean indicating presence of error
      return expected === !!resp.error;
    }
  },

  listeners: new AWS.SequentialExecutor().addNamedListeners(function(add) {
    add('RETRY_CHECK', 'retry', function(resp) {
      var waiter = resp.request._waiter;
      if (resp.error && resp.error.code === 'ResourceNotReady') {
        resp.error.retryDelay = (waiter.config.delay || 0) * 1000;
      }
    });

    add('CHECK_OUTPUT', 'extractData', CHECK_ACCEPTORS);

    add('CHECK_ERROR', 'extractError', CHECK_ACCEPTORS);
  }),

  /**
   * @return [AWS.Request]
   */
  wait: function wait(params, callback) {
    if (typeof params === 'function') {
      callback = params; params = undefined;
    }

    if (params && params.$waiter) {
      params = AWS.util.copy(params);
      if (typeof params.$waiter.delay === 'number') {
        this.config.delay = params.$waiter.delay;
      }
      if (typeof params.$waiter.maxAttempts === 'number') {
        this.config.maxAttempts = params.$waiter.maxAttempts;
      }
      delete params.$waiter;
    }

    var request = this.service.makeRequest(this.config.operation, params);
    request._waiter = this;
    request.response.maxRetries = this.config.maxAttempts;
    request.addListeners(this.listeners);

    if (callback) request.send(callback);
    return request;
  },

  setSuccess: function setSuccess(resp) {
    resp.error = null;
    resp.data = resp.data || {};
    resp.request.removeAllListeners('extractData');
  },

  setError: function setError(resp, retryable) {
    resp.data = null;
    resp.error = AWS.util.error(resp.error || new Error(), {
      code: 'ResourceNotReady',
      message: 'Resource is not in the state ' + this.state,
      retryable: retryable
    });
  },

  /**
   * Loads waiter configuration from API configuration
   *
   * @api private
   */
  loadWaiterConfig: function loadWaiterConfig(state) {
    if (!this.service.api.waiters[state]) {
      throw new AWS.util.error(new Error(), {
        code: 'StateNotFoundError',
        message: 'State ' + state + ' not found.'
      });
    }

    this.config = AWS.util.copy(this.service.api.waiters[state]);
  }
});


/***/ }),

/***/ 8743:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var inherit = AWS.util.inherit;
var jmespath = __nccwpck_require__(7783);

/**
 * This class encapsulates the response information
 * from a service request operation sent through {AWS.Request}.
 * The response object has two main properties for getting information
 * back from a request:
 *
 * ## The `data` property
 *
 * The `response.data` property contains the serialized object data
 * retrieved from the service request. For instance, for an
 * Amazon DynamoDB `listTables` method call, the response data might
 * look like:
 *
 * ```
 * > resp.data
 * { TableNames:
 *    [ 'table1', 'table2', ... ] }
 * ```
 *
 * The `data` property can be null if an error occurs (see below).
 *
 * ## The `error` property
 *
 * In the event of a service error (or transfer error), the
 * `response.error` property will be filled with the given
 * error data in the form:
 *
 * ```
 * { code: 'SHORT_UNIQUE_ERROR_CODE',
 *   message: 'Some human readable error message' }
 * ```
 *
 * In the case of an error, the `data` property will be `null`.
 * Note that if you handle events that can be in a failure state,
 * you should always check whether `response.error` is set
 * before attempting to access the `response.data` property.
 *
 * @!attribute data
 *   @readonly
 *   @!group Data Properties
 *   @note Inside of a {AWS.Request~httpData} event, this
 *     property contains a single raw packet instead of the
 *     full de-serialized service response.
 *   @return [Object] the de-serialized response data
 *     from the service.
 *
 * @!attribute error
 *   An structure containing information about a service
 *   or networking error.
 *   @readonly
 *   @!group Data Properties
 *   @note This attribute is only filled if a service or
 *     networking error occurs.
 *   @return [Error]
 *     * code [String] a unique short code representing the
 *       error that was emitted.
 *     * message [String] a longer human readable error message
 *     * retryable [Boolean] whether the error message is
 *       retryable.
 *     * statusCode [Numeric] in the case of a request that reached the service,
 *       this value contains the response status code.
 *     * time [Date] the date time object when the error occurred.
 *     * hostname [String] set when a networking error occurs to easily
 *       identify the endpoint of the request.
 *     * region [String] set when a networking error occurs to easily
 *       identify the region of the request.
 *
 * @!attribute requestId
 *   @readonly
 *   @!group Data Properties
 *   @return [String] the unique request ID associated with the response.
 *     Log this value when debugging requests for AWS support.
 *
 * @!attribute retryCount
 *   @readonly
 *   @!group Operation Properties
 *   @return [Integer] the number of retries that were
 *     attempted before the request was completed.
 *
 * @!attribute redirectCount
 *   @readonly
 *   @!group Operation Properties
 *   @return [Integer] the number of redirects that were
 *     followed before the request was completed.
 *
 * @!attribute httpResponse
 *   @readonly
 *   @!group HTTP Properties
 *   @return [AWS.HttpResponse] the raw HTTP response object
 *     containing the response headers and body information
 *     from the server.
 *
 * @see AWS.Request
 */
AWS.Response = inherit({

  /**
   * @api private
   */
  constructor: function Response(request) {
    this.request = request;
    this.data = null;
    this.error = null;
    this.retryCount = 0;
    this.redirectCount = 0;
    this.httpResponse = new AWS.HttpResponse();
    if (request) {
      this.maxRetries = request.service.numRetries();
      this.maxRedirects = request.service.config.maxRedirects;
    }
  },

  /**
   * Creates a new request for the next page of response data, calling the
   * callback with the page data if a callback is provided.
   *
   * @callback callback function(err, data)
   *   Called when a page of data is returned from the next request.
   *
   *   @param err [Error] an error object, if an error occurred in the request
   *   @param data [Object] the next page of data, or null, if there are no
   *     more pages left.
   * @return [AWS.Request] the request object for the next page of data
   * @return [null] if no callback is provided and there are no pages left
   *   to retrieve.
   * @since v1.4.0
   */
  nextPage: function nextPage(callback) {
    var config;
    var service = this.request.service;
    var operation = this.request.operation;
    try {
      config = service.paginationConfig(operation, true);
    } catch (e) { this.error = e; }

    if (!this.hasNextPage()) {
      if (callback) callback(this.error, null);
      else if (this.error) throw this.error;
      return null;
    }

    var params = AWS.util.copy(this.request.params);
    if (!this.nextPageTokens) {
      return callback ? callback(null, null) : null;
    } else {
      var inputTokens = config.inputToken;
      if (typeof inputTokens === 'string') inputTokens = [inputTokens];
      for (var i = 0; i < inputTokens.length; i++) {
        params[inputTokens[i]] = this.nextPageTokens[i];
      }
      return service.makeRequest(this.request.operation, params, callback);
    }
  },

  /**
   * @return [Boolean] whether more pages of data can be returned by further
   *   requests
   * @since v1.4.0
   */
  hasNextPage: function hasNextPage() {
    this.cacheNextPageTokens();
    if (this.nextPageTokens) return true;
    if (this.nextPageTokens === undefined) return undefined;
    else return false;
  },

  /**
   * @api private
   */
  cacheNextPageTokens: function cacheNextPageTokens() {
    if (Object.prototype.hasOwnProperty.call(this, 'nextPageTokens')) return this.nextPageTokens;
    this.nextPageTokens = undefined;

    var config = this.request.service.paginationConfig(this.request.operation);
    if (!config) return this.nextPageTokens;

    this.nextPageTokens = null;
    if (config.moreResults) {
      if (!jmespath.search(this.data, config.moreResults)) {
        return this.nextPageTokens;
      }
    }

    var exprs = config.outputToken;
    if (typeof exprs === 'string') exprs = [exprs];
    AWS.util.arrayEach.call(this, exprs, function (expr) {
      var output = jmespath.search(this.data, expr);
      if (output) {
        this.nextPageTokens = this.nextPageTokens || [];
        this.nextPageTokens.push(output);
      }
    });

    return this.nextPageTokens;
  }

});


/***/ }),

/***/ 5948:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);

/**
 * @api private
 * @!method on(eventName, callback)
 *   Registers an event listener callback for the event given by `eventName`.
 *   Parameters passed to the callback function depend on the individual event
 *   being triggered. See the event documentation for those parameters.
 *
 *   @param eventName [String] the event name to register the listener for
 *   @param callback [Function] the listener callback function
 *   @param toHead [Boolean] attach the listener callback to the head of callback array if set to true.
 *     Default to be false.
 *   @return [AWS.SequentialExecutor] the same object for chaining
 */
AWS.SequentialExecutor = AWS.util.inherit({

  constructor: function SequentialExecutor() {
    this._events = {};
  },

  /**
   * @api private
   */
  listeners: function listeners(eventName) {
    return this._events[eventName] ? this._events[eventName].slice(0) : [];
  },

  on: function on(eventName, listener, toHead) {
    if (this._events[eventName]) {
      toHead ?
        this._events[eventName].unshift(listener) :
        this._events[eventName].push(listener);
    } else {
      this._events[eventName] = [listener];
    }
    return this;
  },

  onAsync: function onAsync(eventName, listener, toHead) {
    listener._isAsync = true;
    return this.on(eventName, listener, toHead);
  },

  removeListener: function removeListener(eventName, listener) {
    var listeners = this._events[eventName];
    if (listeners) {
      var length = listeners.length;
      var position = -1;
      for (var i = 0; i < length; ++i) {
        if (listeners[i] === listener) {
          position = i;
        }
      }
      if (position > -1) {
        listeners.splice(position, 1);
      }
    }
    return this;
  },

  removeAllListeners: function removeAllListeners(eventName) {
    if (eventName) {
      delete this._events[eventName];
    } else {
      this._events = {};
    }
    return this;
  },

  /**
   * @api private
   */
  emit: function emit(eventName, eventArgs, doneCallback) {
    if (!doneCallback) doneCallback = function() { };
    var listeners = this.listeners(eventName);
    var count = listeners.length;
    this.callListeners(listeners, eventArgs, doneCallback);
    return count > 0;
  },

  /**
   * @api private
   */
  callListeners: function callListeners(listeners, args, doneCallback, prevError) {
    var self = this;
    var error = prevError || null;

    function callNextListener(err) {
      if (err) {
        error = AWS.util.error(error || new Error(), err);
        if (self._haltHandlersOnError) {
          return doneCallback.call(self, error);
        }
      }
      self.callListeners(listeners, args, doneCallback, error);
    }

    while (listeners.length > 0) {
      var listener = listeners.shift();
      if (listener._isAsync) { // asynchronous listener
        listener.apply(self, args.concat([callNextListener]));
        return; // stop here, callNextListener will continue
      } else { // synchronous listener
        try {
          listener.apply(self, args);
        } catch (err) {
          error = AWS.util.error(error || new Error(), err);
        }
        if (error && self._haltHandlersOnError) {
          doneCallback.call(self, error);
          return;
        }
      }
    }
    doneCallback.call(self, error);
  },

  /**
   * Adds or copies a set of listeners from another list of
   * listeners or SequentialExecutor object.
   *
   * @param listeners [map<String,Array<Function>>, AWS.SequentialExecutor]
   *   a list of events and callbacks, or an event emitter object
   *   containing listeners to add to this emitter object.
   * @return [AWS.SequentialExecutor] the emitter object, for chaining.
   * @example Adding listeners from a map of listeners
   *   emitter.addListeners({
   *     event1: [function() { ... }, function() { ... }],
   *     event2: [function() { ... }]
   *   });
   *   emitter.emit('event1'); // emitter has event1
   *   emitter.emit('event2'); // emitter has event2
   * @example Adding listeners from another emitter object
   *   var emitter1 = new AWS.SequentialExecutor();
   *   emitter1.on('event1', function() { ... });
   *   emitter1.on('event2', function() { ... });
   *   var emitter2 = new AWS.SequentialExecutor();
   *   emitter2.addListeners(emitter1);
   *   emitter2.emit('event1'); // emitter2 has event1
   *   emitter2.emit('event2'); // emitter2 has event2
   */
  addListeners: function addListeners(listeners) {
    var self = this;

    // extract listeners if parameter is an SequentialExecutor object
    if (listeners._events) listeners = listeners._events;

    AWS.util.each(listeners, function(event, callbacks) {
      if (typeof callbacks === 'function') callbacks = [callbacks];
      AWS.util.arrayEach(callbacks, function(callback) {
        self.on(event, callback);
      });
    });

    return self;
  },

  /**
   * Registers an event with {on} and saves the callback handle function
   * as a property on the emitter object using a given `name`.
   *
   * @param name [String] the property name to set on this object containing
   *   the callback function handle so that the listener can be removed in
   *   the future.
   * @param (see on)
   * @return (see on)
   * @example Adding a named listener DATA_CALLBACK
   *   var listener = function() { doSomething(); };
   *   emitter.addNamedListener('DATA_CALLBACK', 'data', listener);
   *
   *   // the following prints: true
   *   console.log(emitter.DATA_CALLBACK == listener);
   */
  addNamedListener: function addNamedListener(name, eventName, callback, toHead) {
    this[name] = callback;
    this.addListener(eventName, callback, toHead);
    return this;
  },

  /**
   * @api private
   */
  addNamedAsyncListener: function addNamedAsyncListener(name, eventName, callback, toHead) {
    callback._isAsync = true;
    return this.addNamedListener(name, eventName, callback, toHead);
  },

  /**
   * Helper method to add a set of named listeners using
   * {addNamedListener}. The callback contains a parameter
   * with a handle to the `addNamedListener` method.
   *
   * @callback callback function(add)
   *   The callback function is called immediately in order to provide
   *   the `add` function to the block. This simplifies the addition of
   *   a large group of named listeners.
   *   @param add [Function] the {addNamedListener} function to call
   *     when registering listeners.
   * @example Adding a set of named listeners
   *   emitter.addNamedListeners(function(add) {
   *     add('DATA_CALLBACK', 'data', function() { ... });
   *     add('OTHER', 'otherEvent', function() { ... });
   *     add('LAST', 'lastEvent', function() { ... });
   *   });
   *
   *   // these properties are now set:
   *   emitter.DATA_CALLBACK;
   *   emitter.OTHER;
   *   emitter.LAST;
   */
  addNamedListeners: function addNamedListeners(callback) {
    var self = this;
    callback(
      function() {
        self.addNamedListener.apply(self, arguments);
      },
      function() {
        self.addNamedAsyncListener.apply(self, arguments);
      }
    );
    return this;
  }
});

/**
 * {on} is the prefered method.
 * @api private
 */
AWS.SequentialExecutor.prototype.addListener = AWS.SequentialExecutor.prototype.on;

/**
 * @api private
 */
module.exports = AWS.SequentialExecutor;


/***/ }),

/***/ 8903:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var Api = __nccwpck_require__(7657);
var regionConfig = __nccwpck_require__(8262);

var inherit = AWS.util.inherit;
var clientCount = 0;

/**
 * The service class representing an AWS service.
 *
 * @class_abstract This class is an abstract class.
 *
 * @!attribute apiVersions
 *   @return [Array<String>] the list of API versions supported by this service.
 *   @readonly
 */
AWS.Service = inherit({
  /**
   * Create a new service object with a configuration object
   *
   * @param config [map] a map of configuration options
   */
  constructor: function Service(config) {
    if (!this.loadServiceClass) {
      throw AWS.util.error(new Error(),
        'Service must be constructed with `new\' operator');
    }
    var ServiceClass = this.loadServiceClass(config || {});
    if (ServiceClass) {
      var originalConfig = AWS.util.copy(config);
      var svc = new ServiceClass(config);
      Object.defineProperty(svc, '_originalConfig', {
        get: function() { return originalConfig; },
        enumerable: false,
        configurable: true
      });
      svc._clientId = ++clientCount;
      return svc;
    }
    this.initialize(config);
  },

  /**
   * @api private
   */
  initialize: function initialize(config) {
    var svcConfig = AWS.config[this.serviceIdentifier];
    this.config = new AWS.Config(AWS.config);
    if (svcConfig) this.config.update(svcConfig, true);
    if (config) this.config.update(config, true);

    this.validateService();
    if (!this.config.endpoint) regionConfig.configureEndpoint(this);

    this.config.endpoint = this.endpointFromTemplate(this.config.endpoint);
    this.setEndpoint(this.config.endpoint);
    //enable attaching listeners to service client
    AWS.SequentialExecutor.call(this);
    AWS.Service.addDefaultMonitoringListeners(this);
    if ((this.config.clientSideMonitoring || AWS.Service._clientSideMonitoring) && this.publisher) {
      var publisher = this.publisher;
      this.addNamedListener('PUBLISH_API_CALL', 'apiCall', function PUBLISH_API_CALL(event) {
        process.nextTick(function() {publisher.eventHandler(event);});
      });
      this.addNamedListener('PUBLISH_API_ATTEMPT', 'apiCallAttempt', function PUBLISH_API_ATTEMPT(event) {
        process.nextTick(function() {publisher.eventHandler(event);});
      });
    }
  },

  /**
   * @api private
   */
  validateService: function validateService() {
  },

  /**
   * @api private
   */
  loadServiceClass: function loadServiceClass(serviceConfig) {
    var config = serviceConfig;
    if (!AWS.util.isEmpty(this.api)) {
      return null;
    } else if (config.apiConfig) {
      return AWS.Service.defineServiceApi(this.constructor, config.apiConfig);
    } else if (!this.constructor.services) {
      return null;
    } else {
      config = new AWS.Config(AWS.config);
      config.update(serviceConfig, true);
      var version = config.apiVersions[this.constructor.serviceIdentifier];
      version = version || config.apiVersion;
      return this.getLatestServiceClass(version);
    }
  },

  /**
   * @api private
   */
  getLatestServiceClass: function getLatestServiceClass(version) {
    version = this.getLatestServiceVersion(version);
    if (this.constructor.services[version] === null) {
      AWS.Service.defineServiceApi(this.constructor, version);
    }

    return this.constructor.services[version];
  },

  /**
   * @api private
   */
  getLatestServiceVersion: function getLatestServiceVersion(version) {
    if (!this.constructor.services || this.constructor.services.length === 0) {
      throw new Error('No services defined on ' +
                      this.constructor.serviceIdentifier);
    }

    if (!version) {
      version = 'latest';
    } else if (AWS.util.isType(version, Date)) {
      version = AWS.util.date.iso8601(version).split('T')[0];
    }

    if (Object.hasOwnProperty(this.constructor.services, version)) {
      return version;
    }

    var keys = Object.keys(this.constructor.services).sort();
    var selectedVersion = null;
    for (var i = keys.length - 1; i >= 0; i--) {
      // versions that end in "*" are not available on disk and can be
      // skipped, so do not choose these as selectedVersions
      if (keys[i][keys[i].length - 1] !== '*') {
        selectedVersion = keys[i];
      }
      if (keys[i].substr(0, 10) <= version) {
        return selectedVersion;
      }
    }

    throw new Error('Could not find ' + this.constructor.serviceIdentifier +
                    ' API to satisfy version constraint `' + version + '\'');
  },

  /**
   * @api private
   */
  api: {},

  /**
   * @api private
   */
  defaultRetryCount: 3,

  /**
   * @api private
   */
  customizeRequests: function customizeRequests(callback) {
    if (!callback) {
      this.customRequestHandler = null;
    } else if (typeof callback === 'function') {
      this.customRequestHandler = callback;
    } else {
      throw new Error('Invalid callback type \'' + typeof callback + '\' provided in customizeRequests');
    }
  },

  /**
   * Calls an operation on a service with the given input parameters.
   *
   * @param operation [String] the name of the operation to call on the service.
   * @param params [map] a map of input options for the operation
   * @callback callback function(err, data)
   *   If a callback is supplied, it is called when a response is returned
   *   from the service.
   *   @param err [Error] the error object returned from the request.
   *     Set to `null` if the request is successful.
   *   @param data [Object] the de-serialized data returned from
   *     the request. Set to `null` if a request error occurs.
   */
  makeRequest: function makeRequest(operation, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = null;
    }

    params = params || {};
    if (this.config.params) { // copy only toplevel bound params
      var rules = this.api.operations[operation];
      if (rules) {
        params = AWS.util.copy(params);
        AWS.util.each(this.config.params, function(key, value) {
          if (rules.input.members[key]) {
            if (params[key] === undefined || params[key] === null) {
              params[key] = value;
            }
          }
        });
      }
    }

    var request = new AWS.Request(this, operation, params);
    this.addAllRequestListeners(request);
    this.attachMonitoringEmitter(request);
    if (callback) request.send(callback);
    return request;
  },

  /**
   * Calls an operation on a service with the given input parameters, without
   * any authentication data. This method is useful for "public" API operations.
   *
   * @param operation [String] the name of the operation to call on the service.
   * @param params [map] a map of input options for the operation
   * @callback callback function(err, data)
   *   If a callback is supplied, it is called when a response is returned
   *   from the service.
   *   @param err [Error] the error object returned from the request.
   *     Set to `null` if the request is successful.
   *   @param data [Object] the de-serialized data returned from
   *     the request. Set to `null` if a request error occurs.
   */
  makeUnauthenticatedRequest: function makeUnauthenticatedRequest(operation, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    var request = this.makeRequest(operation, params).toUnauthenticated();
    return callback ? request.send(callback) : request;
  },

  /**
   * Waits for a given state
   *
   * @param state [String] the state on the service to wait for
   * @param params [map] a map of parameters to pass with each request
   * @option params $waiter [map] a map of configuration options for the waiter
   * @option params $waiter.delay [Number] The number of seconds to wait between
   *                                       requests
   * @option params $waiter.maxAttempts [Number] The maximum number of requests
   *                                             to send while waiting
   * @callback callback function(err, data)
   *   If a callback is supplied, it is called when a response is returned
   *   from the service.
   *   @param err [Error] the error object returned from the request.
   *     Set to `null` if the request is successful.
   *   @param data [Object] the de-serialized data returned from
   *     the request. Set to `null` if a request error occurs.
   */
  waitFor: function waitFor(state, params, callback) {
    var waiter = new AWS.ResourceWaiter(this, state);
    return waiter.wait(params, callback);
  },

  /**
   * @api private
   */
  addAllRequestListeners: function addAllRequestListeners(request) {
    var list = [AWS.events, AWS.EventListeners.Core, this.serviceInterface(),
                AWS.EventListeners.CorePost];
    for (var i = 0; i < list.length; i++) {
      if (list[i]) request.addListeners(list[i]);
    }

    // disable parameter validation
    if (!this.config.paramValidation) {
      request.removeListener('validate',
        AWS.EventListeners.Core.VALIDATE_PARAMETERS);
    }

    if (this.config.logger) { // add logging events
      request.addListeners(AWS.EventListeners.Logger);
    }

    this.setupRequestListeners(request);
    // call prototype's customRequestHandler
    if (typeof this.constructor.prototype.customRequestHandler === 'function') {
      this.constructor.prototype.customRequestHandler(request);
    }
    // call instance's customRequestHandler
    if (Object.prototype.hasOwnProperty.call(this, 'customRequestHandler') && typeof this.customRequestHandler === 'function') {
      this.customRequestHandler(request);
    }
  },

  /**
   * Event recording metrics for a whole API call.
   * @returns {object} a subset of api call metrics
   * @api private
   */
  apiCallEvent: function apiCallEvent(request) {
    var api = request.service.api.operations[request.operation];
    var monitoringEvent = {
      Type: 'ApiCall',
      Api: api ? api.name : request.operation,
      Version: 1,
      Service: request.service.api.serviceId || request.service.api.endpointPrefix,
      Region: request.httpRequest.region,
      MaxRetriesExceeded: 0,
      UserAgent: request.httpRequest.getUserAgent(),
    };
    var response = request.response;
    if (response.httpResponse.statusCode) {
      monitoringEvent.FinalHttpStatusCode = response.httpResponse.statusCode;
    }
    if (response.error) {
      var error = response.error;
      var statusCode = response.httpResponse.statusCode;
      if (statusCode > 299) {
        if (error.code) monitoringEvent.FinalAwsException = error.code;
        if (error.message) monitoringEvent.FinalAwsExceptionMessage = error.message;
      } else {
        if (error.code || error.name) monitoringEvent.FinalSdkException = error.code || error.name;
        if (error.message) monitoringEvent.FinalSdkExceptionMessage = error.message;
      }
    }
    return monitoringEvent;
  },

  /**
   * Event recording metrics for an API call attempt.
   * @returns {object} a subset of api call attempt metrics
   * @api private
   */
  apiAttemptEvent: function apiAttemptEvent(request) {
    var api = request.service.api.operations[request.operation];
    var monitoringEvent = {
      Type: 'ApiCallAttempt',
      Api: api ? api.name : request.operation,
      Version: 1,
      Service: request.service.api.serviceId || request.service.api.endpointPrefix,
      Fqdn: request.httpRequest.endpoint.hostname,
      UserAgent: request.httpRequest.getUserAgent(),
    };
    var response = request.response;
    if (response.httpResponse.statusCode) {
      monitoringEvent.HttpStatusCode = response.httpResponse.statusCode;
    }
    if (
      !request._unAuthenticated &&
      request.service.config.credentials &&
      request.service.config.credentials.accessKeyId
    ) {
      monitoringEvent.AccessKey = request.service.config.credentials.accessKeyId;
    }
    if (!response.httpResponse.headers) return monitoringEvent;
    if (request.httpRequest.headers['x-amz-security-token']) {
      monitoringEvent.SessionToken = request.httpRequest.headers['x-amz-security-token'];
    }
    if (response.httpResponse.headers['x-amzn-requestid']) {
      monitoringEvent.XAmznRequestId = response.httpResponse.headers['x-amzn-requestid'];
    }
    if (response.httpResponse.headers['x-amz-request-id']) {
      monitoringEvent.XAmzRequestId = response.httpResponse.headers['x-amz-request-id'];
    }
    if (response.httpResponse.headers['x-amz-id-2']) {
      monitoringEvent.XAmzId2 = response.httpResponse.headers['x-amz-id-2'];
    }
    return monitoringEvent;
  },

  /**
   * Add metrics of failed request.
   * @api private
   */
  attemptFailEvent: function attemptFailEvent(request) {
    var monitoringEvent = this.apiAttemptEvent(request);
    var response = request.response;
    var error = response.error;
    if (response.httpResponse.statusCode > 299 ) {
      if (error.code) monitoringEvent.AwsException = error.code;
      if (error.message) monitoringEvent.AwsExceptionMessage = error.message;
    } else {
      if (error.code || error.name) monitoringEvent.SdkException = error.code || error.name;
      if (error.message) monitoringEvent.SdkExceptionMessage = error.message;
    }
    return monitoringEvent;
  },

  /**
   * Attach listeners to request object to fetch metrics of each request
   * and emit data object through \'ApiCall\' and \'ApiCallAttempt\' events.
   * @api private
   */
  attachMonitoringEmitter: function attachMonitoringEmitter(request) {
    var attemptTimestamp; //timestamp marking the beginning of a request attempt
    var attemptStartRealTime; //Start time of request attempt. Used to calculating attemptLatency
    var attemptLatency; //latency from request sent out to http response reaching SDK
    var callStartRealTime; //Start time of API call. Used to calculating API call latency
    var attemptCount = 0; //request.retryCount is not reliable here
    var region; //region cache region for each attempt since it can be updated in plase (e.g. s3)
    var callTimestamp; //timestamp when the request is created
    var self = this;
    var addToHead = true;

    request.on('validate', function () {
      callStartRealTime = AWS.util.realClock.now();
      callTimestamp = Date.now();
    }, addToHead);
    request.on('sign', function () {
      attemptStartRealTime = AWS.util.realClock.now();
      attemptTimestamp = Date.now();
      region = request.httpRequest.region;
      attemptCount++;
    }, addToHead);
    request.on('validateResponse', function() {
      attemptLatency = Math.round(AWS.util.realClock.now() - attemptStartRealTime);
    });
    request.addNamedListener('API_CALL_ATTEMPT', 'success', function API_CALL_ATTEMPT() {
      var apiAttemptEvent = self.apiAttemptEvent(request);
      apiAttemptEvent.Timestamp = attemptTimestamp;
      apiAttemptEvent.AttemptLatency = attemptLatency >= 0 ? attemptLatency : 0;
      apiAttemptEvent.Region = region;
      self.emit('apiCallAttempt', [apiAttemptEvent]);
    });
    request.addNamedListener('API_CALL_ATTEMPT_RETRY', 'retry', function API_CALL_ATTEMPT_RETRY() {
      var apiAttemptEvent = self.attemptFailEvent(request);
      apiAttemptEvent.Timestamp = attemptTimestamp;
      //attemptLatency may not be available if fail before response
      attemptLatency = attemptLatency ||
        Math.round(AWS.util.realClock.now() - attemptStartRealTime);
      apiAttemptEvent.AttemptLatency = attemptLatency >= 0 ? attemptLatency : 0;
      apiAttemptEvent.Region = region;
      self.emit('apiCallAttempt', [apiAttemptEvent]);
    });
    request.addNamedListener('API_CALL', 'complete', function API_CALL() {
      var apiCallEvent = self.apiCallEvent(request);
      apiCallEvent.AttemptCount = attemptCount;
      if (apiCallEvent.AttemptCount <= 0) return;
      apiCallEvent.Timestamp = callTimestamp;
      var latency = Math.round(AWS.util.realClock.now() - callStartRealTime);
      apiCallEvent.Latency = latency >= 0 ? latency : 0;
      var response = request.response;
      if (
        response.error &&
        response.error.retryable &&
        typeof response.retryCount === 'number' &&
        typeof response.maxRetries === 'number' &&
        (response.retryCount >= response.maxRetries)
      ) {
        apiCallEvent.MaxRetriesExceeded = 1;
      }
      self.emit('apiCall', [apiCallEvent]);
    });
  },

  /**
   * Override this method to setup any custom request listeners for each
   * new request to the service.
   *
   * @method_abstract This is an abstract method.
   */
  setupRequestListeners: function setupRequestListeners(request) {
  },

  /**
   * Gets the signing name for a given request
   * @api private
   */
  getSigningName: function getSigningName() {
    return this.api.signingName || this.api.endpointPrefix;
  },

  /**
   * Gets the signer class for a given request
   * @api private
   */
  getSignerClass: function getSignerClass(request) {
    var version;
    // get operation authtype if present
    var operation = null;
    var authtype = '';
    if (request) {
      var operations = request.service.api.operations || {};
      operation = operations[request.operation] || null;
      authtype = operation ? operation.authtype : '';
    }
    if (this.config.signatureVersion) {
      version = this.config.signatureVersion;
    } else if (authtype === 'v4' || authtype === 'v4-unsigned-body') {
      version = 'v4';
    } else {
      version = this.api.signatureVersion;
    }
    return AWS.Signers.RequestSigner.getVersion(version);
  },

  /**
   * @api private
   */
  serviceInterface: function serviceInterface() {
    switch (this.api.protocol) {
      case 'ec2': return AWS.EventListeners.Query;
      case 'query': return AWS.EventListeners.Query;
      case 'json': return AWS.EventListeners.Json;
      case 'rest-json': return AWS.EventListeners.RestJson;
      case 'rest-xml': return AWS.EventListeners.RestXml;
    }
    if (this.api.protocol) {
      throw new Error('Invalid service `protocol\' ' +
        this.api.protocol + ' in API config');
    }
  },

  /**
   * @api private
   */
  successfulResponse: function successfulResponse(resp) {
    return resp.httpResponse.statusCode < 300;
  },

  /**
   * How many times a failed request should be retried before giving up.
   * the defaultRetryCount can be overriden by service classes.
   *
   * @api private
   */
  numRetries: function numRetries() {
    if (this.config.maxRetries !== undefined) {
      return this.config.maxRetries;
    } else {
      return this.defaultRetryCount;
    }
  },

  /**
   * @api private
   */
  retryDelays: function retryDelays(retryCount, err) {
    return AWS.util.calculateRetryDelay(retryCount, this.config.retryDelayOptions, err);
  },

  /**
   * @api private
   */
  retryableError: function retryableError(error) {
    if (this.timeoutError(error)) return true;
    if (this.networkingError(error)) return true;
    if (this.expiredCredentialsError(error)) return true;
    if (this.throttledError(error)) return true;
    if (error.statusCode >= 500) return true;
    return false;
  },

  /**
   * @api private
   */
  networkingError: function networkingError(error) {
    return error.code === 'NetworkingError';
  },

  /**
   * @api private
   */
  timeoutError: function timeoutError(error) {
    return error.code === 'TimeoutError';
  },

  /**
   * @api private
   */
  expiredCredentialsError: function expiredCredentialsError(error) {
    // TODO : this only handles *one* of the expired credential codes
    return (error.code === 'ExpiredTokenException');
  },

  /**
   * @api private
   */
  clockSkewError: function clockSkewError(error) {
    switch (error.code) {
      case 'RequestTimeTooSkewed':
      case 'RequestExpired':
      case 'InvalidSignatureException':
      case 'SignatureDoesNotMatch':
      case 'AuthFailure':
      case 'RequestInTheFuture':
        return true;
      default: return false;
    }
  },

  /**
   * @api private
   */
  getSkewCorrectedDate: function getSkewCorrectedDate() {
    return new Date(Date.now() + this.config.systemClockOffset);
  },

  /**
   * @api private
   */
  applyClockOffset: function applyClockOffset(newServerTime) {
    if (newServerTime) {
      this.config.systemClockOffset = newServerTime - Date.now();
    }
  },

  /**
   * @api private
   */
  isClockSkewed: function isClockSkewed(newServerTime) {
    if (newServerTime) {
      return Math.abs(this.getSkewCorrectedDate().getTime() - newServerTime) >= 300000;
    }
  },

  /**
   * @api private
   */
  throttledError: function throttledError(error) {
    // this logic varies between services
    if (error.statusCode === 429) return true;
    switch (error.code) {
      case 'ProvisionedThroughputExceededException':
      case 'Throttling':
      case 'ThrottlingException':
      case 'RequestLimitExceeded':
      case 'RequestThrottled':
      case 'RequestThrottledException':
      case 'TooManyRequestsException':
      case 'TransactionInProgressException': //dynamodb
      case 'EC2ThrottledException':
        return true;
      default:
        return false;
    }
  },

  /**
   * @api private
   */
  endpointFromTemplate: function endpointFromTemplate(endpoint) {
    if (typeof endpoint !== 'string') return endpoint;

    var e = endpoint;
    e = e.replace(/\{service\}/g, this.api.endpointPrefix);
    e = e.replace(/\{region\}/g, this.config.region);
    e = e.replace(/\{scheme\}/g, this.config.sslEnabled ? 'https' : 'http');
    return e;
  },

  /**
   * @api private
   */
  setEndpoint: function setEndpoint(endpoint) {
    this.endpoint = new AWS.Endpoint(endpoint, this.config);
  },

  /**
   * @api private
   */
  paginationConfig: function paginationConfig(operation, throwException) {
    var paginator = this.api.operations[operation].paginator;
    if (!paginator) {
      if (throwException) {
        var e = new Error();
        throw AWS.util.error(e, 'No pagination configuration for ' + operation);
      }
      return null;
    }

    return paginator;
  }
});

AWS.util.update(AWS.Service, {

  /**
   * Adds one method for each operation described in the api configuration
   *
   * @api private
   */
  defineMethods: function defineMethods(svc) {
    AWS.util.each(svc.prototype.api.operations, function iterator(method) {
      if (svc.prototype[method]) return;
      var operation = svc.prototype.api.operations[method];
      if (operation.authtype === 'none') {
        svc.prototype[method] = function (params, callback) {
          return this.makeUnauthenticatedRequest(method, params, callback);
        };
      } else {
        svc.prototype[method] = function (params, callback) {
          return this.makeRequest(method, params, callback);
        };
      }
    });
  },

  /**
   * Defines a new Service class using a service identifier and list of versions
   * including an optional set of features (functions) to apply to the class
   * prototype.
   *
   * @param serviceIdentifier [String] the identifier for the service
   * @param versions [Array<String>] a list of versions that work with this
   *   service
   * @param features [Object] an object to attach to the prototype
   * @return [Class<Service>] the service class defined by this function.
   */
  defineService: function defineService(serviceIdentifier, versions, features) {
    AWS.Service._serviceMap[serviceIdentifier] = true;
    if (!Array.isArray(versions)) {
      features = versions;
      versions = [];
    }

    var svc = inherit(AWS.Service, features || {});

    if (typeof serviceIdentifier === 'string') {
      AWS.Service.addVersions(svc, versions);

      var identifier = svc.serviceIdentifier || serviceIdentifier;
      svc.serviceIdentifier = identifier;
    } else { // defineService called with an API
      svc.prototype.api = serviceIdentifier;
      AWS.Service.defineMethods(svc);
    }
    AWS.SequentialExecutor.call(this.prototype);
    //util.clientSideMonitoring is only available in node
    if (!this.prototype.publisher && AWS.util.clientSideMonitoring) {
      var Publisher = AWS.util.clientSideMonitoring.Publisher;
      var configProvider = AWS.util.clientSideMonitoring.configProvider;
      var publisherConfig = configProvider();
      this.prototype.publisher = new Publisher(publisherConfig);
      if (publisherConfig.enabled) {
        //if csm is enabled in environment, SDK should send all metrics
        AWS.Service._clientSideMonitoring = true;
      }
    }
    AWS.SequentialExecutor.call(svc.prototype);
    AWS.Service.addDefaultMonitoringListeners(svc.prototype);
    return svc;
  },

  /**
   * @api private
   */
  addVersions: function addVersions(svc, versions) {
    if (!Array.isArray(versions)) versions = [versions];

    svc.services = svc.services || {};
    for (var i = 0; i < versions.length; i++) {
      if (svc.services[versions[i]] === undefined) {
        svc.services[versions[i]] = null;
      }
    }

    svc.apiVersions = Object.keys(svc.services).sort();
  },

  /**
   * @api private
   */
  defineServiceApi: function defineServiceApi(superclass, version, apiConfig) {
    var svc = inherit(superclass, {
      serviceIdentifier: superclass.serviceIdentifier
    });

    function setApi(api) {
      if (api.isApi) {
        svc.prototype.api = api;
      } else {
        svc.prototype.api = new Api(api, {
          serviceIdentifier: superclass.serviceIdentifier
        });
      }
    }

    if (typeof version === 'string') {
      if (apiConfig) {
        setApi(apiConfig);
      } else {
        try {
          setApi(AWS.apiLoader(superclass.serviceIdentifier, version));
        } catch (err) {
          throw AWS.util.error(err, {
            message: 'Could not find API configuration ' +
              superclass.serviceIdentifier + '-' + version
          });
        }
      }
      if (!Object.prototype.hasOwnProperty.call(superclass.services, version)) {
        superclass.apiVersions = superclass.apiVersions.concat(version).sort();
      }
      superclass.services[version] = svc;
    } else {
      setApi(version);
    }

    AWS.Service.defineMethods(svc);
    return svc;
  },

  /**
   * @api private
   */
  hasService: function(identifier) {
    return Object.prototype.hasOwnProperty.call(AWS.Service._serviceMap, identifier);
  },

  /**
   * @param attachOn attach default monitoring listeners to object
   *
   * Each monitoring event should be emitted from service client to service constructor prototype and then
   * to global service prototype like bubbling up. These default monitoring events listener will transfer
   * the monitoring events to the upper layer.
   * @api private
   */
  addDefaultMonitoringListeners: function addDefaultMonitoringListeners(attachOn) {
    attachOn.addNamedListener('MONITOR_EVENTS_BUBBLE', 'apiCallAttempt', function EVENTS_BUBBLE(event) {
      var baseClass = Object.getPrototypeOf(attachOn);
      if (baseClass._events) baseClass.emit('apiCallAttempt', [event]);
    });
    attachOn.addNamedListener('CALL_EVENTS_BUBBLE', 'apiCall', function CALL_EVENTS_BUBBLE(event) {
      var baseClass = Object.getPrototypeOf(attachOn);
      if (baseClass._events) baseClass.emit('apiCall', [event]);
    });
  },

  /**
   * @api private
   */
  _serviceMap: {}
});

AWS.util.mixin(AWS.Service, AWS.SequentialExecutor);

/**
 * @api private
 */
module.exports = AWS.Service;


/***/ }),

/***/ 1055:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var resolveRegionalEndpointsFlag = __nccwpck_require__(5566);
var ENV_REGIONAL_ENDPOINT_ENABLED = 'AWS_STS_REGIONAL_ENDPOINTS';
var CONFIG_REGIONAL_ENDPOINT_ENABLED = 'sts_regional_endpoints';

AWS.util.update(AWS.STS.prototype, {
  /**
   * @overload credentialsFrom(data, credentials = null)
   *   Creates a credentials object from STS response data containing
   *   credentials information. Useful for quickly setting AWS credentials.
   *
   *   @note This is a low-level utility function. If you want to load temporary
   *     credentials into your process for subsequent requests to AWS resources,
   *     you should use {AWS.TemporaryCredentials} instead.
   *   @param data [map] data retrieved from a call to {getFederatedToken},
   *     {getSessionToken}, {assumeRole}, or {assumeRoleWithWebIdentity}.
   *   @param credentials [AWS.Credentials] an optional credentials object to
   *     fill instead of creating a new object. Useful when modifying an
   *     existing credentials object from a refresh call.
   *   @return [AWS.TemporaryCredentials] the set of temporary credentials
   *     loaded from a raw STS operation response.
   *   @example Using credentialsFrom to load global AWS credentials
   *     var sts = new AWS.STS();
   *     sts.getSessionToken(function (err, data) {
   *       if (err) console.log("Error getting credentials");
   *       else {
   *         AWS.config.credentials = sts.credentialsFrom(data);
   *       }
   *     });
   *   @see AWS.TemporaryCredentials
   */
  credentialsFrom: function credentialsFrom(data, credentials) {
    if (!data) return null;
    if (!credentials) credentials = new AWS.TemporaryCredentials();
    credentials.expired = false;
    credentials.accessKeyId = data.Credentials.AccessKeyId;
    credentials.secretAccessKey = data.Credentials.SecretAccessKey;
    credentials.sessionToken = data.Credentials.SessionToken;
    credentials.expireTime = data.Credentials.Expiration;
    return credentials;
  },

  assumeRoleWithWebIdentity: function assumeRoleWithWebIdentity(params, callback) {
    return this.makeUnauthenticatedRequest('assumeRoleWithWebIdentity', params, callback);
  },

  assumeRoleWithSAML: function assumeRoleWithSAML(params, callback) {
    return this.makeUnauthenticatedRequest('assumeRoleWithSAML', params, callback);
  },

  /**
   * @api private
   */
  setupRequestListeners: function setupRequestListeners(request) {
    request.addListener('validate', this.optInRegionalEndpoint, true);
  },

  /**
   * @api private
   */
  optInRegionalEndpoint: function optInRegionalEndpoint(req) {
    var service = req.service;
    var config = service.config;
    config.stsRegionalEndpoints = resolveRegionalEndpointsFlag(service._originalConfig, {
      env: ENV_REGIONAL_ENDPOINT_ENABLED,
      sharedConfig: CONFIG_REGIONAL_ENDPOINT_ENABLED,
      clientConfig: 'stsRegionalEndpoints'
    });
    if (
      config.stsRegionalEndpoints === 'regional' &&
      service.isGlobalEndpoint
    ) {
      //client will throw if region is not supplied; request will be signed with specified region
      if (!config.region) {
        throw AWS.util.error(new Error(),
          {code: 'ConfigError', message: 'Missing region in config'});
      }
      var insertPoint = config.endpoint.indexOf('.amazonaws.com');
      var regionalEndpoint = config.endpoint.substring(0, insertPoint) +
        '.' + config.region + config.endpoint.substring(insertPoint);
      req.httpRequest.updateEndpoint(regionalEndpoint);
      req.httpRequest.region = config.region;
    }
  }

});


/***/ }),

/***/ 9697:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var IniLoader = __nccwpck_require__(5417).IniLoader;
/**
 * Singleton object to load specified config/credentials files.
 * It will cache all the files ever loaded;
 */
module.exports.b = new IniLoader();


/***/ }),

/***/ 5417:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var os = __nccwpck_require__(2087);
var path = __nccwpck_require__(5622);

function parseFile(filename, isConfig) {
    var content = AWS.util.ini.parse(AWS.util.readFileSync(filename));
    var tmpContent = {};
    Object.keys(content).forEach(function(profileName) {
      var profileContent = content[profileName];
      profileName = isConfig ? profileName.replace(/^profile\s/, '') : profileName;
      Object.defineProperty(tmpContent, profileName, {
        value: profileContent,
        enumerable: true
      });
    });
    return tmpContent;
}

/**
 * Ini file loader class the same as that used in the SDK. It loads and
 * parses config and credentials files in .ini format and cache the content
 * to assure files are only read once.
 * Note that calling operations on the instance instantiated from this class
 * won't affect the behavior of SDK since SDK uses an internal singleton of
 * this class.
 * @!macro nobrowser
 */
AWS.IniLoader = AWS.util.inherit({
  constructor: function IniLoader() {
    this.resolvedProfiles = {};
  },

  /** Remove all cached files. Used after config files are updated. */
  clearCachedFiles: function clearCachedFiles() {
    this.resolvedProfiles = {};
  },

/**
 * Load configurations from config/credentials files and cache them
 * for later use. If no file is specified it will try to load default
 * files.
 * @param options [map] information describing the file
 * @option options filename [String] ('~/.aws/credentials' or defined by
 *   AWS_SHARED_CREDENTIALS_FILE process env var or '~/.aws/config' if
 *   isConfig is set to true)
 *   path to the file to be read.
 * @option options isConfig [Boolean] (false) True to read config file.
 * @return [map<String,String>] object containing contents from file in key-value
 *   pairs.
 */
  loadFrom: function loadFrom(options) {
    options = options || {};
    var isConfig = options.isConfig === true;
    var filename = options.filename || this.getDefaultFilePath(isConfig);
    if (!this.resolvedProfiles[filename]) {
      var fileContent = this.parseFile(filename, isConfig);
      Object.defineProperty(this.resolvedProfiles, filename, { value: fileContent });
    }
    return this.resolvedProfiles[filename];
  },

  /**
   * @api private
   */
  parseFile: parseFile,

  /**
   * @api private
   */
  getDefaultFilePath: function getDefaultFilePath(isConfig) {
    return path.join(
      this.getHomeDir(),
      '.aws',
      isConfig ? 'config' : 'credentials'
    );
  },

  /**
   * @api private
   */
  getHomeDir: function getHomeDir() {
    var env = process.env;
    var home = env.HOME ||
      env.USERPROFILE ||
      (env.HOMEPATH ? ((env.HOMEDRIVE || 'C:/') + env.HOMEPATH) : null);

    if (home) {
      return home;
    }

    if (typeof os.homedir === 'function') {
      return os.homedir();
    }

    throw AWS.util.error(
      new Error('Cannot load credentials, HOME path not set')
    );
  }
});

var IniLoader = AWS.IniLoader;

module.exports = {
  IniLoader: IniLoader,
  parseFile: parseFile,
};


/***/ }),

/***/ 328:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var inherit = AWS.util.inherit;

/**
 * @api private
 */
var expiresHeader = 'presigned-expires';

/**
 * @api private
 */
function signedUrlBuilder(request) {
  var expires = request.httpRequest.headers[expiresHeader];
  var signerClass = request.service.getSignerClass(request);

  delete request.httpRequest.headers['User-Agent'];
  delete request.httpRequest.headers['X-Amz-User-Agent'];

  if (signerClass === AWS.Signers.V4) {
    if (expires > 604800) { // one week expiry is invalid
      var message = 'Presigning does not support expiry time greater ' +
                    'than a week with SigV4 signing.';
      throw AWS.util.error(new Error(), {
        code: 'InvalidExpiryTime', message: message, retryable: false
      });
    }
    request.httpRequest.headers[expiresHeader] = expires;
  } else if (signerClass === AWS.Signers.S3) {
    var now = request.service ? request.service.getSkewCorrectedDate() : AWS.util.date.getDate();
    request.httpRequest.headers[expiresHeader] = parseInt(
      AWS.util.date.unixTimestamp(now) + expires, 10).toString();
  } else {
    throw AWS.util.error(new Error(), {
      message: 'Presigning only supports S3 or SigV4 signing.',
      code: 'UnsupportedSigner', retryable: false
    });
  }
}

/**
 * @api private
 */
function signedUrlSigner(request) {
  var endpoint = request.httpRequest.endpoint;
  var parsedUrl = AWS.util.urlParse(request.httpRequest.path);
  var queryParams = {};

  if (parsedUrl.search) {
    queryParams = AWS.util.queryStringParse(parsedUrl.search.substr(1));
  }

  var auth = request.httpRequest.headers['Authorization'].split(' ');
  if (auth[0] === 'AWS') {
    auth = auth[1].split(':');
    queryParams['Signature'] = auth.pop();
    queryParams['AWSAccessKeyId'] = auth.join(':');

    AWS.util.each(request.httpRequest.headers, function (key, value) {
      if (key === expiresHeader) key = 'Expires';
      if (key.indexOf('x-amz-meta-') === 0) {
        // Delete existing, potentially not normalized key
        delete queryParams[key];
        key = key.toLowerCase();
      }
      queryParams[key] = value;
    });
    delete request.httpRequest.headers[expiresHeader];
    delete queryParams['Authorization'];
    delete queryParams['Host'];
  } else if (auth[0] === 'AWS4-HMAC-SHA256') { // SigV4 signing
    auth.shift();
    var rest = auth.join(' ');
    var signature = rest.match(/Signature=(.*?)(?:,|\s|\r?\n|$)/)[1];
    queryParams['X-Amz-Signature'] = signature;
    delete queryParams['Expires'];
  }

  // build URL
  endpoint.pathname = parsedUrl.pathname;
  endpoint.search = AWS.util.queryParamsToString(queryParams);
}

/**
 * @api private
 */
AWS.Signers.Presign = inherit({
  /**
   * @api private
   */
  sign: function sign(request, expireTime, callback) {
    request.httpRequest.headers[expiresHeader] = expireTime || 3600;
    request.on('build', signedUrlBuilder);
    request.on('sign', signedUrlSigner);
    request.removeListener('afterBuild',
      AWS.EventListeners.Core.SET_CONTENT_LENGTH);
    request.removeListener('afterBuild',
      AWS.EventListeners.Core.COMPUTE_SHA256);

    request.emit('beforePresign', [request]);

    if (callback) {
      request.build(function() {
        if (this.response.error) callback(this.response.error);
        else {
          callback(null, AWS.util.urlFormat(request.httpRequest.endpoint));
        }
      });
    } else {
      request.build();
      if (request.response.error) throw request.response.error;
      return AWS.util.urlFormat(request.httpRequest.endpoint);
    }
  }
});

/**
 * @api private
 */
module.exports = AWS.Signers.Presign;


/***/ }),

/***/ 9897:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);

var inherit = AWS.util.inherit;

/**
 * @api private
 */
AWS.Signers.RequestSigner = inherit({
  constructor: function RequestSigner(request) {
    this.request = request;
  },

  setServiceClientId: function setServiceClientId(id) {
    this.serviceClientId = id;
  },

  getServiceClientId: function getServiceClientId() {
    return this.serviceClientId;
  }
});

AWS.Signers.RequestSigner.getVersion = function getVersion(version) {
  switch (version) {
    case 'v2': return AWS.Signers.V2;
    case 'v3': return AWS.Signers.V3;
    case 's3v4': return AWS.Signers.V4;
    case 'v4': return AWS.Signers.V4;
    case 's3': return AWS.Signers.S3;
    case 'v3https': return AWS.Signers.V3Https;
  }
  throw new Error('Unknown signing version ' + version);
};

__nccwpck_require__(8489);
__nccwpck_require__(6458);
__nccwpck_require__(4473);
__nccwpck_require__(6529);
__nccwpck_require__(8616);
__nccwpck_require__(328);


/***/ }),

/***/ 8616:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var inherit = AWS.util.inherit;

/**
 * @api private
 */
AWS.Signers.S3 = inherit(AWS.Signers.RequestSigner, {
  /**
   * When building the stringToSign, these sub resource params should be
   * part of the canonical resource string with their NON-decoded values
   */
  subResources: {
    'acl': 1,
    'accelerate': 1,
    'analytics': 1,
    'cors': 1,
    'lifecycle': 1,
    'delete': 1,
    'inventory': 1,
    'location': 1,
    'logging': 1,
    'metrics': 1,
    'notification': 1,
    'partNumber': 1,
    'policy': 1,
    'requestPayment': 1,
    'replication': 1,
    'restore': 1,
    'tagging': 1,
    'torrent': 1,
    'uploadId': 1,
    'uploads': 1,
    'versionId': 1,
    'versioning': 1,
    'versions': 1,
    'website': 1
  },

  // when building the stringToSign, these querystring params should be
  // part of the canonical resource string with their NON-encoded values
  responseHeaders: {
    'response-content-type': 1,
    'response-content-language': 1,
    'response-expires': 1,
    'response-cache-control': 1,
    'response-content-disposition': 1,
    'response-content-encoding': 1
  },

  addAuthorization: function addAuthorization(credentials, date) {
    if (!this.request.headers['presigned-expires']) {
      this.request.headers['X-Amz-Date'] = AWS.util.date.rfc822(date);
    }

    if (credentials.sessionToken) {
      // presigned URLs require this header to be lowercased
      this.request.headers['x-amz-security-token'] = credentials.sessionToken;
    }

    var signature = this.sign(credentials.secretAccessKey, this.stringToSign());
    var auth = 'AWS ' + credentials.accessKeyId + ':' + signature;

    this.request.headers['Authorization'] = auth;
  },

  stringToSign: function stringToSign() {
    var r = this.request;

    var parts = [];
    parts.push(r.method);
    parts.push(r.headers['Content-MD5'] || '');
    parts.push(r.headers['Content-Type'] || '');

    // This is the "Date" header, but we use X-Amz-Date.
    // The S3 signing mechanism requires us to pass an empty
    // string for this Date header regardless.
    parts.push(r.headers['presigned-expires'] || '');

    var headers = this.canonicalizedAmzHeaders();
    if (headers) parts.push(headers);
    parts.push(this.canonicalizedResource());

    return parts.join('\n');

  },

  canonicalizedAmzHeaders: function canonicalizedAmzHeaders() {

    var amzHeaders = [];

    AWS.util.each(this.request.headers, function (name) {
      if (name.match(/^x-amz-/i))
        amzHeaders.push(name);
    });

    amzHeaders.sort(function (a, b) {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

    var parts = [];
    AWS.util.arrayEach.call(this, amzHeaders, function (name) {
      parts.push(name.toLowerCase() + ':' + String(this.request.headers[name]));
    });

    return parts.join('\n');

  },

  canonicalizedResource: function canonicalizedResource() {

    var r = this.request;

    var parts = r.path.split('?');
    var path = parts[0];
    var querystring = parts[1];

    var resource = '';

    if (r.virtualHostedBucket)
      resource += '/' + r.virtualHostedBucket;

    resource += path;

    if (querystring) {

      // collect a list of sub resources and query params that need to be signed
      var resources = [];

      AWS.util.arrayEach.call(this, querystring.split('&'), function (param) {
        var name = param.split('=')[0];
        var value = param.split('=')[1];
        if (this.subResources[name] || this.responseHeaders[name]) {
          var subresource = { name: name };
          if (value !== undefined) {
            if (this.subResources[name]) {
              subresource.value = value;
            } else {
              subresource.value = decodeURIComponent(value);
            }
          }
          resources.push(subresource);
        }
      });

      resources.sort(function (a, b) { return a.name < b.name ? -1 : 1; });

      if (resources.length) {

        querystring = [];
        AWS.util.arrayEach(resources, function (res) {
          if (res.value === undefined) {
            querystring.push(res.name);
          } else {
            querystring.push(res.name + '=' + res.value);
          }
        });

        resource += '?' + querystring.join('&');
      }

    }

    return resource;

  },

  sign: function sign(secret, string) {
    return AWS.util.crypto.hmac(secret, string, 'base64', 'sha1');
  }
});

/**
 * @api private
 */
module.exports = AWS.Signers.S3;


/***/ }),

/***/ 8489:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var inherit = AWS.util.inherit;

/**
 * @api private
 */
AWS.Signers.V2 = inherit(AWS.Signers.RequestSigner, {
  addAuthorization: function addAuthorization(credentials, date) {

    if (!date) date = AWS.util.date.getDate();

    var r = this.request;

    r.params.Timestamp = AWS.util.date.iso8601(date);
    r.params.SignatureVersion = '2';
    r.params.SignatureMethod = 'HmacSHA256';
    r.params.AWSAccessKeyId = credentials.accessKeyId;

    if (credentials.sessionToken) {
      r.params.SecurityToken = credentials.sessionToken;
    }

    delete r.params.Signature; // delete old Signature for re-signing
    r.params.Signature = this.signature(credentials);

    r.body = AWS.util.queryParamsToString(r.params);
    r.headers['Content-Length'] = r.body.length;
  },

  signature: function signature(credentials) {
    return AWS.util.crypto.hmac(credentials.secretAccessKey, this.stringToSign(), 'base64');
  },

  stringToSign: function stringToSign() {
    var parts = [];
    parts.push(this.request.method);
    parts.push(this.request.endpoint.host.toLowerCase());
    parts.push(this.request.pathname());
    parts.push(AWS.util.queryParamsToString(this.request.params));
    return parts.join('\n');
  }

});

/**
 * @api private
 */
module.exports = AWS.Signers.V2;


/***/ }),

/***/ 6458:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var inherit = AWS.util.inherit;

/**
 * @api private
 */
AWS.Signers.V3 = inherit(AWS.Signers.RequestSigner, {
  addAuthorization: function addAuthorization(credentials, date) {

    var datetime = AWS.util.date.rfc822(date);

    this.request.headers['X-Amz-Date'] = datetime;

    if (credentials.sessionToken) {
      this.request.headers['x-amz-security-token'] = credentials.sessionToken;
    }

    this.request.headers['X-Amzn-Authorization'] =
      this.authorization(credentials, datetime);

  },

  authorization: function authorization(credentials) {
    return 'AWS3 ' +
      'AWSAccessKeyId=' + credentials.accessKeyId + ',' +
      'Algorithm=HmacSHA256,' +
      'SignedHeaders=' + this.signedHeaders() + ',' +
      'Signature=' + this.signature(credentials);
  },

  signedHeaders: function signedHeaders() {
    var headers = [];
    AWS.util.arrayEach(this.headersToSign(), function iterator(h) {
      headers.push(h.toLowerCase());
    });
    return headers.sort().join(';');
  },

  canonicalHeaders: function canonicalHeaders() {
    var headers = this.request.headers;
    var parts = [];
    AWS.util.arrayEach(this.headersToSign(), function iterator(h) {
      parts.push(h.toLowerCase().trim() + ':' + String(headers[h]).trim());
    });
    return parts.sort().join('\n') + '\n';
  },

  headersToSign: function headersToSign() {
    var headers = [];
    AWS.util.each(this.request.headers, function iterator(k) {
      if (k === 'Host' || k === 'Content-Encoding' || k.match(/^X-Amz/i)) {
        headers.push(k);
      }
    });
    return headers;
  },

  signature: function signature(credentials) {
    return AWS.util.crypto.hmac(credentials.secretAccessKey, this.stringToSign(), 'base64');
  },

  stringToSign: function stringToSign() {
    var parts = [];
    parts.push(this.request.method);
    parts.push('/');
    parts.push('');
    parts.push(this.canonicalHeaders());
    parts.push(this.request.body);
    return AWS.util.crypto.sha256(parts.join('\n'));
  }

});

/**
 * @api private
 */
module.exports = AWS.Signers.V3;


/***/ }),

/***/ 4473:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var inherit = AWS.util.inherit;

__nccwpck_require__(6458);

/**
 * @api private
 */
AWS.Signers.V3Https = inherit(AWS.Signers.V3, {
  authorization: function authorization(credentials) {
    return 'AWS3-HTTPS ' +
      'AWSAccessKeyId=' + credentials.accessKeyId + ',' +
      'Algorithm=HmacSHA256,' +
      'Signature=' + this.signature(credentials);
  },

  stringToSign: function stringToSign() {
    return this.request.headers['X-Amz-Date'];
  }
});

/**
 * @api private
 */
module.exports = AWS.Signers.V3Https;


/***/ }),

/***/ 6529:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var v4Credentials = __nccwpck_require__(2660);
var inherit = AWS.util.inherit;

/**
 * @api private
 */
var expiresHeader = 'presigned-expires';

/**
 * @api private
 */
AWS.Signers.V4 = inherit(AWS.Signers.RequestSigner, {
  constructor: function V4(request, serviceName, options) {
    AWS.Signers.RequestSigner.call(this, request);
    this.serviceName = serviceName;
    options = options || {};
    this.signatureCache = typeof options.signatureCache === 'boolean' ? options.signatureCache : true;
    this.operation = options.operation;
    this.signatureVersion = options.signatureVersion;
  },

  algorithm: 'AWS4-HMAC-SHA256',

  addAuthorization: function addAuthorization(credentials, date) {
    var datetime = AWS.util.date.iso8601(date).replace(/[:\-]|\.\d{3}/g, '');

    if (this.isPresigned()) {
      this.updateForPresigned(credentials, datetime);
    } else {
      this.addHeaders(credentials, datetime);
    }

    this.request.headers['Authorization'] =
      this.authorization(credentials, datetime);
  },

  addHeaders: function addHeaders(credentials, datetime) {
    this.request.headers['X-Amz-Date'] = datetime;
    if (credentials.sessionToken) {
      this.request.headers['x-amz-security-token'] = credentials.sessionToken;
    }
  },

  updateForPresigned: function updateForPresigned(credentials, datetime) {
    var credString = this.credentialString(datetime);
    var qs = {
      'X-Amz-Date': datetime,
      'X-Amz-Algorithm': this.algorithm,
      'X-Amz-Credential': credentials.accessKeyId + '/' + credString,
      'X-Amz-Expires': this.request.headers[expiresHeader],
      'X-Amz-SignedHeaders': this.signedHeaders()
    };

    if (credentials.sessionToken) {
      qs['X-Amz-Security-Token'] = credentials.sessionToken;
    }

    if (this.request.headers['Content-Type']) {
      qs['Content-Type'] = this.request.headers['Content-Type'];
    }
    if (this.request.headers['Content-MD5']) {
      qs['Content-MD5'] = this.request.headers['Content-MD5'];
    }
    if (this.request.headers['Cache-Control']) {
      qs['Cache-Control'] = this.request.headers['Cache-Control'];
    }

    // need to pull in any other X-Amz-* headers
    AWS.util.each.call(this, this.request.headers, function(key, value) {
      if (key === expiresHeader) return;
      if (this.isSignableHeader(key)) {
        var lowerKey = key.toLowerCase();
        // Metadata should be normalized
        if (lowerKey.indexOf('x-amz-meta-') === 0) {
          qs[lowerKey] = value;
        } else if (lowerKey.indexOf('x-amz-') === 0) {
          qs[key] = value;
        }
      }
    });

    var sep = this.request.path.indexOf('?') >= 0 ? '&' : '?';
    this.request.path += sep + AWS.util.queryParamsToString(qs);
  },

  authorization: function authorization(credentials, datetime) {
    var parts = [];
    var credString = this.credentialString(datetime);
    parts.push(this.algorithm + ' Credential=' +
      credentials.accessKeyId + '/' + credString);
    parts.push('SignedHeaders=' + this.signedHeaders());
    parts.push('Signature=' + this.signature(credentials, datetime));
    return parts.join(', ');
  },

  signature: function signature(credentials, datetime) {
    var signingKey = v4Credentials.getSigningKey(
      credentials,
      datetime.substr(0, 8),
      this.request.region,
      this.serviceName,
      this.signatureCache
    );
    return AWS.util.crypto.hmac(signingKey, this.stringToSign(datetime), 'hex');
  },

  stringToSign: function stringToSign(datetime) {
    var parts = [];
    parts.push('AWS4-HMAC-SHA256');
    parts.push(datetime);
    parts.push(this.credentialString(datetime));
    parts.push(this.hexEncodedHash(this.canonicalString()));
    return parts.join('\n');
  },

  canonicalString: function canonicalString() {
    var parts = [], pathname = this.request.pathname();
    if (this.serviceName !== 's3' && this.signatureVersion !== 's3v4') pathname = AWS.util.uriEscapePath(pathname);

    parts.push(this.request.method);
    parts.push(pathname);
    parts.push(this.request.search());
    parts.push(this.canonicalHeaders() + '\n');
    parts.push(this.signedHeaders());
    parts.push(this.hexEncodedBodyHash());
    return parts.join('\n');
  },

  canonicalHeaders: function canonicalHeaders() {
    var headers = [];
    AWS.util.each.call(this, this.request.headers, function (key, item) {
      headers.push([key, item]);
    });
    headers.sort(function (a, b) {
      return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
    });
    var parts = [];
    AWS.util.arrayEach.call(this, headers, function (item) {
      var key = item[0].toLowerCase();
      if (this.isSignableHeader(key)) {
        var value = item[1];
        if (typeof value === 'undefined' || value === null || typeof value.toString !== 'function') {
          throw AWS.util.error(new Error('Header ' + key + ' contains invalid value'), {
            code: 'InvalidHeader'
          });
        }
        parts.push(key + ':' +
          this.canonicalHeaderValues(value.toString()));
      }
    });
    return parts.join('\n');
  },

  canonicalHeaderValues: function canonicalHeaderValues(values) {
    return values.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
  },

  signedHeaders: function signedHeaders() {
    var keys = [];
    AWS.util.each.call(this, this.request.headers, function (key) {
      key = key.toLowerCase();
      if (this.isSignableHeader(key)) keys.push(key);
    });
    return keys.sort().join(';');
  },

  credentialString: function credentialString(datetime) {
    return v4Credentials.createScope(
      datetime.substr(0, 8),
      this.request.region,
      this.serviceName
    );
  },

  hexEncodedHash: function hash(string) {
    return AWS.util.crypto.sha256(string, 'hex');
  },

  hexEncodedBodyHash: function hexEncodedBodyHash() {
    var request = this.request;
    if (this.isPresigned() && this.serviceName === 's3' && !request.body) {
      return 'UNSIGNED-PAYLOAD';
    } else if (request.headers['X-Amz-Content-Sha256']) {
      return request.headers['X-Amz-Content-Sha256'];
    } else {
      return this.hexEncodedHash(this.request.body || '');
    }
  },

  unsignableHeaders: [
    'authorization',
    'content-type',
    'content-length',
    'user-agent',
    expiresHeader,
    'expect',
    'x-amzn-trace-id'
  ],

  isSignableHeader: function isSignableHeader(key) {
    if (key.toLowerCase().indexOf('x-amz-') === 0) return true;
    return this.unsignableHeaders.indexOf(key) < 0;
  },

  isPresigned: function isPresigned() {
    return this.request.headers[expiresHeader] ? true : false;
  }

});

/**
 * @api private
 */
module.exports = AWS.Signers.V4;


/***/ }),

/***/ 2660:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);

/**
 * @api private
 */
var cachedSecret = {};

/**
 * @api private
 */
var cacheQueue = [];

/**
 * @api private
 */
var maxCacheEntries = 50;

/**
 * @api private
 */
var v4Identifier = 'aws4_request';

/**
 * @api private
 */
module.exports = {
  /**
   * @api private
   *
   * @param date [String]
   * @param region [String]
   * @param serviceName [String]
   * @return [String]
   */
  createScope: function createScope(date, region, serviceName) {
    return [
      date.substr(0, 8),
      region,
      serviceName,
      v4Identifier
    ].join('/');
  },

  /**
   * @api private
   *
   * @param credentials [Credentials]
   * @param date [String]
   * @param region [String]
   * @param service [String]
   * @param shouldCache [Boolean]
   * @return [String]
   */
  getSigningKey: function getSigningKey(
    credentials,
    date,
    region,
    service,
    shouldCache
  ) {
    var credsIdentifier = AWS.util.crypto
      .hmac(credentials.secretAccessKey, credentials.accessKeyId, 'base64');
    var cacheKey = [credsIdentifier, date, region, service].join('_');
    shouldCache = shouldCache !== false;
    if (shouldCache && (cacheKey in cachedSecret)) {
      return cachedSecret[cacheKey];
    }

    var kDate = AWS.util.crypto.hmac(
      'AWS4' + credentials.secretAccessKey,
      date,
      'buffer'
    );
    var kRegion = AWS.util.crypto.hmac(kDate, region, 'buffer');
    var kService = AWS.util.crypto.hmac(kRegion, service, 'buffer');

    var signingKey = AWS.util.crypto.hmac(kService, v4Identifier, 'buffer');
    if (shouldCache) {
      cachedSecret[cacheKey] = signingKey;
      cacheQueue.push(cacheKey);
      if (cacheQueue.length > maxCacheEntries) {
        // remove the oldest entry (not the least recently used)
        delete cachedSecret[cacheQueue.shift()];
      }
    }

    return signingKey;
  },

  /**
   * @api private
   *
   * Empties the derived signing key cache. Made available for testing purposes
   * only.
   */
  emptyCache: function emptyCache() {
    cachedSecret = {};
    cacheQueue = [];
  }
};


/***/ }),

/***/ 8118:
/***/ ((module) => {

function AcceptorStateMachine(states, state) {
  this.currentState = state || null;
  this.states = states || {};
}

AcceptorStateMachine.prototype.runTo = function runTo(finalState, done, bindObject, inputError) {
  if (typeof finalState === 'function') {
    inputError = bindObject; bindObject = done;
    done = finalState; finalState = null;
  }

  var self = this;
  var state = self.states[self.currentState];
  state.fn.call(bindObject || self, inputError, function(err) {
    if (err) {
      if (state.fail) self.currentState = state.fail;
      else return done ? done.call(bindObject, err) : null;
    } else {
      if (state.accept) self.currentState = state.accept;
      else return done ? done.call(bindObject) : null;
    }
    if (self.currentState === finalState) {
      return done ? done.call(bindObject, err) : null;
    }

    self.runTo(finalState, done, bindObject, err);
  });
};

AcceptorStateMachine.prototype.addState = function addState(name, acceptState, failState, fn) {
  if (typeof acceptState === 'function') {
    fn = acceptState; acceptState = null; failState = null;
  } else if (typeof failState === 'function') {
    fn = failState; failState = null;
  }

  if (!this.currentState) this.currentState = name;
  this.states[name] = { accept: acceptState, fail: failState, fn: fn };
  return this;
};

/**
 * @api private
 */
module.exports = AcceptorStateMachine;


/***/ }),

/***/ 7985:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* eslint guard-for-in:0 */
var AWS;

/**
 * A set of utility methods for use with the AWS SDK.
 *
 * @!attribute abort
 *   Return this value from an iterator function {each} or {arrayEach}
 *   to break out of the iteration.
 *   @example Breaking out of an iterator function
 *     AWS.util.each({a: 1, b: 2, c: 3}, function(key, value) {
 *       if (key == 'b') return AWS.util.abort;
 *     });
 *   @see each
 *   @see arrayEach
 * @api private
 */
var util = {
  environment: 'nodejs',
  engine: function engine() {
    if (util.isBrowser() && typeof navigator !== 'undefined') {
      return navigator.userAgent;
    } else {
      var engine = process.platform + '/' + process.version;
      if (process.env.AWS_EXECUTION_ENV) {
        engine += ' exec-env/' + process.env.AWS_EXECUTION_ENV;
      }
      return engine;
    }
  },

  userAgent: function userAgent() {
    var name = util.environment;
    var agent = 'aws-sdk-' + name + '/' + __nccwpck_require__(8437).VERSION;
    if (name === 'nodejs') agent += ' ' + util.engine();
    return agent;
  },

  uriEscape: function uriEscape(string) {
    var output = encodeURIComponent(string);
    output = output.replace(/[^A-Za-z0-9_.~\-%]+/g, escape);

    // AWS percent-encodes some extra non-standard characters in a URI
    output = output.replace(/[*]/g, function(ch) {
      return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
    });

    return output;
  },

  uriEscapePath: function uriEscapePath(string) {
    var parts = [];
    util.arrayEach(string.split('/'), function (part) {
      parts.push(util.uriEscape(part));
    });
    return parts.join('/');
  },

  urlParse: function urlParse(url) {
    return util.url.parse(url);
  },

  urlFormat: function urlFormat(url) {
    return util.url.format(url);
  },

  queryStringParse: function queryStringParse(qs) {
    return util.querystring.parse(qs);
  },

  queryParamsToString: function queryParamsToString(params) {
    var items = [];
    var escape = util.uriEscape;
    var sortedKeys = Object.keys(params).sort();

    util.arrayEach(sortedKeys, function(name) {
      var value = params[name];
      var ename = escape(name);
      var result = ename + '=';
      if (Array.isArray(value)) {
        var vals = [];
        util.arrayEach(value, function(item) { vals.push(escape(item)); });
        result = ename + '=' + vals.sort().join('&' + ename + '=');
      } else if (value !== undefined && value !== null) {
        result = ename + '=' + escape(value);
      }
      items.push(result);
    });

    return items.join('&');
  },

  readFileSync: function readFileSync(path) {
    if (util.isBrowser()) return null;
    return __nccwpck_require__(5747).readFileSync(path, 'utf-8');
  },

  base64: {
    encode: function encode64(string) {
      if (typeof string === 'number') {
        throw util.error(new Error('Cannot base64 encode number ' + string));
      }
      if (string === null || typeof string === 'undefined') {
        return string;
      }
      var buf = util.buffer.toBuffer(string);
      return buf.toString('base64');
    },

    decode: function decode64(string) {
      if (typeof string === 'number') {
        throw util.error(new Error('Cannot base64 decode number ' + string));
      }
      if (string === null || typeof string === 'undefined') {
        return string;
      }
      return util.buffer.toBuffer(string, 'base64');
    }

  },

  buffer: {
    /**
     * Buffer constructor for Node buffer and buffer pollyfill
     */
    toBuffer: function(data, encoding) {
      return (typeof util.Buffer.from === 'function' && util.Buffer.from !== Uint8Array.from) ?
        util.Buffer.from(data, encoding) : new util.Buffer(data, encoding);
    },

    alloc: function(size, fill, encoding) {
      if (typeof size !== 'number') {
        throw new Error('size passed to alloc must be a number.');
      }
      if (typeof util.Buffer.alloc === 'function') {
        return util.Buffer.alloc(size, fill, encoding);
      } else {
        var buf = new util.Buffer(size);
        if (fill !== undefined && typeof buf.fill === 'function') {
          buf.fill(fill, undefined, undefined, encoding);
        }
        return buf;
      }
    },

    toStream: function toStream(buffer) {
      if (!util.Buffer.isBuffer(buffer)) buffer =  util.buffer.toBuffer(buffer);

      var readable = new (util.stream.Readable)();
      var pos = 0;
      readable._read = function(size) {
        if (pos >= buffer.length) return readable.push(null);

        var end = pos + size;
        if (end > buffer.length) end = buffer.length;
        readable.push(buffer.slice(pos, end));
        pos = end;
      };

      return readable;
    },

    /**
     * Concatenates a list of Buffer objects.
     */
    concat: function(buffers) {
      var length = 0,
          offset = 0,
          buffer = null, i;

      for (i = 0; i < buffers.length; i++) {
        length += buffers[i].length;
      }

      buffer = util.buffer.alloc(length);

      for (i = 0; i < buffers.length; i++) {
        buffers[i].copy(buffer, offset);
        offset += buffers[i].length;
      }

      return buffer;
    }
  },

  string: {
    byteLength: function byteLength(string) {
      if (string === null || string === undefined) return 0;
      if (typeof string === 'string') string = util.buffer.toBuffer(string);

      if (typeof string.byteLength === 'number') {
        return string.byteLength;
      } else if (typeof string.length === 'number') {
        return string.length;
      } else if (typeof string.size === 'number') {
        return string.size;
      } else if (typeof string.path === 'string') {
        return __nccwpck_require__(5747).lstatSync(string.path).size;
      } else {
        throw util.error(new Error('Cannot determine length of ' + string),
          { object: string });
      }
    },

    upperFirst: function upperFirst(string) {
      return string[0].toUpperCase() + string.substr(1);
    },

    lowerFirst: function lowerFirst(string) {
      return string[0].toLowerCase() + string.substr(1);
    }
  },

  ini: {
    parse: function string(ini) {
      var currentSection, map = {};
      util.arrayEach(ini.split(/\r?\n/), function(line) {
        line = line.split(/(^|\s)[;#]/)[0]; // remove comments
        var section = line.match(/^\s*\[([^\[\]]+)\]\s*$/);
        if (section) {
          currentSection = section[1];
          if (currentSection === '__proto__' || currentSection.split(/\s/)[1] === '__proto__') {
            throw util.error(
              new Error('Cannot load profile name \'' + currentSection + '\' from shared ini file.')
            );
          }
        } else if (currentSection) {
          var item = line.match(/^\s*(.+?)\s*=\s*(.+?)\s*$/);
          if (item) {
            map[currentSection] = map[currentSection] || {};
            map[currentSection][item[1]] = item[2];
          }
        }
      });

      return map;
    }
  },

  fn: {
    noop: function() {},
    callback: function (err) { if (err) throw err; },

    /**
     * Turn a synchronous function into as "async" function by making it call
     * a callback. The underlying function is called with all but the last argument,
     * which is treated as the callback. The callback is passed passed a first argument
     * of null on success to mimick standard node callbacks.
     */
    makeAsync: function makeAsync(fn, expectedArgs) {
      if (expectedArgs && expectedArgs <= fn.length) {
        return fn;
      }

      return function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();
        var result = fn.apply(null, args);
        callback(result);
      };
    }
  },

  /**
   * Date and time utility functions.
   */
  date: {

    /**
     * @return [Date] the current JavaScript date object. Since all
     *   AWS services rely on this date object, you can override
     *   this function to provide a special time value to AWS service
     *   requests.
     */
    getDate: function getDate() {
      if (!AWS) AWS = __nccwpck_require__(8437);
      if (AWS.config.systemClockOffset) { // use offset when non-zero
        return new Date(new Date().getTime() + AWS.config.systemClockOffset);
      } else {
        return new Date();
      }
    },

    /**
     * @return [String] the date in ISO-8601 format
     */
    iso8601: function iso8601(date) {
      if (date === undefined) { date = util.date.getDate(); }
      return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
    },

    /**
     * @return [String] the date in RFC 822 format
     */
    rfc822: function rfc822(date) {
      if (date === undefined) { date = util.date.getDate(); }
      return date.toUTCString();
    },

    /**
     * @return [Integer] the UNIX timestamp value for the current time
     */
    unixTimestamp: function unixTimestamp(date) {
      if (date === undefined) { date = util.date.getDate(); }
      return date.getTime() / 1000;
    },

    /**
     * @param [String,number,Date] date
     * @return [Date]
     */
    from: function format(date) {
      if (typeof date === 'number') {
        return new Date(date * 1000); // unix timestamp
      } else {
        return new Date(date);
      }
    },

    /**
     * Given a Date or date-like value, this function formats the
     * date into a string of the requested value.
     * @param [String,number,Date] date
     * @param [String] formatter Valid formats are:
     #   * 'iso8601'
     #   * 'rfc822'
     #   * 'unixTimestamp'
     * @return [String]
     */
    format: function format(date, formatter) {
      if (!formatter) formatter = 'iso8601';
      return util.date[formatter](util.date.from(date));
    },

    parseTimestamp: function parseTimestamp(value) {
      if (typeof value === 'number') { // unix timestamp (number)
        return new Date(value * 1000);
      } else if (value.match(/^\d+$/)) { // unix timestamp
        return new Date(value * 1000);
      } else if (value.match(/^\d{4}/)) { // iso8601
        return new Date(value);
      } else if (value.match(/^\w{3},/)) { // rfc822
        return new Date(value);
      } else {
        throw util.error(
          new Error('unhandled timestamp format: ' + value),
          {code: 'TimestampParserError'});
      }
    }

  },

  crypto: {
    crc32Table: [
     0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419,
     0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4,
     0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07,
     0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE,
     0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856,
     0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9,
     0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4,
     0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B,
     0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3,
     0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A,
     0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599,
     0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924,
     0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190,
     0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F,
     0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E,
     0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01,
     0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED,
     0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950,
     0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3,
     0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2,
     0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A,
     0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5,
     0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010,
     0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
     0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17,
     0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6,
     0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615,
     0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8,
     0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344,
     0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB,
     0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A,
     0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5,
     0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1,
     0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C,
     0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF,
     0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236,
     0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE,
     0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31,
     0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C,
     0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713,
     0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B,
     0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242,
     0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1,
     0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C,
     0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278,
     0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7,
     0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66,
     0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
     0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605,
     0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8,
     0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B,
     0x2D02EF8D],

    crc32: function crc32(data) {
      var tbl = util.crypto.crc32Table;
      var crc = 0 ^ -1;

      if (typeof data === 'string') {
        data = util.buffer.toBuffer(data);
      }

      for (var i = 0; i < data.length; i++) {
        var code = data.readUInt8(i);
        crc = (crc >>> 8) ^ tbl[(crc ^ code) & 0xFF];
      }
      return (crc ^ -1) >>> 0;
    },

    hmac: function hmac(key, string, digest, fn) {
      if (!digest) digest = 'binary';
      if (digest === 'buffer') { digest = undefined; }
      if (!fn) fn = 'sha256';
      if (typeof string === 'string') string = util.buffer.toBuffer(string);
      return util.crypto.lib.createHmac(fn, key).update(string).digest(digest);
    },

    md5: function md5(data, digest, callback) {
      return util.crypto.hash('md5', data, digest, callback);
    },

    sha256: function sha256(data, digest, callback) {
      return util.crypto.hash('sha256', data, digest, callback);
    },

    hash: function(algorithm, data, digest, callback) {
      var hash = util.crypto.createHash(algorithm);
      if (!digest) { digest = 'binary'; }
      if (digest === 'buffer') { digest = undefined; }
      if (typeof data === 'string') data = util.buffer.toBuffer(data);
      var sliceFn = util.arraySliceFn(data);
      var isBuffer = util.Buffer.isBuffer(data);
      //Identifying objects with an ArrayBuffer as buffers
      if (util.isBrowser() && typeof ArrayBuffer !== 'undefined' && data && data.buffer instanceof ArrayBuffer) isBuffer = true;

      if (callback && typeof data === 'object' &&
          typeof data.on === 'function' && !isBuffer) {
        data.on('data', function(chunk) { hash.update(chunk); });
        data.on('error', function(err) { callback(err); });
        data.on('end', function() { callback(null, hash.digest(digest)); });
      } else if (callback && sliceFn && !isBuffer &&
                 typeof FileReader !== 'undefined') {
        // this might be a File/Blob
        var index = 0, size = 1024 * 512;
        var reader = new FileReader();
        reader.onerror = function() {
          callback(new Error('Failed to read data.'));
        };
        reader.onload = function() {
          var buf = new util.Buffer(new Uint8Array(reader.result));
          hash.update(buf);
          index += buf.length;
          reader._continueReading();
        };
        reader._continueReading = function() {
          if (index >= data.size) {
            callback(null, hash.digest(digest));
            return;
          }

          var back = index + size;
          if (back > data.size) back = data.size;
          reader.readAsArrayBuffer(sliceFn.call(data, index, back));
        };

        reader._continueReading();
      } else {
        if (util.isBrowser() && typeof data === 'object' && !isBuffer) {
          data = new util.Buffer(new Uint8Array(data));
        }
        var out = hash.update(data).digest(digest);
        if (callback) callback(null, out);
        return out;
      }
    },

    toHex: function toHex(data) {
      var out = [];
      for (var i = 0; i < data.length; i++) {
        out.push(('0' + data.charCodeAt(i).toString(16)).substr(-2, 2));
      }
      return out.join('');
    },

    createHash: function createHash(algorithm) {
      return util.crypto.lib.createHash(algorithm);
    }

  },

  /** @!ignore */

  /* Abort constant */
  abort: {},

  each: function each(object, iterFunction) {
    for (var key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        var ret = iterFunction.call(this, key, object[key]);
        if (ret === util.abort) break;
      }
    }
  },

  arrayEach: function arrayEach(array, iterFunction) {
    for (var idx in array) {
      if (Object.prototype.hasOwnProperty.call(array, idx)) {
        var ret = iterFunction.call(this, array[idx], parseInt(idx, 10));
        if (ret === util.abort) break;
      }
    }
  },

  update: function update(obj1, obj2) {
    util.each(obj2, function iterator(key, item) {
      obj1[key] = item;
    });
    return obj1;
  },

  merge: function merge(obj1, obj2) {
    return util.update(util.copy(obj1), obj2);
  },

  copy: function copy(object) {
    if (object === null || object === undefined) return object;
    var dupe = {};
    // jshint forin:false
    for (var key in object) {
      dupe[key] = object[key];
    }
    return dupe;
  },

  isEmpty: function isEmpty(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  },

  arraySliceFn: function arraySliceFn(obj) {
    var fn = obj.slice || obj.webkitSlice || obj.mozSlice;
    return typeof fn === 'function' ? fn : null;
  },

  isType: function isType(obj, type) {
    // handle cross-"frame" objects
    if (typeof type === 'function') type = util.typeName(type);
    return Object.prototype.toString.call(obj) === '[object ' + type + ']';
  },

  typeName: function typeName(type) {
    if (Object.prototype.hasOwnProperty.call(type, 'name')) return type.name;
    var str = type.toString();
    var match = str.match(/^\s*function (.+)\(/);
    return match ? match[1] : str;
  },

  error: function error(err, options) {
    var originalError = null;
    if (typeof err.message === 'string' && err.message !== '') {
      if (typeof options === 'string' || (options && options.message)) {
        originalError = util.copy(err);
        originalError.message = err.message;
      }
    }
    err.message = err.message || null;

    if (typeof options === 'string') {
      err.message = options;
    } else if (typeof options === 'object' && options !== null) {
      util.update(err, options);
      if (options.message)
        err.message = options.message;
      if (options.code || options.name)
        err.code = options.code || options.name;
      if (options.stack)
        err.stack = options.stack;
    }

    if (typeof Object.defineProperty === 'function') {
      Object.defineProperty(err, 'name', {writable: true, enumerable: false});
      Object.defineProperty(err, 'message', {enumerable: true});
    }

    err.name = String(options && options.name || err.name || err.code || 'Error');
    err.time = new Date();

    if (originalError) err.originalError = originalError;

    return err;
  },

  /**
   * @api private
   */
  inherit: function inherit(klass, features) {
    var newObject = null;
    if (features === undefined) {
      features = klass;
      klass = Object;
      newObject = {};
    } else {
      var ctor = function ConstructorWrapper() {};
      ctor.prototype = klass.prototype;
      newObject = new ctor();
    }

    // constructor not supplied, create pass-through ctor
    if (features.constructor === Object) {
      features.constructor = function() {
        if (klass !== Object) {
          return klass.apply(this, arguments);
        }
      };
    }

    features.constructor.prototype = newObject;
    util.update(features.constructor.prototype, features);
    features.constructor.__super__ = klass;
    return features.constructor;
  },

  /**
   * @api private
   */
  mixin: function mixin() {
    var klass = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      // jshint forin:false
      for (var prop in arguments[i].prototype) {
        var fn = arguments[i].prototype[prop];
        if (prop !== 'constructor') {
          klass.prototype[prop] = fn;
        }
      }
    }
    return klass;
  },

  /**
   * @api private
   */
  hideProperties: function hideProperties(obj, props) {
    if (typeof Object.defineProperty !== 'function') return;

    util.arrayEach(props, function (key) {
      Object.defineProperty(obj, key, {
        enumerable: false, writable: true, configurable: true });
    });
  },

  /**
   * @api private
   */
  property: function property(obj, name, value, enumerable, isValue) {
    var opts = {
      configurable: true,
      enumerable: enumerable !== undefined ? enumerable : true
    };
    if (typeof value === 'function' && !isValue) {
      opts.get = value;
    }
    else {
      opts.value = value; opts.writable = true;
    }

    Object.defineProperty(obj, name, opts);
  },

  /**
   * @api private
   */
  memoizedProperty: function memoizedProperty(obj, name, get, enumerable) {
    var cachedValue = null;

    // build enumerable attribute for each value with lazy accessor.
    util.property(obj, name, function() {
      if (cachedValue === null) {
        cachedValue = get();
      }
      return cachedValue;
    }, enumerable);
  },

  /**
   * TODO Remove in major version revision
   * This backfill populates response data without the
   * top-level payload name.
   *
   * @api private
   */
  hoistPayloadMember: function hoistPayloadMember(resp) {
    var req = resp.request;
    var operationName = req.operation;
    var operation = req.service.api.operations[operationName];
    var output = operation.output;
    if (output.payload && !operation.hasEventOutput) {
      var payloadMember = output.members[output.payload];
      var responsePayload = resp.data[output.payload];
      if (payloadMember.type === 'structure') {
        util.each(responsePayload, function(key, value) {
          util.property(resp.data, key, value, false);
        });
      }
    }
  },

  /**
   * Compute SHA-256 checksums of streams
   *
   * @api private
   */
  computeSha256: function computeSha256(body, done) {
    if (util.isNode()) {
      var Stream = util.stream.Stream;
      var fs = __nccwpck_require__(5747);
      if (typeof Stream === 'function' && body instanceof Stream) {
        if (typeof body.path === 'string') { // assume file object
          var settings = {};
          if (typeof body.start === 'number') {
            settings.start = body.start;
          }
          if (typeof body.end === 'number') {
            settings.end = body.end;
          }
          body = fs.createReadStream(body.path, settings);
        } else { // TODO support other stream types
          return done(new Error('Non-file stream objects are ' +
                                'not supported with SigV4'));
        }
      }
    }

    util.crypto.sha256(body, 'hex', function(err, sha) {
      if (err) done(err);
      else done(null, sha);
    });
  },

  /**
   * @api private
   */
  isClockSkewed: function isClockSkewed(serverTime) {
    if (serverTime) {
      util.property(AWS.config, 'isClockSkewed',
        Math.abs(new Date().getTime() - serverTime) >= 300000, false);
      return AWS.config.isClockSkewed;
    }
  },

  applyClockOffset: function applyClockOffset(serverTime) {
    if (serverTime)
      AWS.config.systemClockOffset = serverTime - new Date().getTime();
  },

  /**
   * @api private
   */
  extractRequestId: function extractRequestId(resp) {
    var requestId = resp.httpResponse.headers['x-amz-request-id'] ||
                     resp.httpResponse.headers['x-amzn-requestid'];

    if (!requestId && resp.data && resp.data.ResponseMetadata) {
      requestId = resp.data.ResponseMetadata.RequestId;
    }

    if (requestId) {
      resp.requestId = requestId;
    }

    if (resp.error) {
      resp.error.requestId = requestId;
    }
  },

  /**
   * @api private
   */
  addPromises: function addPromises(constructors, PromiseDependency) {
    var deletePromises = false;
    if (PromiseDependency === undefined && AWS && AWS.config) {
      PromiseDependency = AWS.config.getPromisesDependency();
    }
    if (PromiseDependency === undefined && typeof Promise !== 'undefined') {
      PromiseDependency = Promise;
    }
    if (typeof PromiseDependency !== 'function') deletePromises = true;
    if (!Array.isArray(constructors)) constructors = [constructors];

    for (var ind = 0; ind < constructors.length; ind++) {
      var constructor = constructors[ind];
      if (deletePromises) {
        if (constructor.deletePromisesFromClass) {
          constructor.deletePromisesFromClass();
        }
      } else if (constructor.addPromisesToClass) {
        constructor.addPromisesToClass(PromiseDependency);
      }
    }
  },

  /**
   * @api private
   * Return a function that will return a promise whose fate is decided by the
   * callback behavior of the given method with `methodName`. The method to be
   * promisified should conform to node.js convention of accepting a callback as
   * last argument and calling that callback with error as the first argument
   * and success value on the second argument.
   */
  promisifyMethod: function promisifyMethod(methodName, PromiseDependency) {
    return function promise() {
      var self = this;
      var args = Array.prototype.slice.call(arguments);
      return new PromiseDependency(function(resolve, reject) {
        args.push(function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
        self[methodName].apply(self, args);
      });
    };
  },

  /**
   * @api private
   */
  isDualstackAvailable: function isDualstackAvailable(service) {
    if (!service) return false;
    var metadata = __nccwpck_require__(9497);
    if (typeof service !== 'string') service = service.serviceIdentifier;
    if (typeof service !== 'string' || !metadata.hasOwnProperty(service)) return false;
    return !!metadata[service].dualstackAvailable;
  },

  /**
   * @api private
   */
  calculateRetryDelay: function calculateRetryDelay(retryCount, retryDelayOptions, err) {
    if (!retryDelayOptions) retryDelayOptions = {};
    var customBackoff = retryDelayOptions.customBackoff || null;
    if (typeof customBackoff === 'function') {
      return customBackoff(retryCount, err);
    }
    var base = typeof retryDelayOptions.base === 'number' ? retryDelayOptions.base : 100;
    var delay = Math.random() * (Math.pow(2, retryCount) * base);
    return delay;
  },

  /**
   * @api private
   */
  handleRequestWithRetries: function handleRequestWithRetries(httpRequest, options, cb) {
    if (!options) options = {};
    var http = AWS.HttpClient.getInstance();
    var httpOptions = options.httpOptions || {};
    var retryCount = 0;

    var errCallback = function(err) {
      var maxRetries = options.maxRetries || 0;
      if (err && err.code === 'TimeoutError') err.retryable = true;

      // Call `calculateRetryDelay()` only when relevant, see #3401
      if (err && err.retryable && retryCount < maxRetries) {
        var delay = util.calculateRetryDelay(retryCount, options.retryDelayOptions, err);
        if (delay >= 0) {
          retryCount++;
          setTimeout(sendRequest, delay + (err.retryAfter || 0));
          return;
        }
      }
      cb(err);
    };

    var sendRequest = function() {
      var data = '';
      http.handleRequest(httpRequest, httpOptions, function(httpResponse) {
        httpResponse.on('data', function(chunk) { data += chunk.toString(); });
        httpResponse.on('end', function() {
          var statusCode = httpResponse.statusCode;
          if (statusCode < 300) {
            cb(null, data);
          } else {
            var retryAfter = parseInt(httpResponse.headers['retry-after'], 10) * 1000 || 0;
            var err = util.error(new Error(),
              {
                statusCode: statusCode,
                retryable: statusCode >= 500 || statusCode === 429
              }
            );
            if (retryAfter && err.retryable) err.retryAfter = retryAfter;
            errCallback(err);
          }
        });
      }, errCallback);
    };

    AWS.util.defer(sendRequest);
  },

  /**
   * @api private
   */
  uuid: {
    v4: function uuidV4() {
      return __nccwpck_require__(2155).v4();
    }
  },

  /**
   * @api private
   */
  convertPayloadToString: function convertPayloadToString(resp) {
    var req = resp.request;
    var operation = req.operation;
    var rules = req.service.api.operations[operation].output || {};
    if (rules.payload && resp.data[rules.payload]) {
      resp.data[rules.payload] = resp.data[rules.payload].toString();
    }
  },

  /**
   * @api private
   */
  defer: function defer(callback) {
    if (typeof process === 'object' && typeof process.nextTick === 'function') {
      process.nextTick(callback);
    } else if (typeof setImmediate === 'function') {
      setImmediate(callback);
    } else {
      setTimeout(callback, 0);
    }
  },

  /**
   * @api private
   */
  getRequestPayloadShape: function getRequestPayloadShape(req) {
    var operations = req.service.api.operations;
    if (!operations) return undefined;
    var operation = (operations || {})[req.operation];
    if (!operation || !operation.input || !operation.input.payload) return undefined;
    return operation.input.members[operation.input.payload];
  },

  getProfilesFromSharedConfig: function getProfilesFromSharedConfig(iniLoader, filename) {
    var profiles = {};
    var profilesFromConfig = {};
    if (process.env[util.configOptInEnv]) {
      var profilesFromConfig = iniLoader.loadFrom({
        isConfig: true,
        filename: process.env[util.sharedConfigFileEnv]
      });
    }
    var profilesFromCreds= {};
    try {
      var profilesFromCreds = iniLoader.loadFrom({
        filename: filename ||
          (process.env[util.configOptInEnv] && process.env[util.sharedCredentialsFileEnv])
      });
    } catch (error) {
      // if using config, assume it is fully descriptive without a credentials file:
      if (!process.env[util.configOptInEnv]) throw error;
    }
    for (var i = 0, profileNames = Object.keys(profilesFromConfig); i < profileNames.length; i++) {
      profiles[profileNames[i]] = objectAssign(profiles[profileNames[i]] || {}, profilesFromConfig[profileNames[i]]);
    }
    for (var i = 0, profileNames = Object.keys(profilesFromCreds); i < profileNames.length; i++) {
      profiles[profileNames[i]] = objectAssign(profiles[profileNames[i]] || {}, profilesFromCreds[profileNames[i]]);
    }
    return profiles;

    /**
     * Roughly the semantics of `Object.assign(target, source)`
     */
    function objectAssign(target, source) {
      for (var i = 0, keys = Object.keys(source); i < keys.length; i++) {
        target[keys[i]] = source[keys[i]];
      }
      return target;
    }
  },

  /**
   * @api private
   */
  ARN: {
    validate: function validateARN(str) {
      return str && str.indexOf('arn:') === 0 && str.split(':').length >= 6;
    },
    parse: function parseARN(arn) {
      var matched = arn.split(':');
      return {
        partition: matched[1],
        service: matched[2],
        region: matched[3],
        accountId: matched[4],
        resource: matched.slice(5).join(':')
      };
    },
    build: function buildARN(arnObject) {
      if (
        arnObject.service === undefined ||
        arnObject.region === undefined ||
        arnObject.accountId === undefined ||
        arnObject.resource === undefined
      ) throw util.error(new Error('Input ARN object is invalid'));
      return 'arn:'+ (arnObject.partition || 'aws') + ':' + arnObject.service +
        ':' + arnObject.region + ':' + arnObject.accountId + ':' + arnObject.resource;
    }
  },

  /**
   * @api private
   */
  defaultProfile: 'default',

  /**
   * @api private
   */
  configOptInEnv: 'AWS_SDK_LOAD_CONFIG',

  /**
   * @api private
   */
  sharedCredentialsFileEnv: 'AWS_SHARED_CREDENTIALS_FILE',

  /**
   * @api private
   */
  sharedConfigFileEnv: 'AWS_CONFIG_FILE',

  /**
   * @api private
   */
  imdsDisabledEnv: 'AWS_EC2_METADATA_DISABLED'
};

/**
 * @api private
 */
module.exports = util;


/***/ }),

/***/ 3546:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(7985);
var XmlNode = __nccwpck_require__(397).XmlNode;
var XmlText = __nccwpck_require__(971).XmlText;

function XmlBuilder() { }

XmlBuilder.prototype.toXML = function(params, shape, rootElement, noEmpty) {
  var xml = new XmlNode(rootElement);
  applyNamespaces(xml, shape, true);
  serialize(xml, params, shape);
  return xml.children.length > 0 || noEmpty ? xml.toString() : '';
};

function serialize(xml, value, shape) {
  switch (shape.type) {
    case 'structure': return serializeStructure(xml, value, shape);
    case 'map': return serializeMap(xml, value, shape);
    case 'list': return serializeList(xml, value, shape);
    default: return serializeScalar(xml, value, shape);
  }
}

function serializeStructure(xml, params, shape) {
  util.arrayEach(shape.memberNames, function(memberName) {
    var memberShape = shape.members[memberName];
    if (memberShape.location !== 'body') return;

    var value = params[memberName];
    var name = memberShape.name;
    if (value !== undefined && value !== null) {
      if (memberShape.isXmlAttribute) {
        xml.addAttribute(name, value);
      } else if (memberShape.flattened) {
        serialize(xml, value, memberShape);
      } else {
        var element = new XmlNode(name);
        xml.addChildNode(element);
        applyNamespaces(element, memberShape);
        serialize(element, value, memberShape);
      }
    }
  });
}

function serializeMap(xml, map, shape) {
  var xmlKey = shape.key.name || 'key';
  var xmlValue = shape.value.name || 'value';

  util.each(map, function(key, value) {
    var entry = new XmlNode(shape.flattened ? shape.name : 'entry');
    xml.addChildNode(entry);

    var entryKey = new XmlNode(xmlKey);
    var entryValue = new XmlNode(xmlValue);
    entry.addChildNode(entryKey);
    entry.addChildNode(entryValue);

    serialize(entryKey, key, shape.key);
    serialize(entryValue, value, shape.value);
  });
}

function serializeList(xml, list, shape) {
  if (shape.flattened) {
    util.arrayEach(list, function(value) {
      var name = shape.member.name || shape.name;
      var element = new XmlNode(name);
      xml.addChildNode(element);
      serialize(element, value, shape.member);
    });
  } else {
    util.arrayEach(list, function(value) {
      var name = shape.member.name || 'member';
      var element = new XmlNode(name);
      xml.addChildNode(element);
      serialize(element, value, shape.member);
    });
  }
}

function serializeScalar(xml, value, shape) {
  xml.addChildNode(
    new XmlText(shape.toWireFormat(value))
  );
}

function applyNamespaces(xml, shape, isRoot) {
  var uri, prefix = 'xmlns';
  if (shape.xmlNamespaceUri) {
    uri = shape.xmlNamespaceUri;
    if (shape.xmlNamespacePrefix) prefix += ':' + shape.xmlNamespacePrefix;
  } else if (isRoot && shape.api.xmlNamespaceUri) {
    uri = shape.api.xmlNamespaceUri;
  }

  if (uri) xml.addAttribute(prefix, uri);
}

/**
 * @api private
 */
module.exports = XmlBuilder;


/***/ }),

/***/ 8241:
/***/ ((module) => {

/**
 * Escapes characters that can not be in an XML attribute.
 */
function escapeAttribute(value) {
    return value.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * @api private
 */
module.exports = {
    escapeAttribute: escapeAttribute
};


/***/ }),

/***/ 8464:
/***/ ((module) => {

/**
 * Escapes characters that can not be in an XML element.
 */
function escapeElement(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * @api private
 */
module.exports = {
    escapeElement: escapeElement
};


/***/ }),

/***/ 6752:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var AWS = __nccwpck_require__(8437);
var util = AWS.util;
var Shape = AWS.Model.Shape;

var xml2js = __nccwpck_require__(6189);

/**
 * @api private
 */
var options = {  // options passed to xml2js parser
  explicitCharkey: false, // undocumented
  trim: false,            // trim the leading/trailing whitespace from text nodes
  normalize: false,       // trim interior whitespace inside text nodes
  explicitRoot: false,    // return the root node in the resulting object?
  emptyTag: null,         // the default value for empty nodes
  explicitArray: true,    // always put child nodes in an array
  ignoreAttrs: false,     // ignore attributes, only create text nodes
  mergeAttrs: false,      // merge attributes and child elements
  validator: null         // a callable validator
};

function NodeXmlParser() { }

NodeXmlParser.prototype.parse = function(xml, shape) {
  shape = shape || {};

  var result = null;
  var error = null;

  var parser = new xml2js.Parser(options);
  parser.parseString(xml, function (e, r) {
    error = e;
    result = r;
  });

  if (result) {
    var data = parseXml(result, shape);
    if (result.ResponseMetadata) {
      data.ResponseMetadata = parseXml(result.ResponseMetadata[0], {});
    }
    return data;
  } else if (error) {
    throw util.error(error, {code: 'XMLParserError', retryable: true});
  } else { // empty xml document
    return parseXml({}, shape);
  }
};

function parseXml(xml, shape) {
  switch (shape.type) {
    case 'structure': return parseStructure(xml, shape);
    case 'map': return parseMap(xml, shape);
    case 'list': return parseList(xml, shape);
    case undefined: case null: return parseUnknown(xml);
    default: return parseScalar(xml, shape);
  }
}

function parseStructure(xml, shape) {
  var data = {};
  if (xml === null) return data;

  util.each(shape.members, function(memberName, memberShape) {
    var xmlName = memberShape.name;
    if (Object.prototype.hasOwnProperty.call(xml, xmlName) && Array.isArray(xml[xmlName])) {
      var xmlChild = xml[xmlName];
      if (!memberShape.flattened) xmlChild = xmlChild[0];

      data[memberName] = parseXml(xmlChild, memberShape);
    } else if (memberShape.isXmlAttribute &&
               xml.$ && Object.prototype.hasOwnProperty.call(xml.$, xmlName)) {
      data[memberName] = parseScalar(xml.$[xmlName], memberShape);
    } else if (memberShape.type === 'list' && !shape.api.xmlNoDefaultLists) {
      data[memberName] = memberShape.defaultValue;
    }
  });

  return data;
}

function parseMap(xml, shape) {
  var data = {};
  if (xml === null) return data;

  var xmlKey = shape.key.name || 'key';
  var xmlValue = shape.value.name || 'value';
  var iterable = shape.flattened ? xml : xml.entry;

  if (Array.isArray(iterable)) {
    util.arrayEach(iterable, function(child) {
      data[child[xmlKey][0]] = parseXml(child[xmlValue][0], shape.value);
    });
  }

  return data;
}

function parseList(xml, shape) {
  var data = [];
  var name = shape.member.name || 'member';
  if (shape.flattened) {
    util.arrayEach(xml, function(xmlChild) {
      data.push(parseXml(xmlChild, shape.member));
    });
  } else if (xml && Array.isArray(xml[name])) {
    util.arrayEach(xml[name], function(child) {
      data.push(parseXml(child, shape.member));
    });
  }

  return data;
}

function parseScalar(text, shape) {
  if (text && text.$ && text.$.encoding === 'base64') {
    shape = new Shape.create({type: text.$.encoding});
  }
  if (text && text._) text = text._;

  if (typeof shape.toType === 'function') {
    return shape.toType(text);
  } else {
    return text;
  }
}

function parseUnknown(xml) {
  if (xml === undefined || xml === null) return '';
  if (typeof xml === 'string') return xml;

  // parse a list
  if (Array.isArray(xml)) {
    var arr = [];
    for (i = 0; i < xml.length; i++) {
      arr.push(parseXml(xml[i], {}));
    }
    return arr;
  }

  // empty object
  var keys = Object.keys(xml), i;
  if (keys.length === 0 || (keys.length === 1 && keys[0] === '$')) {
    return {};
  }

  // object, parse as structure
  var data = {};
  for (i = 0; i < keys.length; i++) {
    var key = keys[i], value = xml[key];
    if (key === '$') continue;
    if (value.length > 1) { // this member is a list
      data[key] = parseList(value, {member: {}});
    } else { // this member is a single item
      data[key] = parseXml(value[0], {});
    }
  }
  return data;
}

/**
 * @api private
 */
module.exports = NodeXmlParser;


/***/ }),

/***/ 397:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var escapeAttribute = __nccwpck_require__(8241).escapeAttribute;

/**
 * Represents an XML node.
 * @api private
 */
function XmlNode(name, children) {
    if (children === void 0) { children = []; }
    this.name = name;
    this.children = children;
    this.attributes = {};
}
XmlNode.prototype.addAttribute = function (name, value) {
    this.attributes[name] = value;
    return this;
};
XmlNode.prototype.addChildNode = function (child) {
    this.children.push(child);
    return this;
};
XmlNode.prototype.removeAttribute = function (name) {
    delete this.attributes[name];
    return this;
};
XmlNode.prototype.toString = function () {
    var hasChildren = Boolean(this.children.length);
    var xmlText = '<' + this.name;
    // add attributes
    var attributes = this.attributes;
    for (var i = 0, attributeNames = Object.keys(attributes); i < attributeNames.length; i++) {
        var attributeName = attributeNames[i];
        var attribute = attributes[attributeName];
        if (typeof attribute !== 'undefined' && attribute !== null) {
            xmlText += ' ' + attributeName + '=\"' + escapeAttribute('' + attribute) + '\"';
        }
    }
    return xmlText += !hasChildren ? '/>' : '>' + this.children.map(function (c) { return c.toString(); }).join('') + '</' + this.name + '>';
};

/**
 * @api private
 */
module.exports = {
    XmlNode: XmlNode
};


/***/ }),

/***/ 971:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var escapeElement = __nccwpck_require__(8464).escapeElement;

/**
 * Represents an XML text value.
 * @api private
 */
function XmlText(value) {
    this.value = value;
}

XmlText.prototype.toString = function () {
    return escapeElement('' + this.value);
};

/**
 * @api private
 */
module.exports = {
    XmlText: XmlText
};


/***/ }),

/***/ 6323:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
var LRU_1 = __nccwpck_require__(7710);
var CACHE_SIZE = 1000;
/**
 * Inspired node-lru-cache[https://github.com/isaacs/node-lru-cache]
 */
var EndpointCache = /** @class */ (function () {
    function EndpointCache(maxSize) {
        if (maxSize === void 0) { maxSize = CACHE_SIZE; }
        this.maxSize = maxSize;
        this.cache = new LRU_1.LRUCache(maxSize);
    }
    ;
    Object.defineProperty(EndpointCache.prototype, "size", {
        get: function () {
            return this.cache.length;
        },
        enumerable: true,
        configurable: true
    });
    EndpointCache.prototype.put = function (key, value) {
      var keyString = typeof key !== 'string' ? EndpointCache.getKeyString(key) : key;
        var endpointRecord = this.populateValue(value);
        this.cache.put(keyString, endpointRecord);
    };
    EndpointCache.prototype.get = function (key) {
      var keyString = typeof key !== 'string' ? EndpointCache.getKeyString(key) : key;
        var now = Date.now();
        var records = this.cache.get(keyString);
        if (records) {
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                if (record.Expire < now) {
                    this.cache.remove(keyString);
                    return undefined;
                }
            }
        }
        return records;
    };
    EndpointCache.getKeyString = function (key) {
        var identifiers = [];
        var identifierNames = Object.keys(key).sort();
        for (var i = 0; i < identifierNames.length; i++) {
            var identifierName = identifierNames[i];
            if (key[identifierName] === undefined)
                continue;
            identifiers.push(key[identifierName]);
        }
        return identifiers.join(' ');
    };
    EndpointCache.prototype.populateValue = function (endpoints) {
        var now = Date.now();
        return endpoints.map(function (endpoint) { return ({
            Address: endpoint.Address || '',
            Expire: now + (endpoint.CachePeriodInMinutes || 1) * 60 * 1000
        }); });
    };
    EndpointCache.prototype.empty = function () {
        this.cache.empty();
    };
    EndpointCache.prototype.remove = function (key) {
      var keyString = typeof key !== 'string' ? EndpointCache.getKeyString(key) : key;
        this.cache.remove(keyString);
    };
    return EndpointCache;
}());
exports.$ = EndpointCache;

/***/ }),

/***/ 7710:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var LinkedListNode = /** @class */ (function () {
    function LinkedListNode(key, value) {
        this.key = key;
        this.value = value;
    }
    return LinkedListNode;
}());
var LRUCache = /** @class */ (function () {
    function LRUCache(size) {
        this.nodeMap = {};
        this.size = 0;
        if (typeof size !== 'number' || size < 1) {
            throw new Error('Cache size can only be positive number');
        }
        this.sizeLimit = size;
    }
    Object.defineProperty(LRUCache.prototype, "length", {
        get: function () {
            return this.size;
        },
        enumerable: true,
        configurable: true
    });
    LRUCache.prototype.prependToList = function (node) {
        if (!this.headerNode) {
            this.tailNode = node;
        }
        else {
            this.headerNode.prev = node;
            node.next = this.headerNode;
        }
        this.headerNode = node;
        this.size++;
    };
    LRUCache.prototype.removeFromTail = function () {
        if (!this.tailNode) {
            return undefined;
        }
        var node = this.tailNode;
        var prevNode = node.prev;
        if (prevNode) {
            prevNode.next = undefined;
        }
        node.prev = undefined;
        this.tailNode = prevNode;
        this.size--;
        return node;
    };
    LRUCache.prototype.detachFromList = function (node) {
        if (this.headerNode === node) {
            this.headerNode = node.next;
        }
        if (this.tailNode === node) {
            this.tailNode = node.prev;
        }
        if (node.prev) {
            node.prev.next = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        }
        node.next = undefined;
        node.prev = undefined;
        this.size--;
    };
    LRUCache.prototype.get = function (key) {
        if (this.nodeMap[key]) {
            var node = this.nodeMap[key];
            this.detachFromList(node);
            this.prependToList(node);
            return node.value;
        }
    };
    LRUCache.prototype.remove = function (key) {
        if (this.nodeMap[key]) {
            var node = this.nodeMap[key];
            this.detachFromList(node);
            delete this.nodeMap[key];
        }
    };
    LRUCache.prototype.put = function (key, value) {
        if (this.nodeMap[key]) {
            this.remove(key);
        }
        else if (this.size === this.sizeLimit) {
            var tailNode = this.removeFromTail();
            var key_1 = tailNode.key;
            delete this.nodeMap[key_1];
        }
        var newNode = new LinkedListNode(key, value);
        this.nodeMap[key] = newNode;
        this.prependToList(newNode);
    };
    LRUCache.prototype.empty = function () {
        var keys = Object.keys(this.nodeMap);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var node = this.nodeMap[key];
            this.detachFromList(node);
            delete this.nodeMap[key];
        }
    };
    return LRUCache;
}());
exports.LRUCache = LRUCache;

/***/ }),

/***/ 7783:
/***/ ((__unused_webpack_module, exports) => {

(function(exports) {
  "use strict";

  function isArray(obj) {
    if (obj !== null) {
      return Object.prototype.toString.call(obj) === "[object Array]";
    } else {
      return false;
    }
  }

  function isObject(obj) {
    if (obj !== null) {
      return Object.prototype.toString.call(obj) === "[object Object]";
    } else {
      return false;
    }
  }

  function strictDeepEqual(first, second) {
    // Check the scalar case first.
    if (first === second) {
      return true;
    }

    // Check if they are the same type.
    var firstType = Object.prototype.toString.call(first);
    if (firstType !== Object.prototype.toString.call(second)) {
      return false;
    }
    // We know that first and second have the same type so we can just check the
    // first type from now on.
    if (isArray(first) === true) {
      // Short circuit if they're not the same length;
      if (first.length !== second.length) {
        return false;
      }
      for (var i = 0; i < first.length; i++) {
        if (strictDeepEqual(first[i], second[i]) === false) {
          return false;
        }
      }
      return true;
    }
    if (isObject(first) === true) {
      // An object is equal if it has the same key/value pairs.
      var keysSeen = {};
      for (var key in first) {
        if (hasOwnProperty.call(first, key)) {
          if (strictDeepEqual(first[key], second[key]) === false) {
            return false;
          }
          keysSeen[key] = true;
        }
      }
      // Now check that there aren't any keys in second that weren't
      // in first.
      for (var key2 in second) {
        if (hasOwnProperty.call(second, key2)) {
          if (keysSeen[key2] !== true) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }

  function isFalse(obj) {
    // From the spec:
    // A false value corresponds to the following values:
    // Empty list
    // Empty object
    // Empty string
    // False boolean
    // null value

    // First check the scalar values.
    if (obj === "" || obj === false || obj === null) {
        return true;
    } else if (isArray(obj) && obj.length === 0) {
        // Check for an empty array.
        return true;
    } else if (isObject(obj)) {
        // Check for an empty object.
        for (var key in obj) {
            // If there are any keys, then
            // the object is not empty so the object
            // is not false.
            if (obj.hasOwnProperty(key)) {
              return false;
            }
        }
        return true;
    } else {
        return false;
    }
  }

  function objValues(obj) {
    var keys = Object.keys(obj);
    var values = [];
    for (var i = 0; i < keys.length; i++) {
      values.push(obj[keys[i]]);
    }
    return values;
  }

  function merge(a, b) {
      var merged = {};
      for (var key in a) {
          merged[key] = a[key];
      }
      for (var key2 in b) {
          merged[key2] = b[key2];
      }
      return merged;
  }

  var trimLeft;
  if (typeof String.prototype.trimLeft === "function") {
    trimLeft = function(str) {
      return str.trimLeft();
    };
  } else {
    trimLeft = function(str) {
      return str.match(/^\s*(.*)/)[1];
    };
  }

  // Type constants used to define functions.
  var TYPE_NUMBER = 0;
  var TYPE_ANY = 1;
  var TYPE_STRING = 2;
  var TYPE_ARRAY = 3;
  var TYPE_OBJECT = 4;
  var TYPE_BOOLEAN = 5;
  var TYPE_EXPREF = 6;
  var TYPE_NULL = 7;
  var TYPE_ARRAY_NUMBER = 8;
  var TYPE_ARRAY_STRING = 9;

  var TOK_EOF = "EOF";
  var TOK_UNQUOTEDIDENTIFIER = "UnquotedIdentifier";
  var TOK_QUOTEDIDENTIFIER = "QuotedIdentifier";
  var TOK_RBRACKET = "Rbracket";
  var TOK_RPAREN = "Rparen";
  var TOK_COMMA = "Comma";
  var TOK_COLON = "Colon";
  var TOK_RBRACE = "Rbrace";
  var TOK_NUMBER = "Number";
  var TOK_CURRENT = "Current";
  var TOK_EXPREF = "Expref";
  var TOK_PIPE = "Pipe";
  var TOK_OR = "Or";
  var TOK_AND = "And";
  var TOK_EQ = "EQ";
  var TOK_GT = "GT";
  var TOK_LT = "LT";
  var TOK_GTE = "GTE";
  var TOK_LTE = "LTE";
  var TOK_NE = "NE";
  var TOK_FLATTEN = "Flatten";
  var TOK_STAR = "Star";
  var TOK_FILTER = "Filter";
  var TOK_DOT = "Dot";
  var TOK_NOT = "Not";
  var TOK_LBRACE = "Lbrace";
  var TOK_LBRACKET = "Lbracket";
  var TOK_LPAREN= "Lparen";
  var TOK_LITERAL= "Literal";

  // The "&", "[", "<", ">" tokens
  // are not in basicToken because
  // there are two token variants
  // ("&&", "[?", "<=", ">=").  This is specially handled
  // below.

  var basicTokens = {
    ".": TOK_DOT,
    "*": TOK_STAR,
    ",": TOK_COMMA,
    ":": TOK_COLON,
    "{": TOK_LBRACE,
    "}": TOK_RBRACE,
    "]": TOK_RBRACKET,
    "(": TOK_LPAREN,
    ")": TOK_RPAREN,
    "@": TOK_CURRENT
  };

  var operatorStartToken = {
      "<": true,
      ">": true,
      "=": true,
      "!": true
  };

  var skipChars = {
      " ": true,
      "\t": true,
      "\n": true
  };


  function isAlpha(ch) {
      return (ch >= "a" && ch <= "z") ||
             (ch >= "A" && ch <= "Z") ||
             ch === "_";
  }

  function isNum(ch) {
      return (ch >= "0" && ch <= "9") ||
             ch === "-";
  }
  function isAlphaNum(ch) {
      return (ch >= "a" && ch <= "z") ||
             (ch >= "A" && ch <= "Z") ||
             (ch >= "0" && ch <= "9") ||
             ch === "_";
  }

  function Lexer() {
  }
  Lexer.prototype = {
      tokenize: function(stream) {
          var tokens = [];
          this._current = 0;
          var start;
          var identifier;
          var token;
          while (this._current < stream.length) {
              if (isAlpha(stream[this._current])) {
                  start = this._current;
                  identifier = this._consumeUnquotedIdentifier(stream);
                  tokens.push({type: TOK_UNQUOTEDIDENTIFIER,
                               value: identifier,
                               start: start});
              } else if (basicTokens[stream[this._current]] !== undefined) {
                  tokens.push({type: basicTokens[stream[this._current]],
                              value: stream[this._current],
                              start: this._current});
                  this._current++;
              } else if (isNum(stream[this._current])) {
                  token = this._consumeNumber(stream);
                  tokens.push(token);
              } else if (stream[this._current] === "[") {
                  // No need to increment this._current.  This happens
                  // in _consumeLBracket
                  token = this._consumeLBracket(stream);
                  tokens.push(token);
              } else if (stream[this._current] === "\"") {
                  start = this._current;
                  identifier = this._consumeQuotedIdentifier(stream);
                  tokens.push({type: TOK_QUOTEDIDENTIFIER,
                               value: identifier,
                               start: start});
              } else if (stream[this._current] === "'") {
                  start = this._current;
                  identifier = this._consumeRawStringLiteral(stream);
                  tokens.push({type: TOK_LITERAL,
                               value: identifier,
                               start: start});
              } else if (stream[this._current] === "`") {
                  start = this._current;
                  var literal = this._consumeLiteral(stream);
                  tokens.push({type: TOK_LITERAL,
                               value: literal,
                               start: start});
              } else if (operatorStartToken[stream[this._current]] !== undefined) {
                  tokens.push(this._consumeOperator(stream));
              } else if (skipChars[stream[this._current]] !== undefined) {
                  // Ignore whitespace.
                  this._current++;
              } else if (stream[this._current] === "&") {
                  start = this._current;
                  this._current++;
                  if (stream[this._current] === "&") {
                      this._current++;
                      tokens.push({type: TOK_AND, value: "&&", start: start});
                  } else {
                      tokens.push({type: TOK_EXPREF, value: "&", start: start});
                  }
              } else if (stream[this._current] === "|") {
                  start = this._current;
                  this._current++;
                  if (stream[this._current] === "|") {
                      this._current++;
                      tokens.push({type: TOK_OR, value: "||", start: start});
                  } else {
                      tokens.push({type: TOK_PIPE, value: "|", start: start});
                  }
              } else {
                  var error = new Error("Unknown character:" + stream[this._current]);
                  error.name = "LexerError";
                  throw error;
              }
          }
          return tokens;
      },

      _consumeUnquotedIdentifier: function(stream) {
          var start = this._current;
          this._current++;
          while (this._current < stream.length && isAlphaNum(stream[this._current])) {
              this._current++;
          }
          return stream.slice(start, this._current);
      },

      _consumeQuotedIdentifier: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (stream[this._current] !== "\"" && this._current < maxLength) {
              // You can escape a double quote and you can escape an escape.
              var current = this._current;
              if (stream[current] === "\\" && (stream[current + 1] === "\\" ||
                                               stream[current + 1] === "\"")) {
                  current += 2;
              } else {
                  current++;
              }
              this._current = current;
          }
          this._current++;
          return JSON.parse(stream.slice(start, this._current));
      },

      _consumeRawStringLiteral: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (stream[this._current] !== "'" && this._current < maxLength) {
              // You can escape a single quote and you can escape an escape.
              var current = this._current;
              if (stream[current] === "\\" && (stream[current + 1] === "\\" ||
                                               stream[current + 1] === "'")) {
                  current += 2;
              } else {
                  current++;
              }
              this._current = current;
          }
          this._current++;
          var literal = stream.slice(start + 1, this._current - 1);
          return literal.replace("\\'", "'");
      },

      _consumeNumber: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (isNum(stream[this._current]) && this._current < maxLength) {
              this._current++;
          }
          var value = parseInt(stream.slice(start, this._current));
          return {type: TOK_NUMBER, value: value, start: start};
      },

      _consumeLBracket: function(stream) {
          var start = this._current;
          this._current++;
          if (stream[this._current] === "?") {
              this._current++;
              return {type: TOK_FILTER, value: "[?", start: start};
          } else if (stream[this._current] === "]") {
              this._current++;
              return {type: TOK_FLATTEN, value: "[]", start: start};
          } else {
              return {type: TOK_LBRACKET, value: "[", start: start};
          }
      },

      _consumeOperator: function(stream) {
          var start = this._current;
          var startingChar = stream[start];
          this._current++;
          if (startingChar === "!") {
              if (stream[this._current] === "=") {
                  this._current++;
                  return {type: TOK_NE, value: "!=", start: start};
              } else {
                return {type: TOK_NOT, value: "!", start: start};
              }
          } else if (startingChar === "<") {
              if (stream[this._current] === "=") {
                  this._current++;
                  return {type: TOK_LTE, value: "<=", start: start};
              } else {
                  return {type: TOK_LT, value: "<", start: start};
              }
          } else if (startingChar === ">") {
              if (stream[this._current] === "=") {
                  this._current++;
                  return {type: TOK_GTE, value: ">=", start: start};
              } else {
                  return {type: TOK_GT, value: ">", start: start};
              }
          } else if (startingChar === "=") {
              if (stream[this._current] === "=") {
                  this._current++;
                  return {type: TOK_EQ, value: "==", start: start};
              }
          }
      },

      _consumeLiteral: function(stream) {
          this._current++;
          var start = this._current;
          var maxLength = stream.length;
          var literal;
          while(stream[this._current] !== "`" && this._current < maxLength) {
              // You can escape a literal char or you can escape the escape.
              var current = this._current;
              if (stream[current] === "\\" && (stream[current + 1] === "\\" ||
                                               stream[current + 1] === "`")) {
                  current += 2;
              } else {
                  current++;
              }
              this._current = current;
          }
          var literalString = trimLeft(stream.slice(start, this._current));
          literalString = literalString.replace("\\`", "`");
          if (this._looksLikeJSON(literalString)) {
              literal = JSON.parse(literalString);
          } else {
              // Try to JSON parse it as "<literal>"
              literal = JSON.parse("\"" + literalString + "\"");
          }
          // +1 gets us to the ending "`", +1 to move on to the next char.
          this._current++;
          return literal;
      },

      _looksLikeJSON: function(literalString) {
          var startingChars = "[{\"";
          var jsonLiterals = ["true", "false", "null"];
          var numberLooking = "-0123456789";

          if (literalString === "") {
              return false;
          } else if (startingChars.indexOf(literalString[0]) >= 0) {
              return true;
          } else if (jsonLiterals.indexOf(literalString) >= 0) {
              return true;
          } else if (numberLooking.indexOf(literalString[0]) >= 0) {
              try {
                  JSON.parse(literalString);
                  return true;
              } catch (ex) {
                  return false;
              }
          } else {
              return false;
          }
      }
  };

      var bindingPower = {};
      bindingPower[TOK_EOF] = 0;
      bindingPower[TOK_UNQUOTEDIDENTIFIER] = 0;
      bindingPower[TOK_QUOTEDIDENTIFIER] = 0;
      bindingPower[TOK_RBRACKET] = 0;
      bindingPower[TOK_RPAREN] = 0;
      bindingPower[TOK_COMMA] = 0;
      bindingPower[TOK_RBRACE] = 0;
      bindingPower[TOK_NUMBER] = 0;
      bindingPower[TOK_CURRENT] = 0;
      bindingPower[TOK_EXPREF] = 0;
      bindingPower[TOK_PIPE] = 1;
      bindingPower[TOK_OR] = 2;
      bindingPower[TOK_AND] = 3;
      bindingPower[TOK_EQ] = 5;
      bindingPower[TOK_GT] = 5;
      bindingPower[TOK_LT] = 5;
      bindingPower[TOK_GTE] = 5;
      bindingPower[TOK_LTE] = 5;
      bindingPower[TOK_NE] = 5;
      bindingPower[TOK_FLATTEN] = 9;
      bindingPower[TOK_STAR] = 20;
      bindingPower[TOK_FILTER] = 21;
      bindingPower[TOK_DOT] = 40;
      bindingPower[TOK_NOT] = 45;
      bindingPower[TOK_LBRACE] = 50;
      bindingPower[TOK_LBRACKET] = 55;
      bindingPower[TOK_LPAREN] = 60;

  function Parser() {
  }

  Parser.prototype = {
      parse: function(expression) {
          this._loadTokens(expression);
          this.index = 0;
          var ast = this.expression(0);
          if (this._lookahead(0) !== TOK_EOF) {
              var t = this._lookaheadToken(0);
              var error = new Error(
                  "Unexpected token type: " + t.type + ", value: " + t.value);
              error.name = "ParserError";
              throw error;
          }
          return ast;
      },

      _loadTokens: function(expression) {
          var lexer = new Lexer();
          var tokens = lexer.tokenize(expression);
          tokens.push({type: TOK_EOF, value: "", start: expression.length});
          this.tokens = tokens;
      },

      expression: function(rbp) {
          var leftToken = this._lookaheadToken(0);
          this._advance();
          var left = this.nud(leftToken);
          var currentToken = this._lookahead(0);
          while (rbp < bindingPower[currentToken]) {
              this._advance();
              left = this.led(currentToken, left);
              currentToken = this._lookahead(0);
          }
          return left;
      },

      _lookahead: function(number) {
          return this.tokens[this.index + number].type;
      },

      _lookaheadToken: function(number) {
          return this.tokens[this.index + number];
      },

      _advance: function() {
          this.index++;
      },

      nud: function(token) {
        var left;
        var right;
        var expression;
        switch (token.type) {
          case TOK_LITERAL:
            return {type: "Literal", value: token.value};
          case TOK_UNQUOTEDIDENTIFIER:
            return {type: "Field", name: token.value};
          case TOK_QUOTEDIDENTIFIER:
            var node = {type: "Field", name: token.value};
            if (this._lookahead(0) === TOK_LPAREN) {
                throw new Error("Quoted identifier not allowed for function names.");
            } else {
                return node;
            }
            break;
          case TOK_NOT:
            right = this.expression(bindingPower.Not);
            return {type: "NotExpression", children: [right]};
          case TOK_STAR:
            left = {type: "Identity"};
            right = null;
            if (this._lookahead(0) === TOK_RBRACKET) {
                // This can happen in a multiselect,
                // [a, b, *]
                right = {type: "Identity"};
            } else {
                right = this._parseProjectionRHS(bindingPower.Star);
            }
            return {type: "ValueProjection", children: [left, right]};
          case TOK_FILTER:
            return this.led(token.type, {type: "Identity"});
          case TOK_LBRACE:
            return this._parseMultiselectHash();
          case TOK_FLATTEN:
            left = {type: TOK_FLATTEN, children: [{type: "Identity"}]};
            right = this._parseProjectionRHS(bindingPower.Flatten);
            return {type: "Projection", children: [left, right]};
          case TOK_LBRACKET:
            if (this._lookahead(0) === TOK_NUMBER || this._lookahead(0) === TOK_COLON) {
                right = this._parseIndexExpression();
                return this._projectIfSlice({type: "Identity"}, right);
            } else if (this._lookahead(0) === TOK_STAR &&
                       this._lookahead(1) === TOK_RBRACKET) {
                this._advance();
                this._advance();
                right = this._parseProjectionRHS(bindingPower.Star);
                return {type: "Projection",
                        children: [{type: "Identity"}, right]};
            } else {
                return this._parseMultiselectList();
            }
            break;
          case TOK_CURRENT:
            return {type: TOK_CURRENT};
          case TOK_EXPREF:
            expression = this.expression(bindingPower.Expref);
            return {type: "ExpressionReference", children: [expression]};
          case TOK_LPAREN:
            var args = [];
            while (this._lookahead(0) !== TOK_RPAREN) {
              if (this._lookahead(0) === TOK_CURRENT) {
                expression = {type: TOK_CURRENT};
                this._advance();
              } else {
                expression = this.expression(0);
              }
              args.push(expression);
            }
            this._match(TOK_RPAREN);
            return args[0];
          default:
            this._errorToken(token);
        }
      },

      led: function(tokenName, left) {
        var right;
        switch(tokenName) {
          case TOK_DOT:
            var rbp = bindingPower.Dot;
            if (this._lookahead(0) !== TOK_STAR) {
                right = this._parseDotRHS(rbp);
                return {type: "Subexpression", children: [left, right]};
            } else {
                // Creating a projection.
                this._advance();
                right = this._parseProjectionRHS(rbp);
                return {type: "ValueProjection", children: [left, right]};
            }
            break;
          case TOK_PIPE:
            right = this.expression(bindingPower.Pipe);
            return {type: TOK_PIPE, children: [left, right]};
          case TOK_OR:
            right = this.expression(bindingPower.Or);
            return {type: "OrExpression", children: [left, right]};
          case TOK_AND:
            right = this.expression(bindingPower.And);
            return {type: "AndExpression", children: [left, right]};
          case TOK_LPAREN:
            var name = left.name;
            var args = [];
            var expression, node;
            while (this._lookahead(0) !== TOK_RPAREN) {
              if (this._lookahead(0) === TOK_CURRENT) {
                expression = {type: TOK_CURRENT};
                this._advance();
              } else {
                expression = this.expression(0);
              }
              if (this._lookahead(0) === TOK_COMMA) {
                this._match(TOK_COMMA);
              }
              args.push(expression);
            }
            this._match(TOK_RPAREN);
            node = {type: "Function", name: name, children: args};
            return node;
          case TOK_FILTER:
            var condition = this.expression(0);
            this._match(TOK_RBRACKET);
            if (this._lookahead(0) === TOK_FLATTEN) {
              right = {type: "Identity"};
            } else {
              right = this._parseProjectionRHS(bindingPower.Filter);
            }
            return {type: "FilterProjection", children: [left, right, condition]};
          case TOK_FLATTEN:
            var leftNode = {type: TOK_FLATTEN, children: [left]};
            var rightNode = this._parseProjectionRHS(bindingPower.Flatten);
            return {type: "Projection", children: [leftNode, rightNode]};
          case TOK_EQ:
          case TOK_NE:
          case TOK_GT:
          case TOK_GTE:
          case TOK_LT:
          case TOK_LTE:
            return this._parseComparator(left, tokenName);
          case TOK_LBRACKET:
            var token = this._lookaheadToken(0);
            if (token.type === TOK_NUMBER || token.type === TOK_COLON) {
                right = this._parseIndexExpression();
                return this._projectIfSlice(left, right);
            } else {
                this._match(TOK_STAR);
                this._match(TOK_RBRACKET);
                right = this._parseProjectionRHS(bindingPower.Star);
                return {type: "Projection", children: [left, right]};
            }
            break;
          default:
            this._errorToken(this._lookaheadToken(0));
        }
      },

      _match: function(tokenType) {
          if (this._lookahead(0) === tokenType) {
              this._advance();
          } else {
              var t = this._lookaheadToken(0);
              var error = new Error("Expected " + tokenType + ", got: " + t.type);
              error.name = "ParserError";
              throw error;
          }
      },

      _errorToken: function(token) {
          var error = new Error("Invalid token (" +
                                token.type + "): \"" +
                                token.value + "\"");
          error.name = "ParserError";
          throw error;
      },


      _parseIndexExpression: function() {
          if (this._lookahead(0) === TOK_COLON || this._lookahead(1) === TOK_COLON) {
              return this._parseSliceExpression();
          } else {
              var node = {
                  type: "Index",
                  value: this._lookaheadToken(0).value};
              this._advance();
              this._match(TOK_RBRACKET);
              return node;
          }
      },

      _projectIfSlice: function(left, right) {
          var indexExpr = {type: "IndexExpression", children: [left, right]};
          if (right.type === "Slice") {
              return {
                  type: "Projection",
                  children: [indexExpr, this._parseProjectionRHS(bindingPower.Star)]
              };
          } else {
              return indexExpr;
          }
      },

      _parseSliceExpression: function() {
          // [start:end:step] where each part is optional, as well as the last
          // colon.
          var parts = [null, null, null];
          var index = 0;
          var currentToken = this._lookahead(0);
          while (currentToken !== TOK_RBRACKET && index < 3) {
              if (currentToken === TOK_COLON) {
                  index++;
                  this._advance();
              } else if (currentToken === TOK_NUMBER) {
                  parts[index] = this._lookaheadToken(0).value;
                  this._advance();
              } else {
                  var t = this._lookahead(0);
                  var error = new Error("Syntax error, unexpected token: " +
                                        t.value + "(" + t.type + ")");
                  error.name = "Parsererror";
                  throw error;
              }
              currentToken = this._lookahead(0);
          }
          this._match(TOK_RBRACKET);
          return {
              type: "Slice",
              children: parts
          };
      },

      _parseComparator: function(left, comparator) {
        var right = this.expression(bindingPower[comparator]);
        return {type: "Comparator", name: comparator, children: [left, right]};
      },

      _parseDotRHS: function(rbp) {
          var lookahead = this._lookahead(0);
          var exprTokens = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER, TOK_STAR];
          if (exprTokens.indexOf(lookahead) >= 0) {
              return this.expression(rbp);
          } else if (lookahead === TOK_LBRACKET) {
              this._match(TOK_LBRACKET);
              return this._parseMultiselectList();
          } else if (lookahead === TOK_LBRACE) {
              this._match(TOK_LBRACE);
              return this._parseMultiselectHash();
          }
      },

      _parseProjectionRHS: function(rbp) {
          var right;
          if (bindingPower[this._lookahead(0)] < 10) {
              right = {type: "Identity"};
          } else if (this._lookahead(0) === TOK_LBRACKET) {
              right = this.expression(rbp);
          } else if (this._lookahead(0) === TOK_FILTER) {
              right = this.expression(rbp);
          } else if (this._lookahead(0) === TOK_DOT) {
              this._match(TOK_DOT);
              right = this._parseDotRHS(rbp);
          } else {
              var t = this._lookaheadToken(0);
              var error = new Error("Sytanx error, unexpected token: " +
                                    t.value + "(" + t.type + ")");
              error.name = "ParserError";
              throw error;
          }
          return right;
      },

      _parseMultiselectList: function() {
          var expressions = [];
          while (this._lookahead(0) !== TOK_RBRACKET) {
              var expression = this.expression(0);
              expressions.push(expression);
              if (this._lookahead(0) === TOK_COMMA) {
                  this._match(TOK_COMMA);
                  if (this._lookahead(0) === TOK_RBRACKET) {
                    throw new Error("Unexpected token Rbracket");
                  }
              }
          }
          this._match(TOK_RBRACKET);
          return {type: "MultiSelectList", children: expressions};
      },

      _parseMultiselectHash: function() {
        var pairs = [];
        var identifierTypes = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER];
        var keyToken, keyName, value, node;
        for (;;) {
          keyToken = this._lookaheadToken(0);
          if (identifierTypes.indexOf(keyToken.type) < 0) {
            throw new Error("Expecting an identifier token, got: " +
                            keyToken.type);
          }
          keyName = keyToken.value;
          this._advance();
          this._match(TOK_COLON);
          value = this.expression(0);
          node = {type: "KeyValuePair", name: keyName, value: value};
          pairs.push(node);
          if (this._lookahead(0) === TOK_COMMA) {
            this._match(TOK_COMMA);
          } else if (this._lookahead(0) === TOK_RBRACE) {
            this._match(TOK_RBRACE);
            break;
          }
        }
        return {type: "MultiSelectHash", children: pairs};
      }
  };


  function TreeInterpreter(runtime) {
    this.runtime = runtime;
  }

  TreeInterpreter.prototype = {
      search: function(node, value) {
          return this.visit(node, value);
      },

      visit: function(node, value) {
          var matched, current, result, first, second, field, left, right, collected, i;
          switch (node.type) {
            case "Field":
              if (value === null ) {
                  return null;
              } else if (isObject(value)) {
                  field = value[node.name];
                  if (field === undefined) {
                      return null;
                  } else {
                      return field;
                  }
              } else {
                return null;
              }
              break;
            case "Subexpression":
              result = this.visit(node.children[0], value);
              for (i = 1; i < node.children.length; i++) {
                  result = this.visit(node.children[1], result);
                  if (result === null) {
                      return null;
                  }
              }
              return result;
            case "IndexExpression":
              left = this.visit(node.children[0], value);
              right = this.visit(node.children[1], left);
              return right;
            case "Index":
              if (!isArray(value)) {
                return null;
              }
              var index = node.value;
              if (index < 0) {
                index = value.length + index;
              }
              result = value[index];
              if (result === undefined) {
                result = null;
              }
              return result;
            case "Slice":
              if (!isArray(value)) {
                return null;
              }
              var sliceParams = node.children.slice(0);
              var computed = this.computeSliceParams(value.length, sliceParams);
              var start = computed[0];
              var stop = computed[1];
              var step = computed[2];
              result = [];
              if (step > 0) {
                  for (i = start; i < stop; i += step) {
                      result.push(value[i]);
                  }
              } else {
                  for (i = start; i > stop; i += step) {
                      result.push(value[i]);
                  }
              }
              return result;
            case "Projection":
              // Evaluate left child.
              var base = this.visit(node.children[0], value);
              if (!isArray(base)) {
                return null;
              }
              collected = [];
              for (i = 0; i < base.length; i++) {
                current = this.visit(node.children[1], base[i]);
                if (current !== null) {
                  collected.push(current);
                }
              }
              return collected;
            case "ValueProjection":
              // Evaluate left child.
              base = this.visit(node.children[0], value);
              if (!isObject(base)) {
                return null;
              }
              collected = [];
              var values = objValues(base);
              for (i = 0; i < values.length; i++) {
                current = this.visit(node.children[1], values[i]);
                if (current !== null) {
                  collected.push(current);
                }
              }
              return collected;
            case "FilterProjection":
              base = this.visit(node.children[0], value);
              if (!isArray(base)) {
                return null;
              }
              var filtered = [];
              var finalResults = [];
              for (i = 0; i < base.length; i++) {
                matched = this.visit(node.children[2], base[i]);
                if (!isFalse(matched)) {
                  filtered.push(base[i]);
                }
              }
              for (var j = 0; j < filtered.length; j++) {
                current = this.visit(node.children[1], filtered[j]);
                if (current !== null) {
                  finalResults.push(current);
                }
              }
              return finalResults;
            case "Comparator":
              first = this.visit(node.children[0], value);
              second = this.visit(node.children[1], value);
              switch(node.name) {
                case TOK_EQ:
                  result = strictDeepEqual(first, second);
                  break;
                case TOK_NE:
                  result = !strictDeepEqual(first, second);
                  break;
                case TOK_GT:
                  result = first > second;
                  break;
                case TOK_GTE:
                  result = first >= second;
                  break;
                case TOK_LT:
                  result = first < second;
                  break;
                case TOK_LTE:
                  result = first <= second;
                  break;
                default:
                  throw new Error("Unknown comparator: " + node.name);
              }
              return result;
            case TOK_FLATTEN:
              var original = this.visit(node.children[0], value);
              if (!isArray(original)) {
                return null;
              }
              var merged = [];
              for (i = 0; i < original.length; i++) {
                current = original[i];
                if (isArray(current)) {
                  merged.push.apply(merged, current);
                } else {
                  merged.push(current);
                }
              }
              return merged;
            case "Identity":
              return value;
            case "MultiSelectList":
              if (value === null) {
                return null;
              }
              collected = [];
              for (i = 0; i < node.children.length; i++) {
                  collected.push(this.visit(node.children[i], value));
              }
              return collected;
            case "MultiSelectHash":
              if (value === null) {
                return null;
              }
              collected = {};
              var child;
              for (i = 0; i < node.children.length; i++) {
                child = node.children[i];
                collected[child.name] = this.visit(child.value, value);
              }
              return collected;
            case "OrExpression":
              matched = this.visit(node.children[0], value);
              if (isFalse(matched)) {
                  matched = this.visit(node.children[1], value);
              }
              return matched;
            case "AndExpression":
              first = this.visit(node.children[0], value);

              if (isFalse(first) === true) {
                return first;
              }
              return this.visit(node.children[1], value);
            case "NotExpression":
              first = this.visit(node.children[0], value);
              return isFalse(first);
            case "Literal":
              return node.value;
            case TOK_PIPE:
              left = this.visit(node.children[0], value);
              return this.visit(node.children[1], left);
            case TOK_CURRENT:
              return value;
            case "Function":
              var resolvedArgs = [];
              for (i = 0; i < node.children.length; i++) {
                  resolvedArgs.push(this.visit(node.children[i], value));
              }
              return this.runtime.callFunction(node.name, resolvedArgs);
            case "ExpressionReference":
              var refNode = node.children[0];
              // Tag the node with a specific attribute so the type
              // checker verify the type.
              refNode.jmespathType = TOK_EXPREF;
              return refNode;
            default:
              throw new Error("Unknown node type: " + node.type);
          }
      },

      computeSliceParams: function(arrayLength, sliceParams) {
        var start = sliceParams[0];
        var stop = sliceParams[1];
        var step = sliceParams[2];
        var computed = [null, null, null];
        if (step === null) {
          step = 1;
        } else if (step === 0) {
          var error = new Error("Invalid slice, step cannot be 0");
          error.name = "RuntimeError";
          throw error;
        }
        var stepValueNegative = step < 0 ? true : false;

        if (start === null) {
            start = stepValueNegative ? arrayLength - 1 : 0;
        } else {
            start = this.capSliceRange(arrayLength, start, step);
        }

        if (stop === null) {
            stop = stepValueNegative ? -1 : arrayLength;
        } else {
            stop = this.capSliceRange(arrayLength, stop, step);
        }
        computed[0] = start;
        computed[1] = stop;
        computed[2] = step;
        return computed;
      },

      capSliceRange: function(arrayLength, actualValue, step) {
          if (actualValue < 0) {
              actualValue += arrayLength;
              if (actualValue < 0) {
                  actualValue = step < 0 ? -1 : 0;
              }
          } else if (actualValue >= arrayLength) {
              actualValue = step < 0 ? arrayLength - 1 : arrayLength;
          }
          return actualValue;
      }

  };

  function Runtime(interpreter) {
    this._interpreter = interpreter;
    this.functionTable = {
        // name: [function, <signature>]
        // The <signature> can be:
        //
        // {
        //   args: [[type1, type2], [type1, type2]],
        //   variadic: true|false
        // }
        //
        // Each arg in the arg list is a list of valid types
        // (if the function is overloaded and supports multiple
        // types.  If the type is "any" then no type checking
        // occurs on the argument.  Variadic is optional
        // and if not provided is assumed to be false.
        abs: {_func: this._functionAbs, _signature: [{types: [TYPE_NUMBER]}]},
        avg: {_func: this._functionAvg, _signature: [{types: [TYPE_ARRAY_NUMBER]}]},
        ceil: {_func: this._functionCeil, _signature: [{types: [TYPE_NUMBER]}]},
        contains: {
            _func: this._functionContains,
            _signature: [{types: [TYPE_STRING, TYPE_ARRAY]},
                        {types: [TYPE_ANY]}]},
        "ends_with": {
            _func: this._functionEndsWith,
            _signature: [{types: [TYPE_STRING]}, {types: [TYPE_STRING]}]},
        floor: {_func: this._functionFloor, _signature: [{types: [TYPE_NUMBER]}]},
        length: {
            _func: this._functionLength,
            _signature: [{types: [TYPE_STRING, TYPE_ARRAY, TYPE_OBJECT]}]},
        map: {
            _func: this._functionMap,
            _signature: [{types: [TYPE_EXPREF]}, {types: [TYPE_ARRAY]}]},
        max: {
            _func: this._functionMax,
            _signature: [{types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING]}]},
        "merge": {
            _func: this._functionMerge,
            _signature: [{types: [TYPE_OBJECT], variadic: true}]
        },
        "max_by": {
          _func: this._functionMaxBy,
          _signature: [{types: [TYPE_ARRAY]}, {types: [TYPE_EXPREF]}]
        },
        sum: {_func: this._functionSum, _signature: [{types: [TYPE_ARRAY_NUMBER]}]},
        "starts_with": {
            _func: this._functionStartsWith,
            _signature: [{types: [TYPE_STRING]}, {types: [TYPE_STRING]}]},
        min: {
            _func: this._functionMin,
            _signature: [{types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING]}]},
        "min_by": {
          _func: this._functionMinBy,
          _signature: [{types: [TYPE_ARRAY]}, {types: [TYPE_EXPREF]}]
        },
        type: {_func: this._functionType, _signature: [{types: [TYPE_ANY]}]},
        keys: {_func: this._functionKeys, _signature: [{types: [TYPE_OBJECT]}]},
        values: {_func: this._functionValues, _signature: [{types: [TYPE_OBJECT]}]},
        sort: {_func: this._functionSort, _signature: [{types: [TYPE_ARRAY_STRING, TYPE_ARRAY_NUMBER]}]},
        "sort_by": {
          _func: this._functionSortBy,
          _signature: [{types: [TYPE_ARRAY]}, {types: [TYPE_EXPREF]}]
        },
        join: {
            _func: this._functionJoin,
            _signature: [
                {types: [TYPE_STRING]},
                {types: [TYPE_ARRAY_STRING]}
            ]
        },
        reverse: {
            _func: this._functionReverse,
            _signature: [{types: [TYPE_STRING, TYPE_ARRAY]}]},
        "to_array": {_func: this._functionToArray, _signature: [{types: [TYPE_ANY]}]},
        "to_string": {_func: this._functionToString, _signature: [{types: [TYPE_ANY]}]},
        "to_number": {_func: this._functionToNumber, _signature: [{types: [TYPE_ANY]}]},
        "not_null": {
            _func: this._functionNotNull,
            _signature: [{types: [TYPE_ANY], variadic: true}]
        }
    };
  }

  Runtime.prototype = {
    callFunction: function(name, resolvedArgs) {
      var functionEntry = this.functionTable[name];
      if (functionEntry === undefined) {
          throw new Error("Unknown function: " + name + "()");
      }
      this._validateArgs(name, resolvedArgs, functionEntry._signature);
      return functionEntry._func.call(this, resolvedArgs);
    },

    _validateArgs: function(name, args, signature) {
        // Validating the args requires validating
        // the correct arity and the correct type of each arg.
        // If the last argument is declared as variadic, then we need
        // a minimum number of args to be required.  Otherwise it has to
        // be an exact amount.
        var pluralized;
        if (signature[signature.length - 1].variadic) {
            if (args.length < signature.length) {
                pluralized = signature.length === 1 ? " argument" : " arguments";
                throw new Error("ArgumentError: " + name + "() " +
                                "takes at least" + signature.length + pluralized +
                                " but received " + args.length);
            }
        } else if (args.length !== signature.length) {
            pluralized = signature.length === 1 ? " argument" : " arguments";
            throw new Error("ArgumentError: " + name + "() " +
                            "takes " + signature.length + pluralized +
                            " but received " + args.length);
        }
        var currentSpec;
        var actualType;
        var typeMatched;
        for (var i = 0; i < signature.length; i++) {
            typeMatched = false;
            currentSpec = signature[i].types;
            actualType = this._getTypeName(args[i]);
            for (var j = 0; j < currentSpec.length; j++) {
                if (this._typeMatches(actualType, currentSpec[j], args[i])) {
                    typeMatched = true;
                    break;
                }
            }
            if (!typeMatched) {
                throw new Error("TypeError: " + name + "() " +
                                "expected argument " + (i + 1) +
                                " to be type " + currentSpec +
                                " but received type " + actualType +
                                " instead.");
            }
        }
    },

    _typeMatches: function(actual, expected, argValue) {
        if (expected === TYPE_ANY) {
            return true;
        }
        if (expected === TYPE_ARRAY_STRING ||
            expected === TYPE_ARRAY_NUMBER ||
            expected === TYPE_ARRAY) {
            // The expected type can either just be array,
            // or it can require a specific subtype (array of numbers).
            //
            // The simplest case is if "array" with no subtype is specified.
            if (expected === TYPE_ARRAY) {
                return actual === TYPE_ARRAY;
            } else if (actual === TYPE_ARRAY) {
                // Otherwise we need to check subtypes.
                // I think this has potential to be improved.
                var subtype;
                if (expected === TYPE_ARRAY_NUMBER) {
                  subtype = TYPE_NUMBER;
                } else if (expected === TYPE_ARRAY_STRING) {
                  subtype = TYPE_STRING;
                }
                for (var i = 0; i < argValue.length; i++) {
                    if (!this._typeMatches(
                            this._getTypeName(argValue[i]), subtype,
                                             argValue[i])) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            return actual === expected;
        }
    },
    _getTypeName: function(obj) {
        switch (Object.prototype.toString.call(obj)) {
            case "[object String]":
              return TYPE_STRING;
            case "[object Number]":
              return TYPE_NUMBER;
            case "[object Array]":
              return TYPE_ARRAY;
            case "[object Boolean]":
              return TYPE_BOOLEAN;
            case "[object Null]":
              return TYPE_NULL;
            case "[object Object]":
              // Check if it's an expref.  If it has, it's been
              // tagged with a jmespathType attr of 'Expref';
              if (obj.jmespathType === TOK_EXPREF) {
                return TYPE_EXPREF;
              } else {
                return TYPE_OBJECT;
              }
        }
    },

    _functionStartsWith: function(resolvedArgs) {
        return resolvedArgs[0].lastIndexOf(resolvedArgs[1]) === 0;
    },

    _functionEndsWith: function(resolvedArgs) {
        var searchStr = resolvedArgs[0];
        var suffix = resolvedArgs[1];
        return searchStr.indexOf(suffix, searchStr.length - suffix.length) !== -1;
    },

    _functionReverse: function(resolvedArgs) {
        var typeName = this._getTypeName(resolvedArgs[0]);
        if (typeName === TYPE_STRING) {
          var originalStr = resolvedArgs[0];
          var reversedStr = "";
          for (var i = originalStr.length - 1; i >= 0; i--) {
              reversedStr += originalStr[i];
          }
          return reversedStr;
        } else {
          var reversedArray = resolvedArgs[0].slice(0);
          reversedArray.reverse();
          return reversedArray;
        }
    },

    _functionAbs: function(resolvedArgs) {
      return Math.abs(resolvedArgs[0]);
    },

    _functionCeil: function(resolvedArgs) {
        return Math.ceil(resolvedArgs[0]);
    },

    _functionAvg: function(resolvedArgs) {
        var sum = 0;
        var inputArray = resolvedArgs[0];
        for (var i = 0; i < inputArray.length; i++) {
            sum += inputArray[i];
        }
        return sum / inputArray.length;
    },

    _functionContains: function(resolvedArgs) {
        return resolvedArgs[0].indexOf(resolvedArgs[1]) >= 0;
    },

    _functionFloor: function(resolvedArgs) {
        return Math.floor(resolvedArgs[0]);
    },

    _functionLength: function(resolvedArgs) {
       if (!isObject(resolvedArgs[0])) {
         return resolvedArgs[0].length;
       } else {
         // As far as I can tell, there's no way to get the length
         // of an object without O(n) iteration through the object.
         return Object.keys(resolvedArgs[0]).length;
       }
    },

    _functionMap: function(resolvedArgs) {
      var mapped = [];
      var interpreter = this._interpreter;
      var exprefNode = resolvedArgs[0];
      var elements = resolvedArgs[1];
      for (var i = 0; i < elements.length; i++) {
          mapped.push(interpreter.visit(exprefNode, elements[i]));
      }
      return mapped;
    },

    _functionMerge: function(resolvedArgs) {
      var merged = {};
      for (var i = 0; i < resolvedArgs.length; i++) {
        var current = resolvedArgs[i];
        for (var key in current) {
          merged[key] = current[key];
        }
      }
      return merged;
    },

    _functionMax: function(resolvedArgs) {
      if (resolvedArgs[0].length > 0) {
        var typeName = this._getTypeName(resolvedArgs[0][0]);
        if (typeName === TYPE_NUMBER) {
          return Math.max.apply(Math, resolvedArgs[0]);
        } else {
          var elements = resolvedArgs[0];
          var maxElement = elements[0];
          for (var i = 1; i < elements.length; i++) {
              if (maxElement.localeCompare(elements[i]) < 0) {
                  maxElement = elements[i];
              }
          }
          return maxElement;
        }
      } else {
          return null;
      }
    },

    _functionMin: function(resolvedArgs) {
      if (resolvedArgs[0].length > 0) {
        var typeName = this._getTypeName(resolvedArgs[0][0]);
        if (typeName === TYPE_NUMBER) {
          return Math.min.apply(Math, resolvedArgs[0]);
        } else {
          var elements = resolvedArgs[0];
          var minElement = elements[0];
          for (var i = 1; i < elements.length; i++) {
              if (elements[i].localeCompare(minElement) < 0) {
                  minElement = elements[i];
              }
          }
          return minElement;
        }
      } else {
        return null;
      }
    },

    _functionSum: function(resolvedArgs) {
      var sum = 0;
      var listToSum = resolvedArgs[0];
      for (var i = 0; i < listToSum.length; i++) {
        sum += listToSum[i];
      }
      return sum;
    },

    _functionType: function(resolvedArgs) {
        switch (this._getTypeName(resolvedArgs[0])) {
          case TYPE_NUMBER:
            return "number";
          case TYPE_STRING:
            return "string";
          case TYPE_ARRAY:
            return "array";
          case TYPE_OBJECT:
            return "object";
          case TYPE_BOOLEAN:
            return "boolean";
          case TYPE_EXPREF:
            return "expref";
          case TYPE_NULL:
            return "null";
        }
    },

    _functionKeys: function(resolvedArgs) {
        return Object.keys(resolvedArgs[0]);
    },

    _functionValues: function(resolvedArgs) {
        var obj = resolvedArgs[0];
        var keys = Object.keys(obj);
        var values = [];
        for (var i = 0; i < keys.length; i++) {
            values.push(obj[keys[i]]);
        }
        return values;
    },

    _functionJoin: function(resolvedArgs) {
        var joinChar = resolvedArgs[0];
        var listJoin = resolvedArgs[1];
        return listJoin.join(joinChar);
    },

    _functionToArray: function(resolvedArgs) {
        if (this._getTypeName(resolvedArgs[0]) === TYPE_ARRAY) {
            return resolvedArgs[0];
        } else {
            return [resolvedArgs[0]];
        }
    },

    _functionToString: function(resolvedArgs) {
        if (this._getTypeName(resolvedArgs[0]) === TYPE_STRING) {
            return resolvedArgs[0];
        } else {
            return JSON.stringify(resolvedArgs[0]);
        }
    },

    _functionToNumber: function(resolvedArgs) {
        var typeName = this._getTypeName(resolvedArgs[0]);
        var convertedValue;
        if (typeName === TYPE_NUMBER) {
            return resolvedArgs[0];
        } else if (typeName === TYPE_STRING) {
            convertedValue = +resolvedArgs[0];
            if (!isNaN(convertedValue)) {
                return convertedValue;
            }
        }
        return null;
    },

    _functionNotNull: function(resolvedArgs) {
        for (var i = 0; i < resolvedArgs.length; i++) {
            if (this._getTypeName(resolvedArgs[i]) !== TYPE_NULL) {
                return resolvedArgs[i];
            }
        }
        return null;
    },

    _functionSort: function(resolvedArgs) {
        var sortedArray = resolvedArgs[0].slice(0);
        sortedArray.sort();
        return sortedArray;
    },

    _functionSortBy: function(resolvedArgs) {
        var sortedArray = resolvedArgs[0].slice(0);
        if (sortedArray.length === 0) {
            return sortedArray;
        }
        var interpreter = this._interpreter;
        var exprefNode = resolvedArgs[1];
        var requiredType = this._getTypeName(
            interpreter.visit(exprefNode, sortedArray[0]));
        if ([TYPE_NUMBER, TYPE_STRING].indexOf(requiredType) < 0) {
            throw new Error("TypeError");
        }
        var that = this;
        // In order to get a stable sort out of an unstable
        // sort algorithm, we decorate/sort/undecorate (DSU)
        // by creating a new list of [index, element] pairs.
        // In the cmp function, if the evaluated elements are
        // equal, then the index will be used as the tiebreaker.
        // After the decorated list has been sorted, it will be
        // undecorated to extract the original elements.
        var decorated = [];
        for (var i = 0; i < sortedArray.length; i++) {
          decorated.push([i, sortedArray[i]]);
        }
        decorated.sort(function(a, b) {
          var exprA = interpreter.visit(exprefNode, a[1]);
          var exprB = interpreter.visit(exprefNode, b[1]);
          if (that._getTypeName(exprA) !== requiredType) {
              throw new Error(
                  "TypeError: expected " + requiredType + ", received " +
                  that._getTypeName(exprA));
          } else if (that._getTypeName(exprB) !== requiredType) {
              throw new Error(
                  "TypeError: expected " + requiredType + ", received " +
                  that._getTypeName(exprB));
          }
          if (exprA > exprB) {
            return 1;
          } else if (exprA < exprB) {
            return -1;
          } else {
            // If they're equal compare the items by their
            // order to maintain relative order of equal keys
            // (i.e. to get a stable sort).
            return a[0] - b[0];
          }
        });
        // Undecorate: extract out the original list elements.
        for (var j = 0; j < decorated.length; j++) {
          sortedArray[j] = decorated[j][1];
        }
        return sortedArray;
    },

    _functionMaxBy: function(resolvedArgs) {
      var exprefNode = resolvedArgs[1];
      var resolvedArray = resolvedArgs[0];
      var keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
      var maxNumber = -Infinity;
      var maxRecord;
      var current;
      for (var i = 0; i < resolvedArray.length; i++) {
        current = keyFunction(resolvedArray[i]);
        if (current > maxNumber) {
          maxNumber = current;
          maxRecord = resolvedArray[i];
        }
      }
      return maxRecord;
    },

    _functionMinBy: function(resolvedArgs) {
      var exprefNode = resolvedArgs[1];
      var resolvedArray = resolvedArgs[0];
      var keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
      var minNumber = Infinity;
      var minRecord;
      var current;
      for (var i = 0; i < resolvedArray.length; i++) {
        current = keyFunction(resolvedArray[i]);
        if (current < minNumber) {
          minNumber = current;
          minRecord = resolvedArray[i];
        }
      }
      return minRecord;
    },

    createKeyFunction: function(exprefNode, allowedTypes) {
      var that = this;
      var interpreter = this._interpreter;
      var keyFunc = function(x) {
        var current = interpreter.visit(exprefNode, x);
        if (allowedTypes.indexOf(that._getTypeName(current)) < 0) {
          var msg = "TypeError: expected one of " + allowedTypes +
                    ", received " + that._getTypeName(current);
          throw new Error(msg);
        }
        return current;
      };
      return keyFunc;
    }

  };

  function compile(stream) {
    var parser = new Parser();
    var ast = parser.parse(stream);
    return ast;
  }

  function tokenize(stream) {
      var lexer = new Lexer();
      return lexer.tokenize(stream);
  }

  function search(data, expression) {
      var parser = new Parser();
      // This needs to be improved.  Both the interpreter and runtime depend on
      // each other.  The runtime needs the interpreter to support exprefs.
      // There's likely a clean way to avoid the cyclic dependency.
      var runtime = new Runtime();
      var interpreter = new TreeInterpreter(runtime);
      runtime._interpreter = interpreter;
      var node = parser.parse(expression);
      return interpreter.search(node, data);
  }

  exports.tokenize = tokenize;
  exports.compile = compile;
  exports.search = search;
  exports.strictDeepEqual = strictDeepEqual;
})( false ? 0 : exports);


/***/ }),

/***/ 2155:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var v1 = __nccwpck_require__(8749);
var v4 = __nccwpck_require__(824);

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),

/***/ 2707:
/***/ ((module) => {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ 5859:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.

var crypto = __nccwpck_require__(6417);

module.exports = function nodeRNG() {
  return crypto.randomBytes(16);
};


/***/ }),

/***/ 8749:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var rng = __nccwpck_require__(5859);
var bytesToUuid = __nccwpck_require__(2707);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),

/***/ 824:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var rng = __nccwpck_require__(5859);
var bytesToUuid = __nccwpck_require__(2707);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ 2624:
/***/ (function(__unused_webpack_module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  exports.stripBOM = function(str) {
    if (str[0] === '\uFEFF') {
      return str.substring(1);
    } else {
      return str;
    }
  };

}).call(this);


/***/ }),

/***/ 3337:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var builder, defaults, escapeCDATA, requiresCDATA, wrapCDATA,
    hasProp = {}.hasOwnProperty;

  builder = __nccwpck_require__(2958);

  defaults = __nccwpck_require__(7251).defaults;

  requiresCDATA = function(entry) {
    return typeof entry === "string" && (entry.indexOf('&') >= 0 || entry.indexOf('>') >= 0 || entry.indexOf('<') >= 0);
  };

  wrapCDATA = function(entry) {
    return "<![CDATA[" + (escapeCDATA(entry)) + "]]>";
  };

  escapeCDATA = function(entry) {
    return entry.replace(']]>', ']]]]><![CDATA[>');
  };

  exports.Builder = (function() {
    function Builder(opts) {
      var key, ref, value;
      this.options = {};
      ref = defaults["0.2"];
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this.options[key] = value;
      }
      for (key in opts) {
        if (!hasProp.call(opts, key)) continue;
        value = opts[key];
        this.options[key] = value;
      }
    }

    Builder.prototype.buildObject = function(rootObj) {
      var attrkey, charkey, render, rootElement, rootName;
      attrkey = this.options.attrkey;
      charkey = this.options.charkey;
      if ((Object.keys(rootObj).length === 1) && (this.options.rootName === defaults['0.2'].rootName)) {
        rootName = Object.keys(rootObj)[0];
        rootObj = rootObj[rootName];
      } else {
        rootName = this.options.rootName;
      }
      render = (function(_this) {
        return function(element, obj) {
          var attr, child, entry, index, key, value;
          if (typeof obj !== 'object') {
            if (_this.options.cdata && requiresCDATA(obj)) {
              element.raw(wrapCDATA(obj));
            } else {
              element.txt(obj);
            }
          } else if (Array.isArray(obj)) {
            for (index in obj) {
              if (!hasProp.call(obj, index)) continue;
              child = obj[index];
              for (key in child) {
                entry = child[key];
                element = render(element.ele(key), entry).up();
              }
            }
          } else {
            for (key in obj) {
              if (!hasProp.call(obj, key)) continue;
              child = obj[key];
              if (key === attrkey) {
                if (typeof child === "object") {
                  for (attr in child) {
                    value = child[attr];
                    element = element.att(attr, value);
                  }
                }
              } else if (key === charkey) {
                if (_this.options.cdata && requiresCDATA(child)) {
                  element = element.raw(wrapCDATA(child));
                } else {
                  element = element.txt(child);
                }
              } else if (Array.isArray(child)) {
                for (index in child) {
                  if (!hasProp.call(child, index)) continue;
                  entry = child[index];
                  if (typeof entry === 'string') {
                    if (_this.options.cdata && requiresCDATA(entry)) {
                      element = element.ele(key).raw(wrapCDATA(entry)).up();
                    } else {
                      element = element.ele(key, entry).up();
                    }
                  } else {
                    element = render(element.ele(key), entry).up();
                  }
                }
              } else if (typeof child === "object") {
                element = render(element.ele(key), child).up();
              } else {
                if (typeof child === 'string' && _this.options.cdata && requiresCDATA(child)) {
                  element = element.ele(key).raw(wrapCDATA(child)).up();
                } else {
                  if (child == null) {
                    child = '';
                  }
                  element = element.ele(key, child.toString()).up();
                }
              }
            }
          }
          return element;
        };
      })(this);
      rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, {
        headless: this.options.headless,
        allowSurrogateChars: this.options.allowSurrogateChars
      });
      return render(rootElement, rootObj).end(this.options.renderOpts);
    };

    return Builder;

  })();

}).call(this);


/***/ }),

/***/ 7251:
/***/ (function(__unused_webpack_module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  exports.defaults = {
    "0.1": {
      explicitCharkey: false,
      trim: true,
      normalize: true,
      normalizeTags: false,
      attrkey: "@",
      charkey: "#",
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: false,
      explicitRoot: false,
      validator: null,
      xmlns: false,
      explicitChildren: false,
      childkey: '@@',
      charsAsChildren: false,
      includeWhiteChars: false,
      async: false,
      strict: true,
      attrNameProcessors: null,
      attrValueProcessors: null,
      tagNameProcessors: null,
      valueProcessors: null,
      emptyTag: ''
    },
    "0.2": {
      explicitCharkey: false,
      trim: false,
      normalize: false,
      normalizeTags: false,
      attrkey: "$",
      charkey: "_",
      explicitArray: true,
      ignoreAttrs: false,
      mergeAttrs: false,
      explicitRoot: true,
      validator: null,
      xmlns: false,
      explicitChildren: false,
      preserveChildrenOrder: false,
      childkey: '$$',
      charsAsChildren: false,
      includeWhiteChars: false,
      async: false,
      strict: true,
      attrNameProcessors: null,
      attrValueProcessors: null,
      tagNameProcessors: null,
      valueProcessors: null,
      rootName: 'root',
      xmldec: {
        'version': '1.0',
        'encoding': 'UTF-8',
        'standalone': true
      },
      doctype: null,
      renderOpts: {
        'pretty': true,
        'indent': '  ',
        'newline': '\n'
      },
      headless: false,
      chunkSize: 10000,
      emptyTag: '',
      cdata: false
    }
  };

}).call(this);


/***/ }),

/***/ 3314:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var bom, defaults, events, isEmpty, processItem, processors, sax, setImmediate,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  sax = __nccwpck_require__(1695);

  events = __nccwpck_require__(8614);

  bom = __nccwpck_require__(2624);

  processors = __nccwpck_require__(9236);

  setImmediate = __nccwpck_require__(8213).setImmediate;

  defaults = __nccwpck_require__(7251).defaults;

  isEmpty = function(thing) {
    return typeof thing === "object" && (thing != null) && Object.keys(thing).length === 0;
  };

  processItem = function(processors, item, key) {
    var i, len, process;
    for (i = 0, len = processors.length; i < len; i++) {
      process = processors[i];
      item = process(item, key);
    }
    return item;
  };

  exports.Parser = (function(superClass) {
    extend(Parser, superClass);

    function Parser(opts) {
      this.parseString = bind(this.parseString, this);
      this.reset = bind(this.reset, this);
      this.assignOrPush = bind(this.assignOrPush, this);
      this.processAsync = bind(this.processAsync, this);
      var key, ref, value;
      if (!(this instanceof exports.Parser)) {
        return new exports.Parser(opts);
      }
      this.options = {};
      ref = defaults["0.2"];
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this.options[key] = value;
      }
      for (key in opts) {
        if (!hasProp.call(opts, key)) continue;
        value = opts[key];
        this.options[key] = value;
      }
      if (this.options.xmlns) {
        this.options.xmlnskey = this.options.attrkey + "ns";
      }
      if (this.options.normalizeTags) {
        if (!this.options.tagNameProcessors) {
          this.options.tagNameProcessors = [];
        }
        this.options.tagNameProcessors.unshift(processors.normalize);
      }
      this.reset();
    }

    Parser.prototype.processAsync = function() {
      var chunk, err;
      try {
        if (this.remaining.length <= this.options.chunkSize) {
          chunk = this.remaining;
          this.remaining = '';
          this.saxParser = this.saxParser.write(chunk);
          return this.saxParser.close();
        } else {
          chunk = this.remaining.substr(0, this.options.chunkSize);
          this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
          this.saxParser = this.saxParser.write(chunk);
          return setImmediate(this.processAsync);
        }
      } catch (error1) {
        err = error1;
        if (!this.saxParser.errThrown) {
          this.saxParser.errThrown = true;
          return this.emit(err);
        }
      }
    };

    Parser.prototype.assignOrPush = function(obj, key, newValue) {
      if (!(key in obj)) {
        if (!this.options.explicitArray) {
          return obj[key] = newValue;
        } else {
          return obj[key] = [newValue];
        }
      } else {
        if (!(obj[key] instanceof Array)) {
          obj[key] = [obj[key]];
        }
        return obj[key].push(newValue);
      }
    };

    Parser.prototype.reset = function() {
      var attrkey, charkey, ontext, stack;
      this.removeAllListeners();
      this.saxParser = sax.parser(this.options.strict, {
        trim: false,
        normalize: false,
        xmlns: this.options.xmlns
      });
      this.saxParser.errThrown = false;
      this.saxParser.onerror = (function(_this) {
        return function(error) {
          _this.saxParser.resume();
          if (!_this.saxParser.errThrown) {
            _this.saxParser.errThrown = true;
            return _this.emit("error", error);
          }
        };
      })(this);
      this.saxParser.onend = (function(_this) {
        return function() {
          if (!_this.saxParser.ended) {
            _this.saxParser.ended = true;
            return _this.emit("end", _this.resultObject);
          }
        };
      })(this);
      this.saxParser.ended = false;
      this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
      this.resultObject = null;
      stack = [];
      attrkey = this.options.attrkey;
      charkey = this.options.charkey;
      this.saxParser.onopentag = (function(_this) {
        return function(node) {
          var key, newValue, obj, processedKey, ref;
          obj = {};
          obj[charkey] = "";
          if (!_this.options.ignoreAttrs) {
            ref = node.attributes;
            for (key in ref) {
              if (!hasProp.call(ref, key)) continue;
              if (!(attrkey in obj) && !_this.options.mergeAttrs) {
                obj[attrkey] = {};
              }
              newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key];
              processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
              if (_this.options.mergeAttrs) {
                _this.assignOrPush(obj, processedKey, newValue);
              } else {
                obj[attrkey][processedKey] = newValue;
              }
            }
          }
          obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node.name) : node.name;
          if (_this.options.xmlns) {
            obj[_this.options.xmlnskey] = {
              uri: node.uri,
              local: node.local
            };
          }
          return stack.push(obj);
        };
      })(this);
      this.saxParser.onclosetag = (function(_this) {
        return function() {
          var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s, xpath;
          obj = stack.pop();
          nodeName = obj["#name"];
          if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
            delete obj["#name"];
          }
          if (obj.cdata === true) {
            cdata = obj.cdata;
            delete obj.cdata;
          }
          s = stack[stack.length - 1];
          if (obj[charkey].match(/^\s*$/) && !cdata) {
            emptyStr = obj[charkey];
            delete obj[charkey];
          } else {
            if (_this.options.trim) {
              obj[charkey] = obj[charkey].trim();
            }
            if (_this.options.normalize) {
              obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
            }
            obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
            if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
              obj = obj[charkey];
            }
          }
          if (isEmpty(obj)) {
            obj = _this.options.emptyTag !== '' ? _this.options.emptyTag : emptyStr;
          }
          if (_this.options.validator != null) {
            xpath = "/" + ((function() {
              var i, len, results;
              results = [];
              for (i = 0, len = stack.length; i < len; i++) {
                node = stack[i];
                results.push(node["#name"]);
              }
              return results;
            })()).concat(nodeName).join("/");
            (function() {
              var err;
              try {
                return obj = _this.options.validator(xpath, s && s[nodeName], obj);
              } catch (error1) {
                err = error1;
                return _this.emit("error", err);
              }
            })();
          }
          if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === 'object') {
            if (!_this.options.preserveChildrenOrder) {
              node = {};
              if (_this.options.attrkey in obj) {
                node[_this.options.attrkey] = obj[_this.options.attrkey];
                delete obj[_this.options.attrkey];
              }
              if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
                node[_this.options.charkey] = obj[_this.options.charkey];
                delete obj[_this.options.charkey];
              }
              if (Object.getOwnPropertyNames(obj).length > 0) {
                node[_this.options.childkey] = obj;
              }
              obj = node;
            } else if (s) {
              s[_this.options.childkey] = s[_this.options.childkey] || [];
              objClone = {};
              for (key in obj) {
                if (!hasProp.call(obj, key)) continue;
                objClone[key] = obj[key];
              }
              s[_this.options.childkey].push(objClone);
              delete obj["#name"];
              if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                obj = obj[charkey];
              }
            }
          }
          if (stack.length > 0) {
            return _this.assignOrPush(s, nodeName, obj);
          } else {
            if (_this.options.explicitRoot) {
              old = obj;
              obj = {};
              obj[nodeName] = old;
            }
            _this.resultObject = obj;
            _this.saxParser.ended = true;
            return _this.emit("end", _this.resultObject);
          }
        };
      })(this);
      ontext = (function(_this) {
        return function(text) {
          var charChild, s;
          s = stack[stack.length - 1];
          if (s) {
            s[charkey] += text;
            if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, '').trim() !== '')) {
              s[_this.options.childkey] = s[_this.options.childkey] || [];
              charChild = {
                '#name': '__text__'
              };
              charChild[charkey] = text;
              if (_this.options.normalize) {
                charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
              }
              s[_this.options.childkey].push(charChild);
            }
            return s;
          }
        };
      })(this);
      this.saxParser.ontext = ontext;
      return this.saxParser.oncdata = (function(_this) {
        return function(text) {
          var s;
          s = ontext(text);
          if (s) {
            return s.cdata = true;
          }
        };
      })(this);
    };

    Parser.prototype.parseString = function(str, cb) {
      var err;
      if ((cb != null) && typeof cb === "function") {
        this.on("end", function(result) {
          this.reset();
          return cb(null, result);
        });
        this.on("error", function(err) {
          this.reset();
          return cb(err);
        });
      }
      try {
        str = str.toString();
        if (str.trim() === '') {
          this.emit("end", null);
          return true;
        }
        str = bom.stripBOM(str);
        if (this.options.async) {
          this.remaining = str;
          setImmediate(this.processAsync);
          return this.saxParser;
        }
        return this.saxParser.write(str).close();
      } catch (error1) {
        err = error1;
        if (!(this.saxParser.errThrown || this.saxParser.ended)) {
          this.emit('error', err);
          return this.saxParser.errThrown = true;
        } else if (this.saxParser.ended) {
          throw err;
        }
      }
    };

    return Parser;

  })(events.EventEmitter);

  exports.parseString = function(str, a, b) {
    var cb, options, parser;
    if (b != null) {
      if (typeof b === 'function') {
        cb = b;
      }
      if (typeof a === 'object') {
        options = a;
      }
    } else {
      if (typeof a === 'function') {
        cb = a;
      }
      options = {};
    }
    parser = new exports.Parser(options);
    return parser.parseString(str, cb);
  };

}).call(this);


/***/ }),

/***/ 9236:
/***/ (function(__unused_webpack_module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var prefixMatch;

  prefixMatch = new RegExp(/(?!xmlns)^.*:/);

  exports.normalize = function(str) {
    return str.toLowerCase();
  };

  exports.firstCharLowerCase = function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  };

  exports.stripPrefix = function(str) {
    return str.replace(prefixMatch, '');
  };

  exports.parseNumbers = function(str) {
    if (!isNaN(str)) {
      str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
    }
    return str;
  };

  exports.parseBooleans = function(str) {
    if (/^(?:true|false)$/i.test(str)) {
      str = str.toLowerCase() === 'true';
    }
    return str;
  };

}).call(this);


/***/ }),

/***/ 6189:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var builder, defaults, parser, processors,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  defaults = __nccwpck_require__(7251);

  builder = __nccwpck_require__(3337);

  parser = __nccwpck_require__(3314);

  processors = __nccwpck_require__(9236);

  exports.defaults = defaults.defaults;

  exports.processors = processors;

  exports.ValidationError = (function(superClass) {
    extend(ValidationError, superClass);

    function ValidationError(message) {
      this.message = message;
    }

    return ValidationError;

  })(Error);

  exports.Builder = builder.Builder;

  exports.Parser = parser.Parser;

  exports.parseString = parser.parseString;

}).call(this);


/***/ }),

/***/ 1695:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

;(function (sax) { // wrapper for non-node envs
  sax.parser = function (strict, opt) { return new SAXParser(strict, opt) }
  sax.SAXParser = SAXParser
  sax.SAXStream = SAXStream
  sax.createStream = createStream

  // When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
  // When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
  // since that's the earliest that a buffer overrun could occur.  This way, checks are
  // as rare as required, but as often as necessary to ensure never crossing this bound.
  // Furthermore, buffers are only tested at most once per write(), so passing a very
  // large string into write() might have undesirable effects, but this is manageable by
  // the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
  // edge case, result in creating at most one complete copy of the string passed in.
  // Set to Infinity to have unlimited buffers.
  sax.MAX_BUFFER_LENGTH = 64 * 1024

  var buffers = [
    'comment', 'sgmlDecl', 'textNode', 'tagName', 'doctype',
    'procInstName', 'procInstBody', 'entity', 'attribName',
    'attribValue', 'cdata', 'script'
  ]

  sax.EVENTS = [
    'text',
    'processinginstruction',
    'sgmldeclaration',
    'doctype',
    'comment',
    'opentagstart',
    'attribute',
    'opentag',
    'closetag',
    'opencdata',
    'cdata',
    'closecdata',
    'error',
    'end',
    'ready',
    'script',
    'opennamespace',
    'closenamespace'
  ]

  function SAXParser (strict, opt) {
    if (!(this instanceof SAXParser)) {
      return new SAXParser(strict, opt)
    }

    var parser = this
    clearBuffers(parser)
    parser.q = parser.c = ''
    parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH
    parser.opt = opt || {}
    parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags
    parser.looseCase = parser.opt.lowercase ? 'toLowerCase' : 'toUpperCase'
    parser.tags = []
    parser.closed = parser.closedRoot = parser.sawRoot = false
    parser.tag = parser.error = null
    parser.strict = !!strict
    parser.noscript = !!(strict || parser.opt.noscript)
    parser.state = S.BEGIN
    parser.strictEntities = parser.opt.strictEntities
    parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES)
    parser.attribList = []

    // namespaces form a prototype chain.
    // it always points at the current tag,
    // which protos to its parent tag.
    if (parser.opt.xmlns) {
      parser.ns = Object.create(rootNS)
    }

    // mostly just for error reporting
    parser.trackPosition = parser.opt.position !== false
    if (parser.trackPosition) {
      parser.position = parser.line = parser.column = 0
    }
    emit(parser, 'onready')
  }

  if (!Object.create) {
    Object.create = function (o) {
      function F () {}
      F.prototype = o
      var newf = new F()
      return newf
    }
  }

  if (!Object.keys) {
    Object.keys = function (o) {
      var a = []
      for (var i in o) if (o.hasOwnProperty(i)) a.push(i)
      return a
    }
  }

  function checkBufferLength (parser) {
    var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10)
    var maxActual = 0
    for (var i = 0, l = buffers.length; i < l; i++) {
      var len = parser[buffers[i]].length
      if (len > maxAllowed) {
        // Text/cdata nodes can get big, and since they're buffered,
        // we can get here under normal conditions.
        // Avoid issues by emitting the text node now,
        // so at least it won't get any bigger.
        switch (buffers[i]) {
          case 'textNode':
            closeText(parser)
            break

          case 'cdata':
            emitNode(parser, 'oncdata', parser.cdata)
            parser.cdata = ''
            break

          case 'script':
            emitNode(parser, 'onscript', parser.script)
            parser.script = ''
            break

          default:
            error(parser, 'Max buffer length exceeded: ' + buffers[i])
        }
      }
      maxActual = Math.max(maxActual, len)
    }
    // schedule the next check for the earliest possible buffer overrun.
    var m = sax.MAX_BUFFER_LENGTH - maxActual
    parser.bufferCheckPosition = m + parser.position
  }

  function clearBuffers (parser) {
    for (var i = 0, l = buffers.length; i < l; i++) {
      parser[buffers[i]] = ''
    }
  }

  function flushBuffers (parser) {
    closeText(parser)
    if (parser.cdata !== '') {
      emitNode(parser, 'oncdata', parser.cdata)
      parser.cdata = ''
    }
    if (parser.script !== '') {
      emitNode(parser, 'onscript', parser.script)
      parser.script = ''
    }
  }

  SAXParser.prototype = {
    end: function () { end(this) },
    write: write,
    resume: function () { this.error = null; return this },
    close: function () { return this.write(null) },
    flush: function () { flushBuffers(this) }
  }

  var Stream
  try {
    Stream = __nccwpck_require__(2413).Stream
  } catch (ex) {
    Stream = function () {}
  }

  var streamWraps = sax.EVENTS.filter(function (ev) {
    return ev !== 'error' && ev !== 'end'
  })

  function createStream (strict, opt) {
    return new SAXStream(strict, opt)
  }

  function SAXStream (strict, opt) {
    if (!(this instanceof SAXStream)) {
      return new SAXStream(strict, opt)
    }

    Stream.apply(this)

    this._parser = new SAXParser(strict, opt)
    this.writable = true
    this.readable = true

    var me = this

    this._parser.onend = function () {
      me.emit('end')
    }

    this._parser.onerror = function (er) {
      me.emit('error', er)

      // if didn't throw, then means error was handled.
      // go ahead and clear error, so we can write again.
      me._parser.error = null
    }

    this._decoder = null

    streamWraps.forEach(function (ev) {
      Object.defineProperty(me, 'on' + ev, {
        get: function () {
          return me._parser['on' + ev]
        },
        set: function (h) {
          if (!h) {
            me.removeAllListeners(ev)
            me._parser['on' + ev] = h
            return h
          }
          me.on(ev, h)
        },
        enumerable: true,
        configurable: false
      })
    })
  }

  SAXStream.prototype = Object.create(Stream.prototype, {
    constructor: {
      value: SAXStream
    }
  })

  SAXStream.prototype.write = function (data) {
    if (typeof Buffer === 'function' &&
      typeof Buffer.isBuffer === 'function' &&
      Buffer.isBuffer(data)) {
      if (!this._decoder) {
        var SD = __nccwpck_require__(4304).StringDecoder
        this._decoder = new SD('utf8')
      }
      data = this._decoder.write(data)
    }

    this._parser.write(data.toString())
    this.emit('data', data)
    return true
  }

  SAXStream.prototype.end = function (chunk) {
    if (chunk && chunk.length) {
      this.write(chunk)
    }
    this._parser.end()
    return true
  }

  SAXStream.prototype.on = function (ev, handler) {
    var me = this
    if (!me._parser['on' + ev] && streamWraps.indexOf(ev) !== -1) {
      me._parser['on' + ev] = function () {
        var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
        args.splice(0, 0, ev)
        me.emit.apply(me, args)
      }
    }

    return Stream.prototype.on.call(me, ev, handler)
  }

  // this really needs to be replaced with character classes.
  // XML allows all manner of ridiculous numbers and digits.
  var CDATA = '[CDATA['
  var DOCTYPE = 'DOCTYPE'
  var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace'
  var XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/'
  var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE }

  // http://www.w3.org/TR/REC-xml/#NT-NameStartChar
  // This implementation works on strings, a single character at a time
  // as such, it cannot ever support astral-plane characters (10000-EFFFF)
  // without a significant breaking change to either this  parser, or the
  // JavaScript language.  Implementation of an emoji-capable xml parser
  // is left as an exercise for the reader.
  var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/

  var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

  var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/
  var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

  function isWhitespace (c) {
    return c === ' ' || c === '\n' || c === '\r' || c === '\t'
  }

  function isQuote (c) {
    return c === '"' || c === '\''
  }

  function isAttribEnd (c) {
    return c === '>' || isWhitespace(c)
  }

  function isMatch (regex, c) {
    return regex.test(c)
  }

  function notMatch (regex, c) {
    return !isMatch(regex, c)
  }

  var S = 0
  sax.STATE = {
    BEGIN: S++, // leading byte order mark or whitespace
    BEGIN_WHITESPACE: S++, // leading whitespace
    TEXT: S++, // general stuff
    TEXT_ENTITY: S++, // &amp and such.
    OPEN_WAKA: S++, // <
    SGML_DECL: S++, // <!BLARG
    SGML_DECL_QUOTED: S++, // <!BLARG foo "bar
    DOCTYPE: S++, // <!DOCTYPE
    DOCTYPE_QUOTED: S++, // <!DOCTYPE "//blah
    DOCTYPE_DTD: S++, // <!DOCTYPE "//blah" [ ...
    DOCTYPE_DTD_QUOTED: S++, // <!DOCTYPE "//blah" [ "foo
    COMMENT_STARTING: S++, // <!-
    COMMENT: S++, // <!--
    COMMENT_ENDING: S++, // <!-- blah -
    COMMENT_ENDED: S++, // <!-- blah --
    CDATA: S++, // <![CDATA[ something
    CDATA_ENDING: S++, // ]
    CDATA_ENDING_2: S++, // ]]
    PROC_INST: S++, // <?hi
    PROC_INST_BODY: S++, // <?hi there
    PROC_INST_ENDING: S++, // <?hi "there" ?
    OPEN_TAG: S++, // <strong
    OPEN_TAG_SLASH: S++, // <strong /
    ATTRIB: S++, // <a
    ATTRIB_NAME: S++, // <a foo
    ATTRIB_NAME_SAW_WHITE: S++, // <a foo _
    ATTRIB_VALUE: S++, // <a foo=
    ATTRIB_VALUE_QUOTED: S++, // <a foo="bar
    ATTRIB_VALUE_CLOSED: S++, // <a foo="bar"
    ATTRIB_VALUE_UNQUOTED: S++, // <a foo=bar
    ATTRIB_VALUE_ENTITY_Q: S++, // <foo bar="&quot;"
    ATTRIB_VALUE_ENTITY_U: S++, // <foo bar=&quot
    CLOSE_TAG: S++, // </a
    CLOSE_TAG_SAW_WHITE: S++, // </a   >
    SCRIPT: S++, // <script> ...
    SCRIPT_ENDING: S++ // <script> ... <
  }

  sax.XML_ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'"
  }

  sax.ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'",
    'AElig': 198,
    'Aacute': 193,
    'Acirc': 194,
    'Agrave': 192,
    'Aring': 197,
    'Atilde': 195,
    'Auml': 196,
    'Ccedil': 199,
    'ETH': 208,
    'Eacute': 201,
    'Ecirc': 202,
    'Egrave': 200,
    'Euml': 203,
    'Iacute': 205,
    'Icirc': 206,
    'Igrave': 204,
    'Iuml': 207,
    'Ntilde': 209,
    'Oacute': 211,
    'Ocirc': 212,
    'Ograve': 210,
    'Oslash': 216,
    'Otilde': 213,
    'Ouml': 214,
    'THORN': 222,
    'Uacute': 218,
    'Ucirc': 219,
    'Ugrave': 217,
    'Uuml': 220,
    'Yacute': 221,
    'aacute': 225,
    'acirc': 226,
    'aelig': 230,
    'agrave': 224,
    'aring': 229,
    'atilde': 227,
    'auml': 228,
    'ccedil': 231,
    'eacute': 233,
    'ecirc': 234,
    'egrave': 232,
    'eth': 240,
    'euml': 235,
    'iacute': 237,
    'icirc': 238,
    'igrave': 236,
    'iuml': 239,
    'ntilde': 241,
    'oacute': 243,
    'ocirc': 244,
    'ograve': 242,
    'oslash': 248,
    'otilde': 245,
    'ouml': 246,
    'szlig': 223,
    'thorn': 254,
    'uacute': 250,
    'ucirc': 251,
    'ugrave': 249,
    'uuml': 252,
    'yacute': 253,
    'yuml': 255,
    'copy': 169,
    'reg': 174,
    'nbsp': 160,
    'iexcl': 161,
    'cent': 162,
    'pound': 163,
    'curren': 164,
    'yen': 165,
    'brvbar': 166,
    'sect': 167,
    'uml': 168,
    'ordf': 170,
    'laquo': 171,
    'not': 172,
    'shy': 173,
    'macr': 175,
    'deg': 176,
    'plusmn': 177,
    'sup1': 185,
    'sup2': 178,
    'sup3': 179,
    'acute': 180,
    'micro': 181,
    'para': 182,
    'middot': 183,
    'cedil': 184,
    'ordm': 186,
    'raquo': 187,
    'frac14': 188,
    'frac12': 189,
    'frac34': 190,
    'iquest': 191,
    'times': 215,
    'divide': 247,
    'OElig': 338,
    'oelig': 339,
    'Scaron': 352,
    'scaron': 353,
    'Yuml': 376,
    'fnof': 402,
    'circ': 710,
    'tilde': 732,
    'Alpha': 913,
    'Beta': 914,
    'Gamma': 915,
    'Delta': 916,
    'Epsilon': 917,
    'Zeta': 918,
    'Eta': 919,
    'Theta': 920,
    'Iota': 921,
    'Kappa': 922,
    'Lambda': 923,
    'Mu': 924,
    'Nu': 925,
    'Xi': 926,
    'Omicron': 927,
    'Pi': 928,
    'Rho': 929,
    'Sigma': 931,
    'Tau': 932,
    'Upsilon': 933,
    'Phi': 934,
    'Chi': 935,
    'Psi': 936,
    'Omega': 937,
    'alpha': 945,
    'beta': 946,
    'gamma': 947,
    'delta': 948,
    'epsilon': 949,
    'zeta': 950,
    'eta': 951,
    'theta': 952,
    'iota': 953,
    'kappa': 954,
    'lambda': 955,
    'mu': 956,
    'nu': 957,
    'xi': 958,
    'omicron': 959,
    'pi': 960,
    'rho': 961,
    'sigmaf': 962,
    'sigma': 963,
    'tau': 964,
    'upsilon': 965,
    'phi': 966,
    'chi': 967,
    'psi': 968,
    'omega': 969,
    'thetasym': 977,
    'upsih': 978,
    'piv': 982,
    'ensp': 8194,
    'emsp': 8195,
    'thinsp': 8201,
    'zwnj': 8204,
    'zwj': 8205,
    'lrm': 8206,
    'rlm': 8207,
    'ndash': 8211,
    'mdash': 8212,
    'lsquo': 8216,
    'rsquo': 8217,
    'sbquo': 8218,
    'ldquo': 8220,
    'rdquo': 8221,
    'bdquo': 8222,
    'dagger': 8224,
    'Dagger': 8225,
    'bull': 8226,
    'hellip': 8230,
    'permil': 8240,
    'prime': 8242,
    'Prime': 8243,
    'lsaquo': 8249,
    'rsaquo': 8250,
    'oline': 8254,
    'frasl': 8260,
    'euro': 8364,
    'image': 8465,
    'weierp': 8472,
    'real': 8476,
    'trade': 8482,
    'alefsym': 8501,
    'larr': 8592,
    'uarr': 8593,
    'rarr': 8594,
    'darr': 8595,
    'harr': 8596,
    'crarr': 8629,
    'lArr': 8656,
    'uArr': 8657,
    'rArr': 8658,
    'dArr': 8659,
    'hArr': 8660,
    'forall': 8704,
    'part': 8706,
    'exist': 8707,
    'empty': 8709,
    'nabla': 8711,
    'isin': 8712,
    'notin': 8713,
    'ni': 8715,
    'prod': 8719,
    'sum': 8721,
    'minus': 8722,
    'lowast': 8727,
    'radic': 8730,
    'prop': 8733,
    'infin': 8734,
    'ang': 8736,
    'and': 8743,
    'or': 8744,
    'cap': 8745,
    'cup': 8746,
    'int': 8747,
    'there4': 8756,
    'sim': 8764,
    'cong': 8773,
    'asymp': 8776,
    'ne': 8800,
    'equiv': 8801,
    'le': 8804,
    'ge': 8805,
    'sub': 8834,
    'sup': 8835,
    'nsub': 8836,
    'sube': 8838,
    'supe': 8839,
    'oplus': 8853,
    'otimes': 8855,
    'perp': 8869,
    'sdot': 8901,
    'lceil': 8968,
    'rceil': 8969,
    'lfloor': 8970,
    'rfloor': 8971,
    'lang': 9001,
    'rang': 9002,
    'loz': 9674,
    'spades': 9824,
    'clubs': 9827,
    'hearts': 9829,
    'diams': 9830
  }

  Object.keys(sax.ENTITIES).forEach(function (key) {
    var e = sax.ENTITIES[key]
    var s = typeof e === 'number' ? String.fromCharCode(e) : e
    sax.ENTITIES[key] = s
  })

  for (var s in sax.STATE) {
    sax.STATE[sax.STATE[s]] = s
  }

  // shorthand
  S = sax.STATE

  function emit (parser, event, data) {
    parser[event] && parser[event](data)
  }

  function emitNode (parser, nodeType, data) {
    if (parser.textNode) closeText(parser)
    emit(parser, nodeType, data)
  }

  function closeText (parser) {
    parser.textNode = textopts(parser.opt, parser.textNode)
    if (parser.textNode) emit(parser, 'ontext', parser.textNode)
    parser.textNode = ''
  }

  function textopts (opt, text) {
    if (opt.trim) text = text.trim()
    if (opt.normalize) text = text.replace(/\s+/g, ' ')
    return text
  }

  function error (parser, er) {
    closeText(parser)
    if (parser.trackPosition) {
      er += '\nLine: ' + parser.line +
        '\nColumn: ' + parser.column +
        '\nChar: ' + parser.c
    }
    er = new Error(er)
    parser.error = er
    emit(parser, 'onerror', er)
    return parser
  }

  function end (parser) {
    if (parser.sawRoot && !parser.closedRoot) strictFail(parser, 'Unclosed root tag')
    if ((parser.state !== S.BEGIN) &&
      (parser.state !== S.BEGIN_WHITESPACE) &&
      (parser.state !== S.TEXT)) {
      error(parser, 'Unexpected end')
    }
    closeText(parser)
    parser.c = ''
    parser.closed = true
    emit(parser, 'onend')
    SAXParser.call(parser, parser.strict, parser.opt)
    return parser
  }

  function strictFail (parser, message) {
    if (typeof parser !== 'object' || !(parser instanceof SAXParser)) {
      throw new Error('bad call to strictFail')
    }
    if (parser.strict) {
      error(parser, message)
    }
  }

  function newTag (parser) {
    if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]()
    var parent = parser.tags[parser.tags.length - 1] || parser
    var tag = parser.tag = { name: parser.tagName, attributes: {} }

    // will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
    if (parser.opt.xmlns) {
      tag.ns = parent.ns
    }
    parser.attribList.length = 0
    emitNode(parser, 'onopentagstart', tag)
  }

  function qname (name, attribute) {
    var i = name.indexOf(':')
    var qualName = i < 0 ? [ '', name ] : name.split(':')
    var prefix = qualName[0]
    var local = qualName[1]

    // <x "xmlns"="http://foo">
    if (attribute && name === 'xmlns') {
      prefix = 'xmlns'
      local = ''
    }

    return { prefix: prefix, local: local }
  }

  function attrib (parser) {
    if (!parser.strict) {
      parser.attribName = parser.attribName[parser.looseCase]()
    }

    if (parser.attribList.indexOf(parser.attribName) !== -1 ||
      parser.tag.attributes.hasOwnProperty(parser.attribName)) {
      parser.attribName = parser.attribValue = ''
      return
    }

    if (parser.opt.xmlns) {
      var qn = qname(parser.attribName, true)
      var prefix = qn.prefix
      var local = qn.local

      if (prefix === 'xmlns') {
        // namespace binding attribute. push the binding into scope
        if (local === 'xml' && parser.attribValue !== XML_NAMESPACE) {
          strictFail(parser,
            'xml: prefix must be bound to ' + XML_NAMESPACE + '\n' +
            'Actual: ' + parser.attribValue)
        } else if (local === 'xmlns' && parser.attribValue !== XMLNS_NAMESPACE) {
          strictFail(parser,
            'xmlns: prefix must be bound to ' + XMLNS_NAMESPACE + '\n' +
            'Actual: ' + parser.attribValue)
        } else {
          var tag = parser.tag
          var parent = parser.tags[parser.tags.length - 1] || parser
          if (tag.ns === parent.ns) {
            tag.ns = Object.create(parent.ns)
          }
          tag.ns[local] = parser.attribValue
        }
      }

      // defer onattribute events until all attributes have been seen
      // so any new bindings can take effect. preserve attribute order
      // so deferred events can be emitted in document order
      parser.attribList.push([parser.attribName, parser.attribValue])
    } else {
      // in non-xmlns mode, we can emit the event right away
      parser.tag.attributes[parser.attribName] = parser.attribValue
      emitNode(parser, 'onattribute', {
        name: parser.attribName,
        value: parser.attribValue
      })
    }

    parser.attribName = parser.attribValue = ''
  }

  function openTag (parser, selfClosing) {
    if (parser.opt.xmlns) {
      // emit namespace binding events
      var tag = parser.tag

      // add namespace info to tag
      var qn = qname(parser.tagName)
      tag.prefix = qn.prefix
      tag.local = qn.local
      tag.uri = tag.ns[qn.prefix] || ''

      if (tag.prefix && !tag.uri) {
        strictFail(parser, 'Unbound namespace prefix: ' +
          JSON.stringify(parser.tagName))
        tag.uri = qn.prefix
      }

      var parent = parser.tags[parser.tags.length - 1] || parser
      if (tag.ns && parent.ns !== tag.ns) {
        Object.keys(tag.ns).forEach(function (p) {
          emitNode(parser, 'onopennamespace', {
            prefix: p,
            uri: tag.ns[p]
          })
        })
      }

      // handle deferred onattribute events
      // Note: do not apply default ns to attributes:
      //   http://www.w3.org/TR/REC-xml-names/#defaulting
      for (var i = 0, l = parser.attribList.length; i < l; i++) {
        var nv = parser.attribList[i]
        var name = nv[0]
        var value = nv[1]
        var qualName = qname(name, true)
        var prefix = qualName.prefix
        var local = qualName.local
        var uri = prefix === '' ? '' : (tag.ns[prefix] || '')
        var a = {
          name: name,
          value: value,
          prefix: prefix,
          local: local,
          uri: uri
        }

        // if there's any attributes with an undefined namespace,
        // then fail on them now.
        if (prefix && prefix !== 'xmlns' && !uri) {
          strictFail(parser, 'Unbound namespace prefix: ' +
            JSON.stringify(prefix))
          a.uri = prefix
        }
        parser.tag.attributes[name] = a
        emitNode(parser, 'onattribute', a)
      }
      parser.attribList.length = 0
    }

    parser.tag.isSelfClosing = !!selfClosing

    // process the tag
    parser.sawRoot = true
    parser.tags.push(parser.tag)
    emitNode(parser, 'onopentag', parser.tag)
    if (!selfClosing) {
      // special case for <script> in non-strict mode.
      if (!parser.noscript && parser.tagName.toLowerCase() === 'script') {
        parser.state = S.SCRIPT
      } else {
        parser.state = S.TEXT
      }
      parser.tag = null
      parser.tagName = ''
    }
    parser.attribName = parser.attribValue = ''
    parser.attribList.length = 0
  }

  function closeTag (parser) {
    if (!parser.tagName) {
      strictFail(parser, 'Weird empty close tag.')
      parser.textNode += '</>'
      parser.state = S.TEXT
      return
    }

    if (parser.script) {
      if (parser.tagName !== 'script') {
        parser.script += '</' + parser.tagName + '>'
        parser.tagName = ''
        parser.state = S.SCRIPT
        return
      }
      emitNode(parser, 'onscript', parser.script)
      parser.script = ''
    }

    // first make sure that the closing tag actually exists.
    // <a><b></c></b></a> will close everything, otherwise.
    var t = parser.tags.length
    var tagName = parser.tagName
    if (!parser.strict) {
      tagName = tagName[parser.looseCase]()
    }
    var closeTo = tagName
    while (t--) {
      var close = parser.tags[t]
      if (close.name !== closeTo) {
        // fail the first time in strict mode
        strictFail(parser, 'Unexpected close tag')
      } else {
        break
      }
    }

    // didn't find it.  we already failed for strict, so just abort.
    if (t < 0) {
      strictFail(parser, 'Unmatched closing tag: ' + parser.tagName)
      parser.textNode += '</' + parser.tagName + '>'
      parser.state = S.TEXT
      return
    }
    parser.tagName = tagName
    var s = parser.tags.length
    while (s-- > t) {
      var tag = parser.tag = parser.tags.pop()
      parser.tagName = parser.tag.name
      emitNode(parser, 'onclosetag', parser.tagName)

      var x = {}
      for (var i in tag.ns) {
        x[i] = tag.ns[i]
      }

      var parent = parser.tags[parser.tags.length - 1] || parser
      if (parser.opt.xmlns && tag.ns !== parent.ns) {
        // remove namespace bindings introduced by tag
        Object.keys(tag.ns).forEach(function (p) {
          var n = tag.ns[p]
          emitNode(parser, 'onclosenamespace', { prefix: p, uri: n })
        })
      }
    }
    if (t === 0) parser.closedRoot = true
    parser.tagName = parser.attribValue = parser.attribName = ''
    parser.attribList.length = 0
    parser.state = S.TEXT
  }

  function parseEntity (parser) {
    var entity = parser.entity
    var entityLC = entity.toLowerCase()
    var num
    var numStr = ''

    if (parser.ENTITIES[entity]) {
      return parser.ENTITIES[entity]
    }
    if (parser.ENTITIES[entityLC]) {
      return parser.ENTITIES[entityLC]
    }
    entity = entityLC
    if (entity.charAt(0) === '#') {
      if (entity.charAt(1) === 'x') {
        entity = entity.slice(2)
        num = parseInt(entity, 16)
        numStr = num.toString(16)
      } else {
        entity = entity.slice(1)
        num = parseInt(entity, 10)
        numStr = num.toString(10)
      }
    }
    entity = entity.replace(/^0+/, '')
    if (isNaN(num) || numStr.toLowerCase() !== entity) {
      strictFail(parser, 'Invalid character entity')
      return '&' + parser.entity + ';'
    }

    return String.fromCodePoint(num)
  }

  function beginWhiteSpace (parser, c) {
    if (c === '<') {
      parser.state = S.OPEN_WAKA
      parser.startTagPosition = parser.position
    } else if (!isWhitespace(c)) {
      // have to process this as a text node.
      // weird, but happens.
      strictFail(parser, 'Non-whitespace before first tag.')
      parser.textNode = c
      parser.state = S.TEXT
    }
  }

  function charAt (chunk, i) {
    var result = ''
    if (i < chunk.length) {
      result = chunk.charAt(i)
    }
    return result
  }

  function write (chunk) {
    var parser = this
    if (this.error) {
      throw this.error
    }
    if (parser.closed) {
      return error(parser,
        'Cannot write after close. Assign an onready handler.')
    }
    if (chunk === null) {
      return end(parser)
    }
    if (typeof chunk === 'object') {
      chunk = chunk.toString()
    }
    var i = 0
    var c = ''
    while (true) {
      c = charAt(chunk, i++)
      parser.c = c

      if (!c) {
        break
      }

      if (parser.trackPosition) {
        parser.position++
        if (c === '\n') {
          parser.line++
          parser.column = 0
        } else {
          parser.column++
        }
      }

      switch (parser.state) {
        case S.BEGIN:
          parser.state = S.BEGIN_WHITESPACE
          if (c === '\uFEFF') {
            continue
          }
          beginWhiteSpace(parser, c)
          continue

        case S.BEGIN_WHITESPACE:
          beginWhiteSpace(parser, c)
          continue

        case S.TEXT:
          if (parser.sawRoot && !parser.closedRoot) {
            var starti = i - 1
            while (c && c !== '<' && c !== '&') {
              c = charAt(chunk, i++)
              if (c && parser.trackPosition) {
                parser.position++
                if (c === '\n') {
                  parser.line++
                  parser.column = 0
                } else {
                  parser.column++
                }
              }
            }
            parser.textNode += chunk.substring(starti, i - 1)
          }
          if (c === '<' && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
            parser.state = S.OPEN_WAKA
            parser.startTagPosition = parser.position
          } else {
            if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
              strictFail(parser, 'Text data outside of root node.')
            }
            if (c === '&') {
              parser.state = S.TEXT_ENTITY
            } else {
              parser.textNode += c
            }
          }
          continue

        case S.SCRIPT:
          // only non-strict
          if (c === '<') {
            parser.state = S.SCRIPT_ENDING
          } else {
            parser.script += c
          }
          continue

        case S.SCRIPT_ENDING:
          if (c === '/') {
            parser.state = S.CLOSE_TAG
          } else {
            parser.script += '<' + c
            parser.state = S.SCRIPT
          }
          continue

        case S.OPEN_WAKA:
          // either a /, ?, !, or text is coming next.
          if (c === '!') {
            parser.state = S.SGML_DECL
            parser.sgmlDecl = ''
          } else if (isWhitespace(c)) {
            // wait for it...
          } else if (isMatch(nameStart, c)) {
            parser.state = S.OPEN_TAG
            parser.tagName = c
          } else if (c === '/') {
            parser.state = S.CLOSE_TAG
            parser.tagName = ''
          } else if (c === '?') {
            parser.state = S.PROC_INST
            parser.procInstName = parser.procInstBody = ''
          } else {
            strictFail(parser, 'Unencoded <')
            // if there was some whitespace, then add that in.
            if (parser.startTagPosition + 1 < parser.position) {
              var pad = parser.position - parser.startTagPosition
              c = new Array(pad).join(' ') + c
            }
            parser.textNode += '<' + c
            parser.state = S.TEXT
          }
          continue

        case S.SGML_DECL:
          if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
            emitNode(parser, 'onopencdata')
            parser.state = S.CDATA
            parser.sgmlDecl = ''
            parser.cdata = ''
          } else if (parser.sgmlDecl + c === '--') {
            parser.state = S.COMMENT
            parser.comment = ''
            parser.sgmlDecl = ''
          } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
            parser.state = S.DOCTYPE
            if (parser.doctype || parser.sawRoot) {
              strictFail(parser,
                'Inappropriately located doctype declaration')
            }
            parser.doctype = ''
            parser.sgmlDecl = ''
          } else if (c === '>') {
            emitNode(parser, 'onsgmldeclaration', parser.sgmlDecl)
            parser.sgmlDecl = ''
            parser.state = S.TEXT
          } else if (isQuote(c)) {
            parser.state = S.SGML_DECL_QUOTED
            parser.sgmlDecl += c
          } else {
            parser.sgmlDecl += c
          }
          continue

        case S.SGML_DECL_QUOTED:
          if (c === parser.q) {
            parser.state = S.SGML_DECL
            parser.q = ''
          }
          parser.sgmlDecl += c
          continue

        case S.DOCTYPE:
          if (c === '>') {
            parser.state = S.TEXT
            emitNode(parser, 'ondoctype', parser.doctype)
            parser.doctype = true // just remember that we saw it.
          } else {
            parser.doctype += c
            if (c === '[') {
              parser.state = S.DOCTYPE_DTD
            } else if (isQuote(c)) {
              parser.state = S.DOCTYPE_QUOTED
              parser.q = c
            }
          }
          continue

        case S.DOCTYPE_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.q = ''
            parser.state = S.DOCTYPE
          }
          continue

        case S.DOCTYPE_DTD:
          parser.doctype += c
          if (c === ']') {
            parser.state = S.DOCTYPE
          } else if (isQuote(c)) {
            parser.state = S.DOCTYPE_DTD_QUOTED
            parser.q = c
          }
          continue

        case S.DOCTYPE_DTD_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.state = S.DOCTYPE_DTD
            parser.q = ''
          }
          continue

        case S.COMMENT:
          if (c === '-') {
            parser.state = S.COMMENT_ENDING
          } else {
            parser.comment += c
          }
          continue

        case S.COMMENT_ENDING:
          if (c === '-') {
            parser.state = S.COMMENT_ENDED
            parser.comment = textopts(parser.opt, parser.comment)
            if (parser.comment) {
              emitNode(parser, 'oncomment', parser.comment)
            }
            parser.comment = ''
          } else {
            parser.comment += '-' + c
            parser.state = S.COMMENT
          }
          continue

        case S.COMMENT_ENDED:
          if (c !== '>') {
            strictFail(parser, 'Malformed comment')
            // allow <!-- blah -- bloo --> in non-strict mode,
            // which is a comment of " blah -- bloo "
            parser.comment += '--' + c
            parser.state = S.COMMENT
          } else {
            parser.state = S.TEXT
          }
          continue

        case S.CDATA:
          if (c === ']') {
            parser.state = S.CDATA_ENDING
          } else {
            parser.cdata += c
          }
          continue

        case S.CDATA_ENDING:
          if (c === ']') {
            parser.state = S.CDATA_ENDING_2
          } else {
            parser.cdata += ']' + c
            parser.state = S.CDATA
          }
          continue

        case S.CDATA_ENDING_2:
          if (c === '>') {
            if (parser.cdata) {
              emitNode(parser, 'oncdata', parser.cdata)
            }
            emitNode(parser, 'onclosecdata')
            parser.cdata = ''
            parser.state = S.TEXT
          } else if (c === ']') {
            parser.cdata += ']'
          } else {
            parser.cdata += ']]' + c
            parser.state = S.CDATA
          }
          continue

        case S.PROC_INST:
          if (c === '?') {
            parser.state = S.PROC_INST_ENDING
          } else if (isWhitespace(c)) {
            parser.state = S.PROC_INST_BODY
          } else {
            parser.procInstName += c
          }
          continue

        case S.PROC_INST_BODY:
          if (!parser.procInstBody && isWhitespace(c)) {
            continue
          } else if (c === '?') {
            parser.state = S.PROC_INST_ENDING
          } else {
            parser.procInstBody += c
          }
          continue

        case S.PROC_INST_ENDING:
          if (c === '>') {
            emitNode(parser, 'onprocessinginstruction', {
              name: parser.procInstName,
              body: parser.procInstBody
            })
            parser.procInstName = parser.procInstBody = ''
            parser.state = S.TEXT
          } else {
            parser.procInstBody += '?' + c
            parser.state = S.PROC_INST_BODY
          }
          continue

        case S.OPEN_TAG:
          if (isMatch(nameBody, c)) {
            parser.tagName += c
          } else {
            newTag(parser)
            if (c === '>') {
              openTag(parser)
            } else if (c === '/') {
              parser.state = S.OPEN_TAG_SLASH
            } else {
              if (!isWhitespace(c)) {
                strictFail(parser, 'Invalid character in tag name')
              }
              parser.state = S.ATTRIB
            }
          }
          continue

        case S.OPEN_TAG_SLASH:
          if (c === '>') {
            openTag(parser, true)
            closeTag(parser)
          } else {
            strictFail(parser, 'Forward-slash in opening tag not followed by >')
            parser.state = S.ATTRIB
          }
          continue

        case S.ATTRIB:
          // haven't read the attribute name yet.
          if (isWhitespace(c)) {
            continue
          } else if (c === '>') {
            openTag(parser)
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH
          } else if (isMatch(nameStart, c)) {
            parser.attribName = c
            parser.attribValue = ''
            parser.state = S.ATTRIB_NAME
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_NAME:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE
          } else if (c === '>') {
            strictFail(parser, 'Attribute without value')
            parser.attribValue = parser.attribName
            attrib(parser)
            openTag(parser)
          } else if (isWhitespace(c)) {
            parser.state = S.ATTRIB_NAME_SAW_WHITE
          } else if (isMatch(nameBody, c)) {
            parser.attribName += c
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_NAME_SAW_WHITE:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE
          } else if (isWhitespace(c)) {
            continue
          } else {
            strictFail(parser, 'Attribute without value')
            parser.tag.attributes[parser.attribName] = ''
            parser.attribValue = ''
            emitNode(parser, 'onattribute', {
              name: parser.attribName,
              value: ''
            })
            parser.attribName = ''
            if (c === '>') {
              openTag(parser)
            } else if (isMatch(nameStart, c)) {
              parser.attribName = c
              parser.state = S.ATTRIB_NAME
            } else {
              strictFail(parser, 'Invalid attribute name')
              parser.state = S.ATTRIB
            }
          }
          continue

        case S.ATTRIB_VALUE:
          if (isWhitespace(c)) {
            continue
          } else if (isQuote(c)) {
            parser.q = c
            parser.state = S.ATTRIB_VALUE_QUOTED
          } else {
            strictFail(parser, 'Unquoted attribute value')
            parser.state = S.ATTRIB_VALUE_UNQUOTED
            parser.attribValue = c
          }
          continue

        case S.ATTRIB_VALUE_QUOTED:
          if (c !== parser.q) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_Q
            } else {
              parser.attribValue += c
            }
            continue
          }
          attrib(parser)
          parser.q = ''
          parser.state = S.ATTRIB_VALUE_CLOSED
          continue

        case S.ATTRIB_VALUE_CLOSED:
          if (isWhitespace(c)) {
            parser.state = S.ATTRIB
          } else if (c === '>') {
            openTag(parser)
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH
          } else if (isMatch(nameStart, c)) {
            strictFail(parser, 'No whitespace between attributes')
            parser.attribName = c
            parser.attribValue = ''
            parser.state = S.ATTRIB_NAME
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_VALUE_UNQUOTED:
          if (!isAttribEnd(c)) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_U
            } else {
              parser.attribValue += c
            }
            continue
          }
          attrib(parser)
          if (c === '>') {
            openTag(parser)
          } else {
            parser.state = S.ATTRIB
          }
          continue

        case S.CLOSE_TAG:
          if (!parser.tagName) {
            if (isWhitespace(c)) {
              continue
            } else if (notMatch(nameStart, c)) {
              if (parser.script) {
                parser.script += '</' + c
                parser.state = S.SCRIPT
              } else {
                strictFail(parser, 'Invalid tagname in closing tag.')
              }
            } else {
              parser.tagName = c
            }
          } else if (c === '>') {
            closeTag(parser)
          } else if (isMatch(nameBody, c)) {
            parser.tagName += c
          } else if (parser.script) {
            parser.script += '</' + parser.tagName
            parser.tagName = ''
            parser.state = S.SCRIPT
          } else {
            if (!isWhitespace(c)) {
              strictFail(parser, 'Invalid tagname in closing tag')
            }
            parser.state = S.CLOSE_TAG_SAW_WHITE
          }
          continue

        case S.CLOSE_TAG_SAW_WHITE:
          if (isWhitespace(c)) {
            continue
          }
          if (c === '>') {
            closeTag(parser)
          } else {
            strictFail(parser, 'Invalid characters in closing tag')
          }
          continue

        case S.TEXT_ENTITY:
        case S.ATTRIB_VALUE_ENTITY_Q:
        case S.ATTRIB_VALUE_ENTITY_U:
          var returnState
          var buffer
          switch (parser.state) {
            case S.TEXT_ENTITY:
              returnState = S.TEXT
              buffer = 'textNode'
              break

            case S.ATTRIB_VALUE_ENTITY_Q:
              returnState = S.ATTRIB_VALUE_QUOTED
              buffer = 'attribValue'
              break

            case S.ATTRIB_VALUE_ENTITY_U:
              returnState = S.ATTRIB_VALUE_UNQUOTED
              buffer = 'attribValue'
              break
          }

          if (c === ';') {
            parser[buffer] += parseEntity(parser)
            parser.entity = ''
            parser.state = returnState
          } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
            parser.entity += c
          } else {
            strictFail(parser, 'Invalid character in entity name')
            parser[buffer] += '&' + parser.entity + c
            parser.entity = ''
            parser.state = returnState
          }

          continue

        default:
          throw new Error(parser, 'Unknown state: ' + parser.state)
      }
    } // while

    if (parser.position >= parser.bufferCheckPosition) {
      checkBufferLength(parser)
    }
    return parser
  }

  /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
  /* istanbul ignore next */
  if (!String.fromCodePoint) {
    (function () {
      var stringFromCharCode = String.fromCharCode
      var floor = Math.floor
      var fromCodePoint = function () {
        var MAX_SIZE = 0x4000
        var codeUnits = []
        var highSurrogate
        var lowSurrogate
        var index = -1
        var length = arguments.length
        if (!length) {
          return ''
        }
        var result = ''
        while (++index < length) {
          var codePoint = Number(arguments[index])
          if (
            !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
            codePoint < 0 || // not a valid Unicode code point
            codePoint > 0x10FFFF || // not a valid Unicode code point
            floor(codePoint) !== codePoint // not an integer
          ) {
            throw RangeError('Invalid code point: ' + codePoint)
          }
          if (codePoint <= 0xFFFF) { // BMP code point
            codeUnits.push(codePoint)
          } else { // Astral code point; split in surrogate halves
            // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000
            highSurrogate = (codePoint >> 10) + 0xD800
            lowSurrogate = (codePoint % 0x400) + 0xDC00
            codeUnits.push(highSurrogate, lowSurrogate)
          }
          if (index + 1 === length || codeUnits.length > MAX_SIZE) {
            result += stringFromCharCode.apply(null, codeUnits)
            codeUnits.length = 0
          }
        }
        return result
      }
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(String, 'fromCodePoint', {
          value: fromCodePoint,
          configurable: true,
          writable: true
        })
      } else {
        String.fromCodePoint = fromCodePoint
      }
    }())
  }
})( false ? 0 : exports)


/***/ }),

/***/ 8229:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var assign, isArray, isEmpty, isFunction, isObject, isPlainObject,
    slice = [].slice,
    hasProp = {}.hasOwnProperty;

  assign = function() {
    var i, key, len, source, sources, target;
    target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (isFunction(Object.assign)) {
      Object.assign.apply(null, arguments);
    } else {
      for (i = 0, len = sources.length; i < len; i++) {
        source = sources[i];
        if (source != null) {
          for (key in source) {
            if (!hasProp.call(source, key)) continue;
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };

  isFunction = function(val) {
    return !!val && Object.prototype.toString.call(val) === '[object Function]';
  };

  isObject = function(val) {
    var ref;
    return !!val && ((ref = typeof val) === 'function' || ref === 'object');
  };

  isArray = function(val) {
    if (isFunction(Array.isArray)) {
      return Array.isArray(val);
    } else {
      return Object.prototype.toString.call(val) === '[object Array]';
    }
  };

  isEmpty = function(val) {
    var key;
    if (isArray(val)) {
      return !val.length;
    } else {
      for (key in val) {
        if (!hasProp.call(val, key)) continue;
        return false;
      }
      return true;
    }
  };

  isPlainObject = function(val) {
    var ctor, proto;
    return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && (typeof ctor === 'function') && (ctor instanceof ctor) && (Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object));
  };

  module.exports.assign = assign;

  module.exports.isFunction = isFunction;

  module.exports.isObject = isObject;

  module.exports.isArray = isArray;

  module.exports.isEmpty = isEmpty;

  module.exports.isPlainObject = isPlainObject;

}).call(this);


/***/ }),

/***/ 8376:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLAttribute;

  module.exports = XMLAttribute = (function() {
    function XMLAttribute(parent, name, value) {
      this.options = parent.options;
      this.stringify = parent.stringify;
      if (name == null) {
        throw new Error("Missing attribute name of element " + parent.name);
      }
      if (value == null) {
        throw new Error("Missing attribute value for attribute " + name + " of element " + parent.name);
      }
      this.name = this.stringify.attName(name);
      this.value = this.stringify.attValue(value);
    }

    XMLAttribute.prototype.clone = function() {
      return Object.create(this);
    };

    XMLAttribute.prototype.toString = function(options) {
      return this.options.writer.set(options).attribute(this);
    };

    return XMLAttribute;

  })();

}).call(this);


/***/ }),

/***/ 333:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLCData, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLCData = (function(superClass) {
    extend(XMLCData, superClass);

    function XMLCData(parent, text) {
      XMLCData.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing CDATA text");
      }
      this.text = this.stringify.cdata(text);
    }

    XMLCData.prototype.clone = function() {
      return Object.create(this);
    };

    XMLCData.prototype.toString = function(options) {
      return this.options.writer.set(options).cdata(this);
    };

    return XMLCData;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 4407:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLComment, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLComment = (function(superClass) {
    extend(XMLComment, superClass);

    function XMLComment(parent, text) {
      XMLComment.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing comment text");
      }
      this.text = this.stringify.comment(text);
    }

    XMLComment.prototype.clone = function() {
      return Object.create(this);
    };

    XMLComment.prototype.toString = function(options) {
      return this.options.writer.set(options).comment(this);
    };

    return XMLComment;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 1015:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDTDAttList, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLDTDAttList = (function(superClass) {
    extend(XMLDTDAttList, superClass);

    function XMLDTDAttList(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      XMLDTDAttList.__super__.constructor.call(this, parent);
      if (elementName == null) {
        throw new Error("Missing DTD element name");
      }
      if (attributeName == null) {
        throw new Error("Missing DTD attribute name");
      }
      if (!attributeType) {
        throw new Error("Missing DTD attribute type");
      }
      if (!defaultValueType) {
        throw new Error("Missing DTD attribute default");
      }
      if (defaultValueType.indexOf('#') !== 0) {
        defaultValueType = '#' + defaultValueType;
      }
      if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
        throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT");
      }
      if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
        throw new Error("Default value only applies to #FIXED or #DEFAULT");
      }
      this.elementName = this.stringify.eleName(elementName);
      this.attributeName = this.stringify.attName(attributeName);
      this.attributeType = this.stringify.dtdAttType(attributeType);
      this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
      this.defaultValueType = defaultValueType;
    }

    XMLDTDAttList.prototype.toString = function(options) {
      return this.options.writer.set(options).dtdAttList(this);
    };

    return XMLDTDAttList;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 2421:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDTDElement, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLDTDElement = (function(superClass) {
    extend(XMLDTDElement, superClass);

    function XMLDTDElement(parent, name, value) {
      XMLDTDElement.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing DTD element name");
      }
      if (!value) {
        value = '(#PCDATA)';
      }
      if (Array.isArray(value)) {
        value = '(' + value.join(',') + ')';
      }
      this.name = this.stringify.eleName(name);
      this.value = this.stringify.dtdElementValue(value);
    }

    XMLDTDElement.prototype.toString = function(options) {
      return this.options.writer.set(options).dtdElement(this);
    };

    return XMLDTDElement;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 53:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDTDEntity, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = __nccwpck_require__(8229).isObject;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLDTDEntity = (function(superClass) {
    extend(XMLDTDEntity, superClass);

    function XMLDTDEntity(parent, pe, name, value) {
      XMLDTDEntity.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing entity name");
      }
      if (value == null) {
        throw new Error("Missing entity value");
      }
      this.pe = !!pe;
      this.name = this.stringify.eleName(name);
      if (!isObject(value)) {
        this.value = this.stringify.dtdEntityValue(value);
      } else {
        if (!value.pubID && !value.sysID) {
          throw new Error("Public and/or system identifiers are required for an external entity");
        }
        if (value.pubID && !value.sysID) {
          throw new Error("System identifier is required for a public external entity");
        }
        if (value.pubID != null) {
          this.pubID = this.stringify.dtdPubID(value.pubID);
        }
        if (value.sysID != null) {
          this.sysID = this.stringify.dtdSysID(value.sysID);
        }
        if (value.nData != null) {
          this.nData = this.stringify.dtdNData(value.nData);
        }
        if (this.pe && this.nData) {
          throw new Error("Notation declaration is not allowed in a parameter entity");
        }
      }
    }

    XMLDTDEntity.prototype.toString = function(options) {
      return this.options.writer.set(options).dtdEntity(this);
    };

    return XMLDTDEntity;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 2837:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDTDNotation, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLDTDNotation = (function(superClass) {
    extend(XMLDTDNotation, superClass);

    function XMLDTDNotation(parent, name, value) {
      XMLDTDNotation.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing notation name");
      }
      if (!value.pubID && !value.sysID) {
        throw new Error("Public or system identifiers are required for an external entity");
      }
      this.name = this.stringify.eleName(name);
      if (value.pubID != null) {
        this.pubID = this.stringify.dtdPubID(value.pubID);
      }
      if (value.sysID != null) {
        this.sysID = this.stringify.dtdSysID(value.sysID);
      }
    }

    XMLDTDNotation.prototype.toString = function(options) {
      return this.options.writer.set(options).dtdNotation(this);
    };

    return XMLDTDNotation;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 6364:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDeclaration, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = __nccwpck_require__(8229).isObject;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLDeclaration = (function(superClass) {
    extend(XMLDeclaration, superClass);

    function XMLDeclaration(parent, version, encoding, standalone) {
      var ref;
      XMLDeclaration.__super__.constructor.call(this, parent);
      if (isObject(version)) {
        ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
      }
      if (!version) {
        version = '1.0';
      }
      this.version = this.stringify.xmlVersion(version);
      if (encoding != null) {
        this.encoding = this.stringify.xmlEncoding(encoding);
      }
      if (standalone != null) {
        this.standalone = this.stringify.xmlStandalone(standalone);
      }
    }

    XMLDeclaration.prototype.toString = function(options) {
      return this.options.writer.set(options).declaration(this);
    };

    return XMLDeclaration;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 1801:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = __nccwpck_require__(8229).isObject;

  XMLNode = __nccwpck_require__(7608);

  XMLDTDAttList = __nccwpck_require__(1015);

  XMLDTDEntity = __nccwpck_require__(53);

  XMLDTDElement = __nccwpck_require__(2421);

  XMLDTDNotation = __nccwpck_require__(2837);

  module.exports = XMLDocType = (function(superClass) {
    extend(XMLDocType, superClass);

    function XMLDocType(parent, pubID, sysID) {
      var ref, ref1;
      XMLDocType.__super__.constructor.call(this, parent);
      this.documentObject = parent;
      if (isObject(pubID)) {
        ref = pubID, pubID = ref.pubID, sysID = ref.sysID;
      }
      if (sysID == null) {
        ref1 = [pubID, sysID], sysID = ref1[0], pubID = ref1[1];
      }
      if (pubID != null) {
        this.pubID = this.stringify.dtdPubID(pubID);
      }
      if (sysID != null) {
        this.sysID = this.stringify.dtdSysID(sysID);
      }
    }

    XMLDocType.prototype.element = function(name, value) {
      var child;
      child = new XMLDTDElement(this, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      var child;
      child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.entity = function(name, value) {
      var child;
      child = new XMLDTDEntity(this, false, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.pEntity = function(name, value) {
      var child;
      child = new XMLDTDEntity(this, true, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.notation = function(name, value) {
      var child;
      child = new XMLDTDNotation(this, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.toString = function(options) {
      return this.options.writer.set(options).docType(this);
    };

    XMLDocType.prototype.ele = function(name, value) {
      return this.element(name, value);
    };

    XMLDocType.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
    };

    XMLDocType.prototype.ent = function(name, value) {
      return this.entity(name, value);
    };

    XMLDocType.prototype.pent = function(name, value) {
      return this.pEntity(name, value);
    };

    XMLDocType.prototype.not = function(name, value) {
      return this.notation(name, value);
    };

    XMLDocType.prototype.up = function() {
      return this.root() || this.documentObject;
    };

    return XMLDocType;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 3730:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isPlainObject = __nccwpck_require__(8229).isPlainObject;

  XMLNode = __nccwpck_require__(7608);

  XMLStringifier = __nccwpck_require__(8594);

  XMLStringWriter = __nccwpck_require__(5913);

  module.exports = XMLDocument = (function(superClass) {
    extend(XMLDocument, superClass);

    function XMLDocument(options) {
      XMLDocument.__super__.constructor.call(this, null);
      options || (options = {});
      if (!options.writer) {
        options.writer = new XMLStringWriter();
      }
      this.options = options;
      this.stringify = new XMLStringifier(options);
      this.isDocument = true;
    }

    XMLDocument.prototype.end = function(writer) {
      var writerOptions;
      if (!writer) {
        writer = this.options.writer;
      } else if (isPlainObject(writer)) {
        writerOptions = writer;
        writer = this.options.writer.set(writerOptions);
      }
      return writer.document(this);
    };

    XMLDocument.prototype.toString = function(options) {
      return this.options.writer.set(options).document(this);
    };

    return XMLDocument;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 7356:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, isFunction, isObject, isPlainObject, ref,
    hasProp = {}.hasOwnProperty;

  ref = __nccwpck_require__(8229), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject;

  XMLElement = __nccwpck_require__(9437);

  XMLCData = __nccwpck_require__(333);

  XMLComment = __nccwpck_require__(4407);

  XMLRaw = __nccwpck_require__(6329);

  XMLText = __nccwpck_require__(1318);

  XMLProcessingInstruction = __nccwpck_require__(6939);

  XMLDeclaration = __nccwpck_require__(6364);

  XMLDocType = __nccwpck_require__(1801);

  XMLDTDAttList = __nccwpck_require__(1015);

  XMLDTDEntity = __nccwpck_require__(53);

  XMLDTDElement = __nccwpck_require__(2421);

  XMLDTDNotation = __nccwpck_require__(2837);

  XMLAttribute = __nccwpck_require__(8376);

  XMLStringifier = __nccwpck_require__(8594);

  XMLStringWriter = __nccwpck_require__(5913);

  module.exports = XMLDocumentCB = (function() {
    function XMLDocumentCB(options, onData, onEnd) {
      var writerOptions;
      options || (options = {});
      if (!options.writer) {
        options.writer = new XMLStringWriter(options);
      } else if (isPlainObject(options.writer)) {
        writerOptions = options.writer;
        options.writer = new XMLStringWriter(writerOptions);
      }
      this.options = options;
      this.writer = options.writer;
      this.stringify = new XMLStringifier(options);
      this.onDataCallback = onData || function() {};
      this.onEndCallback = onEnd || function() {};
      this.currentNode = null;
      this.currentLevel = -1;
      this.openTags = {};
      this.documentStarted = false;
      this.documentCompleted = false;
      this.root = null;
    }

    XMLDocumentCB.prototype.node = function(name, attributes, text) {
      var ref1;
      if (name == null) {
        throw new Error("Missing node name");
      }
      if (this.root && this.currentLevel === -1) {
        throw new Error("Document can only have one root node");
      }
      this.openCurrent();
      name = name.valueOf();
      if (attributes == null) {
        attributes = {};
      }
      attributes = attributes.valueOf();
      if (!isObject(attributes)) {
        ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
      }
      this.currentNode = new XMLElement(this, name, attributes);
      this.currentNode.children = false;
      this.currentLevel++;
      this.openTags[this.currentLevel] = this.currentNode;
      if (text != null) {
        this.text(text);
      }
      return this;
    };

    XMLDocumentCB.prototype.element = function(name, attributes, text) {
      if (this.currentNode && this.currentNode instanceof XMLDocType) {
        return this.dtdElement.apply(this, arguments);
      } else {
        return this.node(name, attributes, text);
      }
    };

    XMLDocumentCB.prototype.attribute = function(name, value) {
      var attName, attValue;
      if (!this.currentNode || this.currentNode.children) {
        throw new Error("att() can only be used immediately after an ele() call in callback mode");
      }
      if (name != null) {
        name = name.valueOf();
      }
      if (isObject(name)) {
        for (attName in name) {
          if (!hasProp.call(name, attName)) continue;
          attValue = name[attName];
          this.attribute(attName, attValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        if (!this.options.skipNullAttributes || (value != null)) {
          this.currentNode.attributes[name] = new XMLAttribute(this, name, value);
        }
      }
      return this;
    };

    XMLDocumentCB.prototype.text = function(value) {
      var node;
      this.openCurrent();
      node = new XMLText(this, value);
      this.onData(this.writer.text(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.cdata = function(value) {
      var node;
      this.openCurrent();
      node = new XMLCData(this, value);
      this.onData(this.writer.cdata(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.comment = function(value) {
      var node;
      this.openCurrent();
      node = new XMLComment(this, value);
      this.onData(this.writer.comment(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.raw = function(value) {
      var node;
      this.openCurrent();
      node = new XMLRaw(this, value);
      this.onData(this.writer.raw(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.instruction = function(target, value) {
      var i, insTarget, insValue, len, node;
      this.openCurrent();
      if (target != null) {
        target = target.valueOf();
      }
      if (value != null) {
        value = value.valueOf();
      }
      if (Array.isArray(target)) {
        for (i = 0, len = target.length; i < len; i++) {
          insTarget = target[i];
          this.instruction(insTarget);
        }
      } else if (isObject(target)) {
        for (insTarget in target) {
          if (!hasProp.call(target, insTarget)) continue;
          insValue = target[insTarget];
          this.instruction(insTarget, insValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        node = new XMLProcessingInstruction(this, target, value);
        this.onData(this.writer.processingInstruction(node, this.currentLevel + 1));
      }
      return this;
    };

    XMLDocumentCB.prototype.declaration = function(version, encoding, standalone) {
      var node;
      this.openCurrent();
      if (this.documentStarted) {
        throw new Error("declaration() must be the first node");
      }
      node = new XMLDeclaration(this, version, encoding, standalone);
      this.onData(this.writer.declaration(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.doctype = function(root, pubID, sysID) {
      this.openCurrent();
      if (root == null) {
        throw new Error("Missing root node name");
      }
      if (this.root) {
        throw new Error("dtd() must come before the root node");
      }
      this.currentNode = new XMLDocType(this, pubID, sysID);
      this.currentNode.rootNodeName = root;
      this.currentNode.children = false;
      this.currentLevel++;
      this.openTags[this.currentLevel] = this.currentNode;
      return this;
    };

    XMLDocumentCB.prototype.dtdElement = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDElement(this, name, value);
      this.onData(this.writer.dtdElement(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      var node;
      this.openCurrent();
      node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
      this.onData(this.writer.dtdAttList(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.entity = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDEntity(this, false, name, value);
      this.onData(this.writer.dtdEntity(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.pEntity = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDEntity(this, true, name, value);
      this.onData(this.writer.dtdEntity(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.notation = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDNotation(this, name, value);
      this.onData(this.writer.dtdNotation(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.up = function() {
      if (this.currentLevel < 0) {
        throw new Error("The document node has no parent");
      }
      if (this.currentNode) {
        if (this.currentNode.children) {
          this.closeNode(this.currentNode);
        } else {
          this.openNode(this.currentNode);
        }
        this.currentNode = null;
      } else {
        this.closeNode(this.openTags[this.currentLevel]);
      }
      delete this.openTags[this.currentLevel];
      this.currentLevel--;
      return this;
    };

    XMLDocumentCB.prototype.end = function() {
      while (this.currentLevel >= 0) {
        this.up();
      }
      return this.onEnd();
    };

    XMLDocumentCB.prototype.openCurrent = function() {
      if (this.currentNode) {
        this.currentNode.children = true;
        return this.openNode(this.currentNode);
      }
    };

    XMLDocumentCB.prototype.openNode = function(node) {
      if (!node.isOpen) {
        if (!this.root && this.currentLevel === 0 && node instanceof XMLElement) {
          this.root = node;
        }
        this.onData(this.writer.openNode(node, this.currentLevel));
        return node.isOpen = true;
      }
    };

    XMLDocumentCB.prototype.closeNode = function(node) {
      if (!node.isClosed) {
        this.onData(this.writer.closeNode(node, this.currentLevel));
        return node.isClosed = true;
      }
    };

    XMLDocumentCB.prototype.onData = function(chunk) {
      this.documentStarted = true;
      return this.onDataCallback(chunk);
    };

    XMLDocumentCB.prototype.onEnd = function() {
      this.documentCompleted = true;
      return this.onEndCallback();
    };

    XMLDocumentCB.prototype.ele = function() {
      return this.element.apply(this, arguments);
    };

    XMLDocumentCB.prototype.nod = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLDocumentCB.prototype.txt = function(value) {
      return this.text(value);
    };

    XMLDocumentCB.prototype.dat = function(value) {
      return this.cdata(value);
    };

    XMLDocumentCB.prototype.com = function(value) {
      return this.comment(value);
    };

    XMLDocumentCB.prototype.ins = function(target, value) {
      return this.instruction(target, value);
    };

    XMLDocumentCB.prototype.dec = function(version, encoding, standalone) {
      return this.declaration(version, encoding, standalone);
    };

    XMLDocumentCB.prototype.dtd = function(root, pubID, sysID) {
      return this.doctype(root, pubID, sysID);
    };

    XMLDocumentCB.prototype.e = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLDocumentCB.prototype.n = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLDocumentCB.prototype.t = function(value) {
      return this.text(value);
    };

    XMLDocumentCB.prototype.d = function(value) {
      return this.cdata(value);
    };

    XMLDocumentCB.prototype.c = function(value) {
      return this.comment(value);
    };

    XMLDocumentCB.prototype.r = function(value) {
      return this.raw(value);
    };

    XMLDocumentCB.prototype.i = function(target, value) {
      return this.instruction(target, value);
    };

    XMLDocumentCB.prototype.att = function() {
      if (this.currentNode && this.currentNode instanceof XMLDocType) {
        return this.attList.apply(this, arguments);
      } else {
        return this.attribute.apply(this, arguments);
      }
    };

    XMLDocumentCB.prototype.a = function() {
      if (this.currentNode && this.currentNode instanceof XMLDocType) {
        return this.attList.apply(this, arguments);
      } else {
        return this.attribute.apply(this, arguments);
      }
    };

    XMLDocumentCB.prototype.ent = function(name, value) {
      return this.entity(name, value);
    };

    XMLDocumentCB.prototype.pent = function(name, value) {
      return this.pEntity(name, value);
    };

    XMLDocumentCB.prototype.not = function(name, value) {
      return this.notation(name, value);
    };

    return XMLDocumentCB;

  })();

}).call(this);


/***/ }),

/***/ 9437:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLAttribute, XMLElement, XMLNode, isFunction, isObject, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = __nccwpck_require__(8229), isObject = ref.isObject, isFunction = ref.isFunction;

  XMLNode = __nccwpck_require__(7608);

  XMLAttribute = __nccwpck_require__(8376);

  module.exports = XMLElement = (function(superClass) {
    extend(XMLElement, superClass);

    function XMLElement(parent, name, attributes) {
      XMLElement.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing element name");
      }
      this.name = this.stringify.eleName(name);
      this.attributes = {};
      if (attributes != null) {
        this.attribute(attributes);
      }
      if (parent.isDocument) {
        this.isRoot = true;
        this.documentObject = parent;
        parent.rootObject = this;
      }
    }

    XMLElement.prototype.clone = function() {
      var att, attName, clonedSelf, ref1;
      clonedSelf = Object.create(this);
      if (clonedSelf.isRoot) {
        clonedSelf.documentObject = null;
      }
      clonedSelf.attributes = {};
      ref1 = this.attributes;
      for (attName in ref1) {
        if (!hasProp.call(ref1, attName)) continue;
        att = ref1[attName];
        clonedSelf.attributes[attName] = att.clone();
      }
      clonedSelf.children = [];
      this.children.forEach(function(child) {
        var clonedChild;
        clonedChild = child.clone();
        clonedChild.parent = clonedSelf;
        return clonedSelf.children.push(clonedChild);
      });
      return clonedSelf;
    };

    XMLElement.prototype.attribute = function(name, value) {
      var attName, attValue;
      if (name != null) {
        name = name.valueOf();
      }
      if (isObject(name)) {
        for (attName in name) {
          if (!hasProp.call(name, attName)) continue;
          attValue = name[attName];
          this.attribute(attName, attValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        if (!this.options.skipNullAttributes || (value != null)) {
          this.attributes[name] = new XMLAttribute(this, name, value);
        }
      }
      return this;
    };

    XMLElement.prototype.removeAttribute = function(name) {
      var attName, i, len;
      if (name == null) {
        throw new Error("Missing attribute name");
      }
      name = name.valueOf();
      if (Array.isArray(name)) {
        for (i = 0, len = name.length; i < len; i++) {
          attName = name[i];
          delete this.attributes[attName];
        }
      } else {
        delete this.attributes[name];
      }
      return this;
    };

    XMLElement.prototype.toString = function(options) {
      return this.options.writer.set(options).element(this);
    };

    XMLElement.prototype.att = function(name, value) {
      return this.attribute(name, value);
    };

    XMLElement.prototype.a = function(name, value) {
      return this.attribute(name, value);
    };

    return XMLElement;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 7608:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLElement, XMLNode, XMLProcessingInstruction, XMLRaw, XMLText, isEmpty, isFunction, isObject, ref,
    hasProp = {}.hasOwnProperty;

  ref = __nccwpck_require__(8229), isObject = ref.isObject, isFunction = ref.isFunction, isEmpty = ref.isEmpty;

  XMLElement = null;

  XMLCData = null;

  XMLComment = null;

  XMLDeclaration = null;

  XMLDocType = null;

  XMLRaw = null;

  XMLText = null;

  XMLProcessingInstruction = null;

  module.exports = XMLNode = (function() {
    function XMLNode(parent) {
      this.parent = parent;
      if (this.parent) {
        this.options = this.parent.options;
        this.stringify = this.parent.stringify;
      }
      this.children = [];
      if (!XMLElement) {
        XMLElement = __nccwpck_require__(9437);
        XMLCData = __nccwpck_require__(333);
        XMLComment = __nccwpck_require__(4407);
        XMLDeclaration = __nccwpck_require__(6364);
        XMLDocType = __nccwpck_require__(1801);
        XMLRaw = __nccwpck_require__(6329);
        XMLText = __nccwpck_require__(1318);
        XMLProcessingInstruction = __nccwpck_require__(6939);
      }
    }

    XMLNode.prototype.element = function(name, attributes, text) {
      var childNode, item, j, k, key, lastChild, len, len1, ref1, val;
      lastChild = null;
      if (attributes == null) {
        attributes = {};
      }
      attributes = attributes.valueOf();
      if (!isObject(attributes)) {
        ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
      }
      if (name != null) {
        name = name.valueOf();
      }
      if (Array.isArray(name)) {
        for (j = 0, len = name.length; j < len; j++) {
          item = name[j];
          lastChild = this.element(item);
        }
      } else if (isFunction(name)) {
        lastChild = this.element(name.apply());
      } else if (isObject(name)) {
        for (key in name) {
          if (!hasProp.call(name, key)) continue;
          val = name[key];
          if (isFunction(val)) {
            val = val.apply();
          }
          if ((isObject(val)) && (isEmpty(val))) {
            val = null;
          }
          if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
            lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
          } else if (!this.options.separateArrayItems && Array.isArray(val)) {
            for (k = 0, len1 = val.length; k < len1; k++) {
              item = val[k];
              childNode = {};
              childNode[key] = item;
              lastChild = this.element(childNode);
            }
          } else if (isObject(val)) {
            lastChild = this.element(key);
            lastChild.element(val);
          } else {
            lastChild = this.element(key, val);
          }
        }
      } else {
        if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
          lastChild = this.text(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
          lastChild = this.cdata(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
          lastChild = this.comment(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
          lastChild = this.raw(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
          lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
        } else {
          lastChild = this.node(name, attributes, text);
        }
      }
      if (lastChild == null) {
        throw new Error("Could not create any elements with: " + name);
      }
      return lastChild;
    };

    XMLNode.prototype.insertBefore = function(name, attributes, text) {
      var child, i, removed;
      if (this.isRoot) {
        throw new Error("Cannot insert elements at root level");
      }
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.element(name, attributes, text);
      Array.prototype.push.apply(this.parent.children, removed);
      return child;
    };

    XMLNode.prototype.insertAfter = function(name, attributes, text) {
      var child, i, removed;
      if (this.isRoot) {
        throw new Error("Cannot insert elements at root level");
      }
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.element(name, attributes, text);
      Array.prototype.push.apply(this.parent.children, removed);
      return child;
    };

    XMLNode.prototype.remove = function() {
      var i, ref1;
      if (this.isRoot) {
        throw new Error("Cannot remove the root element");
      }
      i = this.parent.children.indexOf(this);
      [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref1 = [])), ref1;
      return this.parent;
    };

    XMLNode.prototype.node = function(name, attributes, text) {
      var child, ref1;
      if (name != null) {
        name = name.valueOf();
      }
      attributes || (attributes = {});
      attributes = attributes.valueOf();
      if (!isObject(attributes)) {
        ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
      }
      child = new XMLElement(this, name, attributes);
      if (text != null) {
        child.text(text);
      }
      this.children.push(child);
      return child;
    };

    XMLNode.prototype.text = function(value) {
      var child;
      child = new XMLText(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.cdata = function(value) {
      var child;
      child = new XMLCData(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.comment = function(value) {
      var child;
      child = new XMLComment(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.commentBefore = function(value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.comment(value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.commentAfter = function(value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.comment(value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.raw = function(value) {
      var child;
      child = new XMLRaw(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.instruction = function(target, value) {
      var insTarget, insValue, instruction, j, len;
      if (target != null) {
        target = target.valueOf();
      }
      if (value != null) {
        value = value.valueOf();
      }
      if (Array.isArray(target)) {
        for (j = 0, len = target.length; j < len; j++) {
          insTarget = target[j];
          this.instruction(insTarget);
        }
      } else if (isObject(target)) {
        for (insTarget in target) {
          if (!hasProp.call(target, insTarget)) continue;
          insValue = target[insTarget];
          this.instruction(insTarget, insValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        instruction = new XMLProcessingInstruction(this, target, value);
        this.children.push(instruction);
      }
      return this;
    };

    XMLNode.prototype.instructionBefore = function(target, value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.instruction(target, value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.instructionAfter = function(target, value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.instruction(target, value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.declaration = function(version, encoding, standalone) {
      var doc, xmldec;
      doc = this.document();
      xmldec = new XMLDeclaration(doc, version, encoding, standalone);
      if (doc.children[0] instanceof XMLDeclaration) {
        doc.children[0] = xmldec;
      } else {
        doc.children.unshift(xmldec);
      }
      return doc.root() || doc;
    };

    XMLNode.prototype.doctype = function(pubID, sysID) {
      var child, doc, doctype, i, j, k, len, len1, ref1, ref2;
      doc = this.document();
      doctype = new XMLDocType(doc, pubID, sysID);
      ref1 = doc.children;
      for (i = j = 0, len = ref1.length; j < len; i = ++j) {
        child = ref1[i];
        if (child instanceof XMLDocType) {
          doc.children[i] = doctype;
          return doctype;
        }
      }
      ref2 = doc.children;
      for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
        child = ref2[i];
        if (child.isRoot) {
          doc.children.splice(i, 0, doctype);
          return doctype;
        }
      }
      doc.children.push(doctype);
      return doctype;
    };

    XMLNode.prototype.up = function() {
      if (this.isRoot) {
        throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
      }
      return this.parent;
    };

    XMLNode.prototype.root = function() {
      var node;
      node = this;
      while (node) {
        if (node.isDocument) {
          return node.rootObject;
        } else if (node.isRoot) {
          return node;
        } else {
          node = node.parent;
        }
      }
    };

    XMLNode.prototype.document = function() {
      var node;
      node = this;
      while (node) {
        if (node.isDocument) {
          return node;
        } else {
          node = node.parent;
        }
      }
    };

    XMLNode.prototype.end = function(options) {
      return this.document().end(options);
    };

    XMLNode.prototype.prev = function() {
      var i;
      i = this.parent.children.indexOf(this);
      if (i < 1) {
        throw new Error("Already at the first node");
      }
      return this.parent.children[i - 1];
    };

    XMLNode.prototype.next = function() {
      var i;
      i = this.parent.children.indexOf(this);
      if (i === -1 || i === this.parent.children.length - 1) {
        throw new Error("Already at the last node");
      }
      return this.parent.children[i + 1];
    };

    XMLNode.prototype.importDocument = function(doc) {
      var clonedRoot;
      clonedRoot = doc.root().clone();
      clonedRoot.parent = this;
      clonedRoot.isRoot = false;
      this.children.push(clonedRoot);
      return this;
    };

    XMLNode.prototype.ele = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLNode.prototype.nod = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLNode.prototype.txt = function(value) {
      return this.text(value);
    };

    XMLNode.prototype.dat = function(value) {
      return this.cdata(value);
    };

    XMLNode.prototype.com = function(value) {
      return this.comment(value);
    };

    XMLNode.prototype.ins = function(target, value) {
      return this.instruction(target, value);
    };

    XMLNode.prototype.doc = function() {
      return this.document();
    };

    XMLNode.prototype.dec = function(version, encoding, standalone) {
      return this.declaration(version, encoding, standalone);
    };

    XMLNode.prototype.dtd = function(pubID, sysID) {
      return this.doctype(pubID, sysID);
    };

    XMLNode.prototype.e = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLNode.prototype.n = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLNode.prototype.t = function(value) {
      return this.text(value);
    };

    XMLNode.prototype.d = function(value) {
      return this.cdata(value);
    };

    XMLNode.prototype.c = function(value) {
      return this.comment(value);
    };

    XMLNode.prototype.r = function(value) {
      return this.raw(value);
    };

    XMLNode.prototype.i = function(target, value) {
      return this.instruction(target, value);
    };

    XMLNode.prototype.u = function() {
      return this.up();
    };

    XMLNode.prototype.importXMLBuilder = function(doc) {
      return this.importDocument(doc);
    };

    return XMLNode;

  })();

}).call(this);


/***/ }),

/***/ 6939:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLNode, XMLProcessingInstruction,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLProcessingInstruction = (function(superClass) {
    extend(XMLProcessingInstruction, superClass);

    function XMLProcessingInstruction(parent, target, value) {
      XMLProcessingInstruction.__super__.constructor.call(this, parent);
      if (target == null) {
        throw new Error("Missing instruction target");
      }
      this.target = this.stringify.insTarget(target);
      if (value) {
        this.value = this.stringify.insValue(value);
      }
    }

    XMLProcessingInstruction.prototype.clone = function() {
      return Object.create(this);
    };

    XMLProcessingInstruction.prototype.toString = function(options) {
      return this.options.writer.set(options).processingInstruction(this);
    };

    return XMLProcessingInstruction;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 6329:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLNode, XMLRaw,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLRaw = (function(superClass) {
    extend(XMLRaw, superClass);

    function XMLRaw(parent, text) {
      XMLRaw.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing raw text");
      }
      this.value = this.stringify.raw(text);
    }

    XMLRaw.prototype.clone = function() {
      return Object.create(this);
    };

    XMLRaw.prototype.toString = function(options) {
      return this.options.writer.set(options).raw(this);
    };

    return XMLRaw;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 8601:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStreamWriter, XMLText, XMLWriterBase,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLDeclaration = __nccwpck_require__(6364);

  XMLDocType = __nccwpck_require__(1801);

  XMLCData = __nccwpck_require__(333);

  XMLComment = __nccwpck_require__(4407);

  XMLElement = __nccwpck_require__(9437);

  XMLRaw = __nccwpck_require__(6329);

  XMLText = __nccwpck_require__(1318);

  XMLProcessingInstruction = __nccwpck_require__(6939);

  XMLDTDAttList = __nccwpck_require__(1015);

  XMLDTDElement = __nccwpck_require__(2421);

  XMLDTDEntity = __nccwpck_require__(53);

  XMLDTDNotation = __nccwpck_require__(2837);

  XMLWriterBase = __nccwpck_require__(5293);

  module.exports = XMLStreamWriter = (function(superClass) {
    extend(XMLStreamWriter, superClass);

    function XMLStreamWriter(stream, options) {
      XMLStreamWriter.__super__.constructor.call(this, options);
      this.stream = stream;
    }

    XMLStreamWriter.prototype.document = function(doc) {
      var child, i, j, len, len1, ref, ref1, results;
      ref = doc.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        child.isLastRootNode = false;
      }
      doc.children[doc.children.length - 1].isLastRootNode = true;
      ref1 = doc.children;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        child = ref1[j];
        switch (false) {
          case !(child instanceof XMLDeclaration):
            results.push(this.declaration(child));
            break;
          case !(child instanceof XMLDocType):
            results.push(this.docType(child));
            break;
          case !(child instanceof XMLComment):
            results.push(this.comment(child));
            break;
          case !(child instanceof XMLProcessingInstruction):
            results.push(this.processingInstruction(child));
            break;
          default:
            results.push(this.element(child));
        }
      }
      return results;
    };

    XMLStreamWriter.prototype.attribute = function(att) {
      return this.stream.write(' ' + att.name + '="' + att.value + '"');
    };

    XMLStreamWriter.prototype.cdata = function(node, level) {
      return this.stream.write(this.space(level) + '<![CDATA[' + node.text + ']]>' + this.endline(node));
    };

    XMLStreamWriter.prototype.comment = function(node, level) {
      return this.stream.write(this.space(level) + '<!-- ' + node.text + ' -->' + this.endline(node));
    };

    XMLStreamWriter.prototype.declaration = function(node, level) {
      this.stream.write(this.space(level));
      this.stream.write('<?xml version="' + node.version + '"');
      if (node.encoding != null) {
        this.stream.write(' encoding="' + node.encoding + '"');
      }
      if (node.standalone != null) {
        this.stream.write(' standalone="' + node.standalone + '"');
      }
      this.stream.write(this.spacebeforeslash + '?>');
      return this.stream.write(this.endline(node));
    };

    XMLStreamWriter.prototype.docType = function(node, level) {
      var child, i, len, ref;
      level || (level = 0);
      this.stream.write(this.space(level));
      this.stream.write('<!DOCTYPE ' + node.root().name);
      if (node.pubID && node.sysID) {
        this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
      } else if (node.sysID) {
        this.stream.write(' SYSTEM "' + node.sysID + '"');
      }
      if (node.children.length > 0) {
        this.stream.write(' [');
        this.stream.write(this.endline(node));
        ref = node.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          switch (false) {
            case !(child instanceof XMLDTDAttList):
              this.dtdAttList(child, level + 1);
              break;
            case !(child instanceof XMLDTDElement):
              this.dtdElement(child, level + 1);
              break;
            case !(child instanceof XMLDTDEntity):
              this.dtdEntity(child, level + 1);
              break;
            case !(child instanceof XMLDTDNotation):
              this.dtdNotation(child, level + 1);
              break;
            case !(child instanceof XMLCData):
              this.cdata(child, level + 1);
              break;
            case !(child instanceof XMLComment):
              this.comment(child, level + 1);
              break;
            case !(child instanceof XMLProcessingInstruction):
              this.processingInstruction(child, level + 1);
              break;
            default:
              throw new Error("Unknown DTD node type: " + child.constructor.name);
          }
        }
        this.stream.write(']');
      }
      this.stream.write(this.spacebeforeslash + '>');
      return this.stream.write(this.endline(node));
    };

    XMLStreamWriter.prototype.element = function(node, level) {
      var att, child, i, len, name, ref, ref1, space;
      level || (level = 0);
      space = this.space(level);
      this.stream.write(space + '<' + node.name);
      ref = node.attributes;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        att = ref[name];
        this.attribute(att);
      }
      if (node.children.length === 0 || node.children.every(function(e) {
        return e.value === '';
      })) {
        if (this.allowEmpty) {
          this.stream.write('></' + node.name + '>');
        } else {
          this.stream.write(this.spacebeforeslash + '/>');
        }
      } else if (this.pretty && node.children.length === 1 && (node.children[0].value != null)) {
        this.stream.write('>');
        this.stream.write(node.children[0].value);
        this.stream.write('</' + node.name + '>');
      } else {
        this.stream.write('>' + this.newline);
        ref1 = node.children;
        for (i = 0, len = ref1.length; i < len; i++) {
          child = ref1[i];
          switch (false) {
            case !(child instanceof XMLCData):
              this.cdata(child, level + 1);
              break;
            case !(child instanceof XMLComment):
              this.comment(child, level + 1);
              break;
            case !(child instanceof XMLElement):
              this.element(child, level + 1);
              break;
            case !(child instanceof XMLRaw):
              this.raw(child, level + 1);
              break;
            case !(child instanceof XMLText):
              this.text(child, level + 1);
              break;
            case !(child instanceof XMLProcessingInstruction):
              this.processingInstruction(child, level + 1);
              break;
            default:
              throw new Error("Unknown XML node type: " + child.constructor.name);
          }
        }
        this.stream.write(space + '</' + node.name + '>');
      }
      return this.stream.write(this.endline(node));
    };

    XMLStreamWriter.prototype.processingInstruction = function(node, level) {
      this.stream.write(this.space(level) + '<?' + node.target);
      if (node.value) {
        this.stream.write(' ' + node.value);
      }
      return this.stream.write(this.spacebeforeslash + '?>' + this.endline(node));
    };

    XMLStreamWriter.prototype.raw = function(node, level) {
      return this.stream.write(this.space(level) + node.value + this.endline(node));
    };

    XMLStreamWriter.prototype.text = function(node, level) {
      return this.stream.write(this.space(level) + node.value + this.endline(node));
    };

    XMLStreamWriter.prototype.dtdAttList = function(node, level) {
      this.stream.write(this.space(level) + '<!ATTLIST ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType);
      if (node.defaultValueType !== '#DEFAULT') {
        this.stream.write(' ' + node.defaultValueType);
      }
      if (node.defaultValue) {
        this.stream.write(' "' + node.defaultValue + '"');
      }
      return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
    };

    XMLStreamWriter.prototype.dtdElement = function(node, level) {
      this.stream.write(this.space(level) + '<!ELEMENT ' + node.name + ' ' + node.value);
      return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
    };

    XMLStreamWriter.prototype.dtdEntity = function(node, level) {
      this.stream.write(this.space(level) + '<!ENTITY');
      if (node.pe) {
        this.stream.write(' %');
      }
      this.stream.write(' ' + node.name);
      if (node.value) {
        this.stream.write(' "' + node.value + '"');
      } else {
        if (node.pubID && node.sysID) {
          this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
        } else if (node.sysID) {
          this.stream.write(' SYSTEM "' + node.sysID + '"');
        }
        if (node.nData) {
          this.stream.write(' NDATA ' + node.nData);
        }
      }
      return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
    };

    XMLStreamWriter.prototype.dtdNotation = function(node, level) {
      this.stream.write(this.space(level) + '<!NOTATION ' + node.name);
      if (node.pubID && node.sysID) {
        this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
      } else if (node.pubID) {
        this.stream.write(' PUBLIC "' + node.pubID + '"');
      } else if (node.sysID) {
        this.stream.write(' SYSTEM "' + node.sysID + '"');
      }
      return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
    };

    XMLStreamWriter.prototype.endline = function(node) {
      if (!node.isLastRootNode) {
        return this.newline;
      } else {
        return '';
      }
    };

    return XMLStreamWriter;

  })(XMLWriterBase);

}).call(this);


/***/ }),

/***/ 5913:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLText, XMLWriterBase,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLDeclaration = __nccwpck_require__(6364);

  XMLDocType = __nccwpck_require__(1801);

  XMLCData = __nccwpck_require__(333);

  XMLComment = __nccwpck_require__(4407);

  XMLElement = __nccwpck_require__(9437);

  XMLRaw = __nccwpck_require__(6329);

  XMLText = __nccwpck_require__(1318);

  XMLProcessingInstruction = __nccwpck_require__(6939);

  XMLDTDAttList = __nccwpck_require__(1015);

  XMLDTDElement = __nccwpck_require__(2421);

  XMLDTDEntity = __nccwpck_require__(53);

  XMLDTDNotation = __nccwpck_require__(2837);

  XMLWriterBase = __nccwpck_require__(5293);

  module.exports = XMLStringWriter = (function(superClass) {
    extend(XMLStringWriter, superClass);

    function XMLStringWriter(options) {
      XMLStringWriter.__super__.constructor.call(this, options);
    }

    XMLStringWriter.prototype.document = function(doc) {
      var child, i, len, r, ref;
      this.textispresent = false;
      r = '';
      ref = doc.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        r += (function() {
          switch (false) {
            case !(child instanceof XMLDeclaration):
              return this.declaration(child);
            case !(child instanceof XMLDocType):
              return this.docType(child);
            case !(child instanceof XMLComment):
              return this.comment(child);
            case !(child instanceof XMLProcessingInstruction):
              return this.processingInstruction(child);
            default:
              return this.element(child, 0);
          }
        }).call(this);
      }
      if (this.pretty && r.slice(-this.newline.length) === this.newline) {
        r = r.slice(0, -this.newline.length);
      }
      return r;
    };

    XMLStringWriter.prototype.attribute = function(att) {
      return ' ' + att.name + '="' + att.value + '"';
    };

    XMLStringWriter.prototype.cdata = function(node, level) {
      return this.space(level) + '<![CDATA[' + node.text + ']]>' + this.newline;
    };

    XMLStringWriter.prototype.comment = function(node, level) {
      return this.space(level) + '<!-- ' + node.text + ' -->' + this.newline;
    };

    XMLStringWriter.prototype.declaration = function(node, level) {
      var r;
      r = this.space(level);
      r += '<?xml version="' + node.version + '"';
      if (node.encoding != null) {
        r += ' encoding="' + node.encoding + '"';
      }
      if (node.standalone != null) {
        r += ' standalone="' + node.standalone + '"';
      }
      r += this.spacebeforeslash + '?>';
      r += this.newline;
      return r;
    };

    XMLStringWriter.prototype.docType = function(node, level) {
      var child, i, len, r, ref;
      level || (level = 0);
      r = this.space(level);
      r += '<!DOCTYPE ' + node.root().name;
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      if (node.children.length > 0) {
        r += ' [';
        r += this.newline;
        ref = node.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          r += (function() {
            switch (false) {
              case !(child instanceof XMLDTDAttList):
                return this.dtdAttList(child, level + 1);
              case !(child instanceof XMLDTDElement):
                return this.dtdElement(child, level + 1);
              case !(child instanceof XMLDTDEntity):
                return this.dtdEntity(child, level + 1);
              case !(child instanceof XMLDTDNotation):
                return this.dtdNotation(child, level + 1);
              case !(child instanceof XMLCData):
                return this.cdata(child, level + 1);
              case !(child instanceof XMLComment):
                return this.comment(child, level + 1);
              case !(child instanceof XMLProcessingInstruction):
                return this.processingInstruction(child, level + 1);
              default:
                throw new Error("Unknown DTD node type: " + child.constructor.name);
            }
          }).call(this);
        }
        r += ']';
      }
      r += this.spacebeforeslash + '>';
      r += this.newline;
      return r;
    };

    XMLStringWriter.prototype.element = function(node, level) {
      var att, child, i, j, len, len1, name, r, ref, ref1, ref2, space, textispresentwasset;
      level || (level = 0);
      textispresentwasset = false;
      if (this.textispresent) {
        this.newline = '';
        this.pretty = false;
      } else {
        this.newline = this.newlinedefault;
        this.pretty = this.prettydefault;
      }
      space = this.space(level);
      r = '';
      r += space + '<' + node.name;
      ref = node.attributes;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        att = ref[name];
        r += this.attribute(att);
      }
      if (node.children.length === 0 || node.children.every(function(e) {
        return e.value === '';
      })) {
        if (this.allowEmpty) {
          r += '></' + node.name + '>' + this.newline;
        } else {
          r += this.spacebeforeslash + '/>' + this.newline;
        }
      } else if (this.pretty && node.children.length === 1 && (node.children[0].value != null)) {
        r += '>';
        r += node.children[0].value;
        r += '</' + node.name + '>' + this.newline;
      } else {
        if (this.dontprettytextnodes) {
          ref1 = node.children;
          for (i = 0, len = ref1.length; i < len; i++) {
            child = ref1[i];
            if (child.value != null) {
              this.textispresent++;
              textispresentwasset = true;
              break;
            }
          }
        }
        if (this.textispresent) {
          this.newline = '';
          this.pretty = false;
          space = this.space(level);
        }
        r += '>' + this.newline;
        ref2 = node.children;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          child = ref2[j];
          r += (function() {
            switch (false) {
              case !(child instanceof XMLCData):
                return this.cdata(child, level + 1);
              case !(child instanceof XMLComment):
                return this.comment(child, level + 1);
              case !(child instanceof XMLElement):
                return this.element(child, level + 1);
              case !(child instanceof XMLRaw):
                return this.raw(child, level + 1);
              case !(child instanceof XMLText):
                return this.text(child, level + 1);
              case !(child instanceof XMLProcessingInstruction):
                return this.processingInstruction(child, level + 1);
              default:
                throw new Error("Unknown XML node type: " + child.constructor.name);
            }
          }).call(this);
        }
        if (textispresentwasset) {
          this.textispresent--;
        }
        if (!this.textispresent) {
          this.newline = this.newlinedefault;
          this.pretty = this.prettydefault;
        }
        r += space + '</' + node.name + '>' + this.newline;
      }
      return r;
    };

    XMLStringWriter.prototype.processingInstruction = function(node, level) {
      var r;
      r = this.space(level) + '<?' + node.target;
      if (node.value) {
        r += ' ' + node.value;
      }
      r += this.spacebeforeslash + '?>' + this.newline;
      return r;
    };

    XMLStringWriter.prototype.raw = function(node, level) {
      return this.space(level) + node.value + this.newline;
    };

    XMLStringWriter.prototype.text = function(node, level) {
      return this.space(level) + node.value + this.newline;
    };

    XMLStringWriter.prototype.dtdAttList = function(node, level) {
      var r;
      r = this.space(level) + '<!ATTLIST ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType;
      if (node.defaultValueType !== '#DEFAULT') {
        r += ' ' + node.defaultValueType;
      }
      if (node.defaultValue) {
        r += ' "' + node.defaultValue + '"';
      }
      r += this.spacebeforeslash + '>' + this.newline;
      return r;
    };

    XMLStringWriter.prototype.dtdElement = function(node, level) {
      return this.space(level) + '<!ELEMENT ' + node.name + ' ' + node.value + this.spacebeforeslash + '>' + this.newline;
    };

    XMLStringWriter.prototype.dtdEntity = function(node, level) {
      var r;
      r = this.space(level) + '<!ENTITY';
      if (node.pe) {
        r += ' %';
      }
      r += ' ' + node.name;
      if (node.value) {
        r += ' "' + node.value + '"';
      } else {
        if (node.pubID && node.sysID) {
          r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
        } else if (node.sysID) {
          r += ' SYSTEM "' + node.sysID + '"';
        }
        if (node.nData) {
          r += ' NDATA ' + node.nData;
        }
      }
      r += this.spacebeforeslash + '>' + this.newline;
      return r;
    };

    XMLStringWriter.prototype.dtdNotation = function(node, level) {
      var r;
      r = this.space(level) + '<!NOTATION ' + node.name;
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.pubID) {
        r += ' PUBLIC "' + node.pubID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      r += this.spacebeforeslash + '>' + this.newline;
      return r;
    };

    XMLStringWriter.prototype.openNode = function(node, level) {
      var att, name, r, ref;
      level || (level = 0);
      if (node instanceof XMLElement) {
        r = this.space(level) + '<' + node.name;
        ref = node.attributes;
        for (name in ref) {
          if (!hasProp.call(ref, name)) continue;
          att = ref[name];
          r += this.attribute(att);
        }
        r += (node.children ? '>' : '/>') + this.newline;
        return r;
      } else {
        r = this.space(level) + '<!DOCTYPE ' + node.rootNodeName;
        if (node.pubID && node.sysID) {
          r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
        } else if (node.sysID) {
          r += ' SYSTEM "' + node.sysID + '"';
        }
        r += (node.children ? ' [' : '>') + this.newline;
        return r;
      }
    };

    XMLStringWriter.prototype.closeNode = function(node, level) {
      level || (level = 0);
      switch (false) {
        case !(node instanceof XMLElement):
          return this.space(level) + '</' + node.name + '>' + this.newline;
        case !(node instanceof XMLDocType):
          return this.space(level) + ']>' + this.newline;
      }
    };

    return XMLStringWriter;

  })(XMLWriterBase);

}).call(this);


/***/ }),

/***/ 8594:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLStringifier,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    hasProp = {}.hasOwnProperty;

  module.exports = XMLStringifier = (function() {
    function XMLStringifier(options) {
      this.assertLegalChar = bind(this.assertLegalChar, this);
      var key, ref, value;
      options || (options = {});
      this.noDoubleEncoding = options.noDoubleEncoding;
      ref = options.stringify || {};
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this[key] = value;
      }
    }

    XMLStringifier.prototype.eleName = function(val) {
      val = '' + val || '';
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.eleText = function(val) {
      val = '' + val || '';
      return this.assertLegalChar(this.elEscape(val));
    };

    XMLStringifier.prototype.cdata = function(val) {
      val = '' + val || '';
      val = val.replace(']]>', ']]]]><![CDATA[>');
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.comment = function(val) {
      val = '' + val || '';
      if (val.match(/--/)) {
        throw new Error("Comment text cannot contain double-hypen: " + val);
      }
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.raw = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.attName = function(val) {
      return val = '' + val || '';
    };

    XMLStringifier.prototype.attValue = function(val) {
      val = '' + val || '';
      return this.attEscape(val);
    };

    XMLStringifier.prototype.insTarget = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.insValue = function(val) {
      val = '' + val || '';
      if (val.match(/\?>/)) {
        throw new Error("Invalid processing instruction value: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlVersion = function(val) {
      val = '' + val || '';
      if (!val.match(/1\.[0-9]+/)) {
        throw new Error("Invalid version number: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlEncoding = function(val) {
      val = '' + val || '';
      if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
        throw new Error("Invalid encoding: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlStandalone = function(val) {
      if (val) {
        return "yes";
      } else {
        return "no";
      }
    };

    XMLStringifier.prototype.dtdPubID = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdSysID = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdElementValue = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdAttType = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdAttDefault = function(val) {
      if (val != null) {
        return '' + val || '';
      } else {
        return val;
      }
    };

    XMLStringifier.prototype.dtdEntityValue = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdNData = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.convertAttKey = '@';

    XMLStringifier.prototype.convertPIKey = '?';

    XMLStringifier.prototype.convertTextKey = '#text';

    XMLStringifier.prototype.convertCDataKey = '#cdata';

    XMLStringifier.prototype.convertCommentKey = '#comment';

    XMLStringifier.prototype.convertRawKey = '#raw';

    XMLStringifier.prototype.assertLegalChar = function(str) {
      var res;
      res = str.match(/[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/);
      if (res) {
        throw new Error("Invalid character in string: " + str + " at index " + res.index);
      }
      return str;
    };

    XMLStringifier.prototype.elEscape = function(str) {
      var ampregex;
      ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
      return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
    };

    XMLStringifier.prototype.attEscape = function(str) {
      var ampregex;
      ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
      return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
    };

    return XMLStringifier;

  })();

}).call(this);


/***/ }),

/***/ 1318:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLNode, XMLText,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __nccwpck_require__(7608);

  module.exports = XMLText = (function(superClass) {
    extend(XMLText, superClass);

    function XMLText(parent, text) {
      XMLText.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing element text");
      }
      this.value = this.stringify.eleText(text);
    }

    XMLText.prototype.clone = function() {
      return Object.create(this);
    };

    XMLText.prototype.toString = function(options) {
      return this.options.writer.set(options).text(this);
    };

    return XMLText;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ 5293:
/***/ (function(module) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLWriterBase,
    hasProp = {}.hasOwnProperty;

  module.exports = XMLWriterBase = (function() {
    function XMLWriterBase(options) {
      var key, ref, ref1, ref2, ref3, ref4, ref5, ref6, value;
      options || (options = {});
      this.pretty = options.pretty || false;
      this.allowEmpty = (ref = options.allowEmpty) != null ? ref : false;
      if (this.pretty) {
        this.indent = (ref1 = options.indent) != null ? ref1 : '  ';
        this.newline = (ref2 = options.newline) != null ? ref2 : '\n';
        this.offset = (ref3 = options.offset) != null ? ref3 : 0;
        this.dontprettytextnodes = (ref4 = options.dontprettytextnodes) != null ? ref4 : 0;
      } else {
        this.indent = '';
        this.newline = '';
        this.offset = 0;
        this.dontprettytextnodes = 0;
      }
      this.spacebeforeslash = (ref5 = options.spacebeforeslash) != null ? ref5 : '';
      if (this.spacebeforeslash === true) {
        this.spacebeforeslash = ' ';
      }
      this.newlinedefault = this.newline;
      this.prettydefault = this.pretty;
      ref6 = options.writer || {};
      for (key in ref6) {
        if (!hasProp.call(ref6, key)) continue;
        value = ref6[key];
        this[key] = value;
      }
    }

    XMLWriterBase.prototype.set = function(options) {
      var key, ref, value;
      options || (options = {});
      if ("pretty" in options) {
        this.pretty = options.pretty;
      }
      if ("allowEmpty" in options) {
        this.allowEmpty = options.allowEmpty;
      }
      if (this.pretty) {
        this.indent = "indent" in options ? options.indent : '  ';
        this.newline = "newline" in options ? options.newline : '\n';
        this.offset = "offset" in options ? options.offset : 0;
        this.dontprettytextnodes = "dontprettytextnodes" in options ? options.dontprettytextnodes : 0;
      } else {
        this.indent = '';
        this.newline = '';
        this.offset = 0;
        this.dontprettytextnodes = 0;
      }
      this.spacebeforeslash = "spacebeforeslash" in options ? options.spacebeforeslash : '';
      if (this.spacebeforeslash === true) {
        this.spacebeforeslash = ' ';
      }
      this.newlinedefault = this.newline;
      this.prettydefault = this.pretty;
      ref = options.writer || {};
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this[key] = value;
      }
      return this;
    };

    XMLWriterBase.prototype.space = function(level) {
      var indent;
      if (this.pretty) {
        indent = (level || 0) + this.offset + 1;
        if (indent > 0) {
          return new Array(indent).join(this.indent);
        } else {
          return '';
        }
      } else {
        return '';
      }
    };

    return XMLWriterBase;

  })();

}).call(this);


/***/ }),

/***/ 2958:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;

  ref = __nccwpck_require__(8229), assign = ref.assign, isFunction = ref.isFunction;

  XMLDocument = __nccwpck_require__(3730);

  XMLDocumentCB = __nccwpck_require__(7356);

  XMLStringWriter = __nccwpck_require__(5913);

  XMLStreamWriter = __nccwpck_require__(8601);

  module.exports.create = function(name, xmldec, doctype, options) {
    var doc, root;
    if (name == null) {
      throw new Error("Root element needs a name");
    }
    options = assign({}, xmldec, doctype, options);
    doc = new XMLDocument(options);
    root = doc.element(name);
    if (!options.headless) {
      doc.declaration(options);
      if ((options.pubID != null) || (options.sysID != null)) {
        doc.doctype(options);
      }
    }
    return root;
  };

  module.exports.begin = function(options, onData, onEnd) {
    var ref1;
    if (isFunction(options)) {
      ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
      options = {};
    }
    if (onData) {
      return new XMLDocumentCB(options, onData, onEnd);
    } else {
      return new XMLDocument(options);
    }
  };

  module.exports.stringWriter = function(options) {
    return new XMLStringWriter(options);
  };

  module.exports.streamWriter = function(stream, options) {
    return new XMLStreamWriter(stream, options);
  };

}).call(this);


/***/ }),

/***/ 6102:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"version":"2.0","metadata":{"apiVersion":"2014-06-30","endpointPrefix":"cognito-identity","jsonVersion":"1.1","protocol":"json","serviceFullName":"Amazon Cognito Identity","serviceId":"Cognito Identity","signatureVersion":"v4","targetPrefix":"AWSCognitoIdentityService","uid":"cognito-identity-2014-06-30"},"operations":{"CreateIdentityPool":{"input":{"type":"structure","required":["IdentityPoolName","AllowUnauthenticatedIdentities"],"members":{"IdentityPoolName":{},"AllowUnauthenticatedIdentities":{"type":"boolean"},"AllowClassicFlow":{"type":"boolean"},"SupportedLoginProviders":{"shape":"S5"},"DeveloperProviderName":{},"OpenIdConnectProviderARNs":{"shape":"S9"},"CognitoIdentityProviders":{"shape":"Sb"},"SamlProviderARNs":{"shape":"Sg"},"IdentityPoolTags":{"shape":"Sh"}}},"output":{"shape":"Sk"}},"DeleteIdentities":{"input":{"type":"structure","required":["IdentityIdsToDelete"],"members":{"IdentityIdsToDelete":{"type":"list","member":{}}}},"output":{"type":"structure","members":{"UnprocessedIdentityIds":{"type":"list","member":{"type":"structure","members":{"IdentityId":{},"ErrorCode":{}}}}}}},"DeleteIdentityPool":{"input":{"type":"structure","required":["IdentityPoolId"],"members":{"IdentityPoolId":{}}}},"DescribeIdentity":{"input":{"type":"structure","required":["IdentityId"],"members":{"IdentityId":{}}},"output":{"shape":"Sv"}},"DescribeIdentityPool":{"input":{"type":"structure","required":["IdentityPoolId"],"members":{"IdentityPoolId":{}}},"output":{"shape":"Sk"}},"GetCredentialsForIdentity":{"input":{"type":"structure","required":["IdentityId"],"members":{"IdentityId":{},"Logins":{"shape":"S10"},"CustomRoleArn":{}}},"output":{"type":"structure","members":{"IdentityId":{},"Credentials":{"type":"structure","members":{"AccessKeyId":{},"SecretKey":{},"SessionToken":{},"Expiration":{"type":"timestamp"}}}}},"authtype":"none"},"GetId":{"input":{"type":"structure","required":["IdentityPoolId"],"members":{"AccountId":{},"IdentityPoolId":{},"Logins":{"shape":"S10"}}},"output":{"type":"structure","members":{"IdentityId":{}}},"authtype":"none"},"GetIdentityPoolRoles":{"input":{"type":"structure","required":["IdentityPoolId"],"members":{"IdentityPoolId":{}}},"output":{"type":"structure","members":{"IdentityPoolId":{},"Roles":{"shape":"S1c"},"RoleMappings":{"shape":"S1e"}}}},"GetOpenIdToken":{"input":{"type":"structure","required":["IdentityId"],"members":{"IdentityId":{},"Logins":{"shape":"S10"}}},"output":{"type":"structure","members":{"IdentityId":{},"Token":{}}},"authtype":"none"},"GetOpenIdTokenForDeveloperIdentity":{"input":{"type":"structure","required":["IdentityPoolId","Logins"],"members":{"IdentityPoolId":{},"IdentityId":{},"Logins":{"shape":"S10"},"PrincipalTags":{"shape":"S1s"},"TokenDuration":{"type":"long"}}},"output":{"type":"structure","members":{"IdentityId":{},"Token":{}}}},"GetPrincipalTagAttributeMap":{"input":{"type":"structure","required":["IdentityPoolId","IdentityProviderName"],"members":{"IdentityPoolId":{},"IdentityProviderName":{}}},"output":{"type":"structure","members":{"IdentityPoolId":{},"IdentityProviderName":{},"UseDefaults":{"type":"boolean"},"PrincipalTags":{"shape":"S1s"}}}},"ListIdentities":{"input":{"type":"structure","required":["IdentityPoolId","MaxResults"],"members":{"IdentityPoolId":{},"MaxResults":{"type":"integer"},"NextToken":{},"HideDisabled":{"type":"boolean"}}},"output":{"type":"structure","members":{"IdentityPoolId":{},"Identities":{"type":"list","member":{"shape":"Sv"}},"NextToken":{}}}},"ListIdentityPools":{"input":{"type":"structure","required":["MaxResults"],"members":{"MaxResults":{"type":"integer"},"NextToken":{}}},"output":{"type":"structure","members":{"IdentityPools":{"type":"list","member":{"type":"structure","members":{"IdentityPoolId":{},"IdentityPoolName":{}}}},"NextToken":{}}}},"ListTagsForResource":{"input":{"type":"structure","required":["ResourceArn"],"members":{"ResourceArn":{}}},"output":{"type":"structure","members":{"Tags":{"shape":"Sh"}}}},"LookupDeveloperIdentity":{"input":{"type":"structure","required":["IdentityPoolId"],"members":{"IdentityPoolId":{},"IdentityId":{},"DeveloperUserIdentifier":{},"MaxResults":{"type":"integer"},"NextToken":{}}},"output":{"type":"structure","members":{"IdentityId":{},"DeveloperUserIdentifierList":{"type":"list","member":{}},"NextToken":{}}}},"MergeDeveloperIdentities":{"input":{"type":"structure","required":["SourceUserIdentifier","DestinationUserIdentifier","DeveloperProviderName","IdentityPoolId"],"members":{"SourceUserIdentifier":{},"DestinationUserIdentifier":{},"DeveloperProviderName":{},"IdentityPoolId":{}}},"output":{"type":"structure","members":{"IdentityId":{}}}},"SetIdentityPoolRoles":{"input":{"type":"structure","required":["IdentityPoolId","Roles"],"members":{"IdentityPoolId":{},"Roles":{"shape":"S1c"},"RoleMappings":{"shape":"S1e"}}}},"SetPrincipalTagAttributeMap":{"input":{"type":"structure","required":["IdentityPoolId","IdentityProviderName"],"members":{"IdentityPoolId":{},"IdentityProviderName":{},"UseDefaults":{"type":"boolean"},"PrincipalTags":{"shape":"S1s"}}},"output":{"type":"structure","members":{"IdentityPoolId":{},"IdentityProviderName":{},"UseDefaults":{"type":"boolean"},"PrincipalTags":{"shape":"S1s"}}}},"TagResource":{"input":{"type":"structure","required":["ResourceArn","Tags"],"members":{"ResourceArn":{},"Tags":{"shape":"Sh"}}},"output":{"type":"structure","members":{}}},"UnlinkDeveloperIdentity":{"input":{"type":"structure","required":["IdentityId","IdentityPoolId","DeveloperProviderName","DeveloperUserIdentifier"],"members":{"IdentityId":{},"IdentityPoolId":{},"DeveloperProviderName":{},"DeveloperUserIdentifier":{}}}},"UnlinkIdentity":{"input":{"type":"structure","required":["IdentityId","Logins","LoginsToRemove"],"members":{"IdentityId":{},"Logins":{"shape":"S10"},"LoginsToRemove":{"shape":"Sw"}}},"authtype":"none"},"UntagResource":{"input":{"type":"structure","required":["ResourceArn","TagKeys"],"members":{"ResourceArn":{},"TagKeys":{"type":"list","member":{}}}},"output":{"type":"structure","members":{}}},"UpdateIdentityPool":{"input":{"shape":"Sk"},"output":{"shape":"Sk"}}},"shapes":{"S5":{"type":"map","key":{},"value":{}},"S9":{"type":"list","member":{}},"Sb":{"type":"list","member":{"type":"structure","members":{"ProviderName":{},"ClientId":{},"ServerSideTokenCheck":{"type":"boolean"}}}},"Sg":{"type":"list","member":{}},"Sh":{"type":"map","key":{},"value":{}},"Sk":{"type":"structure","required":["IdentityPoolId","IdentityPoolName","AllowUnauthenticatedIdentities"],"members":{"IdentityPoolId":{},"IdentityPoolName":{},"AllowUnauthenticatedIdentities":{"type":"boolean"},"AllowClassicFlow":{"type":"boolean"},"SupportedLoginProviders":{"shape":"S5"},"DeveloperProviderName":{},"OpenIdConnectProviderARNs":{"shape":"S9"},"CognitoIdentityProviders":{"shape":"Sb"},"SamlProviderARNs":{"shape":"Sg"},"IdentityPoolTags":{"shape":"Sh"}}},"Sv":{"type":"structure","members":{"IdentityId":{},"Logins":{"shape":"Sw"},"CreationDate":{"type":"timestamp"},"LastModifiedDate":{"type":"timestamp"}}},"Sw":{"type":"list","member":{}},"S10":{"type":"map","key":{},"value":{}},"S1c":{"type":"map","key":{},"value":{}},"S1e":{"type":"map","key":{},"value":{"type":"structure","required":["Type"],"members":{"Type":{},"AmbiguousRoleResolution":{},"RulesConfiguration":{"type":"structure","required":["Rules"],"members":{"Rules":{"type":"list","member":{"type":"structure","required":["Claim","MatchType","Value","RoleARN"],"members":{"Claim":{},"MatchType":{},"Value":{},"RoleARN":{}}}}}}}}},"S1s":{"type":"map","key":{},"value":{}}}}');

/***/ }),

/***/ 796:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"o":{"ListIdentityPools":{"input_token":"NextToken","limit_key":"MaxResults","output_token":"NextToken","result_key":"IdentityPools"}}}');

/***/ }),

/***/ 8155:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"version":"2.0","metadata":{"apiVersion":"2014-11-13","endpointPrefix":"ecs","jsonVersion":"1.1","protocol":"json","serviceAbbreviation":"Amazon ECS","serviceFullName":"Amazon EC2 Container Service","serviceId":"ECS","signatureVersion":"v4","targetPrefix":"AmazonEC2ContainerServiceV20141113","uid":"ecs-2014-11-13"},"operations":{"CreateCapacityProvider":{"input":{"type":"structure","required":["name","autoScalingGroupProvider"],"members":{"name":{},"autoScalingGroupProvider":{"shape":"S3"},"tags":{"shape":"Sa"}}},"output":{"type":"structure","members":{"capacityProvider":{"shape":"Sf"}}}},"CreateCluster":{"input":{"type":"structure","members":{"clusterName":{},"tags":{"shape":"Sa"},"settings":{"shape":"Sj"},"configuration":{"shape":"Sm"},"capacityProviders":{"shape":"Sr"},"defaultCapacityProviderStrategy":{"shape":"Ss"}}},"output":{"type":"structure","members":{"cluster":{"shape":"Sx"}}}},"CreateService":{"input":{"type":"structure","required":["serviceName"],"members":{"cluster":{},"serviceName":{},"taskDefinition":{},"loadBalancers":{"shape":"S15"},"serviceRegistries":{"shape":"S18"},"desiredCount":{"type":"integer"},"clientToken":{},"launchType":{},"capacityProviderStrategy":{"shape":"Ss"},"platformVersion":{},"role":{},"deploymentConfiguration":{"shape":"S1b"},"placementConstraints":{"shape":"S1d"},"placementStrategy":{"shape":"S1g"},"networkConfiguration":{"shape":"S1j"},"healthCheckGracePeriodSeconds":{"type":"integer"},"schedulingStrategy":{},"deploymentController":{"shape":"S1n"},"tags":{"shape":"Sa"},"enableECSManagedTags":{"type":"boolean"},"propagateTags":{},"enableExecuteCommand":{"type":"boolean"}}},"output":{"type":"structure","members":{"service":{"shape":"S1r"}}}},"CreateTaskSet":{"input":{"type":"structure","required":["service","cluster","taskDefinition"],"members":{"service":{},"cluster":{},"externalId":{},"taskDefinition":{},"networkConfiguration":{"shape":"S1j"},"loadBalancers":{"shape":"S15"},"serviceRegistries":{"shape":"S18"},"launchType":{},"capacityProviderStrategy":{"shape":"Ss"},"platformVersion":{},"scale":{"shape":"S1v"},"clientToken":{},"tags":{"shape":"Sa"}}},"output":{"type":"structure","members":{"taskSet":{"shape":"S1t"}}}},"DeleteAccountSetting":{"input":{"type":"structure","required":["name"],"members":{"name":{},"principalArn":{}}},"output":{"type":"structure","members":{"setting":{"shape":"S29"}}}},"DeleteAttributes":{"input":{"type":"structure","required":["attributes"],"members":{"cluster":{},"attributes":{"shape":"S2b"}}},"output":{"type":"structure","members":{"attributes":{"shape":"S2b"}}}},"DeleteCapacityProvider":{"input":{"type":"structure","required":["capacityProvider"],"members":{"capacityProvider":{}}},"output":{"type":"structure","members":{"capacityProvider":{"shape":"Sf"}}}},"DeleteCluster":{"input":{"type":"structure","required":["cluster"],"members":{"cluster":{}}},"output":{"type":"structure","members":{"cluster":{"shape":"Sx"}}}},"DeleteService":{"input":{"type":"structure","required":["service"],"members":{"cluster":{},"service":{},"force":{"type":"boolean"}}},"output":{"type":"structure","members":{"service":{"shape":"S1r"}}}},"DeleteTaskSet":{"input":{"type":"structure","required":["cluster","service","taskSet"],"members":{"cluster":{},"service":{},"taskSet":{},"force":{"type":"boolean"}}},"output":{"type":"structure","members":{"taskSet":{"shape":"S1t"}}}},"DeregisterContainerInstance":{"input":{"type":"structure","required":["containerInstance"],"members":{"cluster":{},"containerInstance":{},"force":{"type":"boolean"}}},"output":{"type":"structure","members":{"containerInstance":{"shape":"S2q"}}}},"DeregisterTaskDefinition":{"input":{"type":"structure","required":["taskDefinition"],"members":{"taskDefinition":{}}},"output":{"type":"structure","members":{"taskDefinition":{"shape":"S2y"}}}},"DescribeCapacityProviders":{"input":{"type":"structure","members":{"capacityProviders":{"shape":"Sr"},"include":{"type":"list","member":{}},"maxResults":{"type":"integer"},"nextToken":{}}},"output":{"type":"structure","members":{"capacityProviders":{"type":"list","member":{"shape":"Sf"}},"failures":{"shape":"S54"},"nextToken":{}}}},"DescribeClusters":{"input":{"type":"structure","members":{"clusters":{"shape":"Sr"},"include":{"type":"list","member":{}}}},"output":{"type":"structure","members":{"clusters":{"type":"list","member":{"shape":"Sx"}},"failures":{"shape":"S54"}}}},"DescribeContainerInstances":{"input":{"type":"structure","required":["containerInstances"],"members":{"cluster":{},"containerInstances":{"shape":"Sr"},"include":{"type":"list","member":{}}}},"output":{"type":"structure","members":{"containerInstances":{"shape":"S5f"},"failures":{"shape":"S54"}}}},"DescribeServices":{"input":{"type":"structure","required":["services"],"members":{"cluster":{},"services":{"shape":"Sr"},"include":{"type":"list","member":{}}}},"output":{"type":"structure","members":{"services":{"type":"list","member":{"shape":"S1r"}},"failures":{"shape":"S54"}}}},"DescribeTaskDefinition":{"input":{"type":"structure","required":["taskDefinition"],"members":{"taskDefinition":{},"include":{"type":"list","member":{}}}},"output":{"type":"structure","members":{"taskDefinition":{"shape":"S2y"},"tags":{"shape":"Sa"}}}},"DescribeTaskSets":{"input":{"type":"structure","required":["cluster","service"],"members":{"cluster":{},"service":{},"taskSets":{"shape":"Sr"},"include":{"type":"list","member":{}}}},"output":{"type":"structure","members":{"taskSets":{"shape":"S1s"},"failures":{"shape":"S54"}}}},"DescribeTasks":{"input":{"type":"structure","required":["tasks"],"members":{"cluster":{},"tasks":{"shape":"Sr"},"include":{"type":"list","member":{}}}},"output":{"type":"structure","members":{"tasks":{"shape":"S5x"},"failures":{"shape":"S54"}}}},"DiscoverPollEndpoint":{"input":{"type":"structure","members":{"containerInstance":{},"cluster":{}}},"output":{"type":"structure","members":{"endpoint":{},"telemetryEndpoint":{}}}},"ExecuteCommand":{"input":{"type":"structure","required":["command","interactive","task"],"members":{"cluster":{},"container":{},"command":{},"interactive":{"type":"boolean"},"task":{}}},"output":{"type":"structure","members":{"clusterArn":{},"containerArn":{},"containerName":{},"interactive":{"type":"boolean"},"session":{"type":"structure","members":{"sessionId":{},"streamUrl":{},"tokenValue":{"type":"string","sensitive":true}}},"taskArn":{}}}},"ListAccountSettings":{"input":{"type":"structure","members":{"name":{},"value":{},"principalArn":{},"effectiveSettings":{"type":"boolean"},"nextToken":{},"maxResults":{"type":"integer"}}},"output":{"type":"structure","members":{"settings":{"type":"list","member":{"shape":"S29"}},"nextToken":{}}}},"ListAttributes":{"input":{"type":"structure","required":["targetType"],"members":{"cluster":{},"targetType":{},"attributeName":{},"attributeValue":{},"nextToken":{},"maxResults":{"type":"integer"}}},"output":{"type":"structure","members":{"attributes":{"shape":"S2b"},"nextToken":{}}}},"ListClusters":{"input":{"type":"structure","members":{"nextToken":{},"maxResults":{"type":"integer"}}},"output":{"type":"structure","members":{"clusterArns":{"shape":"Sr"},"nextToken":{}}}},"ListContainerInstances":{"input":{"type":"structure","members":{"cluster":{},"filter":{},"nextToken":{},"maxResults":{"type":"integer"},"status":{}}},"output":{"type":"structure","members":{"containerInstanceArns":{"shape":"Sr"},"nextToken":{}}}},"ListServices":{"input":{"type":"structure","members":{"cluster":{},"nextToken":{},"maxResults":{"type":"integer"},"launchType":{},"schedulingStrategy":{}}},"output":{"type":"structure","members":{"serviceArns":{"shape":"Sr"},"nextToken":{}}}},"ListTagsForResource":{"input":{"type":"structure","required":["resourceArn"],"members":{"resourceArn":{}}},"output":{"type":"structure","members":{"tags":{"shape":"Sa"}}}},"ListTaskDefinitionFamilies":{"input":{"type":"structure","members":{"familyPrefix":{},"status":{},"nextToken":{},"maxResults":{"type":"integer"}}},"output":{"type":"structure","members":{"families":{"shape":"Sr"},"nextToken":{}}}},"ListTaskDefinitions":{"input":{"type":"structure","members":{"familyPrefix":{},"status":{},"sort":{},"nextToken":{},"maxResults":{"type":"integer"}}},"output":{"type":"structure","members":{"taskDefinitionArns":{"shape":"Sr"},"nextToken":{}}}},"ListTasks":{"input":{"type":"structure","members":{"cluster":{},"containerInstance":{},"family":{},"nextToken":{},"maxResults":{"type":"integer"},"startedBy":{},"serviceName":{},"desiredStatus":{},"launchType":{}}},"output":{"type":"structure","members":{"taskArns":{"shape":"Sr"},"nextToken":{}}}},"PutAccountSetting":{"input":{"type":"structure","required":["name","value"],"members":{"name":{},"value":{},"principalArn":{}}},"output":{"type":"structure","members":{"setting":{"shape":"S29"}}}},"PutAccountSettingDefault":{"input":{"type":"structure","required":["name","value"],"members":{"name":{},"value":{}}},"output":{"type":"structure","members":{"setting":{"shape":"S29"}}}},"PutAttributes":{"input":{"type":"structure","required":["attributes"],"members":{"cluster":{},"attributes":{"shape":"S2b"}}},"output":{"type":"structure","members":{"attributes":{"shape":"S2b"}}}},"PutClusterCapacityProviders":{"input":{"type":"structure","required":["cluster","capacityProviders","defaultCapacityProviderStrategy"],"members":{"cluster":{},"capacityProviders":{"shape":"Sr"},"defaultCapacityProviderStrategy":{"shape":"Ss"}}},"output":{"type":"structure","members":{"cluster":{"shape":"Sx"}}}},"RegisterContainerInstance":{"input":{"type":"structure","members":{"cluster":{},"instanceIdentityDocument":{},"instanceIdentityDocumentSignature":{},"totalResources":{"shape":"S2t"},"versionInfo":{"shape":"S2s"},"containerInstanceArn":{},"attributes":{"shape":"S2b"},"platformDevices":{"type":"list","member":{"type":"structure","required":["id","type"],"members":{"id":{},"type":{}}}},"tags":{"shape":"Sa"}}},"output":{"type":"structure","members":{"containerInstance":{"shape":"S2q"}}}},"RegisterTaskDefinition":{"input":{"type":"structure","required":["family","containerDefinitions"],"members":{"family":{},"taskRoleArn":{},"executionRoleArn":{},"networkMode":{},"containerDefinitions":{"shape":"S2z"},"volumes":{"shape":"S49"},"placementConstraints":{"shape":"S4n"},"requiresCompatibilities":{"shape":"S4q"},"cpu":{},"memory":{},"tags":{"shape":"Sa"},"pidMode":{},"ipcMode":{},"proxyConfiguration":{"shape":"S4w"},"inferenceAccelerators":{"shape":"S4s"}}},"output":{"type":"structure","members":{"taskDefinition":{"shape":"S2y"},"tags":{"shape":"Sa"}}}},"RunTask":{"input":{"type":"structure","required":["taskDefinition"],"members":{"capacityProviderStrategy":{"shape":"Ss"},"cluster":{},"count":{"type":"integer"},"enableECSManagedTags":{"type":"boolean"},"enableExecuteCommand":{"type":"boolean"},"group":{},"launchType":{},"networkConfiguration":{"shape":"S1j"},"overrides":{"shape":"S6b"},"placementConstraints":{"shape":"S1d"},"placementStrategy":{"shape":"S1g"},"platformVersion":{},"propagateTags":{},"referenceId":{},"startedBy":{},"tags":{"shape":"Sa"},"taskDefinition":{}}},"output":{"type":"structure","members":{"tasks":{"shape":"S5x"},"failures":{"shape":"S54"}}}},"StartTask":{"input":{"type":"structure","required":["containerInstances","taskDefinition"],"members":{"cluster":{},"containerInstances":{"shape":"Sr"},"enableECSManagedTags":{"type":"boolean"},"enableExecuteCommand":{"type":"boolean"},"group":{},"networkConfiguration":{"shape":"S1j"},"overrides":{"shape":"S6b"},"propagateTags":{},"referenceId":{},"startedBy":{},"tags":{"shape":"Sa"},"taskDefinition":{}}},"output":{"type":"structure","members":{"tasks":{"shape":"S5x"},"failures":{"shape":"S54"}}}},"StopTask":{"input":{"type":"structure","required":["task"],"members":{"cluster":{},"task":{},"reason":{}}},"output":{"type":"structure","members":{"task":{"shape":"S5y"}}}},"SubmitAttachmentStateChanges":{"input":{"type":"structure","required":["attachments"],"members":{"cluster":{},"attachments":{"shape":"S7w"}}},"output":{"type":"structure","members":{"acknowledgment":{}}}},"SubmitContainerStateChange":{"input":{"type":"structure","members":{"cluster":{},"task":{},"containerName":{},"runtimeId":{},"status":{},"exitCode":{"type":"integer"},"reason":{},"networkBindings":{"shape":"S62"}}},"output":{"type":"structure","members":{"acknowledgment":{}}}},"SubmitTaskStateChange":{"input":{"type":"structure","members":{"cluster":{},"task":{},"status":{},"reason":{},"containers":{"type":"list","member":{"type":"structure","members":{"containerName":{},"imageDigest":{},"runtimeId":{},"exitCode":{"type":"integer"},"networkBindings":{"shape":"S62"},"reason":{},"status":{}}}},"attachments":{"shape":"S7w"},"managedAgents":{"type":"list","member":{"type":"structure","required":["containerName","managedAgentName","status"],"members":{"containerName":{},"managedAgentName":{},"status":{},"reason":{}}}},"pullStartedAt":{"type":"timestamp"},"pullStoppedAt":{"type":"timestamp"},"executionStoppedAt":{"type":"timestamp"}}},"output":{"type":"structure","members":{"acknowledgment":{}}}},"TagResource":{"input":{"type":"structure","required":["resourceArn","tags"],"members":{"resourceArn":{},"tags":{"shape":"Sa"}}},"output":{"type":"structure","members":{}}},"UntagResource":{"input":{"type":"structure","required":["resourceArn","tagKeys"],"members":{"resourceArn":{},"tagKeys":{"type":"list","member":{}}}},"output":{"type":"structure","members":{}}},"UpdateCapacityProvider":{"input":{"type":"structure","required":["name","autoScalingGroupProvider"],"members":{"name":{},"autoScalingGroupProvider":{"type":"structure","members":{"managedScaling":{"shape":"S4"},"managedTerminationProtection":{}}}}},"output":{"type":"structure","members":{"capacityProvider":{"shape":"Sf"}}}},"UpdateCluster":{"input":{"type":"structure","required":["cluster"],"members":{"cluster":{},"settings":{"shape":"Sj"},"configuration":{"shape":"Sm"}}},"output":{"type":"structure","members":{"cluster":{"shape":"Sx"}}}},"UpdateClusterSettings":{"input":{"type":"structure","required":["cluster","settings"],"members":{"cluster":{},"settings":{"shape":"Sj"}}},"output":{"type":"structure","members":{"cluster":{"shape":"Sx"}}}},"UpdateContainerAgent":{"input":{"type":"structure","required":["containerInstance"],"members":{"cluster":{},"containerInstance":{}}},"output":{"type":"structure","members":{"containerInstance":{"shape":"S2q"}}}},"UpdateContainerInstancesState":{"input":{"type":"structure","required":["containerInstances","status"],"members":{"cluster":{},"containerInstances":{"shape":"Sr"},"status":{}}},"output":{"type":"structure","members":{"containerInstances":{"shape":"S5f"},"failures":{"shape":"S54"}}}},"UpdateService":{"input":{"type":"structure","required":["service"],"members":{"cluster":{},"service":{},"desiredCount":{"type":"integer"},"taskDefinition":{},"capacityProviderStrategy":{"shape":"Ss"},"deploymentConfiguration":{"shape":"S1b"},"networkConfiguration":{"shape":"S1j"},"placementConstraints":{"shape":"S1d"},"placementStrategy":{"shape":"S1g"},"platformVersion":{},"forceNewDeployment":{"type":"boolean"},"healthCheckGracePeriodSeconds":{"type":"integer"},"enableExecuteCommand":{"type":"boolean"}}},"output":{"type":"structure","members":{"service":{"shape":"S1r"}}}},"UpdateServicePrimaryTaskSet":{"input":{"type":"structure","required":["cluster","service","primaryTaskSet"],"members":{"cluster":{},"service":{},"primaryTaskSet":{}}},"output":{"type":"structure","members":{"taskSet":{"shape":"S1t"}}}},"UpdateTaskSet":{"input":{"type":"structure","required":["cluster","service","taskSet","scale"],"members":{"cluster":{},"service":{},"taskSet":{},"scale":{"shape":"S1v"}}},"output":{"type":"structure","members":{"taskSet":{"shape":"S1t"}}}}},"shapes":{"S3":{"type":"structure","required":["autoScalingGroupArn"],"members":{"autoScalingGroupArn":{},"managedScaling":{"shape":"S4"},"managedTerminationProtection":{}}},"S4":{"type":"structure","members":{"status":{},"targetCapacity":{"type":"integer"},"minimumScalingStepSize":{"type":"integer"},"maximumScalingStepSize":{"type":"integer"},"instanceWarmupPeriod":{"type":"integer"}}},"Sa":{"type":"list","member":{"type":"structure","members":{"key":{},"value":{}}}},"Sf":{"type":"structure","members":{"capacityProviderArn":{},"name":{},"status":{},"autoScalingGroupProvider":{"shape":"S3"},"updateStatus":{},"updateStatusReason":{},"tags":{"shape":"Sa"}}},"Sj":{"type":"list","member":{"type":"structure","members":{"name":{},"value":{}}}},"Sm":{"type":"structure","members":{"executeCommandConfiguration":{"type":"structure","members":{"kmsKeyId":{},"logging":{},"logConfiguration":{"type":"structure","members":{"cloudWatchLogGroupName":{},"cloudWatchEncryptionEnabled":{"type":"boolean"},"s3BucketName":{},"s3EncryptionEnabled":{"type":"boolean"},"s3KeyPrefix":{}}}}}}},"Sr":{"type":"list","member":{}},"Ss":{"type":"list","member":{"type":"structure","required":["capacityProvider"],"members":{"capacityProvider":{},"weight":{"type":"integer"},"base":{"type":"integer"}}}},"Sx":{"type":"structure","members":{"clusterArn":{},"clusterName":{},"configuration":{"shape":"Sm"},"status":{},"registeredContainerInstancesCount":{"type":"integer"},"runningTasksCount":{"type":"integer"},"pendingTasksCount":{"type":"integer"},"activeServicesCount":{"type":"integer"},"statistics":{"type":"list","member":{"shape":"S10"}},"tags":{"shape":"Sa"},"settings":{"shape":"Sj"},"capacityProviders":{"shape":"Sr"},"defaultCapacityProviderStrategy":{"shape":"Ss"},"attachments":{"shape":"S11"},"attachmentsStatus":{}}},"S10":{"type":"structure","members":{"name":{},"value":{}}},"S11":{"type":"list","member":{"type":"structure","members":{"id":{},"type":{},"status":{},"details":{"type":"list","member":{"shape":"S10"}}}}},"S15":{"type":"list","member":{"type":"structure","members":{"targetGroupArn":{},"loadBalancerName":{},"containerName":{},"containerPort":{"type":"integer"}}}},"S18":{"type":"list","member":{"type":"structure","members":{"registryArn":{},"port":{"type":"integer"},"containerName":{},"containerPort":{"type":"integer"}}}},"S1b":{"type":"structure","members":{"deploymentCircuitBreaker":{"type":"structure","required":["enable","rollback"],"members":{"enable":{"type":"boolean"},"rollback":{"type":"boolean"}}},"maximumPercent":{"type":"integer"},"minimumHealthyPercent":{"type":"integer"}}},"S1d":{"type":"list","member":{"type":"structure","members":{"type":{},"expression":{}}}},"S1g":{"type":"list","member":{"type":"structure","members":{"type":{},"field":{}}}},"S1j":{"type":"structure","members":{"awsvpcConfiguration":{"type":"structure","required":["subnets"],"members":{"subnets":{"shape":"Sr"},"securityGroups":{"shape":"Sr"},"assignPublicIp":{}}}}},"S1n":{"type":"structure","required":["type"],"members":{"type":{}}},"S1r":{"type":"structure","members":{"serviceArn":{},"serviceName":{},"clusterArn":{},"loadBalancers":{"shape":"S15"},"serviceRegistries":{"shape":"S18"},"status":{},"desiredCount":{"type":"integer"},"runningCount":{"type":"integer"},"pendingCount":{"type":"integer"},"launchType":{},"capacityProviderStrategy":{"shape":"Ss"},"platformVersion":{},"taskDefinition":{},"deploymentConfiguration":{"shape":"S1b"},"taskSets":{"shape":"S1s"},"deployments":{"type":"list","member":{"type":"structure","members":{"id":{},"status":{},"taskDefinition":{},"desiredCount":{"type":"integer"},"pendingCount":{"type":"integer"},"runningCount":{"type":"integer"},"failedTasks":{"type":"integer"},"createdAt":{"type":"timestamp"},"updatedAt":{"type":"timestamp"},"capacityProviderStrategy":{"shape":"Ss"},"launchType":{},"platformVersion":{},"networkConfiguration":{"shape":"S1j"},"rolloutState":{},"rolloutStateReason":{}}}},"roleArn":{},"events":{"type":"list","member":{"type":"structure","members":{"id":{},"createdAt":{"type":"timestamp"},"message":{}}}},"createdAt":{"type":"timestamp"},"placementConstraints":{"shape":"S1d"},"placementStrategy":{"shape":"S1g"},"networkConfiguration":{"shape":"S1j"},"healthCheckGracePeriodSeconds":{"type":"integer"},"schedulingStrategy":{},"deploymentController":{"shape":"S1n"},"tags":{"shape":"Sa"},"createdBy":{},"enableECSManagedTags":{"type":"boolean"},"propagateTags":{},"enableExecuteCommand":{"type":"boolean"}}},"S1s":{"type":"list","member":{"shape":"S1t"}},"S1t":{"type":"structure","members":{"id":{},"taskSetArn":{},"serviceArn":{},"clusterArn":{},"startedBy":{},"externalId":{},"status":{},"taskDefinition":{},"computedDesiredCount":{"type":"integer"},"pendingCount":{"type":"integer"},"runningCount":{"type":"integer"},"createdAt":{"type":"timestamp"},"updatedAt":{"type":"timestamp"},"launchType":{},"capacityProviderStrategy":{"shape":"Ss"},"platformVersion":{},"networkConfiguration":{"shape":"S1j"},"loadBalancers":{"shape":"S15"},"serviceRegistries":{"shape":"S18"},"scale":{"shape":"S1v"},"stabilityStatus":{},"stabilityStatusAt":{"type":"timestamp"},"tags":{"shape":"Sa"}}},"S1v":{"type":"structure","members":{"value":{"type":"double"},"unit":{}}},"S29":{"type":"structure","members":{"name":{},"value":{},"principalArn":{}}},"S2b":{"type":"list","member":{"shape":"S2c"}},"S2c":{"type":"structure","required":["name"],"members":{"name":{},"value":{},"targetType":{},"targetId":{}}},"S2q":{"type":"structure","members":{"containerInstanceArn":{},"ec2InstanceId":{},"capacityProviderName":{},"version":{"type":"long"},"versionInfo":{"shape":"S2s"},"remainingResources":{"shape":"S2t"},"registeredResources":{"shape":"S2t"},"status":{},"statusReason":{},"agentConnected":{"type":"boolean"},"runningTasksCount":{"type":"integer"},"pendingTasksCount":{"type":"integer"},"agentUpdateStatus":{},"attributes":{"shape":"S2b"},"registeredAt":{"type":"timestamp"},"attachments":{"shape":"S11"},"tags":{"shape":"Sa"}}},"S2s":{"type":"structure","members":{"agentVersion":{},"agentHash":{},"dockerVersion":{}}},"S2t":{"type":"list","member":{"type":"structure","members":{"name":{},"type":{},"doubleValue":{"type":"double"},"longValue":{"type":"long"},"integerValue":{"type":"integer"},"stringSetValue":{"shape":"Sr"}}}},"S2y":{"type":"structure","members":{"taskDefinitionArn":{},"containerDefinitions":{"shape":"S2z"},"family":{},"taskRoleArn":{},"executionRoleArn":{},"networkMode":{},"revision":{"type":"integer"},"volumes":{"shape":"S49"},"status":{},"requiresAttributes":{"type":"list","member":{"shape":"S2c"}},"placementConstraints":{"shape":"S4n"},"compatibilities":{"shape":"S4q"},"requiresCompatibilities":{"shape":"S4q"},"cpu":{},"memory":{},"inferenceAccelerators":{"shape":"S4s"},"pidMode":{},"ipcMode":{},"proxyConfiguration":{"shape":"S4w"},"registeredAt":{"type":"timestamp"},"deregisteredAt":{"type":"timestamp"},"registeredBy":{}}},"S2z":{"type":"list","member":{"type":"structure","members":{"name":{},"image":{},"repositoryCredentials":{"type":"structure","required":["credentialsParameter"],"members":{"credentialsParameter":{}}},"cpu":{"type":"integer"},"memory":{"type":"integer"},"memoryReservation":{"type":"integer"},"links":{"shape":"Sr"},"portMappings":{"type":"list","member":{"type":"structure","members":{"containerPort":{"type":"integer"},"hostPort":{"type":"integer"},"protocol":{}}}},"essential":{"type":"boolean"},"entryPoint":{"shape":"Sr"},"command":{"shape":"Sr"},"environment":{"shape":"S35"},"environmentFiles":{"shape":"S36"},"mountPoints":{"type":"list","member":{"type":"structure","members":{"sourceVolume":{},"containerPath":{},"readOnly":{"type":"boolean"}}}},"volumesFrom":{"type":"list","member":{"type":"structure","members":{"sourceContainer":{},"readOnly":{"type":"boolean"}}}},"linuxParameters":{"type":"structure","members":{"capabilities":{"type":"structure","members":{"add":{"shape":"Sr"},"drop":{"shape":"Sr"}}},"devices":{"type":"list","member":{"type":"structure","required":["hostPath"],"members":{"hostPath":{},"containerPath":{},"permissions":{"type":"list","member":{}}}}},"initProcessEnabled":{"type":"boolean"},"sharedMemorySize":{"type":"integer"},"tmpfs":{"type":"list","member":{"type":"structure","required":["containerPath","size"],"members":{"containerPath":{},"size":{"type":"integer"},"mountOptions":{"shape":"Sr"}}}},"maxSwap":{"type":"integer"},"swappiness":{"type":"integer"}}},"secrets":{"shape":"S3l"},"dependsOn":{"type":"list","member":{"type":"structure","required":["containerName","condition"],"members":{"containerName":{},"condition":{}}}},"startTimeout":{"type":"integer"},"stopTimeout":{"type":"integer"},"hostname":{},"user":{},"workingDirectory":{},"disableNetworking":{"type":"boolean"},"privileged":{"type":"boolean"},"readonlyRootFilesystem":{"type":"boolean"},"dnsServers":{"shape":"Sr"},"dnsSearchDomains":{"shape":"Sr"},"extraHosts":{"type":"list","member":{"type":"structure","required":["hostname","ipAddress"],"members":{"hostname":{},"ipAddress":{}}}},"dockerSecurityOptions":{"shape":"Sr"},"interactive":{"type":"boolean"},"pseudoTerminal":{"type":"boolean"},"dockerLabels":{"type":"map","key":{},"value":{}},"ulimits":{"type":"list","member":{"type":"structure","required":["name","softLimit","hardLimit"],"members":{"name":{},"softLimit":{"type":"integer"},"hardLimit":{"type":"integer"}}}},"logConfiguration":{"type":"structure","required":["logDriver"],"members":{"logDriver":{},"options":{"type":"map","key":{},"value":{}},"secretOptions":{"shape":"S3l"}}},"healthCheck":{"type":"structure","required":["command"],"members":{"command":{"shape":"Sr"},"interval":{"type":"integer"},"timeout":{"type":"integer"},"retries":{"type":"integer"},"startPeriod":{"type":"integer"}}},"systemControls":{"type":"list","member":{"type":"structure","members":{"namespace":{},"value":{}}}},"resourceRequirements":{"shape":"S42"},"firelensConfiguration":{"type":"structure","required":["type"],"members":{"type":{},"options":{"type":"map","key":{},"value":{}}}}}}},"S35":{"type":"list","member":{"shape":"S10"}},"S36":{"type":"list","member":{"type":"structure","required":["value","type"],"members":{"value":{},"type":{}}}},"S3l":{"type":"list","member":{"type":"structure","required":["name","valueFrom"],"members":{"name":{},"valueFrom":{}}}},"S42":{"type":"list","member":{"type":"structure","required":["value","type"],"members":{"value":{},"type":{}}}},"S49":{"type":"list","member":{"type":"structure","members":{"name":{},"host":{"type":"structure","members":{"sourcePath":{}}},"dockerVolumeConfiguration":{"type":"structure","members":{"scope":{},"autoprovision":{"type":"boolean"},"driver":{},"driverOpts":{"shape":"S4e"},"labels":{"shape":"S4e"}}},"efsVolumeConfiguration":{"type":"structure","required":["fileSystemId"],"members":{"fileSystemId":{},"rootDirectory":{},"transitEncryption":{},"transitEncryptionPort":{"type":"integer"},"authorizationConfig":{"type":"structure","members":{"accessPointId":{},"iam":{}}}}},"fsxWindowsFileServerVolumeConfiguration":{"type":"structure","required":["fileSystemId","rootDirectory","authorizationConfig"],"members":{"fileSystemId":{},"rootDirectory":{},"authorizationConfig":{"type":"structure","required":["credentialsParameter","domain"],"members":{"credentialsParameter":{},"domain":{}}}}}}}},"S4e":{"type":"map","key":{},"value":{}},"S4n":{"type":"list","member":{"type":"structure","members":{"type":{},"expression":{}}}},"S4q":{"type":"list","member":{}},"S4s":{"type":"list","member":{"type":"structure","required":["deviceName","deviceType"],"members":{"deviceName":{},"deviceType":{}}}},"S4w":{"type":"structure","required":["containerName"],"members":{"type":{},"containerName":{},"properties":{"type":"list","member":{"shape":"S10"}}}},"S54":{"type":"list","member":{"type":"structure","members":{"arn":{},"reason":{},"detail":{}}}},"S5f":{"type":"list","member":{"shape":"S2q"}},"S5x":{"type":"list","member":{"shape":"S5y"}},"S5y":{"type":"structure","members":{"attachments":{"shape":"S11"},"attributes":{"shape":"S2b"},"availabilityZone":{},"capacityProviderName":{},"clusterArn":{},"connectivity":{},"connectivityAt":{"type":"timestamp"},"containerInstanceArn":{},"containers":{"type":"list","member":{"type":"structure","members":{"containerArn":{},"taskArn":{},"name":{},"image":{},"imageDigest":{},"runtimeId":{},"lastStatus":{},"exitCode":{"type":"integer"},"reason":{},"networkBindings":{"shape":"S62"},"networkInterfaces":{"type":"list","member":{"type":"structure","members":{"attachmentId":{},"privateIpv4Address":{},"ipv6Address":{}}}},"healthStatus":{},"managedAgents":{"type":"list","member":{"type":"structure","members":{"lastStartedAt":{"type":"timestamp"},"name":{},"reason":{},"lastStatus":{}}}},"cpu":{},"memory":{},"memoryReservation":{},"gpuIds":{"type":"list","member":{}}}}},"cpu":{},"createdAt":{"type":"timestamp"},"desiredStatus":{},"enableExecuteCommand":{"type":"boolean"},"executionStoppedAt":{"type":"timestamp"},"group":{},"healthStatus":{},"inferenceAccelerators":{"shape":"S4s"},"lastStatus":{},"launchType":{},"memory":{},"overrides":{"shape":"S6b"},"platformVersion":{},"pullStartedAt":{"type":"timestamp"},"pullStoppedAt":{"type":"timestamp"},"startedAt":{"type":"timestamp"},"startedBy":{},"stopCode":{},"stoppedAt":{"type":"timestamp"},"stoppedReason":{},"stoppingAt":{"type":"timestamp"},"tags":{"shape":"Sa"},"taskArn":{},"taskDefinitionArn":{},"version":{"type":"long"}}},"S62":{"type":"list","member":{"type":"structure","members":{"bindIP":{},"containerPort":{"type":"integer"},"hostPort":{"type":"integer"},"protocol":{}}}},"S6b":{"type":"structure","members":{"containerOverrides":{"type":"list","member":{"type":"structure","members":{"name":{},"command":{"shape":"Sr"},"environment":{"shape":"S35"},"environmentFiles":{"shape":"S36"},"cpu":{"type":"integer"},"memory":{"type":"integer"},"memoryReservation":{"type":"integer"},"resourceRequirements":{"shape":"S42"}}}},"cpu":{},"inferenceAcceleratorOverrides":{"type":"list","member":{"type":"structure","members":{"deviceName":{},"deviceType":{}}}},"executionRoleArn":{},"memory":{},"taskRoleArn":{}}},"S7w":{"type":"list","member":{"type":"structure","required":["attachmentArn","status"],"members":{"attachmentArn":{},"status":{}}}}}}');

/***/ }),

/***/ 3629:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"o":{"ListAccountSettings":{"input_token":"nextToken","limit_key":"maxResults","output_token":"nextToken","result_key":"settings"},"ListAttributes":{"input_token":"nextToken","limit_key":"maxResults","output_token":"nextToken","result_key":"attributes"},"ListClusters":{"input_token":"nextToken","limit_key":"maxResults","output_token":"nextToken","result_key":"clusterArns"},"ListContainerInstances":{"input_token":"nextToken","limit_key":"maxResults","output_token":"nextToken","result_key":"containerInstanceArns"},"ListServices":{"input_token":"nextToken","limit_key":"maxResults","output_token":"nextToken","result_key":"serviceArns"},"ListTaskDefinitionFamilies":{"input_token":"nextToken","limit_key":"maxResults","output_token":"nextToken","result_key":"families"},"ListTaskDefinitions":{"input_token":"nextToken","limit_key":"maxResults","output_token":"nextToken","result_key":"taskDefinitionArns"},"ListTasks":{"input_token":"nextToken","limit_key":"maxResults","output_token":"nextToken","result_key":"taskArns"}}}');

/***/ }),

/***/ 4199:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"V":{"TasksRunning":{"delay":6,"operation":"DescribeTasks","maxAttempts":100,"acceptors":[{"expected":"STOPPED","matcher":"pathAny","state":"failure","argument":"tasks[].lastStatus"},{"expected":"MISSING","matcher":"pathAny","state":"failure","argument":"failures[].reason"},{"expected":"RUNNING","matcher":"pathAll","state":"success","argument":"tasks[].lastStatus"}]},"TasksStopped":{"delay":6,"operation":"DescribeTasks","maxAttempts":100,"acceptors":[{"expected":"STOPPED","matcher":"pathAll","state":"success","argument":"tasks[].lastStatus"}]},"ServicesStable":{"delay":15,"operation":"DescribeServices","maxAttempts":40,"acceptors":[{"expected":"MISSING","matcher":"pathAny","state":"failure","argument":"failures[].reason"},{"expected":"DRAINING","matcher":"pathAny","state":"failure","argument":"services[].status"},{"expected":"INACTIVE","matcher":"pathAny","state":"failure","argument":"services[].status"},{"expected":true,"matcher":"path","state":"success","argument":"length(services[?!(length(deployments) == `1` && runningCount == desiredCount)]) == `0`"}]},"ServicesInactive":{"delay":15,"operation":"DescribeServices","maxAttempts":40,"acceptors":[{"expected":"MISSING","matcher":"pathAny","state":"failure","argument":"failures[].reason"},{"expected":"INACTIVE","matcher":"pathAny","state":"success","argument":"services[].status"}]}}}');

/***/ }),

/***/ 9497:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"acm":{"name":"ACM","cors":true},"apigateway":{"name":"APIGateway","cors":true},"applicationautoscaling":{"prefix":"application-autoscaling","name":"ApplicationAutoScaling","cors":true},"appstream":{"name":"AppStream"},"autoscaling":{"name":"AutoScaling","cors":true},"batch":{"name":"Batch"},"budgets":{"name":"Budgets"},"clouddirectory":{"name":"CloudDirectory","versions":["2016-05-10*"]},"cloudformation":{"name":"CloudFormation","cors":true},"cloudfront":{"name":"CloudFront","versions":["2013-05-12*","2013-11-11*","2014-05-31*","2014-10-21*","2014-11-06*","2015-04-17*","2015-07-27*","2015-09-17*","2016-01-13*","2016-01-28*","2016-08-01*","2016-08-20*","2016-09-07*","2016-09-29*","2016-11-25*","2017-03-25*","2017-10-30*","2018-06-18*","2018-11-05*","2019-03-26*"],"cors":true},"cloudhsm":{"name":"CloudHSM","cors":true},"cloudsearch":{"name":"CloudSearch"},"cloudsearchdomain":{"name":"CloudSearchDomain"},"cloudtrail":{"name":"CloudTrail","cors":true},"cloudwatch":{"prefix":"monitoring","name":"CloudWatch","cors":true},"cloudwatchevents":{"prefix":"events","name":"CloudWatchEvents","versions":["2014-02-03*"],"cors":true},"cloudwatchlogs":{"prefix":"logs","name":"CloudWatchLogs","cors":true},"codebuild":{"name":"CodeBuild","cors":true},"codecommit":{"name":"CodeCommit","cors":true},"codedeploy":{"name":"CodeDeploy","cors":true},"codepipeline":{"name":"CodePipeline","cors":true},"cognitoidentity":{"prefix":"cognito-identity","name":"CognitoIdentity","cors":true},"cognitoidentityserviceprovider":{"prefix":"cognito-idp","name":"CognitoIdentityServiceProvider","cors":true},"cognitosync":{"prefix":"cognito-sync","name":"CognitoSync","cors":true},"configservice":{"prefix":"config","name":"ConfigService","cors":true},"cur":{"name":"CUR","cors":true},"datapipeline":{"name":"DataPipeline"},"devicefarm":{"name":"DeviceFarm","cors":true},"directconnect":{"name":"DirectConnect","cors":true},"directoryservice":{"prefix":"ds","name":"DirectoryService"},"discovery":{"name":"Discovery"},"dms":{"name":"DMS"},"dynamodb":{"name":"DynamoDB","cors":true},"dynamodbstreams":{"prefix":"streams.dynamodb","name":"DynamoDBStreams","cors":true},"ec2":{"name":"EC2","versions":["2013-06-15*","2013-10-15*","2014-02-01*","2014-05-01*","2014-06-15*","2014-09-01*","2014-10-01*","2015-03-01*","2015-04-15*","2015-10-01*","2016-04-01*","2016-09-15*"],"cors":true},"ecr":{"name":"ECR","cors":true},"ecs":{"name":"ECS","cors":true},"efs":{"prefix":"elasticfilesystem","name":"EFS","cors":true},"elasticache":{"name":"ElastiCache","versions":["2012-11-15*","2014-03-24*","2014-07-15*","2014-09-30*"],"cors":true},"elasticbeanstalk":{"name":"ElasticBeanstalk","cors":true},"elb":{"prefix":"elasticloadbalancing","name":"ELB","cors":true},"elbv2":{"prefix":"elasticloadbalancingv2","name":"ELBv2","cors":true},"emr":{"prefix":"elasticmapreduce","name":"EMR","cors":true},"es":{"name":"ES"},"elastictranscoder":{"name":"ElasticTranscoder","cors":true},"firehose":{"name":"Firehose","cors":true},"gamelift":{"name":"GameLift","cors":true},"glacier":{"name":"Glacier"},"health":{"name":"Health"},"iam":{"name":"IAM","cors":true},"importexport":{"name":"ImportExport"},"inspector":{"name":"Inspector","versions":["2015-08-18*"],"cors":true},"iot":{"name":"Iot","cors":true},"iotdata":{"prefix":"iot-data","name":"IotData","cors":true},"kinesis":{"name":"Kinesis","cors":true},"kinesisanalytics":{"name":"KinesisAnalytics"},"kms":{"name":"KMS","cors":true},"lambda":{"name":"Lambda","cors":true},"lexruntime":{"prefix":"runtime.lex","name":"LexRuntime","cors":true},"lightsail":{"name":"Lightsail"},"machinelearning":{"name":"MachineLearning","cors":true},"marketplacecommerceanalytics":{"name":"MarketplaceCommerceAnalytics","cors":true},"marketplacemetering":{"prefix":"meteringmarketplace","name":"MarketplaceMetering"},"mturk":{"prefix":"mturk-requester","name":"MTurk","cors":true},"mobileanalytics":{"name":"MobileAnalytics","cors":true},"opsworks":{"name":"OpsWorks","cors":true},"opsworkscm":{"name":"OpsWorksCM"},"organizations":{"name":"Organizations"},"pinpoint":{"name":"Pinpoint"},"polly":{"name":"Polly","cors":true},"rds":{"name":"RDS","versions":["2014-09-01*"],"cors":true},"redshift":{"name":"Redshift","cors":true},"rekognition":{"name":"Rekognition","cors":true},"resourcegroupstaggingapi":{"name":"ResourceGroupsTaggingAPI"},"route53":{"name":"Route53","cors":true},"route53domains":{"name":"Route53Domains","cors":true},"s3":{"name":"S3","dualstackAvailable":true,"cors":true},"s3control":{"name":"S3Control","dualstackAvailable":true,"xmlNoDefaultLists":true},"servicecatalog":{"name":"ServiceCatalog","cors":true},"ses":{"prefix":"email","name":"SES","cors":true},"shield":{"name":"Shield"},"simpledb":{"prefix":"sdb","name":"SimpleDB"},"sms":{"name":"SMS"},"snowball":{"name":"Snowball"},"sns":{"name":"SNS","cors":true},"sqs":{"name":"SQS","cors":true},"ssm":{"name":"SSM","cors":true},"storagegateway":{"name":"StorageGateway","cors":true},"stepfunctions":{"prefix":"states","name":"StepFunctions"},"sts":{"name":"STS","cors":true},"support":{"name":"Support"},"swf":{"name":"SWF"},"xray":{"name":"XRay","cors":true},"waf":{"name":"WAF","cors":true},"wafregional":{"prefix":"waf-regional","name":"WAFRegional"},"workdocs":{"name":"WorkDocs","cors":true},"workspaces":{"name":"WorkSpaces"},"codestar":{"name":"CodeStar"},"lexmodelbuildingservice":{"prefix":"lex-models","name":"LexModelBuildingService","cors":true},"marketplaceentitlementservice":{"prefix":"entitlement.marketplace","name":"MarketplaceEntitlementService"},"athena":{"name":"Athena"},"greengrass":{"name":"Greengrass"},"dax":{"name":"DAX"},"migrationhub":{"prefix":"AWSMigrationHub","name":"MigrationHub"},"cloudhsmv2":{"name":"CloudHSMV2"},"glue":{"name":"Glue"},"mobile":{"name":"Mobile"},"pricing":{"name":"Pricing","cors":true},"costexplorer":{"prefix":"ce","name":"CostExplorer","cors":true},"mediaconvert":{"name":"MediaConvert"},"medialive":{"name":"MediaLive"},"mediapackage":{"name":"MediaPackage"},"mediastore":{"name":"MediaStore"},"mediastoredata":{"prefix":"mediastore-data","name":"MediaStoreData","cors":true},"appsync":{"name":"AppSync"},"guardduty":{"name":"GuardDuty"},"mq":{"name":"MQ"},"comprehend":{"name":"Comprehend","cors":true},"iotjobsdataplane":{"prefix":"iot-jobs-data","name":"IoTJobsDataPlane"},"kinesisvideoarchivedmedia":{"prefix":"kinesis-video-archived-media","name":"KinesisVideoArchivedMedia","cors":true},"kinesisvideomedia":{"prefix":"kinesis-video-media","name":"KinesisVideoMedia","cors":true},"kinesisvideo":{"name":"KinesisVideo","cors":true},"sagemakerruntime":{"prefix":"runtime.sagemaker","name":"SageMakerRuntime"},"sagemaker":{"name":"SageMaker"},"translate":{"name":"Translate","cors":true},"resourcegroups":{"prefix":"resource-groups","name":"ResourceGroups","cors":true},"alexaforbusiness":{"name":"AlexaForBusiness"},"cloud9":{"name":"Cloud9"},"serverlessapplicationrepository":{"prefix":"serverlessrepo","name":"ServerlessApplicationRepository"},"servicediscovery":{"name":"ServiceDiscovery"},"workmail":{"name":"WorkMail"},"autoscalingplans":{"prefix":"autoscaling-plans","name":"AutoScalingPlans"},"transcribeservice":{"prefix":"transcribe","name":"TranscribeService"},"connect":{"name":"Connect","cors":true},"acmpca":{"prefix":"acm-pca","name":"ACMPCA"},"fms":{"name":"FMS"},"secretsmanager":{"name":"SecretsManager","cors":true},"iotanalytics":{"name":"IoTAnalytics","cors":true},"iot1clickdevicesservice":{"prefix":"iot1click-devices","name":"IoT1ClickDevicesService"},"iot1clickprojects":{"prefix":"iot1click-projects","name":"IoT1ClickProjects"},"pi":{"name":"PI"},"neptune":{"name":"Neptune"},"mediatailor":{"name":"MediaTailor"},"eks":{"name":"EKS"},"macie":{"name":"Macie"},"dlm":{"name":"DLM"},"signer":{"name":"Signer"},"chime":{"name":"Chime"},"pinpointemail":{"prefix":"pinpoint-email","name":"PinpointEmail"},"ram":{"name":"RAM"},"route53resolver":{"name":"Route53Resolver"},"pinpointsmsvoice":{"prefix":"sms-voice","name":"PinpointSMSVoice"},"quicksight":{"name":"QuickSight"},"rdsdataservice":{"prefix":"rds-data","name":"RDSDataService"},"amplify":{"name":"Amplify"},"datasync":{"name":"DataSync"},"robomaker":{"name":"RoboMaker"},"transfer":{"name":"Transfer"},"globalaccelerator":{"name":"GlobalAccelerator"},"comprehendmedical":{"name":"ComprehendMedical","cors":true},"kinesisanalyticsv2":{"name":"KinesisAnalyticsV2"},"mediaconnect":{"name":"MediaConnect"},"fsx":{"name":"FSx"},"securityhub":{"name":"SecurityHub"},"appmesh":{"name":"AppMesh","versions":["2018-10-01*"]},"licensemanager":{"prefix":"license-manager","name":"LicenseManager"},"kafka":{"name":"Kafka"},"apigatewaymanagementapi":{"name":"ApiGatewayManagementApi"},"apigatewayv2":{"name":"ApiGatewayV2"},"docdb":{"name":"DocDB"},"backup":{"name":"Backup"},"worklink":{"name":"WorkLink"},"textract":{"name":"Textract"},"managedblockchain":{"name":"ManagedBlockchain"},"mediapackagevod":{"prefix":"mediapackage-vod","name":"MediaPackageVod"},"groundstation":{"name":"GroundStation"},"iotthingsgraph":{"name":"IoTThingsGraph"},"iotevents":{"name":"IoTEvents"},"ioteventsdata":{"prefix":"iotevents-data","name":"IoTEventsData"},"personalize":{"name":"Personalize","cors":true},"personalizeevents":{"prefix":"personalize-events","name":"PersonalizeEvents","cors":true},"personalizeruntime":{"prefix":"personalize-runtime","name":"PersonalizeRuntime","cors":true},"applicationinsights":{"prefix":"application-insights","name":"ApplicationInsights"},"servicequotas":{"prefix":"service-quotas","name":"ServiceQuotas"},"ec2instanceconnect":{"prefix":"ec2-instance-connect","name":"EC2InstanceConnect"},"eventbridge":{"name":"EventBridge"},"lakeformation":{"name":"LakeFormation"},"forecastservice":{"prefix":"forecast","name":"ForecastService","cors":true},"forecastqueryservice":{"prefix":"forecastquery","name":"ForecastQueryService","cors":true},"qldb":{"name":"QLDB"},"qldbsession":{"prefix":"qldb-session","name":"QLDBSession"},"workmailmessageflow":{"name":"WorkMailMessageFlow"},"codestarnotifications":{"prefix":"codestar-notifications","name":"CodeStarNotifications"},"savingsplans":{"name":"SavingsPlans"},"sso":{"name":"SSO"},"ssooidc":{"prefix":"sso-oidc","name":"SSOOIDC"},"marketplacecatalog":{"prefix":"marketplace-catalog","name":"MarketplaceCatalog"},"dataexchange":{"name":"DataExchange"},"sesv2":{"name":"SESV2"},"migrationhubconfig":{"prefix":"migrationhub-config","name":"MigrationHubConfig"},"connectparticipant":{"name":"ConnectParticipant"},"appconfig":{"name":"AppConfig"},"iotsecuretunneling":{"name":"IoTSecureTunneling"},"wafv2":{"name":"WAFV2"},"elasticinference":{"prefix":"elastic-inference","name":"ElasticInference"},"imagebuilder":{"name":"Imagebuilder"},"schemas":{"name":"Schemas"},"accessanalyzer":{"name":"AccessAnalyzer"},"codegurureviewer":{"prefix":"codeguru-reviewer","name":"CodeGuruReviewer"},"codeguruprofiler":{"name":"CodeGuruProfiler"},"computeoptimizer":{"prefix":"compute-optimizer","name":"ComputeOptimizer"},"frauddetector":{"name":"FraudDetector"},"kendra":{"name":"Kendra"},"networkmanager":{"name":"NetworkManager"},"outposts":{"name":"Outposts"},"augmentedairuntime":{"prefix":"sagemaker-a2i-runtime","name":"AugmentedAIRuntime"},"ebs":{"name":"EBS"},"kinesisvideosignalingchannels":{"prefix":"kinesis-video-signaling","name":"KinesisVideoSignalingChannels","cors":true},"detective":{"name":"Detective"},"codestarconnections":{"prefix":"codestar-connections","name":"CodeStarconnections"},"synthetics":{"name":"Synthetics"},"iotsitewise":{"name":"IoTSiteWise"},"macie2":{"name":"Macie2"},"codeartifact":{"name":"CodeArtifact"},"honeycode":{"name":"Honeycode"},"ivs":{"name":"IVS"},"braket":{"name":"Braket"},"identitystore":{"name":"IdentityStore"},"appflow":{"name":"Appflow"},"redshiftdata":{"prefix":"redshift-data","name":"RedshiftData"},"ssoadmin":{"prefix":"sso-admin","name":"SSOAdmin"},"timestreamquery":{"prefix":"timestream-query","name":"TimestreamQuery"},"timestreamwrite":{"prefix":"timestream-write","name":"TimestreamWrite"},"s3outposts":{"name":"S3Outposts"},"databrew":{"name":"DataBrew"},"servicecatalogappregistry":{"prefix":"servicecatalog-appregistry","name":"ServiceCatalogAppRegistry"},"networkfirewall":{"prefix":"network-firewall","name":"NetworkFirewall"},"mwaa":{"name":"MWAA"},"amplifybackend":{"name":"AmplifyBackend"},"appintegrations":{"name":"AppIntegrations"},"connectcontactlens":{"prefix":"connect-contact-lens","name":"ConnectContactLens"},"devopsguru":{"prefix":"devops-guru","name":"DevOpsGuru"},"ecrpublic":{"prefix":"ecr-public","name":"ECRPUBLIC"},"lookoutvision":{"name":"LookoutVision"},"sagemakerfeaturestoreruntime":{"prefix":"sagemaker-featurestore-runtime","name":"SageMakerFeatureStoreRuntime"},"customerprofiles":{"prefix":"customer-profiles","name":"CustomerProfiles"},"auditmanager":{"name":"AuditManager"},"emrcontainers":{"prefix":"emr-containers","name":"EMRcontainers"},"healthlake":{"name":"HealthLake"},"sagemakeredge":{"prefix":"sagemaker-edge","name":"SagemakerEdge"},"amp":{"name":"Amp"},"greengrassv2":{"name":"GreengrassV2"},"iotdeviceadvisor":{"name":"IotDeviceAdvisor"},"iotfleethub":{"name":"IoTFleetHub"},"iotwireless":{"name":"IoTWireless"},"location":{"name":"Location"},"wellarchitected":{"name":"WellArchitected"},"lexmodelsv2":{"prefix":"models.lex.v2","name":"LexModelsV2"},"lexruntimev2":{"prefix":"runtime.lex.v2","name":"LexRuntimeV2","cors":true},"fis":{"name":"Fis"},"lookoutmetrics":{"name":"LookoutMetrics"},"mgn":{"name":"Mgn"},"lookoutequipment":{"name":"LookoutEquipment"}}');

/***/ }),

/***/ 8976:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"version":"2.0","metadata":{"apiVersion":"2011-06-15","endpointPrefix":"sts","globalEndpoint":"sts.amazonaws.com","protocol":"query","serviceAbbreviation":"AWS STS","serviceFullName":"AWS Security Token Service","serviceId":"STS","signatureVersion":"v4","uid":"sts-2011-06-15","xmlNamespace":"https://sts.amazonaws.com/doc/2011-06-15/"},"operations":{"AssumeRole":{"input":{"type":"structure","required":["RoleArn","RoleSessionName"],"members":{"RoleArn":{},"RoleSessionName":{},"PolicyArns":{"shape":"S4"},"Policy":{},"DurationSeconds":{"type":"integer"},"Tags":{"shape":"S8"},"TransitiveTagKeys":{"type":"list","member":{}},"ExternalId":{},"SerialNumber":{},"TokenCode":{},"SourceIdentity":{}}},"output":{"resultWrapper":"AssumeRoleResult","type":"structure","members":{"Credentials":{"shape":"Si"},"AssumedRoleUser":{"shape":"Sn"},"PackedPolicySize":{"type":"integer"},"SourceIdentity":{}}}},"AssumeRoleWithSAML":{"input":{"type":"structure","required":["RoleArn","PrincipalArn","SAMLAssertion"],"members":{"RoleArn":{},"PrincipalArn":{},"SAMLAssertion":{},"PolicyArns":{"shape":"S4"},"Policy":{},"DurationSeconds":{"type":"integer"}}},"output":{"resultWrapper":"AssumeRoleWithSAMLResult","type":"structure","members":{"Credentials":{"shape":"Si"},"AssumedRoleUser":{"shape":"Sn"},"PackedPolicySize":{"type":"integer"},"Subject":{},"SubjectType":{},"Issuer":{},"Audience":{},"NameQualifier":{},"SourceIdentity":{}}}},"AssumeRoleWithWebIdentity":{"input":{"type":"structure","required":["RoleArn","RoleSessionName","WebIdentityToken"],"members":{"RoleArn":{},"RoleSessionName":{},"WebIdentityToken":{},"ProviderId":{},"PolicyArns":{"shape":"S4"},"Policy":{},"DurationSeconds":{"type":"integer"}}},"output":{"resultWrapper":"AssumeRoleWithWebIdentityResult","type":"structure","members":{"Credentials":{"shape":"Si"},"SubjectFromWebIdentityToken":{},"AssumedRoleUser":{"shape":"Sn"},"PackedPolicySize":{"type":"integer"},"Provider":{},"Audience":{},"SourceIdentity":{}}}},"DecodeAuthorizationMessage":{"input":{"type":"structure","required":["EncodedMessage"],"members":{"EncodedMessage":{}}},"output":{"resultWrapper":"DecodeAuthorizationMessageResult","type":"structure","members":{"DecodedMessage":{}}}},"GetAccessKeyInfo":{"input":{"type":"structure","required":["AccessKeyId"],"members":{"AccessKeyId":{}}},"output":{"resultWrapper":"GetAccessKeyInfoResult","type":"structure","members":{"Account":{}}}},"GetCallerIdentity":{"input":{"type":"structure","members":{}},"output":{"resultWrapper":"GetCallerIdentityResult","type":"structure","members":{"UserId":{},"Account":{},"Arn":{}}}},"GetFederationToken":{"input":{"type":"structure","required":["Name"],"members":{"Name":{},"Policy":{},"PolicyArns":{"shape":"S4"},"DurationSeconds":{"type":"integer"},"Tags":{"shape":"S8"}}},"output":{"resultWrapper":"GetFederationTokenResult","type":"structure","members":{"Credentials":{"shape":"Si"},"FederatedUser":{"type":"structure","required":["FederatedUserId","Arn"],"members":{"FederatedUserId":{},"Arn":{}}},"PackedPolicySize":{"type":"integer"}}}},"GetSessionToken":{"input":{"type":"structure","members":{"DurationSeconds":{"type":"integer"},"SerialNumber":{},"TokenCode":{}}},"output":{"resultWrapper":"GetSessionTokenResult","type":"structure","members":{"Credentials":{"shape":"Si"}}}}},"shapes":{"S4":{"type":"list","member":{"type":"structure","members":{"arn":{}}}},"S8":{"type":"list","member":{"type":"structure","required":["Key","Value"],"members":{"Key":{},"Value":{}}}},"Si":{"type":"structure","required":["AccessKeyId","SecretAccessKey","SessionToken","Expiration"],"members":{"AccessKeyId":{},"SecretAccessKey":{},"SessionToken":{},"Expiration":{"type":"timestamp"}}},"Sn":{"type":"structure","required":["AssumedRoleId","Arn"],"members":{"AssumedRoleId":{},"Arn":{}}}}}');

/***/ }),

/***/ 2952:
/***/ ((module) => {

"use strict";
module.exports = {"o":{}};

/***/ }),

/***/ 1765:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"rules":{"*/*":{"endpoint":"{service}.{region}.amazonaws.com"},"cn-*/*":{"endpoint":"{service}.{region}.amazonaws.com.cn"},"us-iso-*/*":{"endpoint":"{service}.{region}.c2s.ic.gov"},"us-isob-*/*":{"endpoint":"{service}.{region}.sc2s.sgov.gov"},"*/budgets":"globalSSL","*/cloudfront":"globalSSL","*/sts":"globalSSL","*/importexport":{"endpoint":"{service}.amazonaws.com","signatureVersion":"v2","globalEndpoint":true},"*/route53":"globalSSL","cn-*/route53":{"endpoint":"{service}.amazonaws.com.cn","globalEndpoint":true,"signingRegion":"cn-northwest-1"},"us-gov-*/route53":"globalGovCloud","*/waf":"globalSSL","*/iam":"globalSSL","cn-*/iam":{"endpoint":"{service}.cn-north-1.amazonaws.com.cn","globalEndpoint":true,"signingRegion":"cn-north-1"},"us-gov-*/iam":"globalGovCloud","us-gov-*/sts":{"endpoint":"{service}.{region}.amazonaws.com"},"us-gov-west-1/s3":"s3signature","us-west-1/s3":"s3signature","us-west-2/s3":"s3signature","eu-west-1/s3":"s3signature","ap-southeast-1/s3":"s3signature","ap-southeast-2/s3":"s3signature","ap-northeast-1/s3":"s3signature","sa-east-1/s3":"s3signature","us-east-1/s3":{"endpoint":"{service}.amazonaws.com","signatureVersion":"s3"},"us-east-1/sdb":{"endpoint":"{service}.amazonaws.com","signatureVersion":"v2"},"*/sdb":{"endpoint":"{service}.{region}.amazonaws.com","signatureVersion":"v2"}},"patterns":{"globalSSL":{"endpoint":"https://{service}.amazonaws.com","globalEndpoint":true,"signingRegion":"us-east-1"},"globalGovCloud":{"endpoint":"{service}.us-gov.amazonaws.com","globalEndpoint":true,"signingRegion":"us-gov-west-1"},"s3signature":{"endpoint":"{service}.{region}.amazonaws.com","signatureVersion":"s3"}}}');

/***/ }),

/***/ 4293:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");;

/***/ }),

/***/ 3129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");;

/***/ }),

/***/ 6200:
/***/ ((module) => {

"use strict";
module.exports = require("dgram");;

/***/ }),

/***/ 5229:
/***/ ((module) => {

"use strict";
module.exports = require("domain");;

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 1191:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");;

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 4304:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");;

/***/ }),

/***/ 8213:
/***/ ((module) => {

"use strict";
module.exports = require("timers");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(3109);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;