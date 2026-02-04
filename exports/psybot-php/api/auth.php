<?php
/**
 * PSYBOT - Authentication API
 * Handles user registration, login, and logout
 */

require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        register();
        break;
    case 'login':
        login();
        break;
    case 'logout':
        logout();
        break;
    case 'check':
        checkAuth();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

/**
 * Register a new user
 */
function register() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $password = $data['password'] ?? '';
    $displayName = $data['display_name'] ?? '';
    
    // Validation
    if (!$email) {
        echo json_encode(['error' => 'Invalid email address']);
        return;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['error' => 'Password must be at least 6 characters']);
        return;
    }
    
    $conn = getConnection();
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        echo json_encode(['error' => 'Email already registered']);
        return;
    }
    
    // Hash password and insert user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    try {
        $conn->beginTransaction();
        
        $stmt = $conn->prepare("INSERT INTO users (email, password, display_name) VALUES (?, ?, ?)");
        $stmt->execute([$email, $hashedPassword, $displayName]);
        $userId = $conn->lastInsertId();
        
        // Create profile
        $stmt = $conn->prepare("INSERT INTO profiles (user_id, display_name) VALUES (?, ?)");
        $stmt->execute([$userId, $displayName]);
        
        $conn->commit();
        
        // Set session
        $_SESSION['user_id'] = $userId;
        $_SESSION['email'] = $email;
        $_SESSION['display_name'] = $displayName;
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $userId,
                'email' => $email,
                'display_name' => $displayName
            ]
        ]);
    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
    }
}

/**
 * Login user
 */
function login() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $password = $data['password'] ?? '';
    
    if (!$email || !$password) {
        echo json_encode(['error' => 'Email and password required']);
        return;
    }
    
    $conn = getConnection();
    
    $stmt = $conn->prepare("SELECT id, email, password, display_name FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password'])) {
        echo json_encode(['error' => 'Invalid email or password']);
        return;
    }
    
    // Set session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['display_name'] = $user['display_name'];
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'display_name' => $user['display_name']
        ]
    ]);
}

/**
 * Logout user
 */
function logout() {
    session_destroy();
    echo json_encode(['success' => true]);
}

/**
 * Check if user is authenticated
 */
function checkAuth() {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'email' => $_SESSION['email'],
                'display_name' => $_SESSION['display_name']
            ]
        ]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
}
?>
