'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { vaultAPI } from '@/utils/api';
import { encryptVaultItem, decryptVaultItem } from '@/utils/encryption';
import PasswordGenerator from '@/components/PasswordGenerator';
import VaultItem from '@/components/VaultItem';
import VaultForm, { VaultItemData } from '@/components/VaultForm';
import { 
  Search, 
  Plus, 
  LogOut, 
  Lock
} from 'lucide-react';

interface DecryptedVaultItem extends VaultItemData {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

const VaultPage: React.FC = () => {
  const { user, logout, isAuthenticated, masterPassword } = useAuth();
  const router = useRouter();
  
  const [vaultItems, setVaultItems] = useState<DecryptedVaultItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DecryptedVaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItemData | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load vault items
  const loadVaultItems = useCallback(async () => {
    if (!user || !masterPassword) return;
    
    try {
      setIsLoading(true);
      const encryptedItems = await vaultAPI.getItems();
      
      const decryptedItems: DecryptedVaultItem[] = [];
      for (const item of encryptedItems) {
        try {
          const decrypted = decryptVaultItem(item, masterPassword, user.id);
          decryptedItems.push({
            id: item._id,
            ...decrypted,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          });
        } catch (decryptError) {
          console.error('Failed to decrypt item:', item._id, decryptError);
          // Skip items that can't be decrypted
        }
      }
      
      setVaultItems(decryptedItems);
      setError('');
    } catch (error) {
      console.error('Failed to load vault items:', error);
      setError('Failed to load vault items');
    } finally {
      setIsLoading(false);
    }
  }, [user, masterPassword]);

  // Load items on mount and when user/password changes
  useEffect(() => {
    loadVaultItems();
  }, [loadVaultItems]);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(vaultItems);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = vaultItems.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.username.toLowerCase().includes(query) ||
        item.url?.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [vaultItems, searchQuery]);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (id: string) => {
    const item = vaultItems.find(item => item.id === id);
    if (item) {
      setEditingItem(item);
      setIsFormOpen(true);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await vaultAPI.deleteItem(id);
      setVaultItems(items => items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleFormSubmit = async (formData: VaultItemData) => {
    if (!user || !masterPassword) return;

    try {
      const encryptedData = encryptVaultItem(formData, masterPassword, user.id);
      
      if (editingItem && editingItem.id) {
        // Update existing item
        const updatedItem = await vaultAPI.updateItem(editingItem.id, encryptedData);
        setVaultItems(items => 
          items.map(item => 
            item.id === editingItem.id 
              ? { ...formData, id: updatedItem._id, updatedAt: updatedItem.updatedAt }
              : item
          )
        );
      } else {
        // Create new item
        const newItem = await vaultAPI.createItem(encryptedData);
        setVaultItems(items => [...items, {
          ...formData,
          id: newItem._id,
          createdAt: newItem.createdAt,
          updatedAt: newItem.updatedAt
        }]);
      }
      
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  const handleGeneratePassword = useCallback(() => {
    return generatedPassword || 'Generated-Password-123!';
  }, [generatedPassword]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      router.push('/login');
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Lock className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Secure Vault</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Password Generator */}
          <div className="lg:col-span-1">
            <PasswordGenerator onPasswordGenerated={setGeneratedPassword} />
          </div>

          {/* Right Column - Vault */}
          <div className="lg:col-span-2">
            {/* Vault Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Vault</h2>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleAddItem}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="mt-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search your vault..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Vault Items */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your vault...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery ? 'No items found' : 'Your vault is empty'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery 
                      ? `No items match "${searchQuery}"`
                      : 'Start by adding your first password'
                    }
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleAddItem}
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add Your First Item</span>
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-sm text-gray-600 mb-4">
                    {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </div>
                  
                  {filteredItems.map((item) => (
                    <VaultItem
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      username={item.username}
                      password={item.password}
                      url={item.url}
                      notes={item.notes}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vault Form Modal */}
      <VaultForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
        onGeneratePassword={handleGeneratePassword}
      />
    </div>
  );
};

export default VaultPage;