(function(){

  var eid = function(){
    var count = 0;
    eid = function(){
      return "_"+(count++);
    }
    return eid();
  };

  var mock = {
  	car: function(numberOfMockCars) {
  		var carNames = [
  			'Reasonable Excuse',
  			'Plausible Explaination',
  			'Enviable Logic',
  			'Just Passing Through',
  			'Feigned Innocence',
  			'Impermanent Fixture',
  			'Who Me?',
  			'Participant Observer',
  			'Witting Accomplice',
  			'Implaccable',
  			'Crossing Guard',
  			'Pain of Death',
  			'Unreliable Witness',
  			'Impersonal Demeanor',
  			'Inpromptu',
  			'Flat Affect',
  			'Unfit Survivor',
  			'Fate Calling',
  			'Balderdash',
  			'Impossible Getaway',
  			'Implausible Escape',
  			'Fight or Flight',
  			'Impact Uncertain',
  			'No Right to Be Here',
  			'Naked Agression',
  			'Causeway',
  			'Van Possessed, A',
  			'Lead Foot',
  			'Bulletproof',
  			'Alabai',
  			'Poor Impulse Control',
  			'Unexpected',
  			'Unpredictable',
  			'Discontinued',
  			'Recalled Model',
  			'Poor Role Model',
  			'Bad Uncle Jackson',
  			'I Should Have Been a Dentist',
  			'Born Liar',
  			'Suspicious',
  			'Curious Disposition'
  		];
  		var cars = [];
  		for (var i = 0; i < carNames.length; i++) {
  			cars.push({
  				name: carNames[i],
  				location: chance.address(),
  				battery: Math.floor( Math.random() * 100 ),
  				driver: chance.name(),
  				notes: chance.sentence(),
  				latitude: 33.42 + (0.1*Math.random()),
  				longitude: -82.14 + (0.2*Math.random())
  			});
  		}
  		return cars;
  	}
  };

var app = {locations:[], selectedLocationID:null, map:null};

app.displayLocationsList = function(locations){
  var d = _.reduceRight(locations, function(m,n){
    var d = "";
    d += "<div class='well' data-toggle='modal' data-target='#exampleModal' data-coords='"+n.latlng.toString()+"'  data-title='"+n.title+"'  data-notes='"+n.notes+"' data-id='"+n.id+"'>"
    d += "<h3>"+n.title+"</h3>";
    d += "<div class='small' >"+n.latlng.toString()+"</div>";
    d += "<p>"+n.notes+"</p>";
    d += "</div>";
    return m + d;
  }, "<h2>Locations</h2>");

  $("#locations-list").html(d);
};

app.displayMap = function(){
  var map = L.map('map').setView([33.47541, -82], 13);

  for (var i = 0; i < app.cars.length; i++) {
  	var latlng = L.latLng(app.cars[i].latitude, app.cars[i].longitude);
  	var popupString = '<h4>'+app.cars[i].name+'</h4>';
  	popupString += '<table class="table"><tr><td>Battery</td><td>'+app.cars[i].battery+'%</td></tr>';
  	popupString += '<tr><td>Driver</td><td>'+app.cars[i].driver+'</td></tr>';
  	popupString += '</table>';
  	L.circle(latlng, 70, {
      weight:4,
      color: 'hsl('+(0+app.cars[i].battery)+', 100%, 50%)',
      fillOpacity: 0.5
    })
    .bindPopup(popupString)
    .addTo(map);
  }

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'lukedavis.3457dfcb',
      accessToken: 'pk.eyJ1IjoibHVrZWRhdmlzIiwiYSI6IjcwMDBkNWEyNmZlYzU0YTI0YTYxMGYyMmNkZjBhNjRmIn0.kd__Iir1FCZkgkrp8r-byQ'
  }).addTo(map);
  /*
  map.on("click",function(e){
    var id = eid();
    var circle = L.circle(e.latlng, 100, {
      weight:2,
      color: '#f00',
      fillOpacity: 0
    }).addTo(map);

    circle.on("click",function(e){
      map.removeLayer(circle);
      for (var i=0;i<app.locations.length;i++){
        if (app.locations[i].mapObject===circle){
          app.locations.splice(i,1);
          break;
        }
      }
      app.displayLocationsList(app.locations);
    });

    //app.locations.push({id:id, latlng:e.latlng, radius: 100, mapObject: circle, title:"Title", notes:"notes"});

    app.displayLocationsList(app.locations);
  });
    */

  app.map = map;

};

	app.displayDatatable = function(target){
		var target = target || "#datatable";

		var cars = app.cars;
		var columns = [
			{data: 'name', title: 'Name'},
			{data: 'battery', title: 'Battery(%)'},
			{data: 'driver', title: 'Driver'},
			{data: 'location', title: 'Location'},
			{data: 'notes', title: 'Notes'}
		];

		$('#datatable').DataTable({
				data: cars,
				columns: columns,
				paging: false,
				searching: false
			});
	};

	app.displayDonutChart = function(target, data) {

		var columns = [];
		for (var i = 0; i < 25; i++) {
			columns.push([chance.address(), Math.floor(Math.random()*30000)])
		}

		columns.sort(function(a,b){
			return b[1]-a[1];
		});

		var colors = {};
		for (var i=0;i<25;i++){
			colors[columns[i][0]]='hsl('+(150-(i*(150/25)))+', 100%, 50%)';
		}

		var chart = c3.generate({
			bindto: target,
	    data: {
	        columns: columns,
	    		colors: colors,
	        type : 'donut',
	        onclick: function (d, i) { console.log("onclick", d, i); },
	        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
	        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
	    },
	    donut: {
	        title: "Profit Per Location"
	    },
		    legend: {
		    	show: false
		    }
		});
	};

	app.displayTimeseriesChart = function(target, data) {
		var chart = c3.generate({
				bindto: '#timeseries',
		    data: {
		        x: 'x',
		//        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
		        columns: [
		            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
		            ['Atlanta', 30, 200, 100, 400, 150, 250],
		            ['Augusta', 130, 340, 200, 500, 250, 350]
		        ]
		    },
		    axis: {
		        x: {
		            type: 'timeseries',
		            tick: {
		                format: '%Y-%m-%d'
		            }
		        }
		    }
		});
	};

  app.init = function(){
  	app.cars = mock.car(50);
  	app.displayDonutChart("#donut");
  	app.displayDatatable('#datatable');
  	//app.displayTimeseriesChart("#timeseries");
    app.displayMap();

    $('#exampleModal').on('show.bs.modal', function (event) {
      app.selectedLocationID = $(event.relatedTarget).data('id');

      for (var i=0;i<app.locations.length;i++){
        if (app.locations[i].id===app.selectedLocationID){
          var latlng = app.locations[i].latlng;
          
          $(this).find('.modal-title').text(app.locations[i].latlng);
          $(this).find('#modal-title').val(app.locations[i].title)
          $(this).find('#modal-notes').val(app.locations[i].notes);
          app.map.panTo(latlng);
        }
      }

    })

    $("#save-location-data").on("click",function(){
      for (var i=0;i<app.locations.length;i++){
        if (app.locations[i].id===app.selectedLocationID){
          app.locations[i].title = $("#exampleModal").find('#modal-title').val();
          app.locations[i].notes = $("#exampleModal").find('#modal-notes').val();
          app.displayLocationsList(app.locations);
          break;
        }
      }
    });

  };

  window.app = app;

})();

$(document).ready(function(){ app.init() });