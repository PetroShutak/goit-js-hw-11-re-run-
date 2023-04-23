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
// тут створюємо екземпляр класу PixabayApi, який імпортуємо з модуля pixabayAPI.js
// для того щоб використати методи класу PixabayApi використовуємо змінну pixabay
// і викликаємо методи класу PixabayApi через цю змінну у нашому коді
// наприклад pixabay.loadImages(query) - це метод класу PixabayApi який робить запит на сервер
const pixabay = new PixabayApi();
// тут створюємо екземпляр класу GalleryCardsBuilder, який імпортуємо з модуля galleryCardsBuilder.js
// для того щоб використати методи класу GalleryCardsBuilder використовуємо змінну builder
// і викликаємо методи класу GalleryCardsBuilder через цю змінну у нашому коді
// наприклад builder.buildCards(data.hits) - це метод класу GalleryCardsBuilder який робить розмітку галереї
const builder = new GalleryCardsBuilder();
// тут створюємо екземпляр класу SimpleLightbox, який імпортуємо з модуля simple-lightbox.js
// для того щоб використати методи класу SimpleLightbox використовуємо змінну lightbox
// і викликаємо методи класу SimpleLightbox через цю змінну у нашому коді
// наприклад lightbox.refresh() - це метод класу SimpleLightbox який оновлює галерею
// цей метод потрібно викликати після того як ми змінили розмітку галереї
// тобто після того як ми додали нові картинки в галерею
// зробили новий запит на сервер і отримали нові картинки
// якщо його не викликати то галерея не буде оновлюватися
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
// тут створюємо екземпляр класу IntersectionObserver, який є вбудованим в мову JavaScript
// він дозволяє відслідковувати коли елемент потрапляє в поле зору користувача
// для того щоб використати методи класу IntersectionObserver використовуємо змінну scrollObserver
// і викликаємо методи класу IntersectionObserver через цю змінну у нашому коді
// наприклад scrollObserver.observe(refs.loader) - це метод класу IntersectionObserver який
// відслідковує коли елемент потрапляє в поле зору користувача
// коли елемент потрапляє в поле зору користувача він викликає callback-функцію яка
// передається в конструктор класу IntersectionObserver
// в нашому випадку це функція function (entries) {...}
// в цю функцію передається масив об'єктів entries
// в нашому випадку це масив з одним об'єктом
// в цьому об'єкті міститься інформація про те які елементи потрапили в поле зору користувача
// в нашому випадку це елемент з класом loader
// властивість isIntersecting цього об'єкта містить інформацію про те чи потрапив елемент в поле зору користувача
// якщо властивість isIntersecting цього об'єкта має значення true то елемент потрапив в поле зору користувача
// якщо властивість isIntersecting цього об'єкта має значення false то елемент не потрапив в поле зору користувача
const scrollObserver = new IntersectionObserver(
  function (entries) {
    // callback-функція яка викликається коли елемент потрапляє в поле зору користувача
    // console.log(entries); // масив з одним об'єктом
    entries.forEach(entry => {
      // перебираємо масив з одним об'єктом для того щоб отримати доступ до цього об'єкта
      if (entry.isIntersecting) {
        // якщо елемент потрапив в поле зору користувача то викликаємо метод loadMoreImages
        loadMoreImages();
      }
    });
  },
  // цей об'єкт містить налаштування для класу IntersectionObserver
  // властивість rootMargin цього об'єкта встановлює відступи для полів зору користувача
  // в нашому випадку відступи встановлені такі:
  // верхній відступ 0px, правий відступ 0px, нижній відступ 300px, лівий відступ 0px
  // також встановлено значення порогу 0.1, що означає що коли 10% елемента буде видно в полі зору користувача
  // то він буде вважатися видимим
  {
    rootMargin: '0px 0px 300px 0px',
    threshold: 0.1,
  }
);
// для додаткової інформації про клас IntersectionObserver можна подивитися тут
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
// або тут https://www.youtube.com/watch?v=ZYqBZmU-tA0&ab_channel=%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%D0%9D%D0%B5%D0%BF%D0%BE%D0%BC%D0%BD%D1%8F%D1%89%D0%B8%D0%B9
// тут ще прикольна стаття https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/
// і це https://goit.global/javascript/ru/v1/module-08/intersection-observer.html

