const { db, auth, firebase } = require('../config/firebase');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const createdAt = new Date().toISOString();

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true
    });

    userId = userRecord.uid;
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      createdAt: createdAt
    }

    const userCollection = db.collection('users');

    await userCollection.doc(userId).set(userData);

    res.json({
      message: 'Berhasil mendaftarkan akun',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mendaftarkan akun' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    const idToken = await userCredential.user.getIdToken();
    const userId = await userCredential.user.uid;
    res.json({
      message: 'Login berhasil',
      data: { uid: userId, email: email, token: idToken },
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Login gagal, periksa kembali Email atau Password' })
  }
};

module.exports = { registerUser, loginUser };
