const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('admin12345', 10));
