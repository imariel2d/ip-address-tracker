// DOM - search
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');

// DOM - data
const ipParagraph = document.getElementById('data-ip');
const locationParagraph = document.getElementById('data-location');
const timezoneParagraph = document.getElementById('data-timezone');
const ispParagraph = document.getElementById('data-isp');

const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW1hcmllbDJkIiwiYSI6ImNreDJmMGJidTE5NzYydm1ybGE4ZGp3ejEifQ.vDt1vkfC0Nv3aE13xf4SYQ', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiaW1hcmllbDJkIiwiYSI6ImNreDJmMGJidTE5NzYydm1ybGE4ZGp3ejEifQ.vDt1vkfC0Nv3aE13xf4SYQ'
}).addTo(map);

let marker = L.marker([51.5, -0.09]).addTo(map);


/**
 *
 * @param ip {string}
 * @param location {string}
 * @param timezone {string}
 * @param isp {string}
 */
const updateIPTracker = ({
  ip,
  location,
  timezone,
  isp,
}) => {
  ipParagraph.innerText = ip;
  locationParagraph.innerText = location;
  timezoneParagraph.innerText = timezone;
  ispParagraph.innerText = isp;
};

/**
 * @param {number} lat
 * @param {number} lng
 */
const setUpMap = ({ lat, lng }) => {
  map.removeLayer(marker);

  marker = L.marker([lat, lng]).addTo(map);
  map.panTo(new L.LatLng(lat, lng));
};

/**
 * This function should get the information from IP Geolocation API
 * @function
 * @param {string} ip - Receives an IP or valid Domain
 */
const searchForLocation = (ip) => {
  fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_aVyUOfwVf2OlMlVHpgfluZlf8uuEt&ipAddress=${ip}`)
    .then((res) => res.json())
    .then((data) => {
      const { ip, isp, location } = data
      const { timezone, city, region, postalCode, lat, lng } = location;

      const finalLocation = `${city}, ${region} ${postalCode}`

      updateIPTracker({
        ip,
        isp,
        timezone,
        location: finalLocation,
      });
      setUpMap({ lat, lng });
    })
    .catch((err) => console.log(err));
};


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const { value } = input;
  searchForLocation(value);
});
