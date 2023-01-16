# Welcome to the MongoDB Atlas Demo App
This is a MongoDB Atlas App Services demo which shows how to implement several concepts of the Atlas App Services in combination with the powerful lucene based Atlas Search feature.

You can find a quick overview what you get by using the code in this repo by watching my presentation. [Click here for the video on YouTube](https://youtu.be/vCH4Z4-LS6M)

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

# How to install
For the latest version of the demo clone tha **main** branch and follow these instructions. 

> Everything works on a Atlas Free Tier. No Credit Card needed

1. Create an [Atlas](https://cloud.mongodb.com) account. If you are new to Atlas, please watch [Intro to MongoDB Atlas in 10 mins](https://youtu.be/xrc7dIO_tXk) to get you started
2. Create a free cluster and name it MyCustomers
3. Install [mgenerate](https://github.com/rueckstiess/mgeneratejs) 
```
npm install -g mgeneratejs
```
4. Install the [Realm-CLI](https://www.mongodb.com/docs/atlas/app-services/cli/)
```
npm install -g mongodb-realm-cli
```
5. Load testdata to your cluster using the *loadTestdata.sh* script. Run the following command with your username password and the clusterId from your new created cluster
```
sh testData/loadTestdata.sh <user> <password> <clusterId>
```
6. Let the age field be calculated by using the following MongoDB query in the mongoshell (please replace clusterId and username with your values):
```bash
mongosh "mongodb+srv://mycustomers.<clusterId>.mongodb.net/MyCustomers" --apiVersion 1 --username <username> --eval 'db.customerSingleView.updateMany(
    {},
    [{
      $set:
      {
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
7. Create an API key for Atlas using the "Access Manager" in Atlas
8. Login your realm-CLI using the generated API key
```
realm-cli login
```
9. Import the backend code to Atlas using the realm-CLI
```
cd realmBackend/MyCustomersGridApp
realm-cli push --include-package-json
```
10. Create an App user
```
realm-cli users create --type email --email test@example.com --password Passw0rd
```
11. Create an Atlas Search index using the content of the following file and name it "customEnhanced". 
```
testdata/AtlasSearchDefinitions/customEnhanced.json
```

12. Install all dependencies for the frontend
```
cd ../../frontend
npm install
```
13. Copy the ``.env`` file to a new file called ``.env.local``
14. Edit the ``.env.local`` file and paste your App-ID. You can find it by opening the "App Services" tab in Atlas and there opening the newly deployed "MyCustomersGridApp" 
15. Start your frontend and login
```
npm start
```