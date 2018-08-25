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
const googleapis = new src_1.GoogleApis();
describe('drive:v2', () => {
    let localDrive, remoteDrive;
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
    it('should exist', (done) => {
        assert.notEqual(typeof googleapis.drive, null);
        done();
    });
    it('should be a function', (done) => {
        assert.strictEqual(typeof googleapis.drive, 'function');
        done();
    });
    it('should create a drive object', (done) => {
        assert.notEqual(typeof localDrive, 'undefined');
        assert.notEqual(typeof remoteDrive, 'undefined');
        done();
    });
    it('should be frozen (immutable)', (done) => {
        assert.strictEqual(Object.isFrozen(localDrive), true);
        assert.strictEqual(Object.isFrozen(remoteDrive), true);
        done();
    });
    describe('.files', () => {
        it('should exist', (done) => {
            assert.notEqual(typeof localDrive.files, 'undefined');
            assert.notEqual(typeof remoteDrive.files, 'undefined');
            done();
        });
        it('should be an object', (done) => {
            assert.strictEqual(typeof localDrive.files, 'object');
            assert.strictEqual(typeof remoteDrive.files, 'object');
            done();
        });
        describe('.insert', () => {
            it('should exist', (done) => {
                assert.notEqual(typeof localDrive.files.insert, 'undefined');
                assert.notEqual(typeof remoteDrive.files.insert, 'undefined');
                done();
            });
            it('should be a function', (done) => {
                assert.strictEqual(typeof localDrive.files.insert, 'function');
                assert.strictEqual(typeof remoteDrive.files.insert, 'function');
                done();
            });
            it('should not return a Request object', (done) => {
                let req = localDrive.files.insert(utils_1.Utils.noop);
                assert.strictEqual(req, undefined);
                req = remoteDrive.files.insert(utils_1.Utils.noop);
                assert.strictEqual(req, undefined);
                done();
            });
        });
        describe('.get', () => {
            it('should exist', () => {
                assert.notEqual(typeof localDrive.files.get, 'undefined');
                assert.notEqual(typeof remoteDrive.files.get, 'undefined');
            });
            it('should be a function', () => {
                assert.strictEqual(typeof localDrive.files.get, 'function');
                assert.strictEqual(typeof remoteDrive.files.get, 'function');
            });
            it('should not return a Request object', () => {
                let req = localDrive.files.get({ fileId: '123' }, utils_1.Utils.noop);
                assert.strictEqual(req, undefined);
                req = remoteDrive.files.get({ fileId: '123' }, utils_1.Utils.noop);
                assert.strictEqual(req, undefined);
            });
        });
    });
    describe('._options', () => {
        it('should exist', () => {
            assert.notEqual(typeof localDrive._options, 'undefined');
            assert.notEqual(typeof remoteDrive._options, 'undefined');
        });
        it('should be an object', () => {
            assert.strictEqual(typeof localDrive._options, 'object');
            assert.strictEqual(typeof remoteDrive._options, 'object');
        });
    });
    describe('.files.list()', () => {
        it('should not return missing param error', () => __awaiter(this, void 0, void 0, function* () {
            nock(utils_1.Utils.baseUrl).get('/drive/v2/files?q=hello').times(2).reply(200);
            yield localDrive.files.list({ q: 'hello' });
            yield remoteDrive.files.list({ q: 'hello' });
        }));
    });
    after(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.drive.v2.js.map