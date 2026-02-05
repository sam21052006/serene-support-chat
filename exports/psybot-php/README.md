# Serene - Mental Health Companion (PHP/MySQL Version)

A compassionate AI companion for mental health support and mood tracking, built with PHP and MySQL for XAMPP.

## 📋 Requirements

- XAMPP (Apache, MySQL, PHP)
- Web browser

## 🚀 Installation

### Step 1: Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL**

### Step 2: Create Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click **"New"** to create a database
3. Enter database name: `serene_db`
4. Click **"Create"**
5. Select the `serene_db` database
6. Go to **"SQL"** tab
7. Copy the contents of `database/schema.sql` and paste it
8. Click **"Go"** to run the SQL

### Step 3: Copy Files
1. Navigate to your XAMPP installation folder
2. Go to `htdocs` folder
3. Create a new folder called `serene`
4. Copy ALL files from this folder into `htdocs/serene`

### Step 4: Configure Database (if needed)
If your MySQL has a password, edit `config/database.php`:
```php
define('DB_PASS', 'your_password_here');
```

### Step 5: Access the App
Open your browser and go to:
```
http://localhost/serene
```

## 📁 Project Structure

```
serene/
├── api/                    # Backend PHP APIs
│   ├── auth.php           # Authentication (login, register, logout)
│   ├── chat.php           # Chat functionality
│   └── mood.php           # Mood tracking
├── config/
│   └── database.php       # Database configuration
├── css/
│   └── style.css          # All styles
├── database/
│   └── schema.sql         # MySQL database schema
├── js/
│   ├── app.js             # Common utilities
│   ├── auth.js            # Authentication logic
│   ├── chat.js            # Chat page logic
│   └── mood.js            # Mood tracking logic
├── index.html             # Home page
├── auth.html              # Login/Signup page
├── chat.html              # Chat page
├── mood.html              # Mood tracking page
└── README.md              # This file
```

## 🗄️ Database Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts (email, password, display name) |
| `profiles` | User profiles |
| `chat_messages` | Conversation history |
| `mood_entries` | Mood tracking data |

## 🔐 Features

- **User Authentication**: Register, login, logout
- **Chat**: Talk with Serene AI companion (rule-based responses)
- **Mood Tracking**: Log and view mood history
- **Crisis Detection**: Detects concerning keywords and shows help resources

## 📚 Mapping to Your Syllabus

### HTML
- All `.html` files demonstrate semantic HTML5 structure
- Forms, inputs, buttons, navigation

### CSS
- `css/style.css` - CSS3 with variables, flexbox, grid, animations
- Responsive design with media queries

### PHP
- `api/*.php` - Backend API endpoints
- PDO for database connections
- Sessions for authentication
- Form handling and validation

### MySQL (RDBMS)
- `database/schema.sql` - Table creation with:
  - Primary keys
  - Foreign keys
  - Indexes
  - ENUM types
  - Timestamps

### Java Concepts (Translatable)
- Object-oriented approach in PHP classes
- Similar control structures (if/else, switch, loops)
- Exception handling (try/catch)

## ⚠️ Notes

- This is a simplified version for learning purposes
- The AI responses are rule-based (keyword matching)
- For production, you would integrate with OpenAI or similar API
- Passwords are securely hashed using PHP's `password_hash()`

## 🆘 Troubleshooting

### "Connection failed" error
- Make sure MySQL is running in XAMPP
- Check database name in `config/database.php`
- Verify username/password

### "404 Not Found" error
- Make sure files are in `htdocs/psybot`
- Check Apache is running

### Session issues
- Clear browser cookies
- Restart Apache

## 📖 Learning Resources

- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PDO Tutorial](https://www.php.net/manual/en/book.pdo.php)
- [HTML/CSS MDN](https://developer.mozilla.org/en-US/)

---

Built for educational purposes. Serene is a supportive companion - if you're in crisis, please contact a mental health professional.
