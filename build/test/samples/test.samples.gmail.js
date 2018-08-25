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
const utils_1 = require("./../utils");
nock.disableNetConnect();
// tslint:disable: no-any
const samples = {
    list: require('../../../samples/gmail/list'),
    labels: require('../../../samples/gmail/labels'),
    watch: require('../../../samples/gmail/watch'),
    send: require('../../../samples/gmail/send'),
};
for (const p in samples) {
    if (samples[p]) {
        samples[p].client.credentials = { access_token: 'not-a-token' };
    }
}
describe('gmail samples', () => {
    afterEach(() => {
        nock.cleanAll();
    });
    it('should list emails', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl).get(`/gmail/v1/users/me/messages`).reply(200, {});
        const data = yield samples.list.runSample();
        assert(data);
        scope.done();
    }));
    it('should add a label', () => __awaiter(this, void 0, void 0, function* () {
        const messageId = '12345';
        const labelId = 'abcde';
        const scope = nock(utils_1.Utils.baseUrl)
            .post(`/gmail/v1/users/me/messages/${messageId}/modify`)
            .reply(200, {});
        const data = yield samples.labels.runSample('add', messageId, labelId);
        assert(data);
        scope.done();
    }));
    it('should add a user watch', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl).post(`/gmail/v1/users/me/watch`).reply(200, {
            data: true
        });
        const data = yield samples.watch.runSample();
        console.log(data);
        assert(data);
        scope.done();
    }));
    it('should send an email', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock(utils_1.Utils.baseUrl)
            .post('/gmail/v1/users/me/messages/send')
            .reply(200, {});
        const data = yield samples.send.runSample();
        assert(data);
        scope.done();
    }));
});
//# sourceMappingURL=test.samples.gmail.js.map