const axios = require('axios');

const run = async () => {
  try {
    const response = await axios.post('http://localhost:3000/tasks', {
      status: 'To Do',
      title: 'Practice Tennis Serve',
      description: 'Pactice my 2nd serve...'
    });
    console.log('response', response);
  } catch (err) {
    console.log('err', err.response.data);
  }
};

run();
