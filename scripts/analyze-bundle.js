#!/usr/bin/env node

/**
 * Bundle analysis script for monitoring performance
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log(`${colors.cyan}${colors.bright}📊 Bundle Analysis${colors.reset}\n`);

  const buildDir = path.join(process.cwd(), '.next');
  
  if (!fs.existsSync(buildDir)) {
    console.log(`${colors.red}❌ Build directory not found. Run 'npm run build' first.${colors.reset}`);
    return;
  }

  // Analyze static chunks
  const staticDir = path.join(buildDir, 'static');
  if (fs.existsSync(staticDir)) {
    analyzeStaticAssets(staticDir);
  }

  // Analyze server chunks
  const serverDir = path.join(buildDir, 'server');
  if (fs.existsSync(serverDir)) {
    analyzeServerAssets(serverDir);
  }

  // Performance recommendations
  console.log(`\n${colors.yellow}${colors.bright}💡 Performance Recommendations:${colors.reset}`);
  console.log(`${colors.yellow}• Keep main bundle under 250KB for optimal performance${colors.reset}`);
  console.log(`${colors.yellow}• Use dynamic imports for components over 50KB${colors.reset}`);
  console.log(`${colors.yellow}• Consider code splitting for vendor libraries${colors.reset}`);
  console.log(`${colors.yellow}• Optimize images and use Next.js Image component${colors.reset}`);
}

function analyzeStaticAssets(staticDir) {
  console.log(`${colors.blue}${colors.bright}📦 Static Assets:${colors.reset}`);
  
  const chunks = [];
  
  function walkDir(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath, prefix + file + '/');
      } else if (file.endsWith('.js') || file.endsWith('.css')) {
        chunks.push({
          name: prefix + file,
          size: stat.size,
          type: file.endsWith('.js') ? 'JavaScript' : 'CSS'
        });
      }
    });
  }
  
  walkDir(staticDir);
  
  // Sort by size (largest first)
  chunks.sort((a, b) => b.size - a.size);
  
  let totalSize = 0;
  chunks.forEach(chunk => {
    totalSize += chunk.size;
    const sizeColor = chunk.size > 250000 ? colors.red : chunk.size > 100000 ? colors.yellow : colors.green;
    console.log(`  ${sizeColor}${chunk.name}: ${formatBytes(chunk.size)} (${chunk.type})${colors.reset}`);
  });
  
  console.log(`\n  ${colors.bright}Total Static Assets: ${formatBytes(totalSize)}${colors.reset}`);
}

function analyzeServerAssets(serverDir) {
  console.log(`\n${colors.magenta}${colors.bright}🖥️  Server Assets:${colors.reset}`);
  
  const serverFiles = [];
  
  function walkServerDir(dir, prefix = '') {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkServerDir(filePath, prefix + file + '/');
      } else if (file.endsWith('.js') || file.endsWith('.html')) {
        serverFiles.push({
          name: prefix + file,
          size: stat.size,
          type: file.endsWith('.js') ? 'Server JS' : 'HTML'
        });
      }
    });
  }
  
  walkServerDir(serverDir);
  
  // Sort by size (largest first)
  serverFiles.sort((a, b) => b.size - a.size);
  
  let totalServerSize = 0;
  serverFiles.slice(0, 10).forEach(file => { // Show top 10
    totalServerSize += file.size;
    console.log(`  ${colors.magenta}${file.name}: ${formatBytes(file.size)} (${file.type})${colors.reset}`);
  });
  
  if (serverFiles.length > 10) {
    console.log(`  ${colors.magenta}... and ${serverFiles.length - 10} more files${colors.reset}`);
  }
  
  console.log(`\n  ${colors.bright}Total Server Assets (top 10): ${formatBytes(totalServerSize)}${colors.reset}`);
}

// Run the analysis
analyzeBundle();