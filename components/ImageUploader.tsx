import { useState, ChangeEvent } from "react";

type ImageUploaderProps = {
  onImagesUploaded: (imageURLs: string[]) => void;
};

const ImageUploader = ({ onImagesUploaded }: ImageUploaderProps) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleChangeFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const compressedURLs = await Promise.all(
        Array.from(files).map(async (file) => {
          const compressedImage = await compressImage(file);
          return URL.createObjectURL(compressedImage);
        })
      );

      setPreviewImages(compressedURLs);
      onImagesUploaded(compressedURLs);
    }
  };

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const image = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      image.onload = () => {
        const maxWidth = 2048;
        const maxHeight = 1532;
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob as Blob);
          },
          "image/jpeg",
          0.9
        );
      };

      image.src = URL.createObjectURL(file);
    });
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleChangeFiles}
        className="w-full p-2 border rounded"
      />

      <div className="flex overflow-x-auto whitespace-nowrap p-2">
        {previewImages.map((previewURL, index) => (
          <div
            key={index}
            className="mr-4 max-w-xs overflow-hidden rounded shadow-lg"
          >
            <img src={previewURL} alt={`Preview ${index}`} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
