//get distance between two points in meters

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}


export const getDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371000; // Radius of the Earth in meters

    // Convert latitude and longitude from degrees to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    // Calculate differences between latitudes and longitudes
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Haversine formula
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate distance
    const distance = earthRadius * c;
    return distance;
};




