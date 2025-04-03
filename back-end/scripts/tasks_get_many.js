const axios = require('axios');

const run = async () => {
  try {
    const response = await axios.get('http://localhost:3000/tasks', {
      params: {
        start_date: 0,
        end_date: 999999999999,
      }
    });
    console.log('response', response.data);
  } catch (err) {
    console.log('err', err);
  }
};

run();