let inputEmpty = true; // змінна яка містить інформацію про те чи пусте поле вводу
let showedImages = 0; // змінна яка містить інформацію про кількість показаних картинок
let totalHits = 0; // змінна яка містить інформацію про кількість знайдених картинок

refs.form.addEventListener('submit', onFormSubmit);
refs.input.addEventListener('input', onInput);
refs.button.addEventListener('click', onButtonClick);
refs.button.addEventListener('mouseleave', onButtonMouseLeave);
// вішаємо обробник події mouseleave на кнопку
// це робиться для того щоб коли користувач наводить курсор на кнопку і відводить його
// то він бачив що кнопка стає неактивною

// тепер ми напишемо функцію onInput яка буде викликатися при введенні тексту в поле вводу
// і буде перевіряти чи пусте поле вводу
// і якщо поле вводу не пусте то видаляється атрибут disabled з кнопки
// і кнопка стає активною
function onInput(event) {
  if (event.target.value.trim()) {
    inputEmpty = false;
    // якщо поле вводу не пусте то змінна inputEmpty стає false, тобто користувач ввів текст в поле вводу
    refs.button.removeAttribute('disabled'); // видаляємо атрибут disabled з кнопки пошук
  } else {
    inputEmpty = true; // в іншому випадку змінна inputEmpty стає true, тобто користувач не ввів текст в поле вводу
    refs.button.setAttribute('disabled', 'disabled'); // додаємо атрибут disabled до кнопки пошук
    // нагадаю, що атрибут disabled забороняє натискання кнопки і виклик метода onFormSubmit
    // він за замовчуванням встановлений на кнопку пошук в html
  }
}
// тут я думаю не потрібно пояснювати що робить функція onButtonClick, onButtonMouseLeave, unfocusButton
function onButtonClick() {
  refs.button.classList.add('search-form__button--focus');
}

function onButtonMouseLeave() {
  unfocusButton();
}

function unfocusButton() {
  refs.button.classList.remove('search-form__button--focus');
}

// тепер ми напишемо функцію onFormSubmit яка буде викликатися при натисканні кнопки пошук

