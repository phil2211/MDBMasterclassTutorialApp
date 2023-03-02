#!/bin/bash
# Load test data into the database
# This script assumes that you have installed the mgeneratejs tool
#
# Usage: loadTestdata.sh <username> <password> <clusterId>
if [ $# -ne 3 ]; then
    echo "Usage: loadTestdata.sh <username> <password> <clusterId>"
    exit 1
fi
USER=$1
PW=$2
CLUSTERID=$3
mgeneratejs -n 250000 < testData/queryBasics/customers.json | mongoimport -u $USER -p $PW -c customers mongodb+srv://mycustomers.$CLUSTERID.mongodb.net/TheCompany