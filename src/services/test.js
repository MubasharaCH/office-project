const axios=require('axios');

const makeRequest = async (value) => {
  try {
    const response = await axios.post('https://ign.onl/api/url/add', {
      url:value    }, {
      headers: {
        Authorization: 'tanRpCJO1tqa',
        'Content-Type': 'application/json',
      },
    });

    console.log('Response:', response.data);
    return response.data
  } catch (error) {
    console.error('Error:', error.message);
  }
};

export default makeRequest;

// makeRequest("https://dev.api.myignite.online/invoice/496871f9bcb86f912eb78a52397844e2")