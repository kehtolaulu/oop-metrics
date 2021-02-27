module.exports = {
  rules: {
    "cohesion": require("./lib/rules/cohesion"),
    "inheritance": require("./lib/rules/inheritance"),
    "methods-count": require("./lib/rules/methodsCount"),
    "properties-count": require("./lib/rules/propertiesCount"),
  },
  rulesConfig: {
    "inheritance": [2]
  }
};
