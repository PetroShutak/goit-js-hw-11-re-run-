export default class GalleryCardsBuilder { // створюємо клас GalleryCardsBuilder з методом buildCards() та buildCard()
    buildCards(cardsData) { // метод buildCards() приймає масив картинок cardsData
      return cardsData.map(this.buildCard).join(' '); // викликаємо метод buildCard() для кожного елемента масиву cardsData
      // і повертаємо масив картинок як рядок через join(' ')
    }
  
    buildCard(cardData) { // метод buildCard() приймає об'єкт картинки cardData
      return `
          <li class="gallery__item">
            <a href="${cardData.largeImageURL}">
              <div class="photo-card">
                <img class="photo-card__image" src="${cardData.webformatURL}" alt="${cardData.tags}" loading="lazy" />
                <div class="info">
                  <p class="info-item">
                    <b>Likes</b>
                    <span>${cardData.likes}</span>
                  </p>
                  <p class="info-item">
                    <b>Views</b>
                    <span>${cardData.views}</span>
                  </p>
                  <p class="info-item">
                    <b>Comments</b>
                    <span>${cardData.comments}</span>
                  </p>
                  <p class="info-item">
                    <b>Downloads</b>
                    <span>${cardData.downloads}</span>
                  </p>
                </div>
              </div> 
            </a>
          </li>
        `;
    } // використовуємо дані з об'єкта cardData для створення розмітки картки з картинкою і інформацією про неї
  }
