# Debriefly AI

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> AI-powered trading journal and analysis platform for professional traders

## 📖 Overview

Debriefly AI is a comprehensive trading journal platform that leverages artificial intelligence to analyze trading performance, identify behavioral patterns, and provide actionable insights to improve trading strategies. The platform combines advanced analytics with an intuitive interface to help traders make data-driven decisions.

## ✨ Features

- **AI-Powered Analysis**: Automated trade analysis using machine learning algorithms
- **Behavioral Insights**: Identify trading patterns and emotional triggers
- **Performance Analytics**: Comprehensive performance metrics and visualizations
- **Trade Import**: Support for multiple broker integrations and CSV imports
- **Session Debriefing**: Detailed post-trading session analysis
- **Strategy Optimization**: AI-driven strategy recommendations
- **Real-time Data**: Live market data integration
- **Multi-Account Support**: Manage multiple trading accounts
- **Export Capabilities**: Generate reports and export trade data

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **Recharts** - Data visualization

### Backend & Infrastructure
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Edge Functions)
- **AWS Lambda** - Serverless computing for AI analysis
- **Netlify** - Frontend hosting and deployment
- **Stripe** - Payment processing and subscriptions

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Concurrently** - Run multiple commands simultaneously

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Supabase CLI**
- **Docker** (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/debriefly-ai.git
   cd debriefly-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

4. **Start Supabase locally**
   ```bash
   supabase start
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🏗️ Development

### Project Structure

```
debriefly-ai/
├── src/
│   ├── components/          # Reusable UI components
│   ├── features/           # Feature-based modules
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route components
│   ├── store/              # State management
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── lambda-worker/          # AWS Lambda functions
├── supabase/              # Database migrations and functions
└── public/                # Static assets
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start all development services (React, Supabase, Worker) |
| `npm run dev:react` | Start React development server only |
| `npm run dev:supabase` | Start Supabase locally |
| `npm run dev:worker` | Start Lambda worker service |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Development Workflow

1. **Start all services**
   ```bash
   npm run dev
   ```

2. **Run Edge Functions locally**
   ```bash
   supabase functions serve --env-file supabase/.env
   ```

3. **Debug Edge Functions**
   ```bash
   supabase functions serve ai-analysis --env-file supabase/.env --inspect-mode brk
   ```

4. **Run Lambda Worker**
   ```bash
   # Background mode
   docker-compose -f docker-compose.dev.yml up -d
   
   # With logs
   docker-compose -f docker-compose.dev.yml logs -f
   
   # Stop
   docker-compose -f docker-compose.dev.yml down
   ```

### Database Migrations

```bash
# Create a new migration
supabase migrations new [migration_name]

# Apply migrations
supabase db push

# Reset database
supabase db reset
```

## 🚀 Deployment

### Frontend (Netlify)

The frontend is automatically deployed to Netlify on push to main branch.

**Manual deployment:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Backend (Supabase)

```bash
# Deploy to production
supabase link --project-ref your-project-ref
supabase db push
supabase functions deploy
```

### Lambda Worker (AWS)

```bash
cd lambda-worker
npm run deploy
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 API Documentation

### Authentication

The application uses Supabase Auth with the following providers:
- Email/Password
- Google OAuth

### Core Endpoints

- `POST /api/trades` - Import trade data
- `GET /api/trades` - Retrieve trade history
- `POST /api/analysis` - Trigger AI analysis
- `GET /api/analysis/:id` - Get analysis results

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.debriefly.ai](https://docs.debriefly.ai)
- **Issues**: [GitHub Issues](https://github.com/your-username/debriefly-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/debriefly-ai/discussions)
- **Email**: support@debriefly.ai

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Vite](https://vitejs.dev) for the build tool

---

**Made with ❤️ by the Debriefly AI team**
