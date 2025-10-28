x402frog8s — final Vercel-ready package (mint + confirm + mintFor)

Files:
 - api/mint.js     -> returns 402 x402 payload (amount=1 USDC)
 - api/confirm.js  -> verifies txHash and returns mintUrl
 - api/mintFor.js  -> calls smart contract mintFor(buyer, id, 1) using PRIVATE_KEY

Environment variables (set these in Vercel Settings -> Environment Variables):
 - PRIVATE_KEY (secret): private key of contract owner (used to call mintFor)
 - BASE_RPC: RPC endpoint for Base (default https://mainnet.base.org)
 - TREASURY: treasury address to receive USDC (default provided)
 - USDC_ADDRESS: USDC contract on Base (default provided)
 - COLLECTION_ADDRESS: deployed ERC-1155 contract address (must implement mintFor)
 - PUBLIC_URL: https://x402frog8s-oied.vercel.app

Flow:
 1) GET /api/mint?id=1  -> returns 402 payload
 2) User pays 1 USDC to TREASURY
 3) Call /api/confirm?tx=<txHash>&id=1 -> verifies and returns mintUrl
 4) Call /api/mintFor?id=1&buyer=0x... (GET or POST) -> executes mint and returns mintTx

Security notes:
 - PRIVATE_KEY must be stored as secret env variable in Vercel, never in repo.
 - Consider requiring confirmations before minting in production.
