# LedgerVault – Immutable Document Archiving via Blockchain

LedgerVault is a secure document storage and verification system that leverages AWS and Ethereum blockchain technology to ensure document integrity. Once a file is uploaded, its SHA-256 hash is stored on the Ethereum testnet via Infura, making it tamper-proof and verifiable by anyone.

---

## 📌 Project Overview

LedgerVault offers a trustless way to store and verify documents using a hybrid architecture:

- Files are uploaded and stored securely in Amazon S3.
- Their hash values are computed and immutably recorded on Ethereum blockchain.
- The user can later verify if a document has been altered by comparing its hash against the one stored on-chain.

---

## ⚙️ Technologies Used

| Layer          | Service/Tool              |
|----------------|---------------------------|
| Frontend       | HTML/CSS (static site)    |
| Backend        | AWS Lambda (Node.js)      |
| Blockchain     | Ethereum Testnet via Infura |
| Storage        | Amazon S3                 |
| Hashing        | SHA-256 (crypto module)   |
| API Gateway    | REST API to expose Lambda |
| CI/CD (optional) | GitHub Actions          |

---

## 🌐 Architecture Diagram

_(📎 You can insert a PNG of your AWS architecture here, or link to `/docs/diagram.png`)_

```
User ──▶ HTML UI ──▶ API Gateway ──▶ Lambda:
                                       ├─▶ Upload file to S3
                                       ├─▶ Compute SHA-256 hash
                                       └─▶ Send hash to Ethereum via Infura
```

---

## 🛠 Key Features

- ✅ Upload and store documents securely
- ✅ Compute SHA-256 hash for each file
- ✅ Record hash on Ethereum blockchain
- ✅ Verify documents against the immutable record
- ✅ GitHub Push Protection enabled (no secrets committed)

---

## 🚀 How to Use

1. **Upload Document**  
   Go to the web UI and select a file to upload. The document is stored in S3, and its hash is computed.

2. **Register Hash on Blockchain**  
   The Lambda function calls Infura and registers the hash on Ethereum (testnet).

3. **Verify Document**  
   Later, you can upload any file and check if its hash matches the one on the blockchain.

---

## 🔐 Concepts Explained

### 🧬 Immutability with SHA-256
Each document’s fingerprint is unique. Even the smallest change produces a completely different hash.

### ⛓️ Blockchain Transparency
By storing the hash on a public ledger (Ethereum), you ensure anyone can verify document authenticity without needing access to the file itself.

### 🔒 Secure & Decentralized
AWS provides the compute/storage backend, while Ethereum ensures decentralized validation.

---

## 🧪 Troubleshooting

| Issue | Solution |
|-------|----------|
| ❌ `Push rejected due to secrets` | Use `git-filter-repo` to remove sensitive files |
| ❌ Infura call fails | Check if your project ID & endpoint are set correctly in `.env` |
| ❌ Lambda error | Check CloudWatch logs for runtime exceptions |

---

## 📦 Deployment Tips

- Ensure `.env` file with Infura credentials is excluded via `.gitignore`
- You can automate Lambda + UI deployment with GitHub Actions (optional)
- Use `aws s3 sync` to deploy UI to static hosting bucket

---

## 🧼 Clean-up (Optional)

After testing:
- Remove uploaded test files from S3
- Disable testnet project on Infura
- Tear down Lambda/API Gateway if needed

---

## 🧠 Lessons Learned

- Securely managing secrets is **critical**
- Blockchain + AWS can offer powerful integrity solutions
- Git history cleanup (with `git-filter-repo`) can save your project from failure

---

## 👨‍💻 Author

**David Luhiriri Nfizi** – AWS Certified | Blockchain Enthusiast | Cloud Builder  


