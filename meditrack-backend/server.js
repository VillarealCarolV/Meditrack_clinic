require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');
const User = require('./models/User');

sequelize.sync().then(() => {
  app.listen(3001, () => console.log('Server running on http://localhost:3001'));
});
