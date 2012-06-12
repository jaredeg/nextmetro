var Request = require('request');
var Log = require('logging');
var Async = require('async');

var stations = {};
var api_key = '67syqrmbw6gz6escepcmuvnv';
var metro = ['RD','BL', 'GR', 'YL', 'OR'];  //Current Line code for metro;
var allTrains = { redLine: [ ], blueLine: [ ], greenLine: [ ], yellowLine: [ ], orangeLine: [ ] };
var toFind = (process.argv[2] + (process.argv[3] ? " " + process.argv[3] : "")).toLowerCase();


Async.forEach(metro,function(lineCode, cb){
    Request('http://api.wmata.com/Rail.svc/json/JStations?LineCode='+lineCode+'&api_key=' + api_key, function (error, response, body) {
        if (!error && response.statusCode == 200) {
           var d = JSON.parse(body);
         //   Log(d.Stations);
            d.Stations.forEach(function(Station){
            //  Log(Station.Name, Station.Code);
                var stationName = Station.Name.toLowerCase();
                if (stations[stationName] == undefined){
                    stations[stationName] = new Array(Station.Code);
                }
                else{
                    stations[stationName].push(Station.Code);
                }

            });

            //Log(stations);

        }
        //Log(stations);
        cb(error);

    });

}, function(error){

    var toSearch = stations[toFind];
    //Log(toSearch);
    Request('http://api.wmata.com/StationPrediction.svc/json/GetPrediction/'+toSearch+'?api_key=' + api_key, function(error, response, body){
    if (!error && response.statusCode == 200){
        var d = JSON.parse(body);
      //Log(d);
      if (toSearch == undefined){
          console.log('Not a train station. Please use correct name!');
      }
      else if(!d.Trains.length)
      {
         console.log('No Trains Reported Yet!');
      }
      else {
          d.Trains.forEach(function(Train){
              var to_add = 'Direction : ' +Train.Destination + ' Time: ' +Train.Min;
              //Log(Train.Line);
             switch(Train.Line)
              {
                 case 'GR':
                     allTrains.greenLine.push(to_add);
                     break;
                 case 'YL':
                     allTrains.yellowLine.push(to_add);
                     break;
                 case 'RD':
                     allTrains.redLine.push(to_add);
                     break;
                 case 'OR':
                     allTrains.orangeLine.push(to_add);
                     break;
                 case 'BL':
                     allTrains.blueLine.push(to_add);
                     break;
                 default:
                     //Log("Should not have gotten here!!");
              }


          });
          console.log(allTrains);

      }


    }


     });


});


