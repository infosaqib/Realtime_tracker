const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    })
}

const map = L.map("map").setView([0, 0], 6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Saqib"
}).addTo(map);

const markers = {};

socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;
    if (latitude !== 0 && longitude !== 0) {  // Check if coordinates are valid
        map.setView([latitude, longitude], 16);
        if (markers[id]) {
            markers[id].setLatLng([latitude, longitude]);
        } else {
            markers[id] = L.marker([latitude, longitude]).addTo(map);
        }
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})

// if (navigator.geolocation) {
//     navigator.geolocation.watchPosition(
//         position => {
//             const { latitude, longitude } = position.coords;
//             socket.emit("send-location", { latitude, longitude });
//         },
//         (error) => {
//             let errorMessage;
//             switch(error.code) {
//                 case error.PERMISSION_DENIED:
//                     errorMessage = "User denied the request for Geolocation.";
//                     break;
//                 case error.POSITION_UNAVAILABLE:
//                     errorMessage = "Location information is unavailable.";
//                     break;
//                 case error.TIMEOUT:
//                     errorMessage = "The request to get user location timed out.";
//                     break;
//                 case error.UNKNOWN_ERROR:
//                     errorMessage = "An unknown error occurred.";
//                     break;
//             }
//             console.error("Geolocation error:", errorMessage);
//             alert("Error getting location: " + errorMessage);
//         },
//         {
//             enableHighAccuracy: true,
//             timeout: 10000,
//             maximumAge: 0
//         }
//     );
// } else {
//     console.error("Geolocation is not supported by this browser.");
//     alert("Geolocation is not supported by your browser. Please use a modern browser with geolocation support.");
// }