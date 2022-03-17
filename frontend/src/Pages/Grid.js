import React, { useState } from "react";
import { EJSON } from "bson";
import { AgGridReact } from "ag-grid-react";
import Button from "@leafygreen-ui/button";
import { useRealmApp } from "../RealmApp";
import Header from "../Components/Header";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const Grid = () => {
    const app = useRealmApp();
    const [user] = useState(app.currentUser);
    const [rowData] = useState(EJSON.deserialize([
        { "_id": { "$oid": "61ed9a36198eef9e98f52605" }, "customerId": "002.720.479-02", "lastName": "Venturini", "firstName": "Victoria", "consultantId": 21, "birthdate": { "$date": "1957-01-30T00:00:00.292Z" }, "profession": "Investment Banker", "address": { "street": "Keulo Pass", "zip": "47478", "city": "Vizolu", "country": "Diego Garcia" }, "contact": { "email": [{ "address": "inebefa@hoefezur.ch", "type": "other" }], "phone": [{ "number": "06 14 11 91 92", "type": "private" }, { "number": "06 16 97 75 25", "type": "private" }] }, "crmInformation": { "segmentation": "high", "rating": "B", "lastPhysicalContactDate": { "$date": "2019-03-30T22:24:29.592Z" }, "totalPhysicalContactsLastYearPeriod": 25, "lastVirtualContactDate": { "$date": "2010-04-20T20:45:05.600Z" }, "totalVirtualContactsLastYearPeriod": 29, "totalContactsYtd": 59 }, "accounts": [{ "number": "746-78-9197", "type": "account", "balance": { "$numberDecimal": "100" }, "description": "Icdut." }, { "number": "685-15-9443", "type": "loan", "balance": { "$numberDecimal": "100" }, "description": "Ce wemruw." }], "consultant": { "_id": 21, "lastName": "Conner", "firstName": "Alvin", "rating": "key", "location": [16.48517, 47.82178] }, "age": { "$numberLong": "65" }, "totalBalance": { "$numberDecimal": "200" } },
        { "_id": { "$oid": "61ed9bb94c2a00bd9af01b5d" }, "customerId": "595.984.045-60", "lastName": "Battaglia", "firstName": "Milton", "consultantId": 78, "birthdate": { "$date": "1961-07-21T11:46:03.683Z" }, "profession": "City Manager", "address": { "street": "Heabe Heights", "zip": "50766", "city": "Hazuli", "country": "Iran" }, "contact": { "email": [{ "address": "bap@jihmi.pw", "type": "other" }, { "address": "bebbamub@utukojbib.mp", "type": "other" }, { "address": "iwla@algisic.de", "type": "private" }], "phone": [{ "number": "07 65 25 51 13", "type": "private" }, { "number": "07 40 46 67 46", "type": "business" }, { "number": "07 25 65 35 03", "type": "business" }] }, "crmInformation": { "segmentation": "ex-customer", "rating": "A", "lastPhysicalContactDate": { "$date": "2014-06-14T09:22:11.864Z" }, "totalPhysicalContactsLastYearPeriod": 46, "lastVirtualContactDate": { "$date": "2009-04-08T14:32:03.493Z" }, "totalVirtualContactsLastYearPeriod": 46, "totalContactsYtd": 32 }, "accounts": [{ "number": "370-84-0329", "type": "account", "balance": { "$numberDecimal": "-6605.02" }, "description": "Rih." }, { "number": "614-19-9484", "type": "account", "balance": { "$numberDecimal": "4276.54" }, "description": "Pabbejmu alva." }, { "number": "426-36-0013", "type": "depot", "balance": { "$numberDecimal": "2850.93" }, "description": "Fov po mufob." }, { "number": "483-11-9854", "type": "depot", "balance": { "$numberDecimal": "1281.27" }, "description": "Laihipap wesed." }, { "number": "232-04-7718", "type": "account", "balance": { "$numberDecimal": "2284.2" }, "description": "Aho dolmig idate." }, { "number": "957-94-8335", "type": "account", "balance": { "$numberDecimal": "-7479.41" }, "description": "Ka." }, { "number": "736-58-5827", "type": "account", "balance": { "$numberDecimal": "-7241.17" }, "description": "Jev on." }, { "number": "019-96-3859", "type": "account", "balance": { "$numberDecimal": "-1432.39" }, "description": "Hudaoc boltuvud ohanumca." }, { "number": "683-37-1384", "type": "account", "balance": { "$numberDecimal": "5168.64" }, "description": "Bohub enko azunok." }, { "number": "831-19-1581", "type": "depot", "balance": { "$numberDecimal": "-8628.23" }, "description": "Ki ak kigne." }, { "number": "694-96-7764", "type": "account", "balance": { "$numberDecimal": "-2713.97" }, "description": "Abihah wogfa." }], "consultant": { "_id": 78, "lastName": "Hoekstra", "firstName": "Emily", "rating": "professional", "location": [7.90857, 45.10757] }, "age": { "$numberLong": "60" }, "totalBalance": { "$numberDecimal": "-18238.61" } },
        {"_id":{"$oid":"61ed9bb94c2a00bd9af01b75"},"customerId":"125.306.218-88","lastName":"Parisi","firstName":"Mayme","consultantId":77,"birthdate":{"$date":"2004-04-10T01:53:50.047Z"},"profession":"Surveyor","address":{"street":"Zabeco Center","zip":"38124","city":"Woreshe","country":"Belarus"},"contact":{"email":[{"address":"wop@kul.hn","type":"business"},{"address":"wovezpes@gu.tt","type":"other"},{"address":"jaze@zudnituf.bi","type":"other"}],"phone":[{"number":"06 68 67 99 45","type":"private"},{"number":"07 42 69 86 82","type":"business"}]},"crmInformation":{"segmentation":"medium","rating":"B","lastPhysicalContactDate":{"$date":"2013-06-08T04:18:00.922Z"},"totalPhysicalContactsLastYearPeriod":17,"lastVirtualContactDate":{"$date":"2001-11-02T18:14:13.684Z"},"totalVirtualContactsLastYearPeriod":0,"totalContactsYtd":92},"accounts":[{"number":"587-37-7701","type":"account","balance":{"$numberDecimal":"5925.56"},"description":"Ma rev."},{"number":"997-67-0419","type":"account","balance":{"$numberDecimal":"-8743.15"},"description":"Luwud fafu ibogi."},{"number":"949-47-7502","type":"depot","balance":{"$numberDecimal":"-7425.4"},"description":"Egpe eliwoomo."},{"number":"928-35-4361","type":"account","balance":{"$numberDecimal":"-8065.8"},"description":"Culju oz taucica."},{"number":"282-92-1065","type":"account","balance":{"$numberDecimal":"6368.71"},"description":"Geporkej ge ewe."},{"number":"175-40-9038","type":"account","balance":{"$numberDecimal":"7036.61"},"description":"Tambeb."},{"number":"701-49-8687","type":"loan","balance":{"$numberDecimal":"-3355.69"},"description":"Be marfubni."},{"number":"819-85-5695","type":"loan","balance":{"$numberDecimal":"-4344.63"},"description":"Ful igewuebu."},{"number":"131-47-4136","type":"account","balance":{"$numberDecimal":"-7007.88"},"description":"Na pemebuf."},{"number":"202-72-2274","type":"loan","balance":{"$numberDecimal":"887"},"description":"Tiicgo pumipo."},{"number":"836-58-1901","type":"depot","balance":{"$numberDecimal":"-6375.78"},"description":"Avinujuj hikhela."},{"number":"259-56-1173","type":"account","balance":{"$numberDecimal":"3289.16"},"description":"Sujlasu elempim."},{"number":"655-20-1385","type":"account","balance":{"$numberDecimal":"-4637.98"},"description":"Aj hoki."},{"number":"294-71-3297","type":"depot","balance":{"$numberDecimal":"-8538.81"},"description":"Wutpef."},{"number":"698-01-4662","type":"depot","balance":{"$numberDecimal":"-7429.82"},"description":"Wigas lavroja."},{"number":"560-98-3020","type":"account","balance":{"$numberDecimal":"6948.46"},"description":"Vawaru butov."},{"number":"189-26-0349","type":"account","balance":{"$numberDecimal":"-1492.54"},"description":"Tadlin cesu."}],"consultant":{"_id":77,"lastName":"Nardoni","firstName":"Cynthia","rating":"senior","location":[5.39689,53.7777]},"age":{"$numberLong":"17"},"totalBalance":{"$numberDecimal":"-36961.98"}}
    ]));
    
    const [columnDefs] = useState([
        { field: "customerId" },
        { field: "lastName" },
        { field: "firstName" },
        { field: "age" },
        { field: "country", valueGetter: "data.address.country" },
        { field: "segment", valueGetter: "data.crmInformation.segmentation" },
        { field: "totalBalance" },
        { field: "totalContactsYtd", valueGetter: "data.crmInformation.totalContactsYtd" }
    ]);

    return (
        <>
            <Header />
            <div         
                style={{ height: "calc(100vh - 280px)" }}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                />
            </div>
            <div style={{margin: 10}}>
            <p>User: {user.id ? `${user.profile.email} (${user.providerType})` : "not logged in"}</p>
            <Button variant="primary" onClick={() => app.logOut()}>Logout</Button>
        </div>

        </>
    )
}

export default Grid;