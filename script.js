//You can edit ALL of the code here
document.addEventListener("DOMContentLoaded", () => {
  const rootElem = document.getElementById("root");
  const searchInput = document.getElementById("search-input");
  const episodeSelector = document.getElementById("episode-selector");
  const displayCount = document.getElementById("display-count");

  let episodes = []; // Store fetched episodes here

  // Display a loading message while fetching data
  rootElem.innerHTML = "<h2>Loading episodes, please wait...</h2>";

  // Fetch episodes from API
  function fetchEpisodes() {
    fetch("https://api.tvmaze.com/shows/82/episodes")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        episodes = data; // Save episodes
        renderAllEpisodes(episodes);
        populateEpisodeSelector(episodes);
      })
      .catch((error) => {
        rootElem.innerHTML = `<h2>Failed to load episodes. Please try again later.</h2>`;
        console.error("Error fetching episodes:", error);
      });
  }

  // Render all episodes
  function renderAllEpisodes(episodeList) {
    if (episodeList.length === 0) {
      rootElem.innerHTML = "<h2>No episodes found!</h2>";
      return;
    }

    const displayHTML = episodeList
      .map(
        (episode) => `
        <div class="episode-card">
          <h3>${episode.name} – S${String(episode.season).padStart(2, "0")}E${String(
          episode.number
        ).padStart(2, "0")}</h3>
          <img src="${episode.image?.medium || ""}" alt="${episode.name}">
          <p>${episode.summary || "No summary available."}</p>
        </div>
      `
      )
      .join("");
    rootElem.innerHTML = displayHTML;
    displayCount.innerText = `Displaying ${episodeList.length}/${episodes.length} episodes.`;
  }

  // Populate the dropdown selector
  function populateEpisodeSelector(episodeList) {
    const optionsHTML = episodeList
      .map(
        (episode) => `
        <option value="${episode.id}">
          S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}
        </option>
      `
      )
      .join("");

    episodeSelector.innerHTML = `<option value="">Select an episode</option>` + optionsHTML;
  }

  // Handle search functionality
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = episodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
    );
    renderAllEpisodes(filteredEpisodes);
  });

  // Handle dropdown selector
  episodeSelector.addEventListener("change", () => {
    const selectedId = episodeSelector.value;
    if (selectedId) {
      const selectedEpisode = episodes.find((episode) => episode.id.toString() === selectedId);
      renderAllEpisodes([selectedEpisode]);
    } else {
      renderAllEpisodes(episodes); // Show all episodes when cleared
    }
  });

  // Fetch episodes on page load
  fetchEpisodes();
});


/*
Features Added
Dynamic Episode Loading
The code now fetches data from https://api.tvmaze.com/shows/82/episodes.

Loading Indicator
Displays a "Loading episodes..." message while the API request is in progress.

Error Handling
Shows a friendly error message if the API fetch fails.

Seamless Integration

The search bar filters episodes based on the dynamically loaded data.
The dropdown selector allows users to jump to a specific episode.
*/
