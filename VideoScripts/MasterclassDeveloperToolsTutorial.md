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
    - Create new Database MyCustomers
    - Create Collection Customers
    - Import customers.json
    - Show Data
    - Create Collection crmInformation
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
- Show how to insert a document
- Show how to find a document
- Show how to update a document
- Show how to delete a document
- Explain Anonymization Use Case. We identified field names containing CID using compass schema analysis. Now we want to replace the content of all fields in the cid array with the text "REDACTED"

```Javascript
// define array of fields to replace
const cid=["lastName", "firstName", "street", "address", "number", "description"];

// define recursive function to replace fields
const replace = (doc, cid) => {
  for (const key in doc) {
    if (cid.includes(key)) {
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
  print(`Replacing ${doc._id}`);
  db.Customers.replaceOne({_id: doc._id}, doc)
})
```

# MongoDB for VS Code Extension
- Show slide what is MongoDB for VS Code
- Show how to install the extension
- Show how to connect to the database

# Atlas CLI
- Show slide what is Atlas CLI
- Show how to install the CLI

