"use strict";
// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
class Utils {
    static getQs(res) {
        const query = url.parse(res.request.path).query;
        return query ? query.toString() : null;
    }
    static getPath(res) {
        return url.parse(res.config.url).path;
    }
    static getDiscoveryUrl(name, version) {
        return 'https://www.googleapis.com/discovery/v1/apis/' + name + '/' +
            version + '/rest';
    }
    // tslint:disable-next-line no-any
    static loadApi(google, name, version, options = {}) {
        return google.discoverAPI(Utils.getDiscoveryUrl(name, version), options);
    }
}
Utils.noop = () => undefined;
Utils.baseUrl = 'https://www.googleapis.com';
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map