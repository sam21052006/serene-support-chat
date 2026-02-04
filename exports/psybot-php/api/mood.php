<?php
/**
 * PSYBOT - Mood Tracking API
 * Handles mood entries CRUD operations
 */

require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'add':
        addMood();
        break;
    case 'list':
        getMoods();
        break;
    case 'delete':
        deleteMood();
        break;
    case 'stats':
        getMoodStats();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

/**
 * Add a new mood entry
 */
function addMood() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $mood = $data['mood'] ?? '';
    $notes = $data['notes'] ?? '';
    
    $validMoods = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];
    
    if (!in_array($mood, $validMoods)) {
        echo json_encode(['error' => 'Invalid mood value']);
        return;
    }
    
    $userId = $_SESSION['user_id'];
    $conn = getConnection();
    
    $stmt = $conn->prepare("INSERT INTO mood_entries (user_id, mood, notes) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $mood, $notes]);
    
    echo json_encode([
        'success' => true,
        'id' => $conn->lastInsertId(),
        'message' => 'Mood entry saved successfully'
    ]);
}

/**
 * Get mood entries for the user
 */
function getMoods() {
    $userId = $_SESSION['user_id'];
    $conn = getConnection();
    
    // Get optional date range
    $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
    
    $stmt = $conn->prepare("
        SELECT id, mood, notes, created_at 
        FROM mood_entries 
        WHERE user_id = ? 
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        ORDER BY created_at DESC
    ");
    $stmt->execute([$userId, $days]);
    $entries = $stmt->fetchAll();
    
    echo json_encode(['entries' => $entries]);
}

/**
 * Delete a mood entry
 */
function deleteMood() {
    $data = json_decode(file_get_contents('php://input'), true);
    $entryId = intval($data['id'] ?? 0);
    
    if (!$entryId) {
        echo json_encode(['error' => 'Invalid entry ID']);
        return;
    }
    
    $userId = $_SESSION['user_id'];
    $conn = getConnection();
    
    // Ensure user owns this entry
    $stmt = $conn->prepare("DELETE FROM mood_entries WHERE id = ? AND user_id = ?");
    $stmt->execute([$entryId, $userId]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Entry not found or access denied']);
    }
}

/**
 * Get mood statistics
 */
function getMoodStats() {
    $userId = $_SESSION['user_id'];
    $conn = getConnection();
    
    // Get mood distribution
    $stmt = $conn->prepare("
        SELECT mood, COUNT(*) as count 
        FROM mood_entries 
        WHERE user_id = ? 
        GROUP BY mood
    ");
    $stmt->execute([$userId]);
    $distribution = $stmt->fetchAll();
    
    // Get recent trend
    $stmt = $conn->prepare("
        SELECT DATE(created_at) as date, mood 
        FROM mood_entries 
        WHERE user_id = ? 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ORDER BY created_at ASC
    ");
    $stmt->execute([$userId]);
    $trend = $stmt->fetchAll();
    
    echo json_encode([
        'distribution' => $distribution,
        'trend' => $trend
    ]);
}
?>
