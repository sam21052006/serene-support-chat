/**
 * PSYBOT - Mood Tracking JavaScript
 * Handles mood tracking functionality
 */

const API_BASE = 'api';
let selectedMood = null;

/**
 * Initialize mood tracker
 */
document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAuth();
    if (!user) return;
    
    loadMoodHistory();
});

/**
 * Select a mood
 */
function selectMood(mood) {
    // Remove previous selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
    selectedBtn.classList.add('selected');
    
    selectedMood = mood;
    
    // Enable save button
    document.getElementById('save-mood-btn').disabled = false;
}

/**
 * Save mood entry
 */
async function saveMood() {
    if (!selectedMood) return;
    
    const notes = document.getElementById('mood-notes').value.trim();
    const saveBtn = document.getElementById('save-mood-btn');
    
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        const response = await fetch(`${API_BASE}/mood.php?action=add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood: selectedMood, notes })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Reset form
            selectedMood = null;
            document.querySelectorAll('.mood-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            document.getElementById('mood-notes').value = '';
            
            // Reload history
            loadMoodHistory();
            
            showNotification('Mood saved successfully!');
        } else {
            showNotification(data.error || 'Failed to save mood');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.');
    } finally {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Save Mood Entry';
    }
}

/**
 * Load mood history
 */
async function loadMoodHistory() {
    const historyDiv = document.getElementById('mood-history');
    
    try {
        const response = await fetch(`${API_BASE}/mood.php?action=list&days=30`);
        const data = await response.json();
        
        if (data.entries && data.entries.length > 0) {
            historyDiv.innerHTML = data.entries.map(entry => `
                <div class="mood-entry">
                    <div class="mood-entry-emoji">${getMoodEmoji(entry.mood)}</div>
                    <div class="mood-entry-info">
                        <div class="mood-entry-date">${formatDate(entry.created_at)} - ${getMoodLabel(entry.mood)}</div>
                        ${entry.notes ? `<div class="mood-entry-notes">${entry.notes}</div>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            historyDiv.innerHTML = '<p class="loading">No mood entries yet. Start tracking your mood above!</p>';
        }
    } catch (error) {
        historyDiv.innerHTML = '<p class="loading">Failed to load mood history.</p>';
    }
}
