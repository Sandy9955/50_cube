# 🚀 Vercel Deployment Guide for 50Cube

This guide will help you deploy your 50Cube MERN stack application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab Account**: Your code should be in a Git repository
3. **MongoDB Atlas**: Set up a MongoDB database (free tier available)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push to Git
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify Files
Make sure these files are in your repository:
- ✅ `vercel.json` (root)
- ✅ `client/vercel.json`
- ✅ `api/` folder with serverless functions
- ✅ `package.json` (root and client)

## 🌐 Step 2: Deploy to Vercel

### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Select the repository containing your 50Cube project

### 2.2 Configure Project Settings

#### Build Settings:
- **Framework Preset**: Other
- **Root Directory**: `./` (leave empty)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/build`
- **Install Command**: `npm run install-all`

#### Environment Variables:
Add these in the Vercel dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/50cube
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=https://your-app-name.vercel.app
NODE_ENV=production
REACT_APP_API_URL=https://your-app-name.vercel.app/api
```

### 2.3 Deploy
Click "Deploy" and wait for the build to complete.

## 🔗 Step 3: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS settings as instructed

## 🧪 Step 4: Test Your Deployment

### 4.1 Test API Endpoints
```bash
# Health check
curl https://your-app-name.vercel.app/api/health

# Test catalog
curl https://your-app-name.vercel.app/api/merch/catalog
```

### 4.2 Test Frontend
1. Visit your deployed URL
2. Test user registration/login
3. Test merchandise catalog
4. Test admin features

## 🔧 Step 5: Troubleshooting

### Common Issues:

#### 1. Build Failures
- Check if all dependencies are installed
- Verify Node.js version compatibility
- Check build logs in Vercel dashboard

#### 2. API Errors
- Verify environment variables are set correctly
- Check MongoDB connection string
- Ensure CORS settings are correct

#### 3. Frontend Not Loading
- Check if `client/build` directory exists
- Verify `vercel.json` configuration
- Check browser console for errors

### Debug Commands:
```bash
# Local build test
npm run vercel-build

# Check build output
ls -la client/build

# Test API locally
curl http://localhost:5000/api/health
```

## 📊 Step 6: Monitor Your Deployment

### Vercel Analytics:
- Function execution times
- Error rates
- Performance metrics

### MongoDB Atlas:
- Database performance
- Connection monitoring
- Query optimization

## 🔄 Step 7: Continuous Deployment

### Automatic Deployments:
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on failures

### Manual Deployments:
```bash
# Using Vercel CLI
vercel --prod
```

## 🛡️ Step 8: Security Considerations

### Environment Variables:
- Never commit sensitive data to Git
- Use Vercel's environment variable system
- Rotate JWT secrets regularly

### CORS Configuration:
- Restrict origins to your domain
- Use HTTPS in production
- Implement proper authentication

## 📈 Step 9: Performance Optimization

### Frontend:
- Enable Vercel's edge caching
- Optimize images and assets
- Use code splitting

### Backend:
- Implement database indexing
- Use connection pooling
- Cache frequently accessed data

## 🆘 Support

### Vercel Support:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### MongoDB Atlas:
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community](https://community.mongodb.com/)

### Project Issues:
- Check the README.md file
- Review deployment logs
- Test locally first

## 🎉 Success!

Your 50Cube application is now deployed on Vercel! 

**Next Steps:**
1. Set up monitoring and alerts
2. Configure backup strategies
3. Plan for scaling
4. Document your deployment process

---

**Happy Coding! 🚀** 