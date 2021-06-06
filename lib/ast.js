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

const findPropertyDeclarations = (classDefinition) => {
  let properties = new Set();
  traverse(classDefinition, (node) => {
    if (isPropertyDeclaration(node)) {
      properties.add(node.left.property.name);
    }
  });
  return [...properties];
};

const isPropertyUsage = (node) => {
  return node.type === "MemberExpression"
      && node.object.type === "ThisExpression";
};

const findPropertyUsages = (methodDefinition) => {
  let properties = new Set();
  traverse(methodDefinition, (node) => {
    if (isPropertyUsage(node)) {
      properties.add(node.property.name);
    }
  });
  return [...properties];
};

const findAllMethods = (root) => {
  let methods = [];
  traverse(root, (node) => {
    if (node.type === "MethodDefinition") {
      methods.push(node);
    }
  });
  return methods;
};

const getMethodName = (methodDefinition) => {
  if (methodDefinition.type !== "MethodDefinition") {
    throw new Exception(`Expected MethodDefinition, got ${methodDefinition.type}`);
  }

  if (methodDefinition.kind === "constructor") {
    return "constructor";
  } else if (methodDefinition.kind === "method") {
    return methodDefinition.key.name;
  } else if (methodDefinition.kind === "get") {
    return "get " + methodDefinition.key.name;
  } else if (methodDefinition.kind === "set") {
    return "set " + methodDefinition.key.name;
  } else {
    throw new Exception(`Unsupported MethodDefinition kind ${methodDefinition.kind}`);
  }
}


module.exports = {
  children, traverse, isPropertyDeclaration, findPropertyDeclarations,
  getMethodName, findPropertyUsages, isPropertyUsage, findAllMethods
};
