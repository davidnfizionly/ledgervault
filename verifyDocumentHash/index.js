const AWS = require('aws-sdk');
const crypto = require('crypto');

const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    console.log("Received event:", event);

    const { fileName, fileContentBase64 } = JSON.parse(event.body || '{}');

    if (!fileName || !fileContentBase64) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        body: JSON.stringify({ error: 'fileName and fileContentBase64 are required' }),
      };
    }

    // Recalculer le hash du fichier reçu
    const fileBuffer = Buffer.from(fileContentBase64, 'base64');
    const receivedHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Télécharger le fichier depuis S3
    const s3Object = await s3.getObject({
      Bucket: 'uploads-ledgervault',
      Key: fileName,
    }).promise();

    // Recalculer le hash du fichier dans S3
    const originalHash = crypto.createHash('sha256').update(s3Object.Body).digest('hex');
    const isMatch = receivedHash === originalHash;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify({
        message: isMatch ? '✅ Intégrité confirmée' : '❌ Le fichier a été modifié',
        receivedHash,
        originalHash,
        match: isMatch
      }),
    };
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify({
        error: 'Erreur serveur',
        details: error.message
      }),
    };
  }
};
