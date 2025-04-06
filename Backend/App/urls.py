from django.urls import path
from . import views

urlpatterns = [
    path('materialtype/all', views.get_materialtypes, name='get_materialtypes'),
    path('wastereport/create', views.post_wastereport, name='post_wastereport'),
    path('wastereport/all', views.get_all_wastereports, name='get_all_wastereports'),
    path('wastereport/<int:id>', views.get_wastereport, name='get_wastereport'),
]