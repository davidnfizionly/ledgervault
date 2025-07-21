const { ethers } = require("ethers");
const { createHash } = require("crypto");
require("dotenv").config();

/**
 * Hash le contenu du fichier (buffer) et l’enregistre sur la blockchain via le smart contract.
 *
 * @param {Buffer} buffer - Contenu du fichier
 * @returns {Promise<{ hash: string, status: number }>}
 */
async function sendToBlockchain(buffer) {
  try {
    const fileHash = "0x" + createHash("sha256").update(buffer).digest("hex");
    console.log("✅ File hash:", fileHash);

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ["function registerDocument(bytes32 hash) public returns (bool)"],
      wallet
    );

    const tx = await contract.registerDocument(fileHash);
    console.log("📤 Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt.transactionHash);

    return {
      hash: receipt.transactionHash,
      status: receipt.status,
    };
  } catch (err) {
    console.error("❌ Blockchain error:", err);
    throw err;
  }
}

module.exports = { sendToBlockchain };
