"use strict";
// Copyright 2013-2016, Google, Inc.
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
const src_1 = require("../src");
const utils_1 = require("./utils");
function createNock(qs) {
    const query = qs ? `?${qs}` : '';
    return nock('https://datastore.googleapis.com')
        .post(`/v1/projects/test-project-id:lookup${query}`)
        .reply(200);
}
describe('Clients', () => {
    let localPlus, remotePlus;
    let localOauth2, remoteOauth2;
    before(() => __awaiter(this, void 0, void 0, function* () {
        nock.cleanAll();
        const google = new src_1.GoogleApis();
        nock.enableNetConnect();
        [remotePlus, remoteOauth2] = yield Promise.all([
            utils_1.Utils.loadApi(google, 'plus', 'v1'), utils_1.Utils.loadApi(google, 'oauth2', 'v2')
        ]);
        nock.disableNetConnect();
    }));
    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
        const google = new src_1.GoogleApis();
        localPlus = google.plus('v1');
        localOauth2 = google.oauth2('v2');
    });
    it('should create request helpers according to resource on discovery API response', () => {
        let plus = localPlus;
        assert.strictEqual(typeof plus.people.get, 'function');
        assert.strictEqual(typeof plus.activities.search, 'function');
        assert.strictEqual(typeof plus.comments.list, 'function');
        plus = remotePlus;
        assert.strictEqual(typeof plus.people.get, 'function');
        assert.strictEqual(typeof plus.activities.search, 'function');
        assert.strictEqual(typeof plus.comments.list, 'function');
    });
    it('should be able to gen top level methods', () => {
        assert.strictEqual(typeof localOauth2.tokeninfo, 'function');
        assert.strictEqual(typeof remoteOauth2.tokeninfo, 'function');
    });
    it('should be able to gen top level methods and resources', () => {
        let oauth2 = localOauth2;
        assert.strictEqual(typeof oauth2.tokeninfo, 'function');
        assert.strictEqual(typeof oauth2.userinfo, 'object');
        oauth2 = remoteOauth2;
        assert.strictEqual(typeof oauth2.tokeninfo, 'function');
        assert.strictEqual(typeof oauth2.userinfo, 'object');
    });
    it('should be able to gen nested resources and methods', () => {
        let oauth2 = localOauth2;
        assert.strictEqual(typeof oauth2.userinfo, 'object');
        assert.strictEqual(typeof oauth2.userinfo.v2, 'object');
        assert.strictEqual(typeof oauth2.userinfo.v2.me, 'object');
        assert.strictEqual(typeof oauth2.userinfo.v2.me.get, 'function');
        oauth2 = remoteOauth2;
        assert.strictEqual(typeof oauth2.userinfo, 'object');
        assert.strictEqual(typeof oauth2.userinfo.v2, 'object');
        assert.strictEqual(typeof oauth2.userinfo.v2.me, 'object');
        assert.strictEqual(typeof oauth2.userinfo.v2.me.get, 'function');
    });
    it('should support default params', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        const datastore = google.datastore({ version: 'v1', params: { myParam: '123' } });
        createNock('myParam=123');
        const res = yield datastore.projects.lookup({ projectId: 'test-project-id' });
        // If the default param handling is broken, query might be undefined, thus
        // concealing the assertion message with some generic "cannot call .indexOf
        // of undefined"
        const query = utils_1.Utils.getQs(res) || '';
        assert.notEqual(query.indexOf('myParam=123'), -1, 'Default param in query');
        nock.enableNetConnect();
        const datastore2 = yield utils_1.Utils.loadApi(google, 'datastore', 'v1', { params: { myParam: '123' } });
        nock.disableNetConnect();
        createNock('myParam=123');
        const res2 = 
        // tslint:disable-next-line no-any
        yield datastore2.projects.lookup({
            projectId: 'test-project-id'
        });
        const query2 = utils_1.Utils.getQs(res2) || '';
        assert.notEqual(query2.indexOf('myParam=123'), -1, 'Default param in query');
    }));
    it('should allow default params to be overriden per-request', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        const datastore = google.datastore({ version: 'v1', params: { myParam: '123' } });
        // Override the default datasetId param for this particular API call
        createNock('myParam=456');
        const res = yield datastore.projects.lookup(
        // tslint:disable-next-line no-any
        { projectId: 'test-project-id', myParam: '456' });
        // If the default param handling is broken, query might be undefined, thus
        // concealing the assertion message with some generic "cannot call .indexOf
        // of undefined"
        const query = utils_1.Utils.getQs(res) || '';
        assert.notEqual(query.indexOf('myParam=456'), -1, 'Default param not found in query');
        nock.enableNetConnect();
        const datastore2 = yield utils_1.Utils.loadApi(google, 'datastore', 'v1', { params: { myParam: '123' } });
        nock.disableNetConnect();
        // Override the default datasetId param for this particular API call
        createNock('myParam=456');
        // tslint:disable-next-line no-any
        const res2 = yield datastore2.projects.lookup({
            projectId: 'test-project-id',
            myParam: '456'
        });
        // If the default param handling is broken, query might be undefined,
        // thus concealing the assertion message with some generic "cannot
        // call .indexOf of undefined"
        const query2 = utils_1.Utils.getQs(res2) || '';
        assert.notEqual(query2.indexOf('myParam=456'), -1, 'Default param not found in query');
    }));
    it('should include default params when only callback is provided to API call', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        const datastore = google.datastore({
            version: 'v1',
            params: {
                // We must set this here - it is a required param
                projectId: 'test-project-id',
                myParam: '123'
            }
        });
        // No params given - only callback
        createNock('myParam=123');
        const res = yield datastore.projects.lookup();
        // If the default param handling is broken, req or query might be
        // undefined, thus concealing the assertion message with some generic
        // "cannot call .indexOf of undefined"
        const query = utils_1.Utils.getQs(res) || '';
        assert.notEqual(query.indexOf('myParam=123'), -1, 'Default param not found in query');
        nock.enableNetConnect();
        const datastore2 = yield utils_1.Utils.loadApi(google, 'datastore', 'v1', {
            params: {
                projectId: 'test-project-id',
                // required param
                myParam: '123'
            }
        });
        nock.disableNetConnect();
        // No params given - only callback
        createNock('myParam=123');
        // tslint:disable-next-line no-any
        const res3 = yield datastore2.projects.lookup();
        // If the default param handling is broken, req or query might be
        // undefined, thus concealing the assertion message with some
        // generic "cannot call .indexOf of undefined"
        const query2 = utils_1.Utils.getQs(res3) || '';
        assert.notEqual(query2.indexOf('myParam=123'), -1, 'Default param not found in query');
    }));
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.clients.js.map