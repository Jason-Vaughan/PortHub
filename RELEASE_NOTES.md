# PortHub Release Notes
**"Get it up. Get it bound. Stay registered."** 🎭

## v0.1.0-alpha.2 (Pending)
**"Enhanced Dashboard & Forever Easter Eggs"**

### ✨ New Features
- **Forever Easter Egg**: Click "Forever" on permanent leases for PortHub wisdom
  - Interactive popup with snarky philosophical commentary
  - Perfect timing and placement for maximum entertainment value
- **Enhanced Dashboard**: Real-time WebSocket updates for lease management
  - Live status updates without page refresh
  - Improved UI with PortHub orange (#FF9900) branding
- **System Service Integration**: macOS launchd service support
  - Automatic daemon startup on system boot
  - Professional background operation
- **Improved CLI Personality**: More snarky and helpful error messages
  - Better context in success/failure messages
  - Enhanced help text with PortHub personality

### 🔧 Technical Improvements
- **WebSocket Stability**: Enhanced connection handling and reconnection logic
- **Daemon Architecture**: Improved startup sequence and error handling
- **TypeScript Build**: Optimized compilation and distribution
- **IPC Communication**: More reliable inter-process messaging

### 🐛 Bug Fixes
- **Lease Table Display**: Fixed TTL formatting and status indicators
- **Dashboard Loading**: Resolved initial connection issues
- **CLI Commands**: Fixed argument parsing and validation

### 📚 Documentation
- **Complete Release Strategy**: Comprehensive NPM and GitHub release process
- **Installation Guide**: System service setup and configuration
- **Integration Examples**: Package.json scripts and VS Code tasks

### 🚀 Installation
```bash
npm install -g @porthub/porthub@alpha
porthub start --daemon --port 8080
```

### 🎯 Breaking Changes
- None in this alpha release

---

## v0.1.0-alpha.1 (Current)
**"Initial Alpha Release"**

### ✨ Core Features
- **Port Leasing System**: DHCP-style port management with TTL
- **CLI Interface**: Complete command set with PortHub personality
- **Daemon Service**: Background port registry management
- **WebSocket Dashboard**: Real-time lease monitoring at http://localhost:8081
- **SneakySniffer**: System port scanning utility
- **Permanent Leases**: Infrastructure port management (databases, APIs)
- **Temporary Leases**: Development server port management with auto-expiry

### 🎭 PortHub Personality
- **Snarky CLI Messages**: "Port already claimed, you greedy bastard"
- **Success Celebrations**: "Your port is now officially yours, you magnificent beast"
- **Branded Taglines**: "No Conflicts. Just Connections."
- **Development Philosophy**: "Get it up. Get it bound. Stay registered."

### 🔧 Technical Foundation
- **TypeScript Architecture**: Full type safety and modern development
- **IPC Communication**: Reliable CLI ↔ daemon messaging
- **WebSocket API**: Real-time updates and monitoring
- **Cross-Platform**: macOS, Linux, Windows support
- **Node.js 18+**: Modern runtime requirements

### 📋 Command Reference
- `porthub start --daemon` - Start background service
- `porthub lease <port> --ttl <duration>` - Temporary port lease
- `porthub lease <port> --permanent` - Permanent port lease
- `porthub release <port>` - Release port lease
- `porthub status` - Show all active leases
- `porthub heartbeat <port>` - Extend lease TTL
- `porthub start sneakysniffer` - System port scan
- `porthub discover --register` - Register PortHub infrastructure

### 🚀 Installation
```bash
npm install -g @porthub/porthub@alpha
```

### 🎯 Known Limitations
- Alpha software - expect rough edges
- WebSocket reconnection needs improvement
- Limited error recovery in daemon
- Basic dashboard functionality

---

## 🚀 Upcoming Releases

### v0.1.0-beta.1 (Planned)
- **Enhanced Error Handling**: Comprehensive error recovery
- **Configuration System**: User-customizable settings
- **Multi-Workspace Support**: Project-aware port management
- **Advanced CLI Features**: Bulk operations and scripting support
- **Dashboard Improvements**: Advanced filtering and search
- **Documentation Site**: Comprehensive user guides

### v0.1.0-rc.1 (Planned)
- **Production Hardening**: Extensive testing and optimization
- **Performance Optimization**: Memory and CPU usage improvements
- **Security Review**: Comprehensive security audit
- **Cross-Platform Testing**: Validated on all supported platforms
- **Migration Tools**: Upgrade utilities and backwards compatibility

### v0.1.0 (Planned)
- **First Stable Release**: Production-ready PortHub
- **Full Documentation**: Complete user and developer guides
- **Community Support**: Issue templates and contribution guidelines
- **Long-Term Support**: Maintenance and security updates
- **Integration Examples**: Popular framework and tool integrations

---

## 📞 Support & Feedback

### 🐛 Bug Reports
- **GitHub Issues**: https://github.com/porthub/porthub/issues
- **Priority**: Critical bugs get <24h response
- **Information**: Include `porthub --version` and system details

### 💡 Feature Requests
- **GitHub Discussions**: For feature ideas and feedback
- **Roadmap Input**: Community-driven development priorities
- **Integration Requests**: New framework or tool support

### 📚 Documentation
- **README.md**: Complete CLI reference and examples
- **Global Cursor Rules**: IDE integration template
- **Technical Specifications**: Architecture and implementation details

---

**"No Conflicts. Just Connections."** - PortHub keeps your development ports professionally managed! 🎭

Made with 🎭 by the PortHub team
