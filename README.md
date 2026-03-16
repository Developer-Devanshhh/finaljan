<p align="center">
  <h1 align="center">JanVedha AI</h1>
  <p align="center">
    <strong>AI-Powered Civic Issue Management Platform for Smart Governance</strong>
  </p>
  <p align="center">
    Transforming citizen-government interaction through intelligent complaint processing, real-time tracking, and transparent accountability.
  </p>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Overview

JanVedha AI is a comprehensive civic issue management system designed to streamline the process of reporting, tracking, and resolving municipal complaints. The platform leverages artificial intelligence to automatically classify complaints, determine priority, route issues to appropriate departments, and provide actionable suggestions for resolution.

### Key Highlights

- **5-Stage AI Pipeline**: Classifier → Router → Priority → Suggestion → Memory agents working in sequence
- **Multi-Channel Intake**: Web portal, WhatsApp, Telegram, Voice calls, and social media monitoring
- **Real-Time Transparency**: Citizens can track complaints with unique ticket codes
- **Performance Accountability**: Public ward leaderboards and department performance metrics
- **DPDP Compliant**: Built with data privacy regulations in mind

---

## Features

### For Citizens
| Feature | Description |
|---------|-------------|
| **Easy Complaint Submission** | Submit issues via web form with photo upload and location detection |
| **Ticket Tracking** | Track complaint status in real-time using a unique ticket code |
| **AI Chatbot** | Get guidance and check ticket status through conversational AI |
| **Ward Performance** | View transparency leaderboards showing ward-wise resolution rates |
| **Interactive Map** | Explore heatmaps of civic issues across the city |

### For Government Officers
| Feature | Description |
|---------|-------------|
| **Smart Dashboard** | Role-based dashboards with KPIs, charts, and ticket management |
| **AI Suggestions** | Receive actionable recommendations for resolving issues |
| **Calendar Integration** | Schedule and manage fieldwork with calendar views |
| **Work Verification** | AI-powered before/after photo comparison to verify completion |
| **Department Dashboards** | Specialized views for Water, Sanitation, and Electrical departments |

### For Administrators
| Feature | Description |
|---------|-------------|
| **City-Wide Analytics** | Comprehensive overview of all wards and departments |
| **SLA Monitoring** | Track deadline breaches and escalate overdue tickets |
| **User Management** | Manage officers, field staff, and permissions |
| **Report Generation** | Export detailed reports for governance review |

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              JANVEDHA AI                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Web App   │    │  WhatsApp   │    │  Telegram   │    │ Voice/IVR   │  │
│  │  (Next.js)  │    │    Bot      │    │    Bot      │    │   (Future)  │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘  │
│         │                  │                  │                  │          │
│         └──────────────────┼──────────────────┼──────────────────┘          │
│                            │                  │                             │
│                            ▼                  ▼                             │
│                   ┌────────────────────────────────┐                        │
│                   │       FastAPI Backend          │                        │
│                   │   ┌────────────────────────┐   │                        │
│                   │   │     AI Pipeline        │   │                        │
│                   │   │  ┌───────────────────┐ │   │                        │
│                   │   │  │ 1. Classifier     │ │   │                        │
│                   │   │  │ 2. Router         │ │   │                        │
│                   │   │  │ 3. Priority (ML)  │ │   │                        │
│                   │   │  │ 4. Suggestions    │ │   │                        │
│                   │   │  │ 5. Memory         │ │   │                        │
│                   │   │  └───────────────────┘ │   │                        │
│                   │   └────────────────────────┘   │                        │
│                   └────────────────────────────────┘                        │
│                            │                  │                             │
│              ┌─────────────┴───────┐   ┌──────┴───────────────┐             │
│              ▼                     ▼   ▼                      ▼             │
│      ┌─────────────┐      ┌─────────────┐      ┌─────────────────────┐     │
│      │   MongoDB   │      │    Redis    │      │   External Services  │     │
│      │  (Beanie)   │      │   (Cache)   │      │  (SMS/Email/Storage) │     │
│      └─────────────┘      └─────────────┘      └─────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### AI Pipeline Architecture

