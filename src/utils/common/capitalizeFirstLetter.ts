export const capitalizeFirstLetterOfEachWord = (word: string) => {
  return word.replace(/\w\S*/g, function (txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};
