CREATE TABLE user (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(256) NOT NULL, -- Use appropriate hash length
    avatar_path VARCHAR(255),
    birthdate DATE NOT NULL,
    registeredAt DATE NOT NULL
);