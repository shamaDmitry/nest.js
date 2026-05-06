# NestJS Books API

A robust NestJS-based REST API for managing a book collection, featuring PostgreSQL persistence via TypeORM, multi-stage Docker builds, and pagination support.

## Features

- **CRUD Operations**: Manage books with a full set of RESTful endpoints.
- **Persistent Storage**: Integrated with **PostgreSQL** using **TypeORM**.
- **Pagination**: Built-in support for paginated results with metadata.
- **Dockerized**: Multi-stage `Dockerfile` and `docker-compose.yml` for easy development and deployment.
- **Validation**: Strict DTO enforcement using `class-validator` and `ValidationPipe`.

## Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- Node.js (v22+) (Optional, for local development without Docker)

## Getting Started

### 1. Setup Environment
Copy the example environment file and adjust the values if necessary:
```bash
cp .env.example .env
```

### 2. Run with Docker Compose
The easiest way to start the API and the database is using Docker Compose:
```bash
docker-compose up --build
```
The API will be available at `http://localhost:3000`.

### 3. Local Development (without Docker for API)
If you want to run the API locally but keep the database in Docker:
1. Start only the database:
   ```bash
   docker-compose up db -d
   ```
2. Install dependencies and start the app:
   ```bash
   npm install
   npm run start:dev
   ```

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/books` | Create a new book |
| `GET` | `/books` | Get all books (paginated) |
| `GET` | `/books/:id` | Get a specific book |
| `PATCH` | `/books/:id` | Update a book |
| `DELETE` | `/books/:id` | Remove a book |

### Pagination Query Parameters
- `limit`: Number of items per page (default: 10)
- `offset`: Number of items to skip (default: 0)

## Deployment

### Self-Hosting (e.g., Coolify)
This project is ready for self-hosting platforms like [Coolify](https://coolify.io/):
1. Point Coolify to your repository.
2. Coolify will automatically detect the `Dockerfile`.
3. Set the required Environment Variables (`DATABASE_URL`, `DATABASE_USER`, etc.) in the Coolify dashboard.
4. Coolify will handle the build and deployment process.

## License
UNLICENSED
