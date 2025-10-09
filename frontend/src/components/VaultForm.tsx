'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, RefreshCw } from 'lucide-react';

interface VaultFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: VaultItemData) => Promise<void>;
  editingItem?: VaultItemData | null;
  onGeneratePassword?: () => string;
}

export interface VaultItemData {
  id?: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

const VaultForm: React.FC<VaultFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  onGeneratePassword,
}) => {
  const [formData, setFormData] = useState<VaultItemData>({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<VaultItemData>>({});

  // Reset form when modal opens/closes or editing item changes
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData(editingItem);
      } else {
        setFormData({
          title: '',
          username: '',
          password: '',
          url: '',
          notes: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, editingItem]);

  const handleInputChange = (field: keyof VaultItemData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const generatePassword = () => {
    if (onGeneratePassword) {
      const generatedPassword = onGeneratePassword();
      setFormData(prev => ({ ...prev, password: generatedPassword }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<VaultItemData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle error (could show toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background)] rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1 rounded-md hover:bg-[var(--muted)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 bg-[var(--background)] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] ${
                errors.title ? 'border-red-500' : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
              }`}
              placeholder="e.g., Gmail, Bank Account"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`w-full px-3 py-2 bg-[var(--background)] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] ${
                errors.username ? 'border-red-500' : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
              }`}
              placeholder="Username or email"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Password *
              </label>
              {onGeneratePassword && (
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1 transition-colors"
                >
                  <RefreshCw size={12} />
                  <span>Generate</span>
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-3 py-2 pr-10 bg-[var(--background)] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-colors text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] ${
                  errors.password ? 'border-red-500' : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
                }`}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Website URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]"
              placeholder="https://example.com"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)] resize-none"
              placeholder="Additional notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-[var(--foreground)] bg-[var(--muted)] rounded-md hover:bg-[var(--muted)]/70 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Update' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaultForm;