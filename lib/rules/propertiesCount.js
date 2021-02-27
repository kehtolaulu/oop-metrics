const classRuleFor = require("../classRuleFor");

const propertiesCount = (node, context) => {
  let maxProperties = 3;
  let properties = findAllProperties(node);
  // if (properties.length > maxProperties) {
    context.report({
      node,
      message: `Found ${properties.length} properties, but expected no more than ${maxProperties}.`
    });
  // }
};

const findAllProperties = (classDefinition) => {
  return [
    ...findClassProperties(classDefinition),
    ...findConstructorProperties(classDefinition)
  ];
}

const findClassProperties = (classDefinition) => {
  return classDefinition.body.body.filter(member => member.type === "ClassProperty");
}

const findConstructorProperties = (classDefinition) => {
  let ctor = classDefinition.body.body.find(member =>
    member.type === "MethodDefinition" && member.kind === "constructor"
  );
  if (ctor === undefined) {
    return [];
  }
  return ctor.value.body.body.filter(statement =>
    statement.type === "ExpressionStatement"
      && statement.expression.type === "AssignmentExpression"
      && statement.expression.left.type === "MemberExpression"
  );
};

module.exports = classRuleFor(propertiesCount);
