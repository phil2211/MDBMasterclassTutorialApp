mgeneratejs -n 50000 < fakeData/customerSingleView.json | mongoimport -u admin -p <password> -c customerSingleView mongodb+srv://mycustomers.<clusterId>.mongodb.net/MyCustomers
mgeneratejs -n 100 < fakeData/consultantData.json | mongoimport -u admin -p <password> -c consultants mongodb+srv://mycustomers.<clusterId>.mongodb.net/MyCustomers
