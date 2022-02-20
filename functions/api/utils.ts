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
