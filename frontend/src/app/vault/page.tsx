'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { vaultAPI } from '@/utils/api';
import PasswordGenerator from '@/components/PasswordGenerator';
import VaultForm, { VaultItemData } from '@/components/VaultForm';
import ThemeToggle from '@/components/ThemeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faCopy, faExternalLinkAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
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
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [vaultItems, setVaultItems] = useState<DecryptedVaultItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DecryptedVaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItemData | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // Redirect if not authenticated (only after auth loading completes)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load vault items
  const loadVaultItems = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const encryptedItems = await vaultAPI.getItems();
      
      const decryptedItems: DecryptedVaultItem[] = [];
      
      for (const item of encryptedItems) {
        try {
          // Map backend response to frontend interface
          decryptedItems.push({
            id: item._id,
            title: item.title,
            username: item.username,
            password: item.encryptedPassword, // Map encryptedPassword to password
            url: item.url,
            notes: item.notes,
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
  }, [user]);

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
    if (!user) return;

    try {
      // Send data directly to backend with proper field mapping
      const dataToSend = {
        title: formData.title,
        username: formData.username,
        encryptedPassword: formData.password, // Backend expects this field name
        url: formData.url,
        notes: formData.notes
      };
      
      if (editingItem && editingItem.id) {
        // Update existing item
        const updatedItem = await vaultAPI.updateItem(editingItem.id, dataToSend);
        setVaultItems(items => 
          items.map(item => 
            item.id === editingItem.id 
              ? { 
                  id: updatedItem._id,
                  title: updatedItem.title,
                  username: updatedItem.username,
                  password: updatedItem.encryptedPassword,
                  url: updatedItem.url,
                  notes: updatedItem.notes,
                  createdAt: updatedItem.createdAt,
                  updatedAt: updatedItem.updatedAt
                }
              : item
          )
        );
      } else {
        // Create new item
        const newItem = await vaultAPI.createItem(dataToSend);
        setVaultItems(items => [...items, {
          id: newItem._id,
          title: newItem.title,
          username: newItem.username,
          password: newItem.encryptedPassword,
          url: newItem.url,
          notes: newItem.notes,
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

  // Copy password to clipboard
  const copyToClipboard = async (text: string, itemTitle: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`Password for "${itemTitle}" copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Failed to copy password');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  // Redirect to URL
  const openUrl = (url: string) => {
    if (url) {
      // Add protocol if missing
      const fullUrl = url.startsWith('http://') || url.startsWith('https://') 
        ? url 
        : `https://${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle folder click with actions
  const handleFolderClick = (item: DecryptedVaultItem, event: React.MouseEvent) => {
    event.stopPropagation();
    handleEditItem(item.id);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      router.push('/login');
    }
  };

  // Show loading screen while authentication is being verified
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Show loading screen while vault items are loading
  if (isLoading && vaultItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--foreground)] flex items-center justify-center">
                <Lock className="h-4 w-4 text-[var(--background)]" />
              </div>
              <h1 className="text-lg font-semibold text-[var(--foreground)] tracking-tight">Secure Vault</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-[var(--muted-foreground)] hidden sm:block">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-2 rounded-md hover:bg-[var(--muted)]"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {copySuccess && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-4">
          <div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-md text-sm">
            {copySuccess}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Password Generator */}
          <div className="lg:col-span-1">
            <PasswordGenerator onPasswordGenerated={setGeneratedPassword} />
          </div>

          {/* Right Column - Vault */}
          <div className="lg:col-span-2">
            {/* Vault Header */}
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">Your Vault</h2>
                
                <button
                  onClick={handleAddItem}
                  className="inline-flex items-center space-x-2 bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-md hover:bg-[var(--foreground)]/90 transition-colors font-medium"
                >
                  <Plus size={16} />
                  <span>Add Item</span>
                </button>
              </div>

              {/* Search */}
              <div className="mt-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
                <input
                  type="text"
                  placeholder="Search your vault..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[var(--border)] rounded-md bg-[var(--background)] placeholder-[var(--muted-foreground)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Vault Items */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--muted)] border-t-[var(--foreground)] mx-auto"></div>
                  <p className="mt-4 text-[var(--muted-foreground)]">Loading your vault...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--muted)] flex items-center justify-center">
                    <Lock className="h-6 w-6 text-[var(--muted-foreground)]" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                    {searchQuery ? 'No items found' : 'Your vault is empty'}
                  </h3>
                  <p className="text-[var(--muted-foreground)] mb-6 max-w-sm mx-auto">
                    {searchQuery 
                      ? `No items match "${searchQuery}"`
                      : 'Start by adding your first password or credential'
                    }
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleAddItem}
                      className="inline-flex items-center space-x-2 bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-md hover:bg-[var(--foreground)]/90 transition-colors font-medium"
                    >
                      <Plus size={16} />
                      <span>Add Your First Item</span>
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-sm text-[var(--muted-foreground)] mb-4">
                    {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </div>
                  
                  {/* Grid Layout for Folder Icons */}
                  <div className="grid grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col items-center p-4 hover:bg-[var(--muted)] rounded-lg transition-colors group relative"
                      >
                        {/* Main folder icon - clickable for editing */}
                        <div 
                          className="mb-3 cursor-pointer"
                          onClick={(e) => handleFolderClick(item, e)}
                        >
                          <FontAwesomeIcon 
                            icon={faFolderOpen}
                            size="6x"
                            className="text-[var(--foreground)] group-hover:text-[var(--foreground)]/80 transition-colors" 
                          />
                        </div>
                        
                        {/* Title */}
                        <span className="text-sm text-[var(--foreground)] text-center font-medium truncate w-full mb-2">
                          {item.title}
                        </span>
                        
                        {/* Action buttons - appear on hover */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Copy Password Button */}
                          {item.password && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.password, item.title);
                              }}
                              className="p-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/80 transition-colors"
                              title="Copy Password"
                            >
                              <FontAwesomeIcon icon={faCopy} size="sm" />
                            </button>
                          )}
                          
                          {/* Open URL Button */}
                          {item.url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.url) openUrl(item.url);
                              }}
                              className="p-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/80 transition-colors"
                              title="Open URL"
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
                            </button>
                          )}
                          
                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id);
                            }}
                            className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                            title="Delete Item"
                          >
                            <FontAwesomeIcon icon={faTrash} size="sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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