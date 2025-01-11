//You can edit ALL of the code here
document.addEventListener("DOMContentLoaded", () => {
  const showSelector = document.getElementById("show-selector");
  const episodeSelector = document.getElementById("episode-selector");
  const searchInput = document.getElementById("search-input");
  const root = document.getElementById("root");
  const displayCount = document.getElementById("display-count");

  let allShows = [];
  let allEpisodes = [];

  // Fetch all shows and populate the show dropdown
  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((shows) => {
      allShows = shows.sort((a, b) => a.name.localeCompare(b.name));
      populateShowDropdown(allShows);
    })
    .catch((error) => console.error("Error fetching shows:", error));

  // Populate the show dropdown
  function populateShowDropdown(shows) {
    shows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelector.appendChild(option);
    });
  }

  // Fetch episodes when a show is selected
  showSelector.addEventListener("change", (event) => {
    const selectedShowId = event.target.value;

    if (selectedShowId) {
      fetch(`https://api.tvmaze.com/shows/${selectedShowId}/episodes`)
        .then((response) => response.json())
        .then((episodes) => {
          allEpisodes = episodes;
          populateEpisodeDropdown(episodes);
          displayEpisodes(episodes);
        })
        .catch((error) => console.error("Error fetching episodes:", error));
    } else {
      // Clear episodes if no show is selected
      episodeSelector.innerHTML = '<option value="">Select an episode</option>';
      root.innerHTML = "";
      displayCount.textContent = "";
    }
  });

  // Populate the episode dropdown
  function populateEpisodeDropdown(episodes) {
    episodeSelector.innerHTML = '<option value="">Select an episode</option>';
    episodes.forEach((episode) => {
      const option = document.createElement("option");
      option.value = episode.id;
      option.textContent = `${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
      episodeSelector.appendChild(option);
    });
  }

  // Display episodes
  function displayEpisodes(episodes) {
    root.innerHTML = "";
    displayCount.textContent = `Displaying ${episodes.length} episode(s)`;
    episodes.forEach((episode) => {
      const episodeDiv = document.createElement("div");
      episodeDiv.className = "episode";
      episodeDiv.innerHTML = `
        <h3>${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}</h3>
        <img src="${episode.image?.medium || ''}" alt="${episode.name}">
        <p>${episode.summary || "No summary available"}</p>
      `;
      root.appendChild(episodeDiv);
    });
  }

  // Display a single episode when selected from the dropdown
  episodeSelector.addEventListener("change", (event) => {
    const selectedEpisodeId = event.target.value;
    if (selectedEpisodeId) {
      const selectedEpisode = allEpisodes.find((ep) => ep.id === parseInt(selectedEpisodeId, 10));
      if (selectedEpisode) {
        displayEpisodes([selectedEpisode]); // Display the selected episode only
      }
    } else {
      // Display all episodes if no specific episode is selected
      displayEpisodes(allEpisodes);
    }
  });

  // Filter episodes based on search input
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) =>
      episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm)
    );
    displayEpisodes(filteredEpisodes);
  });
});
