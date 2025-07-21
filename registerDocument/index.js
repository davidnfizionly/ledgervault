const AWS = require('aws-sdk');
const crypto = require('crypto');
const axios = require('axios');

const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    // Gérer les requêtes OPTIONS (préflight CORS)
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: JSON.stringify({ message: 'CORS preflight success' }),
      };
    }

    // Parse le body JSON
    const body = JSON.parse(event.body);
    const { fileName, fileContentBase64 } = body;

    if (!fileName || !fileContentBase64) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'fileName and fileContentBase64 are required' }),
      };
    }

    // Décodage du fichier
    const fileBuffer = Buffer.from(fileContentBase64, 'base64');

    // Calcul du hash
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Upload vers S3
    await s3
      .putObject({
        Bucket: 'uploads-ledgervault',
        Key: fileName,
        Body: fileBuffer,
      })
      .promise();

    // (Optionnel) Envoi vers blockchain
    // await axios.post('https://.../sendHashToBlockchain', { hash });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify({
        message: 'Document uploaded and hashed successfully',
        sha256Hash: hash,
      }),
    };
  } catch (error) {
    console.error('Error in registerDocument:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
