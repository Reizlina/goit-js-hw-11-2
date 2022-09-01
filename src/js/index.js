import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import '../css/styles.css';
import { UnsplashApi } from './fetchPic';
import { renderGalleryItem } from './markup';

const unsplashApi = new UnsplashApi();

const searchForm = document.querySelector('.search-form');
const galleryDiv = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

// * -----------------------ON FORM SUBMIT--------------------

async function onFormSubmit(e) {
  e.preventDefault();
  galleryDiv.innerHTML = '';
  unsplashApi.searchQuery = e.currentTarget.elements.searchQuery.value;
  unsplashApi.page = 1;
  try {
    const { data } = await unsplashApi.fetchPictures();
    console.log(data);
    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtnEl.style.display = 'none';
    } else if (data.totalHits <= 40) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      renderGalleryItem(data.hits);
      lightbox.refresh();
      loadMoreBtnEl.style.display = 'none';
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      renderGalleryItem(data.hits);
      lightbox.refresh();
      loadMoreBtnEl.style.display = 'none';
      loadMoreBtnEl.style.display = 'block';
    }
  } catch (error) {
    console.log('error :', error);
  }
  unsplashApi.incrementPage();
}

searchForm.addEventListener('submit', onFormSubmit);

// * -----------------------ON BTN CLICK--------------------

const onLoadMoreBtnElClick = async () => {
  try {
    const { data } = await unsplashApi.fetchPictures();

    let totalPages = Math.ceil(data.totalHits / data.hits.length);
    console.log(data.hits.length);

    if (totalPages === unsplashApi.page + 1) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtnEl.style.display = 'none';
      renderGalleryItem(data.hits);
      lightbox.refresh();
    } else {
      renderGalleryItem(data.hits);
      lightbox.refresh();
      unsplashApi.incrementPage();
    }
  } catch (err) {
    console.log(err);
  }
};

loadMoreBtnEl.addEventListener('click', onLoadMoreBtnElClick);
