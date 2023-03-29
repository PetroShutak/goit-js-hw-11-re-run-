import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import PixabayApi from './js/pixabayAPI';
import GalleryCardsBuilder from './js/galleryCardsBuilder';
import { Notify } from 'notiflix';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-form__input'),
  button: document.querySelector('.search-form__button'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
};

const pixabay = new PixabayApi();
const builder = new GalleryCardsBuilder();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
const scrollObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMoreImages();
      }
    });
  },
  {
    rootMargin: '0px 0px 300px 0px',
    threshold: 0.1,
  }
);

let inputEmpty = true;
let showedImages = 0;
let totalHits = 0;

refs.form.addEventListener('submit', onFormSubmit);
refs.input.addEventListener('input', onInput);
refs.button.addEventListener('click', onButtonClick);
refs.button.addEventListener('mouseleave', onButtonMouseLeave);

function onInput(event) {
  if (event.target.value.trim()) {
    inputEmpty = false;
    refs.button.removeAttribute('disabled');
  } else {
    inputEmpty = true;
    refs.button.setAttribute('disabled', 'disabled');
  }
}

function onButtonClick() {
  refs.button.classList.add('search-form__button--focus');
}

function onButtonMouseLeave() {
  unfocusButton();
}

function unfocusButton() {
  refs.button.classList.remove('search-form__button--focus');
}

function onFormSubmit(event) {
  event.preventDefault();

  if (inputEmpty) {
    return;
  }

  stopObserver();

  refs.gallery.innerHTML = '';
  showedImages = 0;
  totalHits = 0;

  const query = event.target.elements.searchQuery.value;

  loadImages(query);
}

async function loadImages(query) {
  try {
    const data = await pixabay.loadImages(query);

    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return;
    }

    totalHits = data.totalHits;

    Notify.success(`'Hooray! We found ${totalHits} images.'`);

    buildGallery(data);

    lightbox.refresh();

    setTimeout(unfocusButton, 500);

    showedImages = data.hits.length;

    if (showedImages < totalHits) {
      refs.loader.classList.remove('loader--hidden');
      startObserver();
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadMoreImages() {
  try {
    const data = await pixabay.loadNextImages();

    if (showedImages === totalHits) {
      refs.loader.classList.add('loader--hidden');

      stopObserver();

      Notify.info("We're sorry, but you've reached the end of search results.");
    }

    appendGallery(data);

    lightbox.refresh();

    showedImages += data.hits.length;
  } catch (error) {
    console.error(error);
  }
}

function buildGallery(data) {
  const markup = builder.buildCards(data.hits);

  refs.gallery.innerHTML = markup;
}

function appendGallery(data) {
  const markup = builder.buildCards(data.hits);

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function startObserver() {
  setTimeout(function () {
    scrollObserver.observe(refs.loader);
  }, 1000);
}

function stopObserver() {
  scrollObserver.unobserve(refs.loader);
}
