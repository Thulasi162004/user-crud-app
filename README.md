# User Details CRUD

A mini full-stack project for creating, viewing, updating, and deleting user records.

## Stack

- Frontend: React + JavaScript + CSS (Vite)
- Backend: Python + FastAPI + Motor
- Database: MongoDB

## Run locally

### 1. Start MongoDB

The quickest option is Docker:

```bash
docker compose up -d
```

Alternatively, set `MONGODB_URL` in `backend/.env` to an existing MongoDB instance.

### 2. Run the API

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 3. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/users` | List users |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/{id}` | Update a user |
| DELETE | `/api/users/{id}` | Delete a user |
