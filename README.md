# Welcome
This is a MongoDB Atlas App Services Demo which shows how to implement several concepts of the Atlas App Services in combination with the powerful lucene based Atlas Search feature.

There is (still in german) a YouTube tutorial available which shows step by step how to build and use this app.

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

1. Create an [Atlas](https://cloud.mongodb.com) account
2. Create a free cluster and name it MyCustomers
3. Install [mgenerate](https://github.com/rueckstiess/mgeneratejs) 
```npm install -g mgeneratejs```
4. Install the [Realm-CLI](https://www.mongodb.com/docs/atlas/app-services/cli/)
```npm install -g mongodb-realm-cli```
5. Load testdata to your cluster using the *loadTestdata.sh* script. Please set your cluster connection string with user and pw directly in the script then run the following command
```
  sh testData/loadTestdata.sh
```
6. Let the age field be calculated by using the following MongoDB query in the mongoshell:
```bash
mongosh "mongodb+srv://mycustomers.aagmh.mongodb.net/MyCustomers" --apiVersion 1 --username <username> --eval 'db.customerSingleView.updateMany(
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
8. Login your realm-CLI 
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
11. Create a Atlas Search index using the content of the following file and name it "customEnhanced"
```
  testdata/AtlasSearchDefinitions/customEnhanced.json
```

12. Install all dependencies for the frontend
```
  cd frontend
  npm install
```
12. Start your frontend and login
```
  npm start
```