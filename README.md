# Simple Notes App

Node.js note-taking app with Express, MySQL (via `mysql2`), and vanilla HTML/CSS/JS.

## Features

- Single-page list at `/` showing all notes with a **New note** button.
- Note page at `/:id` to edit a note with **Save** and **Delete** actions.
- Data stored in MySQL via Prisma.

## Prerequisites

- Node.js 18+ and npm
- A running MySQL instance

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure database:

   - Create a MySQL database (for example `notes_app`).
   - Create a `notes` table:

     ```sql
     CREATE TABLE notes (
       id INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       content TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     );
     ```

   - Configure your connection details in `.env`:

     ```bash
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=USER
     DB_PASSWORD=PASSWORD
     DB_NAME=notes_app
     ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## Scripts

- `npm run dev` – start the server with nodemon.
- `npm start` – start the server with Node.


