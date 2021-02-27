const classRuleFor = require("../classRuleFor");

const inheritance = (node, context) => {
  if (node.superClass != null) {
    context.report({
      node,
      message: "Avoid using inheritance. Prefer composition instead"
    });
  }
};

module.exports = classRuleFor(inheritance);
