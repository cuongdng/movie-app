const API_URL =
    'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=2e7ccdee9d7683add04c822497fb0ae7&page=1';
const API_URL_TV =
    'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=2e7ccdee9d7683add04c822497fb0ae7&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

const SEARCH_API =
    'https://api.themoviedb.org/3/search/movie?api_key=2e7ccdee9d7683add04c822497fb0ae7&query="';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const popularBtn = document.querySelector('.popular');
const tvBtn = document.querySelector('.tv');
// Get initial movies
getMovies(API_URL);

popularBtn.onclick = function () {
    getMovies(API_URL);
};

tvBtn.onclick = async function () {
    const res = await fetch(API_URL_TV);
    const data = await res.json();
    showMovies(data.results, 1);
};

async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    const genres = await data.results.map(async (movie) => {
        const res1 = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=2e7ccdee9d7683add04c822497fb0ae7`
        );
        const data1 = await res1.json();
        const result = data1.genres.map((genre) => {
            return genre.name;
        });
        return { id: movie.id, genres: result.join(', ') };
    });
    x = await Promise.all(genres);
    showMovies(data.results, x);
}

function showMovies(movies, genres) {
    main.innerHTML = '';
    if (genres !== 1) {
        movies.forEach((movie) => {
            const { title, poster_path, vote_average, overview, id } = movie;
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            movieEl.innerHTML = `
            <img
                src="${IMG_PATH + poster_path}"
                alt="${title}"
            />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(
                    vote_average
                )}">${vote_average}</span>
            </div>
            <div class="overview">
                <span>${genres.find((movie) => movie.id === id).genres}</span>
                <h3>Overview</h3>
                ${overview}
            </div>
            `;
            main.appendChild(movieEl);
        });
    } else {
        movies.forEach((movie) => {
            const { original_name, poster_path, vote_average, overview, id } =
                movie;
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            movieEl.innerHTML = `
            <img
                src="${IMG_PATH + poster_path}"
                alt="${original_name}"
            />
            <div class="movie-info">
                <h3>${original_name}</h3>
                <span class="${getClassByRate(
                    vote_average
                )}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
            `;
            main.appendChild(movieEl);
        });
    }
}

async function getGenreById(id) {
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=2e7ccdee9d7683add04c822497fb0ae7`
    );
    const data = await res.json();
    const result = data.genres.map((genre) => {
        return genre.name;
    });
    return result.join(', ');
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);

        search.value = '';
    } else {
        window.location.reload();
    }
});
