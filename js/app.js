//getForecastByCoordinates(42.3601, -71.0589);

//list of cities
let cities = [
    {
        name: 'Yerevan',
        latitude: 40.179186,
        longitude: 44.499103
    }, {
        name: 'Moscow',
        latitude: 55.755826,
        longitude: 37.617300
    }, {
        name: 'Los Angeles',
        latitude: 34.052234,
        longitude: -118.243685
    }, {
        name: 'London',
        latitude: 51.507351,
        longitude: -0.127758
    }, {
        name: 'New York',
        latitude: 40.67,
        longitude: -73.94
    }
];

function initApp(index) {
    let $weekDays = document.querySelector('.list-of-days');
    let $cities = document.querySelector('[name="cities"]');
    let selectedCityIndex = index;// Yerevan
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let selectedDay = new Date().getDay();

    //app bootstrap functions
    fillCitiesList($cities, handleCityChange);
    fillWeekDays($weekDays, handleDayClick);
    getForecastForCity(cities[selectedCityIndex]).then((res)=> {
        updateWidget(res, selectedDay);
    });

    /**
     * this will fill select with cities
     * @param $select
     */
    function fillCitiesList($select, handler) {
        let list = [];
        cities.map((item, index)=> {
            let option = `<option value="${index}" selected="${index===selectedCityIndex}">${item.name}</option>`;
            list.push(option);
        });
        $select.innerHTML = list.join('');
        $select.addEventListener('change', (e)=> {
            if (typeof handler === 'function') {
                handler(e);
            }
        })
    }

    /**
     * this will fill week days
     * @param $daysContainer
     */
    function fillWeekDays($daysContainer, handler) {
        days.map((item, index)=> {
            let liElem = document.createElement('li');
            liElem.setAttribute('day-index', index);
            liElem.setAttribute('day', item);
            liElem.innerText = item;
            //selected today
            if (today === index) {
                liElem.className = 'selected';
            }
            liElem.addEventListener('click', (e)=> {
                if (typeof handler === 'function') {
                    handler(e);
                }
            });
            $daysContainer.appendChild(liElem);
        });
    }

    //event handlers
    function handleDayClick(e) {
        //remove selected
        document.querySelector('li.selected').className = '';
        e.target.className = 'selected';
        selectedDay = Number(e.target.getAttribute('day-index'));
        getForecastForCity(cities[selectedCityIndex]).then((res)=> {
            updateWidget(res, selectedDay);
        });
    }

    function handleCityChange(e) {
        selectedCityIndex = e.target.value;
        getForecastForCity(cities[selectedCityIndex]).then((res)=> {
            updateWidget(res, selectedDay);
        });
    }

    //app logic
    /**
     * this will call api
     * @param city
     * @returns {*}
     */
    function getForecastForCity(city) {
        return getForecastByCoordinates(city.latitude, city.longitude);
    }

    function updateWidget(data, forDay) {
        let $header = document.querySelector('.card-header');
        let $temperature = document.querySelector('.card-temp');
        let $info = document.querySelector('.card-info');
        let forecastForWeekDays = data.daily.data;

        let forecast = forecastForWeekDays[forDay];
        $header.innerText = cities[selectedCityIndex].name;
        $temperature.innerText = forecast.apparentTemperatureMax + ' F';
        $info.innerText = `pressure:${forecast.pressure}, summary:${forecast.summary}.`;
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((geo)=> {
            console.log(geo);
            cities.push({
                name: 'Current Location',
                latitude: geo.coords.latitude,
                longitude: geo.coords.longitude
            });

            //init app after getting cords
            initApp(cities.length-1);
        });
    } else {
        alert("Geolocation is not supported by this browser. Please select city manualy");
        //init app anyway
        initApp(0);
    }
}
getLocation();