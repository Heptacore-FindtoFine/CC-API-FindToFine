const express = require('express');
const app = express();
const cors = require('cors')

// Impor rute utama
const routes = require('./routes/index');

// Middelware
app.use(cors());
app.use(express.json());

// Gunakan rute utama
app.use('/', routes);

// Mulai server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
