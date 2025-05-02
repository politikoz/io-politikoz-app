import CryptoJS from 'crypto-js';

export const getDecryptedStakeAddress = (): string | null => {
  const encryptedStakeAddress = localStorage.getItem('stakeAddress');
  if (!encryptedStakeAddress) return null;

  const bytes = CryptoJS.AES.decrypt(encryptedStakeAddress, process.env.ENCRYPTION_KEY || '');
  return bytes.toString(CryptoJS.enc.Utf8);
};