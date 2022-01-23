mgeneratejs -n 50000 < testData/customerData.json | mongoimport -u admin -p <password> -c customerSingleView mongodb+srv://mycustomers.<clusterId>.mongodb.net/MyCustomers
mgeneratejs -n 100 < testData/consultantData.json | mongoimport -u admin -p <password> -c consultants mongodb+srv://mycustomers.<clusterId>.mongodb.net/MyCustomers
