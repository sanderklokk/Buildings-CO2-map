from django.urls import path
from .views import wastereportviews, materialtypeviews

urlpatterns = [
    path('materialtype/all', views.get_materialtypes, name='get_materialtypes'),
    path('wastereport/create', views.post_wastereport, name='post_wastereport'),
    path('wastereport/all', views.get_all_wastereports, name='get_all_wastereports'),
    path('wastereport/<int:id>', views.get_wastereport, name='get_wastereport'),
    path('bygning/byMaterial<str:material>', views.get_allByngingByMaterial, name='get_allByngingByMaterial'),
    path('bygning/byBygningsnr<int:bygnignsnr>', views.get_singleBygningById, name='get_singleBygningById'),
    path('materialtype/create', materialtypeviews.create_materialtype, name='create_materialtype'),
    path('materialtype/update', materialtypeviews.update_materialtype, name='update_materialtype'),
    path('materialtype/delete', materialtypeviews.delete_materialtype, name='delete_materialtype'),
]