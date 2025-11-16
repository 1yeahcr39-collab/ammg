# 🔄 CI/CD Pipeline Documentation

## Overview

This project uses **GitHub Actions** for continuous integration and continuous deployment. The pipeline automatically runs tests, performs code analysis, and builds the application whenever code is pushed to the repository.

---

## 📊 Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Code Push to GitHub                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────┐      ┌──────────┐      ┌──────────────┐
    │ Backend │      │ Frontend │      │ Code Quality │
    │  Tests  │      │  Build   │      │   Analysis   │
    └─────────┘      └──────────┘      └──────────────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Security   │
                    │   Scanning   │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Docker    │
                    │   Build/Push │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Notification│
                    └──────────────┘
```

---

## 🚀 Pipeline Stages

### 1️⃣ **Backend Check** (Python/Flask)
Runs on every push to `main` or `develop` branches.

**Steps:**
- ✅ Checkout code
- ✅ Set up Python 3.11
- ✅ Install backend dependencies
- ✅ Lint with Flake8
- ✅ Check syntax with py_compile
- ✅ Run unit tests (if available)

**Time:** ~2-3 minutes

**What it checks:**
- Python syntax errors
- Code style violations
- Undefined names
- Circular complexity

### 2️⃣ **Frontend Check** (React/Node)
Runs on every push to `main` or `develop` branches.

**Steps:**
- ✅ Checkout code
- ✅ Set up Node.js 18
- ✅ Install frontend dependencies (npm ci)
- ✅ ESLint checks
- ✅ Build application
- ✅ Run tests with coverage

**Time:** ~3-4 minutes

**What it checks:**
- JavaScript syntax
- React best practices
- Build errors
- Test coverage

### 3️⃣ **Code Quality Analysis**
Optional SonarQube integration for advanced analysis.

**Features:**
- Code smell detection
- Bug prediction
- Security hotspots
- Coverage metrics

**Time:** ~2-3 minutes

### 4️⃣ **Security Checks**
Scans for vulnerabilities and secrets.

**Tools:**
- **Trivy** - Vulnerability scanner
- **TruffleHog** - Secret detection

**Time:** ~2-3 minutes

### 5️⃣ **Docker Build & Push**
Builds Docker image for deployment (only on main branch).

**Steps:**
- Build multi-stage Docker image
- Push to registry (optional)
- Cache layers for faster builds

**Time:** ~3-5 minutes

**Conditions:**
- Only runs if backend & frontend checks pass
- Only on `main` branch push events

### 6️⃣ **Notifications**
Sends status updates to team.

**Supported:**
- Slack notifications
- GitHub status checks
- Email (optional)

---

## 📋 Workflow File Breakdown

### File Location
```
.github/workflows/ci.yml
```

### Trigger Events
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

**Triggers when:**
- Push to `main` or `develop` branch
- Pull request to `main` or `develop` branch
- Manual workflow dispatch (optional)

### Jobs Matrix

| Job | Condition | Timeout |
|-----|-----------|---------|
| backend-check | Always | 10 min |
| frontend-check | Always | 10 min |
| code-analysis | Always | 10 min |
| security-check | Always | 10 min |
| docker-build | After backend & frontend pass, main branch only | 15 min |
| notify | Always (final status) | 5 min |

---

## 🔧 Setup & Configuration

### 1. GitHub Secrets (Optional)

Configure these secrets in your GitHub repository settings for advanced features:

```
Settings → Secrets and variables → Actions
```

#### Docker Registry Credentials
```
DOCKER_USERNAME = your_docker_username
DOCKER_PASSWORD = your_docker_token
```

#### SonarCloud Token
```
SONAR_TOKEN = your_sonarcloud_token
```

#### Slack Webhook
```
SLACK_WEBHOOK = https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### 2. Environment Variables

```yaml
env:
  PYTHON_VERSION: '3.11'
  NODE_VERSION: '18'
```

Change as needed for your environment.

### 3. Cache Configuration

**Python Dependencies:**
```yaml
cache: 'pip'
```

**Node Dependencies:**
```yaml
cache: 'npm'
cache-dependency-path: frontend/package-lock.json
```

---

## ✅ Running Locally

### Simulate Backend Checks
```bash
# Install dependencies
pip install -r backend/requirements.txt
pip install flake8 pytest pytest-cov

# Run lint
flake8 backend --count --exit-zero

# Compile check
python -m py_compile backend/app.py

# Run tests
pytest backend/tests -v --cov=backend
```

