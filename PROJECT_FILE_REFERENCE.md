# PortHub Project File Reference

This document maps all project files and their purposes within the PortHub ecosystem.

## 📋 Core Documentation
- **`ROADMAP.md`** - Master planning document, single source of truth (414 lines)
- **`PROJECT_FILE_REFERENCE.md`** - This file, explains project structure
- **`.cursorrules`** - Development philosophy and session wrap protocols (189 lines)

## 🔧 Technical Specifications  
- **`technical-specifications.json`** - Complete technical architecture schemas including:
  - Prevention strategies and monitoring systems
  - Protocol packet definitions (DISCOVER, REQUEST, RENEW, etc.)
  - Configuration schemas for daemon and port management
  - Device classification rules (PortStars, PortHogs, Butterflies, etc.)
  - REST/WebSocket API endpoint definitions
  - Security model and file permissions
  - Performance benchmarks and targets

## 🎨 Branding & Visual Assets
- **`port_hub_logo.png`** - Main logo (972KB)
- **`port_hub_logo cropped.png`** - Cropped version (252KB)
- **`colored-porthub-logo.txt`** - ASCII art logo with ANSI colors (4.2KB)
- **`ascii-banner.txt`** - Large ASCII banner art (15KB, 160 lines)
- **`porthub-banner.txt`** - Compact banner (290B)
- **`PortHubBadge.jsx`** - React component for badges (37 lines)

## 🛠️ Development Tools
- **`PortHub.code-workspace`** - VS Code workspace configuration
- **`show-logo.sh`** - Shell script for displaying logos (13 lines)

## 📊 Architecture Diagrams (Mermaid)
Created during development session:
1. **Port Leasing Workflow** - Shows DHCP-like port assignment process
2. **System Architecture** - Overall component relationships 
3. **STD Testing Process** - Service & Transmission Diagnostics flow

## 🚫 Files NOT in Distribution
Per `.cursorrules` git strategy, these files are for **local development only**:
- `ROADMAP.md` (internal planning)
- `.cursorrules` (development guidelines) 
- `PROJECT_FILE_REFERENCE.md` (internal structure guide)
- ASCII banners and internal branding assets
- Technical specification files during development

## 📦 Files FOR Public Distribution
When PortHub is ready for release:
- CLI executables and core application code
- `package.json` and essential configs
- User-facing README and documentation
- License and contribution guidelines
- Rendered PNG/SVG versions of Mermaid diagrams

## 🎯 Implementation Status
- ✅ **Planning Phase Complete** - Comprehensive roadmap and technical specs
- ⏳ **Development Phase** - Ready to begin 16-week development timeline
- ⏳ **Phase 1 (Weeks 1-4)** - Foundation: CLI framework, basic daemon
- ⏳ **Phase 2 (Weeks 5-8)** - Intelligence: STD testing, monitoring
- ⏳ **Phase 3 (Weeks 9-12)** - Interface: Port Exploder dashboard
- ⏳ **Phase 4 (Weeks 13-16)** - Professional polish and release prep

## 🧠 Key Technical Decisions Documented
All major architecture decisions are captured in:
- **Protocol Design**: JSON packet structure in `technical-specifications.json`
- **Security Model**: OS-level authentication, user isolation
- **Performance Targets**: < 100ms CLI, < 50MB daemon memory
- **Brand Personality**: Snarky, sleazy-tech, self-aware humor
- **CLI Design**: Docker-style commands with PortHub personality

---
*"No Bloat. No Debt. No Bullshit."* - PortHub Development Philosophy 