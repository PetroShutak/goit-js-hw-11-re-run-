export default class GalleryCardsBuilder { 
    buildCards(cardsData) { 
      return cardsData.map(this.buildCard).join(' '); 
    }
  
    buildCard(cardData) { 
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
    } 
  }
