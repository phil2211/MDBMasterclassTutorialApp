# Compass

## Slide: What is compass
- UI for developers and also business
- Integrated Shell
- Free available on all platforms
## Download (go to download page)
### Explain Versions: 
- ReadOnly
- Isolated Edition
## Connect to MyCustomers
- Show different connection Options
    - Username Password
    - AWS IAM
        - Go to AWS 
        - Create new 3rd party access key
        - Provide Key/Secret to Compass 
          - ```AK...```
          - ```6x...```
        - Login fails
        - Go to Atlas and provide User ARN 
        - Try again
        - Login success
## Exploring Databases
- Show Overview of databases
- CRUD Operations on documents
- Datatypes and Datatype changing
- Schema visualization
    - Show sample_airbnb Documents Tab
    - Show Schema Tab
    - Analyze Schema
    - Go to address
    - Select only US
    - Go to address.location and zoom in on Hawaii
    - Select Poligon around O’ahu
    - Show query buit on top
    - refine query in documents
    - export Query to language
    - Show query history
    - create a favorite query and name it
- Explain Plans
    - Show explain Plans
- Index Management
    - Just show the indexes and how to create them
- Exporting / Importing Data 
    - Create new Database ```MyCustomers```
    - Create Collection ```Customers```
    - Import customers.json
    - Show Data
    - Create Collection ```crmInformation```
    - Import crmInformation.csv (change _id to ObjectID)
- Aggregation Pipeline
    - Build crmInformation merge pipeline
```JSON
[
  {
    $lookup: {
      from: "crmInformation",
      localField: "_id",
      foreignField: "_id",
      as: "crmInformation",
    },
  },
  {
    $set: {
      crmInformation: {
        $arrayElemAt: ["$crmInformation", 0],
      },
    },
  },
  {
    $project:
      {
        crmInformation:
          "$crmInformation.crmInformation",
      },
  },
  {
    $merge:
      {
        into: "Customers",
        on: "_id",
        whenMatched: "merge",
        whenNotMatched: "fail",
      },
  },
]
```

## Validation
Create new validation on ```sample_analytics``` ```customers``` collection

```JSON
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'username',
      'name',
      'email',
      'birthdate'
    ],
    properties: {
      username: {
        bsonType: 'string'
      },
      birthdate: {
        bsonType: 'date'
      },
      email: {
        bsonType: 'string',
        pattern: '@hotmail.com$',
        description: 'must be a hotmail address'
      }
    }
  }
}
```
# Shell
- Show slide what is MongoDB shell
- Show installed shell and shell built in compass
- Show how to connect to the database
- Show how to use the shell to connect to the database
- Show basic commands like show dbs, show collections, use, db, db.help()
- Show how to find a document
- Run age and totalBalance update script
```Javascript
db.Customers.updateMany(
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
);
```
- Explain Anonymization Use Case. We identified field names containing CID using compass schema analysis. Now we want to replace the content of all fields in the cid array with the text "REDACTED"

```Javascript
// define array of fields to replace
const cid=["lastName", "firstName", "street", "address", "number", "description"];

// define recursive function to replace fields
const replace = (doc, cid) => {
  for (const key in doc) {
    if (cid.includes(key) && typeof doc[key] === "string") {
      doc[key] = "REDACTED"
    } else if (typeof doc[key] === "object") {
      doc[key] = replace(doc[key], cid)
    }
  }
  return doc
}

// replace content of all fields in the cid array with the text "REDACTED"
db.Customers.find().forEach((doc) => {
  doc = replace(doc, cid);
  print(`Redacting ${doc._id}`);
  db.Customers.replaceOne({_id: doc._id}, doc)
})
```

# MongoDB for VS Code Extension
- Show slide what is MongoDB for VS Code
- Show how to install the extension
- Show how to connect to the database
- Show how to browse the database

- Show how to build an aggregation pipeline using co pilot
```JSON
use('MyCustomers');

db.Customers.findOne();

/* create a list of all Customers 
with an age greater than 30 and a total 
totalBalance greater than 1000.
Then group the results by profession 
and sort it by the highest count */


/* Add the age as integer in years of all Customers based
on their birthdate and the current date. Take into consideration
the day of the year of the effective birthdate. 
Sort the results by age in descending order and 
project only profession and age */

```

# Atlas CLI
- Show slide what is Atlas CLI
- Show how to install the CLI
- Login to Atlas using CLI
```atlas auth login -P tutorial```
- Show how to create a project

```atlas projects create MyNewProject -P tutorial```
- Set the projectID

```atlas config set -P tutorial project_id $(atlas project ls -P tutorial | grep MyNewProject | awk '{ print $1 }')```
- Show how to create a cluster

```atlas cluster create MyNewCluster --region=EU_CENTRAL_1 --tier M0 --provider AWS -P tutorial```
- get cluster status

```atlas cluster get MyNewCluster -P tutorial```
- Show how to create a database user

```atlas dbusers create -u testuser -p Passw0rd --role atlasAdmin -P tutorial```
- Show hot to set firewall

```atlas accessList create --currentIp -P tutorial```
- Show how to get the connection string

```atlas cluster connectionStrings describe MyNewCluster -P tutorial```

Describe how it all works together by showing the install.sh script