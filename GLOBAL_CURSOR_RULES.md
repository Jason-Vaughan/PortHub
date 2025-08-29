# PortHub Global Cursor Rules
# "DHCP for Developers - Automatic Port Management"

---
description: PortHub global rules for automatic workspace port registration and management
globs: 
alwaysApply: true
---

## 🎯 PortHub Integration Philosophy
You are working with **PortHub - the professional port registry** that manages development ports like a DHCP server. Every project workspace should automatically register its required ports to avoid conflicts and enable seamless multi-project development.

## 🚀 Automatic Port Registration Protocol

### **MANDATORY: Check PortHub Status First**
Before making ANY port-related suggestions, ALWAYS run these commands:

```bash
# 1. Check if PortHub daemon is running
porthub status

# 2. If not running, start it
porthub start --daemon --port 8080

# 3. Register PortHub infrastructure ports permanently  
porthub discover --register
```

### **Port Lease Workflow (CRITICAL)**
For EVERY port requirement in ANY project:

```bash
# 1. Check port availability
porthub status

# 2. Request lease with appropriate TTL
porthub lease <port> --service "<service-name>" --project "<project-name>" --ttl <duration>

# 3. For infrastructure ports (databases, core APIs)
porthub lease <port> --service "<service-name>" --permanent

# 4. Before project shutdown, release temporary ports
porthub release <port>
```

## 📋 Port Registration Patterns

### **Web Development Projects**
```bash
# Development servers
porthub lease 3000 --service "dev-server" --ttl 8h
porthub lease 3001 --service "api-server" --ttl 8h  
porthub lease 3002 --service "storybook" --ttl 4h

# Hot reload/HMR
porthub lease 24678 --service "vite-hmr" --ttl 8h
porthub lease 8080 --service "webpack-dev" --ttl 8h
```

### **Database Services (Permanent)**
```bash
# Persistent database servers
porthub lease 5432 --service "postgres" --permanent
porthub lease 3306 --service "mysql" --permanent
porthub lease 6379 --service "redis" --permanent
porthub lease 27017 --service "mongodb" --permanent
```

### **API Development**
```bash
# API servers with reasonable TTL
porthub lease 8000 --service "rest-api" --ttl 6h
porthub lease 8001 --service "graphql-api" --ttl 6h
porthub lease 4000 --service "apollo-server" --ttl 6h
```

### **Container & DevOps**
```bash
# Docker services
porthub lease 2375 --service "docker-daemon" --permanent
porthub lease 2376 --service "docker-tls" --permanent

# Monitoring & metrics
porthub lease 9090 --service "prometheus" --permanent
porthub lease 3000 --service "grafana" --permanent
porthub lease 9093 --service "alertmanager" --permanent
```

### **Testing & Development Tools**
```bash
# Test runners and tools
porthub lease 9229 --service "node-debug" --ttl 2h
porthub lease 6006 --service "storybook" --ttl 4h
porthub lease 8080 --service "mock-server" --ttl 4h
```

## 🔄 Auto-Registration Triggers

### **Project Setup Commands**
When user runs any of these commands, suggest appropriate PortHub leases:

- `npm start` / `yarn start` → Register port 3000 (8h TTL)
- `npm run dev` / `yarn dev` → Register dev server port (8h TTL)  
- `docker-compose up` → Register all exposed ports (varies by service)
- `./manage.py runserver` → Register Django port 8000 (6h TTL)
- `rails server` → Register Rails port 3000 (8h TTL)
- `php artisan serve` → Register Laravel port 8000 (6h TTL)

### **Package.json Detection**
When you see these scripts in package.json, auto-suggest leases:

```json
{
  "scripts": {
    "dev": "next dev -p 3000", // → porthub lease 3000 --service "next-dev" --ttl 8h
    "start": "node server.js", // → Check server.js for port, suggest lease
    "storybook": "start-storybook -p 6006" // → porthub lease 6006 --service "storybook" --ttl 4h
  }
}
```

### **Docker Compose Detection**
When you see docker-compose.yml, parse ports and suggest:

```yaml
services:
  web:
    ports:
      - "3000:3000"  # → porthub lease 3000 --service "web-container" --ttl 8h
  db:
    ports:
      - "5432:5432"  # → porthub lease 5432 --service "postgres-db" --permanent
```

## 🛡️ Conflict Resolution Protocol

### **When Port Conflicts Occur**
```bash
# 1. Check what's using the port
porthub status

# 2. If conflict detected, PortHub suggests alternatives
porthub lease 3000 --service "my-app"
# Output: "Port 3000 unavailable. Suggested alternatives: 3001, 3002, 3003"

# 3. Use suggested alternative
porthub lease 3001 --service "my-app" --ttl 8h

# 4. Update your app configuration to use new port
# (Assistant should suggest specific config changes)
```

