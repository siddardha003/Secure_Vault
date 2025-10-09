'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Edit, Trash2, ExternalLink } from 'lucide-react';
import { copyWithSmartClear } from '@/utils/clipboard-practical';

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await copyWithSmartClear(text, {
        delay: 15000,
        onCopySuccess: () => {
          setCopiedField(field);
          showNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} copied - auto-clears in 15s`);

          setTimeout(() => {
            setCopiedField(null);
          }, 3000);
        },
        onClearAttempt: (success: boolean) => {
          if (success) {
            showNotification('🔒 Clipboard cleared for security');
          } else {
            console.log('⚠️ Clipboard will be cleared when you return to this tab');
          }
        }
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      showNotification('Failed to copy to clipboard');
    }
  };

  const openUrl = () => {
    if (url) {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4 hover:shadow-sm transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <h3 className="font-medium text-[var(--foreground)] truncate">{title}</h3>
          {url && (
            <button
              onClick={openUrl}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors opacity-0 group-hover:opacity-100"
              title="Open URL"
            >
              <ExternalLink size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(id)}
            className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded transition-colors"
            title="Edit"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Username */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[var(--muted-foreground)]">Username</label>
          <button
            onClick={() => copyToClipboard(username, 'username')}
            className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Copy username"
          >
            {copiedField === 'username' ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="text-sm text-[var(--foreground)] bg-[var(--muted)] px-3 py-2 rounded font-mono">
          {username}
        </div>
      </div>

      {/* Password */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[var(--muted-foreground)]">Password</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              onClick={() => copyToClipboard(password, 'password')}
              className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              title="Copy password"
            >
              {copiedField === 'password' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <div className="text-sm text-[var(--foreground)] bg-[var(--muted)] px-3 py-2 rounded font-mono">
          {showPassword ? password : '•'.repeat(password.length)}
        </div>
      </div>

      {/* URL */}
      {url && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[var(--muted-foreground)]">URL</label>
            <button
              onClick={() => copyToClipboard(url, 'url')}
              className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              title="Copy URL"
            >
              {copiedField === 'url' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="text-sm text-[var(--foreground)] bg-[var(--muted)] px-3 py-2 rounded font-mono truncate">
            {url}
          </div>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[var(--muted-foreground)]">Notes</label>
            <button
              onClick={() => copyToClipboard(notes, 'notes')}
              className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              title="Copy notes"
            >
              {copiedField === 'notes' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="text-sm text-[var(--foreground)] bg-[var(--muted)] px-3 py-2 rounded whitespace-pre-wrap">
            {notes}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[var(--foreground)] text-[var(--background)] px-4 py-3 rounded-lg shadow-lg z-50 toast-enter">
          <div className="text-sm font-medium">{toastMessage}</div>
        </div>
      )}
    </div>
  );
};

export default VaultItem;
