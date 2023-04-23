import axios from 'axios';

export default class PixabayApi { // створюємо клас PixabayApi з методами loadImages() та loadNextImages()
  // і експортуємо його 

  #API_KEY = '34734922-71a756c5ae22b2ca14df3cfaf'; // ключ API
  #URL = 'https://pixabay.com/api/'; // URL API до якого ми будемо звертатись
  #PER_PAGE = 40; // кількість картинок на сторінці

  #page = 1; // сторінка
  #query = ''; // запит користувача, в нього ми будемо зберігати пошуковий запит в методі loadImages()
  // чому саме приватні поля? бо вони не будуть доступні ззовні класу, якщо не зробити їх приватними 
  // тобто вони не будуть доступні в методах loadImages() та loadNextImages()
  loadImages(query) {
    this.#page = 1; // при кожному новому запиті ми обнуляємо сторінку
    this.#query = query.trim(); // видаляємо пробіли з початку і кінця

    return this.#fetch(); // викликаємо приватний метод #fetch() і повертаємо його результат
  }

  loadNextImages() { // метод для завантаження наступної сторінки
    this.#page += 1; // збільшуємо сторінку на 1

    return this.#fetch(); // викликаємо приватний метод #fetch() і повертаємо його результат
  }

  async #fetch() { // приватний метод #fetch() для виклику API 
    const response = await axios({  // викликаємо axios і передаємо в нього об'єкт з налаштуваннями
      url: this.#URL, // URL API
      params: { // параметри запиту
        key: this.#API_KEY,
        q: this.#query, 
        image_type: 'photo', 
        orientation: 'horizontal', 
        safesearch: true, 
        per_page: this.#PER_PAGE, 
        page: this.#page, 
      },
    }); 

    return response.data; // повертаємо дані з response.data які ми отримали від API і 
    // використовуємо їх в методах loadImages() та loadNextImages() в 
  }
}
