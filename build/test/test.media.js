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
const fs = require("fs");
const nock = require("nock");
const path = require("path");
const pify = require("pify");
const src_1 = require("../src");
const utils_1 = require("./utils");
const boundaryPrefix = 'multipart/related; boundary=';
function testMultpart(drive) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestBody = { title: 'title', mimeType: 'text/plain' };
        const media = { body: 'hey' };
        let expectedResp = fs.readFileSync(path.join(__dirname, '../../test/fixtures/media-response.txt'), { encoding: 'utf8' });
        const res = yield drive.files.insert({ requestBody, media });
        assert.strictEqual(res.config.method.toLowerCase(), 'post');
        assert.strictEqual(res.request.path, '/upload/drive/v2/files?uploadType=multipart');
        assert.strictEqual(res.request.headers['content-type'].indexOf('multipart/related;'), 0);
        const boundary = res.request.headers['content-type'].replace(boundaryPrefix, '');
        expectedResp = expectedResp.replace(/\n/g, '\r\n')
            .replace(/\$boundary/g, boundary)
            .replace('$media', media.body)
            .replace('$resource', JSON.stringify(requestBody))
            .replace('$mimeType', 'text/plain')
            .trim();
        assert.strictEqual(expectedResp, res.data);
    });
}
function testMediaBody(drive) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestBody = { title: 'title' };
        const media = { body: 'hey' };
        let expectedResp = fs.readFileSync(path.join(__dirname, '../../test/fixtures/media-response.txt'), { encoding: 'utf8' });
        const res = yield drive.files.insert({ requestBody, media });
        assert.strictEqual(res.config.method.toLowerCase(), 'post');
        assert.strictEqual(res.config.maxContentLength, Math.pow(2, 31));
        assert.strictEqual(res.request.path, '/upload/drive/v2/files?uploadType=multipart');
        assert.strictEqual(res.request.headers['content-type'].indexOf('multipart/related;'), 0);
        const boundary = res.request.headers['content-type'].replace(boundaryPrefix, '');
        expectedResp = expectedResp.replace(/\n/g, '\r\n')
            .replace(/\$boundary/g, boundary)
            .replace('$media', media.body)
            .replace('$resource', JSON.stringify(requestBody))
            .replace('$mimeType', 'text/plain')
            .trim();
        assert.strictEqual(expectedResp, res.data);
    });
}
describe('Media', () => {
    let localDrive, remoteDrive;
    let localGmail, remoteGmail;
    before(() => __awaiter(this, void 0, void 0, function* () {
        nock.cleanAll();
        const google = new src_1.GoogleApis();
        nock.enableNetConnect();
        [remoteDrive, remoteGmail] = yield Promise.all([
            utils_1.Utils.loadApi(google, 'drive', 'v2'),
            utils_1.Utils.loadApi(google, 'gmail', 'v1')
        ]);
        nock.disableNetConnect();
    }));
    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
        const google = new src_1.GoogleApis();
        localDrive = google.drive('v2');
        localGmail = google.gmail('v1');
    });
    it('should post progress for uploads', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl)
            .post('/upload/youtube/v3/videos?part=id%2Csnippet&notifySubscribers=false&uploadType=multipart')
            .reply(200);
        const fileName = path.join(__dirname, '../../test/fixtures/mediabody.txt');
        const fileSize = (yield pify(fs.stat)(fileName)).size;
        const google = new src_1.GoogleApis();
        const youtube = google.youtube('v3');
        const progressEvents = new Array();
        yield youtube.videos.insert({
            part: 'id,snippet',
            notifySubscribers: false,
            requestBody: {
                snippet: {
                    title: 'Node.js YouTube Upload Test',
                    description: 'Testing YouTube upload via Google APIs Node.js Client'
                }
            },
            media: { body: fs.createReadStream(fileName) }
        }, {
            onUploadProgress: (evt) => {
                progressEvents.push(evt.bytesRead);
            }
        });
        assert(progressEvents.length > 0);
        assert.strictEqual(progressEvents[0], fileSize);
        scope.done();
    }));
    it('should post with uploadType=multipart if resource and media set', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/upload/drive/v2/files?uploadType=multipart')
            .times(2)
            .reply(200, { fileId: 'abc123' });
        const res = yield localDrive.files.insert({ requestBody: {}, media: { body: 'hello' } });
        assert.strictEqual(JSON.stringify(res.data), JSON.stringify({ fileId: 'abc123' }));
        const res2 = yield remoteDrive.files.insert({ requestBody: {}, media: { body: 'hello' } });
        assert.strictEqual(JSON.stringify(res2.data), JSON.stringify({ fileId: 'abc123' }));
    }));
    it('should post with uploadType=media media set but not resource', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/upload/drive/v2/files?uploadType=media')
            .times(2)
            .reply(200, { fileId: 'abc123' });
        const res = yield localDrive.files.insert({ media: { body: 'hello' } });
        assert.strictEqual(JSON.stringify(res.data), JSON.stringify({ fileId: 'abc123' }));
        const res2 = yield remoteDrive.files.insert({ media: { body: 'hello' } });
        assert.strictEqual(JSON.stringify(res2.data), JSON.stringify({ fileId: 'abc123' }));
    }));
    it('should generate a valid media upload if media is set, metadata is not set', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/upload/drive/v2/files?uploadType=media')
            .times(2)
            .reply(201, (uri, reqBody) => {
            return reqBody; // return request body as response
            // for testing purposes
        });
        const media = { body: 'hey' };
        const res = yield localDrive.files.insert({ media });
        assert.strictEqual(res.config.method.toLowerCase(), 'post');
        assert.strictEqual(res.request.path, '/upload/drive/v2/files?uploadType=media');
        assert.strictEqual(media.body, res.data);
        const res2 = yield remoteDrive.files.insert({ media });
        assert.strictEqual(res.config.method.toLowerCase(), 'post');
        assert.strictEqual(res.request.path, '/upload/drive/v2/files?uploadType=media');
        assert.strictEqual(media.body, res2.data);
    }));
    it('should generate valid multipart upload if media and metadata are both set', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/upload/drive/v2/files?uploadType=multipart')
            .times(2)
            .reply(201, (uri, reqBody) => {
            return reqBody; // return request body as response
            // for testing purposes
        });
        yield testMultpart(localDrive);
        yield testMultpart(remoteDrive);
    }));
    it('should not require parameters for insertion requests', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/upload/drive/v2/files?visibility=someValue&uploadType=media')
            .twice()
            .reply(200);
        const res = yield localDrive.files.insert({ visibility: 'someValue', media: { body: 'wat' } });
        assert.strictEqual(utils_1.Utils.getQs(res), 'visibility=someValue&uploadType=media');
        const res2 = yield remoteDrive.files.insert({ visibility: 'someValue', media: { body: 'wat' } });
        assert.strictEqual(utils_1.Utils.getQs(res2), 'visibility=someValue&uploadType=media');
    }));
    it('should not multipart upload if no media body given', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/drive/v2/files?visibility=someValue')
            .twice()
            .reply(200);
        const res = yield localDrive.files.insert({ visibility: 'someValue' });
        assert.strictEqual(utils_1.Utils.getQs(res), 'visibility=someValue');
        const res2 = yield remoteDrive.files.insert({ visibility: 'someValue' });
        assert.strictEqual(utils_1.Utils.getQs(res2), 'visibility=someValue');
    }));
    it('should set text/plain when passed a string as media body', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/upload/drive/v2/files?uploadType=multipart')
            .times(2)
            .reply(201, (uri, reqBody) => {
            return reqBody; // return request body as response for
            // testing purposes
        });
        yield testMediaBody(localDrive);
        yield testMediaBody(remoteDrive);
    }));
    it('should handle metadata-only media requests properly', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/gmail/v1/users/me/drafts')
            .times(2)
            .reply(201, (uri, reqBody) => {
            return reqBody; // return request body as response for
            // testing purposes
        });
        const requestBody = {
            message: { raw: Buffer.from('hello', 'binary').toString('base64') }
        };
        const res = yield localGmail.users.drafts.create({ userId: 'me', requestBody, media: { mimeType: 'message/rfc822' } });
        assert.strictEqual(res.request.headers['content-type'].indexOf('application/json'), 0);
        assert.strictEqual(JSON.stringify(res.data), JSON.stringify(requestBody));
        const res2 = yield remoteGmail.users.drafts.create({ userId: 'me', requestBody, media: { mimeType: 'message/rfc822' } });
        assert.strictEqual(res2.request.headers['content-type'].indexOf('application/json'), 0);
        assert.strictEqual(JSON.stringify(res2.data), JSON.stringify(requestBody));
    }));
    it('should accept readable stream as media body without metadata', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/upload/gmail/v1/users/me/drafts?uploadType=media')
            .times(2)
            .reply(201, (uri, reqBody) => {
            return reqBody; // return request body as response for
            // testing purposes
        });
        let body = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
        let expectedBody = fs.readFileSync(path.join(__dirname, '../../test/fixtures/mediabody.txt'), 'utf8');
        const res = yield localGmail.users.drafts.create({ userId: 'me', media: { mimeType: 'message/rfc822', body } });
        assert.strictEqual(res.data, expectedBody);
        body = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
        expectedBody = fs.readFileSync(path.join(__dirname, '../../test/fixtures/mediabody.txt'), 'utf8');
        const res2 = yield remoteGmail.users.drafts.create({ userId: 'me', media: { mimeType: 'message/rfc822', body } });
        assert.strictEqual(res2.data, expectedBody);
    }));
    it('should accept readable stream as media body with metadata', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/upload/gmail/v1/users/me/drafts?uploadType=multipart')
            .times(2)
            .reply(201, (uri, reqBody) => {
            return reqBody; // return request body as response for testing
            // purposes
        });
        let requestBody = {
            message: { raw: Buffer.from('hello', 'binary').toString('base64') }
        };
        let body = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
        let bodyString = fs.readFileSync(path.join(__dirname, '../../test/fixtures/mediabody.txt'), { encoding: 'utf8' });
        let media = { mimeType: 'message/rfc822', body };
        let expectedBody = fs.readFileSync(path.join(__dirname, '../../test/fixtures/media-response.txt'), { encoding: 'utf8' });
        const res = yield localGmail.users.drafts.create({ userId: 'me', requestBody, media });
        const boundary = res.request.headers['content-type'].replace(boundaryPrefix, '');
        expectedBody = expectedBody.replace(/\n/g, '\r\n')
            .replace(/\$boundary/g, boundary)
            .replace('$media', bodyString)
            .replace('$resource', JSON.stringify(requestBody))
            .replace('$mimeType', 'message/rfc822')
            .trim();
        assert.strictEqual(expectedBody, res.data);
        requestBody = {
            message: { raw: Buffer.from('hello', 'binary').toString('base64') }
        };
        body = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
        bodyString = fs.readFileSync(path.join(__dirname, '../../test/fixtures/mediabody.txt'), { encoding: 'utf8' });
        media = { mimeType: 'message/rfc822', body };
        expectedBody = fs.readFileSync(path.join(__dirname, '../../test/fixtures/media-response.txt'), { encoding: 'utf8' });
        const res2 = yield remoteGmail.users.drafts.create({ userId: 'me', requestBody, media });
        const boundary2 = res2.request.headers['content-type'].replace(boundaryPrefix, '');
        expectedBody = expectedBody.replace(/\n/g, '\r\n')
            .replace(/\$boundary/g, boundary2)
            .replace('$media', bodyString)
            .replace('$resource', JSON.stringify(requestBody))
            .replace('$mimeType', 'message/rfc822')
            .trim();
        assert.strictEqual(expectedBody, res2.data);
    }));
    it('should return err, {object}body, resp for streaming media requests', () => __awaiter(this, void 0, void 0, function* () {
        nock(utils_1.Utils.baseUrl)
            .post('/upload/gmail/v1/users/me/drafts?uploadType=multipart')
            .times(2)
            .reply(201, () => {
            return JSON.stringify({ hello: 'world' });
        });
        let requestBody = {
            message: { raw: Buffer.from('hello', 'binary').toString('base64') }
        };
        const body = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
        let media = { mimeType: 'message/rfc822', body };
        const res = yield localGmail.users.drafts.create({ userId: 'me', requestBody, media });
        assert.strictEqual(typeof res.data, 'object');
        // tslint:disable-next-line no-any
        assert.strictEqual(res.data.hello, 'world');
        assert.strictEqual(typeof res, 'object');
        requestBody = {
            message: { raw: Buffer.from('hello', 'binary').toString('base64') }
        };
        const body2 = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
        media = { mimeType: 'message/rfc822', body: body2 };
        const res2 = yield remoteGmail.users.drafts.create({ userId: 'me', requestBody, media });
        assert.strictEqual(typeof res2.data, 'object');
        // tslint:disable-next-line no-any
        assert.strictEqual(res2.data.hello, 'world');
        assert.strictEqual(typeof res2, 'object');
    }));
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.media.js.map