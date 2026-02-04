<?php
/**
 * PSYBOT - Chat API
 * Handles chat messages and AI responses
 */

require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'send':
        sendMessage();
        break;
    case 'history':
        getHistory();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

/**
 * Crisis keywords for detection
 */
$CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', "don't want to live",
    'want to die', 'self harm', 'hurt myself', 'no point in living',
    'better off dead', 'end it all', 'take my life', 'suicidal'
];

/**
 * Check for crisis keywords
 */
function detectCrisis($message) {
    global $CRISIS_KEYWORDS;
    $lowerMessage = strtolower($message);
    
    foreach ($CRISIS_KEYWORDS as $keyword) {
        if (strpos($lowerMessage, $keyword) !== false) {
            return true;
        }
    }
    return false;
}

/**
 * Get crisis response
 */
function getCrisisResponse() {
    return "I'm deeply concerned about what you've shared, and I want you to know that you're not alone. Your life matters, and there are people who want to help.

**Please reach out to a crisis helpline immediately:**
- **National Suicide Prevention Lifeline (US):** 988 or 1-800-273-8255
- **Crisis Text Line:** Text HOME to 741741
- **International Association for Suicide Prevention:** https://www.iasp.info/resources/Crisis_Centres/

If you're in immediate danger, please call emergency services (911 in the US) or go to your nearest emergency room.

I'm here to listen and support you, but professional help is the most important step right now. You deserve care and support. 💙";
}

/**
 * Generate AI response (simple rule-based for demo)
 * In production, integrate with OpenAI or other AI API
 */
function generateAIResponse($message, $history) {
    // Simple keyword-based responses for demonstration
    $lowerMessage = strtolower($message);
    
    $responses = [
        'hello' => "Hello! I'm psybot, your mental wellness companion. How are you feeling today?",
        'hi' => "Hi there! I'm here to listen and support you. What's on your mind?",
        'sad' => "I'm sorry to hear you're feeling sad. It's okay to feel this way. Would you like to talk about what's troubling you?",
        'anxious' => "Anxiety can be really challenging. Try taking some deep breaths - inhale for 4 counts, hold for 4, exhale for 4. Would you like some more coping strategies?",
        'stressed' => "Stress is a common experience. Let's work through this together. What's causing you the most stress right now?",
        'happy' => "That's wonderful to hear! Celebrating positive moments is important. What's bringing you joy today?",
        'thank' => "You're welcome! Remember, I'm always here when you need to talk. Take care of yourself! 💙",
        'help' => "I'm here to help! You can talk to me about how you're feeling, and I'll do my best to provide support and coping strategies.",
        'calm' => "Let's practice a calming exercise together. Close your eyes, take a slow deep breath in through your nose, and exhale slowly through your mouth. Repeat this 5 times.",
        'sleep' => "Sleep issues can really affect mental health. Try creating a relaxing bedtime routine, avoid screens before bed, and keep your room dark and cool.",
    ];
    
    foreach ($responses as $keyword => $response) {
        if (strpos($lowerMessage, $keyword) !== false) {
            return $response;
        }
    }
    
    // Default response
    return "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you're feeling?";
}

/**
 * Send a message and get AI response
 */
function sendMessage() {
    $data = json_decode(file_get_contents('php://input'), true);
    $message = trim($data['message'] ?? '');
    
    if (empty($message)) {
        echo json_encode(['error' => 'Message cannot be empty']);
        return;
    }
    
    $userId = $_SESSION['user_id'];
    $conn = getConnection();
    
    // Check for crisis
    $isCrisis = detectCrisis($message);
    
    // Save user message
    $stmt = $conn->prepare("INSERT INTO chat_messages (user_id, role, content, is_crisis_alert) VALUES (?, 'user', ?, ?)");
    $stmt->execute([$userId, $message, $isCrisis ? 1 : 0]);
    
    // Generate response
    if ($isCrisis) {
        $aiResponse = getCrisisResponse();
    } else {
        // Get chat history for context
        $stmt = $conn->prepare("SELECT role, content FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 10");
        $stmt->execute([$userId]);
        $history = $stmt->fetchAll();
        
        $aiResponse = generateAIResponse($message, $history);
    }
    
    // Save AI response
    $stmt = $conn->prepare("INSERT INTO chat_messages (user_id, role, content, is_crisis_alert) VALUES (?, 'assistant', ?, ?)");
    $stmt->execute([$userId, $aiResponse, $isCrisis ? 1 : 0]);
    
    echo json_encode([
        'success' => true,
        'content' => $aiResponse,
        'isCrisis' => $isCrisis
    ]);
}

/**
 * Get chat history
 */
function getHistory() {
    $userId = $_SESSION['user_id'];
    $conn = getConnection();
    
    $stmt = $conn->prepare("SELECT id, role, content, is_crisis_alert, created_at FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC");
    $stmt->execute([$userId]);
    $messages = $stmt->fetchAll();
    
    echo json_encode(['messages' => $messages]);
}
?>
