import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector(".search-form");
const galeria = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let page = 1;
const per_page = 42;

async function consulta(url, verb) {
  try {
    const response = await axios({
      method: verb,
      url: url,
    });

    const totalHits = response.data.totalHits;
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
      console.log(response);
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      const markup = response.data.hits
        .map((e) => {
          return `<a href="${e.largeImageURL}" class="card-link"><div class="photo-card">
              <img src="${e.webformatURL}" loading="lazy">
              
              <div class="info">
                <ul class="info-item">
                  <li class="titulo">likes</li>
                  <li>${e.likes}</li>
                </ul>
                <ul class="info-item">
                  <li class="titulo">tags</li>
                  <li>${e.tags}</li>
                </ul>
                <ul class="info-item">
                  <li class="titulo">comments</li>
                  <li>${e.comments}</li>
                </ul>
                <ul class="info-item">
                  <li class="titulo">downloads</li>
                  <li>${e.downloads}</li>
                </ul>
              </div>
            </div>
          </a>`;
        })
        .join("");

      galeria.insertAdjacentHTML("beforeend", markup);

      
      const input = document.querySelector('[name="searchQuery"]');
      input.addEventListener("input", () => {
      const searchQuery = input.value.trim();
      if (searchQuery === "") {
       galeria.innerHTML = "";
       loadMoreBtn.style.display = "none";
       }
     });

      const currentPageSize = galeria.querySelectorAll(".photo-card").length;
      if (currentPageSize >= totalHits) {
        loadMoreBtn.style.display = "none";
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        loadMoreBtn.style.display = "block";
      }

      const lightbox = new SimpleLightbox(".card-link");
      lightbox.refresh();
    }
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector('[name="searchQuery"]').value;
  const urlencoded = encodeURIComponent(input);
  page = 1;
  const ruta = `https://pixabay.com/api/?key=33770960-9441e00aea4c2d2fce88c05cc&q=${urlencoded}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;
  consulta(ruta, "GET");
});

loadMoreBtn.addEventListener("click", () => {
  page += 1;
  const input = document.querySelector('[name="searchQuery"]').value;
  const urlencoded = encodeURIComponent(input);
  const ruta = `https://pixabay.com/api/?key=33770960-9441e00aea4c2d2fce88c05cc&q=${urlencoded}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;
  consulta(ruta, "GET");

  
});
