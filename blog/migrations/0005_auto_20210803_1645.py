# Generated by Django 3.1.3 on 2021-08-03 11:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_auto_20210803_1643'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='post_content',
            new_name='blog_content',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='post_title',
            new_name='blog_title',
        ),
    ]
