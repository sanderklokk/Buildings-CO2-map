import os
import time
import pprint
from django.core.management.base import BaseCommand, CommandError
import json
import polars
from App.models import *

class Command(BaseCommand):
    def handle(self, *args, **options):
        pass