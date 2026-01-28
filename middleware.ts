import { paymentProxy } from "@rvk_rishikesh/next";
import { x402ResourceServer, HTTPFacilitatorClient } from "@rvk_rishikesh/core/server";
import { ExactAptosScheme } from "@rvk_rishikesh/aptos/exact/server";
import type { Network } from "@rvk_rishikesh/core/types";
import { NextRequest, NextResponse } from "next/server";

const PAY_TO_ADDRESS = process.env.PAYMENT_RECIPIENT_ADDRESS || "0x7822f606a8f2858235b2833782a15f2690f8ed03";

// 1. Initialize the facilitator client
const facilitator = new HTTPFacilitatorClient({
    url: process.env.FACILITATOR_URL || "https://x402-navy.vercel.app/facilitator/"
});

// 2. Define Aptos Scheme and register custom parsers if needed
const aptosScheme = new ExactAptosScheme();
aptosScheme.registerMoneyParser(async (amount: number, network: string) => {
    // USDC = 6 decimals on Aptos
    const decimals = 6;
    const atomicAmount = BigInt(Math.round(amount * Math.pow(10, decimals))).toString();

    return {
        amount: atomicAmount,
        asset: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832", // USDC Fungible Asset
        extra: { symbol: "USDC" }
    };
});

// 3. Define Resource Server
const fortuneServer = new x402ResourceServer([facilitator])
    .register("aptos:2" as Network, aptosScheme); // aptos:2 is testnet

// 4. Define Routes
const fortuneRoutes = {
    "/api/fortune": {
        accepts: [
            {
                scheme: "exact" as const,
                payTo: PAY_TO_ADDRESS as `0x${string}`,
                price: "0.01", // 0.01 USDC
                network: "aptos:2" as Network,
            },
        ],
        description: "Your Fortune Awaits",
        mimeType: "application/json",
    },
};

// 5. Create Proxy
const fortuneProxy = paymentProxy(fortuneRoutes, fortuneServer, undefined, undefined, false);

// 6. Middleware Entry Point
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (path.startsWith('/api/fortune')) {
        return await fortuneProxy(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/fortune/:path*"],
};
