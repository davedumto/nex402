/**
 * x402 Payment Middleware - Next.js Configuration
 *
 * This middleware intercepts API requests and enforces payment requirements
 * using the x402 protocol (HTTP 402 Payment Required) on Aptos blockchain.
 *
 * KEY CUSTOMIZATION POINTS:
 * - Change pricing: Update the "price" field in route config (line 60)
 * - Add new routes: Add entries to the routes object (line 52+)
 * - Change recipient: Set PAYMENT_RECIPIENT_ADDRESS env variable
 * - Switch networks: Change "aptos:2" to "aptos:1" for mainnet (line 49, 61)
 * - Use different tokens: Modify the asset address in money parser (line 35)
 */

import { paymentProxy } from "@rvk_rishikesh/next";
import { x402ResourceServer, HTTPFacilitatorClient } from "@rvk_rishikesh/core/server";
import { ExactAptosScheme } from "@rvk_rishikesh/aptos/exact/server";
import type { Network } from "@rvk_rishikesh/core/types";
import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// STEP 1: Configure Payment Recipient
// ============================================================================
// Set this in your .env.local file as PAYMENT_RECIPIENT_ADDRESS
// This is the Aptos wallet address that will receive payments
const PAY_TO_ADDRESS = process.env.PAYMENT_RECIPIENT_ADDRESS || "0x7822f606a8f2858235b2833782a15f2690f8ed03";

// ============================================================================
// STEP 2: Initialize Facilitator Client
// ============================================================================
// The facilitator sponsors transaction fees and broadcasts payments to the blockchain
// Default: https://x402-navy.vercel.app/facilitator/
// You can run your own facilitator or use a custom one via FACILITATOR_URL env var
const facilitator = new HTTPFacilitatorClient({
    url: process.env.FACILITATOR_URL || "https://x402-navy.vercel.app/facilitator/"
});

// ============================================================================
// STEP 3: Configure Aptos Payment Scheme
// ============================================================================
const aptosScheme = new ExactAptosScheme();

// Money Parser: Converts decimal amounts (like 0.01 USDC) to blockchain-native atomic units
aptosScheme.registerMoneyParser(async (amount: number, network: string) => {
    // USDC on Aptos has 6 decimals (1 USDC = 1,000,000 atomic units)
    // To use a different token, change the decimals and asset address below
    const decimals = 6;
    const atomicAmount = BigInt(Math.round(amount * Math.pow(10, decimals))).toString();

    return {
        amount: atomicAmount,
        // USDC Fungible Asset ID on Aptos Testnet
        // For mainnet, use the mainnet USDC asset address
        // For other tokens (APT, USDT, etc.), replace with their asset address
        asset: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
        extra: { symbol: "USDC" }
    };
});

// ============================================================================
// STEP 4: Create Resource Server
// ============================================================================
// Register the payment scheme with the facilitator
// Networks: "aptos:1" = Mainnet, "aptos:2" = Testnet
const resourceServer = new x402ResourceServer([facilitator])
    .register("aptos:2" as Network, aptosScheme);

// ============================================================================
// STEP 5: Define Payment-Gated Routes
// ============================================================================
// Add your API routes here. Each route can have different pricing.
const paymentRoutes = {
    // Example route: /api/fortune
    "/api/fortune": {
        accepts: [
            {
                scheme: "exact" as const,              // Payment scheme type
                payTo: PAY_TO_ADDRESS as `0x${string}`, // Recipient address
                price: "0.01",                         // PRICE IN USDC (change this!)
                network: "aptos:2" as Network,         // aptos:2 = Testnet, aptos:1 = Mainnet
            },
        ],
        description: "Your Fortune Awaits",  // Human-readable description
        mimeType: "application/json",        // Response content type
    },

    // EXAMPLE: Add more routes by copying the pattern above
    // "/api/premium-data": {
    //     accepts: [{
    //         scheme: "exact" as const,
    //         payTo: PAY_TO_ADDRESS as `0x${string}`,
    //         price: "1.00",  // Higher price for premium content
    //         network: "aptos:2" as Network,
    //     }],
    //     description: "Premium Data Access",
    //     mimeType: "application/json",
    // },
};

// ============================================================================
// STEP 6: Create Payment Proxy
// ============================================================================
const proxy = paymentProxy(paymentRoutes, resourceServer, undefined, undefined, false);

// ============================================================================
// STEP 7: Middleware Handler
// ============================================================================
// This function intercepts requests and applies payment validation
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the request path matches any payment-gated route
    // Add more conditions here if you have multiple route patterns
    if (path.startsWith('/api/fortune')) {
        return await proxy(request);
    }

    // For non-protected routes, pass through without payment
    return NextResponse.next();
}

// ============================================================================
// STEP 8: Configure Route Matcher
// ============================================================================
// Define which routes this middleware should intercept
// Update this array when you add new payment-gated routes
export const config = {
    matcher: [
        "/api/fortune/:path*",
        // Add more matchers here for additional routes:
        // "/api/premium-data/:path*",
    ],
};
