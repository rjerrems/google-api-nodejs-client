import { firestore_v1 } from './v1';
import { firestore_v1beta1 } from './v1beta1';
import { firestore_v1beta2 } from './v1beta2';
export declare const VERSIONS: {
    'v1': typeof firestore_v1.Firestore;
    'v1beta1': typeof firestore_v1beta1.Firestore;
    'v1beta2': typeof firestore_v1beta2.Firestore;
};
export declare function firestore(version: 'v1'): firestore_v1.Firestore;
export declare function firestore(options: firestore_v1.Options): firestore_v1.Firestore;
export declare function firestore(version: 'v1beta1'): firestore_v1beta1.Firestore;
export declare function firestore(options: firestore_v1beta1.Options): firestore_v1beta1.Firestore;
export declare function firestore(version: 'v1beta2'): firestore_v1beta2.Firestore;
export declare function firestore(options: firestore_v1beta2.Options): firestore_v1beta2.Firestore;
