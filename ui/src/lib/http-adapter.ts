import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
export type MethodType = "get" | "post" | "put" | "patch" | "delete";

export const MethodsEnum = {
  GET: "get",
  POST: "post",
  DELETE: "delete",
  PATCH: "patch",
  PUT: "put",
} as const;

export type RequesterFn = <T>(
  url: string,
  method: MethodType,
  body?: unknown,
  headers?: Record<string, string>,
  params?: unknown
) => Promise<T>;

export type AxiosAdapterType = (instance: AxiosInstance) => RequesterFn;

export interface HttpClient {
  requester<T>(
    url: string,
    method: MethodType,
    body?: unknown,
    headers?: Record<string, string>,
    params?: unknown
  ): Promise<T>;
  GET<T>(
    url: string,
    params?: unknown,
    headers?: Record<string, string>
  ): Promise<T>;
  POST<T, B = unknown>(
    url: string,
    body?: B,
    headers?: Record<string, string>
  ): Promise<T>;
  PUT<T, B = unknown>(
    url: string,
    body?: B,
    headers?: Record<string, string>
  ): Promise<T>;
  DELETE<T>(url: string, headers?: Record<string, string>): Promise<T>;
  PATCH<T, B = unknown>(
    url: string,
    body?: B,
    headers?: Record<string, string>
  ): Promise<T>;
}

export function AxiosAdapter(
  instance: AxiosInstance,
  opts?: AxiosRequestConfig
): RequesterFn {
  return async function requester<T>(
    url: string,
    method: MethodType,
    body?: unknown,
    headers?: Record<string, string>,
    params?: unknown
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      url,
      method,
      data: body,
      params,
      headers,
      ...opts,
    };
    const response: AxiosResponse<T> = await instance.request(config);
    return response?.data;
  };
}

export function CreateHttpClientAdapter(requester: RequesterFn): HttpClient {
  return {
    requester,
    async GET<T>(
      url: string,
      params?: unknown,
      headers?: Record<string, string>
    ): Promise<T> {
      return this.requester<T>(
        url,
        MethodsEnum.GET,
        undefined,
        headers,
        params
      );
    },
    async POST<T, B = unknown>(
      url: string,
      body?: B,
      headers?: Record<string, string>
    ): Promise<T> {
      return this.requester<T>(url, MethodsEnum.POST, body, headers);
    },
    async PUT<T, B = unknown>(
      url: string,
      body?: B,
      headers?: Record<string, string>
    ): Promise<T> {
      return this.requester<T>(url, MethodsEnum.PUT, body, headers);
    },
    async DELETE<T>(url: string, headers?: Record<string, string>): Promise<T> {
      return this.requester<T>(url, MethodsEnum.DELETE, undefined, headers);
    },
    async PATCH<T, B = unknown>(
      url: string,
      body?: B,
      headers?: Record<string, string>
    ): Promise<T> {
      return this.requester<T>(url, MethodsEnum.PATCH, body, headers);
    },
  };
}
