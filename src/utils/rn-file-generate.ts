import { ReactNativeFile } from "apollo-upload-client";

export function generateRNFile(uri: string, name: string, type: string) {
  return uri
    ? new ReactNativeFile({
        uri,
        type,
        name,
      })
    : null;
}

export function base64ToBlob(base64: string, mimeType: string) {
  const byteString = atob(base64.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeType });
}
