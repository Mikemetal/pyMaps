$(document).ready(function(){

	function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
		    var cookies = document.cookie.split(';');
		    for (var i = 0; i < cookies.length; i++) {
		        var cookie = jQuery.trim(cookies[i]);
		        // Does this cookie string begin with the name we want?
		        if (cookie.substring(0, name.length + 1) == (name + '=')) {
		            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		            break;
		        }
		    }
		}
	    return cookieValue;
	}
var csrftoken = getCookie('csrftoken');
console.log(csrftoken);

//Ajax call
function csrfSafeMethod(method) {
// these HTTP methods do not require CSRF protection
return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    crossDomain: false, // obviates need for sameOrigin test
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
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
		lat = result[0].geometry.location.d;
		lng = result[0].geometry.location.e;

		var latlng = new google.maps.LatLng(lat,lng);

		var mapSettings = {
			center : latlng,
			zoom : 12,
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

	$('.icon-search').on('click',function(){
		var id = $(this).siblings().text();
		$.post('/coords/load',{ 'id' : id,'csrfmiddlewaretoken': getCookie('csrftoken') },function(data){
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

        $("#id_lat").val( results[0].geometry.location.d );
		$("#id_lng").val( results[0].geometry.location.e );
    } else {
        alert("Geocoding no tuvo éxito debido a: " + status);
    }
}
});