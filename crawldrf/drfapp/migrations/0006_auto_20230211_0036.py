# Generated by Django 3.2.16 on 2023-02-10 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drfapp', '0005_rename_uploadfileform_uploadfilemodel'),
    ]

    operations = [
        migrations.RenameField(
            model_name='uploadfilemodel',
            old_name='file',
            new_name='path',
        ),
        migrations.RemoveField(
            model_name='uploadfilemodel',
            name='title',
        ),
        migrations.AddField(
            model_name='uploadfilemodel',
            name='uuid',
            field=models.CharField(default=1, max_length=36),
            preserve_default=False,
        ),
    ]