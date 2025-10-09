/**
 * Practical clipboard auto-clear utility
 * Since browsers prevent clipboard clearing when tabs are not focused,
 * this implementation focuses on user notifications and best-effort clearing
 */

interface ClipboardOptions {
  delay?: number;
  onCopySuccess?: () => void;
  onClearAttempt?: (success: boolean) => void;
  showUserWarning?: boolean;
}

/**
 * Copy text with smart auto-clear behavior
 */
export async function copyWithSmartClear(
  text: string, 
  options: ClipboardOptions = {}
): Promise<void> {
  const { 
    delay = 15000,
    onCopySuccess,
    onClearAttempt,
    showUserWarning = true
  } = options;

  // Step 1: Copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    onCopySuccess?.();
  } catch (error) {
    // Fallback for older browsers
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
      if (!success) throw new Error('Copy command failed');
      onCopySuccess?.();
    } finally {
      document.body.removeChild(textArea);
    }
  }

  // Step 2: Schedule clearing attempts
  setTimeout(async () => {
    const cleared = await attemptClipboardClear(text, showUserWarning);
    onClearAttempt?.(cleared);
  }, delay);
}

/**
 * Attempt to clear clipboard with user-friendly fallbacks
 */
async function attemptClipboardClear(originalText: string, showWarning: boolean): Promise<boolean> {
  // Strategy 1: Direct clear if document is focused
  if (document.hasFocus()) {
    try {
      // Verify our text is still there
      const currentContent = await navigator.clipboard.readText();
      if (currentContent === originalText) {
        await navigator.clipboard.writeText('');
        console.log('✅ Clipboard cleared automatically');
        return true;
      } else {
        console.log('ℹ️ Clipboard content changed by user - not clearing');
        return true; // User already changed it, so it's "cleared" from our perspective
      }
    } catch (error) {
      console.warn('❌ Could not clear clipboard directly:', error instanceof Error ? error.message : String(error));
    }
  }

  // Strategy 2: Set up listeners for when user returns
  if (showWarning) {
    setupReturnToTabClear(originalText);
  }

  return false;
}

/**
 * Set up clearing when user returns to tab
 */
function setupReturnToTabClear(originalText: string): void {
  let attempts = 0;
  const maxAttempts = 3;
  
  const clearOnReturn = async () => {
    if (attempts >= maxAttempts) {
      cleanup();
      return;
    }
    
    attempts++;
    
    try {
      // Verify our text is still there
      const currentContent = await navigator.clipboard.readText();
      if (currentContent === originalText) {
        await navigator.clipboard.writeText('');
        console.log('✅ Clipboard cleared when you returned to tab');
        showSecurityNotification('🔒 Clipboard cleared for security');
        cleanup();
      } else {
        console.log('ℹ️ Clipboard content changed by user');
        cleanup();
      }
    } catch (error) {
      console.warn(`❌ Clear attempt ${attempts} failed:`, error instanceof Error ? error.message : String(error));
      if (attempts >= maxAttempts) {
        showSecurityNotification('🔒 Please manually clear clipboard for security', true);
        cleanup();
      }
    }
  };

  const cleanup = () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', clearOnReturn);
  };

  const handleVisibilityChange = () => {
    if (!document.hidden && document.hasFocus()) {
      clearOnReturn();
    }
  };

  // Set up listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', clearOnReturn);

  // Auto-cleanup after 10 minutes
  setTimeout(() => {
    cleanup();
    showSecurityNotification('🔒 Please manually clear clipboard for security', true);
  }, 10 * 60 * 1000);
}

/**
 * Show security notification to user
 */
function showSecurityNotification(message: string, isWarning: boolean = false): void {
  // Create a temporary notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isWarning ? '#f59e0b' : '#10b981'};
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    max-width: 300px;
    word-wrap: break-word;
  `;

  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}