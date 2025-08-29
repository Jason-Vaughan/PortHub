# PortHub Release Strategy
**"Get it up. Get it bound. Stay registered."** 🎭

## 🚀 Release Overview

PortHub follows a professional release process with snarky personality. We ship quality code that parties responsibly.

### **🎯 Current Status**
- **Version**: `0.1.0-alpha.1` (package.json)
- **NPM Package**: `@porthub/porthub`
- **GitHub Repo**: `https://github.com/porthub/porthub.git`
- **Build System**: TypeScript → `dist/`
- **CLI Binary**: `dist/cli.js`

### **🎭 Release Philosophy**
- **No Bloat**: Every feature must justify its existence
- **No Debt**: Technical debt gets fixed immediately
- **No Bullshit**: Releases ship when they're ready, not on arbitrary timelines
- **Snarky but Stable**: Personality in messaging, professionalism in functionality

## 📋 Pre-Release Checklist

### **🧹 Code Quality Gates**
- [ ] **All tests pass**: `npm test`
- [ ] **Clean build**: `npm run clean && npm run build`
- [ ] **Linting clean**: `npm run lint`
- [ ] **TypeScript compilation**: No errors or warnings
- [ ] **Tech debt resolved**: Check TECHDEBT.md, fix critical items
- [ ] **Documentation current**: README.md matches current functionality

### **🔧 Functional Validation**
- [ ] **CLI commands work**: All `porthub` commands execute successfully
- [ ] **Daemon startup**: `porthub start --daemon --port 8080`
- [ ] **Port leasing**: `porthub lease 3000 --service test --ttl 5m`
- [ ] **Status reporting**: `porthub status` shows accurate data
- [ ] **Port release**: `porthub release 3000`
- [ ] **Dashboard access**: http://localhost:8081/ loads correctly
- [ ] **WebSocket connectivity**: Real-time updates working
- [ ] **SneakySniffer**: `porthub start sneakysniffer --dirty`

### **📚 Documentation Validation**
- [ ] **README.md accuracy**: All examples work as documented
- [ ] **Command help**: `porthub --help` and `porthub <command> --help`
- [ ] **Installation guide**: Fresh install process validated
- [ ] **Integration examples**: Package.json scripts, VS Code tasks
- [ ] **Cursor rules template**: Global rules file current

