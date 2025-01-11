// Setup the page
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  addSearchBar(allEpisodes);
  addEpisodeSelector(allEpisodes);
}

// Dynamically create the episodes grid
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous content

  const displayCountElem = document.getElementById("display-count");
  displayCountElem.textContent = `Displaying ${episodeList.length} episode(s).`;

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    const episodeTitle = document.createElement("h2");
    episodeTitle.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeTitle.className = "episode-title";

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image.medium;
    episodeImage.alt = episode.name;

    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;

    episodeCard.appendChild(episodeTitle);
    episodeCard.appendChild(episodeImage);
    episodeCard.appendChild(episodeSummary);

    rootElem.appendChild(episodeCard);
  });
}

// Add the live search functionality
function addSearchBar(allEpisodes) {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) =>
      episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm)
    );
    makePageForEpisodes(filteredEpisodes);
  });
}

// Add the episode dropdown selector
function addEpisodeSelector(allEpisodes) {
  const episodeSelector = document.getElementById("episode-selector");

  // Populate the dropdown
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });

  // Add event listener for dropdown selection
  episodeSelector.addEventListener("change", (event) => {
    const selectedId = parseInt(event.target.value);
    if (selectedId) {
      const selectedEpisode = allEpisodes.find((episode) => episode.id === selectedId);
      makePageForEpisodes([selectedEpisode]);
    } else {
      makePageForEpisodes(allEpisodes); // Show all episodes if no selection
    }
  });
}

// Format episode code (e.g., S01E01)
function formatEpisodeCode(season, number) {
  const seasonStr = season.toString().padStart(2, "0");
  const numberStr = number.toString().padStart(2, "0");
  return `S${seasonStr}E${numberStr}`;
}

// Initialize the app when the page loads
window.onload = setup;