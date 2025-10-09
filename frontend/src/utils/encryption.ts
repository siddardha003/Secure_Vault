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
export function initializeEncryption(userId: string): void {}
export function clearEncryptionData(userId: string): void {}
export function resetEncryptionData(userId: string): void {}

export function encryptVaultItem(item: VaultItemData, userId: string): Omit<EncryptedVaultItem, '_id' | 'userId' | 'createdAt' | 'updatedAt'> {
  // No encryption - just pass through the data
  return {
    encryptedTitle: item.title,
    encryptedUsername: item.username,
    encryptedPassword: item.password,
    encryptedUrl: item.url || '',
    encryptedNotes: item.notes || '',
  };
}

export function decryptVaultItem(item: EncryptedVaultItem, userId: string): VaultItemData {
  // No decryption - just pass through the data
  return {
    title: item.encryptedTitle,
    username: item.encryptedUsername,
    password: item.encryptedPassword,
    url: item.encryptedUrl || undefined,
    notes: item.encryptedNotes || undefined,
  };
}