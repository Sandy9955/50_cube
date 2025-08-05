# 50Cube MERN Stack Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for 50Cube.

## 🚀 Vercel Deployment Guide

### Frontend Deployment (React)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy the frontend**:
   ```bash
   cd client
   vercel
   ```

3. **Set environment variables** in Vercel dashboard:
   - Go to your project settings in Vercel
   - Add environment variable: `REACT_APP_API_URL` with your backend URL

### Backend Deployment Options

#### Option 1: Deploy Backend to Vercel (Recommended)

1. **Create API routes** in the `api` folder:
   ```bash
   mkdir api
   ```

2. **Move your server routes** to Vercel serverless functions

#### Option 2: Deploy Backend to Railway/Heroku

1. **Deploy to Railway**:
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Deploy
   cd server
   railway login
   railway init
   railway up
   ```

2. **Set environment variables** in Railway dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`

### Environment Variables

#### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

#### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Project Structure

```
50cube-New Style/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vercel.json        # Vercel config for frontend
├── server/                # Express backend
│   ├── routes/
│   ├── models/
│   ├── package.json
│   └── server.js
├── vercel.json           # Main Vercel config
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run install-all` - Install all dependencies

### Features

- ✅ User authentication (JWT)
- ✅ Admin dashboard
- ✅ Product management
- ✅ Merchandise catalog
- ✅ Responsive design
- ✅ Security middleware
- ✅ Rate limiting

### Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, bcryptjs
- **Security**: Helmet, CORS, Rate limiting
- **Deployment**: Vercel

### Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm run install-all`
3. **Set up environment variables**
4. **Start development**: `npm run dev`
5. **Deploy to Vercel**: Follow deployment guide above

### Support

For deployment issues, check:
- Vercel documentation
- Environment variables configuration
- CORS settings
- MongoDB connection string
