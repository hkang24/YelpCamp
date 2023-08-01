mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "camp-map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: campground.features.geometry.coordinates, // starting position [lng, lat]
  zoom: 6, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(campground.features.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h5>${campground.features.title}</h5><p>${campground.features.location}</p>`
        )
    )
    .addTo(map);