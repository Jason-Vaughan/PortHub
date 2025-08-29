# PortHub v0.1.0-alpha.2 Release Checklist
**"Get it up. Get it bound. Stay registered."** 🎭

## 🎯 Release Target: v0.1.0-alpha.2
**Current Version**: `0.1.0-alpha.1`
**Next Version**: `0.1.0-alpha.2`
**Release Type**: Alpha enhancement with dashboard improvements

---

## ✅ Pre-Release Validation

### 🧹 Code Quality Gates
- [ ] **Clean Build**: `npm run clean && npm run build`
- [ ] **TypeScript Compilation**: Zero errors/warnings
- [ ] **Linting Clean**: `npm run lint` passes
- [ ] **Tests Pass**: `npm test` (if tests exist)
- [ ] **Dependencies Updated**: Check for security vulnerabilities

### 🔧 Functional Testing
- [ ] **CLI Commands Work**:
  - [ ] `porthub --version` shows correct version
  - [ ] `porthub --help` displays complete help
  - [ ] `porthub start --daemon --port 8080` starts successfully
  - [ ] `porthub status` shows accurate lease information
  - [ ] `porthub lease 3000 --service test --ttl 5m` creates lease
  - [ ] `porthub heartbeat 3000` extends lease
  - [ ] `porthub release 3000` removes lease
  - [ ] `porthub start sneakysniffer --dirty` scans ports

- [ ] **Dashboard Functionality**:
  - [ ] Dashboard loads at http://localhost:8081/
  - [ ] WebSocket connection establishes correctly
  - [ ] Real-time lease updates display
  - [ ] Forever easter egg works properly
  - [ ] UI styling consistent with PortHub branding

- [ ] **System Integration**:
  - [ ] macOS service installation via `./install-system-service.sh`
  - [ ] Daemon auto-starts on system boot
  - [ ] IPC communication stable between CLI and daemon
  - [ ] Multiple CLI commands work simultaneously

### 📚 Documentation Validation
- [ ] **README.md Current**: All examples work as documented
- [ ] **Command Help Accurate**: Help text matches actual behavior
- [ ] **Installation Guide**: Fresh install process validated
- [ ] **Release Notes**: v0.1.0-alpha.2 section complete
- [ ] **Release Strategy**: NPM and GitHub process documented

### 🎭 Brand Consistency
- [ ] **Snarky Personality**: CLI messages maintain PortHub voice
- [ ] **Taglines Present**: "No Conflicts. Just Connections." throughout
- [ ] **Color Scheme**: Orange (#FF9900) primary in dashboard
- [ ] **Error Messages**: Helpful and snarky tone
- [ ] **Success Messages**: Celebratory and personality-driven

---

## 📦 NPM Release Process

### 🔧 Pre-Publish Steps
```bash
# 1. Ensure clean working directory
git status
git add -A
git commit -m "Release v0.1.0-alpha.2: Enhanced dashboard and forever easter eggs"

# 2. Version bump
npm version prerelease --preid=alpha
# This will bump: 0.1.0-alpha.1 → 0.1.0-alpha.2

# 3. Verify version update
git log --oneline -1
git tag --list | tail -1

# 4. Clean build and test
npm run clean
npm run build
npm run lint
```

### 🚀 Publish Commands
```bash
# 1. Test package locally (optional but recommended)
npm pack
ls -la *.tgz
tar -tzf porthub-0.1.0-alpha.2.tgz | head -20

# 2. Publish to NPM with alpha tag
npm publish --tag alpha

# 3. Verify publication
npm view @porthub/porthub
npm view @porthub/porthub dist-tags
```

### ✅ Post-Publish Validation
- [ ] **NPM Package Available**: `npm view @porthub/porthub@alpha`
- [ ] **Global Install Test**: `npm install -g @porthub/porthub@alpha`
- [ ] **CLI Functionality**: `porthub --version` shows new version
- [ ] **Fresh System Test**: Install on clean system and validate

---

## 🐙 GitHub Release Process

### 🏷️ Create Release
```bash
# 1. Push tags (if not done automatically by npm version)
git push origin main
git push origin --tags

# 2. Create GitHub release (manual via web interface or CLI)
gh release create v0.1.0-alpha.2 \
  --title "PortHub v0.1.0-alpha.2: Enhanced Dashboard & Forever Easter Eggs" \
  --notes-file RELEASE_NOTES.md \
  --prerelease
```

### 📝 Release Content
- [ ] **Release Title**: "PortHub v0.1.0-alpha.2: Enhanced Dashboard & Forever Easter Eggs"
- [ ] **Release Notes**: Copy from RELEASE_NOTES.md v0.1.0-alpha.2 section
- [ ] **Pre-release Flag**: Marked as pre-release (alpha)
- [ ] **Assets**: Source code (automatic)

---

## 📊 Release Metrics & Tracking

### 🎯 Success Criteria
- [ ] **NPM Download**: Package available and downloadable
- [ ] **Installation Success**: Clean install on fresh systems
- [ ] **Functionality**: All core features working post-release
- [ ] **Documentation**: Users can follow installation guide successfully

### 📈 Post-Release Monitoring
- [ ] **NPM Downloads**: Monitor package download statistics
- [ ] **GitHub Issues**: Watch for bug reports or installation issues
- [ ] **Community Feedback**: Check for user feedback or questions
- [ ] **System Compatibility**: Validate across different environments

---

## 🚨 Emergency Procedures

### 🔥 If Critical Issue Found
```bash
# 1. Immediately unpublish if severe (within 24h of publish)
npm unpublish @porthub/porthub@0.1.0-alpha.2 --force

# 2. Revert to previous version
npm dist-tag add @porthub/porthub@0.1.0-alpha.1 alpha

# 3. Fix issue and re-release as alpha.3
```

### 📞 Rollback Strategy
- **NPM**: Unpublish and revert dist-tag
- **GitHub**: Mark release as draft or delete
- **Users**: Notify via GitHub issue if any users affected

---

## 🎉 Release Completion

### ✅ Final Checklist
- [ ] **NPM Published**: Package available at @porthub/porthub@alpha
- [ ] **GitHub Release**: Created with proper notes and assets
- [ ] **Documentation Updated**: README.md and release notes current
- [ ] **Tags Pushed**: Git tags synchronized with GitHub
- [ ] **Version Consistent**: package.json, npm, and git tags match

### 📢 Announcement (Optional for Alpha)
- [ ] **GitHub Discussions**: Post about new alpha release
- [ ] **Development Log**: Update internal progress tracking
- [ ] **Next Steps**: Plan for beta release features

---

## 🔮 Next Release Planning

### 🎯 v0.1.0-beta.1 Targets
- **Enhanced Error Handling**: Comprehensive error recovery
- **Configuration System**: User-customizable settings  
- **Multi-Workspace Support**: Project-aware port management
- **Advanced CLI Features**: Bulk operations and scripting
- **Dashboard Improvements**: Advanced filtering and search

### 📅 Timeline
- **Alpha.2 Release**: Current
- **Beta.1 Planning**: Next 2 weeks
- **Beta.1 Release**: Target 4 weeks
- **Stable Release**: Target 8-12 weeks

---

**"No Conflicts. Just Connections."** - Ready to ship v0.1.0-alpha.2! 🎭

**Release Philosophy**: "Get it up. Get it bound. Stay registered."
