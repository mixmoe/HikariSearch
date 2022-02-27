import '@ssttevee/cfw-formdata-polyfill';
import * as poly from '@ssttevee/blob-ponyfill';

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
globalThis.Blob = poly.Blob as typeof Blob;
globalThis.FormData = OverrideFormData as typeof FormData;
