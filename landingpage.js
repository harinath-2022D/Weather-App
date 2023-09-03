const latiSpan = document.getElementById("lati");
const longSpan = document.getElementById("long");
const layout = document.getElementById("layout");
const key = "0419df165a73517197e9d6dbf7279119";

const location1 = document.getElementById("location");
const windspeed = document.getElementById("windspeed");
const humidity = document.getElementById("humidity");
const timezone = document.getElementById("timezone");
const pressure = document.getElementById("pressure");
const direction = document.getElementById("direction");
const visibility = document.getElementById("visibility");
const feelslike = document.getElementById("feelslike");


function found(latitude, longitude) {
    latiSpan.innerText = latitude;
    longSpan.innerText = longitude;
    const mapUrl = `https://maps.google.com/maps?q=${latitude}, ${longitude}&z=15&output=embed`;
    layout.src = mapUrl;
    weatherDetails(latitude,longitude);
}

async function getLocation() {
    try {
        const premission = window.confirm("site requires location access");
        if (premission) {
            const position = await new Promise((success, Fail) => {
                navigator.geolocation.getCurrentPosition(success, Fail);
            });
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            found(latitude, longitude);
        } else {
            alert("permission denied");
        }
    } catch (error) {
        console.error("Error getting location:", error);
    }
}

function converttokm(value) {
    return value / 1000;
}
function convertHPAtoATM(value) {
    return parseInt(value * 0.000987);
}
function convertToTimezone(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const plus = "+";
    const hoursString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');
    if (seconds < 0) {
        //console.log(`${minus}${hoursString}:${minutesString}`);
        return `${hoursString}:${minutesString}`;
    }
    else {
        return `${plus}${hoursString}:${minutesString}`;
    }
}

function fahrenheitToCelsius(fahrenheit) {
    const celsius = (fahrenheit - 32) * 5 / 9;
    console.log(fahrenheit,celsius);
    return parseInt(celsius);
  }


function renderIntoUI(response) {
    location1.innerText = response.name;
    windspeed.innerText = response.wind.speed + "kmph";
    humidity.innerText = response.main.humidity;
    timezone.innerText = "GMT "+convertToTimezone(response.timezone);
    pressure.innerText = convertHPAtoATM(response.main.pressure) + " atm"; // api giving wrong data
    direction.innerText = response.wind.deg; // api giving direction format
    visibility.innerText = converttokm(response.visibility) + " km";
    feelslike.innerText = fahrenheitToCelsius(response.main.feels_like)+"C"; // api giving wrong temp
}
async function weatherDetails(latitude,longitude) {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`);
    const response = await result.json();
    console.log(response);
    console.log(response.name,
        response.wind.speed,
        response.main.humidity,
        response.timezone,
        response.main.pressure,
        response.wind.deg,
        response.visibility,
        response.main.feels_like);
    renderIntoUI(response);
}
getLocation()

/*
{coord: {…}, weather: Array(1), base: 'stations', main: {…}, visibility: 10000, …}
base
: 
"stations"
clouds
: 
all
: 
0
[[Prototype]]
: 
Object
cod
: 
200
coord
: 
lat
: 
33.44
lon
: 
-94.04
[[Prototype]]
: 
Object
dt
: 
1693733729
id
: 
4133367
main
: 
feels_like
: 
297.68
humidity
: 
83
pressure
: 
1015
temp
: 
297.07
temp_max
: 
297.57
temp_min
: 
296.48
[[Prototype]]
: 
Object
name
: 
"Texarkana"
sys
: 
country
: 
"US"
id
: 
62880
sunrise
: 
1693741898
sunset
: 
1693787998
type
: 
2
[[Prototype]]
: 
Object
timezone
: 
-18000
visibility
: 
10000
weather
: 
Array(1)
0
: 
{id: 800, main: 'Clear', description: 'clear sky', icon: '01n'}
length
: 
1
[[Prototype]]
: 
Array(0)
wind
: 
deg
: 
100
speed
: 
2.06
[[Prototype]]
: 
Object
[[Prototype]]
: 
Object
*/

