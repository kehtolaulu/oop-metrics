const classRuleFor = require("../classRuleFor");

const methodsCount = (node, context) => {
  let maxMethods = 3;
  let methods = node.body.body.filter(member => member.type === "MethodDefinition" && member.kind === "method");
  if (methods.length > maxMethods) {
    context.report({
      node,
      message: `Found ${methods.length} methods, but expected no more than ${maxMethods}.`
    });
  }
};

module.exports = classRuleFor(methodsCount);
