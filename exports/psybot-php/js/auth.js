/**
 * PSYBOT - Authentication JavaScript
 * Handles login and signup forms
 */

const API_BASE = 'api';

/**
 * Show login form
 */
function showLogin() {
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('signup-tab').classList.remove('active');
    document.getElementById('auth-title').textContent = 'Welcome Back';
    document.getElementById('auth-subtitle').textContent = 'Sign in to continue your wellness journey';
}

/**
 * Show signup form
 */
function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'flex';
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('signup-tab').classList.add('active');
    document.getElementById('auth-title').textContent = 'Create Account';
    document.getElementById('auth-subtitle').textContent = 'Start your wellness journey today';
}

/**
 * Handle login form submission
 */
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    errorDiv.textContent = '';
    
    try {
        const response = await fetch(`${API_BASE}/auth.php?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.error) {
            errorDiv.textContent = data.error;
        } else if (data.success) {
            window.location.href = 'chat.html';
        }
    } catch (error) {
        errorDiv.textContent = 'An error occurred. Please try again.';
    }
});

/**
 * Handle signup form submission
 */
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const displayName = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorDiv = document.getElementById('signup-error');
    
    errorDiv.textContent = '';
    
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth.php?action=register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, display_name: displayName })
        });
        
        const data = await response.json();
        
        if (data.error) {
            errorDiv.textContent = data.error;
        } else if (data.success) {
            window.location.href = 'chat.html';
        }
    } catch (error) {
        errorDiv.textContent = 'An error occurred. Please try again.';
    }
});

/**
 * Check if already logged in
 */
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${API_BASE}/auth.php?action=check`);
    const data = await response.json();
    
    if (data.authenticated) {
        window.location.href = 'chat.html';
    }
});
