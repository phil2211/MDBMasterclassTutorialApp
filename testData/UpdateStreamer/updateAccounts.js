"use strict";
const { MongoClient } = require("mongodb");
const _ = require("lodash");
const BSON = require("bson");
const argv = require('minimist')(process.argv.slice(2));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

console.log(argv);

// initiate mongo client
const client = new MongoClient(argv.uri, {
    useNewUrlParser: true
});

const run = async () => {
  try {
    await client.connect();

    // set database and collection
    const db = client.db(argv.db);
    const coll = db.collection(argv.collection);

    while (true) {
        const cursor = coll.aggregate([{ $match: {"address.country": "Switzerland"}},{ $sample: { size: 10 } }]);
        await cursor.forEach(async (doc) => {
            //console.log(_.random(-9999, 9999).toString());
            const accountNumber = doc.accounts[_.random(0, doc.accounts.length - 1)].number
            const newAmount = BSON.Decimal128(_.random(-9999, 9999).toString());
            const cursor2 = coll.updateOne(
                {
                    "_id": doc._id,
                    "accounts.number": accountNumber
                },
                {
                    "$set": {
                        "accounts.$.balance": newAmount
                    }
                }
            )
            console.table([Object.assign(await cursor2, { accountNumber }, { newAmount: newAmount.toString() }) ]);
        });
    }
      
    } catch(error) {
        console.log(error);
        process.exitCode = 1;
    } finally {
        client.close();
    }
};

run();