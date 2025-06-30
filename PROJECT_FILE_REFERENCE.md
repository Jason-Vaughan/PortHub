# PortHub Project File Reference

This document maps all project files and their purposes within the PortHub ecosystem.

## 📋 Core Documentation

- **`ROADMAP.md`** - Master planning document, single source of truth (533 lines)
- **`PROJECT_FILE_REFERENCE.md`** - This file, explains project structure
- **`.cursorrules.mdc`** - Development philosophy and session wrap protocols
  (194 lines)
- **`TECHDEBT.md`** - **NEW** Technical debt tracker with automated session
  integration

## 🔧 Technical Specifications

- **`technical-specifications.json`** - **CONSOLIDATED** implementation
  specifications (251 lines) including:
  - **Core Registry Schema** - Primary data structure for port management
  - **Protocol Schema** - PortHub Protocol (PHP) packet definitions
  - **Configuration Schema** - Complete user config hierarchy with
    priority order
  - **Device Classifications** - Adult video library naming system
    (nubiles, milfs, etc.)
  - **STD Testing Schema** - Service & Transmission Diagnostics structure
  - **API Endpoints** - Complete REST/WebSocket API definitions
  - **Cross-Platform Tools** - Port scanning tools per OS
    (macOS, Linux, Windows)
  - **Security Model** - OS-level authentication and user isolation
  - **Performance Targets** - Benchmarks and optimization goals
  - **Workflow Definitions** - Core process flows for all major
    operations

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
- **`cspell.json`** - **NEW** Spell check configuration with PortHub terminology
- **`.gitignore`** - **NEW** Professional Node.js project exclusion patterns

## 📊 Architecture Diagrams (Mermaid)

✅ **Three comprehensive diagrams created:**

1. **Port Leasing Workflow** - DHCP-like port assignment with heartbeat
   management
2. **System Architecture** - Component relationships between CLI, daemon,
   OS, and dashboard
3. **STD Testing Process** - Service & Transmission Diagnostics with risk
   assessment flow

All diagrams render natively in GitHub/Cursor. For NPM distribution, will
need PNG/SVG versions.

## 🚫 Files NOT in Distribution

Per `.cursorrules` git strategy, these files are for **local development
only**:

- `ROADMAP.md` (internal planning)
- `.cursorrules.mdc` (development guidelines)
- `PROJECT_FILE_REFERENCE.md` (internal structure guide)
- `TECHDEBT.md` (technical debt tracking and session history)
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

- ✅ **Planning Phase Complete** - Comprehensive roadmap and technical
  specs
- ⏳ **Development Phase** - Ready to begin 16-week development
  timeline
- ⏳ **Phase 1 (Weeks 1-4)** - Foundation: CLI framework, basic
  daemon
- ⏳ **Phase 2 (Weeks 5-8)** - Intelligence: STD testing, monitoring
- ⏳ **Phase 3 (Weeks 9-12)** - Interface: Port Exploder dashboard
- ⏳ **Phase 4 (Weeks 13-16)** - Professional polish and release
  prep

## 🧠 Key Technical Decisions Documented

All major architecture decisions are captured in:

- **Protocol Design**: JSON packet structure in
  `technical-specifications.json`
- **Security Model**: OS-level authentication, user isolation
- **Performance Targets**: < 100ms CLI, < 50MB daemon memory
- **Brand Personality**: Snarky, sleazy-tech, self-aware humor
- **CLI Design**: Docker-style commands with PortHub personality

---

*"No Bloat. No Debt. No Bullshit."* - PortHub Development Philosophy
