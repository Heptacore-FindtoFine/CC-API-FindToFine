const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');
dotenv.config();

// diisi sesuai GCS yang ada di google cloud console, untuk key nya bisa membuat di service account
const storage = new Storage({
  projectId: process.env.CLOUD_STORAGE_KEY,
});

const bucket = storage.bucket(process.env.BUCKET_NAME); // diisi sesuai nama bucket yang dipakai

module.exports = { bucket, storage };