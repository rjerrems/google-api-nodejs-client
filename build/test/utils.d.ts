import { AxiosResponse } from 'axios';
import { GoogleApis } from '../src';
export declare abstract class Utils {
    static getQs(res: AxiosResponse): string | null;
    static getPath(res: AxiosResponse): string;
    static getDiscoveryUrl(name: string, version: string): string;
    static loadApi<T = any>(google: GoogleApis, name: string, version: string, options?: {}): T;
    static readonly noop: () => undefined;
    static readonly baseUrl: string;
}
