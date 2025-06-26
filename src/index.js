import "./styles.css";
import rainIcon from "../assets/image/rainy.png";
import sunnyIcon from "../assets/image/sunnyIcon.png";
import cloudyIcon from "../assets/image/cloudyIcon.png";

const input = document.querySelector("input");
const searchBtn = document.querySelector(".searchbtn");
const locationTitle = document.querySelector(".location-title");
const cardDay = document.querySelectorAll(".card-day");
const cardCondition = document.querySelectorAll(".card-condition");
const lowTemp = document.querySelectorAll(".low-degree-num");
const highTemp = document.querySelectorAll(".high-degree-num");
const currentTime = document.querySelector(".time");
const currentDate = document.querySelector(".date");
const toggleBtn = document.querySelector("#check");
console.log("lowTemp", lowTemp.length, lowTemp);
console.log("highTemp", highTemp.length, highTemp);

let summary = [];
let useCelsius = false;

// Live Clock
function updateClock() {
  const now = new Date();
  currentTime.textContent = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // ensure 12-hour clock
  });

  const parts = new Date().toDateString().split(" ");
  currentDate.textContent = `${parts[0]} ${parts[1]} ${parts[2]}`;
}

updateClock();
setInterval(updateClock, 1000);

//C/F toggle
toggleBtn.addEventListener("change", () => {
  useCelsius = toggleBtn.checked;
  updateTempsDisplay();
});

function updateTempsDisplay() {
  document.querySelectorAll(".low-degree-num").forEach((el, i) => {
    const f = summary[i].tempmin;
    const c = ((f - 32) * 5) / 9;
    el.textContent = useCelsius ? `${c.toFixed(1)}°C` : `${f.toFixed(1)}°F`;
  });

  document.querySelectorAll(".high-degree-num").forEach((el, i) => {
    const f = summary[i].tempmax;
    const c = ((f - 32) * 5) / 9;
    el.textContent = useCelsius ? `${c.toFixed(1)}°C` : `${f.toFixed(1)}°F`;
  });
}

// Fetch + wait for data
async function getWeather(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=CJJE5U6F5XJJQRGBDQ7WCQQR3`;

  const respond = await fetch(url, { mode: "cors" });
  const unwrapData = await respond.json();
  console.log(unwrapData);
  return unwrapData;
}

//   Collect needed data
function extractWeather(data) {
  return data.days.slice(0, 3).map((day) => {
    const dateObj = new Date(day.datetime);
    const shortDay = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    return {
      day: shortDay,
      conditions: day.conditions,
      temp: day.temp,
      tempmin: day.tempmin,
      tempmax: day.tempmax,
    };
  });
}

//Main search handler - renders
searchBtn.addEventListener("click", async () => {
  // For extractor to get the actual data and not a promise
  try {
    const searchValue = input.value;
    const rawData = await getWeather(searchValue);
    summary = extractWeather(rawData);

    updateTempsDisplay();
    updateClock();

    //Render locations, day, conditions
    const locationSite = rawData.resolvedAddress;
    console.log(`Weather summary:`, summary);
    console.log(locationSite);

    locationTitle.textContent = locationSite;
    cardDay.forEach((el, i) => {
      el.textContent = summary[i].day;
    });
    cardCondition.forEach((el, i) => {
      el.textContent = summary[i].conditions;
    });
    lowTemp.forEach((el, i) => {
      console.log("lowTemps index", i, "summary[i] is", summary[i]);
      el.textContent = `${summary[i].tempmin}°`;
    });
    highTemp.forEach((el, i) => {
      el.textContent = `${summary[i].tempmax}°`;
    });

    // Render icons
    const cardEls = document.querySelectorAll(".card");
    cardEls.forEach((cardEl, i) => {
      const cond = summary[i].conditions.toLowerCase();
      let iconPath;

      if (cond.includes("rain")) {
        iconPath = rainIcon;
      } else if (cond.includes("clear")) {
        iconPath = sunnyIcon;
      } else if (cond.includes("cloud")) {
        iconPath = cloudyIcon;
      } else {
        iconPath = sunnyIcon;
      }

      const imgEl = cardEl.querySelector(".card-img");
      if (imgEl) {
        imgEl.src = iconPath;
        imgEl.alt = summary[i].conditions; // optional: set alt text
      }
    });

    // Persist last location
    localStorage.setItem("lastLocation", searchValue);
  } catch (error) {
    console.log(`Oh oh ${error.message}`);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("lastLocation");
  if (saved) {
    input.value = saved;
    searchBtn.click();
  }
});
