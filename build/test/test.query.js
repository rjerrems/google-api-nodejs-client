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
describe('Query params', () => {
    let localCompute;
    let remoteCompute;
    let localDrive;
    let remoteDrive;
    let localGmail;
    let remoteGmail;
    before(() => __awaiter(this, void 0, void 0, function* () {
        nock.cleanAll();
        const google = new src_1.GoogleApis();
        nock.enableNetConnect();
        [remoteCompute, remoteDrive, remoteGmail] = yield Promise.all([
            utils_1.Utils.loadApi(google, 'compute', 'v1'),
            utils_1.Utils.loadApi(google, 'drive', 'v2'), utils_1.Utils.loadApi(google, 'gmail', 'v1')
        ]);
        nock.disableNetConnect();
    }));
    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
        const google = new src_1.GoogleApis();
        localCompute = google.compute('v1');
        localDrive = google.drive('v2');
        localGmail = google.gmail('v1');
    });
    it('should not append ? with no query parameters', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/ID').reply(200);
        const res = yield localDrive.files.get({ fileId: 'ID' });
        assert.strictEqual(-1, res.config.url.indexOf('?'));
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/ID').reply(200);
        const res2 = yield remoteDrive.files.get({ fileId: 'ID' });
        assert.strictEqual(-1, res2.config.url.indexOf('?'));
    }));
    it('should be null if no object passed', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files').reply(200);
        const res = yield localDrive.files.list();
        assert.strictEqual(utils_1.Utils.getQs(res), null);
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files').reply(200);
        const res2 = yield remoteDrive.files.list();
        assert.strictEqual(utils_1.Utils.getQs(res2), null);
    }));
    it('should be null if params passed are in path', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123').reply(200);
        const res = yield localDrive.files.get({ fileId: '123' });
        assert.strictEqual(utils_1.Utils.getQs(res), null);
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123').reply(200);
        const res2 = yield remoteDrive.files.get({ fileId: '123' });
        assert.strictEqual(utils_1.Utils.getQs(res), null);
    }));
    it('should be set if params passed are optional query params', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .get('/drive/v2/files/123?updateViewedDate=true')
            .reply(200);
        const res = yield localDrive.files.get({ fileId: '123', updateViewedDate: true });
        assert.strictEqual(utils_1.Utils.getQs(res), 'updateViewedDate=true');
        nock(utils_1.Utils.baseUrl)
            .get('/drive/v2/files/123?updateViewedDate=true')
            .reply(200);
        const res2 = yield remoteDrive.files.get({ fileId: '123', updateViewedDate: true });
        assert.strictEqual(utils_1.Utils.getQs(res2), 'updateViewedDate=true');
    }));
    it('should be set if params passed are unknown params', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?madeThisUp=hello').reply(200);
        const res = yield localDrive.files.get({ fileId: '123', madeThisUp: 'hello' });
        assert.strictEqual(utils_1.Utils.getQs(res), 'madeThisUp=hello');
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?madeThisUp=hello').reply(200);
        const res2 = yield remoteDrive.files.get({ fileId: '123', madeThisUp: 'hello' });
        assert.strictEqual(utils_1.Utils.getQs(res2), 'madeThisUp=hello');
    }));
    it('should be set if params passed are aliased names', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?resource=hello').reply(200);
        const res = yield localDrive.files.get({ fileId: '123', resource_: 'hello' });
        assert.strictEqual(utils_1.Utils.getQs(res), 'resource=hello');
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?resource=hello').reply(200);
        const res2 = yield remoteDrive.files.get({ fileId: '123', resource_: 'hello' });
        assert.strictEqual(utils_1.Utils.getQs(res2), 'resource=hello');
    }));
    it('should be set if params passed are falsy', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/compute/v1/projects//zones//instances//setDiskAutoDelete?autoDelete=false&deviceName=')
            .reply(200);
        const res = yield localCompute.instances.setDiskAutoDelete({
            project: '',
            zone: '',
            instance: '',
            autoDelete: false,
            deviceName: ''
        });
        assert.strictEqual(utils_1.Utils.getQs(res), 'autoDelete=false&deviceName=');
        nock(utils_1.Utils.baseUrl)
            .post('/compute/v1/projects//zones//instances//setDiskAutoDelete?autoDelete=false&deviceName=')
            .reply(200);
        const res2 = yield remoteCompute.instances.setDiskAutoDelete({
            project: '',
            zone: '',
            instance: '',
            autoDelete: false,
            deviceName: ''
        });
        assert.strictEqual(utils_1.Utils.getQs(res2), 'autoDelete=false&deviceName=');
        nock(utils_1.Utils.baseUrl)
            .post('/compute/v1/projects//zones//instanceGroupManagers//resize?size=0')
            .reply(200);
        const res3 = yield localCompute.instanceGroupManagers.resize({ project: '', zone: '', instanceGroupManager: '', size: 0 });
        assert.strictEqual(utils_1.Utils.getQs(res3), 'size=0');
        nock(utils_1.Utils.baseUrl)
            .post('/compute/v1/projects//zones//instanceGroupManagers//resize?size=0')
            .reply(200);
        const res4 = yield remoteCompute.instanceGroupManagers.resize({ project: '', zone: '', instanceGroupManager: '', size: 0 });
        assert.strictEqual(utils_1.Utils.getQs(res4), 'size=0');
    }));
    it('should chain together with & in order', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .get('/drive/v2/files/123?madeThisUp=hello&thisToo=world')
            .reply(200);
        const res = yield localDrive.files.get({ fileId: '123', madeThisUp: 'hello', thisToo: 'world' });
        assert.strictEqual(utils_1.Utils.getQs(res), 'madeThisUp=hello&thisToo=world');
        nock(utils_1.Utils.baseUrl)
            .get('/drive/v2/files/123?madeThisUp=hello&thisToo=world')
            .reply(200);
        const res2 = yield remoteDrive.files.get({ fileId: '123', madeThisUp: 'hello', thisToo: 'world' });
        assert.strictEqual(utils_1.Utils.getQs(res2), 'madeThisUp=hello&thisToo=world');
    }));
    it('should not include auth if auth is an OAuth2Client object', () => __awaiter(this, void 0, void 0, function* () {
        const oauth2client = new src_1.google.auth.OAuth2('CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI');
        oauth2client.credentials = { access_token: 'abc123' };
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123').reply(200);
        const res = yield localDrive.files.get({ fileId: '123', auth: oauth2client });
        assert.strictEqual(utils_1.Utils.getQs(res), null);
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123').reply(200);
        const res2 = yield remoteDrive.files.get({ fileId: '123', auth: oauth2client });
        assert.strictEqual(utils_1.Utils.getQs(res2), null);
    }));
    it('should handle multi-value query params properly', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .get('/gmail/v1/users/me/messages/abc123?metadataHeaders=To&metadataHeaders=Date')
            .reply(200);
        const res = yield localGmail.users.messages.get({ userId: 'me', id: 'abc123', metadataHeaders: ['To', 'Date'] });
        assert.strictEqual(utils_1.Utils.getQs(res), 'metadataHeaders=To&metadataHeaders=Date');
        nock(utils_1.Utils.baseUrl)
            .get('/gmail/v1/users/me/messages/abc123?metadataHeaders=To&metadataHeaders=Date')
            .reply(200);
        const res2 = yield remoteGmail.users.messages.get({ userId: 'me', id: 'abc123', metadataHeaders: ['To', 'Date'] });
        assert.strictEqual(utils_1.Utils.getQs(res2), 'metadataHeaders=To&metadataHeaders=Date');
    }));
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.query.js.map