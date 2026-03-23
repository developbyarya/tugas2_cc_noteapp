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

## Routes

### Public (HTML) routes

- **GET `/`**
  - **Description**: Homepage. Shows list of notes and a **New note** button.
  - **Request body**: none.
  - **Response**: HTML (`public/index.html`).
- **GET `/:id`**
  - **Description**: Single note page. Displays an editor for the note with Save/Delete.
  - **Request params**:
    - `id` (path param, number) – note ID.
  - **Request body**: none.
  - **Response**: HTML (`public/note.html`).

### JSON API routes

- **GET `/api/notes`**
  - **Description**: List all notes ordered by most recently updated.
  - **Request body**: none.
  - **Response**: `200 OK`
    - Body (JSON array):
      ```json
      [
        {
          "id": 1,
          "title": "Example title",
          "content": "Note content",
          "updatedAt": "2026-03-16T07:00:00.000Z"
        }
      ]
      ```
- **POST `/api/notes`**
  - **Description**: Create a new note.
  - **Request body** (`application/json`):
    ```json
    {
      "title": "Optional title (defaults to 'Untitled note')",
      "content": "Optional content (defaults to empty string)"
    }
    ```
  - **Response**: `201 Created`
    - Body (JSON object, newly created note):
      ```json
      {
        "id": 1,
        "title": "Untitled note",
        "content": "",
        "updatedAt": "2026-03-16T07:00:00.000Z"
      }
      ```
- **GET `/api/notes/:id`**
  - **Description**: Get a single note by ID.
  - **Request params**:
    - `id` (path param, number) – note ID.
  - **Request body**: none.
  - **Responses**:
    - `200 OK` with JSON note object (same shape as above).
    - `400 Bad Request` if `id` is not a number.
    - `404 Not Found` if note does not exist.
- **PUT `/api/notes/:id`**
  - **Description**: Update an existing note.
  - **Request params**:
    - `id` (path param, number) – note ID.
  - **Request body** (`application/json`):
    ```json
    {
      "title": "New title",
      "content": "New content"
    }
    ```
  - **Responses**:
    - `200 OK` with updated note JSON.
    - `400 Bad Request` if `id` is not a number.
    - `404 Not Found` if note does not exist.
  - **DELETE `/api/notes/:id`**
    - **Description**: Delete a note.
    - **Request params**:
      - `id` (path param, number) – note ID.
    - **Request body**: none.
    - **Responses**:
      - `204 No Content` on success.
      - `400 Bad Request` if `id` is not a number.
      - `404 Not Found` if note does not exist.

