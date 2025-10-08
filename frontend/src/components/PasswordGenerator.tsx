import React, { useState, useCallback } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';

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
      await navigator.clipboard.writeText(password);
      setCopied(true);
      
      // Auto-clear after 15 seconds
      setTimeout(() => {
        setCopied(false);
      }, 15000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  // Generate initial password
  React.useEffect(() => {
    generatePassword();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Password Generator</h2>
      
      {/* Generated Password Display */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
            placeholder="Generated password will appear here"
          />
          <button
            onClick={copyToClipboard}
            disabled={!password}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={generatePassword}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-1"
          >
            <RefreshCw size={16} />
            <span>Generate</span>
          </button>
        </div>
      </div>

      {/* Password Length */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Length: {length}
        </label>
        <input
          type="range"
          min="4"
          max="50"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>4</span>
          <span>50</span>
        </div>
      </div>

      {/* Character Type Options */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Uppercase (A-Z)</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Lowercase (a-z)</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Numbers (0-9)</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Symbols (!@#$...)</span>
        </label>
      </div>

      {/* Additional Options */}
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={excludeLookAlikes}
            onChange={(e) => setExcludeLookAlikes(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Exclude look-alikes (0, O, 1, l, I, |)</span>
        </label>
      </div>

      {/* Password Strength Indicator */}
      {password && (
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Strength:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  length >= 16 ? 'bg-green-500 w-full' :
                  length >= 12 ? 'bg-yellow-500 w-3/4' :
                  length >= 8 ? 'bg-orange-500 w-1/2' :
                  'bg-red-500 w-1/4'
                }`}
              />
            </div>
            <span className={`text-sm font-medium ${
              length >= 16 ? 'text-green-600' :
              length >= 12 ? 'text-yellow-600' :
              length >= 8 ? 'text-orange-600' :
              'text-red-600'
            }`}>
              {length >= 16 ? 'Strong' :
               length >= 12 ? 'Good' :
               length >= 8 ? 'Fair' :
               'Weak'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;