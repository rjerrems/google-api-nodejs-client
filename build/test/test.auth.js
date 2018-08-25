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
const assertRejects = require('assert-rejects');
const googleapis = new src_1.GoogleApis();
describe('JWT client', () => {
    it('should expose the default auth module', () => {
        assert(googleapis.auth.getApplicationDefault);
    });
    it('should create a jwt through googleapis', () => {
        const jwt = new googleapis.auth.JWT('someone@somewhere.com', 'file1', 'key1', 'scope1', 'subject1');
        assert.strictEqual(jwt.email, 'someone@somewhere.com');
        assert.strictEqual(jwt.keyFile, 'file1');
        assert.strictEqual(jwt.key, 'key1');
        assert.strictEqual(jwt.scopes, 'scope1');
        assert.strictEqual(jwt.subject, 'subject1');
    });
    it('should create scoped JWT', () => {
        const jwt = new googleapis.auth.JWT('someone@somewhere.com', 'file1', 'key1', undefined, 'subject1');
        assert.strictEqual(jwt.scopes, undefined);
        assert.strictEqual(jwt.createScopedRequired(), true);
        // Create a scoped version of the token now.
        const jwt2 = jwt.createScoped('scope1');
        // The original token should be unchanged.
        assert.strictEqual(jwt.scopes, undefined);
        assert.strictEqual(jwt.createScopedRequired(), true);
        // The new token should have scopes.
        assert.strictEqual(jwt2.scopes, 'scope1');
        assert.strictEqual(jwt2.createScopedRequired(), false);
    });
});
describe('Compute client', () => {
    it('should create a computeclient', () => {
        const compute = new googleapis.auth.Compute();
        assert.strictEqual(compute.createScopedRequired(), false);
    });
});
function testNoTokens(urlshortener, client) {
    return __awaiter(this, void 0, void 0, function* () {
        yield assertRejects(urlshortener.url.get({ shortUrl: '123', auth: client }), /No access, refresh token or API key is set./);
    });
}
function testNoBearer(urlshortener, oauth2client) {
    return __awaiter(this, void 0, void 0, function* () {
        yield urlshortener.url.list({ auth: oauth2client });
        assert.strictEqual(oauth2client.credentials.token_type, 'Bearer');
    });
}
function testExpired(drive, oauth2client, now) {
    return __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/wat').reply(200);
        yield drive.files.get({ fileId: 'wat', auth: oauth2client });
        const expiryDate = oauth2client.credentials.expiry_date;
        assert.notEqual(expiryDate, undefined);
        if (!expiryDate)
            return;
        assert(expiryDate > now);
        assert(expiryDate < now + 5000);
        assert.strictEqual(oauth2client.credentials.refresh_token, 'abc');
        assert.strictEqual(oauth2client.credentials.access_token, 'abc123');
    });
}
function testNoAccessToken(drive, oauth2client, now) {
    return __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/wat').reply(200);
        yield drive.files.get({ fileId: 'wat', auth: oauth2client });
        const expiryDate = oauth2client.credentials.expiry_date;
        assert.notEqual(expiryDate, undefined);
        assert(expiryDate > now);
        assert(expiryDate < now + 4000);
        assert.strictEqual(oauth2client.credentials.refresh_token, 'abc');
        assert.strictEqual(oauth2client.credentials.access_token, 'abc123');
    });
}
describe('OAuth2 client', () => {
    let localDrive, remoteDrive;
    let localUrlshortener, remoteUrlshortener;
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
        localDrive = google.drive('v2');
        localUrlshortener = google.urlshortener('v1');
    });
    const CLIENT_ID = 'CLIENT_ID';
    const CLIENT_SECRET = 'CLIENT_SECRET';
    const REDIRECT_URI = 'REDIRECT';
    it('should return err if no access or refresh token is set', () => __awaiter(this, void 0, void 0, function* () {
        const oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        yield testNoTokens(localUrlshortener, oauth2client);
        yield testNoTokens(remoteUrlshortener, oauth2client);
    }));
    it('should not error if only refresh token is set', () => {
        const oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oauth2client.credentials = { refresh_token: 'refresh_token' };
        assert.doesNotThrow(() => {
            const options = { auth: oauth2client, shortUrl: '...' };
            localUrlshortener.url.get(options, utils_1.Utils.noop);
            remoteUrlshortener.url.get(options, utils_1.Utils.noop);
        });
    });
    it('should set access token type to Bearer if none is set', () => __awaiter(this, void 0, void 0, function* () {
        const oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oauth2client.credentials = { access_token: 'foo', refresh_token: '' };
        const scope = nock(utils_1.Utils.baseUrl)
            .get('/urlshortener/v1/url/history')
            .times(2)
            .reply(200);
        yield testNoBearer(localUrlshortener, oauth2client);
        yield testNoBearer(remoteUrlshortener, oauth2client);
    }));
    it('should refresh if access token is expired', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock('https://www.googleapis.com')
            .post('/oauth2/v4/token')
            .times(2)
            .reply(200, { access_token: 'abc123', expires_in: 1 });
        let oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        let now = new Date().getTime();
        let twoSecondsAgo = now - 2000;
        oauth2client.credentials = {
            refresh_token: 'abc',
            expiry_date: twoSecondsAgo
        };
        yield testExpired(localDrive, oauth2client, now);
        oauth2client =
            new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        now = new Date().getTime();
        twoSecondsAgo = now - 2000;
        oauth2client.credentials = {
            refresh_token: 'abc',
            expiry_date: twoSecondsAgo
        };
        yield testExpired(remoteDrive, oauth2client, now);
    }));
    it('should make request if access token not expired', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock('https://www.googleapis.com')
            .post('/oauth2/v4/token')
            .times(2)
            .reply(200, { access_token: 'abc123', expires_in: 10000 });
        let oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        let now = (new Date()).getTime();
        let tenMinutesFromNow = now + 1000 * 60 * 10;
        oauth2client.credentials = {
            access_token: 'abc123',
            refresh_token: 'abc',
            expiry_date: tenMinutesFromNow
        };
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/wat').reply(200);
        yield localDrive.files.get({ fileId: 'wat', auth: oauth2client });
        assert.strictEqual(JSON.stringify(oauth2client.credentials), JSON.stringify({
            access_token: 'abc123',
            refresh_token: 'abc',
            expiry_date: tenMinutesFromNow,
            token_type: 'Bearer'
        }));
        assert.throws(() => {
            scope.done();
        }, 'AssertionError');
        oauth2client =
            new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        now = (new Date()).getTime();
        tenMinutesFromNow = now + 1000 * 60 * 10;
        oauth2client.credentials = {
            access_token: 'abc123',
            refresh_token: 'abc',
            expiry_date: tenMinutesFromNow
        };
        nock(utils_1.Utils.baseUrl).get('/drive/v2/files/wat').reply(200);
        yield remoteDrive.files.get({ fileId: 'wat', auth: oauth2client });
        assert.strictEqual(JSON.stringify(oauth2client.credentials), JSON.stringify({
            access_token: 'abc123',
            refresh_token: 'abc',
            expiry_date: tenMinutesFromNow,
            token_type: 'Bearer'
        }));
        assert.throws(() => {
            scope.done();
        }, 'AssertionError');
    }));
    it('should refresh if have refresh token but no access token', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock('https://www.googleapis.com')
            .post('/oauth2/v4/token')
            .times(2)
            .reply(200, { access_token: 'abc123', expires_in: 1 });
        const oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        let now = (new Date()).getTime();
        oauth2client.credentials = { refresh_token: 'abc' };
        yield testNoAccessToken(localDrive, oauth2client, now);
        now = (new Date()).getTime();
        oauth2client.credentials = { refresh_token: 'abc' };
        yield testNoAccessToken(remoteDrive, oauth2client, now);
    }));
    describe('revokeCredentials()', () => {
        it('should revoke credentials if access token present', () => __awaiter(this, void 0, void 0, function* () {
            const scope = nock('https://accounts.google.com')
                .get('/o/oauth2/revoke?token=abc')
                .reply(200, { success: true });
            const oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            oauth2client.credentials = { access_token: 'abc', refresh_token: 'abc' };
            const res = yield oauth2client.revokeCredentials();
            scope.done();
            assert.strictEqual(res.data.success, true);
            assert.deepStrictEqual(oauth2client.credentials, {});
        }));
        it('should clear credentials and return error if no access token to revoke', () => __awaiter(this, void 0, void 0, function* () {
            const oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            oauth2client.credentials = { refresh_token: 'abc' };
            yield assertRejects(oauth2client.revokeCredentials(), /Error: No access token to revoke./);
            assert.deepStrictEqual(oauth2client.credentials, {});
        }));
    });
    describe('getToken()', () => {
        it('should return expiry_date', () => __awaiter(this, void 0, void 0, function* () {
            const now = (new Date()).getTime();
            const scope = nock('https://www.googleapis.com')
                .post('/oauth2/v4/token')
                .reply(200, { access_token: 'abc', refresh_token: '123', expires_in: 10 });
            const oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            const res = yield oauth2client.getToken('code here');
            assert(res.tokens.expiry_date >= now + (10 * 1000));
            assert(res.tokens.expiry_date <= now + (15 * 1000));
        }));
    });
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.auth.js.map