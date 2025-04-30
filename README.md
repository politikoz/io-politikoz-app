# Politikoz

A Next.js application for the Politikoz on Cardano project.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [Support](#support)

## Features
- 💳 Cardano wallet integration
- 🌐 Multi-language support
- 🔐 Discord authentication
- 📊 Real-time statistics

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/io-politikoz-app.git
cd io-politikoz-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Required environment variables:
```bash
NEXT_PUBLIC_BASE_URL=          # Application base URL
NEXT_PUBLIC_API_URL=           # Backend API URL
NEXT_PUBLIC_DISCORD_CLIENT_ID= # Discord OAuth client ID
NEXT_PUBLIC_ENCRYPTION_KEY=    # Encryption key for sensitive data
NEXT_PUBLIC_BECH32_POOL_ID=    # Cardano pool ID
NEXT_PUBLIC_BLOCKFROST_API_KEY=# Blockfrost API key
```

See `.env.example` for detailed descriptions of each variable.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Code of Conduct
- Development Process
- Pull Request Process
- Coding Standards

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Mesh SDK Documentation](https://meshjs.dev/)
- [Project Wiki](docs/README.md)

## Support

If you need help or have questions:
- Open an issue
- Join our Discord community
- Check our [FAQ](docs/FAQ.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
