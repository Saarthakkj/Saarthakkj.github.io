const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes'); // Adjust the path as needed
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Database connection
mongoose.connect('your_mongodb_connection_string', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(taskRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
