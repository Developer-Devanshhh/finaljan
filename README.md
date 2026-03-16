# JanVedha AI

An AI-powered civic issue management platform for local governance. Citizens can submit complaints, track resolutions in real-time, and hold government accountable through transparent performance metrics.

## Overview

JanVedha AI uses artificial intelligence to automatically classify, prioritize, and route civic complaints to the appropriate departments. The platform provides different dashboards for citizens, ward officers, councillors, and commissioners.

## Features

- **AI-Powered Complaint Processing**: Automatic classification, priority scoring, and department routing using Google Gemini
- **Real-time Tracking**: Citizens can track their complaints with unique ticket codes
- **Multi-role Dashboards**: Separate interfaces for citizens, officers, councillors, and commissioners
- **SLA Management**: Automated deadline tracking and breach alerts
- **Transparency Leaderboard**: Public ward performance rankings
- **Interactive Map**: Heatmap visualization of civic issues
- **AI Chatbot**: Gemini-powered assistant for guidance and ticket tracking
- **Multi-channel Notifications**: SMS (MSG91/Twilio), Email (SendGrid), WhatsApp, and Telegram

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **State Management**: React Context + SWR
- **Forms**: React Hook Form + Zod
- **Maps**: Leaflet / React-Leaflet
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: MongoDB with Beanie ODM
- **AI/LLM**: LangChain + Google Gemini
- **ML**: scikit-learn for priority scoring
- **Caching**: Redis
- **Task Queue**: Celery

## Project Structure

```
├── frontend/                 # Next.js 16 application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── context/         # React Context providers
│   │   ├── features/        # Feature-specific components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utilities and helpers
│   └── package.json
│
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── api/             # API route handlers
│   │   ├── core/            # Core utilities (auth, config)
│   │   ├── mongodb/         # Database models and repositories
│   │   ├── services/        # Business logic services
│   │   │   └── ai/          # AI agents and pipeline
│   │   └── adapters/        # External service adapters
│   ├── scripts/             # Utility scripts
│   └── requirements.txt
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB
- Redis (optional, for caching)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000` with docs at `/docs`.

### Environment Variables

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

#### Backend (`backend/.env`)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/civicai
REDIS_URL=redis://localhost:6379

# AI
GEMINI_API_KEY=your_gemini_api_key

# Auth
JWT_SECRET_KEY=your_secret_key

# Notifications (optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
MSG91_API_KEY=
SENDGRID_API_KEY=
TELEGRAM_BOT_TOKEN=

# Storage (optional)
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
```

## User Roles

| Role | Access |
|------|--------|
| **Citizen** | Submit complaints, track tickets, view leaderboard |
| **Field Staff** | View assigned tickets, update status |
| **Junior Engineer** | Manage tickets, assign field staff |
| **Supervisor** | Department-wide ticket management |
| **Councillor** | Ward performance dashboard |
| **Commissioner** | City-wide analytics and oversight |

## API Endpoints

### Public
- `POST /api/public/complaints` - Submit a new complaint
- `GET /api/public/track/{code}` - Track a ticket by code
- `GET /api/public/stats` - Get public statistics
- `GET /api/public/wards/leaderboard` - Ward performance leaderboard
- `GET /api/public/heatmap` - Issue heatmap data

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register/public` - Citizen registration
- `POST /api/auth/logout` - User logout

### Officer
- `GET /api/officer/tickets` - List tickets
- `GET /api/officer/dashboard/summary` - Dashboard statistics
- `PATCH /api/officer/tickets/{id}/status` - Update ticket status
- `POST /api/officer/tickets/{id}/assign` - Assign ticket

### Councillor
- `GET /api/councillor/ward-summary` - Ward summary
- `GET /api/councillor/department-performance` - Department performance

### Commissioner
- `GET /api/commissioner/city-summary` - City-wide summary
- `GET /api/commissioner/ward-performance` - All wards performance

## Deployment

### Vercel (Recommended)

The project is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend` for the frontend deployment
3. Deploy the backend separately using Vercel's Python Functions or a dedicated server
4. Configure environment variables in the Vercel dashboard

### Docker

Docker configurations can be added for containerized deployment.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on the GitHub repository or contact the development team.
