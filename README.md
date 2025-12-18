# RT Admin Dashboard

A modern admin dashboard for managing users, bonus codes, and sending emails via the RT Backend API.

## Features

- **User Management**: View, create, and delete users with club membership filtering
- **Bonus Codes**: Full CRUD operations, redeem codes, filter by status and club
- **Email Sending**: Compose and send emails with HTML/plain text support and preview
- **Dashboard**: Overview stats with recent activity summaries

## Tech Stack

- React 18 + TypeScript
- Vite for development and building
- Tailwind CSS v4 for styling
- TanStack Query (React Query) for data fetching
- React Router v6 for navigation
- React Hook Form for form handling
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 18+
- The RT Backend API running on `http://localhost:8080`

### Installation

```bash
npm install
```

### Environment

Copy the example and set the backend URL:

```bash
cp .env.example .env
# Update if your backend is elsewhere
# VITE_API_BASE_URL=http://localhost:8080
```

### Development

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5137`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

The dashboard reads the backend URL from `VITE_API_BASE_URL` (see `.env`). The value is used in `src/api/client.ts`.

### API Authentication

Enter your API key on the login page. The key is stored in `localStorage` and sent as a Bearer token with each request.

## Project Structure

```
src/
├── api/           # API service functions
├── components/    # Reusable UI components
│   ├── layout/    # Layout components (Sidebar, Layout)
│   └── ui/        # UI primitives (Button, Input, Modal, etc.)
├── context/       # React context providers
├── pages/         # Page components
├── types/         # TypeScript type definitions
├── App.tsx        # Main app with routing
└── main.tsx       # Entry point
```

## Pages

- `/login` - API key authentication
- `/` - Dashboard with stats overview
- `/users` - User management
- `/bonus-codes` - Bonus code management
- `/send-club` - Send emails to all players in selected clubs (CC, AT, RT)
- `/send-telegram` - Send a Telegram message to all players in a club

## License

Private - All rights reserved
