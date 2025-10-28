export default async function handler(req, res) {
  const response = {
    x402Version: 1,
    accepts: [
      {
        scheme: "exact",
        network: "base",
        maxAmountRequired: "1.0",
        resource: "/api/mint?id=1",
        description: "Mint a x402frog8s collectible (ERC-1155) for 1 USDC on Base.",
        mimeType: "application/json",
        payTo: "0x1DEf6d9E7ba7256dF17d01Bf7D8FA62d82A27Fc4",
        maxTimeoutSeconds: 600,
        asset: "USDC",
        extra: {
          name: "x402frog8s mint",
          metadataURI: "https://ipfs.io/ipfs/bafybeiabfisrq64kdbutc4ysjrgfj3e56ggj3icqfnd5zuliuu3gmz4ti/",
          tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
          chainId: 8453
        }
      }
    ]
  };

  res.status(402).json(response);
}
