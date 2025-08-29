# Global Cursor Rules Template for PortHub Integration
# Copy this to your global Cursor rules to enable automatic port management

## PortHub DHCP-Style Port Management
**Auto-lease and release ports for every project**

```typescript
// PortHub Global Integration Rules
// "DHCP for Developers - Auto-Port Management"

// 1. AUTO-DETECT PROJECT CONTEXT
// When starting any development server, auto-lease ports
// Place this in your global cursor rules:

interface PortHubConfig {
  daemon: 'porthub start --daemon';
  autoLease: boolean;
  defaultTTL: string;
  autoRenew: boolean;
}

// 2. COMMON DEV SERVER PATTERNS
const commonPorts = {
  // React/Next.js
  'npm run dev': { port: 3000, service: 'dev-server', ttl: '4h' },
  'npm start': { port: 3000, service: 'app-server', ttl: '4h' },
  'next dev': { port: 3000, service: 'next-dev', ttl: '4h' },
  
  // Storybook
  'npm run storybook': { port: 6006, service: 'storybook', ttl: '2h' },
  'storybook dev': { port: 6006, service: 'storybook', ttl: '2h' },
  
  // Vite
  'npm run dev': { port: 5173, service: 'vite-dev', ttl: '4h' },
  'vite dev': { port: 5173, service: 'vite-dev', ttl: '4h' },
  
  // Express/Node
  'npm run server': { port: 8080, service: 'api-server', ttl: '6h' },
  'node server.js': { port: 8080, service: 'node-server', ttl: '6h' },
  
  // Database Services  
  'postgres': { port: 5432, service: 'postgres', ttl: '24h' },
  'redis-server': { port: 6379, service: 'redis', ttl: '12h' },
  'mongod': { port: 27017, service: 'mongodb', ttl: '24h' }
};

// 3. AUTO-LEASE BEFORE RUNNING COMMANDS
// Add this to your global rules:
```

## Implementation Instructions

### Step 1: Enable PortHub Daemon
Add to your shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
# Auto-start PortHub daemon on shell startup
if ! pgrep -f "porthub.*daemon" > /dev/null; then
  porthub start --daemon --port 8080 >/dev/null 2>&1 &
  echo "🎭 PortHub daemon started"
fi
```

### Step 2: Global Cursor Rules
Add to your global Cursor rules:

```markdown
## PortHub Auto-Port Management

### Pre-Command Hook
Before running any development server command:
1. **Auto-lease port**: `porthub lease {PORT} --project {PROJECT_NAME} --service {SERVICE_NAME} --ttl {TTL}`
2. **Conflict handling**: If port conflicts, use suggested alternative
3. **Project detection**: Auto-detect project from git repo or package.json

### Common Commands with Auto-Lease:
- **npm run dev**: `porthub lease 3000 --service "dev-server" --ttl 4h`
- **npm run storybook**: `porthub lease 6006 --service "storybook" --ttl 2h`  
- **npm run server**: `porthub lease 8080 --service "api-server" --ttl 6h`

### Heartbeat During Development:
While project is active, send heartbeat every 30 minutes:
`porthub heartbeat {PORT} --project {PROJECT_NAME}`

### Clean Shutdown:
When closing project or stopping servers:
`porthub release {PORT} --project {PROJECT_NAME}`
```

### Step 3: Package.json Integration
Add to your projects' `package.json`:

```json
{
  "scripts": {
    "dev": "porthub lease 3000 --service dev-server --ttl 4h && next dev && porthub release 3000",
    "storybook": "porthub lease 6006 --service storybook --ttl 2h && storybook dev -p 6006 && porthub release 6006",
    "server": "porthub lease 8080 --service api-server --ttl 6h && node server.js && porthub release 8080",
    
    "porthub:status": "porthub status",
    "porthub:scan": "porthub start sneakysniffer",
    "porthub:heartbeat": "porthub heartbeat 3000"
  }
}
```

## Advanced Integration

### VS Code Tasks Integration
Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server with PortHub",
      "type": "shell",
      "command": "porthub lease 3000 --service dev-server --ttl 4h && npm run dev",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "PortHub Status",
      "type": "shell", 
      "command": "porthub status",
      "group": "test"
    }
  ]
}
```

### Git Hooks Integration
Add to `.git/hooks/post-checkout`:

```bash
#!/bin/bash
# Auto-lease default ports when switching branches
if [ -f package.json ]; then
  echo "🎭 Setting up PortHub leases for $(basename $(pwd))"
  porthub lease 3000 --service "dev-server" --ttl 8h --auto-renew
fi
```

## Workflow Examples

