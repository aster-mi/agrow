const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    const image = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    image.onload = () => {
      const maxWidth = 2048;
      const maxHeight = 2048;
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
export default compressImage;
