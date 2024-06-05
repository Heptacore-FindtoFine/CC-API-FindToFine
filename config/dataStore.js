// const { Firestore } = require('@google-cloud/firestore');

// async function storeData(id, data) {
//   const db = new Firestore();
 
//   const taskCollection = db.collection('tasks');
//   return taskCollection.doc(id).set({
//       id: data.id,
//       title: data.title,
//       image: data.image,
//       startDate: data.startDate,
//       finishDate: data.finishDate,
//       location: data.location,
//       description: data.description,
//       item: data.item,
//       createdAt: data.createdAt,
//       updatedAt: data.updatedAt
//   });
// }
 
// module.exports = storeData;