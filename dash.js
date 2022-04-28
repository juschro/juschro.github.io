//GLOBALS
var addedspots = [];
var dbspots = [];
//GLOBALS
// Zeile 1 in TAB - DATE
let date = [];
let weekday;
let weekdays = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];
for (let i = 0; i < 5; i++) {
  date.push(
    new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000).toLocaleString(
      "de-de",
      { day: "numeric", month: "long", year: "numeric" }
    )
  );
  weekday =
    weekdays[new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000).getDay()];
  document.getElementsByClassName("column" + (2 + i))[0].innerHTML =
    weekday + "<br>" + date[i];
}

// SPOT-ANALYSE API IST MAIN
function api(spotapi, startValue, stopValue, spotname, wantedwind, offset) {
  $.ajax({
    url: spotapi,
    success: function (data) {
      let { time, windspeed, winddeg } = getwind(data);
      let { spotdeg, startValueout, stopValueout, stepamount } = getspotdeg(
        startValue,
        stopValue,
        offset
      );
      let validspot = iswindgood(time, windspeed, winddeg, spotdeg, wantedwind);
      let validspotime = istimeofvalidspotvalid(validspot);
      markupdash(validspotime, spotname);
      console.log(
        spotname +
          "\n" +
          "WantedWind:" +
          wantedwind +
          "__Offset:" +
          offset +
          "__StartValueIn:" +
          startValue +
          "__StopValueIn:" +
          stopValue +
          "__StartValueOut:" +
          startValueout +
          "__StopValueOut:" +
          stopValueout +
          "__Steps:" +
          stepamount +
          "\n" +
          validspotime +
          "\n\n"
      );
    },
  });
}

//GetWind
function getwind(data) {
  let windspeed = [];
  let winddeg = [];
  let time = [];
  for (let i = 0; i < data.list.length; i++) {
    windspeed.push(data.list[i].wind.speed * 1.94384);
    winddeg.push(data.list[i].wind.deg);
    time.push(data.list[i].dt_txt);
  }
  return { time, windspeed, winddeg };
}

//GetSpotDeg
function getspotdeg(startValue, stopValue, offset) {
  let spotdeg = [];
  let stepamount;
  let after360 = 1;
  let startValueout;
  let stopValueout;
  if (startValue < stopValue) {
    stepamount = stopValue - startValue;
  } else if (startValue > stopValue) {
    stepamount = 360 - startValue + stopValue;
  }
  stepamount = stepamount + 2 * offset;
  if (stepamount > 360) {
    startValue = 0;
    stopValue = 360;
  } else {
    startValue = startValue - offset;
    stopValue = stopValue + offset;
    if (startValue < 0) {
      startValue = startValue + 360;
    }
    if (stopValue > 360) {
      stopValue = stopValue - 360;
    }
  }
  startValueout = startValue;
  stopValueout = stopValue;
  if (startValue < stopValue) {
    stepamount = stopValue - startValue;
  } else if (startValue > stopValue) {
    stepamount = 360 - startValue + stopValue;
  }
  for (let i = 0; i <= stepamount; i++) {
    if (startValue + i <= 360) {
      spotdeg.push(startValue + i);
    } else {
      spotdeg.push(after360);
      after360++;
    }
  }
  return { spotdeg, startValueout, stopValueout, stepamount };
}

//IsWindGood
function iswindgood(time, windspeed, winddeg, spotdeg, wantedwind) {
  let validspot = [];
  for (let i = 0; i < windspeed.length; i++) {
    if (windspeed[i] >= wantedwind && spotdeg.includes(winddeg[i])) {
      validspot.push(time[i]);
    }
  }
  return validspot;
}

//IsTimeOfValidSpotValid
function istimeofvalidspotvalid(validspot) {
  let validspotime = [];
  for (let i = 0; i < validspot.length; i++) {
    if (
      parseInt(validspot[i].substring(10, 13)) > 8 &&
      parseInt(validspot[i].substring(10, 13)) < 20
    ) {
      validspotime.push(validspot[i]);
    }
  }
  return validspotime;
}

