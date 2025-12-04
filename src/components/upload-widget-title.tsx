import { UploadCloud } from 'lucide-react';

export const UploadWIdgetTitle = () => {
  const isThereAnyPendindUpload = true;
  const uploadGlobalPercentage = 66;
  return (
    <div className="flex items-center gap-1.5 font-medium text-sm">
      <UploadCloud className="size-4 text-zinc-400" strokeWidth={1.5} />
      {isThereAnyPendindUpload ? (
        <span className="flex items-baseline gap-1">
          Uploading
          <span className="text-xs text-zinc-400 tabular-nums">
            {uploadGlobalPercentage}%
          </span>
        </span>
      ) : (
        <span>Upload Files</span>
      )}
    </div>
  );
};
