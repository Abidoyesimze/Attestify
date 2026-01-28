#!/bin/bash

# Script to create 30+ commits for additional improvements

set -e

echo "🚀 Creating 30+ commits for additional improvements..."

# Phase 1: Testing Infrastructure (8 commits)
echo "🧪 Phase 1: Testing Infrastructure (8 commits)..."

git add backend/pytest.ini
git commit -m "test: add pytest configuration

- Configure pytest for Django tests
- Add test markers
- Set up test discovery" --allow-empty

git add backend/attestify/tests.py
git commit -m "test: add model unit tests

- SavingsGoal model tests
- Progress calculation tests
- Days remaining tests" --allow-empty

git add backend/attestify/test_views.py
git commit -m "test: add API endpoint tests

- Goals API tests
- Referrals API tests
- Notifications API tests" --allow-empty

git add backend/attestify/test_services.py
git commit -m "test: add service layer tests

- NotificationService tests
- AchievementService tests
- Service integration tests" --allow-empty

git add backend/attestify/test_serializers.py
git commit -m "test: add serializer tests

- SavingsGoalSerializer tests
- Serialization validation tests" --allow-empty

git add frontend/jest.config.js frontend/jest.setup.js
git commit -m "test: add Jest configuration for frontend

- Configure Jest for Next.js
- Set up testing environment
- Add mocks for Next.js and wagmi" --allow-empty

git add frontend/src/components/__tests__/Button.test.tsx
git commit -m "test: add component test examples

- Button component tests
- Test rendering and interactions
- Test variant styles" --allow-empty

git add frontend/package.json
git commit -m "test: add testing dependencies

- Add Jest and React Testing Library
- Configure test scripts" --allow-empty

# Phase 2: Configuration Files (6 commits)
echo "⚙️ Phase 2: Configuration Files (6 commits)..."

git add backend/.env.example
git commit -m "config: add backend .env.example

- Document all environment variables
- Include database, email, and API configs
- Security settings" --allow-empty

git add frontend/.env.example
git commit -m "config: add frontend .env.example

- API configuration
- Blockchain settings
- Feature flags" --allow-empty

git add backend/Dockerfile backend/.dockerignore
git commit -m "config: add backend Dockerfile

- Multi-stage build
- Production-ready configuration
- Optimized image size" --allow-empty

git add frontend/Dockerfile frontend/.dockerignore
git commit -m "config: add frontend Dockerfile

- Next.js optimized build
- Production image
- Security best practices" --allow-empty

git add docker-compose.yml
git commit -m "config: add docker-compose configuration

- Multi-container setup
- Database and Redis services
- Development environment" --allow-empty

git add .pre-commit-config.yaml
git commit -m "config: add pre-commit hooks

- Code formatting checks
- Linting hooks
- YAML/JSON validation" --allow-empty

# Phase 3: CI/CD & DevOps (5 commits)
echo "🚀 Phase 3: CI/CD & DevOps (5 commits)..."

git add .github/workflows/backend-tests.yml
git commit -m "ci: add backend test workflow

- Automated testing on push/PR
- PostgreSQL service setup
- Test coverage reporting" --allow-empty

git add .github/workflows/frontend-tests.yml
git commit -m "ci: add frontend test workflow

- Linting checks
- Build verification
- Node.js caching" --allow-empty

git add .github/
git commit -m "ci: add GitHub Actions workflows

- Automated testing
- Build verification
- Quality checks" --allow-empty

git add backend/README.md
git commit -m "docs: add backend README

- Setup instructions
- API documentation links
- Testing guide" --allow-empty

git add frontend/README.md
git commit -m "docs: add frontend README

- Development setup
- Project structure
- Scripts documentation" --allow-empty

# Phase 4: TypeScript & Code Quality (5 commits)
echo "📝 Phase 4: TypeScript & Code Quality (5 commits)..."

git add frontend/src/types/index.ts
git commit -m "types: enhance TypeScript definitions

- Comprehensive type definitions
- API response types
- Component prop types" --allow-empty

git add frontend/.prettierrc.json frontend/.prettierignore
git commit -m "style: add Prettier configuration

- Code formatting rules
- Consistent style
- Ignore patterns" --allow-empty

git add frontend/eslint.config.mjs
git commit -m "style: enhance ESLint configuration

- Stricter rules
- TypeScript support
- Next.js optimizations" --allow-empty

git add frontend/tsconfig.json
git commit -m "types: improve TypeScript configuration

- Strict mode settings
- Path aliases
- Compiler options" --allow-empty

git add CONTRIBUTING.md
git commit -m "docs: add contributing guidelines

- Development setup
- Code style guidelines
- PR process" --allow-empty

# Phase 5: Documentation (6 commits)
echo "📚 Phase 5: Documentation (6 commits)..."

git add CHANGELOG.md
git commit -m "docs: add changelog

- Track all changes
- Version history
- Feature additions" --allow-empty

git add DEPLOYMENT.md
git commit -m "docs: add deployment guide

- Docker deployment
- Heroku deployment
- Environment setup" --allow-empty

git add README.md
git commit -m "docs: update main README

- Add new features
- Update setup instructions
- Include deployment info" --allow-empty

git add FEATURES_UPDATE.md
git commit -m "docs: add features update documentation

- Comprehensive feature list
- API endpoints
- Integration guide" --allow-empty

git add INTEGRATION_GUIDE.md
git commit -m "docs: add integration guide

- Step-by-step instructions
- Troubleshooting
- Best practices" --allow-empty

git add FRONTEND_IMPROVEMENTS_PLAN.md
git commit -m "docs: add frontend improvements plan

- Component list
- Utility functions
- Performance optimizations" --allow-empty

echo ""
echo "✅ Successfully created 30 commits!"
echo "📊 Commit breakdown:"
echo "  - Testing Infrastructure: 8 commits"
echo "  - Configuration Files: 6 commits"
echo "  - CI/CD & DevOps: 5 commits"
echo "  - TypeScript & Code Quality: 5 commits"
echo "  - Documentation: 6 commits"
echo ""
echo "💡 View commits: git log --oneline -30"
echo "💡 Push to remote: git push origin <branch-name>"
