# Manual migration — creates missing reading models + adds tracking fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
        ('account', '0001_initial'),
        ('reading', '0001_initial'),
    ]

    operations = [
        # ---- Create models that were missing from 0001 ----

        migrations.CreateModel(
            name='ReadingParagraph',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('order', models.IntegerField(default=0)),
                ('translation', models.TextField(blank=True)),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='paragraphs', to='reading.readinglesson')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='ReadingVocabularyItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.CharField(max_length=100)),
                ('meaning', models.TextField()),
                ('paragraph', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vocab_items', to='reading.readingparagraph')),
            ],
        ),
        migrations.CreateModel(
            name='ReadingComprehension',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.TextField()),
                ('options', models.JSONField(default=dict)),
                ('correct_answer', models.CharField(max_length=10)),
                ('explanation', models.TextField(blank=True)),
                ('order', models.IntegerField(default=0)),
                ('difficulty', models.IntegerField(default=1)),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comprehension_questions', to='reading.readinglesson')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='UserReadingProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('started', models.BooleanField(default=False)),
                ('completed', models.BooleanField(default=False)),
                ('last_paragraph', models.IntegerField(default=0)),
                ('completed_paragraphs', models.IntegerField(default=0)),
                ('score', models.FloatField(default=0)),
                ('total_time', models.IntegerField(default=0)),
                ('last_accessed', models.DateTimeField(auto_now=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='reading.readinglesson')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='account.account')),
            ],
            options={
                'unique_together': {('user', 'lesson')},
            },
        ),
        # ---- Add M2M field to ReadingParagraph (vocabulary_items) ----
        migrations.AddField(
            model_name='readingparagraph',
            name='vocabulary_items',
            field=models.ManyToManyField(blank=True, related_name='paragraph_occurrences', to='vocabulary.vocabulary'),
        ),

        # ---- Add tracking fields (created_at / updated_at / created_by / updated_by) ----

        # ReadingLesson
        migrations.AddField(
            model_name='readinglesson',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='readinglesson',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='readinglesson',
            name='created_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='readinglessons_created', to='account.account'),
        ),
        migrations.AddField(
            model_name='readinglesson',
            name='updated_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='readinglessons_updated', to='account.account'),
        ),

        # ReadingParagraph
        migrations.AddField(
            model_name='readingparagraph',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='readingparagraph',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='readingparagraph',
            name='created_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='readingparagraphs_created', to='account.account'),
        ),
        migrations.AddField(
            model_name='readingparagraph',
            name='updated_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='readingparagraphs_updated', to='account.account'),
        ),

        # ReadingVocabularyItem
        migrations.AddField(
            model_name='readingvocabularyitem',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='readingvocabularyitem',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='readingvocabularyitem',
            name='created_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='readingvocabitems_created', to='account.account'),
        ),
        migrations.AddField(
            model_name='readingvocabularyitem',
            name='updated_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='readingvocabitems_updated', to='account.account'),
        ),

        # ReadingComprehension
        migrations.AddField(
            model_name='readingcomprehension',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='readingcomprehension',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='readingcomprehension',
            name='created_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='readingcomps_created', to='account.account'),
        ),
        migrations.AddField(
            model_name='readingcomprehension',
            name='updated_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='readingcomps_updated', to='account.account'),
        ),

        # UserReadingProgress
        migrations.AddField(
            model_name='userreadingprogress',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userreadingprogress',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='userreadingprogress',
            name='created_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='userreadingprogress_created', to='account.account'),
        ),
        migrations.AddField(
            model_name='userreadingprogress',
            name='updated_by',
            field=models.ForeignKey(null=True, blank=True, on_delete=django.db.models.deletion.SET_NULL, related_name='userreadingprogress_updated', to='account.account'),
        ),
    ]
