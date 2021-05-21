import axios from 'axios';

export const service = (url) => {
  return axios({
    method: 'get',
    url,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
