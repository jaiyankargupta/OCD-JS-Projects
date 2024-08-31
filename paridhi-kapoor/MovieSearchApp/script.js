

const API_KEY = '9335aa73';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');
const overlayContent = document.getElementById('overlay-content');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
let currentPage = 1;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getMovies(searchTerm, currentPage);
    }
});

async function getMovies(query, page) {
    try {
        const res = await fetch(`${API_URL}&s=${query}&page=${page}`);
        const data = await res.json();
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            main.innerHTML = `<p>No results found</p>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        main.innerHTML = `<p>Error fetching data</p>`;
    }
}

async function displayMovies(movies) {
    main.innerHTML = '';
    for (const movie of movies) {
        const { Title, Poster, Year, imdbID } = movie;
        try {
            const movieDetails = await fetch(`${API_URL}&i=${imdbID}`);
            const movieData = await movieDetails.json();
            const { Director, Genre } = movieData;

            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            movieEl.innerHTML = `
                <img src="${Poster !== 'N/A' ? Poster : 'https://via.placeholder.com/150'}" alt="${Title}">
                <div class="movie-info">
                    <h3>${Title}</h3>
                    <span>${Year}</span>
                    <p>Director: ${Director}</p>
                    <p>Genre: ${Genre}</p>
                </div>
                <div class="overview">
                    <button onclick="openNav('${imdbID}')">More Info</button>
                </div>
            `;
            main.appendChild(movieEl);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }
}

async function openNav(id) {
    try {
        const res = await fetch(`${API_URL}&i=${id}`);
        const data = await res.json();
        overlayContent.innerHTML = `
            <h2>${data.Title}</h2>
            <p><strong>Plot:</strong> ${data.Plot}</p>
            <p><strong>Director:</strong> ${data.Director}</p>
            <p><strong>Actors:</strong> ${data.Actors}</p>
            <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/150'}" alt="${data.Title}">
        `;
        document.getElementById('myNav').style.width = '100%';
    } catch (error) {
        console.error("Error fetching data:", error);
        overlayContent.innerHTML = `<p>Error fetching data</p>`;
    }
}

function closeNav() {
    document.getElementById('myNav').style.width = '0%';
}

leftArrow.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getMovies(search.value, currentPage);
    }
});

rightArrow.addEventListener('click', () => {
    currentPage++;
    getMovies(search.value, currentPage);
});
