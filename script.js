//You can edit ALL of the code here
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  const searchShowsInput = document.getElementById("search-shows");
  const backToShowsLink = document.getElementById("back-to-shows");
  const displayCount = document.getElementById("display-count");

  let allShows = [];
  let allEpisodes = [];
  let isEpisodeView = false; // New flag to track the current mode

  // Fetch and display all shows
  function fetchShows() {
    fetch("https://api.tvmaze.com/shows")
      .then((response) => response.json())
      .then((shows) => {
        allShows = shows.sort((a, b) => a.name.localeCompare(b.name));
        displayShows(allShows);
      })
      .catch((error) => console.error("Error fetching shows:", error));
  }

  function displayShows(shows) {
    isEpisodeView = false; // Set mode to "shows"
    root.innerHTML = "";
    displayCount.textContent = `Found ${shows.length} show(s)`;

    shows.forEach((show) => {
      const showCard = document.createElement("div");
      showCard.className = "show-card";

      showCard.innerHTML = `
        <img src="${show.image?.medium || "https://via.placeholder.com/210"}" alt="${show.name}" />
        <div class="show-info">
          <h3>${show.name}</h3>
          <p>${show.summary || "No summary available"}</p>
          <p class="details">
            Rated: ${show.rating.average || "N/A"} | Genres: ${show.genres.join(", ")} | Status: ${show.status} | Runtime: ${show.runtime || "N/A"} min
          </p>
        </div>
      `;

      showCard.addEventListener("click", () => fetchEpisodes(show.id));

      root.appendChild(showCard);
    });
  }

  function fetchEpisodes(showId) {
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => response.json())
      .then((episodes) => {
        allEpisodes = episodes;
        displayEpisodes(episodes);
      })
      .catch((error) => console.error("Error fetching episodes:", error));
  }

  function displayEpisodes(episodes) {
    isEpisodeView = true; // Set mode to "episodes"
    root.innerHTML = "";
    displayCount.textContent = `Displaying ${episodes.length} episode(s)`;
    backToShowsLink.style.display = "block";

    episodes.forEach((episode) => {
      const episodeCard = document.createElement("div");
      episodeCard.className = "episode-card";

      episodeCard.innerHTML = `
        <img src="${episode.image?.medium || "https://via.placeholder.com/210"}" alt="${episode.name}" />
        <div class="episode-info">
          <h3>${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}</h3>
          <p>${episode.summary || "No summary available"}</p>
        </div>
      `;

      root.appendChild(episodeCard);
    });
  }

  searchShowsInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();

    if (isEpisodeView) {
      // Filter episodes
      const filteredEpisodes = allEpisodes.filter(
        (episode) =>
          episode.name.toLowerCase().includes(searchTerm) ||
          episode.summary?.toLowerCase().includes(searchTerm)
      );
      displayEpisodes(filteredEpisodes);
    } else {
      // Filter shows
      const filteredShows = allShows.filter(
        (show) =>
          show.name.toLowerCase().includes(searchTerm) ||
          show.summary?.toLowerCase().includes(searchTerm) ||
          show.genres.some((genre) => genre.toLowerCase().includes(searchTerm))
      );
      displayShows(filteredShows);
    }
  });

  backToShowsLink.addEventListener("click", (event) => {
    event.preventDefault();
    backToShowsLink.style.display = "none";
    displayShows(allShows);
  });

  fetchShows();
});