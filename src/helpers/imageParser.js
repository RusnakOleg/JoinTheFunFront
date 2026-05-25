export const parseImg = (b64) => {
  return b64 ? `data:image/jpeg;base64,${b64}` : "https://via.placeholder.com/150";
};