const ctx = document.getElementById("myChart").getContext("2d");
const continent = document.querySelectorAll(".continent");
const statusCorona = document.querySelectorAll(".status");
const outputCountries = document.querySelector("#outputCountries");
const containerStatusButtons = document.querySelector(
  ".containerStatusButtons"
);
const spinner = document.querySelector(".lds-spinner");
const lastUpdated = document.querySelector(".top");

let world = {
  country: [],
  confirmed: [],
  deaths: [],
  recovered: [],
  critical: [],
  code: [],
  date: [],
};
let region = {
  country: [],
  confirmed: [],
  deaths: [],
  recovered: [],
  critical: [],
};

const stateContinent = {
  asia: "Asia",
  europe: "Europe",
  africa: "Africa",
  americas: "Americas",
  world: "World",
};
const stateStatus = {
  confirmed: "Confirmed",
  deaths: "Deaths",
  recovered: "Recovered",
  critical: "Critical",
};
let chosenContinent = "";
let chosenStatus = "";
let myChart = new Chart(ctx);
let isNewSpinner = false;
main();

function main() {
  getCoronaWorldData();
  getCoronaRegionData(stateContinent.asia);
  buttonsEventListener();
}

function selectBlue() {
  boxTools.forEach((tool) => {
    tool.addEventListener("click", () => {
      boxTools[0].style.backgroundColor = "";
      boxTools[1].style.backgroundColor = "";
      boxTools[2].style.backgroundColor = "";
      tool.style.backgroundColor = "blue";
    });
  });
}
function buttonsEventListener() {
  for (let i = 0; i < continent.length; i++) {
    continent[i].addEventListener("click", (item) => {
      chosenContinent = item.target.innerText;
      containerStatusButtons.style.display = "block";

      switch (chosenContinent) {
        case stateContinent.asia:
          createDropDown(region);
          chartIt(region.country, region.confirmed, "confirmed");
          chartCountry(region);
          continent[0].style.backgroundColor = "blue";
          continent[4].style.backgroundColor = "";
          break;
        case stateContinent.europe:
          break;
        case stateContinent.africa:
          break;
        case stateContinent.americas:
          break;
        case stateContinent.world:
          continent[4].style.backgroundColor = "blue";
          continent[0].style.backgroundColor = "";
          createDropDown(world);
          chartIt(world.country, world.confirmed, "confirmed");
          chartCountry(world);
          break;
      }
    });
  }

  for (let i = 0; i < statusCorona.length; i++) {
    statusCorona[i].addEventListener("click", (item) => {
      chosenStatus = item.target.innerText;
      switch (chosenStatus) {
        case stateStatus.confirmed:
          if (chosenContinent === stateContinent.world) {
            chartIt(world.country, world.confirmed, chosenStatus.toLowerCase());
          } else if (chosenContinent === stateContinent.asia) {
            chartIt(
              region.country,
              region.confirmed,
              chosenStatus.toLowerCase()
            );
          }
          break;
        case stateStatus.deaths:
          if (chosenContinent === stateContinent.world) {
            chartIt(world.country, world.deaths, chosenStatus.toLowerCase());
          } else if (chosenContinent === stateContinent.asia) {
            chartIt(region.country, region.deaths, chosenStatus.toLowerCase());
          }
          break;
        case stateStatus.recovered:
          if (chosenContinent === stateContinent.world) {
            chartIt(world.country, world.recovered, chosenStatus.toLowerCase());
          } else if (chosenContinent === stateContinent.asia) {
            chartIt(
              region.country,
              region.recovered,
              chosenStatus.toLowerCase()
            );
          }
          break;
        case stateStatus.critical:
          if (chosenContinent === stateContinent.world) {
            chartIt(world.country, world.critical, chosenStatus.toLowerCase());
          } else if (chosenContinent === stateContinent.asia) {
            chartIt(
              region.country,
              region.critical,
              chosenStatus.toLowerCase()
            );
          }
          break;
      }
    });
  }
}
function createDropDown(object) {
  outputCountries.innerHTML = "";
  const select = document.createElement("select");

  for (const val of object.country) {
    const option = document.createElement("option");
    option.value = val;
    option.text = val.charAt(0).toUpperCase() + val.slice(1);
    select.appendChild(option);
  }
  const label = document.createElement("label");
  label.innerHTML = "Choose Country: ";

  document
    .getElementById("outputCountries")
    .appendChild(label)
    .appendChild(select);
}

function chartCountry(continent) {
  outputCountries.addEventListener("change", (selectedCountry) => {
    const byX = ["Confirmed", "Deaths", "Recovered", "Critical"];
    const index = continent.country.indexOf(selectedCountry.target.value);
    const byY = [
      continent.confirmed[index],
      continent.deaths[index],
      continent.recovered[index],
      continent.critical[index],
    ];
    chartIt(byX, byY, selectedCountry.target.value);
  });
}

async function getCoronaWorldData() {
  world = {
    country: [],
    confirmed: [],
    deaths: [],
    recovered: [],
    critical: [],
    code: [],
    date: [],
  };

  try {
    const response = await (
      await fetch(`https://corona-api.com/countries`)
    ).json();

    world.date = response.data[0].updated_at;
    response.data.forEach((country) => {
      world.country.push(country.name);
      world.confirmed.push(country.latest_data.confirmed);
      world.deaths.push(country.latest_data.deaths);
      world.recovered.push(country.latest_data.recovered);
      world.critical.push(country.latest_data.critical);
      world.code.push(country.code);
    });
  } catch (err) {
    console.error(err, "Not found");
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

async function getCoronaRegionData(continent) {
  await getCoronaWorldData();

  region = {
    country: [],
    confirmed: [],
    deaths: [],
    recovered: [],
    critical: [],
  };

  let selectedRegion = getKeyByValue(stateContinent, continent);
  let index = 0;
  try {
    const response = await (
      await fetch(
        `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${selectedRegion}`
      )
    ).json();

    response.forEach((country) => {
      index = world.code.indexOf(country.cca2);
      region.country.push(world.country[index]);
      region.confirmed.push(world.confirmed[index]);
      region.deaths.push(world.deaths[index]);
      region.recovered.push(world.recovered[index]);
      region.critical.push(world.critical[index]);
    });
  } catch (err) {
    console.error(err, "Not found");
  }
}

async function chartIt(xlabels, ylabels, label) {
  if (isNewSpinner) {
    spinner.style.display = "block";
  }
  await getCoronaWorldData();
  await getCoronaRegionData(stateContinent.asia);
  lastUpdated.innerHTML = "";
  lastUpdated.innerHTML += `Covid 19 data updated last at ${world.date
    .toString()
    .slice(0, 10)}`;
  spinner.style.display = "none";
  isNewSpinner = true;
  myChart.destroy();
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xlabels,
      datasets: [
        {
          label: `Covid 19 ${label}`,
          data: ylabels,
          fill: false,
          backgroundColor: ["rgba(34, 224, 113, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
