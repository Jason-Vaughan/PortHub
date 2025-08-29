#!/bin/bash
# PortHub System Service Uninstallation Script
# "Sometimes even the best relationships must end"

set -e

echo "💔 PortHub System Service Uninstallation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "\"It's not you, it's me... actually, it's definitely you.\""
echo ""

PLIST_PATH=~/Library/LaunchAgents/com.porthub.daemon.plist

# Stop the service if running
if launchctl list | grep -q com.porthub.daemon; then
    echo "🛑 Stopping PortHub service..."
    launchctl unload "$PLIST_PATH" 2>/dev/null || true
    echo "   ✅ Service stopped"
fi

# Remove the LaunchAgent
if [ -f "$PLIST_PATH" ]; then
    echo "🗑️  Removing LaunchAgent..."
    rm "$PLIST_PATH"
    echo "   ✅ LaunchAgent removed"
fi

# Ask about removing data
echo ""
read -p "🗑️  Remove PortHub data directories? (logs, config) [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Cleaning up PortHub directories..."
    rm -rf ~/.porthub
    rm -rf ~/.config/porthub
    echo "   ✅ Data directories removed"
else
    echo "   📁 Data directories preserved at:"
    echo "      ~/.porthub/"
    echo "      ~/.config/porthub/"
fi

echo ""
echo "💔 PortHub System Service Uninstallation Complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "\"Thanks for the memories. Your ports are now... independent.\""
