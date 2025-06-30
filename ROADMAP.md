# PortHub Project Roadmap

Tagline: "The Protocol Registry That Parties Responsibly."

## 📄 Documentation Philosophy

**PortHub maintains minimal documentation by design.** This roadmap serves as
our single source of truth, containing project goals, technical specifications,
and brand guidelines. We avoid documentation sprawl and keep everything
centralized here.

### 📚 README Documentation Standards

- **User-facing README.md**: Essential for NPM and GitHub distribution
- **Mermaid diagrams**: Use for architecture, flow charts, and technical illustrations
- **Diagram rendering**: Mermaid works natively in GitHub/Cursor, but NPM
  requires rendered PNG/SVG versions
- **Documentation updates**: Keep README current with every release - no
  version drift allowed
- **Visual consistency**: All diagrams follow PortHub color scheme and branding
- **Technical depth**: README should be comprehensive enough for developers
  to understand and integrate

## 🎯 Overview

PortHub is a local or network-enabled port registry service for development
environments. It eliminates port conflicts by managing a centralized,
discoverable registry of both static and dynamic port assignments across
projects. Think of it as a DHCP server, but for ports — with a little snark
and a lot of smarts.

### 🌐 DHCP Analogy

| Concept | DHCP Equivalent | PortHub Equivalent |
|---------|-----------------|-------------------|
| IP Address | Port Number | Port Number |
| MAC Address | Client App / Workspace ID | App/Service ID or X-PHub-ID |
| DHCP Discover/Request | Initial broadcast | App pings local PortHub |
| DHCP Offer/Ack | IP assignment | Port assigned & lease granted |
| Lease | Time-based allocation | Port freed if no heartbeat |
| Static Reservation | MAC-IP binding | Reserved port for known app |

⸻

## 🚀 Core Features

### 1. 📡 Dynamic Port Leasing

- Behavior modeled after DHCP:
  - App requests a port → PortHub assigns one with TTL
  - App must heartbeat to keep the lease
  - Leases expire and return to the pool if unresponsive
  - Dynamic pool range configurable per workspace

### 2. 🔒 Static Port Reservations

- Developers or systems can register permanent ports for services
- Includes:
  - App name
  - Description
  - Port number(s)
  - Workspace or project association

### 3. 🧠 Port Discovery Mode

- Runs in the background (like fing, nmap, etc.)
- Alerts when an unknown port is bound but unregistered
- Offers options to:
  - Claim (register it)
  - Ignore
  - Block

### 4. 🧰 CLI Tool (porthub-cli)

- Example commands:

```bash
porthub register 8080 --name=tilt-api --desc="Main dev API"
porthub scan --warn-unused
porthub lease --dynamic
porthub dashboard
```

- Returns structured results + emoji-style summaries:
  - 🔒 = static
  - 🔄 = dynamic
  - ⚠️ = conflict
  - 👻 = ghost/unclaimed

### 5. 📟 Daemon Service (porthubd)

- Runs as a background process
- Supports:
  - IPC
  - WebSocket
  - Optional mDNS/ZeroConf for LAN discovery
  - JSON-RPC or custom PHP (PortHub Protocol 😏) with actions:
    - DISCOVER, REQUEST, RENEW, RELEASE, REGISTER, REJECT

### 6. 📊 React-Based Web Dashboard

- Displays:
  - All active services
  - Port ranges & assignments
  - App names and workspace owners
  - Lease countdowns
  - Status (online/offline/conflict)
  - Rotating taglines in header (e.g.,
    - "No Conflicts. Just Connections."
    - "Claim it. Bind it. Own it.")

⸻

## 🔧 Technical Reference

**For complete implementation details, see `technical-specifications.json`**

| Implementation Area | Technical Specs Location |
|-------------------|--------------------------|
| **Port Registry Data** | `core_registry_schema` |
| **Protocol Packets** | `protocol_schema.porthub_protocol_packet` |
| **REST/WebSocket APIs** | `api_endpoints` |
| **Configuration Schema** | `configuration_schema.user_config_schema` |
| **Device Classifications** | `device_classifications.categories` |
| **STD Testing** | `std_testing_schema.test_result_structure` |
| **Security Model** | `security_model` |
| **Performance Targets** | `performance_targets.targets` |
| **Core Workflows** | `workflow_definitions` |

⸻

