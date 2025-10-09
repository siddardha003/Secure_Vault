/**
 * Simple and reliable clipboard auto-clear utility
 * This implementation focuses on working reliably across different browser states
 */

interface ClipboardClearOptions {
  delay?: number;
  onClearSuccess?: () => void;
  onClearFailed?: () => void;
}

/**
 * Copy text to clipboard and schedule auto-clear
 */
export async function copyWithAutoClear(
  text: string, 
  options: ClipboardClearOptions = {}
): Promise<void> {
  const { 
    delay = 15000, 
    onClearSuccess, 
    onClearFailed 
  } = options;

  // First, copy the text
  try {
    await navigator.clipboard.writeText(text);
  } catch {
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
    } finally {
      document.body.removeChild(textArea);
    }
  }

  // Schedule auto-clear with multiple strategies
  scheduleClipboardClear(text, delay, onClearSuccess, onClearFailed);
}

/**
 * Schedule clipboard clearing with fallback strategies
 */
function scheduleClipboardClear(
  originalText: string,
  delay: number,
  onSuccess?: () => void,
  onFailed?: () => void
): void {
  
  // Strategy 1: Direct timeout (works when tab is active)
  setTimeout(async () => {
    try {
      await attemptClear(originalText);
      onSuccess?.();
    } catch {
      // Strategy 2: Set up visibility change listener for when user returns
      setupVisibilityBasedClear(originalText, onSuccess, onFailed);
    }
  }, delay);
}

/**
 * Attempt to clear clipboard
 */
async function attemptClear(originalText: string): Promise<void> {
  // Check if clipboard still contains our text
  try {
    const currentContent = await navigator.clipboard.readText();
    if (currentContent !== originalText) {
      // User has copied something else, don't clear
      return;
    }
  } catch {
    // Can't read clipboard, proceed with clearing anyway
  }

  // Clear the clipboard
  await navigator.clipboard.writeText('');
}

/**
 * Set up clearing when user returns to tab
 */
function setupVisibilityBasedClear(
  originalText: string,
  onSuccess?: () => void,
  onFailed?: () => void
): void {
  
  let cleared = false;
  
  const clearWhenVisible = async () => {
    if (cleared || document.hidden) return;
    
    try {
      await attemptClear(originalText);
      cleared = true;
      onSuccess?.();
      cleanup();
    } catch (error) {
      console.warn('Could not clear clipboard on visibility change:', error);
    }
  };

  const cleanup = () => {
    document.removeEventListener('visibilitychange', clearWhenVisible);
    document.removeEventListener('focus', clearWhenVisible);
    window.removeEventListener('focus', clearWhenVisible);
  };

  // Listen for various events that indicate user returned to tab
  document.addEventListener('visibilitychange', clearWhenVisible);
  document.addEventListener('focus', clearWhenVisible);
  window.addEventListener('focus', clearWhenVisible);

  // Cleanup after 5 minutes to prevent memory leaks
  setTimeout(() => {
    if (!cleared) {
      onFailed?.();
    }
    cleanup();
  }, 5 * 60 * 1000);
}