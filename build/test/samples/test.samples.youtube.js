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
const nock = require("nock");
const path = require("path");
const utils_1 = require("./../utils");
nock.disableNetConnect();
// tslint:disable: no-any
const samples = {
    upload: require('../../../samples/youtube/upload')
};
for (const p in samples) {
    if (samples[p]) {
        samples[p].client.credentials = { access_token: 'not-a-token' };
    }
}
const someFile = path.resolve('test/fixtures/public.pem');
describe('YouTube samples', () => {
    afterEach(() => {
        nock.cleanAll();
    });
    it('should upload a video', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl)
            .post(`/upload/youtube/v3/videos?part=id%2Csnippet%2Cstatus&notifySubscribers=false&uploadType=multipart`)
            .reply(200, { kind: 'youtube#video' });
        const data = yield samples.upload.runSample(someFile);
        assert(data);
        assert.strictEqual(data.kind, 'youtube#video');
        scope.done();
    }));
});
//# sourceMappingURL=test.samples.youtube.js.map