## 🔄 Protocol Design (PortHub Protocol)

Basic Packet Fields:

| Field | Type | Description |
|-------|------|-------------|
| version | string | Protocol version |
| command | string | e.g., DISCOVER, RELEASE, BIND |
| clientId | string | App/workspace ID |
| requestedPort | int | Optional; for static requests |
| ttl | int | Lease time in seconds |
| metadata | object | name, desc, tags, project |

⸻

## 🧪 Milestones

### MVP

- porthubd static file-based registry
- CLI to register and lease ports
- JSON config per workspace (porthub.json)
- Scan & report unregistered port bindings
- React dashboard stub

### Phase 2

- Dynamic leasing with TTL/renewal
- Socket-based daemon + client
- Heartbeat ping
- Conflict detection & auto recovery
- LAN sniffing

### Phase 3

- WebSocket API
- mDNS discovery
- Multi-user workspace support
- Project badges
- Metrics & logs viewer

⸻

## 🪩 Rotating Dashboard Taglines

- "Claim Your Port Before Someone Else Does"
- "Bind Fast. Bind Often."
- "Where Every Port Gets Action"
- "The Only Hub You Don't Have to Clear Your History For"
- "No Conflicts. Just Connections."
- "Ports So Open, It's Almost Insecure"
- "We Keep It Clean. Your Services Won't."
- "Come for the Ports. Stay for the Logs."
- "One Registry to Rule Your Runtime"

⸻

## 🛠️ Supporting Tools

- porthub-badge generator (rotating tagline SVG)
- porthub-react component: live badge view + taglines
- porthub-scanner background scanner
- porthub-watchdog process monitor

⸻

## 🎯 Goals

- 🧠 Prevent dev-time port conflicts
- 💬 Offer humor & clarity in debugging
- 🔒 Bring structure to multi-project setups
- 🧰 Seamless integration with tools like Cursor, VSCode, Docker, etc.
- 🎛️ Be extensible enough to plug into existing CI/CD flows

⸻

## 🎨 Style Guide & Brand Guidelines

Port Hub's personality is snarky, sleazy-tech, and self-aware. Think PornHub
meets enterprise service mesh with boundary issues.

### Voice & Tone

- **Snarky** — Like a seasoned dominatrix with a clipboard
- **Sleazy-tech** — 70s adult cinema meets DevOps and DHCP
- **Self-aware** — We know what we're doing. And so do you
- **Deadpan absurd** — Serious infrastructure with tramp stamps

Example Copy:

- "Port 3000 just got railed."
- "Bind it. Spit on it. Make it yours."
- "You registered it raw. You nasty."

### Theme & Layout

**Color Palette:**

