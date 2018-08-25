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
function testGet(drive) {
    return __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?key=APIKEY').reply(200);
        const res = yield drive.files.get({ fileId: '123', auth: 'APIKEY' });
        assert.strictEqual(utils_1.Utils.getQs(res), 'key=APIKEY');
    });
}
function testParams2(drive) {
    return __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?key=API%20KEY').reply(200);
        const res = yield drive.files.get({ fileId: '123', auth: 'API KEY' });
        assert.strictEqual(utils_1.Utils.getQs(res), 'key=API%20KEY');
    });
}
function testKeyParam(drive) {
    return __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?key=abc123').reply(200);
        const res = yield drive.files.get({ fileId: '123', auth: 'API KEY', key: 'abc123' });
        assert.strictEqual(utils_1.Utils.getQs(res), 'key=abc123');
    });
}
function testAuthKey(urlshortener) {
    return __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .get('/urlshortener/v1/url/history?key=YOUR%20API%20KEY')
            .reply(200);
        const res = yield urlshortener.url.list({ auth: 'YOUR API KEY' });
        assert.strictEqual(utils_1.Utils.getQs(res).indexOf('key=YOUR%20API%20KEY') > -1, true);
    });
}
describe('API key', () => {
    let localDrive;
    let remoteDrive;
    let localUrlshortener;
    let remoteUrlshortener;
    let authClient;
    before(() => __awaiter(this, void 0, void 0, function* () {
        nock.cleanAll();
        const google = new src_1.GoogleApis();
        nock.enableNetConnect();
        [remoteDrive, remoteUrlshortener] = yield Promise.all([
            utils_1.Utils.loadApi(google, 'drive', 'v2'),
            utils_1.Utils.loadApi(google, 'urlshortener', 'v1')
        ]);
        nock.disableNetConnect();
    }));
    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
        const google = new src_1.GoogleApis();
        const OAuth2 = google.auth.OAuth2;
        authClient = new OAuth2('CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URL');
        authClient.credentials = { access_token: 'abc123' };
        localDrive = google.drive('v2');
        localUrlshortener = google.urlshortener('v1');
    });
    it('should include auth APIKEY as key=<APIKEY>', () => __awaiter(this, void 0, void 0, function* () {
        yield testGet(localDrive);
        yield testGet(remoteDrive);
    }));
    it('should properly escape params E.g. API KEY to API%20KEY', () => __awaiter(this, void 0, void 0, function* () {
        yield testParams2(localDrive);
        yield testParams2(remoteDrive);
    }));
    it('should use key param over auth apikey param if both provided', () => __awaiter(this, void 0, void 0, function* () {
        yield testKeyParam(localDrive);
        yield testKeyParam(remoteDrive);
    }));
    it('should set API key parameter if it is present', () => __awaiter(this, void 0, void 0, function* () {
        yield testAuthKey(localUrlshortener);
        yield testAuthKey(remoteUrlshortener);
    }));
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.apikey.js.map