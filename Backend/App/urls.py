from django.urls import path
from . import views

urlpatterns = [
    path('wastereport/create', views.post_wastereport, name='post_wastereport'),
    path('materialtype/all', views.get_materialtypes, name='get_materialtypes'),
]