/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { AxiosPromise } from 'axios';
import { Compute, JWT, OAuth2Client, UserRefreshClient } from 'google-auth-library';
import { BodyResponseCallback, GlobalOptions, GoogleConfigurable, MethodOptions } from 'googleapis-common';
export declare namespace iamcredentials_v1 {
    interface Options extends GlobalOptions {
        version: 'v1';
    }
    /**
     * IAM Service Account Credentials API
     *
     * IAM Service Account Credentials API
     *
     * @example
     * const {google} = require('googleapis');
     * const iamcredentials = google.iamcredentials('v1');
     *
     * @namespace iamcredentials
     * @type {Function}
     * @version v1
     * @variation v1
     * @param {object=} options Options for Iamcredentials
     */
    class Iamcredentials {
        _options: GlobalOptions;
        google?: GoogleConfigurable;
        root: this;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
        getRoot(): this;
    }
    interface Schema$GenerateAccessTokenRequest {
        /**
         * The sequence of service accounts in a delegation chain. Each service
         * account must be granted the `roles/iam.serviceAccountTokenCreator` role
         * on its next service account in the chain. The last service account in the
         * chain must be granted the `roles/iam.serviceAccountTokenCreator` role on
         * the service account that is specified in the `name` field of the request.
         * The delegates must have the following format:
         * `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`
         */
        delegates?: string[];
        /**
         * The desired lifetime duration of the access token in seconds. Must be set
         * to a value less than or equal to 3600 (1 hour). If a value is not
         * specified, the token&#39;s lifetime will be set to a default value of one
         * hour.
         */
        lifetime?: string;
        /**
         * Code to identify the scopes to be included in the OAuth 2.0 access token.
         * See https://developers.google.com/identity/protocols/googlescopes for
         * more information. At least one value required.
         */
        scope?: string[];
    }
    interface Schema$GenerateAccessTokenResponse {
        /**
         * The OAuth 2.0 access token.
         */
        accessToken?: string;
        /**
         * Token expiration time. The expiration time is always set.
         */
        expireTime?: string;
    }
    interface Schema$GenerateIdTokenRequest {
        /**
         * The audience for the token, such as the API or account that this token
         * grants access to.
         */
        audience?: string;
        /**
         * The sequence of service accounts in a delegation chain. Each service
         * account must be granted the `roles/iam.serviceAccountTokenCreator` role
         * on its next service account in the chain. The last service account in the
         * chain must be granted the `roles/iam.serviceAccountTokenCreator` role on
         * the service account that is specified in the `name` field of the request.
         * The delegates must have the following format:
         * `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`
         */
        delegates?: string[];
        /**
         * Include the service account email in the token. If set to `true`, the
         * token will contain `email` and `email_verified` claims.
         */
        includeEmail?: boolean;
    }
    interface Schema$GenerateIdTokenResponse {
        /**
         * The OpenId Connect ID token.
         */
        token?: string;
    }
    interface Schema$SignBlobRequest {
        /**
         * The sequence of service accounts in a delegation chain. Each service
         * account must be granted the `roles/iam.serviceAccountTokenCreator` role
         * on its next service account in the chain. The last service account in the
         * chain must be granted the `roles/iam.serviceAccountTokenCreator` role on
         * the service account that is specified in the `name` field of the request.
         * The delegates must have the following format:
         * `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`
         */
        delegates?: string[];
        /**
         * The bytes to sign.
         */
        payload?: string;
    }
    interface Schema$SignBlobResponse {
        /**
         * The ID of the key used to sign the blob.
         */
        keyId?: string;
        /**
         * The signed blob.
         */
        signedBlob?: string;
    }
    interface Schema$SignJwtRequest {
        /**
         * The sequence of service accounts in a delegation chain. Each service
         * account must be granted the `roles/iam.serviceAccountTokenCreator` role
         * on its next service account in the chain. The last service account in the
         * chain must be granted the `roles/iam.serviceAccountTokenCreator` role on
         * the service account that is specified in the `name` field of the request.
         * The delegates must have the following format:
         * `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`
         */
        delegates?: string[];
        /**
         * The JWT payload to sign: a JSON object that contains a JWT Claims Set.
         */
        payload?: string;
    }
    interface Schema$SignJwtResponse {
        /**
         * The ID of the key used to sign the JWT.
         */
        keyId?: string;
        /**
         * The signed JWT.
         */
        signedJwt?: string;
    }
    class Resource$Projects {
        root: Iamcredentials;
        serviceAccounts: Resource$Projects$Serviceaccounts;
        constructor(root: Iamcredentials);
        getRoot(): Iamcredentials;
    }
    class Resource$Projects$Serviceaccounts {
        root: Iamcredentials;
        constructor(root: Iamcredentials);
        getRoot(): Iamcredentials;
        /**
         * iamcredentials.projects.serviceAccounts.generateAccessToken
         * @desc Generates an OAuth 2.0 access token for a service account.
         * @alias iamcredentials.projects.serviceAccounts.generateAccessToken
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The resource name of the service account for
         *     which the credentials are requested, in the following format:
         *     `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`. Using `-`
         *     as a wildcard for the project will infer the project from the
         *     account.
         * @param {().GenerateAccessTokenRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as
         *     `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        generateAccessToken(params?: Params$Resource$Projects$Serviceaccounts$Generateaccesstoken, options?: MethodOptions): AxiosPromise<Schema$GenerateAccessTokenResponse>;
        generateAccessToken(params: Params$Resource$Projects$Serviceaccounts$Generateaccesstoken, options: MethodOptions | BodyResponseCallback<Schema$GenerateAccessTokenResponse>, callback: BodyResponseCallback<Schema$GenerateAccessTokenResponse>): void;
        generateAccessToken(params: Params$Resource$Projects$Serviceaccounts$Generateaccesstoken, callback: BodyResponseCallback<Schema$GenerateAccessTokenResponse>): void;
        generateAccessToken(callback: BodyResponseCallback<Schema$GenerateAccessTokenResponse>): void;
        /**
         * iamcredentials.projects.serviceAccounts.generateIdToken
         * @desc Generates an OpenID Connect ID token for a service account.
         * @alias iamcredentials.projects.serviceAccounts.generateIdToken
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The resource name of the service account for
         *     which the credentials are requested, in the following format:
         *     `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`. Using `-`
         *     as a wildcard for the project will infer the project from the
         *     account.
         * @param {().GenerateIdTokenRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as
         *     `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        generateIdToken(params?: Params$Resource$Projects$Serviceaccounts$Generateidtoken, options?: MethodOptions): AxiosPromise<Schema$GenerateIdTokenResponse>;
        generateIdToken(params: Params$Resource$Projects$Serviceaccounts$Generateidtoken, options: MethodOptions | BodyResponseCallback<Schema$GenerateIdTokenResponse>, callback: BodyResponseCallback<Schema$GenerateIdTokenResponse>): void;
        generateIdToken(params: Params$Resource$Projects$Serviceaccounts$Generateidtoken, callback: BodyResponseCallback<Schema$GenerateIdTokenResponse>): void;
        generateIdToken(callback: BodyResponseCallback<Schema$GenerateIdTokenResponse>): void;
        /**
         * iamcredentials.projects.serviceAccounts.signBlob
         * @desc Signs a blob using a service account's system-managed private key.
         * @alias iamcredentials.projects.serviceAccounts.signBlob
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The resource name of the service account for
         *     which the credentials are requested, in the following format:
         *     `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`. Using `-`
         *     as a wildcard for the project will infer the project from the
         *     account.
         * @param {().SignBlobRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as
         *     `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        signBlob(params?: Params$Resource$Projects$Serviceaccounts$Signblob, options?: MethodOptions): AxiosPromise<Schema$SignBlobResponse>;
        signBlob(params: Params$Resource$Projects$Serviceaccounts$Signblob, options: MethodOptions | BodyResponseCallback<Schema$SignBlobResponse>, callback: BodyResponseCallback<Schema$SignBlobResponse>): void;
        signBlob(params: Params$Resource$Projects$Serviceaccounts$Signblob, callback: BodyResponseCallback<Schema$SignBlobResponse>): void;
        signBlob(callback: BodyResponseCallback<Schema$SignBlobResponse>): void;
        /**
         * iamcredentials.projects.serviceAccounts.signJwt
         * @desc Signs a JWT using a service account's system-managed private key.
         * @alias iamcredentials.projects.serviceAccounts.signJwt
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The resource name of the service account for
         *     which the credentials are requested, in the following format:
         *     `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`. Using `-`
         *     as a wildcard for the project will infer the project from the
         *     account.
         * @param {().SignJwtRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as
         *     `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        signJwt(params?: Params$Resource$Projects$Serviceaccounts$Signjwt, options?: MethodOptions): AxiosPromise<Schema$SignJwtResponse>;
        signJwt(params: Params$Resource$Projects$Serviceaccounts$Signjwt, options: MethodOptions | BodyResponseCallback<Schema$SignJwtResponse>, callback: BodyResponseCallback<Schema$SignJwtResponse>): void;
        signJwt(params: Params$Resource$Projects$Serviceaccounts$Signjwt, callback: BodyResponseCallback<Schema$SignJwtResponse>): void;
        signJwt(callback: BodyResponseCallback<Schema$SignJwtResponse>): void;
    }
    interface Params$Resource$Projects$Serviceaccounts$Generateaccesstoken {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The resource name of the service account for which the credentials are
         * requested, in the following format:
         * `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`. Using `-` as a
         * wildcard for the project will infer the project from the account.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GenerateAccessTokenRequest;
    }
    interface Params$Resource$Projects$Serviceaccounts$Generateidtoken {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The resource name of the service account for which the credentials are
         * requested, in the following format:
         * `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`. Using `-` as a
         * wildcard for the project will infer the project from the account.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GenerateIdTokenRequest;
    }
    interface Params$Resource$Projects$Serviceaccounts$Signblob {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The resource name of the service account for which the credentials are
         * requested, in the following format:
         * `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`. Using `-` as a
         * wildcard for the project will infer the project from the account.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SignBlobRequest;
    }
    interface Params$Resource$Projects$Serviceaccounts$Signjwt {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient;
        /**
         * The resource name of the service account for which the credentials are
         * requested, in the following format:
         * `projects/-/serviceAccounts/{ACCOUNT_EMAIL_OR_UNIQUEID}`. Using `-` as a
         * wildcard for the project will infer the project from the account.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SignJwtRequest;
    }
}