### Perfect Multi-Project Workflow:

```bash
# Project 1: MyReactApp
cd ~/projects/MyReactApp
porthub lease 3000 --service "dev-server" --ttl 4h
porthub lease 6006 --service "storybook" --ttl 2h
npm run dev    # Uses port 3000
npm run storybook  # Uses port 6006

# Project 2: MyAPIServer  
cd ~/projects/MyAPIServer
porthub lease 8080 --service "api-server" --ttl 6h
porthub lease 5432 --service "postgres" --ttl 24h
npm run server  # Uses port 8080

# Check all active leases
porthub status
# 📊 Active Port Leases:
# 🔌 Port 3000 - MyReactApp/dev-server (expires in 3h 45m)
# 🔌 Port 6006 - MyReactApp/storybook (expires in 1h 45m)  
# 🔌 Port 8080 - MyAPIServer/api-server (expires in 5h 45m)
# 🔌 Port 5432 - MyAPIServer/postgres (expires in 23h 45m)
```

### Conflict Resolution:
```bash
porthub lease 3000 --service "new-project"
# ⚠️  Port 3000 conflicts with MyReactApp/dev-server
# 🎯 Suggested alternative: Port 3002 available
# 💡 Run: porthub lease 3002 --service "new-project"

porthub lease 3002 --service "new-project" --ttl 2h
# ✅ Port 3002 leased successfully!
```

## Benefits

✅ **No More Port Conflicts**: DHCP-style management prevents collisions  
✅ **Project Awareness**: Knows which project owns which ports  
✅ **Automatic Cleanup**: TTL ensures abandoned ports are freed  
✅ **Multi-Project Support**: Run many projects simultaneously  
✅ **Cursor Integration**: Seamless workflow in your IDE  
✅ **Real-Time Monitoring**: WebSocket updates and status dashboard  

## Permanent Leases for Infrastructure

### Perfect for Persistent Services:
```bash
# Database servers (never expire)
porthub lease 5432 --service "postgres" --permanent
porthub lease 3306 --service "mysql" --permanent  
porthub lease 27017 --service "mongodb" --permanent

# Cache servers
porthub lease 6379 --service "redis" --permanent

# Core APIs
porthub lease 8000 --service "admin-api" --permanent
porthub lease 9000 --service "monitoring" --permanent
```

### Mixed Workflow Example:
```bash
# Set up permanent infrastructure (one time)
porthub lease 5432 --service "postgres" --permanent
porthub lease 6379 --service "redis" --permanent  
porthub lease 8000 --service "admin-api" --permanent

# Project-specific temporary leases
porthub lease 3000 --project "ReactApp" --ttl 8h       # Frontend for work day
porthub lease 4000 --project "TestAPI" --ttl 2h        # API testing session
porthub lease 9001 --project "DevTools" --ttl 4h       # Development utilities

# Status shows both permanent and temporary
porthub status
# ♾️  Port 5432 - Database/postgres (PERMANENT)
# ♾️  Port 6379 - Cache/redis (PERMANENT)  
# ♾️  Port 8000 - Admin/admin-api (PERMANENT)
# 🔌 Port 3000 - ReactApp/dev-server (expires in 7h 30m)
# 🔌 Port 4000 - TestAPI/api-server (expires in 1h 45m)
```

## Commands Reference

| Command | Description | Example |
|---------|-------------|---------|
| `porthub lease <port>` | Request port lease | `porthub lease 3000 --ttl 2h` |
| `porthub lease <port> --permanent` | **Create permanent lease** | `porthub lease 5432 --service postgres --permanent` |
| `porthub lease <port> --ttl permanent` | **Permanent via TTL** | `porthub lease 6379 --ttl permanent` |
| `porthub release <port>` | Release port lease | `porthub release 3000` |
| `porthub status` | Show all leases | `porthub status --json` |
| `porthub heartbeat <port>` | Extend lease | `porthub heartbeat 3000` |
| `porthub start sneakysniffer` | Scan active ports | `porthub start sneakysniffer --dirty` |
| `porthub start --daemon` | **Start DHCP daemon** | `porthub start --daemon --port 8080` |

### Lease Options:
- `--project <name>` - Project name (auto-detected from git/package.json)
- `--service <name>` - Service name (e.g., "dev-server", "postgres", "redis")
- `--ttl <duration>` - Lease duration: "2h", "30m", "1d", "permanent"
- `--permanent` - Create permanent lease (never expires)
- `--auto-renew` - Enable automatic lease renewal
- `--description <desc>` - Port description

**"No Conflicts. Just Connections."** 🎭✨
