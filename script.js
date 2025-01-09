const apiKey = "ee5a6632";
const searchButton = document.querySelector("#search-button");
const input = document.querySelector("#search");
const resultsSection = document.querySelector("#results");
const detailsSection = document.querySelector("#details");

searchButton.addEventListener("click", () => {
  const query = input.value.trim();

  if (!query) return;

  resultsSection.innerHTML = "Carregando . . .";

  fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response === "False") {
        resultsSection.innerHTML = "Nenhum Resultado Encontrado.";
        return;
      }
      resultsSection.innerHTML = data.Search.map((movie) => {
        let poster;

        if (movie.Poster !== "N/A") {
          poster = movie.Poster; // Usa o pôster retornado pela API.
        } else {
          poster = "https://via.placeholder.com/300x445?text=Sem+Imagem"; // Usa um placeholder genérico.
        }

        return `
          <div class="movie" data-id="${movie.imdbID}">
            <img src="${poster}" alt="${movie.Title}" onerror="this.src='https://via.placeholder.com/300x445?text=Erro+na+Imagem'" />
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
          </div>
        `;
      }).join("");

      document.querySelectorAll(".movie").forEach((movieE1) => {
        movieE1.addEventListener("click", () => {
          const movieID = movieE1.getAttribute("data-id");
          showDetails(movieID);
        });
      });
    })
    .catch((error) => {
      console.log(error);
      resultsSection.innerHTML = "Erro ao buscar filme!";
    });
});

// --- 2 função ---- Mostrar detalhes

function showDetails(id) {
  fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
    .then((res) => res.json())
    .then((movie) => {
      detailsSection.innerHTML = `
        <button id="close-btn">Fechar</button>
        <h1 class="title-Filme">${movie.Title} (${movie.Year})</h1>
        <img src="${movie.Poster}" alt="${movie.Title}" class="imagens-filmes" />
        <p class="sinopse">  ${movie.Plot}</p>
        <p class="autores">  <strong>Diretor:</strong> ${movie.Director}</p>
      `;
      detailsSection.classList.remove("hidden");

      document.querySelector("#close-btn").addEventListener("click", () => {
        detailsSection.classList.add("hidden");
      });
    });
}

// funcional do carrosel
let contador = 1;

setInterval(function () {
  document.getElementById("slide" + contador).checked = true;
  contador++;

  if (contador > 4) {
    contador = 1;
  }
}, 5000);

// Mostrar detalhes no carrossel

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("details-btn")) {
    const movieId = e.target.getAttribute("data-id"); // Obtém o ID do filme
    showDetails(movieId); // Chama a função para exibir detalhes
  }
});
