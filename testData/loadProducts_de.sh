#!/bin/bash
# Load test data into the database
# This script assumes that you have installed the mgeneratejs tool
#
# Usage: loadProducts_de.sh <username> <password> <clusterId>
if [ $# -ne 3 ]; then
    echo "Usage: loadProducts_de.sh <username> <password> <clusterId>"
    exit 1
fi
USER=$1
PW=$2
CLUSTERID=$3
cat ./testData/Katzenkistchen.json | mongoimport -u $USER -p $PW --jsonArray -c productDescriptions mongodb+srv://mycustomers.$CLUSTERID.mongodb.net/Products