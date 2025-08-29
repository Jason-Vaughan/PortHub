#!/bin/bash
# PortHub System Service Installation Script
# "Making PortHub a permanent resident of your system"

set -e

echo "🚀 PortHub System Service Installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "\"Get it up. Get it bound. Stay registered... forever.\""
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "dist/cli/index.js" ]; then
    echo "❌ Error: This script must be run from the PortHub project directory"
    echo "   Make sure you've built the project with 'npm run build'"
    exit 1
fi

# Create PortHub directories
echo "📁 Creating PortHub system directories..."
mkdir -p ~/.porthub/logs
mkdir -p ~/.porthub/config
mkdir -p ~/.config/porthub

# Copy configuration to user config directory
echo "⚙️  Setting up global configuration..."
if [ -f "porthub.json" ]; then
    cp porthub.json ~/.config/porthub/porthub.json
    echo "   ✅ Configuration copied to ~/.config/porthub/porthub.json"
fi

# Install the LaunchAgent
echo "🎭 Installing PortHub as macOS LaunchAgent..."
PLIST_PATH=~/Library/LaunchAgents/com.porthub.daemon.plist

# Stop any existing service
if launchctl list | grep -q com.porthub.daemon; then
    echo "   🛑 Stopping existing PortHub service..."
    launchctl unload "$PLIST_PATH" 2>/dev/null || true
fi

# Copy the plist file
cp com.porthub.daemon.plist "$PLIST_PATH"
echo "   ✅ LaunchAgent installed to $PLIST_PATH"

# Load and start the service
echo "🚀 Starting PortHub system service..."
launchctl load "$PLIST_PATH"
echo "   ✅ PortHub daemon loaded and will start automatically"

# Wait a moment for startup
sleep 3

# Test the service
echo "🧪 Testing PortHub system service..."
if launchctl list | grep -q com.porthub.daemon; then
    echo "   ✅ PortHub service is running!"
    
    # Test CLI connection
    if ./dist/cli/index.js status >/dev/null 2>&1; then
        echo "   ✅ CLI connection successful!"
    else
        echo "   ⚠️  CLI connection failed - service may still be starting"
    fi
else
    echo "   ❌ Service failed to start - check logs:"
    echo "      tail -f ~/.porthub/logs/daemon-error.log"
    exit 1
fi

echo ""
echo "🎉 PortHub System Service Installation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ PortHub will now start automatically when you log in"
echo "✅ Available system-wide from any terminal or project"
echo "✅ Logs available at: ~/.porthub/logs/"
echo ""
echo "🎭 Service Management Commands:"
echo "   Start:   launchctl load ~/Library/LaunchAgents/com.porthub.daemon.plist"
echo "   Stop:    launchctl unload ~/Library/LaunchAgents/com.porthub.daemon.plist"
echo "   Status:  launchctl list | grep porthub"
echo "   Logs:    tail -f ~/.porthub/logs/daemon.log"
echo ""
echo "🚀 Test it now: Open a new terminal and run 'node $(pwd)/dist/cli/index.js status'"
echo "\"Your ports are now under permanent professional management\""
