-- Database setup for MicroSwarm application
-- PostgreSQL version

DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE devices (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Insert sample data for testing
INSERT INTO users (id, email) VALUES 
    ('1', 'alice@example.com'),
    ('2', 'bob@example.com'),
    ('3', 'charlie@example.com');

INSERT INTO devices (id, name, user_id) VALUES
    ('1', 'Temperature Sensor 1', '1'),
    ('2', 'Humidity Sensor 1', '1'),
    ('3', 'Motion Detector 1', '2'),
    ('4', 'Light Sensor 1', '2'),
    ('5', 'Pressure Sensor 1', '3');

