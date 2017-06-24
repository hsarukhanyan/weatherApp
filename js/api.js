'use strict';

const apiUrl = 'https://api.darksky.net/forecast/';
const key = '85bc765b3f9ec46a052bb8c3fb132523';
// using this as proxy to save time on crossorigin issues
const cors = 'https://crossorigin.me/';

/**
 * this will make api calls
 * @param latitude
 * @param longitude
 * @returns {Promise}
 */
function getForecastByCoordinates(latitude, longitude) {
    return new Promise((resolve, reject)=> {
        fetch(`${cors}${apiUrl}${key}/${latitude},${longitude}`)
            .then(res=> {
                res.json()
                    .then(data=> {
                        resolve(data)
                    })
            }).catch(err=> {
            reject(err)
        });
    });
}
