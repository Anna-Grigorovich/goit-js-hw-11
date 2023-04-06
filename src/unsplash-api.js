'use strict';

import axios from 'axios';

export class PixabayAPI {
  BASE_URL = 'https://pixabay.com/api/';
  API_KEY = '35107606-ce46f6a21b8dfbba75834de78';

  page = 1;
  query = null;
  count = 40;

  async fetchPhotos() {
    return axios.get(
      `${this.BASE_URL}?key=${this.API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.count}`
    );
  }
}
