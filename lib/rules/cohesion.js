const classRuleFor = require("../classRuleFor");

const cohesion = (node, context) => {
  if (node.superClass != null) {
    context.report({
      node,
      message: "Avoid using cohesion. Prefer composition instead"
    });
  }
};

module.exports = classRuleFor(cohesion);
