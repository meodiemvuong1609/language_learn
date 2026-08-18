from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('speaking', '0004_optional_media_fields'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SpeakingPractice',
        ),
    ]
