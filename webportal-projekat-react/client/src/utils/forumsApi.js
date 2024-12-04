import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://real-time-forums-search.p.rapidapi.com/search',
  params: {
    query: 'popular programming languages',
    time: 'any',
    start: '0',
    country: 'us',
    language: 'en',
  },
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_RAPIDKEY,
    'x-rapidapi-host': 'real-time-forums-search.p.rapidapi.com',
  },
};

export const getForums = async () => {
  try {
    const response = await axios.request(options);

    if (response.data.status === 'OK') {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
  }
};