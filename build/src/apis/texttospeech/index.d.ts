import { texttospeech_v1 } from './v1';
import { texttospeech_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    'v1': typeof texttospeech_v1.Texttospeech;
    'v1beta1': typeof texttospeech_v1beta1.Texttospeech;
};
export declare function texttospeech(version: 'v1'): texttospeech_v1.Texttospeech;
export declare function texttospeech(options: texttospeech_v1.Options): texttospeech_v1.Texttospeech;
export declare function texttospeech(version: 'v1beta1'): texttospeech_v1beta1.Texttospeech;
export declare function texttospeech(options: texttospeech_v1beta1.Options): texttospeech_v1beta1.Texttospeech;
