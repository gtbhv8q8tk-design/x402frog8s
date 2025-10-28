const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const id = req.query.id ? Number(req.query.id) : 1;

    const payload = {
      x402Version: 1,
      amount: 1,
      currency: "USDC",
      tokenAddress: process.env.USDC_ADDRESS,
      receiver: process.env.TREASURY,
      chainId: 8453,
      resource: `/api/mint?id=${id}`,
      name: "x402frog8s mint",
      description: "Mint a x402frog8s collectible (ERC-1155) for 1 USDC on Base.",
      metadataURI: "https://ipfs.io/ipfs/bafybeiabfisrq64kdbutc4ysjrgfjr3e56ggj3icqfnd5zuliuu3gmz4ti/"
    };

    res.status(402).json(payload);
  } catch (err) {
    console.error('mint error', err);
    res.status(500).json({ error: String(err) });
  }
};
