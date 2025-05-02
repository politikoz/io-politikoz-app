# Contributing to Politikoz

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Development Environment](#development-environment)
  - [Project Setup](#project-setup)
- [Development Process](#development-process)
  - [Branch Strategy](#branch-strategy)
  - [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Environment Setup](#environment-setup)

## Code of Conduct
Our project is committed to fostering an open and welcoming environment. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Development Environment
Required tools:
- Node.js (v18 or higher)
- npm or yarn
- Git

### Project Setup
1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/io-politikoz-app.git
```
3. Install dependencies:
```bash
cd io-politikoz-app
npm install
```
4. Copy environment variables:
```bash
cp .env.example .env.local
```
5. Configure your environment variables in `.env.local`

## Development Process

### Branch Strategy
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Hotfixes: `hotfix/description`

### Commit Guidelines
Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

## Pull Request Process
1. Update documentation if needed
2. Add/update tests as needed
3. Ensure all tests pass locally
4. Create PR with clear description of changes using our [pull request template](.github/pull_request_template.md)
   - Fill in all relevant sections of the template
   - Mark appropriate type of change
   - Include testing details
   - Complete the checklist
5. Link related issues
6. Wait for review

## Environment Setup
Required environment variables:
```bash
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_API_URL=
DISCORD_CLIENT_ID=
ENCRYPTION_KEY=
BECH32_POOL_ID=
BLOCKFROST_API_KEY=
```

For detailed explanation of each variable, see `.env.example`.