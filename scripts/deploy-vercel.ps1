# PowerShell script for Vercel deployment

Write-Host "🚀 Deploying NestJS Rental Host Backend to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if user is logged in to Vercel
try {
    vercel whoami 2>$null
    Write-Host "✅ Logged in to Vercel" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please login to Vercel first:" -ForegroundColor Yellow
    vercel login
}

# Build the project
Write-Host "🏗️  Building project..." -ForegroundColor Blue
npm run build:vercel

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please check your code." -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "📋 Don't forget to:" -ForegroundColor Yellow
    Write-Host "1. Configure environment variables in Vercel dashboard" -ForegroundColor White
    Write-Host "2. Run database migrations: npx prisma migrate deploy" -ForegroundColor White
    Write-Host "3. Test your endpoints" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed. Please check the logs." -ForegroundColor Red
    exit 1
}
