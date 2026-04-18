#!/bin/bash
#
# start-server.sh — start a local static server for development
# Usage: ./start-server.sh [-p PORT] [-f]
#
# This script:
# 1. Ensures dependencies are installed (npm install)
# 2. Builds the project (npm run build)
# 3. Starts file watcher in background (npm run watch)
# 4. Starts the HTTP server with CORS and no cache
#

PORT=4848
FORCE_KILL=false

while getopts "p:f" opt; do
  case $opt in
    p) PORT="$OPTARG" ;;
    f) FORCE_KILL=true ;;
    *) echo "Usage: $0 [-p port] [-f]"; exit 1 ;;
  esac
done

if ! command -v npm &>/dev/null; then
  echo "ERROR: npm not found in PATH."
  echo "Install Node.js from https://nodejs.org/"
  exit 1
fi

echo "=== Kraland CSS Development Server ==="
echo ""

# Step 1: Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "[1/4] Installing dependencies..."
  npm install || { echo "ERROR: npm install failed"; exit 1; }
  echo "[OK] Dependencies installed"
else
  echo "[1/4] Dependencies already installed"
fi

# Step 2: Build the project
echo "[2/4] Building project..."
npm run build || { echo "ERROR: Build failed"; exit 1; }
echo "[OK] Project built"

# Step 3: Check if port is already in use
echo "[3/4] Checking port $PORT..."
PIDS=$(lsof -ti :"$PORT" 2>/dev/null)

if [ -n "$PIDS" ]; then
  echo "WARNING: Port $PORT is already in use by:"
  for pid in $PIDS; do
    PROC_NAME=$(ps -p "$pid" -o comm= 2>/dev/null)
    echo " - $PROC_NAME (PID: $pid)"
  done

  if [ "$FORCE_KILL" = true ]; then
    REPLY="y"
  else
    read -rp "Kill these process(es)? (y/n) " REPLY
  fi

  if [ "$REPLY" = "y" ]; then
    for pid in $PIDS; do
      kill "$pid" 2>/dev/null && echo "[OK] Killed PID $pid" || echo "ERROR: Could not kill PID $pid"
    done
    sleep 1
  else
    echo "Exiting..."
    exit 1
  fi
fi

# Step 4: Start watch in background
echo "[4/4] Starting file watcher..."
npm run watch &
WATCH_PID=$!
echo "[OK] File watcher started (PID: $WATCH_PID)"

sleep 2

# Cleanup on exit
cleanup() {
  echo ""
  echo "Stopping server and watcher..."
  kill "$WATCH_PID" 2>/dev/null
  wait "$WATCH_PID" 2>/dev/null
  echo "[OK] Stopped"
}
trap cleanup EXIT INT TERM

# Step 5: Start HTTP server
echo "[5/5] Starting HTTP server on port $PORT..."
echo ""
echo "Server ready at: http://localhost:$PORT"
echo "Press Ctrl+C to stop server and watcher"
echo ""

npx http-server -p "$PORT" --cors -c-1