# Manual migration — no interactive prompts
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
        ('account', '0001_initial'),
        ('question', '0001_initial'),
    ]

    operations = [
        # NOTE: 'lesson' FK and question_type/options/correct_answer columns
        # already exist in the DB from a previous partial migration.
        # Removing them here would cause "column does not exist" errors,
        # so skip those operations and only add NEW fields/models below.
        # DateTime fields: use auto_now_add — safe defaults already implied
        migrations.AddField(
            model_name='question',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='question',
            name='created_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='questions_created', to='account.account'),
        ),
        migrations.AddField(
            model_name='question',
            name='updated_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='questions_updated', to='account.account'),
        ),
        migrations.AddField(
            model_name='question',
            name='difficulty',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='question',
            name='explanation',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='question',
            name='points',
            field=models.IntegerField(default=1),
        ),
        # NOTE: question_type, options, correct_answer columns already exist in DB —
        # do NOT re-add them here to avoid "column already exists" error.
        # Create Quiz model (no existing rows, safe)
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('time_limit', models.IntegerField(default=0)),
                ('questions_count', models.IntegerField(default=0)),
                ('passing_score', models.FloatField(default=70.0)),
                ('is_published', models.BooleanField(default=True)),
                ('order', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='quizzes_created', to='account.account')),
                ('updated_by', models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='quizzes_updated', to='account.account')),
                ('level', models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, to='common.level')),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
        migrations.AddField(
            model_name='quiz',
            name='topics',
            field=models.ManyToManyField(blank=True, to='common.topic'),
        ),
        # Add quiz FK to question — nullable first to handle existing rows
        migrations.AddField(
            model_name='question',
            name='quiz',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='question.quiz'),
        ),
        # Create UserQuizAttempt (no existing rows, safe)
        migrations.CreateModel(
            name='UserQuizAttempt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answers', models.JSONField(default=dict)),
                ('score', models.FloatField(default=0.0)),
                ('max_score', models.FloatField(default=0.0)),
                ('percentage', models.FloatField(default=0.0)),
                ('passed', models.BooleanField(default=False)),
                ('time_taken', models.IntegerField(default=0)),
                ('is_completed', models.BooleanField(default=False)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='quizattempts_created', to='account.account')),
                ('updated_by', models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='quizattempts_updated', to='account.account')),
                ('quiz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='question.quiz')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='account.account')),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('user', 'quiz')},
            },
        ),
    ]
