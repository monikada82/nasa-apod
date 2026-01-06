const API_KEY = "LCW7Q7fqSzlKKmAeBWlxfkeH6YtHZfda9FaygKF0";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const imageContainer = document.getElementById("current-image-container");
const historyList = document.getElementById("search-history");

async function fetchAPOD(date) {
  console.log("Fetching date:", date);

  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;
  console.log("URL:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("NASA RESPONSE:", data);

    if (data.error) {
      imageContainer.innerHTML = `<p>${data.error.message}</p>`;
      return;
    }

    imageContainer.innerHTML = `
      <h2>${data.title}</h2>
      ${
        data.media_type === "image"
          ? `<img src="${data.url}" style="width:100%" />`
          : `<iframe src="${data.url}" width="100%" height="400"></iframe>`
      }
      <p>${data.explanation}</p>
    `;
  } catch (err) {
    console.error("FETCH FAILED:", err);
  }
}

function getCurrentImageOfTheDay() {
  const today = new Date().toISOString().split("T")[0];
  fetchAPOD(today);
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];

  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

function addSearchToHistory() {
  historyList.innerHTML = "";
  const searches = JSON.parse(localStorage.getItem("searches")) || [];

  searches.forEach(date => {
    const li = document.createElement("li");
    li.textContent = date;
    li.onclick = () => fetchAPOD(date);
    historyList.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = input.value;
  if (!date) return;

  fetchAPOD(date);
  saveSearch(date);
  addSearchToHistory();
});


getCurrentImageOfTheDay();
addSearchToHistory();
