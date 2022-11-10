//set map

var myLatLng = { lat: 1.3521, lng: 103.8198 };
var mapOptions = {
  center: myLatLng,
  zoom: 13,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};

var markerArray = [];
//create map

var map = new google.maps.Map(document.getElementById('map'), mapOptions)

//create a directions service object

var directionsService = new google.maps.DirectionsService();

//create a directionsRenderer object which we will use to display route
var rendererOptions = {
  map: map
}

var directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);

//bind the directionsRenderer to the map 

directionsRenderer.setMap(map);

// Instantiate an info window to hold step text.
stepDisplay = new google.maps.InfoWindow();


//function 

function calcRoute() {
  //create request 
  const selectedMode = document.getElementById('mode').value;
  //driving---------------------------------------------------------------
  //   var request_DRIVING ={
  //     origin:document.getElementById('from').value,
  //     destination:document.getElementById('to').value,
  //     travelMode: google.maps.TravelMode.DRIVING,//WALKING,BICYCLING AND TRANSIT
  //     unitSystem:google.maps.UnitSystem.METRIC
  //   }

  //   //Pass the request to the route metthod
  //   directionsService.route(request_DRIVING,(result,status)=>{
  //     if (status==google.maps.DirectionsStatus.OK){

  //       //get distance and time 
  //       const output=document.querySelector('#output_DRIVING');
  //       output.innerHTML="<div class='alert-info'>From:"+document.getElementById('from').value+"<br/>To:" +document.getElementById('to').value +".<br/> Driving distance:"+result.routes[0].legs[0].distance.text+".<br/>Duration : "+result.routes[0].legs[0].duration.text + ".</div>";



  //       //display route
  //       directionsRenderer.setDirections(result);
  //     }else{
  //       //delete route from map 
  //       directionsRenderer.setDirections({routes:[]});

  //       //center map in spain 
  //       map.setCenter(myLatLng);

  //       //show error msg
  //       output.innerHTML="<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve distance </div>"
  //     }
  //   })
  // //walking -----------------------------------------------------------------
  //   var request_WALKING ={
  //     origin:document.getElementById('from').value,
  //     destination:document.getElementById('to').value,
  //     travelMode: google.maps.TravelMode.WALKING,//WALKING,BICYCLING AND TRANSIT
  //     unitSystem:google.maps.UnitSystem.METRIC
  //   }

  //   //Pass the request to the route metthod
  //   directionsService.route(request_WALKING,(result,status)=>{
  //     if (status==google.maps.DirectionsStatus.OK){

  //       //get distance and time 
  //       const output=document.querySelector('#output_WALKING');
  //       output.innerHTML="<div class='alert-info'>From:"+document.getElementById('from').value+"<br/>To:" +document.getElementById('to').value +".<br/> Driving distance:"+result.routes[0].legs[0].distance.text+".<br/>Duration : "+result.routes[0].legs[0].duration.text + ".</div>";



  //       //display route
  //       directionsRenderer.setDirections(result);
  //     }else{
  //       //delete route from map 
  //       directionsRenderer.setDirections({routes:[]});

  //       //center map in spain 
  //       map.setCenter(myLatLng);

  //       //show error msg
  //       output.innerHTML="<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve distance </div>"
  //     }
  //   })


  //   //bicycling---------------------------------------------------------------
  //   var request_BICYCLING ={
  //     origin:document.getElementById('from').value,
  //     destination:document.getElementById('to').value,
  //     travelMode: google.maps.TravelMode.BICYCLING,//WALKING,BICYCLING AND TRANSIT
  //     unitSystem:google.maps.UnitSystem.METRIC
  //   }

  //   //Pass the request to the route metthod
  //   directionsService.route(request_BICYCLING,(result,status)=>{
  //     if (status==google.maps.DirectionsStatus.OK){

  //       //get distance and time 
  //       const output=document.querySelector('#output_BICYCLING');
  //       output.innerHTML="<div class='alert-info'>From:"+document.getElementById('from').value+"<br/>To:" +document.getElementById('to').value +".<br/> Driving distance:"+result.routes[0].legs[0].distance.text+".<br/>Duration : "+result.routes[0].legs[0].duration.text + ".</div>";



  //       //display route
  //       directionsRenderer.setDirections(result);
  //     }else{
  //       //delete route from map 
  //       directionsRenderer.setDirections({routes:[]});

  //       //center map in spain 
  //       map.setCenter(myLatLng);

  //       //show error msg
  //       output.innerHTML="<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve distance </div>"
  //     }
  //   })

  //TRANSIT
  var request = {
    origin: document.getElementById('from').value,
    destination: document.getElementById('to').value,
    travelMode: google.maps.TravelMode[selectedMode],//WALKING,BICYCLING AND TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC
  }

  //Pass the request to the route metthod
  directionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {

      //get distance and time 

      const output = document.querySelector('#output');
      const destination = document.getElementById('to').value
      const source = document.getElementById('from').value

      output.innerHTML = "<div class='alert-info fs-4'><br> <b>Driving distance: </b>" + result.routes[0].legs[0].distance.text + "<br/><b>Duration: </b> " + result.routes[0].legs[0].duration.text + "</div>";
      var toSave = {}
      toSave['source'] = source
      toSave['destination'] = destination
      var route = []

      for (const point of result.routes[0].overview_path) {
        route.push({
          lat: point.lat(),
          lng: point.lng()
        })
      }
      // console.log('inside showsteps')
      toSave['route'] = route

      if (user_detail != null) {
        var useremail = JSON.parse(localStorage.getItem("users")).email

        toSave['email'] = useremail
      }




      console.log(toSave)

      //database.ref().child('user_routes/' + useremail).set(toSave)

      output.innerHTML = "<div class='alert-info fs-4'><br><b> Driving distance: </b>" + result.routes[0].legs[0].distance.text + "<br/><b>Duration: </b> " + result.routes[0].legs[0].duration.text + "</div>";

      //display route
      directionsRenderer.setDirections(result);
      showSteps(result);

      output.innerHTML = "<div class='alert-info fs-4'><br><b>Driving distance: </b>" + result.routes[0].legs[0].distance.text + "<br/><b>Duration: </b> " + result.routes[0].legs[0].duration.text + "</div>";
    } else {
      //delete route from map 
      directionsRenderer.setDirections({ routes: [] });

      //center map in spain 
      map.setCenter(myLatLng);

      //show error msg
      output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve distance </div>"
    }
  })

  function showSteps(directionResult) {
    // For each step, place a marker, and add the text to the marker's
    // info window. Also attach the marker to an array so we
    // can keep track of it and remove it when calculating new
    // routes.
    steps.innerHTML = "<b>Directions:</b> <br>"
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
      var marker = new google.maps.Marker({
        position: myRoute.steps[i].start_point,
        map: map
      });
      attachInstructionText(marker, myRoute.steps[i].instructions);
      markerArray[i] = marker;
      steps.innerHTML += "<li>" + myRoute.steps[i].instructions + "</li>"
    }
    steps.innerHTML += "<br><a href='pages/traffic/traffic_check.html'><button class='btn btn-success btn-lg'>Check Traffic</button></a>"
  }

  function attachInstructionText(marker, text) {
    google.maps.event.addListener(marker, 'click', function () {
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }



}



//create autocomplete objects for all input 

var options = {
  types: ['establishment'],
  componentRestrictions: { 'country': ['SG'] },
}

var input1 = document.getElementById('from');
var autocomplete1 = new google.maps.places.Autocomplete(input1, options)

var input2 = document.getElementById('to');
var autocomplete2 = new google.maps.places.Autocomplete(input2, options)