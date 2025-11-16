# 🐳 Docker & CI/CD Quick Guide

## What is CI/CD?

**CI (Continuous Integration):** Automatically tests code when you push it to GitHub
**CD (Continuous Deployment):** Automatically deploys to production when tests pass

---

## 📊 Your Pipeline Flow

```
1. Push Code → 2. Automated Tests → 3. Code Quality Check → 4. Build Docker Image → 5. Deploy
```

---

## 🚀 Running with Docker Locally

### Option 1: Using Docker Compose (Easiest)

**Prerequisites:**
- Docker Desktop installed ([https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop))

**Start all services:**
```bash
docker-compose up
```

**What starts:**
- MongoDB (port 27017)
- Backend Flask API (port 5000)
- Frontend React (port 3000)
- MongoDB UI (port 8081)

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB UI: http://localhost:8081 (admin/password123)

**Stop services:**
```bash
docker-compose down
```

**Remove all data:**
```bash
docker-compose down -v
```

---

### Option 2: Manual Docker Commands

**Build backend image:**
```bash
docker build -t minuteminds-backend:latest .
```

**Run backend:**
```bash
docker run -p 5000:5000 \
  -e MONGO_URL=mongodb://localhost:27017 \
  -e SECRET_KEY=your-secret-key \
  minuteminds-backend:latest
```

**Build frontend image:**
```bash
docker build -f frontend/Dockerfile.dev -t minuteminds-frontend:latest ./frontend
```

**Run frontend:**
```bash
docker run -p 3000:3000 \
  -e REACT_APP_API_URL=http://localhost:5000 \
  minuteminds-frontend:latest
```

---

## 🔄 GitHub Actions Pipeline

### When Does It Run?

✅ When you push to `main` branch
✅ When you push to `develop` branch
✅ When you create a pull request
✅ On manual trigger (optional)

### What Does It Do?

**Backend Checks (~ 2-3 minutes):**
- Install Python dependencies
- Check for syntax errors
- Run linting (Flake8)
- Run unit tests

**Frontend Checks (~ 3-4 minutes):**
- Install npm packages
- Check for linting issues
- Build the application
- Run tests

**Security Checks (~ 2-3 minutes):**
- Scan for vulnerabilities
- Check for exposed secrets
- Analyze code quality

**Docker Build (~ 3-5 minutes):**
- Build Docker image
- Test container
- Push to registry (optional)

### View Pipeline Status

1. Go to GitHub: https://github.com/1yeahcr39-collab/ammg
2. Click **Actions** tab
3. See all workflow runs
4. Click specific run to see details

---

## 📋 Common Docker Commands

**List running containers:**
```bash
docker ps
```

**List all containers:**
```bash
docker ps -a
```

**View container logs:**
```bash
docker logs ammg-backend
docker logs ammg-frontend
docker logs ammg-mongodb
```

**Stop specific container:**
```bash
docker stop ammg-backend
docker stop ammg-frontend
docker stop ammg-mongodb
```

**Remove container:**
```bash
docker rm ammg-backend
```

**Execute command in container:**
```bash
docker exec -it ammg-backend python -m spacy download en_core_web_sm
```

**View container stats:**
```bash
docker stats
```

---

## 🔧 Troubleshooting Docker

### Port Already in Use

**Error:** `Bind for 0.0.0.0:5000 failed`

**Solution:**
```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
# 5000:5000 → 5001:5000
```

### Container Won't Start

**Error:** `Failed to start container`

**Solution:**
```bash
# Check logs
docker logs ammg-backend

# Remove and rebuild
docker-compose down
docker-compose up --build
```

### MongoDB Connection Failed

**Error:** `Connection refused`

**Solution:**
```bash
# Ensure MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker-compose restart mongodb

# Check MongoDB logs
docker logs ammg-mongodb
```

### Permission Denied

**Error:** `permission denied while trying to connect to Docker daemon`

**Solution (Linux):**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📦 Environment Variables

