const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'heptacore-findtofine'
});

module.exports = firestore;
