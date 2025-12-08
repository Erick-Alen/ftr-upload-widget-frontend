import { CanceledError } from 'axios';
import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/shallow';
import { uploadFileToStorage } from '../http/upload-file-to-storage';
import { compressImage } from '../utils/compress-image';
export type Upload = {
  file: File;
  name: string;
  abortController?: AbortController;
  status: 'progress' | 'completed' | 'error' | 'canceled';
  uploadByteSize: number;
  originalByteSize: number;
  compressedByteSize?: number;
  remoteUrl?: string;
};

type UploadState = {
  uploads: Map<string, Upload>;
  addUploads: (files: File[]) => void;
  cancelUpload: (uploadId: string) => void;
  retryUpload: (uploadId: string) => void;
};

enableMapSet();

export const useUploads = create<UploadState, [['zustand/immer', never]]>(
  immer((set, get) => {
    // utilitary function to update upload state
    function updateUpload(uploadId: string, uploadData: Partial<Upload>) {
      const upload = get().uploads.get(uploadId);
      set((state) => {
        if (upload) {
          state.uploads.set(uploadId, { ...upload, ...uploadData });
        }
      });
    }

    const processUpload = async (uploadId: string) => {
      const upload = get().uploads.get(uploadId);
      if (!upload) {
        return;
      }
      const abortController = new AbortController();

      updateUpload(uploadId, {
        status: 'progress',
        uploadByteSize: 0,
        compressedByteSize: undefined,
        remoteUrl: undefined,
        abortController,
      });
      try {
        const compressedFile = await compressImage({
          file: upload.file,
          quality: 0.7,
          maxHeight: 200,
          maxWidth: 200,
        });
        updateUpload(uploadId, {
          status: 'completed',
          compressedByteSize: compressedFile.size,
        });

        const { url } = await uploadFileToStorage(
          {
            file: compressedFile,
            onProgress: (byteSize) => {
              updateUpload(uploadId, { uploadByteSize: byteSize });
            },
          },
          {
            signal: abortController.signal,
          }
        );
        updateUpload(uploadId, {
          status: 'completed',
          remoteUrl: url,
        });
      } catch (error) {
        // if error was aborted by the user, it comes as cancelled error
        if (error instanceof CanceledError) {
          updateUpload(uploadId, { status: 'canceled' });
          return;
        }
        updateUpload(uploadId, { status: 'error' });
      }
    };

    function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId);
      if (!upload) {
        return;
      }
      upload.abortController?.abort();
      set((state) => {
        if (upload) {
          state.uploads.set(uploadId, {
            ...upload,
            status: 'canceled',
          });
        }
      });
    }

    const addUploads = (files: File[]) => {
      for (const file of files) {
        const uploadId = crypto.randomUUID();
        const newUpload: Upload = {
          name: file.name,
          file,
          status: 'progress',
          originalByteSize: file.size,
          uploadByteSize: 0,
        };

        set((state) => {
          state.uploads.set(uploadId, newUpload);
        });
        //immer substitui o uso dessa reatribuição abaixo, recalculando qual
        // variável que precisa ser atualizada automaticamente
        // set((state) => ({ uploads: state.uploads.set(uploadId, newUpload) }));

        processUpload(uploadId);
      }
    };

    const retryUpload = (uploadId: string) => {
      processUpload(uploadId);
    };

    return {
      uploads: new Map(),
      addUploads,
      processUpload,
      cancelUpload,
      retryUpload,
    };
  })
);

// function to calculate all uploads progress percentage
export const usePendingUploads = () =>
  useUploads(
    useShallow((store) => {
      const isThereAnyPendingUploads = Array.from(store.uploads.values()).some(
        (upload) => upload.status === 'progress'
      );
      if (!isThereAnyPendingUploads) {
        return { isThereAnyPendingUploads, globalPercentage: 100 };
      }
      const { totalBytes, uploaded } = Array.from(
        store.uploads.values()
      ).reduce(
        (acc, upload) => {
          if (upload.compressedByteSize) {
            acc.uploaded += upload.uploadByteSize;
          }
          acc.totalBytes +=
            upload.compressedByteSize || upload.originalByteSize;
          return acc;
        },
        { totalBytes: 0, uploaded: 0 }
      );

      const globalPercentage = Math.round((uploaded / totalBytes) * 100);

      return { isThereAnyPendingUploads, globalPercentage };
    })
  );
