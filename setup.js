const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up PDF to LaTeX Converter...\n');

// Create necessary directories
const directories = [
  'src/uploads',
  'temp',
  'public'
];

directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`📁 Directory exists: ${dir}`);
  }
});

// Check for sample files
const sampleFiles = [
  'public/sample-template.pdf',
  'public/sample-document-1.pdf'
];

console.log('\n📋 Sample files check:');
sampleFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found: ${file}`);
  } else {
    console.log(`❌ Missing: ${file} - Please create this file manually`);
  }
});

// Create .env.local template if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  const envTemplate = `# OpenAI API Configuration (Optional)
# Get your API key from: https://platform.openai.com/api-keys
# OPENAI_API_KEY=sk-your-api-key-here

# App Configuration
NODE_ENV=development
`;
  
  fs.writeFileSync(envPath, envTemplate);
  console.log('\n✅ Created .env.local template');
} else {
  console.log('\n📁 .env.local already exists');
}

console.log('\n🎉 Setup completed!');
console.log('\n📝 Next steps:');
console.log('1. Create sample PDF files in public/ folder');
console.log('2. Run: npm run dev');
console.log('3. Open: http://localhost:3000');
console.log('4. (Optional) Add OpenAI API key to .env.local\n');

// Check if we can run the app
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('🚀 Ready to run: npm run dev');
} else {
  console.log('⚠️  Run this script from the project root directory');
}