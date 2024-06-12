const { Firestore } = require('@google-cloud/firestore');
const dotenv = require('dotenv');
dotenv.config();

const firestore = new Firestore({
  projectId: process.env.PROJECT_ID
});

module.exports = firestore;
