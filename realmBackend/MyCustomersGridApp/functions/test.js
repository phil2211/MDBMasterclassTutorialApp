exports = function(arg){
  if (arg === "error") {
    throw "this is an error"
  }
  
  header = "bla";

  return {hello: "world", arg: arg};
};