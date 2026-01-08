# JUDGE App - One Terminal, Full Autonomous Build
# Just run: .\BUILD-AUTO.ps1

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   JUDGE App - FULL AUTONOMOUS BUILD" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Start the dev server (background)"
Write-Host "  2. Run Claude in autonomous loop"
Write-Host "  3. Build all features from PRD.json"
Write-Host ""
Write-Host "Press Ctrl+C anytime to stop."
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\Admin\Desktop\judge-app"
$appPath = "$projectPath\app"

# Start dev server in background
Write-Host "[1/2] Starting dev server..." -ForegroundColor Green
$devServer = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $appPath -PassThru -WindowStyle Hidden

Write-Host "      Dev server started (PID: $($devServer.Id))" -ForegroundColor Gray
Write-Host "      Waiting 5 seconds for startup..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Run autonomous loop
Write-Host "[2/2] Starting autonomous build..." -ForegroundColor Green
Write-Host ""

$task = @"
Build JUDGE app from PRD.json.

FIRST: Fix these issues:
1. Tailwind custom colors not working (judge-gold, judge-red, judge-purple)
2. Home screen missing the two buttons (Upload Screenshots / Paste Text)

THEN: Complete all features in PRD.json where passes=false.

WORKFLOW:
- Read LOOP-INSTRUCTIONS.md for stuck detection rules
- Take screenshots after each feature: node scripts/screenshot.mjs [page-name]
- Update PRD.json passes=true when feature complete
- Output FEATURE COMPLETE: [name] after each one
- Output TASK COMPLETE when all done
"@

Set-Location $appPath

# Use the autonomous.ps1 script
& "C:\Users\Admin\.claude\tools\autonomous\autonomous.ps1" `
    -DangerouslySkipPermissions `
    -ProjectDir $appPath `
    -TestCommand "npm run build" `
    -MaxIterations 50 `
    $task

# Cleanup
Write-Host ""
Write-Host "Stopping dev server..." -ForegroundColor Yellow
Stop-Process -Id $devServer.Id -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   BUILD SESSION ENDED" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check screenshots/ folder to see results"
Write-Host "Check PRD.json to see progress"
Write-Host ""
