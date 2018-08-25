"use strict";
// Copyright 2014-2016, Google, Inc.
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
function createNock(path) {
    const p = path ? path : '/drive/v2/files/woot';
    nock(utils_1.Utils.baseUrl).get(p).reply(200);
}
describe('Options', () => {
    let authClient;
    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
    });
    it('should be a function', () => {
        const google = new src_1.GoogleApis();
        assert.strictEqual(typeof google.options, 'function');
    });
    it('should expose _options', () => {
        const google = new src_1.GoogleApis();
        google.options({ params: { hello: 'world' } });
        assert.deepStrictEqual(google._options, { params: { hello: 'world' } });
    });
    it('should expose _options values', () => {
        const google = new src_1.GoogleApis();
        google.options({ params: { hello: 'world' } });
        assert.deepStrictEqual(google._options.params.hello, 'world');
    });
    it('should promote endpoint options over global options', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        google.options({ params: { hello: 'world' } });
        const drive = google.drive({ version: 'v2', params: { hello: 'changed' } });
        createNock('/drive/v2/files/123?hello=changed');
        const res = yield drive.files.get({ fileId: '123' });
        assert.strictEqual(res.config.params.hello, 'changed');
    }));
    it('should support global request params', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        google.options({ params: { myParam: '123' } });
        const drive = google.drive('v2');
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?myParam=123').reply(200);
        const res = yield drive.files.get({ fileId: '123' });
        // If the default param handling is broken, query might be undefined, thus
        // concealing the assertion message with some generic "cannot call
        // .indexOf of undefined"
        let query = utils_1.Utils.getQs(res) || '';
        assert.notEqual(query.indexOf('myParam=123'), -1, 'Default param not found in query');
        // I can't explain why, but the `nock.enableNetConnect()` call below simply
        // won't work unless I call `nock.cleanAll()` first.
        nock.cleanAll();
        nock.enableNetConnect();
        const d = yield utils_1.Utils.loadApi(google, 'drive', 'v2');
        nock.disableNetConnect();
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?myParam=123').reply(200);
        // tslint:disable-next-line no-any
        const res3 = yield d.files.get({ fileId: '123' });
        // If the default param handling is broken, query might be undefined,
        // thus concealing the assertion message with some generic "cannot
        // call .indexOf of undefined"
        query = utils_1.Utils.getQs(res3) || '';
        assert.notEqual(query.indexOf('myParam=123'), -1, 'Default param not found in query');
    }));
    it('should promote auth apikey options on request basis', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        google.options({ auth: 'apikey1' });
        const drive = google.drive({ version: 'v2', auth: 'apikey2' });
        createNock('/drive/v2/files/woot?key=apikey3');
        const res = yield drive.files.get({ auth: 'apikey3', fileId: 'woot' });
        assert.strictEqual(utils_1.Utils.getQs(res), 'key=apikey3');
    }));
    it('should apply google options to request object like timeout', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        google.options({ timeout: 12345 });
        const drive = google.drive({ version: 'v2', auth: 'apikey2' });
        createNock('/drive/v2/files/woot?key=apikey3');
        const res = yield drive.files.get({ auth: 'apikey3', fileId: 'woot' });
        assert.strictEqual(res.config.timeout, 12345);
    }));
    it('should apply endpoint options to request object like timeout', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        const drive = google.drive({ version: 'v2', auth: 'apikey2', timeout: 23456 });
        createNock('/drive/v2/files/woot?key=apikey3');
        const res = yield drive.files.get({ auth: 'apikey3', fileId: 'woot' });
        assert.strictEqual(res.config.timeout, 23456);
        assert.strictEqual(utils_1.Utils.getQs(res), 'key=apikey3');
    }));
    it('should allow overriding endpoint options', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        const drive = google.drive('v3');
        const host = 'https://myproxy.com';
        nock(host).get('/drive/v3/files/woot').reply(200);
        const res = yield drive.files.get({ fileId: 'woot' }, { url: 'https://myproxy.com/drive/v3/files/{fileId}', timeout: 12345 });
        assert.strictEqual(res.request.path, '/drive/v3/files/woot', 'Request used overridden url.');
        assert.strictEqual(res.request.headers.host, 'myproxy.com');
        assert.strictEqual(res.config.timeout, 12345, 'Axios used overridden timeout.');
    }));
    it('should apply endpoint options like timeout to oauth transporter', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        const OAuth2 = google.auth.OAuth2;
        authClient = new OAuth2('CLIENTID', 'CLIENTSECRET', 'REDIRECTURI');
        authClient.credentials = { access_token: 'abc' };
        const drive = google.drive({ version: 'v2', auth: 'apikey2', timeout: 12345 });
        createNock('/drive/v2/files/woot');
        const res = yield drive.files.get({ auth: authClient, fileId: 'woot' });
        assert.strictEqual(res.config.timeout, 12345);
        assert.strictEqual(res.config.headers.Authorization, 'Bearer abc');
    }));
    it('should allow overriding rootUrl via options', () => __awaiter(this, void 0, void 0, function* () {
        const google = new src_1.GoogleApis();
        const drive = google.drive('v3');
        const fileId = 'woot';
        const rootUrl = 'https://myrooturl.com';
        nock(rootUrl).get('/drive/v3/files/woot').reply(200);
        const res = yield drive.files.get({ fileId }, { rootUrl });
        assert.strictEqual(res.config.url, 'https://myrooturl.com/drive/v3/files/woot', 'Request used overridden rootUrl with trailing slash.');
        nock(rootUrl).get('/drive/v3/files/woot').reply(200);
        const res2 = yield drive.files.get({ fileId }, { rootUrl });
        assert.strictEqual(res.config.url, 'https://myrooturl.com/drive/v3/files/woot', 'Request used overridden rootUrl.');
    }));
    it('should allow overriding validateStatus', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl).get('/drive/v2/files').reply(500);
        const google = new src_1.GoogleApis();
        const drive = google.drive('v2');
        const res = yield drive.files.list({}, {
            validateStatus: (status) => {
                return true;
            }
        });
        assert.strictEqual(res.status, 500);
    }));
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.options.js.map