//MarkupDash(v2)
function markupdash(validspotime, spotname) {
  reseticons(spotname);
  let day1times = [];
  let day2times = [];
  let day3times = [];
  let day4times = [];
  let day5times = [];
  let day1check = 0;
  let day2check = 0;
  let day3check = 0;
  let day4check = 0;
  let day5check = 0;
  for (let i = 0; i < validspotime.length; i++) {
    if (
      parseInt(validspotime[i].substring(8, 11)) ==
      new Date(new Date().getTime() + 0 * 24 * 60 * 60 * 1000).toLocaleString(
        "de-de",
        {
          day: "numeric",
        }
      )
    ) {
      day1times.push(validspotime[i].substring(10, 13));
      day1check = 1;
    } else if (
      parseInt(validspotime[i].substring(8, 11)) ==
      new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleString(
        "de-de",
        {
          day: "numeric",
        }
      )
    ) {
      day2times.push(validspotime[i].substring(10, 13));
      day2check = 1;
    } else if (
      parseInt(validspotime[i].substring(8, 11)) ==
      new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleString(
        "de-de",
        {
          day: "numeric",
        }
      )
    ) {
      day3times.push(validspotime[i].substring(10, 13));
      day3check = 1;
    } else if (
      parseInt(validspotime[i].substring(8, 11)) ==
      new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleString(
        "de-de",
        {
          day: "numeric",
        }
      )
    ) {
      day4times.push(validspotime[i].substring(10, 13));
      day4check = 1;
    } else if (
      parseInt(validspotime[i].substring(8, 11)) ==
      new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleString(
        "de-de",
        {
          day: "numeric",
        }
      )
    ) {
      day5times.push(validspotime[i].substring(10, 13));
      day5check = 1;
    }
  }
  if (day1check == 1) {
    dashchange(spotname, 0, day1times);
  }
  if (day2check == 1) {
    dashchange(spotname, 1, day2times);
  }
  if (day3check == 1) {
    dashchange(spotname, 2, day3times);
  }
  if (day4check == 1) {
    dashchange(spotname, 3, day4times);
  }
  if (day5check == 1) {
    dashchange(spotname, 4, day5times);
  }
}

//DashChange(v2)
function dashchange(spotname, dayi, daytimes) {
  console.log(
    "Spot: " + spotname + " Tag: " + (dayi + 1) + " Time: " + daytimes
  );
  let titletxt = "empty";
  for (let i = 0; i < daytimes.length; i++) {
    if (titletxt == "empty" && i == daytimes.length - 1) {
      titletxt = parseInt(daytimes[i]) + ":00";
    } else if (titletxt == "empty" && i != daytimes.length - 1) {
      titletxt = parseInt(daytimes[i]) + ":00|";
    } else if (i != daytimes.length - 1) {
      titletxt = titletxt + parseInt(daytimes[i]) + ":00|";
    } else {
      titletxt = titletxt + parseInt(daytimes[i]) + ":00";
    }
  }
  document.getElementsByClassName(spotname)[
    dayi
  ].innerHTML = `<i title=${titletxt} class="fa-solid fa-square-check"></i>`;
  let icons = document.getElementsByClassName(spotname);
  icons[dayi].querySelector("i").style.backgroundColor = "#080";
}

//ResetIcos (MarkupDash)
function reseticons(spotname) {
  for (let i = 0; i < 5; i++) {
    document.getElementsByClassName(spotname)[i].innerHTML =
      '<i class="fa-solid fa-square-xmark"></i>';
  }
}

