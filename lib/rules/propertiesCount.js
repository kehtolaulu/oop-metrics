const classRuleFor = require("../classRuleFor");

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

const childrenByType = {
  ClassDeclaration: (node) => [node.body],
  ClassBody: (node) => node.body,
  MethodDefinition: (node) => [node.value],
  FunctionExpression: (node) => [node.body],
  BlockStatement: (node) => node.body,
  ExpressionStatement: (node) => [node.expression],
  IfStatement: (node) => [node.test, node.consequent, node.alternate].filter(Boolean),
  BinaryExpression: (node) => [node.left, node.right],
  ForStatement: (node) => [node.init, node.test, node.update, node.body],
  VariableDeclaration: (node) => node.declarations,
  VariableDeclarator: (node) => [node.id, node.init].filter(Boolean),
  Literal: (node) => [],
  AssignmentExpression: (node) => [node.left, node.right],
  CallExpression: (node) => [node.callee, ...node.arguments],
  MemberExpression: (node) => [node.object, node.property],
  ArrowFunctionExpression: (node) => [...node.params, node.body],
  Identifier: (node) => [],
  NewExpression: (node) => [node.callee, ...node.arguments],
  ReturnStatement: (node) => [node.argument].filter(Boolean),
  ThisExpression: (node) => [],
  WhileStatement: (node) => node.body,
  ConditionalExpression: (node) => [node.test, node.consequent, node.alternate],
};

const defaultChildrenSelector = (node) => {
  console.warn(`Unexpected AST node type ${node.type}`);
  return [];
};

const children = (node) => {
  let childrenSelector = childrenByType[node.type] || defaultChildrenSelector;
  return childrenSelector(node);
};

const traverse = (node, callback) => {
  callback(node);
  children(node).forEach(child => traverse(child, callback));
};

const isPropertyDeclaration = (node) => {
  return node.type === "AssignmentExpression"
      && node.left.type === "MemberExpression"
      && node.left.object.type === "ThisExpression";
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
