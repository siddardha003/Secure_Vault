// Simple encryption without master password
export interface VaultItemData {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

export interface EncryptedVaultItem {
  _id: string;
  userId: string;
  encryptedTitle: string;
  encryptedUsername: string;
  encryptedPassword: string;
  encryptedUrl?: string;
  encryptedNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Placeholder functions - encryption disabled for simplicity
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function initializeEncryption(_userId: string): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function clearEncryptionData(_userId: string): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function resetEncryptionData(_userId: string): void {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function encryptVaultItem(item: VaultItemData, _userId: string): Omit<EncryptedVaultItem, '_id' | 'userId' | 'createdAt' | 'updatedAt'> {
  // No encryption - just pass through the data
  return {
    encryptedTitle: item.title,
    encryptedUsername: item.username,
    encryptedPassword: item.password,
    encryptedUrl: item.url || '',
    encryptedNotes: item.notes || '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function decryptVaultItem(item: EncryptedVaultItem, _userId: string): VaultItemData {
  // No decryption - just pass through the data
  return {
    title: item.encryptedTitle,
    username: item.encryptedUsername,
    password: item.encryptedPassword,
    url: item.encryptedUrl || undefined,
    notes: item.encryptedNotes || undefined,
  };
}