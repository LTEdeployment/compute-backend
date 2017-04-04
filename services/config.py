# -*- coding: utf-8 -*-
# read config
import json
import os

NODE_ENV = os.environ.get('NODE_ENV') or 'local'
CONFIG_BASEDIR = os.environ.get('CONFIG_BASEDIR') or '..'
CONFIG_DIR = os.environ.get('CONFIG_DIR') or 'config'


with open('%s/%s/default.json' % (CONFIG_BASEDIR, CONFIG_DIR)) as config_file:
    config_default = json.load(config_file)

with open('%s/%s/%s.json' % (CONFIG_BASEDIR, CONFIG_DIR, NODE_ENV)) as config_file:
    config_env = json.load(config_file)

with open('%s/%s/local.json' % (CONFIG_BASEDIR, CONFIG_DIR)) as config_file:
    config_local = json.load(config_file)

config = config_default.copy()
if config_env != None:
    config.update(config_env)
config.update(config_local)
