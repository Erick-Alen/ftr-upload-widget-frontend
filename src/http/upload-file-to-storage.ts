import axios from 'axios';

type UploadFileToStorageOptions = {
  signal?: AbortSignal;
};
type UploadFileToStorageProps = {
  file: File;
  onProgress: (byteSize: number) => void;
};

export async function uploadFileToStorage(
  { file, onProgress }: UploadFileToStorageProps,
  options?: UploadFileToStorageOptions
) {
  const data = new FormData();
  data.append('file', file);
  // throw new Error('Simulated upload error');
  const response = await axios.post<{ url: string }>(
    'http://localhost:3333/uploads',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: options?.signal,
      onUploadProgress: (progressEvent) => {
        onProgress?.(progressEvent.loaded);
      },
    }
  );
  return { url: response.data.url };
}
