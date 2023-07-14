// just to see if it works
console.log("hello world");

const searchButton = document.getElementById("search-button");
const userInput = document.getElementById("user-input");

// this function retrieves the search history from local storage
function getSearchHistory() {
  const searchHistory = localStorage.getItem('searchHistory');
  return searchHistory ? JSON.parse(searchHistory) : [];
}

// this function saves the search history to our one and only local storage
function saveSearchHistory(history) {
  localStorage.setItem('searchHistory', JSON.stringify(history));
}

// we also need a function to update the search history and this is the cool one
//beacuse it adds an event listener to each city loged
// I also discovered that you can add clases here and it uses tailwind
//woooooooooow
function updateSearchHistoryUI(history) {
  const searchHistoryList = document.getElementById('search-history');
  searchHistoryList.innerHTML = '';

  history.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.classList.add(
        'border',
        'bg-white',
        'list-none',
        'rounded-sm',
        'px-3',
        'py-3',
        'cursor-pointer',
        'hover:text-white',
        'hover:bg-blue-600',
        'text-gray-800',
      );
    listItem.addEventListener('click', function() {
      getCoordinates(city)
        .then(coordinates => {
          console.log('Coordinates:', coordinates);
          userInput.value = city;
          getWeatherDetails(coordinates.latitude, coordinates.longitude);
        });
    });

    searchHistoryList.appendChild(listItem);
  });
}

// i added another function to add searched city to the history on our local storage
function addToSearchHistory(city) {
  const history = getSearchHistory();
  history.push(city);
  saveSearchHistory(history);
  updateSearchHistoryUI(history);
}

// finally we added load the history when the page..loads 
window.addEventListener('DOMContentLoaded', function() {
  const history = getSearchHistory();
  updateSearchHistoryUI(history);
});

// we added this function to get the weather details of the city we logged
// it used the latitude and longitude parameters we obtain further in this code
// once we have a successful response we parse it as json and then the fun begins
// i actually got it wrong the first time because it gave me the same day with a difference of 3 hours on each array
// so i had to change it to filter, we use forEach to go through the data with a unix timestamp, if there is a new entry for a different date, it creates a new one.
// the forecast contains one entry per day, with the date, temp, wind, humidity, and icon
// it also contains my tears with how much I have cried doing this
// i had to add a code to clear the current weather and prediction cards when the code loads
function getWeatherDetails(latitude, longitude) {
  const apiKey = '9a8b08fd63683cdb4192ebb6f7b26947';
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to fetch weather details.');
      }
      return response.json();
    })
    .then(data => {
      const filteredForecast = {};

      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();

        if (!filteredForecast[date]) {
          filteredForecast[date] = {
            date: new Date(item.dt * 1000),
            temperature: item.main.temp,
            wind: item.wind.speed,
            humidity: item.main.humidity,
            icon: item.weather[0].icon
          };
        }
      });

      console.log('Filtered Forecast:', Object.values(filteredForecast));

      // i added 2 const for current and forecast weathers, why? because i was going crazy

      const currentWeather = document.getElementById('current-weather');
      currentWeather.innerHTML = '';

      const currentWeatherHeading = document.createElement('h3');
      currentWeatherHeading.textContent = `in ${userInput.value.trim()}`;
      currentWeather.appendChild(currentWeatherHeading);

      Object.values(filteredForecast).slice(0, 1).forEach(day => {
        const listItem = document.createElement('li');
        listItem.classList.add(
            'border',
            'bg-white',
            'list-none',
            'rounded-sm',
            'px-3',
            'py-3',
            'cursor-pointer',
            'hover:text-white',
            'hover:bg-blue-600'
          );
        listItem.classList.add('weather-card');

        const dateHeading = document.createElement('h3');
        dateHeading.textContent = day.date.toLocaleDateString();
        listItem.appendChild(dateHeading);

        const weatherIcon = document.createElement('img');
        weatherIcon.src = `https://openweathermap.org/img/wn/${day.icon}.png`;
        weatherIcon.alt = 'weather-icon';
        listItem.appendChild(weatherIcon);

        const temperatureHeading = document.createElement('h3');
        temperatureHeading.textContent = `Temp: ${day.temperature}°F`;
        listItem.appendChild(temperatureHeading);

        const windHeading = document.createElement('h3');
        windHeading.textContent = `Wind: ${day.wind} MPH`;
        listItem.appendChild(windHeading);

        const humidityHeading = document.createElement('h3');
        humidityHeading.textContent = `Humidity: ${day.humidity}%`;
        listItem.appendChild(humidityHeading);

        currentWeather.appendChild(listItem);
      });

      const predictionCards = document.getElementById('prediction-cards');
      predictionCards.innerHTML = '';

      Object.values(filteredForecast).slice(1, 6).forEach(day => {
        const listItem = document.createElement('li');
        listItem.classList.add(
            'border',
            'bg-white',
            'list-none',
            'rounded-sm',
            'px-3',
            'py-3',
            'cursor-pointer',
            'hover:text-white',
            'hover:bg-blue-600',
          );
        listItem.classList.add('weather-card');

        const dateHeading = document.createElement('h3');
        dateHeading.textContent = day.date.toLocaleDateString();
        listItem.appendChild(dateHeading);

        const weatherIcon = document.createElement('img');
        weatherIcon.src = `https://openweathermap.org/img/wn/${day.icon}.png`;
        weatherIcon.alt = 'weather-icon';
        listItem.appendChild(weatherIcon);

        const temperatureHeading = document.createElement('h3');
        temperatureHeading.textContent = `Temp: ${day.temperature}°F`;
        listItem.appendChild(temperatureHeading);

        const windHeading = document.createElement('h3');
        windHeading.textContent = `Wind: ${day.wind} MPH`;
        listItem.appendChild(windHeading);

        const humidityHeading = document.createElement('h3');
        humidityHeading.textContent = `Humidity: ${day.humidity}%`;
        listItem.appendChild(humidityHeading);

        predictionCards.appendChild(listItem);
      });

      return {
        forecast: Object.values(filteredForecast)
      };
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// we have a function to get coordinates for a city
// the url has parameters to limit to one the response
// there is a const with the api so it logs with the url
// the function sends a fetch and receives the json data to extract the lat
// and lon, if they are not found it throws an error
function getCoordinates(city) {
  const apiKey = '9a8b08fd63683cdb4192ebb6f7b26947';
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

// Event listener for the search button
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
      addToSearchHistory(city);
    });
});
