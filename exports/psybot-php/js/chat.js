/**
 * PSYBOT - Chat JavaScript
 * Handles chat functionality
 */

const API_BASE = 'api';
let isLoading = false;

/**
 * Initialize chat
 */
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAuth();
    if (!user) return;
    
    loadChatHistory();
    
    // Handle form submission
    document.getElementById('chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        
        if (message && !isLoading) {
            sendMessage(message);
            input.value = '';
        }
    });
});

/**
 * Load chat history
 */
async function loadChatHistory() {
    try {
        const response = await fetch(`${API_BASE}/chat.php?action=history`);
        const data = await response.json();
        
        if (data.messages && data.messages.length > 0) {
            document.getElementById('welcome').style.display = 'none';
            
            data.messages.forEach(msg => {
                addMessageToUI(msg.role, msg.content, msg.is_crisis_alert);
            });
            
            scrollToBottom();
        }
    } catch (error) {
        console.error('Failed to load chat history:', error);
    }
}

/**
 * Send message via quick prompt
 */
function sendQuickMessage(message) {
    if (!isLoading) {
        sendMessage(message);
    }
}

/**
 * Send a message
 */
async function sendMessage(message) {
    if (isLoading) return;
    
    // Hide welcome message
    document.getElementById('welcome').style.display = 'none';
    
    // Add user message to UI
    addMessageToUI('user', message);
    
    // Show loading
    isLoading = true;
    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;
    
    // Add loading indicator
    const loadingId = 'loading-' + Date.now();
    addLoadingIndicator(loadingId);
    
    try {
        const response = await fetch(`${API_BASE}/chat.php?action=send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        // Remove loading indicator
        removeLoadingIndicator(loadingId);
        
        if (data.error) {
            addMessageToUI('assistant', 'Sorry, something went wrong. Please try again.');
        } else {
            addMessageToUI('assistant', data.content, data.isCrisis);
            
            if (data.isCrisis) {
                document.getElementById('crisis-alert').style.display = 'flex';
            }
        }
    } catch (error) {
        removeLoadingIndicator(loadingId);
        addMessageToUI('assistant', 'Sorry, I couldn\'t process your message. Please try again.');
    } finally {
        isLoading = false;
        sendBtn.disabled = false;
        scrollToBottom();
    }
}

/**
 * Add message to UI
 */
function addMessageToUI(role, content, isCrisis = false) {
    const messagesArea = document.getElementById('messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}${isCrisis ? ' crisis' : ''}`;
    
    const avatar = role === 'assistant' ? '🤖' : '👤';
    
    // Process content for markdown-like formatting
    const formattedContent = formatContent(content);
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${formattedContent}</div>
    `;
    
    messagesArea.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Format message content (basic markdown support)
 */
function formatContent(content) {
    // Bold text
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Links
    content = content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Line breaks
    content = content.replace(/\n/g, '<br>');
    
    // Bullet points
    content = content.replace(/^- (.*)/gm, '• $1');
    
    return content;
}

/**
 * Add loading indicator
 */
function addLoadingIndicator(id) {
    const messagesArea = document.getElementById('messages');
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = id;
    loadingDiv.className = 'message assistant';
    loadingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="loading-dots">
                <span>●</span><span>●</span><span>●</span>
            </div>
        </div>
    `;
    
    messagesArea.appendChild(loadingDiv);
    scrollToBottom();
}

/**
 * Remove loading indicator
 */
function removeLoadingIndicator(id) {
    const loading = document.getElementById(id);
    if (loading) {
        loading.remove();
    }
}

/**
 * Scroll to bottom of messages
 */
function scrollToBottom() {
    const messagesArea = document.getElementById('messages');
    messagesArea.scrollTop = messagesArea.scrollHeight;
}
