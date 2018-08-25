"use strict";
// Copyright 2018, Google, LLC.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const nock = require("nock");
const utils_1 = require("./../utils");
nock.disableNetConnect();
// tslint:disable: no-any
const samples = {
    query: require('../../../samples/webmasters/query')
};
for (const p in samples) {
    if (samples[p]) {
        samples[p].client.credentials = { access_token: 'not-a-token' };
    }
}
describe('webmaster samples', () => {
    afterEach(() => {
        nock.cleanAll();
    });
    it('should query analytics', () => __awaiter(this, void 0, void 0, function* () {
        const siteUrl = 'http://jbeckwith.com';
        const path = `/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
        const scope = nock(utils_1.Utils.baseUrl).post(path).reply(200, {});
        const data = yield samples.query.runSample();
        assert(data);
        scope.done();
    }));
});
//# sourceMappingURL=test.samples.webmasters.js.map