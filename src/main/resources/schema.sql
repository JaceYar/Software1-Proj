-- Stay & Shop Hotel Reservation System Schema
-- This file initializes the runtime SQLite database on first boot.

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    address TEXT,
    credit_card_number TEXT,
    credit_card_expiry TEXT,
    role TEXT NOT NULL DEFAULT 'GUEST', -- GUEST, CLERK, ADMIN
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS corporations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    billing_address TEXT,
    contact_email TEXT
);

CREATE TABLE IF NOT EXISTS guest_corporations (
    user_id INTEGER NOT NULL REFERENCES users(id),
    corporation_id INTEGER NOT NULL REFERENCES corporations(id),
    PRIMARY KEY (user_id, corporation_id)
);

CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT NOT NULL UNIQUE,
    floor INTEGER NOT NULL,              -- 1=Nature Retreat, 2=Urban Elegance, 3=Vintage Charm
    room_type TEXT NOT NULL,             -- SINGLE, DOUBLE, FAMILY, SUITE, DELUXE, STANDARD
    quality_level TEXT NOT NULL,         -- EXECUTIVE, BUSINESS, COMFORT, ECONOMY
    bed_type TEXT NOT NULL,              -- TWIN, FULL, QUEEN, KING
    num_beds INTEGER NOT NULL DEFAULT 1,
    smoking INTEGER NOT NULL DEFAULT 0,  -- 0=non-smoking, 1=smoking
    daily_rate REAL NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'AVAILABLE' -- AVAILABLE, OCCUPIED, MAINTENANCE
);

CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    rate REAL NOT NULL,
    rate_type TEXT NOT NULL DEFAULT 'STANDARD', -- STANDARD, PROMOTIONAL, GROUP, NON_REFUNDABLE
    status TEXT NOT NULL DEFAULT 'CONFIRMED',   -- CONFIRMED, CANCELLED, CHECKED_IN, CHECKED_OUT
    cancellation_fee REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    cancelled_at DATETIME
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,              -- CLOTHING, ACCESSORIES, ARTISANAL
    price REAL NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    description TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'CART', -- CART, PURCHASED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    purchased_at DATETIME
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_purchase REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    reservation_id INTEGER REFERENCES reservations(id),
    order_id INTEGER REFERENCES orders(id),
    total_amount REAL NOT NULL,
    paid INTEGER NOT NULL DEFAULT 0,
    corporation_id INTEGER REFERENCES corporations(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    paid_at DATETIME
);

-- Seed admin account (password: admin123)
INSERT OR IGNORE INTO users (username, password_hash, name, role)
VALUES ('admin', '$2a$10$ItW2gdw/otjmh.MWaZMF3e9qEhC4HbsAP2bCJZOS8.EsqfUUzcG.q', 'System Admin', 'ADMIN');

-- Seed some sample rooms
INSERT OR IGNORE INTO rooms (room_number, floor, room_type, quality_level, bed_type, num_beds, smoking, daily_rate, description) VALUES
('101', 1, 'SINGLE',   'ECONOMY',   'TWIN',  1, 0, 89.99,  'Nature Retreat single room with twin bed'),
('102', 1, 'DOUBLE',   'COMFORT',   'QUEEN', 1, 0, 129.99, 'Nature Retreat double room with queen bed'),
('103', 1, 'FAMILY',   'COMFORT',   'QUEEN', 2, 0, 179.99, 'Nature Retreat family room with two queen beds'),
('201', 2, 'SUITE',    'EXECUTIVE', 'KING',  1, 0, 299.99, 'Urban Elegance suite with king bed'),
('202', 2, 'DELUXE',   'BUSINESS',  'QUEEN', 1, 0, 199.99, 'Urban Elegance deluxe room with queen bed'),
('301', 3, 'STANDARD', 'ECONOMY',   'FULL',  1, 0, 79.99,  'Vintage Charm standard room with full bed'),
('302', 3, 'DELUXE',   'BUSINESS',  'QUEEN', 1, 1, 149.99, 'Vintage Charm deluxe smoking room');

-- Seed some sample products
INSERT OR IGNORE INTO products (name, category, price, stock_quantity, description) VALUES
('Hotel Branded T-Shirt',     'CLOTHING',    24.99, 50, 'Comfortable hotel logo t-shirt'),
('Artisan Honey Jar',          'ARTISANAL',   14.99, 30, 'Local wildflower honey'),
('Leather Keychain',           'ACCESSORIES', 12.99, 75, 'Handcrafted leather keychain'),
('Silk Scarf',                 'ACCESSORIES', 49.99, 20, 'Elegant silk scarf'),
('Handmade Candle Set',        'ARTISANAL',   29.99, 40, 'Set of 3 scented candles'),
('Hotel Robe',                 'CLOTHING',    79.99, 25, 'Plush cotton hotel robe');
