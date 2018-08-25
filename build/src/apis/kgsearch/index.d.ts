import { kgsearch_v1 } from './v1';
export declare const VERSIONS: {
    'v1': typeof kgsearch_v1.Kgsearch;
};
export declare function kgsearch(version: 'v1'): kgsearch_v1.Kgsearch;
export declare function kgsearch(options: kgsearch_v1.Options): kgsearch_v1.Kgsearch;
