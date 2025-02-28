import { Request } from 'express';

export type RequestParams = Record<string, unknown>;
export type RequestBody = RequestParams;
export type GetDataRequest<T extends Record<string, unknown>> = Request<RequestParams, RequestBody, T>
