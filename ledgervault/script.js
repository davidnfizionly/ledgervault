const BASE_URL = "https://0hyepsetij.execute-api.us-east-1.amazonaws.com/prod";

// Fonction pour enregistrer un document
async function registerDocument() {
  const fileInput = document.getElementById("registerFile");
  const description = document.getElementById("documentDescription").value;
  const status = document.getElementById("registerStatus");

  if (!fileInput.files.length) {
    status.textContent = "Please select a file.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async () => {
    try {
      const base64Data = reader.result.split(",")[1];

      const body = JSON.stringify({
        fileName: file.name,                // ✅ Nom attendu par la Lambda
        fileContentBase64: base64Data      // ✅ Nom attendu par la Lambda
      });

      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });

      const result = await response.json();

      if (response.ok) {
        status.textContent = `✅ Registered.\nFilename: ${file.name}\nHash: ${result.sha256Hash}`;
      } else {
        status.textContent = `❌ Error: ${result.message || result.error || "Unknown error."}`;
      }
    } catch (err) {
      console.error(err);
      status.textContent = "❌ An error occurred while registering.";
    }
  };

  reader.readAsDataURL(file);
}

// Fonction pour vérifier un document
async function verifyDocument() {
  const fileInput = document.getElementById("verifyFile");
  const status = document.getElementById("verifyStatus");

  if (!fileInput.files.length) {
    status.textContent = "Please select a file.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async () => {
    try {
      const base64Data = reader.result.split(",")[1];

      const body = JSON.stringify({
        fileName: file.name,
        fileContentBase64: base64Data
      });

      const response = await fetch(`${BASE_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });

      const result = await response.json();

      if (response.ok) {
        if (result.match === "true") {
          status.textContent = `✅ Document is valid. Hash: ${result.originalHash}`;
        } else {
          status.textContent = `❌ Le fichier a été modifié.\nReçu: ${result.receivedHash}\nOriginal: ${result.originalHash}`;
        }
      } else {
        status.textContent = `❌ Error: ${result.message || result.error || "Unknown error."}`;
      }
    } catch (err) {
      console.error(err);
      status.textContent = "❌ An error occurred during verification.";
    }
  };

  reader.readAsDataURL(file);
}

// Liaison des boutons
document.getElementById("registerButton").addEventListener("click", registerDocument);
document.getElementById("verifyButton").addEventListener("click", verifyDocument);
