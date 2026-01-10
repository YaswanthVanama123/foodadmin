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
- **Firebase** - Cloud Messaging for push notifications
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

# Firebase Configuration (for Push Notifications)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_FIREBASE_VAPID_KEY=your-vapid-key
VITE_FIREBASE_ENABLED=true
```

See [Firebase Configuration](#firebase-configuration) section below for setup details.

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

## Firebase Configuration

The admin app supports **Firebase Cloud Messaging (FCM)** for push notifications, enabling real-time alerts for new orders and order status updates.

### Setup Steps

1. **Get Firebase Credentials**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project or create a new one
   - Navigate to **Project Settings > General**
   - Under "Your apps", select your web app or create one
   - Copy the Firebase SDK configuration values

2. **Get VAPID Key**:
   - In Firebase Console, go to **Project Settings > Cloud Messaging**
   - Under "Web Push certificates", generate a new key pair if you haven't already
   - Copy the "Key pair" value (this is your VAPID key)

3. **Configure Environment Variables**:
   - Add all Firebase values to your `.env` file (see Installation section above)
   - Set `VITE_FIREBASE_ENABLED=true` to enable push notifications
   - Set `VITE_FIREBASE_ENABLED=false` to disable push notifications

4. **Service Worker Generation**:
   - The Firebase service worker (`firebase-messaging-sw.js`) is **automatically generated** from your `.env` values
   - This happens automatically when you run `npm run dev` or `npm run build`
   - The generated file is in `.gitignore` to protect your Firebase credentials
   - **Never commit the generated `public/firebase-messaging-sw.js` file**

5. **Manual Generation** (optional):
   ```bash
   npm run generate-sw
   ```

### How It Works

- **Template**: `public/firebase-messaging-sw.template.js` contains placeholders
- **Script**: `scripts/generate-sw.mjs` reads your `.env` and generates the actual service worker
- **Auto-run**: The generation runs automatically before `dev` and `build` commands
- **Generated**: `public/firebase-messaging-sw.js` is created with your Firebase config

### Notification Types

1. **Silent Notifications** (`type: 'silent'`):
   - Background data updates
   - No visible notification shown
   - Used for real-time dashboard refreshes

2. **Active Notifications** (`type: 'active'`):
   - Visible alerts with title and body
   - Show in notification center
   - Used for new order alerts

### Troubleshooting

- **No notifications?** Check browser console for Firebase initialization logs
- **Permission denied?** Grant notification permission in browser settings
- **Invalid config?** Verify all Firebase environment variables are set correctly
- **Service worker errors?** Run `npm run generate-sw` to regenerate with latest .env values

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for type safety
3. Follow Tailwind CSS conventions
4. Test all features before committing
5. Keep components small and focused

## License

Proprietary - All rights reserved
