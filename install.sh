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

if ! command -v appservices &> /dev/null
then
    echo "appservices could not be found, please install it"
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
echo "Logging in to Atlas and creating a Project" && \
atlas auth login -P MDBMasterclass && \
atlas projects create MDBMasterclass -P MDBMasterclass && \
atlas config set -P MDBMasterclass project_id `atlas project ls -P MDBMasterclass | grep MDBMasterclass | awk '{ print $1 }'` && \
echo "Creating a new Atlas Cluster" && \
atlas quickstart --skipMongosh --skipSampleData --provider AWS --region EU_CENTRAL_1 --tier M0 --username admin --password Passw0rd --accessListIp "0.0.0.0/0" --clusterName MyCustomers -P MDBMasterclass --force && \
echo "Loading test data into the cluster" && \
sh testData/loadTestdata.sh admin Passw0rd $(atlas cluster connectionstrings describe MyCustomers -P MDBMasterclass | grep "mongodb+srv" | awk -F. '{print $2}') && \
echo "Calculating the total balance and age for each customer" && \
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
echo "Creating a search index" && \
atlas clusters search indexes create -P MDBMasterclass -f "testData/AtlasSearchDefinitions/customEnhanced.json" --clusterName MyCustomers && \
echo "Creating API Keys to push backend application" && \
atlas project apiKeys create --desc appservices --role GROUP_OWNER -P MDBMasterclass > AtlasAPIKeys.txt && \
echo "Logging in with newly created API Keys" && \
appservices login --api-key $(cat AtlasAPIKeys.txt | grep "Public API Key" | awk '{ print $4 }') --private-api-key $(cat AtlasAPIKeys.txt | grep "Private API Key" | awk '{ print $4 }') -y --profile MDBMasterclass && \
echo "Creating a new app to get unique AppID" && \
appservices apps create --profile MDBMasterclass -n MyCustomersGridApp --provider-region aws-eu-central-1 -d LOCAL --local DeleteMe && \
echo "Move AppID configuration to the backend application" && \
mv DeleteMe/.mdb ./backend/MyCustomersGridApp && \
rm -rf DeleteMe && \
echo "Pushing the backend application to the cloud" && \
appservices push --local "backend/MyCustomersGridApp" --include-package-json -y --profile MDBMasterclass && \
echo "Saving the AppID to make it accessable by the frontend application" && \
echo "REACT_APP_REALMAPP="$(appservices apps list --profile MDBMasterclass | grep mycustomersgridapp | awk '{print $1}') > frontend/.env.local && \
echo "Creating a new user" && \
appservices users create --type email --email test@example.com --password Passw0rd --profile MDBMasterclass -a $(appservices apps list --profile MDBMasterclass | grep mycustomersgridapp | awk '{print $1}') && \
echo "Starting front end application in development mode" && \
echo "Please go to http://localhost:3000 and login with user: test@example.com and password: Passw0rd" && \
cd frontend && npm install && npm start