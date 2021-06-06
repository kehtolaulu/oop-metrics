const classRuleFor = require("../classRuleFor");
const { findPropertyDeclarations } = require("../ast");

const propertiesCount = (node, context) => {
  if (node.type !== "ClassBody") {
    return;
  }

  let maxProperties = 3;
  let properties = findPropertyDeclarations(node);
  if (properties.length > maxProperties) {
    context.report({
      node,
      message: `Found ${properties.length} properties, but expected no more than ${maxProperties}. Properties found: ${properties}.`
    });
  }
};


module.exports = classRuleFor(propertiesCount);
