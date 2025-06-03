CREATE DATABASE IF NOT EXISTS finance_app;
USE finance_app;


CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid(),
    name VARCHAR(100) NOT NULL,
    type ENUM('bank', 'cash', 'digital', 'crypto') DEFAULT 'bank',
    balance DECIMAL(10, 2) DEFAULT 0,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE users
ADD COLUMN current_account_id VARCHAR(36),
ADD FOREIGN KEY (current_account_id) REFERENCES accounts(id) ON DELETE SET NULL;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    emoji VARCHAR(64) NOT NULL DEFAULT 🚀,
    account_id VARCHAR(36),
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE clients (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    account_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    date DATE NOT NULL,
    is_scheduled BOOLEAN DEFAULT FALSE,
    scheduled_date DATE DEFAULT NULL,
    confirmed BOOLEAN DEFAULT NULL,
    recurrence ENUM('none', 'daily', 'weekly', 'monthly', 'yearly') DEFAULT 'none',
    account_id VARCHAR(36) NOT NULL,
    category_id INT NOT NULL,
    client_id VARCHAR(36),
    payment_method_id INT, 
    user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (account_id)  REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id)   REFERENCES clients(id) ON DELETE SET NULL, 
    FOREIGN KEY (payment_method_id)  REFERENCES payment_methods(id) ON DELETE SET NULL, 
    FOREIGN KEY (user_id)  REFERENCES users(id)
);

CREATE TABLE history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day DATE NOT NULL,
    month INT GENERATED ALWAYS AS (MONTH(day)) STORED,
    year INT GENERATED ALWAYS AS (YEAR(day)) STORED,
    total_income DECIMAL(10, 2) DEFAULT 0,
    total_expense DECIMAL(10, 2) DEFAULT 0,
    net_balance DECIMAL(10, 2) GENERATED ALWAYS AS (total_income - total_expense) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);