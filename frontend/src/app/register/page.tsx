'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, UserPlus } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/vault');
    }
  }, [isAuthenticated, authLoading, router]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join('. '));
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password);
      router.push('/vault');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 5) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--muted)] border-t-[var(--foreground)]"></div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--foreground)] flex items-center justify-center">
                <Lock className="h-4 w-4 text-[var(--background)]" />
              </div>
              <h1 className="text-lg font-semibold text-[var(--foreground)] tracking-tight">Secure Vault</h1>
            </Link>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-4 lg:px-8 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--foreground)] flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-[var(--background)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
              Create Your Vault
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Start securing your passwords today
            </p>
          </div>

          {/* Form */}
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] placeholder-[var(--muted-foreground)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] placeholder-[var(--muted-foreground)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:border-transparent transition-all"
                    placeholder="Create a strong master password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-[var(--muted)] rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score <= 2 ? 'text-red-600 dark:text-red-400' :
                        passwordStrength.score <= 4 ? 'text-yellow-600 dark:text-yellow-400' :
                        passwordStrength.score <= 5 ? 'text-blue-600 dark:text-blue-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] placeholder-[var(--muted-foreground)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:border-transparent transition-all"
                    placeholder="Confirm your master password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[var(--foreground)] text-[var(--background)] py-2 px-4 rounded-md hover:bg-[var(--foreground)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--background)] border-t-transparent mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Secure Vault'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-[var(--foreground)] hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg">
            <p className="text-xs text-[var(--foreground)] text-center leading-relaxed">
              <strong>Important:</strong> Your master password encrypts all your data.
              <br />
              We cannot recover it if you forget it - please store it safely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;