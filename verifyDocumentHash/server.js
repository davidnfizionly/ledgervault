// server.js
import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { sendToBlockchain } from './sendHashToBlockchain.js';

dotenv.config();

const app = express();
const port = 5000;

// Middlewares
app.use(express.static('public'));

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// ===== 📤 REGISTER DOCUMENT =====
app.post('/register', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const hashHex = '0x' + createHash('sha256').update(fileBuffer).digest('hex');

    const txHash = await sendToBlockchain(filePath);

    fs.unlinkSync(filePath);

    const explorerURL = `${process.env.EXPLORER_BASE}/tx/${txHash}`;

    res.json({
      success: true,
      hash: hashHex,
      txHash,
      explorer: explorerURL,
    });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== 🔎 VERIFY DOCUMENT =====
app.post('/verify', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const hashHex = '0x' + createHash('sha256').update(fileBuffer).digest('hex');

    // Replace this with smart contract call in production
    const knownHashes = [
      "0x9da212c0540c3a8bffdaabca545360a682930c5ea553d5410ee66b6aaa96d7d8",
      "0x2878bac57b7dd6a27952cb2c855abc9adb8ba9b6bc47f34df571d45ca77ff024"
    ];

    const isValid = knownHashes.includes(hashHex);

    fs.unlinkSync(filePath);

    res.json({ valid: isValid, hash: hashHex });
  } catch (err) {
    console.error('❌ Verification failed:', err);
    res.status(500).json({ valid: false, error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`✅ LedgerVault backend is running at http://localhost:${port}`);
});
