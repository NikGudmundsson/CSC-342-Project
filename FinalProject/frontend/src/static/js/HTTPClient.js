const API_BASE = '/api';

const handleError = (res) => {
  if(!res.ok) {
    if(res.status == 401) {
      throw new Error("Authentication error");
    }
    else {
      // written with special help from Dr. Dominguez
      return res.json().then(err => {throw new Error(err.error)});
    }
  }
  return res;
};
  
export default {
  get: (url) => {
    return fetch(`${API_BASE}${url}`, {
      headers: {
      }
    }).then(handleError).then(res => {
      return res.json();
    });
  },

  post: (url, data) => {
    return fetch(`${API_BASE}${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(handleError).then(res => {
      return res.json();
    });
  },

  put: (url, data) => {
    return fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(handleError).then(res => {
      return res.json();
    });

  },

  delete: (url) => {
    return fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: {
      }
    }).then(handleError).then(res => {
      return res.json();
    });
  },

};
  