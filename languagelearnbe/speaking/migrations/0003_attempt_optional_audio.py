from datetime import timedelta

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('speaking', '0002_alter_pronunciationpattern_created_by_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userspeakingattempt',
            name='audio_recording',
            field=models.FileField(blank=True, null=True, upload_to='speaking/attempts/'),
        ),
        migrations.AlterField(
            model_name='userspeakingattempt',
            name='duration',
            field=models.DurationField(default=timedelta(0)),
        ),
    ]
