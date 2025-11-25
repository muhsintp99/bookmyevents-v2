// js/Place/getplace.js

const GOOGLE_KEY = "AIzaSyAfLUm1kPmeMkHh1Hr5nbgNpQJOsNa7B78";

// Run automatically
getLocation();

function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(showPosition, showError);
}

function showPosition(pos) {
  let lat = pos.coords.latitude;
  let lon = pos.coords.longitude;

  // Save in localStorage
  localStorage.setItem("lat", lat);
  localStorage.setItem("lon", lon);

  console.log("Latitude:", lat);
  console.log("Longitude:", lon);

  getAddress(lat, lon);
}

function showError(error) {
  alert("Location Error: " + error.message);
}

function getAddress(lat, lon) {
  const url =
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("FULL ADDRESS:", data);

      if (data.status === "OK") {
        const result = data.results[0];

        let city = "";
        let area = "";
        let country = "";

        result.address_components.forEach(a => {
          if (a.types.includes("locality")) city = a.long_name;
          if (a.types.includes("sublocality") || a.types.includes("sublocality_level_1")) area = a.long_name;
          if (a.types.includes("country")) country = a.long_name;
        });

        // Display in UI
        // document.getElementById("location-city").innerText = city || "Unknown";
        document.getElementById("location-area").innerText = `${city}, ${country}` || "can not detect";

        // Save in localStorage
        localStorage.setItem("city", city);
        localStorage.setItem("area", area);
        localStorage.setItem("country", country);

      } else {
        document.getElementById("location-city").innerText = "Not found";
      }
    })
    .catch(err => console.error(err));
}
