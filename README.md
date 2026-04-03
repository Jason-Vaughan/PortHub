<div align="center">
  <img src="https://raw.githubusercontent.com/Jason-Vaughan/project-assets/refs/heads/main/porthub-logo.png" alt="PortHub Logo" width="300">
</div>

# PortHub — DHCP for Developers

A port registry that prevents conflicts across all your development projects. Built for AI-assisted development workflows where agents spin up dev servers, databases, and services across multiple projects simultaneously.

## The Problem

You're working with an AI coding agent — Claude Code, Codex, Aider — and it spins up a dev server on port 3000. You switch to another project, the agent tries port 3000 again, and you get `EADDRINUSE`. The agent doesn't know what's running on your machine. It guesses a port, maybe tries 3001, maybe picks something random. Multiply this across 5-10 active projects with dev servers, databases, test runners, and preview servers, and you're in port chaos.

PortHub fixes this by acting as a central registry. You add one rule to your AI agent's instructions:

> **Before binding to any port, check PortHub and register it. Before picking a new port, check what's already taken.**

That's it. The agent queries the registry, picks a free port, registers it, and moves on. No conflicts, no guessing, no `kill -9` hunting for whatever's squatting on port 3000.

## How It Works

```bash
# Check what's taken
porthub status

# Register a port for your project
porthub lease 3200 --project "my-app" --service "dev-server" --ttl 8h

# Permanent lease for infrastructure
porthub lease 5432 --service "postgres" --permanent

# Release when done
porthub release 3200
```

Leases have TTLs so forgotten dev servers don't hold ports forever. Permanent leases are for databases and core services that should always be registered. Conflict detection suggests alternatives when a port is taken.

## AI Agent Integration

Add this to your project's `CLAUDE.md`, `.codex.yaml`, or equivalent agent config:

```markdown
## Port Management

Never hardcode ports. Before binding to any port:
1. Check what's taken: `porthub status`
2. Register your port: `porthub lease <port> --project "<name>" --service "<service>" --ttl 8h`
3. Release when done: `porthub release <port>`

Port ranges:
- 3200-3999: Project dev servers and APIs
- 4000-4999: Test runners, watchers, auxiliary services
- 5000+: Ad hoc / temporary
```

The agent treats PortHub as the source of truth for port assignments. No more conflicts.

## Features

- **Lease management** — temporary (TTL) and permanent leases with heartbeat support
- **Conflict detection** — warns when a port is taken and suggests alternatives
- **Real-time dashboard** — web UI for monitoring all active leases
- **System scanning** — SneakySniffer detects ports in use system-wide via lsof
- **Workspace discovery** — auto-detects projects and their port configurations
- **REST API** — full API for programmatic access (used by TangleClaw integration)
- **WebSocket updates** — real-time lease status changes

## Installation

```bash
git clone https://github.com/Jason-Vaughan/PortHub.git
cd PortHub && npm install -g .

# Start the daemon
porthub start --daemon

# Verify
porthub status
```

## Quick Start

```bash
# 1. Start the daemon (runs in background)
porthub start --daemon --port 8080

# 2. Register your infrastructure (one time)
porthub lease 5432 --service "postgres" --permanent
porthub lease 6379 --service "redis" --permanent

# 3. Register project dev servers (daily)
porthub lease 3000 --project "frontend" --service "dev-server" --ttl 8h
porthub lease 3200 --project "api" --service "express" --ttl 8h

# 4. Check status
porthub status
```

## Command Reference

| Command | Description |
|---------|-------------|
| `porthub start --daemon` | Start the PortHub daemon |
| `porthub lease <port>` | Register a port lease |
| `porthub release <port>` | Release a port lease |
| `porthub status` | Show all active leases |
| `porthub heartbeat <port>` | Extend a lease TTL |
| `porthub start sneakysniffer` | Scan system for ports in use |
| `porthub discover` | Discover project workspaces |

### Lease Options

| Option | Description |
|--------|-------------|
| `--project <name>` | Project name (auto-detected from git/package.json) |
| `--service <name>` | Service name |
| `--ttl <duration>` | Lease duration (`30m`, `2h`, `1d`, `permanent`) |
| `--permanent` | Never expires |
| `--auto-renew` | Automatic renewal |

## TangleClaw Integration

PortHub is fully integrated into [TangleClaw](https://github.com/Jason-Vaughan/TangleClaw) — an AI coding session orchestrator. If you want port management as part of a larger platform that also handles persistent sessions, multi-engine config generation, and methodology enforcement, check out TangleClaw instead of running PortHub standalone.

In TangleClaw, PortHub runs as a built-in module with a visual registry in the dashboard, automatic port conflict detection across all managed projects, and API access for AI agents.

## Architecture

```
CLI (porthub commands)
  ↕ IPC
Daemon (background service)
  ├─ Port Registry (in-memory, TTL management)
  ├─ REST API (programmatic access)
  ├─ WebSocket (real-time updates)
  ├─ Dashboard (web UI on :8081)
  └─ SneakySniffer (system port scanner)
```

## Prerequisites

- Node.js >= 18.0.0
- macOS, Linux, or Windows

## License

MIT — see [LICENSE](LICENSE)

## Contributing

Contributions welcome — open an issue or submit a PR.
