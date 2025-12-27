<#
Start-Server.ps1 — start a local static server for development
Usage: .\start-server.ps1 -Port 4848

This script:
1. Ensures dependencies are installed (npm install)
2. Builds the project (npm run build)
3. Starts file watcher in background (npm run watch)
4. Starts the HTTP server with CORS and no cache
#>
param(
    [int]$Port = 4848
)

# Check if npm is available
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: npm not found in PATH." -ForegroundColor Red
    Write-Host "Install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "=== Kraland CSS Development Server ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "[1/4] Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[1/4] Dependencies already installed" -ForegroundColor Green
}

# Step 2: Build the project
Write-Host "[2/4] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Project built" -ForegroundColor Green

# Step 3: Check if port is already in use
Write-Host "[3/4] Checking port $Port..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "WARNING: Port $Port is already in use" -ForegroundColor Red
    $processes = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "Process using port: $($processes.Name) (PID: $($processes.Id))" -ForegroundColor Yellow
        $kill = Read-Host "Kill this process? (y/n)"
        if ($kill -eq 'y') {
            Stop-Process -Id $processes.Id -Force
            Write-Host "✓ Process killed" -ForegroundColor Green
            Start-Sleep -Seconds 1
        } else {
            Write-Host "Exiting..." -ForegroundColor Yellow
            exit 1
        }
    }
}

# Step 4: Start watch in background using PowerShell Job
Write-Host "[4/4] Starting file watcher..." -ForegroundColor Yellow
$watchJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run watch
}
Write-Host "✓ File watcher started (Job ID: $($watchJob.Id))" -ForegroundColor Green

# Give watch a moment to start
Start-Sleep -Seconds 2

# Step 5: Start HTTP server
Write-Host "[5/5] Starting HTTP server on port $Port..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Server ready at: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop server and watcher" -ForegroundColor Gray
Write-Host ""

# Cleanup function
$cleanup = {
    Write-Host ""
    Write-Host "Stopping server and watcher..." -ForegroundColor Yellow
    if ($watchJob) {
        Stop-Job -Id $watchJob.Id -ErrorAction SilentlyContinue
        Remove-Job -Id $watchJob.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✓ Stopped" -ForegroundColor Green
}

# Register cleanup on Ctrl+C
try {
    [Console]::TreatControlCAsInput = $false
} catch {}

try {
    if (Get-Command npx -ErrorAction SilentlyContinue) {
        npx http-server -p $Port --cors -c-1
    } else {
        npm exec -- http-server -p $Port --cors -c-1
    }
} finally {
    & $cleanup
}
