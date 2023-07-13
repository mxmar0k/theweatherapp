//just to see if it works
console.log("hello world");

const searchButton = document.getElementById("search-button");
const userInput = document.getElementById("user-input");


//we added this function to get the weather details of the city we logged 

function getWeatherDetails(latitude, longitude) {
    const apiKey = '';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to fetch weather details.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Weather Details:', data);
        return data;
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
  

//we have a function to get coordinates for a city
// the url has parameters to limit to one the response
// there is a const with the api so it logs with the url
//the function sends a fetch and receives the json data to extract the lat
// and lon, if they are not found it throws an error
function getCoordinates(city) {
  const apiKey = '';
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      // just to check what it responses
      console.log('API Response:', data);
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: lat, longitude: lon };
      } else {
        throw new Error('Coordinates not found for the given city.');
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

//this is an event listener added to the search button, it triggers
// the coordinates function and trims the value of the user input to use it in city
searchButton.addEventListener('click', function() {
  const city = userInput.value.trim();

  if (city === '') {
    console.log('Please enter a valid city name.');
    return;
  }

  getCoordinates(city)
    .then(coordinates => {
      console.log('Coordinates:', coordinates);
      getWeatherDetails(coordinates.latitude, coordinates.longitude);
    });

});
