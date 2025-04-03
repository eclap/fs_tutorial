const axios = require('axios');

const run = async () => {
  try {
    const url = 'http://localhost:3000/tasks/e37fd22b-beb0-427e-8db2-0414d8421e2c';
    const response = await axios.put(url, {
      title: 'New Title',
      description: 'New Description',
      status: 'In Progress',
    });
    console.log('response', response);
  } catch (err) {
    console.log('err', err);
  }
};

run();
