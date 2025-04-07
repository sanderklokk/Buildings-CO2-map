from django.urls import path
from .views import wastereportviews, materialtypeviews

urlpatterns = [
    path('materialtype/all', materialtypeviews.get_materialtypes, name='get_materialtypes'),
    path('wastereport/create', wastereportviews.post_wastereport, name='post_wastereport'),
    path('wastereport/all', wastereportviews.get_all_wastereports, name='get_all_wastereports'),
    path('wastereport/<int:id>', wastereportviews.get_wastereport, name='get_wastereport'),
    path('materialtype/create', materialtypeviews.create_materialtype, name='create_materialtype'),
    path('materialtype/update', materialtypeviews.update_materialtype, name='update_materialtype'),
]