//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  // Clear root content
  rootElem.innerHTML = "";

  // Dynamically create episode cards
  episodeList.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode);
    rootElem.appendChild(episodeCard);
  });
}

function createEpisodeCard(episode) {
  // Format the season and episode number
  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number
  ).padStart(2, "0")}`;

  // Create episode card
  const card = document.createElement("div");
  card.classList.add("episode-card");

  card.innerHTML = `
    <img src="${episode.image.medium}" alt="${episode.name}">
    <div class="episode-info">
      <h2>${episode.name} - ${episodeCode}</h2>
      <p>${episode.summary}</p>
      <a href="${episode.url}" target="_blank">Read more</a>
    </div>
  `;

  return card;
}

window.onload = setup;
