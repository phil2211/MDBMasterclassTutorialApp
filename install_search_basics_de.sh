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
sh testData/loadProducts_de.sh admin Passw0rd $(atlas cluster connectionstrings describe MyCustomers -P MDBMasterclass | grep "mongodb+srv" | awk -F. '{print $2}') && \
atlas clusters search indexes create -P MDBMasterclass -f "testData/AtlasSearchDefinitions/customEnhanced.json" --clusterName MyCustomers