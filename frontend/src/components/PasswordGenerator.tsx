import React, { useState, useCallback } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { copyWithSmartClear } from '@/utils/clipboard-practical';

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onPasswordGenerated }) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const showNotification = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const generatePassword = useCallback(() => {
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Remove look-alike characters if option is enabled
    if (excludeLookAlikes) {
      charset = charset.replace(/[0O1lI|`]/g, '');
    }

    if (!charset) {
      alert('Please select at least one character type');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(result);
    onPasswordGenerated?.(result);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeLookAlikes, onPasswordGenerated]);

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await copyWithSmartClear(password, {
        delay: 15000,
        onCopySuccess: () => {
          setCopied(true);
          showNotification();
          
          // Auto-clear copied state after 3 seconds
          setTimeout(() => {
            setCopied(false);
          }, 3000);
        },
        onClearAttempt: (success: boolean) => {
          if (success) {
            console.log('✅ Clipboard cleared successfully');
          } else {
            console.log('⚠️ Clipboard auto-clear requires tab to be active');
          }
        }
      });
      
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  // Generate initial password
  React.useEffect(() => {
    generatePassword();
  }, []);

  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-6 text-[var(--foreground)] tracking-tight">Password Generator</h2>
      
      {/* Generated Password Display */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 px-3 py-2.5 border border-[var(--border)] rounded-md bg-[var(--muted)] font-mono text-sm text-[var(--foreground)] focus:outline-none"
            placeholder="Generated password will appear here"
          />
          <button
            onClick={copyToClipboard}
            disabled={!password}
            className="px-3 py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-md hover:bg-[var(--foreground)]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 font-medium transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <button
          onClick={generatePassword}
          className="w-full px-3 py-2.5 border border-[var(--border)] text-[var(--foreground)] rounded-md hover:bg-[var(--muted)] flex items-center justify-center space-x-2 font-medium transition-colors"
        >
          <RefreshCw size={16} />
          <span>Generate New Password</span>
        </button>
      </div>

      {/* Password Length */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Password Length
          </label>
          <span className="text-sm font-mono text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded">
            {length}
          </span>
        </div>
        <input
          type="range"
          min="4"
          max="50"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-2">
          <span>4</span>
          <span>50</span>
        </div>
      </div>

      {/* Character Type Options */}
      <div className="space-y-4 mb-6">
        <div className="text-sm font-medium text-[var(--foreground)] mb-3">Character Types</div>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-0"
          />
          <span className="text-sm text-[var(--foreground)]">Uppercase (A-Z)</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-0"
          />
          <span className="text-sm text-[var(--foreground)]">Lowercase (a-z)</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-0"
          />
          <span className="text-sm text-[var(--foreground)]">Numbers (0-9)</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-0"
          />
          <span className="text-sm text-[var(--foreground)]">Symbols (!@#$...)</span>
        </label>
      </div>

      {/* Additional Options */}
      <div className="mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={excludeLookAlikes}
            onChange={(e) => setExcludeLookAlikes(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-0"
          />
          <span className="text-sm text-[var(--foreground)]">Exclude look-alikes (0, O, 1, l, I, |)</span>
        </label>
      </div>

      {/* Password Strength Indicator */}
      {password && (
        <div className="pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--muted-foreground)]">Strength</span>
            <span className={`text-sm font-medium ${
              length >= 16 ? 'text-green-600 dark:text-green-400' :
              length >= 12 ? 'text-yellow-600 dark:text-yellow-400' :
              length >= 8 ? 'text-orange-600 dark:text-orange-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {length >= 16 ? 'Strong' :
               length >= 12 ? 'Good' :
               length >= 8 ? 'Fair' :
               'Weak'}
            </span>
          </div>
          <div className="bg-[var(--muted)] rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                length >= 16 ? 'bg-green-500 w-full' :
                length >= 12 ? 'bg-yellow-500 w-3/4' :
                length >= 8 ? 'bg-orange-500 w-1/2' :
                'bg-red-500 w-1/4'
              }`}
            />
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-6 bg-[var(--foreground)] text-[var(--background)] px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 toast-enter">
          <div className="text-sm font-medium">Password copied!</div>
          <div className="text-xs opacity-75 mt-1">Keep tab active for auto-clear in 15s</div>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;