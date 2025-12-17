-- Create sales_reps table
CREATE TABLE IF NOT EXISTS sales_reps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    unique_id VARCHAR(50) NOT NULL UNIQUE,
    debt DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create product_requests table
CREATE TABLE IF NOT EXISTS product_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sales_rep_id INT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'DECLINED') DEFAULT 'PENDING',
    total_amount DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sales_rep_id) REFERENCES sales_reps(id)
);

-- Create request_items table
CREATE TABLE IF NOT EXISTS request_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(15, 2) DEFAULT 0.00,
    total_price DECIMAL(15, 2) DEFAULT 0.00,
    FOREIGN KEY (request_id) REFERENCES product_requests(id)
);
