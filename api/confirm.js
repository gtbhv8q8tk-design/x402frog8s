const dotenv = require('dotenv');
dotenv.config();
const { ethers } = require('ethers');

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)"
];

module.exports = async (req, res) => {
  try {
    const txHash = req.query.tx;
    if (!txHash) return res.status(400).json({ error: "Missing tx parameter" });

    const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC || "https://mainnet.base.org");
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || !receipt.logs) return res.status(400).json({ error: "Transaction not found or pending" });

    const USDC_ADDRESS = (process.env.USDC_ADDRESS || "").toLowerCase();
    const TREASURY = (process.env.TREASURY || "").toLowerCase();
    const iface = new ethers.utils.Interface(ERC20_ABI);
    const PRICE_USDC = ethers.BigNumber.from(1).mul(ethers.BigNumber.from(10).pow(6)); // 1 USDC

    let found = false;
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() === USDC_ADDRESS) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed && parsed.name === 'Transfer') {
            const to = parsed.args[1];
            const value = parsed.args[2];
            if (to && to.toLowerCase() === TREASURY && value.gte(PRICE_USDC)) {
              found = true;
              break;
            }
          }
        } catch (e) {
          // ignore
        }
      }
    }

    if (!found) return res.status(402).json({ error: "Payment not detected or insufficient" });

    const publicUrl = process.env.PUBLIC_URL || "https://x402frog8s-oied.vercel.app";
    const id = req.query.id || "1";
    const mintUrl = `${publicUrl}/api/mintFor?id=${id}`;

    return res.status(200).json({
      success: true,
      verified: true,
      txHash,
      mintUrl,
      message: "USDC payment verified. Use mintUrl to perform mint."
    });

  } catch (err) {
    console.error("confirm error", err);
    res.status(500).json({ error: String(err) });
  }
};
