from django.urls import path
from .views import wastereportviews, materialtypeviews, buildingViews

urlpatterns = [
    path('wastereport/create', wastereportviews.post_wastereport, name='post_wastereport'),
    path('wastereport/all', wastereportviews.get_all_wastereports, name='get_all_wastereports'),
    path('wastereport/<int:id>', wastereportviews.get_wastereport, name='get_wastereport'),

    path('bygning/bymaterial', buildingViews.get_allBygningByMaterial, name='get_allByngingByMaterial'),
    path('bygning/bybygningsnr/<int:bygningsnr>', buildingViews.get_singleBygningById, name='get_singleBygningById'),
    path('bygning/squareselect', buildingViews.get_squareSelect, name='get_squareSelect'),

    path('materialtype/all', materialtypeviews.get_materialtypes, name='get_materialtypes'),
    path('materialtype/create', materialtypeviews.create_materialtype, name='create_materialtype'),
    path('materialtype/update', materialtypeviews.update_materialtype, name='update_materialtype'),
    path('materialtype/delete', materialtypeviews.delete_materialtype, name='delete_materialtype'),
]