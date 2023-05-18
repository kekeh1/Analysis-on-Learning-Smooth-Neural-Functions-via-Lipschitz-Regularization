#!/bin/sh
chmod u+r+x startup.sh
chmod u+r+x PB/manage.py
chmod u+r+x run.sh
chmod u+r+x PB.sh
chmod u+r+x PF.sh
python3 -m pip install virtualenv
python3 -m virtualenv venv
source "venv/bin/activate"
pip install -r requirements.txt
./PB/manage.py makemigrations
./PB/manage.py migrate
cd pf
npm install --force
cd ..
