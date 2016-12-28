# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-28 11:52
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('play', '0004_auto_20161228_1149'),
    ]

    operations = [
        migrations.AddField(
            model_name='cookietracker',
            name='uid',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
        migrations.AddField(
            model_name='trail',
            name='uid',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
        migrations.AlterField(
            model_name='cookietracker',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='trail',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
