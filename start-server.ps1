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
    [int]$Port = 4848,
    [switch]$ForceKill
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
    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
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
Write-Host "[OK] Project built" -ForegroundColor Green

# Step 3: Check if port is already in use
Write-Host "[3/4] Checking port $Port..." -ForegroundColor Yellow

function Get-PidsUsingPort([int]$port) {
    $pids = @()
    # Prefer Get-NetTCPConnection when available (Windows 8 / Server 2012+)
    if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
        try {
            $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
            if ($conns) {
                $pids += $conns | ForEach-Object { $_.OwningProcess } | Where-Object { $_ -and $_ -ne 0 }
            }
        } catch { }
    }

    # Fallback to parsing netstat (works on most systems)
    if (-not $pids -or $pids.Count -eq 0) {
        try {
            $lines = netstat -ano 2>$null | Select-String ":$port\b"
            foreach ($ln in $lines) {
                # split on whitespace; PID is last token
                $parts = ($ln -replace '^\s+','') -split '\s+'
                $pid = $parts[-1]
                if ($pid -match '^[0-9]+$') { $pids += [int]$pid }
            }
        } catch { }
    }

    return ($pids | Sort-Object -Unique)
}

$pids = Get-PidsUsingPort $Port
if ($pids -and $pids.Count -gt 0) {
    Write-Host "WARNING: Port $Port is already in use by PID(s): $($pids -join ', ')" -ForegroundColor Red
    $processes = @()
    foreach ($pid in $pids) {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc) { $processes += $proc } else { Write-Host "Note: PID $pid not found (may belong to system or exited)." -ForegroundColor Yellow }
    }

    if ($processes.Count -gt 0) {
        foreach ($proc in $processes) {
            Write-Host " - $($proc.ProcessName) (PID: $($proc.Id))" -ForegroundColor Yellow
        }

        if ($ForceKill) { $killAll = 'y' } else { $killAll = Read-Host "Kill these process(es)? (y/n)" }
        if ($killAll -eq 'y') {
            foreach ($proc in $processes) {
                try {
                    Stop-Process -Id $proc.Id -Force -ErrorAction Stop
                    Write-Host "[OK] Killed $($proc.ProcessName) (PID: $($proc.Id))" -ForegroundColor Green
                } catch {
                    Write-Host "ERROR: Could not kill PID $($proc.Id): $($_.Exception.Message)" -ForegroundColor Red
                    Write-Host "Trying taskkill as fallback..." -ForegroundColor Yellow
                    try {
                        & taskkill /PID $proc.Id /F /T 2>$null
                        Write-Host "[OK] taskkill reported success for PID $($proc.Id)" -ForegroundColor Green
                    } catch {
                        Write-Host "ERROR: Fallback taskkill also failed for PID $($proc.Id). Try running this script as Administrator." -ForegroundColor Red
                    }
                }
            }
            Start-Sleep -Seconds 1
        } else {
            Write-Host "Exiting..." -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "No user processes found using that port; continuing..." -ForegroundColor Yellow
    }
}

# Step 4: Start watch in background using PowerShell Job
Write-Host "[4/4] Starting file watcher..." -ForegroundColor Yellow
$watchJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run watch
}
Write-Host "[OK] File watcher started (Job ID: $($watchJob.Id))" -ForegroundColor Green

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
    Write-Host "[OK] Stopped" -ForegroundColor Green
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
