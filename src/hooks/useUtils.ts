const useUtils = () => {
  const formatDate = (isoString: string | undefined): string => {
    if (!isoString) {
      return "";
    }

    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const getRandomInRange = (min: number = 0, max: number = 1): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const fileToBase64 = (files: FileList | null): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!files || files.length === 0) return resolve("");

      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return { formatDate, getRandomInRange, fileToBase64 };
};

export default useUtils;
