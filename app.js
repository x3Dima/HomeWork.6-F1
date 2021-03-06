const outputBlock = document.querySelector(".info");
// Функция сщздает обьект с координатами пользователя
let getData = (latitude, longitude) => {
  return {
    currLatitude: latitude,
    currLongitude: longitude,
  };
};

// Основная функция
navigator.geolocation.getCurrentPosition((answer) => {
  let URL = `
      https://image.maps.api.here.com/mia/1.6/mapview?app_id=oZmMWRV4tAjQmgkxBvF0&app_code=x5pKHqifhw1mnS_zBTIFsA&z=14&w=600&h=600&c=${answer.coords.latitude},${answer.coords.longitude}
      `;
  mapPlace.src = URL;

  let loc = getData(answer.coords.latitude, answer.coords.longitude);

  async function getTerminal() {
    let URL = "https://courses.dp.ua/atm/";
    let answer = await fetch(URL);
    answer = await answer.json();
    let devices = answer.devices;
    const arrLength = 5;

    devices
      .map((device) => {
        let result = getDistanceFromLoc(
          loc.currLatitude,
          loc.currLongitude,
          device.longitude,
          device.latitude
        );
        device.distance = result;
        return device;
      })
      .sort((a, b) => a.distance - b.distance)
      .filter((device, i) => i < arrLength)
      .forEach((device) => {
        outputBlock.innerHTML += `<div class="address">${
          device.fullAddressUa
        }, растояние до пользователя ${Math.round(
          device.distance * 1000
        )}m. </div>`;
      });
  }
  getTerminal();
});
// Функция с формулой расчета растояния по координатам
const getDistanceFromLoc = (lat1, long1, lat2, long2) => {
  const R = 6371; //radius of the earth in km
  let dLat = deg2rad(lat2 - lat1);
  let dLong = deg2rad(long2 - long1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km
  return d;
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