### Simulate Frontend Checks
```bash
# Install dependencies
cd frontend
npm ci

# Run lint (if available)
npm run lint

# Build
npm run build

# Run tests
npm test -- --coverage --watchAll=false
```

---

## 📈 Monitoring Pipeline

### GitHub Actions Dashboard
1. Go to your repo
2. Click **Actions** tab
3. View workflow runs
4. Click run name for details

### Workflow Status Badges

Add to your README:

```markdown
![CI/CD Pipeline](https://github.com/1yeahcr39-collab/ammg/workflows/CI%2FCD%20Pipeline/badge.svg)
```

### View Logs
```bash
# Clone with workflow logs
git clone https://github.com/1yeahcr39-collab/ammg.git
cd ammg
gh run list
gh run view <run-id> --log
```

---

## 🐛 Troubleshooting

### Pipeline Fails - Backend Check

**Error:** `Module not found`
```bash
# Solution: Update requirements.txt
pip freeze > backend/requirements.txt
git add backend/requirements.txt
git commit -m "chore: Update dependencies"
git push
```

**Error:** `Flake8 issues`
```bash
# Fix formatting
pip install autopep8
autopep8 --in-place --aggressive backend/app.py
```

### Pipeline Fails - Frontend Check

**Error:** `npm install fails`
```bash
# Clear cache and reinstall
rm -rf frontend/node_modules package-lock.json
npm install
git add frontend/package-lock.json
git commit -m "chore: Update npm dependencies"
git push
```

**Error:** `Build fails`
```bash
# Check build locally
cd frontend
npm run build
# Fix issues shown, then push
```

### Docker Build Fails

**Solution:** 
- Ensure `Dockerfile` exists in repo root
- Check `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
- Verify Docker registry credentials

---

## 📝 Best Practices

### 1. Keep Tests Updated
- Add tests with new features
- Update tests when refactoring
- Maintain >80% coverage

### 2. Lint Regularly
```bash
# Before pushing
npm run lint    # Frontend
flake8 backend  # Backend
```

### 3. Use Meaningful Commit Messages
```
feat: Add user authentication
fix: Fix transcription bug
docs: Update README
ci: Improve pipeline performance
```

### 4. Create Feature Branches
```bash
git checkout -b feature/your-feature
# Make changes
git push origin feature/your-feature
# Create PR to develop
```

### 5. Monitor Pipeline Status
- Check Actions tab regularly
- Fix failing builds immediately
- Don't merge with failing CI

---

## 🚀 Deployment Integration

### GitHub Pages (for frontend documentation)
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./frontend/build
```

### AWS Deployment
```yaml
- name: Deploy to AWS
  uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1
```

### Heroku Deployment
```yaml
- name: Deploy to Heroku
  uses: akhileshns/heroku-deploy@v3.12.12
  with:
    heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
    heroku_app_name: "your-app-name"
```

---

## 📊 Pipeline Statistics

### Current Configuration
- **Total Jobs:** 6
- **Average Runtime:** 12-15 minutes
- **Cost (GitHub Actions):** Free for public repos
- **Storage:** 500 MB (artifact retention)

### Optimization Tips
1. Use `continue-on-error: true` to not block on optional checks
2. Cache dependencies to speed up builds
3. Run tests in parallel where possible
4. Use `needs` to create dependencies between jobs

---

## 🔗 Useful Links

- **GitHub Actions Docs:** https://docs.github.com/actions
- **Workflow Syntax:** https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions
- **Python Actions:** https://github.com/actions/setup-python
- **Node Actions:** https://github.com/actions/setup-node
- **Docker Actions:** https://github.com/docker/build-push-action

---

## 📞 Support

For issues with CI/CD pipeline:
1. Check workflow logs in Actions tab
2. Run tests locally to verify
3. Update dependencies if needed
4. Check pipeline documentation above

---

## Example Workflow: Making Changes

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
echo "new code" >> backend/app.py

# 3. Test locally
pytest backend/tests -v

# 4. Commit and push
git add .
git commit -m "feat: Add my feature"
git push origin feature/my-feature

# 5. Create Pull Request on GitHub
# Pipeline runs automatically!

# 6. Wait for all checks to pass
# Then merge to main/develop

# 7. Merge triggers deployment workflow
```

---

**Last Updated:** November 16, 2025  
**Status:** ✅ Active and Maintained