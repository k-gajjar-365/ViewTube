export const isEmptyString = (str) => {
   return typeof str !== "string" || str.trim() === "";
};
