var Request = require("request");
var Log = require('logging');
var Async = require('async');

var stations = {};
var api_key = '67syqrmbw6gz6escepcmuvnv';
var metro = ['RD','BL', 'GR', 'YL', 'OR'];  //Current Line code for metro;

var toFind = (process.argv[2] + (process.argv[3] ? " " + process.argv[3] : "")).toLowerCase();

Async.forEach(metro,function(lineCode, cb){
    Request('http://api.wmata.com/Rail.svc/json/JStations?LineCode='+lineCode+'&api_key=' + api_key, function (error, response, body) {
        if (!error && response.statusCode == 200) {
           var d = JSON.parse(body);
         //   Log(d.Stations);
            d.Stations.forEach(function(Station){
            //  Log(Station.Name, Station.Code);
               stations[Station.Name.toLowerCase()] = Station.Code;
            });

          //  Log(stations);

        }
        cb(error);
    });

}, function(error){
    //Log(stations);
    var toSearch = stations[toFind];
    Log(toSearch);
    Request('http://api.wmata.com/StationPrediction.svc/json/GetPrediction/'+toSearch+'?api_key=' + api_key, function(error, response, body){
    if (!error && response.statusCode == 200){
        var d = JSON.parse(body);
      if(!d.Trains.length)
      {
         Log("No Trains Yet!");
      }
      else {
          d.Trains.forEach(function(Train){
              console.log('Direction : ' +Train.Destination + ' Time: ' +Train.Min);

          });
      }


    }


     });

});


