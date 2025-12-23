-- Create sales_rep_invoices table
CREATE TABLE IF NOT EXISTS sales_rep_invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    sales_rep_id INT NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    total_amount DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('UNPAID', 'PAID', 'PARTIALLY_PAID', 'VOID') DEFAULT 'UNPAID',
    reference TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sales_rep_id) REFERENCES sales_reps(id)
);

-- Create sales_rep_invoice_items table
CREATE TABLE IF NOT EXISTS sales_rep_invoice_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit_price DECIMAL(15, 2) DEFAULT 0.00,
    total DECIMAL(15, 2) DEFAULT 0.00,
    FOREIGN KEY (invoice_id) REFERENCES sales_rep_invoices(invoice_id)
);
