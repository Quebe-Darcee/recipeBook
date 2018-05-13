#!/bin/bash
killall gunicorn
gunicorn --workers 1 --bind 0.0.0.0:80 app:app &
