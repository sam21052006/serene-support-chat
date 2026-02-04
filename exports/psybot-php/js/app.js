/**
 * PSYBOT - Main Application JavaScript
 * Common functions and utilities
 */

const API_BASE = 'api';

/**
 * Check if user is authenticated
 */
async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE}/auth.php?action=check`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Auth check failed:', error);
        return { authenticated: false };
    }
}

/**
 * Logout user
 */
async function logout() {
    try {
        await fetch(`${API_BASE}/auth.php?action=logout`);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

/**
 * Redirect to login if not authenticated
 */
async function requireAuth() {
    const auth = await checkAuth();
    if (!auth.authenticated) {
        window.location.href = 'auth.html';
        return null;
    }
    return auth.user;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 24 hours
    if (diff < 86400000) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Less than 7 days
    if (diff < 604800000) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    return date.toLocaleDateString();
}

/**
 * Get mood emoji
 */
function getMoodEmoji(mood) {
    const emojis = {
        'very_sad': '😢',
        'sad': '😔',
        'neutral': '😐',
        'happy': '😊',
        'very_happy': '😄'
    };
    return emojis[mood] || '😐';
}

/**
 * Get mood label
 */
function getMoodLabel(mood) {
    const labels = {
        'very_sad': 'Very Sad',
        'sad': 'Sad',
        'neutral': 'Neutral',
        'happy': 'Happy',
        'very_happy': 'Very Happy'
    };
    return labels[mood] || 'Unknown';
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Simple alert for now - can be replaced with toast notification
    alert(message);
}

/**
 * Update auth buttons in navbar
 */
async function updateAuthButtons() {
    const authButtons = document.getElementById('auth-buttons');
    if (!authButtons) return;
    
    const auth = await checkAuth();
    
    if (auth.authenticated) {
        authButtons.innerHTML = `
            <button class="btn btn-secondary" onclick="logout()">Sign Out</button>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthButtons();
});
