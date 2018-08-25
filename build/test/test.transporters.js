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
function testHeaders(drive) {
    return __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).post('/drive/v2/files/a/comments').reply(200);
        const res = yield drive.comments.insert({ fileId: 'a', headers: { 'If-None-Match': '12345' } });
        assert.strictEqual(res.config.headers['If-None-Match'], '12345');
    });
}
function testContentType(drive) {
    return __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).post('/drive/v2/files/a/comments').reply(200);
        const res = yield drive.comments.insert({ fileId: 'a', resource: { content: 'hello ' } });
        assert(res.request.headers['content-type'].indexOf('application/json') === 0);
    });
}
function testGzip(drive) {
    return __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .get('/drive/v2/files', undefined, { reqheaders: { 'Accept-Encoding': 'gzip' } })
            .reply(200, {});
        const res = yield drive.files.list();
        assert.deepStrictEqual(res.data, {});
        // note: axios strips the `content-encoding` header from the response,
        // so that cannot be checked here.
    });
}
function testBody(drive) {
    return __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl).get('/drive/v2/files').reply(200);
        const res = yield drive.files.list();
        scope.done();
        assert.strictEqual(res.config.headers['content-type'], undefined);
        assert.strictEqual(res.request.body, undefined);
    });
}
function testBodyDelete(drive) {
    return __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl).delete('/drive/v2/files/test').reply(200);
        const res = yield drive.files.delete({ fileId: 'test' });
        scope.done();
        assert.strictEqual(res.config.headers['content-type'], undefined);
        assert.strictEqual(res.request.body, undefined);
    });
}
function testResponseError(drive, cb) {
    drive.files.list({ q: 'hello' }, (err) => {
        assert(err instanceof Error);
        assert.strictEqual(err.message, 'Error!');
        assert.strictEqual(err.code, 400);
        cb();
    });
}
function testNotObjectError(oauth2, cb) {
    oauth2.tokeninfo({ access_token: 'hello' }, (err) => {
        assert(err instanceof Error);
        assert.strictEqual(err.message, 'invalid_grant');
        assert.strictEqual(err.code, '400');
        cb();
    });
}
function testBackendError(urlshortener, cb) {
    const obj = { longUrl: 'http://google.com/' };
    urlshortener.url.insert({ resource: obj }, (err, result) => {
        assert(err instanceof Error);
        assert.strictEqual(Number(err.code), 500);
        assert.strictEqual(err.message, 'There was an error!');
        assert.strictEqual(result, undefined);
        cb();
    });
}
describe('Transporters', () => {
    let localDrive;
    let remoteDrive;
    let localOauth2;
    let remoteOauth2;
    let localUrlshortener;
    let remoteUrlshortener;
    before(() => __awaiter(this, void 0, void 0, function* () {
        nock.cleanAll();
        const google = new src_1.GoogleApis();
        nock.enableNetConnect();
        [remoteDrive, remoteOauth2, remoteUrlshortener] = yield Promise.all([
            utils_1.Utils.loadApi(google, 'drive', 'v2'),
            utils_1.Utils.loadApi(google, 'oauth2', 'v2'),
            utils_1.Utils.loadApi(google, 'urlshortener', 'v1')
        ]);
        nock.disableNetConnect();
    }));
    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
        const google = new src_1.GoogleApis();
        localDrive = google.drive('v2');
        localOauth2 = google.oauth2('v2');
        localUrlshortener = google.urlshortener('v1');
    });
    it('should add headers to the request from params', () => __awaiter(this, void 0, void 0, function* () {
        yield testHeaders(localDrive);
        yield testHeaders(remoteDrive);
    }));
    it('should automatically add content-type for POST requests', () => __awaiter(this, void 0, void 0, function* () {
        yield testContentType(localDrive);
        yield testContentType(remoteDrive);
    }));
    it('should add the proper gzip headers', () => __awaiter(this, void 0, void 0, function* () {
        yield testGzip(localDrive);
        yield testGzip(remoteDrive);
    }));
    it('should not add body for GET requests', () => __awaiter(this, void 0, void 0, function* () {
        yield testBody(localDrive);
        yield testBody(remoteDrive);
    }));
    it('should not add body for DELETE requests', () => __awaiter(this, void 0, void 0, function* () {
        yield testBodyDelete(localDrive);
        yield testBodyDelete(remoteDrive);
    }));
    it('should return errors within response body as instances of Error', (done) => {
        const scope = nock(utils_1.Utils.baseUrl)
            .get('/drive/v2/files?q=hello')
            .times(2)
            // Simulate an error returned via response body from
            // Google's API endpoint
            .reply(400, { error: { code: 400, message: 'Error!' } });
        testResponseError(localDrive, () => {
            testResponseError(remoteDrive, () => {
                scope.done();
                done();
            });
        });
    });
    it('should return error message correctly when error is not an object', (done) => {
        const scope = nock(utils_1.Utils.baseUrl)
            .post('/oauth2/v2/tokeninfo?access_token=hello')
            .times(2)
            // Simulate an error returned via response body from
            // Google's tokeninfo endpoint
            .reply(400, {
            error: 'invalid_grant',
            error_description: 'Code was already redeemed.'
        });
        testNotObjectError(localOauth2, () => {
            testNotObjectError(remoteOauth2, () => {
                scope.done();
                done();
            });
        });
    });
    it('should return 5xx responses as errors', (done) => {
        const scope = nock(utils_1.Utils.baseUrl)
            .post('/urlshortener/v1/url')
            .times(2)
            .reply(500, 'There was an error!');
        testBackendError(localUrlshortener, () => {
            testBackendError(remoteUrlshortener, () => {
                scope.done();
                done();
            });
        });
    });
    it('should return 304 responses as success', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl).get('/drive/v2/files').reply(304);
        const res = yield localDrive.files.list();
        assert.strictEqual(res.status, 304);
    }));
    it('should handle 5xx responses that include errors', (done) => {
        const scope = nock(utils_1.Utils.baseUrl).post('/urlshortener/v1/url').times(2).reply(500, {
            error: { message: 'There was an error!' }
        });
        testBackendError(localUrlshortener, () => {
            testBackendError(remoteUrlshortener, () => {
                scope.done();
                done();
            });
        });
    });
    it('should handle a Backend Error', (done) => {
        const scope = nock(utils_1.Utils.baseUrl).post('/urlshortener/v1/url').times(2).reply(500, {
            error: {
                errors: [{
                        domain: 'global',
                        reason: 'backendError',
                        message: 'There was an error!'
                    }],
                code: 500,
                message: 'There was an error!'
            }
        });
        testBackendError(localUrlshortener, () => {
            testBackendError(remoteUrlshortener, () => {
                scope.done();
                done();
            });
        });
    });
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.transporters.js.map