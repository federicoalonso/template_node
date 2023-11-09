#!/bin/bash

echo "Creating databases..."

mysql -u root -p$MYSQL_ROOT_PASSWORD <<MYSQL_SCRIPT
CREATE DATABASE IF NOT EXISTS tasks;
MYSQL_SCRIPT

echo "Databases created."