// const { coordinates } = require("@maptiler/client");

// const { coordinates } = require("@maptiler/client");

// const { coordinates } = require("@maptiler/client");

   
  //   
  maptilersdk.config.apiKey = mapToken;

  // 📍 coordinates from backend
  const coordinates = listingData.geometry.coordinates;
  
  console.log("Coordinates:", coordinates);
  
  // 🗺️ Map create
  const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: listingData.geometry.coordinates,
    zoom: 10,
  });
  
  // 📍 Marker add
  const marker = new maptilersdk.Marker({ color: "red" })
    .setLngLat(listingData.geometry.coordinates)
    .setPopup(
      new maptilersdk.Popup({ offset: 25}).setHTML(
        `<h4>${listing.title}</h4><p>Exact Location will be provided afterbooking</p>`
      )
    )
    .addTo(map);  
    
  