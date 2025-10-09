'use client';

import React from 'react';
import { Lock, BrickWallShield, Shield, Key, Eye } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-[var(--background)] overflow-hidden">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--background)] flex-shrink-0">
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
              <Link
                href="/login"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-3 py-2 rounded-md hover:bg-[var(--muted)]"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-md hover:bg-[var(--foreground)]/90 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 lg:px-8">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Left Side - Shield Icon */}
            <div className="flex items-center justify-center">
              <BrickWallShield className="h-96 w-96 text-[var(--foreground)]" strokeWidth={1.2} />
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-[var(--foreground)] mb-2 tracking-tight leading-tight">
                  Your Digital Vault,
                </h1>
                <h2 className="text-5xl font-bold text-[var(--muted-foreground)] mb-6 tracking-tight leading-tight">
                  Secured Forever
                </h2>
                
                <p className="text-base text-[var(--muted-foreground)] mb-8 leading-relaxed">
                  Store, generate, and manage your passwords with military-grade encryption. 
                  Your data is encrypted client-side - we never see your passwords in plaintext.
                </p>
                
                <div className="flex gap-4 mb-12">
                  <Link
                    href="/register"
                    className="bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-lg hover:bg-[var(--foreground)]/90 transition-colors font-semibold"
                  >
                    Start Securing Your Passwords
                  </Link>
                  <Link
                    href="/login"
                    className="border border-[var(--border)] text-[var(--foreground)] px-6 py-3 rounded-lg hover:bg-[var(--muted)] transition-colors font-semibold"
                  >
                    Sign In to Your Vault
                  </Link>
                </div>
              </div>

              {/* Features Section */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[var(--foreground)]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">
                    Client-Side Encryption
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    Your passwords are encrypted in your browser using AES-256-CBC before being stored.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                    <Key className="h-5 w-5 text-[var(--foreground)]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">
                    Secure Password Generation
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    Generate strong, unique passwords with customizable length and character sets.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                    <Eye className="h-5 w-5 text-[var(--foreground)]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">
                    Zero-Knowledge Architecture
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    Your master password never leaves your device. We cannot access your vault.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-[var(--muted-foreground)]">
            <p>© 2025 Secure Vault. Built with privacy and security in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}