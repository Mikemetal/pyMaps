from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('maps.views',
    # Examples:
     url(r'^$', 'index', name='index'),
     url(r'^coords/save$', 'coords_save', name='coords_save'),
     url(r'^coords/load$', 'coords_load', name='coords_load'),
    # url(r'^pyMaps/', include('pyMaps.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
     url(r'^admin/', include(admin.site.urls)),
)
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns += staticfiles_urlpatterns()