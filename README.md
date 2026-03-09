# Sequence Matching

This is the repository of the [sequence matching tool](https://kesler20.github.io/sequence_matching)

![home](https://github.com/kesler20/sequence_matching/blob/master/sequence%20matching%20image.png)

# Getting Started
Follow the instruction guide at [seqMGuide](https://scribehow.com/shared/How_To_Submit_Data_and_Download_Results__gC83MR_rSq2MSATGuP2zkA)

or [SDIGuide](https://github.com/kesler20/sequence_matching/blob/master/supporting_information/HowToSubmitDataandDownloadResults_PDF_2024-12-04080111.357514.pdf)

> **Note**: Make sure that you have one of the BiopharmaFinder versions below

| Version | Release Date | Change Log                                                                                      | Validated | Reference                                                                                                     |
|---------|--------------|------------------------------------------------------------------------------------------------|-----------|---------------------------------------------------------------------------------------------------------------|
| 5.0     | 2023         | Workflow-driven experiment creation, method processing, and result review                      | ✅       | [Release Notes](https://assets.thermofisher.com/TFS-Assets/CMD/manuals/man-xcali-98421-biopharma-finder-50-release-manxcali98421-en.pdf) |
| 5.3     | 2024         | Enhanced peptide mapping, oligonucleotide analysis, intact protein analysis, top-down analysis | ❌       | [Product Page](https://www.thermofisher.com/order/catalog/product/B51001849)                                 |


# Architecture

The application consists of two parts:

- **Backend** – a [FastAPI](https://fastapi.tiangolo.com/) server (Python) that runs the sequence matching algorithm and streams results over a WebSocket connection. It listens on port **8000** by default.
- **Frontend** – a [React](https://react.dev/) single-page application that is deployed to **GitHub Pages**. It communicates with the backend over WebSocket (`wss://`) and HTTP (`https://`).

---

# Local Installation & Running

Follow these steps to install and run both the backend and the frontend on your machine for local development.

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| Python | 3.9 | Required for the backend |
| Node.js | 16 | Required for the frontend |
| npm | 8 | Bundled with Node.js |
| Git | any | |

## Backend (Python / FastAPI)

### 1. Create a virtual environment

**macOS / Linux (bash/zsh):**
```bash
python -m venv wiz-app-env
source wiz-app-env/bin/activate
```

**Windows (PowerShell):**
```powershell
python -m venv wiz-app-env
wiz-app-env\Scripts\Activate.ps1
```

### 2. Install the package and its dependencies

```bash
pip install -e .
```

### 3. Start the backend server

```bash
uvicorn server.app:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive API docs (Swagger UI) are served at `http://localhost:8000/docs`.

## Frontend (React)

### 1. Install JavaScript dependencies

```bash
npm install
```

### 2. Point the frontend at the local backend

Open `src/WebSocketApi.ts` and update the backend URL constant so it targets `localhost`:

```typescript
// src/WebSocketApi.ts
const WS_REACT_APP_BACKEND_URL_DEV = "ws://localhost:8000";
```

Open `src/components/VerticalStepperComponent.tsx` and update the HTTP URL constant as well:

```typescript
// src/components/VerticalStepperComponent.tsx
const REACT_APP_BACKEND_URL_DEV = "http://localhost:8000";
```

### 3. Start the React development server

```bash
npm start
```

The frontend will be available at `http://localhost:3000` and will automatically reload when you edit source files.

---

# Docker

Docker images are provided for both services. Build them from the repository root.

## Backend

### Build the image

```bash
docker build -f Dockerfile.backend -t sequence-matching-backend .
```

### Run the container

```bash
docker run -p 8000:8000 sequence-matching-backend
```

The `-p 8000:8000` flag maps port **8000** inside the container to port **8000** on your host machine, so the API is reachable at `http://localhost:8000`.

To run in detached (background) mode:

```bash
docker run -d -p 8000:8000 --name seq-backend sequence-matching-backend
```

Stop it later with:

```bash
docker stop seq-backend
```

## Frontend

### Build the image

```bash
docker build -f Dockerfile.frontend -t sequence-matching-frontend .
```

### Run the container

```bash
docker run -p 3000:3000 sequence-matching-frontend
```

The frontend will be available at `http://localhost:3000`.

## Running Both Services Together

You can start both containers at the same time using separate terminal windows, or chain the commands:

```bash
# Terminal 1 – backend
docker run -p 8000:8000 --name seq-backend sequence-matching-backend

# Terminal 2 – frontend
docker run -p 3000:3000 --name seq-frontend sequence-matching-frontend
```

---

# Deploying the Backend so the GitHub Pages Frontend Can Use It

The frontend is hosted on **GitHub Pages** (HTTPS). Because browsers block mixed content, the backend **must also be served over HTTPS** for the GitHub Pages frontend to connect to it.

## Option 1 – Deploy to a Cloud Platform (recommended for production)

The repository is pre-configured for [Railway](https://railway.app/) via `railway.toml` and `Dockerfile.backend`. Push the repository to Railway and it will automatically build and deploy the backend, providing a public `https://` URL.

1. Create a Railway project and link this repository.
2. Railway will detect `railway.toml` and build the backend image.
3. Copy the deployment URL (e.g. `https://your-app.up.railway.app`).
4. Update the URL constants in the frontend source files:
   - `src/WebSocketApi.ts` → set `WS_REACT_APP_BACKEND_URL_DEV` to `wss://your-app.up.railway.app`
   - `src/components/VerticalStepperComponent.tsx` → set `REACT_APP_BACKEND_URL_DEV` to `https://your-app.up.railway.app`
5. Commit and push; the GitHub Actions workflow will redeploy the frontend to GitHub Pages.

Other platforms that work with `Dockerfile.backend` include [Render](https://render.com/), [Fly.io](https://fly.io/), and any VPS running Docker.

## Option 2 – Expose a Local Docker Container with ngrok (for temporary / testing use)

If you want to test the GitHub Pages frontend against a backend running on your local machine, you can use [ngrok](https://ngrok.com/) to create a secure public HTTPS tunnel.

### Prerequisites

Install ngrok: https://ngrok.com/download

### Steps

1. Start the backend container (see the Docker section above):
   ```bash
   docker run -p 8000:8000 sequence-matching-backend
   ```

2. In a second terminal, start an ngrok tunnel to port 8000:
   ```bash
   ngrok http 8000
   ```

3. ngrok will print a public URL such as `https://<your-ngrok-subdomain>.ngrok-free.app`. Copy it.

4. Update the frontend URL constants so the browser connects to your tunnel (replace `<your-ngrok-subdomain>` with the value from step 3):
   - `src/WebSocketApi.ts` → `wss://<your-ngrok-subdomain>.ngrok-free.app`
   - `src/components/VerticalStepperComponent.tsx` → `https://<your-ngrok-subdomain>.ngrok-free.app`

5. Rebuild and redeploy the frontend, or run `npm start` locally and open the app in your browser.

> **Note**: The free ngrok URL changes every time you restart the tunnel. For a stable URL, use a paid ngrok plan or deploy to a cloud platform (Option 1).

## Option 3 – Self-host on a VPS or Server

1. SSH into your server and ensure Docker is installed.
2. Clone this repository and build the backend image:
   ```bash
   git clone https://github.com/kesler20/sequence_matching.git
   cd sequence_matching
   docker build -f Dockerfile.backend -t sequence-matching-backend .
   ```
3. Run the container, forwarding port 8000 to the host:
   ```bash
   docker run -d -p 8000:8000 --name seq-backend --restart unless-stopped sequence-matching-backend
   ```
4. Set up a reverse proxy (e.g. [nginx](https://nginx.org/) or [Caddy](https://caddyserver.com/)) with an SSL certificate (e.g. from [Let's Encrypt](https://letsencrypt.org/)) so the backend is reachable as `https://your-domain.com`.
5. Update the frontend URL constants and redeploy.

---

# GitHub Pages Deployment

The frontend is automatically deployed to GitHub Pages when changes are pushed to the `master` branch. The workflow is defined in `.github/workflows/ci-cd-gh-pages.yml` and performs the following steps:

1. Installs dependencies with `pnpm`.
2. Runs TypeScript type checking.
3. Builds the production bundle (`pnpm run build`).
4. Deploys the `dist/` folder to GitHub Pages.

The live frontend URL is shown in the repository's **Environments** section on GitHub.

---

# Configuration

| Location | Constant | Default value | Description |
|----------|----------|---------------|-------------|
| `src/WebSocketApi.ts` | `WS_REACT_APP_BACKEND_URL_DEV` | `wss://wiz-app-production.up.railway.app` | WebSocket base URL used by the frontend |
| `src/components/VerticalStepperComponent.tsx` | `REACT_APP_BACKEND_URL_DEV` | `https://wiz-app-production.up.railway.app` | HTTP base URL used for downloading results |
| `src/server/app.py` | `FRONT_END_URL` | `https://wiz-app.up.railway.app` | Frontend origin added to the backend CORS allow-list |

When deploying to a new environment, update all three values so the frontend and backend can communicate.

---

# TODOs
- [ ] provide the .gist with the credentials
