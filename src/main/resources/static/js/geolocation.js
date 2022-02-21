function initMap(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  geocodeLatLng(position.coords.latitude, position.coords.longitude);
}

function geocodeLatLng(lat, lng) {
  const geocoder = new google.maps.Geocoder();  
  
  const latlng = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };

  geocoder
    .geocode({ location: latlng })
    .then((response) => {
      if (response.results[0]) {

        document.getElementById("address").value= (response.results[0].formatted_address)
                
      } else {
        alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}