/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////Main Api-Run/////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
//ApplyBtn
const applyBtn = document.getElementById("applybtn");
const kntSlider = document.getElementById("knotslider");
const degSlider = document.getElementById("degslider");
applyBtn.addEventListener("click", function (e) {
  const wantedwind = parseInt(kntSlider.value);
  const offset = parseInt(degSlider.value);
  kntSlider.click();
  degSlider.click();
  console.log("WantedWind: " + wantedwind + " knts");
  console.log("Offset: " + offset + " deg");
  api(
    "https://api.openweathermap.org/data/2.5/forecast?lat=53.0667&lon=5.3333&appid=70fee14c01a4bf3b267db22df5a9f585",
    90,
    260,
    "Kornwerderzand",
    wantedwind,
    offset
  );
  api(
    "https://api.openweathermap.org/data/2.5/forecast?lat=52.7627&lon=5.1076&appid=70fee14c01a4bf3b267db22df5a9f585",
    0,
    90,
    "Medemblik",
    wantedwind,
    offset
  );
  api(
    "https://api.openweathermap.org/data/2.5/forecast?lat=52.2496&lon=4.4322&appid=70fee14c01a4bf3b267db22df5a9f585",
    200,
    20,
    "NoordwijkaanZee",
    wantedwind,
    offset
  );
  api(
    "https://api.openweathermap.org/data/2.5/forecast?lat=51.8701&lon=4.0494&appid=70fee14c01a4bf3b267db22df5a9f585",
    170,
    310,
    "Rockanje",
    wantedwind,
    offset
  );
  api(
    "https://api.openweathermap.org/data/2.5/forecast?lat=51.7625&lon=3.8540&appid=70fee14c01a4bf3b267db22df5a9f585",
    230,
    10,
    "Brouwersdam",
    wantedwind,
    offset
  );
  api(
    "https://api.openweathermap.org/data/2.5/forecast?lat=51.6765&lon=4.1274&appid=70fee14c01a4bf3b267db22df5a9f585",
    0,
    360,
    "Grevelingendam",
    wantedwind,
    offset
  );
  for (let i = 0; i < addedspots.length; i++) {
    api(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${addedspots[i].lat}&lon=${addedspots[i].long}&appid=70fee14c01a4bf3b267db22df5a9f585`,
      0,
      360,
      addedspots[i].name,
      wantedwind,
      offset
    );
  }
});
applyBtn.click();
pulldb();

const resetBtn = document.getElementById("resetbtn");
resetBtn.addEventListener("click", function (e) {
  kntSlider.value = "14";
  degSlider.value = "0";
  applyBtn.click();
});

const kntLeft = document.getElementById("kntleft");
kntLeft.addEventListener("click", function (e) {
  kntSlider.value = parseInt(kntSlider.value) - 1;
  kntSlider.click();
});

const kntRight = document.getElementById("kntright");
kntRight.addEventListener("click", function (e) {
  kntSlider.value = parseInt(kntSlider.value) + 1;
  kntSlider.click();
});

const degLeft = document.getElementById("degleft");
degLeft.addEventListener("click", function (e) {
  degSlider.value = parseInt(degSlider.value) - 1;
  degSlider.click();
});

const degRight = document.getElementById("degright");
degRight.addEventListener("click", function (e) {
  degSlider.value = parseInt(degSlider.value) + 1;
  degSlider.click();
});

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////AUTO-TEST///////////////////////////////////////////
//////////////////////////////////////AUTO-TEST///////////////////////////////////////////
//////////////////////////////////////AUTO-TEST///////////////////////////////////////////
//////////////////////////////////////AUTO-TEST///////////////////////////////////////////
//////////////////////////////////////AUTO-TEST///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// POSITIONSTACK API
// async function getlatlong(spotname) {
//   const result = await $.ajax({
//     url: "http://api.positionstack.com/v1/forward",
//     data: {
//       access_key: "1163481f5863d5796a731c9563d169bc",
//       query: spotname,
//       limit: 1,
//     },
//   });
//   return result;
// }
//
// in getlatlong else: lat = result.data[0].latitude;
//                     long = result.data[0].longitude;
//

// OPEN API
async function getlatlong(spotname) {
  const result = await $.ajax({
    url: "https://api.opencagedata.com/geocode/v1/json",
    data: {
      q: spotname,
      key: "6a270fb3a4a246a6b3cf2cad984633a0",
      limit: 1,
    },
  });
  return result;
}

const addBtn = document.getElementById("addbtn");
addBtn.addEventListener("click", async function (e) {
  const spotname = document.getElementById("name").value;
  let lat = 0;
  let long = 0;
  for (let i = 0; i < dbspots.length; i++) {
    if (dbspots[i].name == spotname) {
      lat = dbspots[i].lat;
      long = dbspots[i].long;
      console.log("Bereits in DB");
      break;
    } else if (i == dbspots.length - 1) {
      const result = await getlatlong(spotname);
      lat = result.results[0].geometry.lat;
      long = result.results[0].geometry.lng;
      pushdb({
        name: spotname,
        lat: lat,
        long: long,
      });
    }
  }
  addedspots.push({
    name: spotname,
    lat: lat,
    long: long,
  });
  createNewRow(spotname, lat, long);
  applyBtn.click();
});

function createNewRow(spotname, lat, long) {
  document
    .getElementById("tablebody")
    .insertAdjacentHTML(
      "beforeend",
      `<tr><td class="column1"><div class="spots"><a href="https://www.google.de/maps?q=${lat},${long}"target="_blank">${spotname}</a><div class="logoimages"><a href="https://www.windguru.cz/?gn=2755340"target="_blank"><img src="images/windguru.png"class="windguru"alt="Windguru"/></a><a href="https://de.windfinder.com/forecast/grevelingenmeer_grevelingendam"target="_blank"><img src="images/windfinder.png"class="windfinder"alt="Windguru"/></a></div></div></td><td class="column2 ${spotname}"><i class="fa-solid fa-square-xmark"></i></td><td class="column3 ${spotname}"><i class="fa-solid fa-square-xmark"></i></td><td class="column4 ${spotname}"><i class="fa-solid fa-square-xmark"></i></td><td class="column5 ${spotname}"><i class="fa-solid fa-square-xmark"></i></td><td class="column6 ${spotname}"><i class="fa-solid fa-square-xmark"></i></td></tr>`
    );
}

function getslidervalue() {
  const wantedwind = parseInt(kntSlider.value);
  const offset = parseInt(degSlider.value);
  kntSlider.click();
  degSlider.click();
  console.log("WantedWind: " + wantedwind + " knts");
  console.log("Offset: " + offset + " deg");
  return { wantedwind, offset };
}

///////////////////////////////FIRE-DB//////////////////////////////////////
///////////////////////////////FIRE-DB//////////////////////////////////////
///////////////////////////////FIRE-DB//////////////////////////////////////
///////////////////////////////FIRE-DB//////////////////////////////////////
///////////////////////////////FIRE-DB//////////////////////////////////////
///////////////////////////////FIRE-DB//////////////////////////////////////
///////////////////////////////FIRE-DB//////////////////////////////////////

function pushdb(data) {
  $.ajax({
    url: "https://spottydb-e436e-default-rtdb.europe-west1.firebasedatabase.app/spotnames.json",
    type: "POST",
    data: JSON.stringify(data),
    success: function (data) {
      console.log(JSON.stringify(data));
    },
    error: function () {
      alert("Cannot get data");
    },
  });
}

function pulldb() {
  $.ajax({
    url: "https://spottydb-e436e-default-rtdb.europe-west1.firebasedatabase.app/spotnames.json",
    type: "GET",
    success: function (data) {
      for (let i = 0; i < Object.keys(data).length; i++) {
        dbspots.push({
          name: data[Object.keys(data)[i]].name,
          lat: data[Object.keys(data)[i]].lat,
          long: data[Object.keys(data)[i]].long,
        });
      }
    },
    error: function () {
      alert("Cannot get data");
    },
  });
}

// Export DB (Download)
// function exportToJsonFile(jsonData) {
//   let dataStr = JSON.stringify(jsonData);
//   let dataUri =
//     "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

//   let exportFileDefaultName = "data.json";

//   let linkElement = document.createElement("a");
//   linkElement.setAttribute("href", dataUri);
//   linkElement.setAttribute("download", exportFileDefaultName);
//   linkElement.click();
// }

//////////////////////////////////LOGIN//////////////////////////////////
//////////////////////////////////LOGIN//////////////////////////////////
//////////////////////////////////LOGIN//////////////////////////////////
//////////////////////////////////LOGIN//////////////////////////////////
//////////////////////////////////LOGIN//////////////////////////////////

const loginBtn = document.getElementById("innerloginbtn");
loginBtn.addEventListener("click", function (e) {
  const username = document.getElementById("logintext").value;
  const password = document.getElementById("passwordtext").value;
  pushuser({
    username: username,
    password: password,
  });
  document.getElementById("id01").style.display = "none";
});

function pushuser(data) {
  $.ajax({
    url: "https://spottydb-e436e-default-rtdb.europe-west1.firebasedatabase.app/user.json",
    type: "POST",
    data: JSON.stringify(data),
    success: function (data) {
      console.log(JSON.stringify(data));
    },
    error: function () {
      alert("Cannot get data");
    },
  });
}
