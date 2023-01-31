#Check all dependencies
if ! command -v atlas &> /dev/null
then
    echo "atlas could not be found, please install it"
    exit
fi

if ! command -v mongosh &> /dev/null
then
    echo "mongosh could not be found, please install it"
    exit
fi

if ! command -v realm-cli &> /dev/null
then
    echo "realm-cli could not be found, please install it"
    exit
fi

if ! command -v npm &> /dev/null
then
    echo "npm could not be found, please install it"
    exit
fi

if ! command -v mgeneratejs &> /dev/null
then
    echo "mgeneratejs could not be found, please install it"
    exit
fi

#Create Atlas Project
atlas auth login -P MDBMasterclass && \
atlas projects create MDBMasterclass -P MDBMasterclass && \
atlas config set -P MDBMasterclass project_id `atlas project ls | grep MDBMasterclass | awk '{ print $1 }'` && \
atlas quickstart --skipMongosh --skipSampleData --provider AWS --region EU_CENTRAL_1 --tier M0 --username admin --password Passw0rd --accessListIp "0.0.0.0/0" --clusterName MyCustomers -P MDBMasterclass --force && \
sh testData/loadTestdata.sh admin Passw0rd $(atlas cluster connectionstrings describe MyCustomers -P MDBMasterclass | grep "mongodb+srv" | awk -F. '{print $2}') && \
mongosh $(atlas cluster connectionstrings describe MyCustomers -P MDBMasterclass | grep "mongodb+srv")/MyCustomers --apiVersion 1 --username admin --password Passw0rd --eval 'db.customerSingleView.updateMany(
    {},
    [{
      $set:
      {
        "totalBalance": {"$sum": "$accounts.balance"},
        "age": {
            "$subtract": [
                {"$subtract": [{"$year": "$$NOW"}, {"$year": "$birthdate"}]},
                {"$cond": [
                    {"$gt": [0, {"$subtract": [{"$dayOfYear": "$$NOW"},{"$dayOfYear": "$birthdate"}]}]},
                    1,
                    0
                ]}
            ]
        }
      }
    }]
  );' && \
atlas clusters search indexes create -P MDBMasterclass -f "testData/AtlasSearchDefinitions/customEnhanced.json" --clusterName MyCustomers && \
atlas project apiKeys create --desc realm-cli --role GROUP_OWNER -P MDBMasterclass > AtlasAPIKeys.txt && \
realm-cli login --api-key $(cat AtlasAPIKeys.txt | grep "Public API Key" | awk '{ print $4 }') --private-api-key $(cat AtlasAPIKeys.txt | grep "Private API Key" | awk '{ print $4 }') -y --profile MDBMasterclass && \
realm-cli push --local "backend/MyCustomersGridApp" --include-package-json -y --profile MDBMasterclass && \
echo "REACT_APP_REALMAPP="$(realm-cli apps list --profile MDBMasterclass | grep mycustomersgridapp | awk '{print $1}') > frontend/.env.local && \
realm-cli users create --type email --email test@example.com --password Passw0rd --profile MDBMasterclass -a $(realm-cli apps list --profile MDBMasterclass | grep mycustomersgridapp | awk '{print $1}') && \
echo "Please go to http://localhost:3000 and login with user: test@example.com and password: Passw0rd"
cd frontend && npm install && npm start