### **Multi-Project Coordination**
- **React App**: Port 3000-3010 range
- **APIs**: Port 8000-8010 range  
- **Databases**: Standard ports (5432, 3306, 6379) - permanent
- **Tools**: Port 6000-6010 range
- **Development**: Port 4000-4010 range

## 🎭 Integration Examples

### **Next.js Project Setup**
```bash
# Complete Next.js setup with PortHub
porthub lease 3000 --service "next-dev" --ttl 8h
npm run dev

# Hot reload port (if custom)
porthub lease 24678 --service "next-hmr" --ttl 8h
```

### **Full-Stack Development**
```bash
# Frontend (React)
porthub lease 3000 --service "react-frontend" --ttl 8h

# Backend API
porthub lease 8000 --service "node-api" --ttl 8h

# Database (permanent)
porthub lease 5432 --service "postgres-db" --permanent

# Start all services
npm run dev & cd ../api && npm start & docker start postgres
```

### **Microservices Architecture**
```bash
# Service mesh coordination
porthub lease 8001 --service "user-service" --ttl 6h
porthub lease 8002 --service "payment-service" --ttl 6h  
porthub lease 8003 --service "notification-service" --ttl 6h
porthub lease 8080 --service "api-gateway" --ttl 8h
```

## 🚨 Critical Rules for AI Assistants

### **NEVER suggest hardcoded ports without PortHub**
❌ **Wrong**: "Your app will run on port 3000"
✅ **Correct**: "Let's register port 3000 with PortHub first: `porthub lease 3000 --service 'your-app' --ttl 8h`"

### **ALWAYS check for existing leases**
Before any port suggestion, run: `porthub status`

### **SUGGEST appropriate TTL based on use case**
- **Development servers**: 8h (full work day)
- **APIs being developed**: 6h (work session)
- **Testing/debugging**: 2h (focused session)
- **Infrastructure/databases**: `--permanent`
- **Quick demos**: 1h (presentation)

### **COORDINATE with project type**
- **Frontend projects**: Ports 3000-3999
- **Backend APIs**: Ports 8000-8999  
- **Databases**: Standard ports with `--permanent`
- **Development tools**: Ports 6000-6999
- **Testing services**: Ports 9000-9999

### **EDUCATE users about benefits**
Explain: "PortHub prevents port conflicts across your projects and provides automatic lease management with TTL expiration."

## 🔧 Workspace Setup Automation

### **New Project Initialization**
```bash
# 1. Create PortHub workspace config
cat > porthub.json << EOF
{
  "name": "${PROJECT_NAME}-workspace",
  "description": "${PROJECT_DESCRIPTION}",
  "portRanges": {
    "static": [1024, 65535],
    "dynamic": [3000, 3999]
  },
  "autoScan": true,
  "notifications": true,
  "theme": "casting-consultant"
}
EOF

# 2. Register with global PortHub discovery
porthub discover

# 3. Lease required ports
porthub lease 3000 --service "main-app" --ttl 8h
```

### **Project Teardown**
```bash
# Release temporary leases (permanent ones stay)
porthub release 3000
porthub release 8000
# (Permanent leases like databases remain registered)
```

## 📊 Monitoring & Maintenance

### **Regular Health Checks**
```bash
# Check all active leases
porthub status

# Renew expiring leases
porthub heartbeat <port>

# Clean up expired leases (daemon handles automatically)
```

### **Multi-Workspace Visibility**
```bash
# Discover all workspaces on system
porthub discover

# See cross-project port usage
porthub status --all-workspaces  # (future feature)
```

## 🎯 Success Metrics

A properly PortHub-integrated development workflow should have:
- ✅ **Zero port conflicts** between projects
- ✅ **Automatic lease management** with appropriate TTL
- ✅ **Permanent infrastructure** ports registered
- ✅ **Seamless project switching** without port collision
- ✅ **Clear port ownership** and expiration tracking

## 💡 Pro Tips

1. **Always start PortHub daemon first** in your dev environment
2. **Use permanent leases for databases** and core infrastructure  
3. **Set TTL based on work session length** (8h for full day, 2h for debugging)
4. **Register ports BEFORE starting services** to avoid conflicts
5. **Use workspace configs** for project-specific port ranges
6. **Monitor lease expiration** to avoid unexpected service interruptions

## 🔗 Integration Commands Reference

| Command | When to Use | Example |
|---------|-------------|---------|
| `porthub status` | Before any port operation | Always first |
| `porthub lease <port> --ttl 8h` | Development servers | React, Next.js, APIs |
| `porthub lease <port> --permanent` | Infrastructure services | Databases, core APIs |
| `porthub release <port>` | Project shutdown | Cleanup temporary leases |
| `porthub heartbeat <port>` | Extend active lease | Keep long-running services |
| `porthub discover --register` | System setup | Register PortHub infrastructure |

---

**Remember: "No Conflicts. Just Connections."**  
**"Get it up. Get it bound. Stay registered."** 🎭✨
