from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0002_alter_progress_created_by_alter_progress_updated_by_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userpreference',
            name='dark_mode',
            field=models.BooleanField(default=False),
        ),
    ]
