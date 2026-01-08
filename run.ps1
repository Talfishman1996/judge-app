# run.ps1 - Single launcher for JUDGE app
# Usage:
#   .\run.ps1 -Dev    # Start dev server
#   .\run.ps1 -Build  # Production build
#   .\run.ps1 -Auto   # Autonomous ralph loop mode

param(
    [switch]$Auto,      # Run autonomous ralph loop
    [switch]$Dev,       # Just start dev server
    [switch]$Build      # Run production build
)

$projectPath = "C:\Users\Admin\Desktop\judge-app"
$appPath = "$projectPath\app"

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "         JUDGE App Launcher            " -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

if ($Dev) {
    Write-Host "Starting dev server..." -ForegroundColor Cyan
    Write-Host "URL: http://localhost:5173" -ForegroundColor Gray
    Write-Host ""
    Set-Location $appPath
    npm run dev
}
elseif ($Build) {
    Write-Host "Running production build..." -ForegroundColor Cyan
    Set-Location $appPath
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Build successful!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}
elseif ($Auto) {
    Write-Host "Starting autonomous build mode..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Prerequisites:" -ForegroundColor Gray
    Write-Host "  - claude-mem plugin installed" -ForegroundColor Gray
    Write-Host "  - ralph-wiggum plugin installed" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Starting dev server in background..." -ForegroundColor Cyan

    # Start dev server in background
    $devJob = Start-Job -ScriptBlock {
        Set-Location $using:appPath
        npm run dev 2>&1
    }

    Write-Host "Dev server starting (Job ID: $($devJob.Id))..." -ForegroundColor Gray
    Start-Sleep -Seconds 5

    Write-Host ""
    Write-Host "Launching Claude Code..." -ForegroundColor Yellow
    Write-Host "Use /ralph-loop to start autonomous build" -ForegroundColor Gray
    Write-Host ""

    # Start Claude with permissions bypassed
    Set-Location $projectPath
    claude --dangerously-skip-permissions

    # Cleanup when Claude exits
    Write-Host ""
    Write-Host "Stopping dev server..." -ForegroundColor Gray
    Stop-Job $devJob -ErrorAction SilentlyContinue
    Remove-Job $devJob -ErrorAction SilentlyContinue
    Write-Host "Done." -ForegroundColor Green
}
else {
    Write-Host "Usage:" -ForegroundColor White
    Write-Host ""
    Write-Host "  .\run.ps1 -Dev" -ForegroundColor Cyan
    Write-Host "      Start development server (localhost:5173)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  .\run.ps1 -Build" -ForegroundColor Cyan
    Write-Host "      Run production build" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  .\run.ps1 -Auto" -ForegroundColor Cyan
    Write-Host "      Start autonomous ralph loop mode" -ForegroundColor Gray
    Write-Host "      (starts dev server + claude code)" -ForegroundColor Gray
    Write-Host ""
}
