const { findAllMethods, getMethodName, findPropertyUsages } = require("../ast");
const classRuleFor = require("../classRuleFor");

const cohesion = (node, context) => {
  if (node.type !== "ClassDeclaration") {
    throw new Exception("Implement finding all classes in program.");
  }

  let methodDefinitions = findAllMethods(node);
  let propertyUsages = {};

  methodDefinitions.forEach(method => {
    let methodName = getMethodName(method);
    propertyUsages[methodName] = findPropertyUsages(method);
  });

  let metric = lcom2(propertyUsages);

  if (metric > 0.25) {
    context.report({
      node,
      message: `The class lacks cohesion. LCOM2 = ${metric} (too high).`
    });
  }
};

const lcom2 = (propertyUsages) => {
  let methodCount = Object.keys(propertyUsages).length;
  let propertyCount = flattenValues(propertyUsages).length;
  let edges = countValues(propertyUsages);

  return 1 - edges / (methodCount * propertyCount);
};

const flattenValues = (object) => {
  let values = new Set();
  Object.values(object).forEach((array) => {
    array.forEach(value => values.add(value));
  });
  return [...values];
};

const countValues = (object) => {
  let valueCount = 0;
  Object.values(object).forEach((array) => {
    valueCount += array.length;
  });
  return valueCount;
};

module.exports = classRuleFor(cohesion);
