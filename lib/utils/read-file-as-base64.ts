export const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result?.toString();
      if (base64data) {
        resolve(base64data);
      } else {
        reject(new Error("Failed to read file as base64."));
      }
    };
  });
};
