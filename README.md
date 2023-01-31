# Welcome to the MongoDB Atlas Demo App
This is a MongoDB Atlas App Services demo which shows how to implement several concepts of the Atlas App Services in combination with the powerful lucene based Atlas Search feature.

## Some impressions of what you get
### Pagination
![Pagination](/assets/pagination.gif)

### Cross Field Multi Match
![Cross Field Multi Match](/assets/cross%20field%20multi%20match.gif)

### Fuzzy Search
![Fuzzy Search](/assets/fuzzy%20search.gif)

### Live Update
![Live Update](/assets/live%20update.gif)

You can also find a quick overview by watching my presentation at MongoDB .local in Frankfurt. [Click here for the video on YouTube](https://youtu.be/vCH4Z4-LS6M)

There is (still in german) a YouTube tutorial available which shows step by step how to build and use this app. You can find them [here](https://youtube.com/playlist?list=PLw_MyzE5EpxVOrsqs9SyCnl3exSkPm1TR). English speaking audience: Please use subtitle to follow the tutorial. English version is in production ;-) 

> **MongoDB Realm** was renamed in summer 2022 to **Atlas App Services**

The following steps and features are available:

1. Create testdata
2. Merge data from two collections into one
3. Scheduled Triggers and Functions (calculate age from birthday)
4. Database Triggers and Functions (calculate total balance when account balance changes)
5. First steps in Atlas App Services
6. Imlementation of AG-Grid
7. GraphQL
8. Pagination
9. Rowcount
10. Introduction to Atlas Search
11. Live updates using Server Sent Events SSE
12. Advanced Search
13. Fast Count and Facets

# How to have fun :-)
> Everything works on an Atlas Free Tier. No Credit Card needed, free forever

1. Clone this repo and go to the directory
```
git clone https://github.com/phil2211/MDBMasterclassTutorialApp.git && \
cd MDBMasterclassTutorialApp
```
2. You need the following tools installed on your computer
- [Atlas CLI](https://www.mongodb.com/tools/atlas-cli)
- [MongoShell](https://www.mongodb.com/docs/v4.4/mongo/)
- [MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/). 
- [NodeJS](https://nodejs.org/)
---
I use Homebrew to do this on MacOS. If you don't have Homebrew, please follow the very simple instructions on the [Hombrew](https://brew.sh/) website to install it. The command below will install all necessary tools at once. If you are using Windows or Linux, see the links above for installation instructions for each component.
```
brew tap mongodb/brew && \
brew install mongodb-atlas-cli mongodb-database-tools node npm
```
3. *(optional)* Generate the autocompletion script for your shell. Learn more following this [link](https://www.mongodb.com/docs/atlas/cli/stable/command/atlas-completion-bash/). Here the example for MacOS 
```
atlas completion zsh > $(brew --prefix)/share/zsh/site-functions/_atlas
```
4. Install [mgenerate](https://github.com/rueckstiess/mgeneratejs) and the [Realm CLI](https://www.mongodb.com/docs/atlas/app-services/cli/)
```
npm install -g mgeneratejs mongodb-realm-cli
```
- **Restart your shell to use it**

> ***You can now follow the next steps manually or you just can execute the install.sh script to setup everything automatically***

---
5. Create an [Atlas](https://cloud.mongodb.com) account. If you are new to Atlas, please watch [Intro to MongoDB Atlas in 10 mins](https://youtu.be/xrc7dIO_tXk) to get you started
```
atlas setup -P MDBMasterclass
```
**OR**

5. If you already have an Atlas account, login to your Atlas account and choose your default project
```
atlas auth login -P MDBMasterclass
```
- **In both cases please interrupt the Atlas CLI to deploy your first free database by pressing CTRL+C.** There is actually a bug in the Atlas CLI not reacting on selecting No when you are asked.
---

6. Create a new project and a free cluster named MyCustomers
```
atlas projects create MDBMasterclass -P MDBMasterclass && \
atlas config set -P MDBMasterclass project_id `atlas project ls | grep MDBMasterclass | awk '{ print $1 }'` && \
atlas quickstart --skipMongosh --skipSampleData --provider AWS --region EU_CENTRAL_1 --tier M0 --username admin --password Passw0rd --accessListIp "0.0.0.0/0" --clusterName MyCustomers -P MDBMasterclass --force 
```
7. Wait until the new created cluster is ready. Check for the **state** to become **"IDLE"**
```
atlas cluster get MyCustomers -P MDBMasterclass
```
8. Load testdata to your cluster using the *loadTestdata.sh* script. Run the following command with your username password and the clusterId from your new created cluster
```
sh testData/loadTestdata.sh admin Passw0rd $(atlas cluster connectionstrings describe MyCustomers -P MDBMasterclass | grep "mongodb+srv" | awk -F. '{print $2}')
```
9. Pre-calculate the age and totalBalance field by using the following MongoDB query in the mongoshell
```bash
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
  );'
```
10. Create Atlas API keys for the realm-CLI login
```
atlas project apiKeys create --desc realm-cli --role GROUP_OWNER -P MDBMasterclass > AtlasAPIKeys.txt
```
11. Login your realm-CLI using the new generated API-Key
```
realm-cli login --api-key $(cat AtlasAPIKeys.txt | grep "Public API Key" | awk '{ print $4 }') --private-api-key $(cat AtlasAPIKeys.txt | grep "Private API Key" | awk '{ print $4 }') -y --profile MDBMasterclass
```
12. Import the backend code to Atlas using the realm-CLI (Please select MDBMasterclass as target project when prompted)
```
realm-cli push --local "backend/MyCustomersGridApp" --include-package-json -y --profile MDBMasterclass && \
echo "REACT_APP_REALMAPP="$(realm-cli apps list --profile MDBMasterclass | grep mycustomersgridapp | awk '{print $1}') > frontend/.env.local
```
13. Create an App user
```
realm-cli users create --type email --email test@example.com --password Passw0rd --profile MDBMasterclass -a $(realm-cli apps list --profile MDBMasterclass | grep mycustomersgridapp | awk '{print $1}')
```
14. Create an Atlas Search index using the content of the following file
```
atlas clusters search indexes create -P MDBMasterclass -f "testData/AtlasSearchDefinitions/customEnhanced.json" --clusterName MyCustomers
```

15. Install all dependencies for the frontend
```
cd frontend && \
npm install
```
16. Start your frontend and login
```
npm start
```
17. Wait for your browser to show the [login page](http://localhost:3000) and log in using these credentials:
- User: ``test@example.com``
- Password: ``Passw0rd`` 