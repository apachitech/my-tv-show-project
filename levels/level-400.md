# Level 400

For level 400, you should work in the repo of your partner from level 200.

Before writing any new code, look at their level 300 implementation.

Compare their implementation to yours. Think:
1. How is it different?
2. What do you prefer about your implementation?
3. What do you prefer about their implementation?
4. What did you learn that you didn't know before?

They should do the same with your repository.

Have a discussion about your answers to these questions. In class, together you should give a 3 minute talk about your conclusions.

## Refactoring

Feel free to change anything in your codebase which you think will make it easier to work with, or to build new features.

Have your partner review any changes you have, and make sure they understand them.

## Adding new functionality

Level 400 is about expanding beyond one TV show.

Until now, your site has only showed information about the episode of one TV show.

But TVmaze has information about lots of TV shows, all in the same format.

We want to display any of them.

### Requirements

1. Add a `select` element to your page so the user can choose a show.
2. When the user first loads the page, make a `fetch` request to https://api.tvmaze.com/shows ([documentation](https://www.tvmaze.com/api#show-index)) to get a list of available shows, and add an entry to the drop-down per show.
3. When a user selects a show, display the episodes for that show, just like the earlier levels of this project.

  You will need to perform a `fetch` to get the episode list.
4. Make sure that your search and episode selector controls still work correctly when you change shows.
5. Your select must list shows in alphabetical order, case-insensitive.
6. During one user's visit to your website, you should never fetch any URL more than once.

> [!NOTE]  
> Be _careful_ when developing with fetch. By default, every time you make a small change to your app it will be restarted by live server - if you are fetching JSON on page load, the JSON will be downloaded again and again. These frequent HTTP requests may lead to the API permanently banning your IP address from further requests, or "throttling" it for some time. Worse, if they don't, they may cause performance issues for the API service we are using.

#### Screenshot of minimal version

Note: Provided your project meets the above requirements, it can **look** however you want.

Here is one example layout.

![Screenshot of a website with a drop-down list with the show "Breaking Bad" selected](example-screenshots/example-level-400-1.jpg)

![Screenshot of a website with a drop-down list showing multiple TV shows](example-screenshots/example-level-400-1.jpg)




____________________________________CODE EXPLANATION LEVEL-400_____________________

What are we trying to achieve?
We are building a webpage where:

You can select a TV show from a dropdown.

After selecting a show, you can see all the episodes of that show.

You can either search episodes by name or summary or select a specific episode from a dropdown to display it.

Think of it as a fun app to browse shows and their episodes! 📺✨

How does the code work?

We are using HTML for structure, CSS for styling (optional), and JavaScript for functionality. Here’s how it all comes together:

1. HTML Setup
We have:

A dropdown for TV shows.
Another dropdown for episodes (appears when you select a show).

A search box to type and filter episodes.

A section to display episodes.

Here’s the key part of our HTML:

html code:

<select id="show-selector">
  <option value="">Select a show</option>
</select>

<select id="episode-selector">
  <option value="">Select an episode</option>
</select>

<input type="text" id="search-input" placeholder="Search episodes">
<div id="display-count"></div>
<div id="root"></div>

2. How does JavaScript make it work?

Step 1: Fetch TV Shows

When the page loads, JavaScript fetches a list of TV shows from an external API (https://api.tvmaze.com/shows). This is like grabbing data from a library of TV shows stored online.

What’s happening?

We send a request to the API.

We get back a list of shows (like their names and IDs).

Then, we populate the show-selector dropdown with all these show names.

javascript :

fetch("https://api.tvmaze.com/shows")
  .then((response) => response.json())
  .then((shows) => {
    allShows = shows.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
    populateShowDropdown(allShows); // Add shows to dropdown
  });


Step 2: Fetch Episodes for Selected Show

When you pick a show from the dropdown:

JavaScript fetches all episodes of that show using its ID (https://api.tvmaze.com/shows/{id}/episodes).

These episodes are then:
Added to the episode-selector dropdown.
Displayed on the page (all of them, initially).

javascript code:

showSelector.addEventListener("change", (event) => {
  const selectedShowId = event.target.value; // Get selected show's ID

  fetch(`https://api.tvmaze.com/shows/${selectedShowId}/episodes`)
    .then((response) => response.json())
    .then((episodes) => {
      allEpisodes = episodes; // Store all episodes
      populateEpisodeDropdown(episodes); // Fill episode dropdown
      displayEpisodes(episodes); // Show all episodes on the page
    });
});

Step 3: Display Episodes

When episodes are fetched, we display them in a grid or list. Each episode will show:

Its name, season, and episode number (e.g., S01E01).
An image (if available).
A short description (called the "summary").
The displayEpisodes function builds this layout using HTML dynamically.

javascript code:

function displayEpisodes(episodes) {
  root.innerHTML = ""; // Clear the previous episodes
  displayCount.textContent = `Displaying ${episodes.length} episode(s)`; // Show count

  episodes.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.innerHTML = `
      <h3>${episode.name} - S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}</h3>
      <img src="${episode.image?.medium || ''}" alt="${episode.name}">
      <p>${episode.summary || "No summary available"}</p>
    `;
    root.appendChild(episodeDiv);
  });
}

Step 4: Search Episodes

We allow users to type in a search box. When they type something, we filter episodes based on:

The episode’s name.
The episode’s summary.
If the search term matches any part of these, the filtered episodes are displayed.

javascript code:

searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase(); // Get search term
  const filteredEpisodes = allEpisodes.filter((episode) =>
    episode.name.toLowerCase().includes(searchTerm) ||
    episode.summary.toLowerCase().includes(searchTerm)
  );
  displayEpisodes(filteredEpisodes); // Display matching episodes
});

Step 5: Select an Episode

If a user picks a specific episode from the episode-selector dropdown, only that episode will be displayed.

javascript code:

episodeSelector.addEventListener("change", (event) => {
  const selectedEpisodeId = event.target.value; // Get episode ID
  const selectedEpisode = allEpisodes.find((ep) => ep.id === parseInt(selectedEpisodeId, 10));
  if (selectedEpisode) {
    displayEpisodes([selectedEpisode]); // Display only the selected episode
  } else {
    displayEpisodes(allEpisodes); // Show all if no selection
  }

});


How does it all feel?

Here’s how you’d experience this app:

Open the dropdown, pick a show like "Breaking Bad."
Boom! You see all its episodes listed.
Use the search box to find episodes about “Walter.”
Or, select an episode (e.g., S01E01) from the dropdown to view only that episode.

What’s the magic here?

APIs: Fetching data dynamically from the internet.
Dynamic Dropdowns: Populating dropdowns based on fetched data.
Event Listeners: Detecting when you select something or type in the search box.
DOM Manipulation: Dynamically creating and updating the HTML to show episodes.