import axios from 'axios';

export default class PixabayApi { 
  #API_KEY = '34734922-71a756c5ae22b2ca14df3cfaf'; 
  #URL = 'https://pixabay.com/api/'; 
  #PER_PAGE = 40;
  #page = 1; 
  #query = ''; 
  
  loadImages(query) {
    this.#page = 1; 
    this.#query = query.trim(); 
    return this.#fetch(); 
  }

  loadNextImages() { 
    this.#page += 1; 
    return this.#fetch(); 
  }

  async #fetch() { 
    const response = await axios({  
      url: this.#URL, 
      params: { 
        key: this.#API_KEY,
        q: this.#query, 
        image_type: 'photo', 
        orientation: 'horizontal', 
        safesearch: true, 
        per_page: this.#PER_PAGE, 
        page: this.#page, 
      },
    }); 
    return response.data; 
  }
}