function onFormSubmit(event) {
  event.preventDefault();
  // перевіряємо чи пусте поле вводу
  if (inputEmpty) {
    return;
  }

  stopObserver(); // викликаємо функцію stopObserver яка видаляє спостерігача за відображенням картинок
  // через gallery викликаємо метод innerHTML який очищає вміст елемента
  refs.gallery.innerHTML = '';
  showedImages = 0; // обнуляємо змінну яка містить інформацію про кількість відображених картинок
  totalHits = 0; // обнуляємо змінну яка містить інформацію про загальну кількість картинок
  // якщо цього не зробити то при наступному пошуку картинки будуть додаватися до вже відображених
  // тепер створимо змінну query в яку запишемо значення поля вводу
  const query = event.target.elements.searchQuery.value;
  // такий запис event.target.elements.searchQuery.value дозволяє отримати доступ до поля вводу
  // і отримати його значення (робили щось схоже на останньому занятті з Огородніком)
  // console.log(query);
  // тепер викликаємо функцію loadImages з параметром query
  // яка завантажує картинки з сервера
  loadImages(query);
}
// ця функція викликається асинхронно через await для того щоб вона завершилася перед тим як виконатися наступний код
async function loadImages(query) {
  try {
    const data = await pixabay.loadImages(query); // викликаємо метод loadImages з параметром query

    if (data.totalHits === 0) {
      // якщо від сервера прийшов пустий масив
      Notify.failure(
        // викликаємо функцію Notify.failure з параметром 'Sorry і т.д.'
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return; // виходимо з функції
    }

    totalHits = data.totalHits; // записуємо в змінну totalHits кількість картинок які повернув сервер
    // і через Notify.success виводимо повідомлення про кількість картинок які знайшлися
    // підставляючи значення змінної totalHits в шаблонний рядок динамічно
    Notify.success(`'Hooray! We found ${totalHits} images.'`);
    // і відразу викликаємо функцію buildGallery з параметром data
    // яка буде створювати розмітку картинок
    buildGallery(data);
    // щоб бібліотека lightbox працювала коректно потрібно викликати метод refresh
    // який оновлює галерею
    lightbox.refresh();
    // тут ми викликаємо функцію unfocusButton яка видаляє клас search-form__button--focus
    setTimeout(unfocusButton, 500);
    // змінна showedImages містить інформацію про кількість відображених картинок
    // вона дорівнює кількості картинок які повернув сервер
    showedImages = data.hits.length;

    if (showedImages < totalHits) {
      // якщо кількість відображених картинок менша за загальну кількість картинок
      refs.loader.classList.remove('loader--hidden'); // видаляємо клас loader--hidden з елемента loader
      // і викликаємо функцію startObserver яка створює спостерігача за відображенням картинок
      // і викликає функцію loadMoreImages коли картинки відображаються
      // таким чином ми завнатжуємо картинки поступово
      startObserver();
    }
  } catch (error) {
    console.error(error); // якщо виникла помилка виводимо її в консоль
  }
}
// а ось і функція loadMoreImages яка викликається коли картинки відображаються на екрані і до них дійшов спостерігач
// вона також асинхронна
// завантажує наступні картинки з сервера
async function loadMoreImages() {
  try {
    const data = await pixabay.loadNextImages(); // викликаємо метод loadNextImages

    if (showedImages === totalHits) {
      // якщо кількість відображених картинок дорівнює загальній кількості картинок
      // видаляємо клас loader--hidden з елемента loader
      refs.loader.classList.add('loader--hidden');
      // і викликаємо функцію stopObserver яка зупиняє спостерігача
      stopObserver();
      // виводимо повідомлення про те що картинки закінчились
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    // в іншому випадку
    // викликаємо функцію appendGallery з параметром data
    // яка додає картинки в кінець галереї
    appendGallery(data);
    // і оновлюємо галерею lightbox
    lightbox.refresh();
    // і збільшуємо змінну showedImages на кількість картинок які повернув сервер
    showedImages += data.hits.length;
  } catch (error) {
    console.error(error);
  }
}
// функція buildGallery викликає функцію buildCards з параметром data.hits - масив картинок
function buildGallery(data) {
  const markup = builder.buildCards(data.hits);
  // і вставляє розмітку в елемент gallery і відображає галерею на екрані
  refs.gallery.innerHTML = markup;
}
// функція appendGallery викликає функцію buildCards з параметром data.hits - масив картинок
// і вставляє розмітку в кінець елемента gallery
function appendGallery(data) {
  const markup = builder.buildCards(data.hits);
  // тут ми використовуємо insertAdjacentHTML який дозволяє вставляти розмітку в будь-яке місце
  // а не видаляти всю розмітку і вставляти нову як це робить innerHTML
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
// ось і функція startObserver яка створює спостерігача за відображенням картинок
// і викликає функцію loadMoreImages коли картинки відображаються
// таким чином ми завантажуємо картинки поступово
// щоб спостерігач працював потрібно викликати метод observe
// і передати йому елемент за яким потрібно спостерігати
// в нашому випадку це елемент loader
// scrollObserver.observe(refs.loader) - це виклик методу observe з параметром refs.loader;
// scrollObserver - це змінна в якій зберігається спостерігач
// observe - це метод з IntersectionObserver який викликається для створення спостерігача
function startObserver() {
  setTimeout(function () {
    // використовуємо setTimeout для того щоб спостерігач працював коректно
    scrollObserver.observe(refs.loader); // викликаємо метод observe з параметром refs.loader
  }, 1000);
}

function stopObserver() {
  // функція stopObserver викликає метод unobserve з параметром refs.loader
  scrollObserver.unobserve(refs.loader); // тобто вона зупиняє спостерігача
}