The AI pipeline processes each complaint through 5 specialized agents:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AI PIPELINE FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │  CLASSIFIER  │───▶│    ROUTER    │───▶│   PRIORITY   │                 │
│   │    Agent     │    │    Agent     │    │    Agent     │                 │
│   └──────────────┘    └──────────────┘    └──────────────┘                 │
│         │                    │                    │                         │
│         │ • Department       │ • Final routing    │ • Score (0-10)         │
│         │ • Category         │ • Escalation       │ • Label (Critical/     │
│         │ • Summary          │ • Reasoning        │   High/Medium/Low)     │
│         │ • Language         │                    │ • ML + Rules hybrid    │
│         │ • Confidence       │                    │                         │
│         │                    │                    │                         │
│         └────────────────────┴────────────────────┘                         │
│                              │                                              │
│                              ▼                                              │
│              ┌───────────────────────────────────┐                          │
│              │         PARALLEL EXECUTION        │                          │
│              │  ┌─────────────┐ ┌─────────────┐  │                          │
│              │  │ SUGGESTION  │ │   MEMORY    │  │                          │
│              │  │   Agent     │ │   Agent     │  │                          │
│              │  └─────────────┘ └─────────────┘  │                          │
│              │        │               │          │                          │
│              │  3 Actionable    Seasonal Alerts  │                          │
│              │  Recommendations  Pattern Memory  │                          │
│              └───────────────────────────────────┘                          │
│                              │                                              │
│                              ▼                                              │
│                    ┌─────────────────┐                                      │
│                    │ AIPipelineResult │                                     │
│                    └─────────────────┘                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

#### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library with latest features |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Accessible component library |
| **React Hook Form + Zod** | Form handling and validation |
| **Recharts** | Data visualization |
| **React-Leaflet** | Interactive maps |
| **Framer Motion** | Animations |
| **SWR** | Data fetching and caching |

#### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python web framework |
| **Beanie ODM** | Async MongoDB document mapper |
| **LangChain** | LLM orchestration framework |
| **Google Gemini** | AI/LLM for classification and suggestions |
| **scikit-learn** | ML models for priority scoring |
| **Redis** | Caching and session management |
| **Celery** | Background task processing |

#### Integrations
| Service | Purpose |
|---------|---------|
| **Twilio** | SMS and WhatsApp messaging |
| **MSG91** | SMS gateway (India) |
| **SendGrid** | Email notifications |
| **Telegram Bot API** | Telegram integration |
| **MinIO/S3** | File storage |
| **Google Maps** | Geocoding and maps |

---

## Project Structure

