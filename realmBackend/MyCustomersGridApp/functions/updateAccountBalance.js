exports = ({accountNumber, amount}) => {
  console.log(accountNumber);
  console.log(amount);
  const collection = context.services
    .get("mongodb-atlas")
    .db("MyCustomers")
    .collection("customerSingleView");
    
  collection.updateOne(
    {"accounts.number": accountNumber}, 
    {$inc: {"accounts.$.balance": amount}}
  );
  return {aknowledge: true};
};
