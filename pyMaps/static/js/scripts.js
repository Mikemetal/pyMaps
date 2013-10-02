$(function(){
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(getCoords, getError);
	} else {
		initialize(13.30272,-87.194107);
	}

	function getCoords(position)
	{
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;

		initialize(lat, lng);	
	}

	function getError(err)
	{
		initialize(13.30272,-87.194107);
	}

	function initialize(lat, lng)
	{
		var latlng = new google.maps.LatLng(lat,lng);
		var mapSettings = {
			center : latlng,
			zoom : 12,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		}

		$('#mapa').height(500);
		map = new google.maps.Map($('#mapa').get(0),mapSettings);

		var marker = new google.maps.Marker({
			position : latlng,
			map : map,
			draggable : true,
			title : 'Drag me to hell'
		});

		google.maps.event.addListener(marker,'position_changed', function(){
			getMarkerCoords(marker);
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
});