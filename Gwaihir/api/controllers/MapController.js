'use strict';

let request = require('request')
let host = process.env.THORON_ADDR;

module.exports = {
  map: function (req, res) {
    return new Promise(function (resolve, reject) {
      let reqData = {
        url: host + '/vehicles/',
        headers: {
          Authorization: req.session.token
        },
        method: 'GET'
      };
      request(reqData, function (error, response, body) {
        if (error) {
          sails.log.error(error|| response.statusCode !== 200);
          reject(error);
        } else {
          resolve(JSON.parse(body));
        }
      });
    }).then(resp => {
      let data = [];
      for (let item in resp) {
        data.push({
          plate: resp[item].number_plate,
          latitude: resp[item].last_position[0],
          longitude: resp[item].last_position[1]
        });
      }
      return res.view(
        'pages/map',
        {
          username: req.session.username || '',
          data: data,
        });
    }).catch(error => {
      return res.view('pages/map',
      {
        username: req.session.username || '',
        data: [],
      });
    });
  }
};
