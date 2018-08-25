"use strict";
// Copyright 2018, Google, LLC.
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
const os = require("os");
const path = require("path");
const utils_1 = require("./../utils");
nock.disableNetConnect();
// tslint:disable: no-any
const samples = {
    download: require('../../../samples/drive/download'),
    export: require('../../../samples/drive/export'),
    list: require('../../../samples/drive/list'),
    upload: require('../../../samples/drive/upload')
};
for (const p in samples) {
    if (samples[p]) {
        samples[p].client.credentials = { access_token: 'not-a-token' };
    }
}
const someFile = path.resolve('test/fixtures/public.pem');
describe('Drive samples', () => {
    afterEach(() => {
        nock.cleanAll();
    });
    it('should download the file', () => __awaiter(this, void 0, void 0, function* () {
        const fileId = '0B7l5uajXUzaFa0x6cjJfZEkzZVE';
        const scope = nock(utils_1.Utils.baseUrl)
            .get(`/drive/v3/files/${fileId}?alt=media`)
            .replyWithFile(200, someFile);
        const filePath = yield samples.download.runSample(fileId);
        assert(fs.existsSync(filePath));
        scope.done();
    }));
    it('should download the doc', () => __awaiter(this, void 0, void 0, function* () {
        const fileId = '1ZdR3L3qP4Bkq8noWLJHSr_iBau0DNT4Kli4SxNc2YEo';
        const scope = nock(utils_1.Utils.baseUrl)
            .get(`/drive/v3/files/${fileId}/export?mimeType=application%2Fpdf`)
            .replyWithFile(200, someFile);
        yield samples.export.runSample();
        assert(fs.existsSync(`${os.tmpdir()}/resume.pdf`));
        scope.done();
    }));
    it('should list all the docs', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl).get(`/drive/v3/files?pageSize=3`).reply(200, {});
        const data = yield samples.list.runSample();
        assert(data);
        scope.done();
    }));
    it('should upload a file', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl)
            .post(`/upload/drive/v3/files?uploadType=multipart`)
            .reply(200, {});
        const data = yield samples.upload.runSample(someFile);
        assert(data);
        scope.done();
    }));
});
//# sourceMappingURL=test.samples.drive.js.map