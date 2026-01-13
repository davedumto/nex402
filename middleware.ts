import { paymentMiddleware } from 'aptos-x402';

// Aptos x402 Middleware - Mirrors EVM x402 pattern
// Server returns 402 with payment requirements, facilitator handles verification

export default paymentMiddleware(
    process.env.PAYMENT_RECIPIENT_ADDRESS!,
    {
        '/api/fortune': {
            price: '1000000', // 0.01 APT in Octas (1 APT = 100,000,000 Octas)
            network: 'testnet', // Library prepends 'aptos-'
            config: {
                description: 'Your Fortune Awaits',
            },
        },
    },
    {
        url: process.env.FACILITATOR_URL || 'https://aptos-x402.vercel.app/api/facilitator',
    }
);

export const config = {
    matcher: ['/api/fortune/:path*'],
};
