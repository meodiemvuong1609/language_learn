from datetime import timedelta

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('speaking', '0003_attempt_optional_audio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='speakinglesson',
            name='duration',
            field=models.DurationField(default=timedelta(0)),
        ),
        migrations.AlterField(
            model_name='speakinglesson',
            name='instruction',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='speakinglesson',
            name='example_audio',
            field=models.FileField(blank=True, upload_to='speaking/examples/'),
        ),
        migrations.AlterField(
            model_name='pronunciationpattern',
            name='phonetic',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='pronunciationpattern',
            name='example_words',
            field=models.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='pronunciationpattern',
            name='audio',
            field=models.FileField(blank=True, upload_to='speaking/pronunciation/'),
        ),
        migrations.AlterField(
            model_name='speakingexercise',
            name='instruction',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='speakingexercise',
            name='example_audio',
            field=models.FileField(blank=True, upload_to='speaking/exercises/examples/'),
        ),
        migrations.AlterField(
            model_name='speakingexercise',
            name='expected_duration',
            field=models.DurationField(default=timedelta(0)),
        ),
        migrations.AlterField(
            model_name='speakingexercise',
            name='sample_answer',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='speakingexercise',
            name='sample_answer_audio',
            field=models.FileField(blank=True, upload_to='speaking/exercises/samples/'),
        ),
        migrations.AlterField(
            model_name='userspeakingprogress',
            name='total_practice_time',
            field=models.DurationField(default=timedelta(0)),
        ),
    ]
