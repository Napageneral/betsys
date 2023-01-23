/**
 *
 * @param url Our URL to append parameters to
 * @param params Our object of key value pairs to append as query params - we need some custom logic to in essense "flatten" this
 * if there are array values as URLSearchParams doesn't properly parse array values in objects
 * @returns Ready to go URL
 */
export declare const createUrlWithParams: (url: string, params?: Record<string, any>) => string;
