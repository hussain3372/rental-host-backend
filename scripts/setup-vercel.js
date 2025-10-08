#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Vercel deployment for NestJS Rental Host Backend...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'src/main.ts',
  'prisma/schema.prisma'
];

console.log('📋 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    process.exit(1);
  }
});

// Check if .env.local exists
if (!fs.existsSync('.env.local')) {
  console.log('\n⚠️  .env.local not found. Creating from template...');
  if (fs.existsSync('env.template')) {
    fs.copyFileSync('env.template', '.env.local');
    console.log('✅ Created .env.local from template');
    console.log('📝 Please update .env.local with your actual values');
  } else {
    console.log('❌ env.template not found');
  }
} else {
  console.log('✅ .env.local exists');
}

// Check if Vercel CLI is installed
console.log('\n🔧 Checking Vercel CLI...');
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('❌ Vercel CLI not found. Installing...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed');
  } catch (installError) {
    console.log('❌ Failed to install Vercel CLI');
    console.log('Please run: npm install -g vercel');
  }
}

// Build the project
console.log('\n🏗️  Building project...');
try {
  execSync('npm run build:vercel', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.log('❌ Build failed');
  console.log('Please check your code and try again');
  process.exit(1);
}

// Check if api/index.js exists
if (fs.existsSync('api/index.js')) {
  console.log('✅ Serverless entry point exists');
} else {
  console.log('❌ Serverless entry point missing');
  process.exit(1);
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update .env.local with your actual values');
console.log('2. Run: vercel login');
console.log('3. Run: vercel');
console.log('4. Configure environment variables in Vercel dashboard');
console.log('5. Run database migrations: npx prisma migrate deploy');
console.log('\n📖 For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md');
