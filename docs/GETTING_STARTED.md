# Getting Started with Admin App

## Overview

The Admin App is a restaurant management dashboard that allows restaurant administrators to manage their menu, orders, tables, and analytics in real-time. This application is built with React, TypeScript, and Vite.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (v4.4 or higher)
- Backend server running

## Quick Start

### 1. Automated Setup (Recommended)

Run the setup script to automatically install dependencies and configure the app:

```bash
cd /Users/yaswanthgandhi/Documents/patlinks/packages/admin-app
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Manual Setup

If you prefer to set up manually:

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Build the project (verification)
npm run build
```

### 3. Environment Configuration

Edit `.env` file with your configuration:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Default Credentials

Use these credentials to log in to the admin dashboard:

| Field    | Value     |
|----------|-----------|
| Username | admin     |
| Password | admin123  |

**Note:** These are default credentials created by the backend seed script. Change them in production!

## Available Routes

The admin app includes the following pages:

### Main Routes

- `/` - Login page
- `/dashboard` - Main dashboard with statistics and charts
- `/orders` - Order management (view, update status)
- `/menu` - Menu item management (CRUD operations)
- `/categories` - Category management
- `/tables` - Table management and QR codes
- `/kitchen` - Kitchen display system
- `/analytics` - Advanced analytics and reports

### Dashboard Features

**Statistics Cards:**
- Total revenue
- Today's orders
- Active tables
- Menu items count

**Charts:**
- Revenue trends
- Order status distribution
- Popular items

## Key Features

### 1. Order Management
- View all orders in real-time
- Update order status (pending, preparing, ready, delivered)
- Filter by status, date, table
- Order details with customer info
- Print/download order receipts

### 2. Menu Management
- Add/edit/delete menu items
- Upload item images
- Set prices and descriptions
- Manage availability
- Categorize items
- Bulk operations

### 3. Table Management
- View all tables and their status
- Generate QR codes for tables
- Assign/unassign orders to tables
- Table availability management

### 4. Kitchen Display
- Real-time order updates
- Order preparation tracking
- Sound notifications for new orders
- Order priority management

### 5. Analytics
- Sales reports
- Popular items analysis
- Revenue trends
- Customer insights
- Export data to CSV

### 6. Real-time Updates
- Socket.io integration for live updates
- New order notifications
- Order status changes
- Table status updates

## Socket.io Events

The app listens to the following real-time events:

- `new-order` - New order received
- `order-status-updated` - Order status changed
- `table-status-updated` - Table availability changed
- `menu-item-updated` - Menu item modified

## API Endpoints Used

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/me` - Get current user

### Orders
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get order by ID
- `PUT /api/admin/orders/:id/status` - Update order status
- `DELETE /api/admin/orders/:id` - Cancel order

### Menu
- `GET /api/admin/menu` - Get all menu items
- `POST /api/admin/menu` - Create menu item
- `PUT /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item
- `POST /api/admin/upload` - Upload item image

### Categories
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

### Tables
- `GET /api/admin/tables` - Get all tables
- `POST /api/admin/tables` - Create table
- `PUT /api/admin/tables/:id` - Update table
- `DELETE /api/admin/tables/:id` - Delete table

### Analytics
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/analytics/revenue` - Revenue analytics
- `GET /api/admin/analytics/popular-items` - Popular items

## Project Structure

```
admin-app/
├── src/
│   ├── api/           # API client and endpoints
│   ├── components/    # Reusable components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript types
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── scripts/           # Setup and utility scripts
├── docs/              # Documentation
└── package.json       # Dependencies
```

## Troubleshooting

### Backend Connection Issues

Check if the backend is running:

```bash
node scripts/check-backend.js
```

### Port Already in Use

If port 5173 is already in use, specify a different port:

```bash
npm run dev -- --port 5174
```

### Build Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Socket.io Not Connecting

1. Verify VITE_SOCKET_URL in .env
2. Check backend CORS configuration
3. Ensure backend Socket.io server is running
4. Check browser console for connection errors

### Images Not Loading

1. Verify VITE_API_URL is correct
2. Check backend file upload configuration
3. Ensure uploads directory has proper permissions

### Authentication Issues

1. Clear browser local storage
2. Check backend JWT configuration
3. Verify admin credentials exist in database
4. Check backend logs for errors

### Database Connection

If you see database errors:

```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                       # Windows

# Check MongoDB status
mongo --eval "db.adminCommand('ping')"
```

### Seed Database

If no data appears:

```bash
cd ../backend
npm run seed
```

## Development Tips

### Hot Module Replacement (HMR)

Vite provides fast HMR out of the box. Changes to React components will update instantly.

### TypeScript

The project uses TypeScript for type safety. Run type checking:

```bash
npm run build  # Runs tsc before build
```

### Linting

Check code quality:

```bash
npm run lint
```

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the app.

## Testing the App

1. **Login Test**: Use default credentials to log in
2. **View Orders**: Navigate to orders page and view existing orders
3. **Create Menu Item**: Add a new menu item with image
4. **Update Order Status**: Change an order status and verify kitchen display updates
5. **Check Analytics**: View analytics dashboard for reports

## Production Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Environment Variables for Production

Create a `.env.production` file:

```env
VITE_API_URL=https://your-api-domain.com
VITE_SOCKET_URL=https://your-api-domain.com
```

### Deploy to Server

You can deploy the `dist/` folder to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Nginx
- Apache

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review backend logs
3. Check browser console for errors
4. Verify all services are running (MongoDB, Backend, Frontend)

## Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Socket.io Documentation](https://socket.io)
- [Tailwind CSS Documentation](https://tailwindcss.com)
