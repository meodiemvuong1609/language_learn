from django.db import migrations, models
from django.db.models import Q


def promote_staff(apps, schema_editor):
    Account = apps.get_model('account', 'Account')
    Account.objects.filter(Q(is_staff=True) | Q(is_superuser=True)).update(
        role='teacher',
        status='active',
    )


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='role',
            field=models.CharField(
                choices=[('teacher', 'Teacher'), ('student', 'Student')],
                default='student',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='account',
            name='status',
            field=models.CharField(
                choices=[
                    ('pending', 'Pending approval'),
                    ('active', 'Active'),
                    ('rejected', 'Rejected'),
                ],
                default='active',
                max_length=20,
            ),
        ),
        migrations.RunPython(promote_staff, migrations.RunPython.noop),
    ]
