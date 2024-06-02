import CryptoJS from 'crypto-js';
export const decryptObject = (encryptedString: string, key: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedString, key);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedString);
};
