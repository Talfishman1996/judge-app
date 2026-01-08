/**
 * Visual Iteration Screenshot Tool
 *
 * Saves screenshots with human-friendly names to organized folders
 *
 * Usage:
 *   node scripts/screenshot.mjs home          → saves to screenshots/home-screen/
 *   node scripts/screenshot.mjs verdict       → saves to screenshots/verdict-screen/
 *   node scripts/screenshot.mjs upload        → saves to screenshots/upload-screen/
 *   node scripts/screenshot.mjs history       → saves to screenshots/history-screen/
 *   node scripts/screenshot.mjs [anything]    → saves to screenshots/other/
 */

import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const DEV_SERVER_URL = process.env.DEV_PORT ? `http://localhost:${process.env.DEV_PORT}` : 'http://localhost:5174';

// Map page names to folders
const FOLDER_MAP = {
  'home': 'home-screen',
  'verdict': 'verdict-screen',
  'upload': 'upload-screen',
  'text': 'upload-screen',
  'history': 'history-screen',
  'settings': 'other',
  'processing': 'other',
  'share': 'other'
};

function getTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
}

async function takeScreenshot(pageName = 'current') {
  // Determine folder
  const folderName = FOLDER_MAP[pageName.toLowerCase()] || 'other';
  const screenshotsDir = path.join(PROJECT_ROOT, 'screenshots', folderName);

  // Ensure directory exists
  if (!existsSync(screenshotsDir)) {
    await mkdir(screenshotsDir, { recursive: true });
  }

  const timestamp = getTimestamp();

  // Human-friendly filenames
  const desktopFilename = `${pageName}-desktop-${timestamp}.png`;
  const mobileFilename = `${pageName}-mobile-${timestamp}.png`;

  const desktopPath = path.join(screenshotsDir, desktopFilename);
  const mobilePath = path.join(screenshotsDir, mobileFilename);

  console.log(`\n📸 JUDGE Screenshot Tool`);
  console.log(`========================`);
  console.log(`Page: ${pageName}`);
  console.log(`Folder: screenshots/${folderName}/`);
  console.log(`Server: ${DEV_SERVER_URL}\n`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Desktop screenshot (1280x720)
    console.log(`📱 Taking desktop screenshot...`);
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(DEV_SERVER_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000)); // Wait for animations
    await page.screenshot({ path: desktopPath, fullPage: true });
    console.log(`   ✅ Saved: ${desktopFilename}`);

    // Mobile screenshot (iPhone size)
    console.log(`📱 Taking mobile screenshot...`);
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: mobilePath, fullPage: true });
    console.log(`   ✅ Saved: ${mobileFilename}`);

    console.log(`\n📁 Screenshots saved to:`);
    console.log(`   ${desktopPath}`);
    console.log(`   ${mobilePath}`);

    return { desktop: desktopPath, mobile: mobilePath };

  } catch (error) {
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.error(`\n❌ ERROR: Dev server not running!`);
      console.error(`   Start it with: cd app && npm run dev`);
    } else {
      console.error(`\n❌ ERROR: ${error.message}`);
    }
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

// Run
const pageName = process.argv[2] || 'current';
takeScreenshot(pageName);
