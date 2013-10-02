from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
from django.utils.timesince import timesince
from maps.models import UbicacionForm, Ubicacion

def index(request):
	form = UbicacionForm()
	ubicaciones = Ubicacion.objects.all().order_by('-fecha')
	return render_to_response('index.html',{ 'form' : form , 'datos' : ubicaciones },context_instance =RequestContext(request))

def coords_save(request):
	if request.is_ajax():
		form = UbicacionForm(request.POST)
		if form.is_valid():
			form.save()
			ubicaciones = Ubicacion.objects.all().order_by('-fecha')

			data = '<ul>'

			for ubicacion in ubicaciones:
				data += '<li>%s %s - hace %s</li>' %(ubicacion.nombre,ubicacion.user,timesince(ubicacion.fecha))

			data += '</ul>'

			return HttpResponse(simplejson.dumps({ 'respuesta' : True, 'mensaje' : data}),mimetype='application/json')
		else:
			return HttpResponse(simplejson.dumps({ 'respuesta' : False, 'mensaje' : 'No es valida la informacion del form.'}),mimetype='application/json')