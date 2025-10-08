#!/bin/bash

echo "🚀 Deploying NestJS Rental Host Backend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

# Build the project
echo "🏗️  Building project..."
npm run build:vercel

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check your code."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "📋 Don't forget to:"
    echo "1. Configure environment variables in Vercel dashboard"
    echo "2. Run database migrations: npx prisma migrate deploy"
    echo "3. Test your endpoints"
else
    echo "❌ Deployment failed. Please check the logs."
    exit 1
fi
