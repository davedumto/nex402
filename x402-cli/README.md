# buildx402

> The Swiss Army knife for x402 on Aptos — scaffold, inspect, and pay from the terminal.

[![npm version](https://www.npmjs.com/package/buildx402)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
# Scaffold a new x402 app
npx buildx402 my-app

# Generate a wallet
npx buildx402 wallet create

# Inspect any x402 endpoint
npx buildx402 inspect https://your-app.vercel.app/api/fortune

# Pay and fetch any x402 endpoint
npx buildx402 pay https://your-app.vercel.app/api/fortune --key 0xYOUR_KEY
```

## What is buildx402?

**buildx402** is a developer toolkit for the x402 payment protocol on Aptos. It handles the full lifecycle — from scaffolding a new project to inspecting and paying x402-protected endpoints directly from the command line.

### Commands

| Command | Description |
|---------|-------------|
| `buildx402 <app-name>` | Scaffold a new x402 Next.js app |
| `buildx402 wallet create` | Generate a new Aptos Ed25519 wallet |
| `buildx402 inspect <url>` | Inspect payment requirements of any x402 endpoint |
| `buildx402 pay <url>` | Pay and fetch any x402-protected endpoint |

## Commands in Detail

### Scaffold a New App

```bash
npx buildx402 my-payment-api
```

Creates a new x402 application with:
- Template download from GitHub
- Project setup and cleanup
- Interactive dependency installation
- Next steps instructions

### Generate a Wallet

```bash
npx buildx402 wallet create
```

Generates a new Aptos Ed25519 keypair and displays:
```env
PAYMENT_RECIPIENT_ADDRESS=0x1234567890abcdef...
NEXT_PUBLIC_APTOS_PRIVATE_KEY=0xabcdef1234567890...
```

Copy these to `.env.local` in your project.

### Inspect an Endpoint

```bash
npx buildx402 inspect https://your-app.vercel.app/api/fortune
```

Probes any URL and parses the 402 response to show payment requirements:

```
  x402 Endpoint Detected!

  URL:           https://your-app.vercel.app/api/fortune
  x402 Version:  2
  Description:   Your Fortune Awaits
  Content Type:  application/json

  Payment Options (1):

  Scheme:        exact
  Price:         0.01 USDC
  Raw Amount:    10000 atomic units
  Network:       Aptos Testnet
  Pay To:        0xaaea...e6f4
  Asset:         0x6909...2832
  Timeout:       300s
  Sponsored:     true
```

Works with any x402 implementation — parses payment data from headers (base64, JSON) and response body. If the endpoint isn't x402-protected, it tells you that too.

### Pay an Endpoint

```bash
npx buildx402 pay https://your-app.vercel.app/api/fortune --key 0xYOUR_PRIVATE_KEY
```

Handles the full x402 payment flow from the terminal:
1. Loads your wallet from `--key`, env variable, or `.env.local`
2. Hits the endpoint and detects the 402 response
3. Builds and signs the Aptos transaction
4. Sends payment through the facilitator
5. Retries the request with payment proof
6. Displays the response and transaction receipt

```
  Wallet loaded: 0xaaea4890...49e6f4
  x402 client ready

  Status: 200 OK

  Payment Receipt:
  Transaction:   0x4bd6...e9a6
  Explorer:      https://explorer.aptoslabs.com/txn/0x4bd6...e9a6?network=testnet

  Response:
  {
    "fortune": "Your keys, your fortune."
  }
```

**Key resolution order:**
1. `--key` flag: `buildx402 pay <url> --key 0xYOUR_KEY`
2. Environment variable: `NEXT_PUBLIC_APTOS_PRIVATE_KEY`
3. `.env.local` file in current directory

**Options:**
- `-k, --key <private-key>` — Aptos private key (hex)
- `-m, --method <method>` — HTTP method: GET, POST, PUT (default: GET)
- `-d, --data <body>` — Request body for POST/PUT requests

## Step-by-Step Guide

### 1. Create Your App
```bash
npx buildx402 my-app
```
Press `Y` when asked to install dependencies.

### 2. Generate Wallet
```bash
npx buildx402 wallet create
```

### 3. Configure Environment
Create `.env.local` in your project root:
```env
PAYMENT_RECIPIENT_ADDRESS=0x...
NEXT_PUBLIC_APTOS_PRIVATE_KEY=0x...
```

### 4. Fund Your Wallet (Testnet)
- **APT** (gas fees): [Aptos Faucet](https://aptos.dev/en/network/faucet)
- **USDC** (payments): [Circle Faucet](https://faucet.circle.com/)

### 5. Start Development
```bash
cd my-app
npm run dev
```

### 6. Test with the CLI
```bash
# In another terminal:
npx buildx402 inspect http://localhost:3000/api/fortune
npx buildx402 pay http://localhost:3000/api/fortune --key 0xYOUR_KEY
```

## Customization

### Change API Pricing

Edit `middleware.ts`:
```typescript
const paymentRoutes = {
  "/api/fortune": {
    accepts: [{
      price: "0.05",  // Change from 0.01 to 0.05 USDC
      // ...
    }],
  },
};
```

### Add New Payment-Gated Routes

1. Create the endpoint in `app/api/my-route/route.ts`
2. Add to `middleware.ts` payment routes
3. Update the matcher config

## Security Best Practices

- Never commit `.env.local` to version control
- Use **testnet ONLY** for development
- For production, use hardware wallets or secure key management
- Never share private keys
- Monitor wallet balances

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **CLI** | Commander.js, Chalk, Ora |
| **Scaffolding** | Degit |
| **Blockchain** | Aptos SDK (Ed25519) |
| **Payment Client** | x402 V2 (`@rvk_rishikesh/fetch`, `@rvk_rishikesh/aptos`) |
| **Template** | Next.js 16, TypeScript 5, Tailwind CSS 4 |

## Resources

- [x402 Protocol Docs](https://github.com/rvk-utd/x402)
- [Aptos Developer Docs](https://aptos.dev)
- [Template Repository](https://github.com/davedumto/buildx402)
- [Aptos Faucet](https://aptos.dev/en/network/faucet)
- [Next.js Documentation](https://nextjs.org/docs)

## Contributing

Contributions welcome! Check out the [template repo](https://github.com/davedumto/buildx402) for issues and planned features.

## License

MIT

---

Built for the Aptos x x402 Hackathon
