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
describe('Path params', () => {
    let localDrive;
    let remoteDrive;
    before(() => __awaiter(this, void 0, void 0, function* () {
        nock.cleanAll();
        const google = new src_1.GoogleApis();
        nock.enableNetConnect();
        remoteDrive = yield utils_1.Utils.loadApi(google, 'drive', 'v2');
        nock.disableNetConnect();
    }));
    beforeEach(() => {
        nock.cleanAll();
        nock.disableNetConnect();
        const google = new src_1.GoogleApis();
        localDrive = google.drive('v2');
    });
    it('should not throw error if not included and required', (done) => {
        assert.doesNotThrow(() => {
            localDrive.files.get({}, utils_1.Utils.noop);
            remoteDrive.files.get({}, utils_1.Utils.noop);
            done();
        });
    });
    it('should return an err object if not included and required', (done) => {
        localDrive.files.get({}, (err) => {
            assert.notEqual(err, null);
            remoteDrive.files.get({}, (e) => {
                assert.notEqual(e, null);
                done();
            });
        });
    });
    it('should be mentioned in err.message when missing', (done) => {
        localDrive.files.get({}, (err) => {
            assert.notEqual(err.message.indexOf('fileId'), -1, 'Missing param not mentioned in error');
            remoteDrive.files.get({}, (e) => {
                assert.notEqual(e.message.indexOf('fileId'), -1, 'Missing param not mentioned in error');
                done();
            });
        });
    });
    it('should return null response object if not included and required', (done) => {
        localDrive.files.get({}, (err, resp) => {
            assert(err);
            assert.strictEqual(resp, undefined);
            remoteDrive.files.get({}, (e, resp2) => {
                assert(e);
                assert.strictEqual(resp2, undefined);
                done();
            });
        });
    });
    it('should return null request object if not included and required', () => {
        let req = localDrive.files.get({}, utils_1.Utils.noop);
        assert.strictEqual(req, undefined);
        req = remoteDrive.files.get({}, utils_1.Utils.noop);
        assert.strictEqual(req, undefined);
    });
    it('should return null request object if not included and required and no callback', () => {
        let req = localDrive.files.get({}, utils_1.Utils.noop);
        assert.strictEqual(req, undefined);
        req = remoteDrive.files.get({}, utils_1.Utils.noop);
        assert.strictEqual(req, undefined);
    });
    it('should not be modifiable directly', () => {
        const options = { fileId: '123' };
        assert.doesNotThrow(() => {
            // should not modify options object
            localDrive.files.get(options, utils_1.Utils.noop);
            localDrive.files.get(options, utils_1.Utils.noop);
            remoteDrive.files.get(options, utils_1.Utils.noop);
            remoteDrive.files.get(options, utils_1.Utils.noop);
        });
    });
    it('should be put in URL of path', (done) => {
        const p = '/drive/v2/files/abc123';
        nock(utils_1.Utils.baseUrl).get(p).reply(200);
        localDrive.files.get({ fileId: 'abc123' }, (err, res) => {
            if (err) {
                return done(err);
            }
            assert.strictEqual(res.config.url, utils_1.Utils.baseUrl + p);
            nock(utils_1.Utils.baseUrl).get(p).reply(200);
            remoteDrive.files.get({ fileId: 'abc123' }, (err2, res2) => {
                if (err2) {
                    return done(err2);
                }
                assert.strictEqual(res2.config.url, utils_1.Utils.baseUrl + p);
                done();
            });
        });
    });
    it('should be put in URL of pathname', (done) => {
        const p = '/drive/v2/files/123abc';
        nock(utils_1.Utils.baseUrl).get(p).reply(200);
        localDrive.files.get({ fileId: '123abc' }, (err, res) => {
            if (err) {
                return done(err);
            }
            assert.strictEqual(utils_1.Utils.getPath(res), p);
            nock(utils_1.Utils.baseUrl).get(p).reply(200);
            remoteDrive.files.get({ fileId: '123abc' }, (err2, res2) => {
                if (err2) {
                    return done(err2);
                }
                assert.strictEqual(utils_1.Utils.getPath(res), p);
                done();
            });
        });
    });
    it('should be urlencoded', done => {
        const p = `/drive/v2/files/${encodeURIComponent('p@ram')}`;
        nock(utils_1.Utils.baseUrl).get(p).reply(200);
        localDrive.files.get({ fileId: 'p@ram' }, (err, res) => {
            if (err) {
                return done(err);
            }
            const parm = utils_1.Utils.getPath(res).split('/').pop();
            assert.strictEqual(decodeURIComponent(parm), 'p@ram');
            nock(utils_1.Utils.baseUrl).get(p).reply(200);
            remoteDrive.files.get({ fileId: 'p@ram' }, (err2, res2) => {
                if (err2) {
                    return done(err2);
                }
                const parm = utils_1.Utils.getPath(res).split('/').pop();
                assert.strictEqual(decodeURIComponent(parm), 'p@ram');
                done();
            });
        });
    });
    it('should keep query params null if only path params', (done) => {
        const p = '/drive/v2/files/123abc';
        nock(utils_1.Utils.baseUrl).get(p).reply(200);
        localDrive.files.get({ fileId: '123abc' }, (err, res) => {
            if (err) {
                return done(err);
            }
            assert.strictEqual(utils_1.Utils.getQs(res), null);
            nock(utils_1.Utils.baseUrl).get(p).reply(200);
            remoteDrive.files.get({ fileId: '123abc' }, (err2, res2) => {
                if (err2) {
                    return done(err2);
                }
                assert.strictEqual(utils_1.Utils.getQs(res2), null);
                done();
            });
        });
    });
    it('should keep query params as is', (done) => {
        const p = '/drive/v2/files/123abc?hello=world';
        nock(utils_1.Utils.baseUrl).get(p).reply(200);
        localDrive.files.get({ fileId: '123abc', hello: 'world' }, (err, res) => {
            if (err) {
                return done(err);
            }
            assert.strictEqual(utils_1.Utils.getQs(res), 'hello=world');
            nock(utils_1.Utils.baseUrl).get(p).reply(200);
            remoteDrive.files.get({ fileId: '123abc', hello: 'world' }, (err2, res2) => {
                if (err2) {
                    return done(err2);
                }
                assert.strictEqual(utils_1.Utils.getQs(res), 'hello=world');
                done();
            });
        });
    });
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.path.js.map