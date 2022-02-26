import Schema from 'schemastery';
import { StatusError } from 'itty-router-extras';

export async function validate<S, T>(request: Request, schema: Schema<S, T>) {
  const obj = {} as { [key: string]: unknown };
  const { searchParams } = new URL(request.url),
    formData = await request.formData();
  try {
    for (const [key, value] of [
      ...searchParams.entries(),
      ...formData.entries(),
    ]) {
      try {
        obj[key] = value instanceof File ? value : JSON.parse(value);
      } catch {
        obj[key] = value;
      }
    }
    return schema(obj as unknown as S);
  } catch (err) {
    throw new StatusError(400, (err as TypeError).message);
  }
}

export class RequestMaker {
  public readonly requestHooks: RequestMaker.HookFunction<Request>[] = [];
  public readonly responseHooks: RequestMaker.HookFunction<Response>[] = [];
  public readonly errorHooks: RequestMaker.HookFunction<Error>[] = [];

  constructor(protected readonly base?: RequestMaker.URLType) {}

  public async request(
    method: string,
    url: RequestMaker.URLType,
    body?: BodyInit,
    { headers, ...options }: RequestMaker.Options = {}
  ): Promise<Response> {
    let request = new Request(new URL(url, this.base).toString(), {
        method,
        body,
        ...options,
      }),
      response: Response;

    for (const [key, value] of typeof headers === 'object'
      ? headers instanceof Headers
        ? headers.entries()
        : Object.entries(headers)
      : [])
      request.headers.set(key, value);

    for (const hook of this.requestHooks.reverse())
      request = await hook(request);

    try {
      response = await fetch(request);
    } catch (err) {
      for (const hook of this.errorHooks.reverse()) err = hook(err as Error);
      throw err;
    }

    for (const hook of this.responseHooks.reverse())
      response = await hook(response);

    return response;
  }

  public get get() {
    return this.request.bind(this, 'GET');
  }

  public get post() {
    return this.request.bind(this, 'POST');
  }

  public get put() {
    return this.request.bind(this, 'PUT');
  }

  public get delete() {
    return this.request.bind(this, 'DELETE');
  }

  public get patch() {
    return this.request.bind(this, 'PATCH');
  }

  public get head() {
    return this.request.bind(this, 'HEAD');
  }

  public get options() {
    return this.request.bind(this, 'OPTIONS');
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RequestMaker {
  export type URLType = string | URL;

  export type HeaderType = Record<string, string> | Headers;

  export type HookFunction<T> = (request: T) => Promise<T> | T;

  export interface Options {
    headers?: HeaderType;
    redirect?: RequestRedirect;
    fetcher?: Fetcher;
    cf?: IncomingRequestCfProperties | RequestInitCfProperties;
    signal?: AbortSignal;
    responseType?: ResponseType;
  }
}

export const request = new RequestMaker();

request.errorHooks.push((err) => {
  throw new StatusError(502, `Upstream request failed: ${err.message}`);
});

request.responseHooks.push((response) => {
  if (!response.ok)
    throw new StatusError(
      502,
      `Upstream returned error: ${response.status} ${response.statusText}`
    );
  return response;
});
