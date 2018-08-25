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
const path = require("path");
const src_1 = require("../src");
const utils_1 = require("./utils");
function testSingleRequest(urlshortener) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestBody = { longUrl: 'http://someurl...' };
        const reqPath = '/urlshortener/v1/url';
        nock(utils_1.Utils.baseUrl).post(reqPath, requestBody).reply(200);
        const res = yield urlshortener.url.insert({ requestBody });
        assert.strictEqual(res.config.method.toLowerCase(), 'post');
    });
}
function testParams(urlshortener) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = { shortUrl: 'a' };
        nock(utils_1.Utils.baseUrl).get('/urlshortener/v1/url?shortUrl=a').reply(200);
        const res = yield urlshortener.url.get(params);
        assert.strictEqual(utils_1.Utils.getQs(res), 'shortUrl=a');
        assert.strictEqual(res.config.method.toLowerCase(), 'get');
    });
}
function testInsert(urlshortener) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestBody = { longUrl: 'http://google.com/' };
        nock(utils_1.Utils.baseUrl).post('/resource').reply(200);
        const res = yield urlshortener.url.insert({ requestBody });
        assert.notEqual(res.data, null);
        assert.notEqual(res.data.kind, null);
        assert.notEqual(res.data.id, null);
        assert.strictEqual(res.data.longUrl, 'http://google.com/');
        return res;
    });
}
describe('Urlshortener', () => {
    let localUrlshortener;
    let remoteUrlshortener;
    before(() => __awaiter(this, void 0, void 0, function* () {
        nock.cleanAll();
        const google = new src_1.GoogleApis();
        nock.enableNetConnect();
        remoteUrlshortener = yield utils_1.Utils.loadApi(google, 'urlshortener', 'v1');
        nock.disableNetConnect();
    }));
    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
        const google = new src_1.GoogleApis();
        localUrlshortener = google.urlshortener('v1');
    });
    it('should generate a valid payload for single requests', () => __awaiter(this, void 0, void 0, function* () {
        yield testSingleRequest(localUrlshortener);
        yield testSingleRequest(remoteUrlshortener);
    }));
    it('should generate valid payload if any params are given', () => __awaiter(this, void 0, void 0, function* () {
        yield testParams(localUrlshortener);
        yield testParams(remoteUrlshortener);
    }));
    it('should return a single response object for single requests', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl, { allowUnmocked: true })
            .post('/urlshortener/v1/url')
            .times(2)
            .replyWithFile(200, path.join(__dirname, '../../test/fixtures/urlshort-insert-res.json'));
        yield testInsert(localUrlshortener);
        yield testInsert(remoteUrlshortener);
    }));
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.urlshortener.v1.js.map