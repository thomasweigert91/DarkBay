# Dark-Bay

Fullstack-Auktionsplattform für das neuefische Recap-Projekt.

## Projektstruktur

```text
dark-bay/
├── backend/              # NestJS REST API (Port 8000), TypeORM & Better Auth
├── frontend/             # Next.js Frontend (Port 3000)
├── compose.yml           # Docker Compose Orchestrierung (Postgres + Backend)
├── package.json          # Root-Skripte (gleichzeitiger Start von BE + FE)
└── README.md
```

## Schnelleinstieg

### Beide Server gleichzeitig starten (Empfohlen)

Aus dem Hauptverzeichnis:

```bash
npm run dev
```

_(Startet Backend auf Port 8000 und Next.js Frontend auf Port 3000 mit farbiger Ausgabe)_

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger:** [http://localhost:8000](http://localhost:8000) bzw. [http://localhost:8000/api](http://localhost:8000/api)

---

### Einzeln starten

#### Backend separat starten:

```bash
# Option 1: Aus dem Root-Verzeichnis
npm run dev:backend

# Option 2: Direkt im backend/ Ordner
cd backend
npm run start:dev
```

#### Frontend separat starten:

```bash
# Option 1: Aus dem Root-Verzeichnis
npm run dev:frontend

# Option 2: Direkt im frontend/ Ordner
cd frontend
npm run dev
```

---

### Mit Docker Compose starten (DB + Backend)

```bash
docker compose up --build
```
