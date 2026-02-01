# x402 Next.js Starter

> Production-ready template for building payment-gated APIs on Aptos using the x402 protocol (HTTP 402 Payment Required)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Aptos](https://img.shields.io/badge/Aptos-Testnet-00D4AA)](https://aptos.dev/)

## Quick Start

### Option 1: Use the CLI (Recommended)

```bash
npx buildx402 my-app
cd my-app
npm install
npx buildx402 wallet create
# Copy the env vars to .env.local
npm run dev
```

### Option 2: Clone This Repository

```bash
git clone https://github.com/davedumto/buildx402.git
cd buildx402
npm install
npm run dev
```

## What is This?

This is a **production-ready template** for building pay-per-request APIs using:
- **x402 Protocol** - HTTP 402 Payment Required standard
- **Aptos Blockchain** - Low-fee, high-speed payments in USDC
- **Next.js 16** - Modern full-stack React framework
- **TypeScript** - Type-safe development

Perfect for:
- Monetizing APIs without subscriptions
- Cross-border payments
- NFT minting APIs
- Premium data access
- Pay-per-view content

## Architecture

```
User Interface (Terminal Theme)
         |
[User clicks "EXECUTE_REQUEST"]
         |
Frontend: x402 Client
         |
Middleware: Payment Validation (HTTP 402)
         |
Aptos Blockchain (0.01 USDC payment)
         |
API Endpoint: Protected Data
         |
Response: JSON Data
```

## What's Included

- **Payment Middleware** - Pre-configured x402 proxy (`middleware.ts`)
- **Developer UI** - Terminal-themed interface
- **Wallet Integration** - Aptos SDK with private key management
- **Example API** - `/api/fortune` endpoint (0.01 USDC)
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Production Ready** - Vercel deployment config

## CLI Toolkit

The `buildx402` CLI is more than a scaffolder — it's a full developer toolkit for the x402 protocol.

```bash
npx buildx402 <app-name>                    # Scaffold a new x402 app
npx buildx402 wallet create                  # Generate an Aptos wallet
npx buildx402 inspect <url>                  # Inspect any x402 endpoint
npx buildx402 pay <url> --key 0xYOUR_KEY     # Pay and fetch any x402 endpoint
```

### Inspect an Endpoint

See the payment requirements of any x402-protected API without paying:

```bash
npx buildx402 inspect https://your-app.vercel.app/api/fortune
```

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
  Sponsored:     true
```

### Pay an Endpoint

Pay and fetch any x402 endpoint directly from the terminal:

```bash
npx buildx402 pay https://your-app.vercel.app/api/fortune --key 0xYOUR_PRIVATE_KEY
```

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

## Setup Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate a Wallet

```bash
npx buildx402 wallet create
```

This will output:
```env
PAYMENT_RECIPIENT_ADDRESS=0x1234...
NEXT_PUBLIC_APTOS_PRIVATE_KEY=0xabcd...
```

### 3. Configure Environment

Create `.env.local` and paste the generated values:

```env
PAYMENT_RECIPIENT_ADDRESS=0xyour_aptos_address_here
NEXT_PUBLIC_APTOS_PRIVATE_KEY=0xyour_private_key_here
```

### 4. Fund Your Wallet

Visit [Aptos Faucet](https://aptos.dev/en/network/faucet) and request:
- Testnet APT (for gas fees)
- Testnet USDC (for testing payments)

### 5. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Customization

### Change API Pricing

Edit `middleware.ts`:

```typescript
const paymentRoutes = {
  "/api/fortune": {
    accepts: [{
      price: "0.01",  // Change this to any USDC amount
      // ...
    }],
  },
};
```

### Add New Payment-Gated Routes

1. **Create the API endpoint** in `app/api/your-route/route.ts`
2. **Add to middleware.ts**:
   ```typescript
   "/api/your-route": {
     accepts: [{
       scheme: "exact",
       payTo: PAY_TO_ADDRESS,
       price: "1.00",
       network: "aptos:2",
     }],
   }
   ```
3. **Update matcher**:
   ```typescript
   export const config = {
     matcher: ["/api/fortune/:path*", "/api/your-route/:path*"],
   };
   ```

### Change UI Theme

Edit `app/page.tsx` - The template uses a terminal/developer theme with:
- Monospace fonts
- Green-on-black color scheme
- Scanline effects
- Command-line aesthetics

## Project Structure

```
buildx402/
├── app/
│   ├── api/
│   │   └── fortune/route.ts    # Protected API endpoint
│   ├── page.tsx                # Terminal UI with x402 integration
│   ├── layout.tsx              # Root layout
│   ├── providers.tsx           # React providers
│   └── globals.css             # Global styles
├── middleware.ts                # x402 payment middleware
├── x402-cli/                   # CLI developer toolkit
│   ├── bin/index.js            # CLI entry point
│   ├── src/
│   │   ├── commands.js         # Scaffold command
│   │   ├── wallet.js           # Wallet generation
│   │   ├── inspect.js          # Endpoint inspector
│   │   └── pay.js              # Payment client
│   └── package.json
├── .env.example                # Environment template
├── package.json
└── README.md
```

## Security Best Practices

**IMPORTANT**:
- Never commit `.env.local` to version control
- Use testnet ONLY for development
- For production, use hardware wallets or secure key management systems
- Rotate private keys regularly
- Monitor wallet balances

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Blockchain** | Aptos Testnet |
| **Payment Protocol** | x402 V2 |
| **Currency** | USDC (Aptos Fungible Asset) |
| **Styling** | Tailwind CSS 4 |
| **Type Safety** | TypeScript 5 |
| **CLI** | Commander.js, Chalk, Ora |
| **Deployment** | Vercel |

## Resources

- [x402 Protocol Documentation](https://github.com/rvk-utd/x402)
- [Aptos Developer Docs](https://aptos.dev)
- [Aptos Explorer](https://explorer.aptoslabs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Aptos Faucet](https://aptos.dev/en/network/faucet)

## Contributing

Contributions are welcome! See the [implementation_plan.md](implementation_plan.md) for planned features.

## License

MIT License - see [LICENSE](LICENSE) file for details

---

Built for the Aptos x x402 Hackathon
