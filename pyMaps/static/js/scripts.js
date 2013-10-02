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
	var geocoder = new google.maps.Geocoder();
	    // Hacemos la petición indicando la dirección e invocamos la función
	    // geocodeResult enviando todo el resultado obtenido
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
	
	var marker = new google.maps.Marker(markerOptions);

	google.maps.event.addListener(marker,'position_changed', function(){
		getMarkerCoords(marker);
	});

	google.maps.event.addListener(marker, "click", function() {
    	obtenerDireccion(marker);
    });
  //      	var input = result[0].geometry.location.toUrlValue();
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

	function initialize(lat, lng)
	{
		

	}

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
	    // Obtenemos la dirección y la asignamos a una variable
	    var address = $('#direccion').val();
	    // Creamos el Objeto Geocoder
	    var geocoder = new google.maps.Geocoder();
	    // Hacemos la petición indicando la dirección e invocamos la función
	    // geocodeResult enviando todo el resultado obtenido
	    geocoder.geocode({ 'address': address}, geocodeResult);
	});

	function geocodeResult(results, status) {
    // Verificamos el estatus
    if (status == 'OK') {
        // Si hay resultados encontrados, centramos y repintamos el mapa
        // esto para eliminar cualquier pin antes puesto
        var mapOptions = {
            center: results[0].geometry.location,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map($("#mapa").get(0), mapOptions);
        // fitBounds acercará el mapa con el zoom adecuado de acuerdo a lo buscado
        map.fitBounds(results[0].geometry.viewport);
        // Dibujamos un marcador con la ubicación del primer resultado obtenido
        //var markerOptions = { position: results[0].geometry.location , draggable : true }
        marker = new google.maps.Marker(markerOptions);
        marker.setMap(map);
    } else {
        // En caso de no haber resultados o que haya ocurrido un error
        // lanzamos un mensaje con el error
        alert("Geocoding no tuvo éxito debido a: " + status);
    }
}
});