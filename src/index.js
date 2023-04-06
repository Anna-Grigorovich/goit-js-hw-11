import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import { PixabayAPI } from './unsplash-api';

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchInputEl = document.querySelector('.search-input');
const lightbox = new SimpleLightbox('.gallery a', {});
let countHits = 0;

formEl.addEventListener('submit', handleSearchSubmit);
loadMoreBtn.addEventListener('click', fetchPhoto);

const pixabayAPI = new PixabayAPI();
function clearMarkup() {
  gallery.innerHTML = '';
}

function handleSearchSubmit(e) {
  countHits = 0;
  pixabayAPI.page = 1;
  e.preventDefault();
  clearMarkup();
  fetchPhoto();
}

function createMarkup(data) {
  return data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
        tags,
      }) => {
        return `
        <div class="photo-card">
          <div class="thumb">
            <a class="image" href="${webformatURL}">
            <img src="${largeImageURL}" alt="${tags}" loading="lazy" class='gallery-img' />
            </a>
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </div>
      `;
      }
    )
    .join('');
}

function addMarkup(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

async function fetchPhoto() {
  pixabayAPI.query = searchInputEl.value.trim();
  if (pixabayAPI.query === '') {
    return;
  }
  let data;
  try {
    data = (await pixabayAPI.fetchPhotos()).data;
  } catch (er) {
    console.log(er);
  }

  countHits += data.hits.length;
  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  const markup = createMarkup(data);
  addMarkup(markup);
  if (countHits >= data.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
  } else {
    loadMoreBtn.classList.remove('is-hidden');
  }
  pixabayAPI.page += 1;
}