### **🎨 Brand Consistency**
- [ ] **Snarky personality**: Error messages, success messages, CLI output
- [ ] **Tagline presence**: "No Conflicts. Just Connections."
- [ ] **Development philosophy**: "Get it up. Get it bound. Stay registered."
- [ ] **Color scheme**: Black background, orange (#FF9900) primary
- [ ] **PortHub terminology**: Consistent use throughout

## 🔢 Version Strategy

### **🎯 Semantic Versioning**
- **Major (x.0.0)**: Breaking changes, architecture overhauls
- **Minor (0.x.0)**: New features, backward compatible
- **Patch (0.0.x)**: Bug fixes, documentation updates

### **🏷️ Release Tags**
- **alpha**: Early development, core features incomplete
- **beta**: Feature complete, testing and refinement
- **rc**: Release candidate, final testing
- **stable**: Production ready, full support

### **📅 Current Roadmap**
- **v0.1.0-alpha.2**: Enhanced dashboard, improved CLI
- **v0.1.0-beta.1**: Feature complete, community testing
- **v0.1.0-rc.1**: Release candidate
- **v0.1.0**: First stable release

## 📦 NPM Publishing Process

### **🔧 Pre-Publish Setup**
```bash
# 1. Ensure clean working directory
git status
git add -A && git commit -m "Pre-release: Final cleanup and documentation"

# 2. Version bump (choose appropriate level)
npm version patch    # 0.1.0-alpha.1 → 0.1.0-alpha.2
npm version minor    # 0.1.0-alpha.1 → 0.1.1-alpha.1  
npm version major    # 0.1.0-alpha.1 → 0.2.0-alpha.1

# 3. Clean build
npm run clean
npm run build

# 4. Test package locally
npm pack
npm install -g porthub-0.1.0-alpha.2.tgz
porthub --version
porthub --help
npm uninstall -g @porthub/porthub
```

### **🚀 Publish Commands**
```bash
# 1. Login to NPM (first time only)
npm login

# 2. Publish alpha/beta versions
npm publish --tag alpha
npm publish --tag beta

# 3. Publish stable release
npm publish

# 4. Verify publication
npm view @porthub/porthub
npm info @porthub/porthub dist-tags
```

### **🎯 NPM Package Configuration**
Current `package.json` setup:
- **Name**: `@porthub/porthub` (scoped package)
- **Binary**: `porthub` command → `dist/cli.js`
- **Main**: `dist/index.js`
- **Build hook**: `prepublishOnly: npm run build`
- **Keywords**: port, registry, dhcp, development, cli, daemon
- **License**: MIT

## 🐙 GitHub Release Process

### **🏷️ Release Creation**
```bash
# 1. Create and push release tag
git tag -a v0.1.0-alpha.2 -m "PortHub v0.1.0-alpha.2: Enhanced Dashboard & CLI"
git push origin v0.1.0-alpha.2

# 2. GitHub CLI release (if gh installed)
gh release create v0.1.0-alpha.2 \
  --title "PortHub v0.1.0-alpha.2: Enhanced Dashboard & CLI" \
  --notes-file RELEASE_NOTES.md \
  --prerelease

# 3. Or create manually via GitHub web interface
```

### **📝 Release Notes Template**
```markdown
# PortHub v0.1.0-alpha.2
**"No Conflicts. Just Connections."** 🎭

## ✨ New Features
- Enhanced dashboard with real-time WebSocket updates
- Improved CLI with better error messages and snarky personality
- Forever easter egg for permanent leases
- SneakySniffer port scanning utility

## 🐛 Bug Fixes
- Fixed daemon startup race conditions
- Resolved WebSocket connection stability issues
- Corrected TTL calculation for lease expiration

## 🔧 Technical Improvements
- TypeScript build optimization
- Cleaner IPC communication
- Enhanced error handling throughout

## 🚀 Installation
```bash
npm install -g @porthub/porthub@alpha
porthub start --daemon --port 8080
```

## 📚 Documentation
- Complete CLI reference in README.md
- Global Cursor rules template
- Integration examples for VS Code and package.json

**"Get it up. Get it bound. Stay registered."** - PortHub Development Philosophy
```

### **📎 Release Assets**
Consider including:
- **Source code** (automatic via GitHub)
- **Built CLI binary** (if creating standalone executables)
- **Documentation archive** (user-facing docs only)

## 🌍 Distribution Strategy

### **🎯 Target Audiences**
1. **Individual Developers**: Personal port management
2. **Development Teams**: Multi-project coordination
3. **AI Assistants**: Cursor integration and automation
4. **DevOps Engineers**: Infrastructure port registry

### **📢 Release Channels**
1. **NPM Registry**: Primary distribution
2. **GitHub Releases**: Source and documentation
3. **Documentation Site**: User guides and examples (future)
4. **Developer Communities**: Reddit, Hacker News, Twitter (when stable)

### **🎭 Marketing Messages**
- **Primary**: "DHCP for Developers - Never worry about port conflicts again"
- **Technical**: "Professional port registry with DHCP-style lease management"
- **Personality**: "The port registry that parties responsibly"
- **Problem/Solution**: "No more 'address already in use' errors"

## ⚡ Release Automation (Future)

### **🔄 GitHub Actions Workflow**
```yaml
# .github/workflows/release.yml (future enhancement)
name: Release
on:
  push:
    tags: ['v*']
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - run: npm publish --tag ${GITHUB_REF#refs/tags/v*}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### **🎯 Automated Checks**
- Build and test on multiple Node.js versions
- Cross-platform testing (macOS, Linux, Windows)
- Dependency vulnerability scanning
- Documentation link validation

## 🚨 Emergency Release Process

### **🔥 Hotfix Workflow**
```bash
# 1. Create hotfix branch from main
git checkout -b hotfix/critical-daemon-fix

# 2. Make minimal fix
# Edit files...

# 3. Test thoroughly
npm run build && npm test

# 4. Version bump (patch)
npm version patch

# 5. Merge and release immediately
git checkout main
git merge hotfix/critical-daemon-fix
git push origin main
npm publish

# 6. Create GitHub release
gh release create $(git describe --tags) --notes "Critical hotfix: Daemon startup issue"
```

### **📞 Rollback Strategy**
```bash
# If release has critical issues
npm unpublish @porthub/porthub@0.1.0-alpha.2 --force
npm dist-tag add @porthub/porthub@0.1.0-alpha.1 alpha
```

## 📊 Release Metrics

### **🎯 Success Criteria**
- **NPM Downloads**: Target 100+ weekly downloads for beta
- **GitHub Stars**: Community engagement indicator
- **Issue Resolution**: <24h response time for critical bugs
- **Documentation Quality**: Clear installation and usage examples

### **📈 Tracking**
- NPM download statistics
- GitHub release download counts
- Issue and PR activity
- Community feedback and feature requests

## 🎭 PortHub Release Personality

### **🎯 Release Announcements**
- **Alpha**: "Still getting our act together, but the show must go on!"
- **Beta**: "The main event is ready for your review, esteemed guests"
- **Stable**: "Ladies and gentlemen, PortHub has officially entered the building"

### **📝 Changelog Tone**
- Professional functionality descriptions
- Snarky feature names and descriptions
- Technical accuracy with personality
- Clear upgrade paths and breaking changes

---

**"No Conflicts. Just Connections."** - Ready to ship professional port management with personality! 🎭

Made with 🎭 by the PortHub team
