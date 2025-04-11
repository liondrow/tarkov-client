#!/bin/bash
cd /var/www/tarkov-front || exit
git pull origin master
npm install
npm run build
