import Schema from 'schemastery';
import { StatusError } from 'itty-router-extras';

type ValidateReturn<T> = T extends Schema<any, infer R> ? R : never;

export async function validate<T extends Schema>(request: Request, schema: T) {
  const obj = {} as { [key: string]: unknown };
  const { searchParams } = new URL(request.url),
    formData = await request.formData();
  try {
    for (const [key, value] of [
      ...searchParams.entries(),
      ...formData.entries(),
    ]) {
      if (value instanceof File) {
        obj[key] = value;
      } else {
        try {
          obj[key] = JSON.parse(value);
        } catch {
          obj[key] = value;
        }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema(obj) as ValidateReturn<T>;
  } catch (err) {
    const { message } = err as TypeError | SyntaxError;
    throw new StatusError(400, message);
  }
}
