# 🚀 50cube Application - Startup Guide

## Quick Start (Recommended)

### Option 1: Use the startup script
```bash
node start-app.js
```

### Option 2: Manual startup

**Step 1: Start the Server**
```bash
cd server
node server.js
```
✅ Server will run on http://localhost:5000

**Step 2: Start the Client (in a new terminal)**
```bash
cd client
set PORT=3001 && npm start
```
✅ Client will run on http://localhost:3001

## 📋 Application Status

### ✅ What's Working:
- **Merchandise Store**: 6 sample products with full functionality
- **Analytics Dashboard**: Admin metrics + user analytics  
- **Impact Console**: Content lane management
- **User Authentication**: Ready for testing
- **Sample Data**: All pages functional without database

### 👥 Demo Accounts:
- **Admin**: admin@50cube.com / admin123
- **User**: user@50cube.com / user123

### 🔧 Features:
- Product browsing and redemption
- Admin metrics dashboard
- Content lane management
- User profile management
- Responsive design

## 🛠️ Troubleshooting

### Port 3000 in use:
```bash
# Use different port
set PORT=3001 && npm start
```

### Server crashes:
- MongoDB connection is optional
- Server will run with sample data mode

### Build errors:
- Use the startup script to avoid build issues
- All functionality works with sample data

## 🌐 Access URLs:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📱 Pages Available:
1. **Home Page**: Dashboard with feature cards
2. **Merchandise Store**: Product catalog and redemption
3. **Admin Metrics**: Platform KPIs (admin only)
4. **Impact Console**: Content management (admin only)
5. **User Profile**: Personal analytics and settings

---
**Note**: The application runs with sample data and doesn't require a database connection. 