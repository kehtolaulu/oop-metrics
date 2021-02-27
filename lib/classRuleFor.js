const classRuleFor = (validator) => ({
  create: context => ({
    ClassDeclaration: node => validator(node, context)
  })
});

module.exports = classRuleFor;
