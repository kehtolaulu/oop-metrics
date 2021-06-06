const classRuleFor = require("../classRuleFor");
const { traverse, isPropertyDeclaration } = require("../ast");

const propertiesCount = (node, context) => {
  let maxProperties = 3;
  let properties = findAllProperties(node);
  if (properties.length > maxProperties) {
    context.report({
      node,
      message: `Found ${properties.length} properties, but expected no more than ${maxProperties}. Properties found: ${properties}.`
    });
  }
};

const findAllProperties = (classDefinition) => {
  let properties = new Set();
  traverse(classDefinition, (node) => {
    if (isPropertyDeclaration(node)) {
      properties.add(node.left.property.name);
    }
  });
  return [...properties];
};

module.exports = classRuleFor(propertiesCount);
