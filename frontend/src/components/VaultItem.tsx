'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Edit, Trash2, ExternalLink } from 'lucide-react';

interface VaultItemProps {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const VaultItem: React.FC<VaultItemProps> = ({
  id,
  title,
  username,
  password,
  url,
  notes,
  onEdit,
  onDelete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      
      // Auto-clear after 15 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 15000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openUrl = () => {
    if (url) {
      // Ensure URL has protocol
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {url && (
            <button
              onClick={openUrl}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Open URL"
            >
              <ExternalLink size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(id)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="text-gray-600 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Username */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-600">Username</label>
          <button
            onClick={() => copyToClipboard(username, 'username')}
            className="text-gray-500 hover:text-blue-600 transition-colors"
            title="Copy username"
          >
            {copiedField === 'username' ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="mt-1 text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded">
          {username}
        </div>
      </div>

      {/* Password */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              onClick={() => copyToClipboard(password, 'password')}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title="Copy password"
            >
              {copiedField === 'password' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <div className="mt-1 text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded font-mono">
          {showPassword ? password : '••••••••••••'}
        </div>
      </div>

      {/* URL */}
      {url && (
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600">Website</label>
            <button
              onClick={() => copyToClipboard(url, 'url')}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title="Copy URL"
            >
              {copiedField === 'url' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="mt-1 text-sm text-blue-600 bg-gray-50 px-3 py-2 rounded cursor-pointer hover:text-blue-800" onClick={openUrl}>
            {url}
          </div>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600">Notes</label>
            <button
              onClick={() => copyToClipboard(notes, 'notes')}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title="Copy notes"
            >
              {copiedField === 'notes' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="mt-1 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded whitespace-pre-wrap">
            {notes}
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultItem;