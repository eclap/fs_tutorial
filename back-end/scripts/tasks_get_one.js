const axios = require('axios');

const run = async () => {
  try {
    const response = await axios.get('http://localhost:3000/tasks/e37fd22b-beb0-427e-8db2-0414d8421e2c');
    console.log('response', response);
  } catch (err) {
    console.log('err', err);
  }
};

run();
