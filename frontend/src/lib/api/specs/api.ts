/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Enum representing player achievements */
export enum ACHIEVEMENT {
  BRONZE_COMPETENT = "BRONZE_COMPETENT",
  SILVER_TALENTED = "SILVER_TALENTED",
  GOLD_ACHIEVER = "GOLD_ACHIEVER",
  OVERACHIEVER = "OVERACHIEVER",
  PHASE_SHIFT = "PHASE_SHIFT",
  THE_UNSEEN = "THE_UNSEEN",
  FULL_OF_HEART = "FULL_OF_HEART",
  TOXIC_SPRITZ = "TOXIC_SPRITZ",
  NO_ESCAPE = "NO_ESCAPE",
  LIVING_NIGHTMARE = "LIVING_NIGHTMARE",
  PERSEVIARANCE = "PERSEVIARANCE",
  INNER_CONNECTION = "INNER_CONNECTION",
  MUTATION_JUNKIE = "MUTATION_JUNKIE",
  CALL_OF_THE_VOID = "CALL_OF_THE_VOID",
  PLAYING_WITH_FIRE = "PLAYING_WITH_FIRE",
  BITEFROST = "BITEFROST",
  DEATHLESS = "DEATHLESS",
  GET_HACKED = "GET_HACKED",
  BORROW_TIME = "BORROW_TIME",
  LEADER = "LEADER",
}

/** Enum representing various AUGMENTS */
export enum AUGMENTS {
  HEAL = "HEAL",
  IMMUNITY = "IMMUNITY",
  REGENERATION = "REGENERATION",
  POISON_CURE = "POISON_CURE",
  FEAR = "FEAR",
  NIGHT_VISION = "NIGHT_VISION",
  PORTAL = "PORTAL",
  BERSERK = "BERSERK",
  GUARDIAN_ANGEL = "GUARDIAN_ANGEL",
  STABILIZER = "STABILIZER",
  RECALL_BEACON = "RECALL_BEACON",
  DEMON_SOUL = "DEMON_SOUL",
  HARVESTER = "HARVESTER",
  STOPWATCH = "STOPWATCH",
  SYMBIOTIC_LINK = "SYMBIOTIC_LINK",
  MEDITATE = "MEDITATE",
  HACKED = "HACKED",
}

/** Enum representing available player titles */
export enum TITLES {
  DEFAULT = "DEFAULT",
  FIRE = "FIRE",
  ICE = "ICE",
  SHADOW = "SHADOW",
  RAINBOW = "RAINBOW",
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PORTAL = "PORTAL",
  VOID = "VOID",
  HACKER = "HACKER",
  ELECTRIC = "ELECTRIC",
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:5001" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Your API Title
 * @version 1.0.0
 * @baseUrl http://localhost:5001
 *
 * Your API description
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }
}
