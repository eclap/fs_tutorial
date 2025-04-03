const axios = require('axios');

const run = async () => {
  try {
    const response = await axios.delete('http://localhost:3000/tasks/Product01');
    console.log('response', response);
  } catch (err) {
    console.log('err', err);
  }
};

run();
