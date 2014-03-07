$(document).ready(function(){

	// if (navigator.geolocation)
	// {
	// 	navigator.geolocation.getCurrentPosition(getCoords, getError);
	// } else {
	// 	initialize(13.30272,-87.194107);
	// }

	var lat;
	var lng;
	var map;
	var markerOptions;
	var marker;
	var geocoder = new google.maps.Geocoder();

	geocoder.geocode({ 'address': 'Mexicali'}, function(result){
		lat = result[0].geometry.location.lb;
		lng = result[0].geometry.location.mb;

		var latlng = new google.maps.LatLng(lat,lng);

		var mapSettings = {
			center : latlng,
			zoom : 15,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		}

		$('#mapa').height(500);
		map = new google.maps.Map($('#mapa').get(0),mapSettings);

		markerOptions = {
			position : latlng,
			map : map,
			draggable : true,
			title : 'Drag me to hell'
		};
	
		marker = new google.maps.Marker(markerOptions);

		google.maps.event.addListener(marker,'position_changed', function(){
			getMarkerCoords(marker);
		});

		google.maps.event.addListener(marker, "click", function() {
	    	obtenerDireccion(marker);
   		 });
  	    // var input = result[0].geometry.location.toUrlValue();
		// var latlngStr = input.split(",", 2);
		// lat = parseFloat(latlngStr[0]);
		// lng = parseFloat(latlngStr[1]);
	});


	function getCoords(position)
	{
		lat = position.coords.latitude;
		lng = position.coords.longitude;

		initialize(lat, lng);	
	}

	function getError(err)
	{
		initialize(13.30272,-87.194107);
	}

	function initialize(lat, lng){}

	function obtenerDireccion(direccion)
	{
		var geocoder = new google.maps.Geocoder();
		var coords = direccion.getPosition();
		var latLong_mx = new google.maps.LatLng(coords.lat(), coords.lng());

	    geocoder.geocode({'latLng': latLong_mx, 'region': 'MX'}, function(results){
	    	var location_type_mx = results[0].geometry.location_type;
        	alert(results[0].formatted_address);	
	    });
	}

	function getMarkerCoords(marker)
	{
		var coords = marker.getPosition();
		$("#id_lat").val( coords.lat() );
		$("#id_lng").val( coords.lng() );	
	}

	$("#save_form").submit(function(e){
		e.preventDefault();

		$.post('/coords/save',$(this).serialize(),function(data){
			if (data.respuesta)
			{
				$("#data").html(data.mensaje);
				$("#save_form").each(function(){ this.reset(); });
			} else {
				alert(data.mensaje)
			}
		},'json');
	});


	$('#buscar').on('click', function() {
	    var address = $('#direccion').val();
	    var geocoder = new google.maps.Geocoder();
	  
	    geocoder.geocode({ 'address': address}, geocodeResult);
	});

	function geocodeResult(results, status) {
   
    if (status == 'OK') {
        var mapOptions = {
            center: results[0].geometry.location,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map($("#mapa").get(0), mapOptions);  
        map.fitBounds(results[0].geometry.viewport);
        
        //var markerOptions = { position: results[0].geometry.location , draggable : true }
        markerOptions = {
			position : results[0].geometry.location,
			map : map,
			draggable : true,
			title : 'Drag me to hell'
		};
        marker = new google.maps.Marker(markerOptions);
        google.maps.event.addListener(marker,'position_changed', function(){
			getMarkerCoords(marker);
		});
        //marker.setMap(map);

        $("#id_lat").val( results[0].geometry.location.lb );
		$("#id_lng").val( results[0].geometry.location.mb );
    } else {
        alert("Geocoding no tuvo éxito debido a: " + status);
    }
}
});