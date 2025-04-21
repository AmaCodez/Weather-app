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
// function extractWeather(data) {
//   return {
//     conditions: data.currentConditions.conditions,
//     temp: data.currentConditions.temp,
//     tempmax: data.days[0].tempmax,
//     tempmin: data.days[0].tempmin,
//   };
// }

function extractWeather(data) {
  return [
    {
      conditions: data.days[0].conditions,
      temp: data.days[0].temp,
      tempmax: data.days[0].tempmax,
      tempmin: data.days[0].tempmin,
    },
    {
      conditions: data.days[1].conditions,
      temp: data.days[1].temp,
      tempmax: data.days[1].tempmax,
      tempmin: data.days[1].tempmin,
    },
    {
      conditions: data.days[2].conditions,
      temp: data.days[2].temp,
      tempmax: data.days[2].tempmax,
      tempmin: data.days[2].tempmin,
    },
  ];
}

searchBtn.addEventListener("click", async () => {
  // For extractor to get the actual data and not a promise
  try {
    const searchValue = input.value;
    const rawData = await getWeather(searchValue);
    const summary = extractWeather(rawData);
    console.log(`Weather summary:`, summary);
  } catch (error) {
    console.log(`Oh oh ${error.message}`);
  }
});
