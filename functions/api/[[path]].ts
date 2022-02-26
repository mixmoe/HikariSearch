import '@ssttevee/cfw-formdata-polyfill';
import * as poly from '@ssttevee/blob-ponyfill';
import { error } from 'itty-router-extras';

export const BuiltinBlob = Blob,
  BuiltinFile = File,
  BuiltinFormData = FormData;

class OverrideFormData extends BuiltinFormData {
  public append(name: string, value: string | Blob, filename?: string): void {
    const reader = new poly.FileReaderSync();
    if (value instanceof poly.File) {
      value = new BuiltinFile(
        [reader.readAsArrayBuffer(value)],
        filename ?? value.name,
        {
          type: value.type,
          lastModified: value.lastModified,
        }
      );
    } else if (value instanceof poly.Blob) {
      value = new BuiltinBlob([reader.readAsArrayBuffer(value)]);
    }

    return filename
      ? super.append(name, value, filename)
      : super.append(name, value);
  }
}

globalThis.File = poly.File as typeof File;
globalThis.Blob = poly.Blob;
globalThis.FormData = OverrideFormData;

export const onRequest: PagesFunction = async ({ request, ...extra }) => {
  const { router } = await import('./router');
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: Response | undefined = await router.handle(request, extra);
    return response ?? error(404, 'not found');
  } catch (err) {
    return error(500, (err as Error).message);
  }
};
