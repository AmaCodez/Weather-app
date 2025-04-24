import "./styles.css";

const input = document.querySelector("input");
const searchBtn = document.querySelector(".searchbtn");

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
      day,
      conditions: day.conditions,
      temp: day.temp,
      tempmin: day.tempmin,
      tempmax: day.tempmax,
    };
  });
}

searchBtn.addEventListener("click", async () => {
  // For extractor to get the actual data and not a promise
  try {
    const searchValue = input.value;
    const rawData = await getWeather(searchValue);
    const summary = extractWeather(rawData);
    const locationSite = rawData.resolvedAddress;
    console.log(`Weather summary:`, summary);
    console.log(locationSite);
  } catch (error) {
    console.log(`Oh oh ${error.message}`);
  }
});