```
janvedha-ai/
├── frontend/                          # Next.js 16 Application
│   ├── src/
│   │   ├── app/                       # App Router Pages
│   │   │   ├── (public)/              # Public pages
│   │   │   │   ├── page.tsx           # Home - Complaint submission
│   │   │   │   ├── track/             # Ticket tracking
│   │   │   │   ├── map/               # Issue heatmap
│   │   │   │   └── ward-performance/  # Leaderboard
│   │   │   ├── officer/               # Officer portal
│   │   │   │   ├── dashboard/         # Main dashboard
│   │   │   │   ├── tickets/           # Ticket management
│   │   │   │   ├── calendar/          # Scheduling
│   │   │   │   └── reports/           # Reporting
│   │   │   ├── councillor/            # Councillor portal
│   │   │   ├── commissioner/          # Commissioner portal
│   │   │   └── layout.tsx             # Root layout
│   │   ├── components/                # Reusable components
│   │   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── NavBar.tsx             # Navigation
│   │   │   ├── kpi-card.tsx           # Dashboard KPI cards
│   │   │   ├── ticket-table.tsx       # Ticket listing
│   │   │   └── StatusBadge.tsx        # Status indicators
│   │   ├── context/                   # React Context providers
│   │   │   └── AuthContext.tsx        # Authentication state
│   │   ├── features/                  # Feature modules
│   │   │   └── chatbot/               # AI chatbot widget
│   │   ├── hooks/                     # Custom React hooks
│   │   └── lib/                       # Utilities
│   │       ├── api.ts                 # API client
│   │       ├── constants.ts           # App constants
│   │       └── formatters.ts          # Data formatters
│   ├── public/                        # Static assets
│   ├── components.json                # shadcn/ui config
│   ├── next.config.ts                 # Next.js config
│   ├── tailwind.config.ts             # Tailwind config
│   └── package.json
│
├── backend/                           # FastAPI Application
│   ├── app/
│   │   ├── api/                       # API Route Handlers
│   │   │   ├── public.py              # Public endpoints
│   │   │   ├── auth.py                # Authentication
│   │   │   ├── officer.py             # Officer endpoints
│   │   │   ├── councillor.py          # Councillor endpoints
│   │   │   ├── commissioner.py        # Commissioner endpoints
│   │   │   ├── chat.py                # AI chatbot API
│   │   │   ├── calendar.py            # Calendar API
│   │   │   └── webhooks.py            # External webhooks
│   │   ├── core/                      # Core Utilities
│   │   │   ├── config.py              # App configuration
│   │   │   └── auth.py                # JWT authentication
│   │   ├── mongodb/                   # Database Layer
│   │   │   ├── database.py            # Connection management
│   │   │   ├── models/                # Beanie documents
│   │   │   │   ├── ticket.py          # Ticket model
│   │   │   │   ├── user.py            # User model
│   │   │   │   ├── department.py      # Department model
│   │   │   │   └── ward.py            # Ward model
│   │   │   └── repositories/          # Data access layer
│   │   ├── services/                  # Business Logic
│   │   │   ├── ticket_service.py      # Ticket operations
│   │   │   ├── notification_service.py# Notifications
│   │   │   ├── telegram_bot.py        # Telegram bot
│   │   │   └── ai/                    # AI Pipeline
│   │   │       ├── pipeline.py        # Orchestrator
│   │   │       ├── classifier_agent.py
│   │   │       ├── routing_agent.py
│   │   │       ├── priority_agent.py
│   │   │       ├── suggestion_agent.py
│   │   │       └── memory_agent.py
│   │   ├── adapters/                  # External Service Adapters
│   │   │   ├── storage/               # File storage (MinIO/S3)
│   │   │   └── notifications/         # SMS/Email/WhatsApp
│   │   ├── enums.py                   # Enum definitions
│   │   └── main.py                    # Application entrypoint
│   ├── api/
│   │   └── index.py                   # Vercel serverless handler
│   ├── scripts/                       # Utility scripts
│   ├── requirements.txt               # Python dependencies
│   └── vercel.json                    # Vercel deployment config
│
└── README.md                          # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.11 or higher
- **MongoDB** 6.0 or higher
- **Redis** 7.0 or higher (optional, for caching)
- **Google Gemini API Key** (for AI features)

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Start development server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

---

## Environment Variables

### Frontend (`frontend/.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Analytics (Optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
```

### Backend (`backend/.env`)

```env
# ═══════════════════════════════════════════════════════════════════════════
# REQUIRED CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

# Database
MONGODB_URI=mongodb://localhost:27017/janvedha

# AI (Required for core functionality)
GEMINI_API_KEY=your_gemini_api_key

# Authentication
JWT_SECRET_KEY=your_super_secret_jwt_key_change_in_production

# Application
ENVIRONMENT=development
CITY_NAME=Chennai

# ═══════════════════════════════════════════════════════════════════════════
# OPTIONAL CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

# Caching
REDIS_URL=redis://localhost:6379

# SMS Notifications
SMS_PROVIDER=msg91                    # msg91 | twilio
MSG91_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Email Notifications
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=

# WhatsApp
WHATSAPP_PROVIDER=twilio
TWILIO_WHATSAPP_NUMBER=

# Telegram Bot
TELEGRAM_BOT_TOKEN=

# File Storage
STORAGE_PROVIDER=minio                # minio | s3 | local
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=janvedha

# AWS S3 (Alternative to MinIO)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=ap-south-1

# Google Maps
GOOGLE_MAPS_API_KEY=

# Alternative AI Providers
NVIDIA_API_KEY=
DEEPSEEK_API_KEY=
```

---

## User Roles & Permissions

| Role | Code | Permissions |
|------|------|-------------|
| **Public User** | `PUBLIC_USER` | Submit complaints, track own tickets, view public data |
| **Field Staff** | `FIELD_STAFF` | View assigned tickets, update work status, upload photos |
| **Junior Engineer** | `JUNIOR_ENGINEER` | Manage department tickets, assign to field staff, set schedules |
| **Supervisor** | `SUPERVISOR` | Department-wide management, approve closures, view reports |
| **Councillor** | `COUNCILLOR` | Ward performance dashboard, escalate issues, view analytics |
| **Super Admin** | `SUPER_ADMIN` | City-wide analytics, user management, system configuration |

---

## API Reference

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/public/complaints` | Submit a new complaint |
| `GET` | `/api/public/track/{code}` | Track ticket by code |
| `GET` | `/api/public/status` | Get public statistics |
| `GET` | `/api/public/wards/leaderboard` | Ward performance leaderboard |
| `GET` | `/api/public/heatmap` | Issue heatmap data |
| `GET` | `/api/public/departments` | List all departments |
| `GET` | `/api/public/wards` | List all wards |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login with phone/email |
| `POST` | `/api/auth/register/public` | Public user registration |
| `POST` | `/api/auth/logout` | Logout current session |
| `GET` | `/api/auth/me` | Get current user info |

### Officer Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/officer/tickets` | List tickets (filtered by role) |
| `GET` | `/api/officer/tickets/{id}` | Get ticket details |
| `PATCH` | `/api/officer/tickets/{id}/status` | Update ticket status |
| `POST` | `/api/officer/tickets/{id}/assign` | Assign ticket to officer |
| `POST` | `/api/officer/tickets/{id}/schedule` | Schedule work date |
| `POST` | `/api/officer/tickets/{id}/remarks` | Add officer remarks |
| `GET` | `/api/officer/dashboard/summary` | Dashboard KPIs |
| `GET` | `/api/officer/dashboard/charts` | Dashboard charts data |

### Councillor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/councillor/ward-summary` | Ward summary statistics |
| `GET` | `/api/councillor/department-performance` | Department metrics |
| `GET` | `/api/councillor/escalations` | Escalated tickets |

### Commissioner Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/commissioner/city-summary` | City-wide statistics |
| `GET` | `/api/commissioner/ward-performance` | All wards performance |
| `GET` | `/api/commissioner/department-performance` | All departments metrics |
| `GET` | `/api/commissioner/trends` | Trend analysis |

### Chat (AI Chatbot)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat/message` | Send message to AI assistant |
| `GET` | `/api/chat/history` | Get chat history |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | System health status |

---

## Ticket Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TICKET STATUS FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌────────┐                                                               │
│    │  OPEN  │──────────────────────────────────────────┐                   │
│    └────┬───┘                                          │                   │
│         │ Officer assigns                              │ Rejected          │
│         ▼                                              ▼                   │
│    ┌──────────┐                                  ┌──────────┐              │
│    │ ASSIGNED │                                  │ REJECTED │              │
│    └────┬─────┘                                  └──────────┘              │
│         │ Officer schedules                                                │
│         ▼                                                                  │
│    ┌───────────┐                                                           │
│    │ SCHEDULED │                                                           │
│    └────┬──────┘                                                           │
│         │ Work begins                                                      │
│         ▼                                                                  │
│    ┌─────────────┐                                                         │
│    │ IN_PROGRESS │                                                         │
│    └────┬────────┘                                                         │
│         │                                                                  │
│         ├─────────────────────────────────┐                               │
│         │ With verification               │ Without verification          │
│         ▼                                 ▼                               │
│    ┌─────────┐                    ┌───────────────────┐                   │
│    │ CLOSED  │                    │ CLOSED_UNVERIFIED │                   │
│    └────┬────┘                    └─────────┬─────────┘                   │
│         │                                   │                              │
│         │ Citizen disputes                  │                              │
│         ▼                                   ▼                              │
│    ┌──────────┐                                                            │
│    │ REOPENED │◄────────────────────────────────────────────────────────┘  │
│    └──────────┘                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Deployment

### Vercel (Recommended)

The project is optimized for Vercel deployment with separate deployments for frontend and backend.

#### Frontend Deployment

1. Connect your GitHub repository to Vercel
2. Set the **Root Directory** to `frontend`
3. Vercel will auto-detect Next.js and configure build settings
4. Add environment variables in the Vercel dashboard

#### Backend Deployment

1. Create a new Vercel project for the backend
2. Set the **Root Directory** to `backend`
3. The `vercel.json` is pre-configured for Python serverless functions
4. Add all required environment variables

**Note**: Telegram bot polling is automatically disabled on Vercel (serverless). Use webhooks instead for production Telegram integration.

### Docker (Self-Hosted)

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/janvedha
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/Developer-Devanshhh/finaljan/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Developer-Devanshhh/finaljan/discussions)

---

<p align="center">
  Built with care for better civic governance
</p>
