from django.apps import AppConfig


class CommonConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'common'

    def ready(self):
        # Register signal handlers once the app registry is ready.
        from . import signals  # noqa: F401
