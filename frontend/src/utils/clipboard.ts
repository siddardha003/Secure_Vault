/**
 * Enhanced clipboard utility with smart auto-clear functionality
 * Handles browser security restrictions around clipboard access
 */

interface ClipboardManager {
  copy: (text: string) => Promise<void>;
  scheduleAutoClear: (delay?: number) => void;
  cancelAutoClear: () => void;
  onClearAttempt?: (success: boolean) => void;
}

class SmartClipboard implements ClipboardManager {
  private clearTimeoutId: NodeJS.Timeout | null = null;
  private lastCopiedText: string = '';
  private clearDelay: number = 15000; // 15 seconds default
  
  public onClearAttempt?: (success: boolean) => void;

  async copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.lastCopiedText = text;
      this.scheduleAutoClear();
    } catch (error) {
      // Fallback for older browsers or security restrictions
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.top = '-999px';
      textArea.style.left = '-999px';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        const success = document.execCommand('copy');
        if (success) {
          this.lastCopiedText = text;
          this.scheduleAutoClear();
        } else {
          throw new Error('Copy command failed');
        }
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }

  scheduleAutoClear(delay: number = this.clearDelay): void {
    this.cancelAutoClear();
    
    this.clearTimeoutId = setTimeout(async () => {
      await this.attemptClear();
    }, delay);
  }

  cancelAutoClear(): void {
    if (this.clearTimeoutId) {
      clearTimeout(this.clearTimeoutId);
      this.clearTimeoutId = null;
    }
  }

  private async attemptClear(): Promise<void> {
    try {
      // First, check if the clipboard still contains our text
      if (navigator.clipboard && navigator.clipboard.readText) {
        try {
          const currentClipboard = await navigator.clipboard.readText();
          // If clipboard was changed by user, don't clear it
          if (currentClipboard !== this.lastCopiedText) {
            this.onClearAttempt?.(true); // Consider this a success since user changed it
            return;
          }
        } catch {
          // Reading clipboard failed, proceed with clearing attempt
        }
      }

      // Attempt to clear the clipboard
      if (document.hasFocus()) {
        await navigator.clipboard.writeText('');
        this.onClearAttempt?.(true);
      } else {
        // Document not focused, set up a visibility listener to clear when user returns
        this.setupVisibilityListener();
        this.onClearAttempt?.(false);
      }
    } catch (error) {
      console.warn('Could not auto-clear clipboard:', error);
      this.onClearAttempt?.(false);
    } finally {
      this.clearTimeoutId = null;
      this.lastCopiedText = '';
    }
  }

  private setupVisibilityListener(): void {
    const handleVisibilityChange = async () => {
      if (!document.hidden && document.hasFocus()) {
        try {
          // Check if our text is still in clipboard before clearing
          if (navigator.clipboard && navigator.clipboard.readText) {
            const currentClipboard = await navigator.clipboard.readText();
            if (currentClipboard === this.lastCopiedText) {
              await navigator.clipboard.writeText('');
              this.onClearAttempt?.(true);
            }
          } else {
            // Can't read, just attempt to clear
            await navigator.clipboard.writeText('');
            this.onClearAttempt?.(true);
          }
        } catch (error) {
          console.warn('Could not clear clipboard on focus return:', error);
        } finally {
          // Remove the listener after first attempt
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          this.lastCopiedText = '';
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up listener after 5 minutes max
    setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      this.lastCopiedText = '';
    }, 5 * 60 * 1000);
  }
}

// Export a singleton instance
export const clipboardManager = new SmartClipboard();

// Export a simple copy function for backward compatibility
export async function copyToClipboard(text: string): Promise<void> {
  return clipboardManager.copy(text);
}

// Export utility to set up auto-clear callback
export function setClipboardClearCallback(callback: (success: boolean) => void): void {
  clipboardManager.onClearAttempt = callback;
}