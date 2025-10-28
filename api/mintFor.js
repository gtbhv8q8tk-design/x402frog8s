const dotenv = require('dotenv');
dotenv.config();
const { ethers } = require('ethers');

module.exports = async (req, res) => {
  try {
    // Accept both GET (for testing) and POST
    const id = req.query.id || (req.body && req.body.id) || '1';
    const buyer = req.query.buyer || (req.body && req.body.buyer);
    if (!buyer) return res.status(400).json({ error: "Missing buyer address (query buyer=0x... or JSON body)" });

    const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC || "https://mainnet.base.org");
    if (!process.env.PRIVATE_KEY) return res.status(500).json({ error: "Server PRIVATE_KEY not set" });
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const COLLECTION_ADDRESS = process.env.COLLECTION_ADDRESS;
    if (!COLLECTION_ADDRESS) return res.status(500).json({ error: "COLLECTION_ADDRESS not configured" });

    const collection = new ethers.Contract(COLLECTION_ADDRESS, ["function mintFor(address to, uint256 id, uint256 amount, bytes data) external"], signer);

    const tx = await collection.mintFor(buyer, id, 1, "0x");
    const receipt = await tx.wait();

    return res.status(200).json({ success: true, mintTx: receipt.transactionHash, txReceipt: receipt });
  } catch (err) {
    console.error("mintFor error", err);
    return res.status(500).json({ error: String(err) });
  }
};