- Black background (always)
- Bright orange (#FF9900) primary (PornHub homage)
- Accents: neon pink, ultraviolet purple, slime green

**UI Vibe:**

- Vegas LED porn studio meets 1998 hacking console
- Panels shaped like anatomical references that just skirt policy

### Visual Elements

**Icons/Emoji:**

- 🍆 = open port
- 🍑 = server-side
- 🍒 = active service
- 📞 = TCP bind
- 🧼 = clean exit

**Meme & Shape Mapping:**

- Eggplants for sockets
- Melons for bandwidth
- Squeeze boxes for modular services

### Registration Language

We don't "register" — we:

- "Book a port"
- "Sign the service"
- "Seal the deal"
- "Stake your claim"
- "Slide into the socket"

### Naming Conventions

We categorize ports and services like an adult video library:

| Category | Meaning |
|----------|---------|
| Nubiles | New ports registered < 1 week |
| Milfs | Ports in the system > 6 months |
| Gmilfs | Legacy services (e.g., Java RMI) |
| TrampStamps | Ports that appear, disappear, unclaimed |
| BindStormers | Services that cycle ports or multi-bind |
| Fluffers | Helper daemons that do pre-checks for other services |

### Easter Eggs (Triggerable or Rare UI Events)

- Typing 69 into a port field triggers a NSFW beep
- Searching for port 1337 shows a l33t hacker pop-up
- Entering a conflicting port flashes a "No means no!" banner
- Binding to port 420 enables "high availability" mode
- Registering from 127.0.0.1 at 4:20am triggers "local hookup" badge
- Fluffer mode has a 3% chance of moaning during handshake
- If all services crash: a disco ball drops and Barry White plays
- Dark mode flickers on and off randomly on April 1
- A rare "Casting Couch Mode" darkens UI with red velvet trim
- Use of '–raw' CLI flag triggers parental warning
- Typing 'hubba hubba' into terminal opens retro 70s console

### Terminology

- **Hublet** – A registered microservice
- **Fluffer** – A port pre-check service
- **Peep Show** – Dashboard of current open ports
- **Casting Call** – Unclaimed services asking to be registered
- **Backdoor** – Services running on privileged ports
- **Safe Word** – CLI shutdown command
- **Money Shot** – Final handshake confirmation

⸻

## 🚀 Development Strategy & Implementation Plan

### 📋 Strategic Decisions Summary

#### **Development Philosophy**

- **Professional Polish Day One**: No MVP release - slick and lubricated
  first release
- **macOS First**: Single platform focus for adoption, identical experience
  planned for other platforms
- **Automated Everything**: Self-documenting CLI, auto-updating
  documentation, progress tracking
- **Maximum Compute**: Use highest available AI models (o4, Opus) for
  development assistance

#### **Technology Stack Decisions**

- **NPM Distribution**: Single package `@porthub/porthub` containing
  everything
- **CLI Architecture**: Docker-style with custom PortHub commands
  (`porthub start sneakysniffer --dirty`)
- **Dashboard Technology**: React-based (decision deferred for
  architecture review)
- **Documentation**: Automated generation with manual polish, tracks
  roadmap updates automatically

#### **User Experience Configuration**

- **Dashboard Control Central**: All major settings configurable via
  "Port Exploder" UI
- **Three Control Levels**:
  - 🕺 **Full Pimp**: "I'll handle this crisis for you, sir"
    (helpful butler)
  - 🎭 **Casting Consultant**: "Here's what I recommend, but you decide"
    (professional consultant)
  - 👁️ **Voyeur**: "Here's what happened, good luck figuring it out"
    (informed observer)

#### **Feature Naming Conventions**

- **Port Exploder**: Main dashboard with resizable/sortable columns
  (Excel/file explorer style)
- **SneakySniffer**: Port scanning command
  (`porthub start sneakysniffer`)
- **Port Fluffer**: Little Snitch-style notification popups for
  conflicts
- **Nucleargasm**: Hidden nuclear reset option (secret command with
  clitoral snarkiness)
- **PortVision**: Community news feed showing download stats, GitHub
  mentions, etc.
- **Log-Therapy/Port-Therapy**: Immediate + contextual help for user
  mistakes

### 🎯 Development Priorities & Timeline

#### **Phase 1: Foundation (Weeks 1-4)**

- **Core CLI Framework**: Self-documenting help system, command
  structure
- **Basic Daemon**: Process management, PID handling, core registry
- **Essential Configuration**: Port Pimp wizard setup, config
  hierarchy
- **Native OS Integration**: macOS port scanning, service detection

#### **Phase 2: Intelligence (Weeks 5-8)**

- **STD Testing System**: Service & Transmission Diagnostics full
  implementation
- **Real-time Monitoring**: Service detection, conflict resolution,
  Port Fluffer notifications
- **Device Classification**: PortStars, PortHogs, D.H.C.P.,
  Butterflies
- **Error Handling**: Comprehensive recovery, Port Pimp Rehab system

#### **Phase 3: Interface (Weeks 9-12)**

- **Port Exploder Dashboard**: React-based UI with full
  configurability
- **PortVision Feed**: Community stats, download metrics, GitHub
  integration
- **Advanced Features**: GANG BANG mode, performance monitoring,
  analytics
- **Testing & Polish**: Comprehensive testing, performance
  optimization

#### **Phase 4: Professional Polish (Weeks 13-16)**

- **Documentation Automation**: Auto-generated docs, progress
  tracking
- **Beta Testing Program**: Invite-only beta cucks for feedback
- **Performance Benchmarking**: Meet all performance targets
- **Release Preparation**: NPM packaging, GitHub repository, community
  setup

### 🧪 Testing & Quality Strategy

#### **Comprehensive Quality Approach**

- **Manual Testing**: Developer testing during development phases
- **Automated Testing**: Unit tests, integration tests, CLI command
  validation
- **Beta User Testing**: Real developers in real environments
  (beta cucks program)
- **Performance Testing**: Continuous benchmarking against targets

#### **Performance Benchmarks**

- **CLI Response Time**: Under 100ms for simple commands
  (aim to "shoot at targets")
- **Daemon Memory Usage**: Under 50MB RAM (professional efficiency)
- **System Scan Performance**: Full scan under 5 seconds
  (SneakySniffer speed)
- **Dashboard Load Time**: Under 2 seconds to full functionality
  (instant gratification)
- **Port Detection Latency**: Real-time service detection under
  1 second

### 📦 Distribution & Community Strategy

#### **NPM Packaging**

- **Single Package**: `@porthub/porthub` contains CLI, daemon,
  dashboard
- **Global Installation**: `npm install -g @porthub/porthub`
- **Automatic Updates**: Built-in update notification and migration
  tools
- **Semantic Versioning**: Major versions can break compatibility with
  migration tools

#### **Documentation Automation**

- **Roadmap Synchronization**: Documentation automatically updates with
  roadmap changes
- **Progress Tracking**: Mandatory progress log updates during development
- **CLI Self-Documentation**: Dynamic help system detects command changes
- **API Documentation**: Auto-generated from JSDoc with manual polish

#### **Community & Feedback**

- **GitHub Integration**: Traditional open source issue tracking
- **Built-in Analytics**: PortHub reports usage/performance data (configurable)
- **PortVision Feed**: Dashboard shows download stats, community mentions,
  GitHub activity
- **Beta Program**: Invite-only early adopters ("beta cucks") for pre-release testing

### 🛠️ CLI Design Specification

#### **Command Structure Philosophy**

```bash
# Docker-style with PortHub personality
porthub [command] [target] [options] [flags]

# Examples:
porthub start sneakysniffer --dirty --clean --diponly
porthub rub wizard --force
porthub pimp status --verbose
porthub explode dashboard --port 8080
porthub fluff notifications --enable
```

#### **Self-Documenting Help System**

- **Dynamic Discovery**: `porthub help` scans available commands automatically
- **Interactive Navigation**: Drill-down help with examples and context
- **Auto-Update**: New commands automatically appear in help system
- **Context-Sensitive**: Help adapts based on current system state

### 📊 Success Metrics & Analytics

#### **Adoption Metrics**

- **Download Statistics**: NPM install counts, GitHub clones
- **Active Users**: Daemon usage tracking, CLI command frequency
- **Retention Rates**: User return patterns, long-term usage

#### **Functionality Metrics**

- **Ports Managed**: Total ports under PortHub management
- **Conflicts Resolved**: Successful Port Fluffer interventions
- **System Uptime**: Daemon stability and crash recovery success
- **Performance Accuracy**: How close we "shoot at our targets"

#### **Community Metrics**

- **GitHub Stars**: Repository popularity and growth
- **Issues Resolved**: Support quality and response time
- **Contributions**: Community involvement and code contributions
- **PortVision Mentions**: Social media, blog posts, developer discussions

#### **User Satisfaction**

- **Built-in Feedback**: Optional usage surveys and feedback prompts
- **Beta Testimonials**: Feedback from beta cuck program
- **Performance Achievement**: Meeting benchmark targets consistently

### 🔄 Backward Compatibility & Migration

#### **Version Management**

- **Major Version Breaks**: Allowed with comprehensive migration tools
- **Deprecation Warnings**: Gentle transition periods with snarky notifications
- **Automatic Migration**: Scripts handle breaking changes transparently
- **Rollback Support**: Previous version restoration if migration fails

#### **Configuration Evolution**

- **Schema Versioning**: Config files track version compatibility
- **Port Pimp Rehab**: Enhanced to handle version migrations
- **Backup Strategy**: Automatic backups before major upgrades
- **User Communication**: Clear notification of changes and impacts

### 🧠 AI-Assisted Development Strategy

#### **Maximum Compute Utilization**

- **Primary Development**: Use highest available AI models (o4, Opus)
- **Code Review**: AI-assisted code quality and architecture review
- **Testing Strategy**: AI-generated test cases and edge case identification
- **Documentation**: AI-assisted technical writing with human polish

#### **Multi-Model Validation**

- **Architecture Review**: Multiple AI models validate technical decisions
- **Security Analysis**: Different models analyze security implications
- **Performance Optimization**: AI-suggested performance improvements
- **User Experience**: AI evaluation of interface and interaction design

⸻
