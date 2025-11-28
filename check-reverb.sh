#!/bin/bash

# Script to check if Laravel Reverb is running

echo "🔍 Checking Laravel Reverb status..."
echo ""

# Check if Reverb process is running
REVERB_PID=$(ps aux | grep "artisan reverb:start" | grep -v grep | awk '{print $2}')

if [ -z "$REVERB_PID" ]; then
    echo "❌ Reverb is NOT running"
    echo ""
    echo "To start Reverb, run one of these commands:"
    echo "  - Development: composer dev"
    echo "  - Manual: php artisan reverb:start"
    echo "  - Background: php artisan reverb:start &"
else
    echo "✅ Reverb is running (PID: $REVERB_PID)"
    echo ""
    # Check if port 8989 is listening
    PORT_CHECK=$(netstat -tuln 2>/dev/null | grep ":8989" || ss -tuln 2>/dev/null | grep ":8989")
    if [ -n "$PORT_CHECK" ]; then
        echo "✅ Port 8989 is listening"
    else
        echo "⚠️  Port 8989 is not listening (Reverb might be starting up)"
    fi
fi

echo ""
echo "📋 WebSocket Configuration:"
echo "  - Host: ${REVERB_HOST:-localhost}"
echo "  - Port: ${REVERB_PORT:-8989}"
echo "  - App ID: ${REVERB_APP_ID:-app-432196c7}"
echo ""