### Backend (.env)
```env
FLASK_APP=backend/app.py
FLASK_ENV=production
MONGO_URL=mongodb://admin:password123@mongodb:27017
SECRET_KEY=your-secret-key-change-in-production
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
NODE_ENV=production
```

### Docker Compose
```yaml
environment:
  MONGO_URL: mongodb://admin:password123@mongodb:27017
  SECRET_KEY: your-secret-key
```

---

## 🚀 Deploying with Docker

### Deploy to AWS EC2

**Step 1: Connect to EC2**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

**Step 2: Install Docker**
```bash
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
```

**Step 3: Clone and Run**
```bash
git clone https://github.com/1yeahcr39-collab/ammg.git
cd ammg
docker-compose up -d
```

### Deploy to Heroku

**Step 1: Login to Heroku**
```bash
heroku login
heroku container:login
```

**Step 2: Create app**
```bash
heroku create minuteminds-app
```

**Step 3: Push Docker image**
```bash
heroku container:push web
heroku container:release web
```

### Deploy to Docker Hub

**Step 1: Create Docker Hub account**
- Visit https://hub.docker.com

**Step 2: Create repository**
- New repository: `minuteminds-app`

**Step 3: Build and push**
```bash
docker build -t yourusername/minuteminds-app:latest .
docker login
docker push yourusername/minuteminds-app:latest
```

---

## 📊 Monitoring CI/CD Pipeline

### GitHub Actions Dashboard
- Shows all workflow runs
- Success/failure status
- Duration and timing
- Log output for each step

### View Workflow Status Badge
```markdown
![CI/CD](https://github.com/1yeahcr39-collab/ammg/workflows/CI%2FCD%20Pipeline/badge.svg)
```

### Set Up Slack Notifications

**Step 1: Create Slack webhook**
- Go to https://api.slack.com/apps
- Create app → Incoming Webhooks
- Copy webhook URL

**Step 2: Add to GitHub Secrets**
- Settings → Secrets → New secret
- Name: `SLACK_WEBHOOK`
- Value: Your webhook URL

**Step 3: Workflow uses it automatically**

---

## ✅ Best Practices

### Before Pushing Code

**1. Test locally:**
```bash
pytest backend/tests -v
npm test --watch=false
```

**2. Lint your code:**
```bash
flake8 backend
npm run lint
```

**3. Build locally:**
```bash
npm run build
```

### Git Workflow

**1. Create feature branch:**
```bash
git checkout -b feature/your-feature
```

**2. Make changes and test:**
```bash
# Make changes
npm run lint
pytest backend/tests -v
```

**3. Commit and push:**
```bash
git add .
git commit -m "feat: Your feature"
git push origin feature/your-feature
```

**4. Create Pull Request:**
- Go to GitHub
- Create PR to main/develop
- Wait for pipeline to pass
- Request review

**5. After approval, merge:**
```bash
# Merge on GitHub
```

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| CI-CD-PIPELINE.md | Detailed pipeline documentation |
| .github/workflows/ci.yml | GitHub Actions workflow |
| Dockerfile | Production container |
| docker-compose.yml | Local development setup |
| frontend/Dockerfile.dev | Frontend development |
| .dockerignore | Docker build optimization |

---

## 🔗 Useful Links

- **Docker Docs:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **GitHub Actions:** https://docs.github.com/actions
- **Docker Hub:** https://hub.docker.com/

---

## 📞 Quick Support

**Pipeline failing?**
1. Check GitHub Actions tab for logs
2. Run tests locally
3. Fix issues and push again

**Docker issue?**
1. Check logs: `docker logs ammg-service-name`
2. Stop all: `docker-compose down`
3. Rebuild: `docker-compose up --build`

**Need help?**
- Check CI-CD-PIPELINE.md for detailed docs
- Review GitHub Actions logs
- Ask team lead @vishnupriyal-24

---

**Last Updated:** November 16, 2025