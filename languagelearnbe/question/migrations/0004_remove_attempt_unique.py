from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('question', '0003_alter_question_options_alter_quiz_options_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='userquizattempt',
            unique_together=set(),
        ),
    ]
