from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listening', '0002_alter_audiolesson_created_by_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audiolesson',
            name='audio',
            field=models.FileField(blank=True, upload_to='listening/audio/'),
        ),
        migrations.AlterField(
            model_name='audiolesson',
            name='transcript',
            field=models.TextField(blank=True),
        ),
    ]
