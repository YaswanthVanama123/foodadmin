# Patlinks Admin App

Restaurant administration interface for the Patlinks multi-tenant food ordering platform.

## Features

- **Dashboard**: Real-time order monitoring with stats and active orders
- **Orders Management**: View, filter, and update order statuses
- **Kitchen Display System**: Kanban-style board for order preparation
- **Menu Management**: Full CRUD for menu items with image upload
- **Categories Management**: Organize menu items by category
- **Tables Management**: Manage restaurant tables and capacity
- **Analytics & Reports**: Revenue charts, popular items, peak hours analysis
- **Real-time Updates**: Socket.io integration for live order notifications

## Tech Stack

- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Recharts** - Charts and analytics
- **Headless UI** - Accessible UI components
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **Date-fns** - Date utilities

## Prerequisites

- Node.js 18+ and npm
- Backend server running on `http://localhost:5000`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5174`

## Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Project Structure

```
src/
├── api/                    # API service layer
├── components/
│   ├── ui/                # Reusable UI primitives
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── common/            # Shared components (DataTable, SearchBar)
│   ├── dashboard/         # Dashboard-specific components
│   ├── orders/            # Orders management components
│   ├── kitchen/           # Kitchen display components
│   ├── menu/              # Menu management components
│   ├── categories/        # Category components
│   ├── tables/            # Table components
│   └── analytics/         # Analytics/charts components
├── context/               # React contexts (Auth, Socket, Orders)
├── hooks/                 # Custom hooks
├── pages/                 # Page components
├── types/                 # TypeScript definitions
├── utils/                 # Utilities (format, constants)
├── services/              # Services (socket)
├── App.tsx                # Main app with routing
└── main.tsx               # Entry point
```

## Default Admin Credentials

```
Username: admin
Password: admin123
```

*Note: Change these credentials in production*

## Features Overview

### Dashboard
- Today's orders, revenue, and stats
- Active orders grid with real-time updates
- Quick status update buttons

### Orders Management
- Filterable data table (status, date, search)
- Order details modal
- Status update dropdown
- Pagination support

### Kitchen Display
- Kanban board (Received → Preparing → Ready)
- Real-time order updates
- Timer for each order
- Quick action buttons

### Menu Management
- Menu items data table
- Add/edit menu items
- Image upload
- Category filtering
- Dietary preferences (vegetarian, vegan, gluten-free)
- Customization options builder

### Categories
- Category cards grid
- Add/edit categories
- Reorder categories
- Toggle active status

### Tables
- Visual table grid
- Capacity and location info
- Occupancy status
- Add/edit tables

### Analytics
- Date range selector
- Revenue line chart
- Popular items bar chart
- Peak hours chart
- Category performance

## API Integration

The app communicates with the backend REST API at `/api/*` endpoints:

- **Auth**: `POST /api/auth/login`
- **Dashboard**: `GET /api/dashboard/stats`, `GET /api/dashboard/active-orders`
- **Orders**: `GET /api/orders`, `PATCH /api/orders/:id/status`
- **Kitchen**: `GET /api/kitchen/orders`
- **Menu**: Full CRUD at `/api/menu`
- **Categories**: Full CRUD at `/api/categories`
- **Tables**: Full CRUD at `/api/tables`
- **Analytics**: Various endpoints at `/api/analytics/*`

## Real-time Features

Socket.io events for live updates:

- `order:created` - New order notification
- `order:updated` - Order status changed
- `order:cancelled` - Order cancelled

Connection is established automatically on login to the restaurant-specific namespace.

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for type safety
3. Follow Tailwind CSS conventions
4. Test all features before committing
5. Keep components small and focused

## License

Proprietary - All rights reserved
