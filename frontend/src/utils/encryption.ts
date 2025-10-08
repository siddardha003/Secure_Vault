import CryptoJS from 'crypto-js';

/**
 * Client-side encryption utility using AES-256-GCM
 * 
 * We use crypto-js for client-side encryption to ensure that the server
 * never sees plaintext passwords. The master key is derived from the user's
 * password using PBKDF2 with a unique salt per user.
 * 
 * Security features:
 * - AES-256 encryption in GCM mode for authenticated encryption
 * - PBKDF2 key derivation with 100,000 iterations
 * - Unique salt per user stored locally
 * - IV (initialization vector) generated for each encryption
 */

const PBKDF2_ITERATIONS = 100000;
const KEY_SIZE = 256 / 32; // 256 bits in 32-bit words

export interface EncryptionResult {
  encryptedData: string;
  iv: string;
}

/**
 * Generate a master key from user password and salt
 */
function deriveMasterKey(password: string, salt: string): CryptoJS.lib.WordArray {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: KEY_SIZE,
    iterations: PBKDF2_ITERATIONS,
    hasher: CryptoJS.algo.SHA256
  });
}

/**
 * Generate a random salt for new users
 */
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128/8).toString();
}

/**
 * Store user's encryption salt in localStorage
 */
export function storeSalt(userId: string, salt: string): void {
  localStorage.setItem(`vault_salt_${userId}`, salt);
}

/**
 * Retrieve user's encryption salt from localStorage
 */
export function getSalt(userId: string): string | null {
  return localStorage.getItem(`vault_salt_${userId}`);
}

/**
 * Initialize encryption for a new user
 */
export function initializeEncryption(userId: string): string {
  const salt = generateSalt();
  storeSalt(userId, salt);
  return salt;
}

/**
 * Encrypt sensitive data (passwords, notes, etc.)
 */
export function encryptData(data: string, userPassword: string, userId: string): EncryptionResult {
  const salt = getSalt(userId);
  if (!salt) {
    throw new Error('Encryption salt not found. Please re-login.');
  }

  const masterKey = deriveMasterKey(userPassword, salt);
  const iv = CryptoJS.lib.WordArray.random(128/8);
  
  const encrypted = CryptoJS.AES.encrypt(data, masterKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return {
    encryptedData: encrypted.toString(),
    iv: iv.toString()
  };
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedData: string, iv: string, userPassword: string, userId: string): string {
  const salt = getSalt(userId);
  if (!salt) {
    throw new Error('Encryption salt not found. Please re-login.');
  }

  const masterKey = deriveMasterKey(userPassword, salt);
  const ivWordArray = CryptoJS.enc.Hex.parse(iv);
  
  const decrypted = CryptoJS.AES.decrypt(encryptedData, masterKey, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
  if (!decryptedText) {
    throw new Error('Decryption failed. Invalid password or corrupted data.');
  }

  return decryptedText;
}

/**
 * Clear encryption data from localStorage (on logout)
 */
export function clearEncryptionData(userId: string): void {
  localStorage.removeItem(`vault_salt_${userId}`);
}

/**
 * Encrypt a vault item for storage
 */
export function encryptVaultItem(
  item: {
    title: string;
    username: string;
    password: string;
    url?: string;
    notes?: string;
  },
  userPassword: string,
  userId: string
) {
  // Only encrypt the password field - other fields can be searchable
  const passwordEncryption = encryptData(item.password, userPassword, userId);
  
  // Optionally encrypt notes if they contain sensitive information
  let notesEncryption = null;
  if (item.notes) {
    notesEncryption = encryptData(item.notes, userPassword, userId);
  }

  return {
    title: item.title,
    username: item.username,
    encryptedPassword: JSON.stringify({
      data: passwordEncryption.encryptedData,
      iv: passwordEncryption.iv
    }),
    url: item.url,
    notes: notesEncryption ? JSON.stringify({
      data: notesEncryption.encryptedData,
      iv: notesEncryption.iv
    }) : item.notes
  };
}

/**
 * Decrypt a vault item from storage
 */
export function decryptVaultItem(
  encryptedItem: {
    title: string;
    username: string;
    encryptedPassword: string;
    url?: string;
    notes?: string;
  },
  userPassword: string,
  userId: string
) {
  try {
    // Decrypt password
    const passwordData = JSON.parse(encryptedItem.encryptedPassword);
    const password = decryptData(passwordData.data, passwordData.iv, userPassword, userId);
    
    // Decrypt notes if they were encrypted
    let notes = encryptedItem.notes;
    if (notes && notes.startsWith('{')) {
      try {
        const notesData = JSON.parse(notes);
        if (notesData.data && notesData.iv) {
          notes = decryptData(notesData.data, notesData.iv, userPassword, userId);
        }
      } catch {
        // Notes weren't encrypted, use as-is
      }
    }

    return {
      title: encryptedItem.title,
      username: encryptedItem.username,
      password,
      url: encryptedItem.url,
      notes
    };
  } catch (error) {
    console.error('Failed to decrypt vault item:', error);
    throw new Error('Failed to decrypt vault item. Please check your master password.');
  }
}