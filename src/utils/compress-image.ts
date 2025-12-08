type CompresImageProps = {
  file: File;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
};

export function compressImage({
  file,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8,
}: CompresImageProps): Promise<File> {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/webp',
    'image/png',
    'image/webp',
  ];
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error('Unsupported file type for compression.');
  }
  // fileReader API allows us to read the file bit by bit
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const compressed = new Image();
      compressed.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = compressed;
        // calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          // adjust height accordingly
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          // adjust width accordingly
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Could not get canvas context for image compression.');
          return;
        }
        ctx.drawImage(compressed, 0, 0, width, height);
        // convert canvas back to blob
        // blob: binary file representation
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject('Image compression failed.');
              return;
            }
            const compressedFile = new File([blob], convertToWebp(file.name), {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
      compressed.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function convertToWebp(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex === -1) {
    return `${filename}.webp`;
  }

  return `${filename.substring(0, lastDotIndex)}.webp`;
}
