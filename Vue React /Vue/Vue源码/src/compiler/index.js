/* @flow */

import { parse } from "./parser/index"; // 解析器
import { optimize } from "./optimizer"; // 优化器
import { generate } from "./codegen/index"; // 生成器
import { createCompilerCreator } from "./create-compiler"; // 主要逻辑都在这里执行，

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options); // 1.解析ast语法树
  if (options.optimize !== false) {
    optimize(ast, options); // 2.对ast树进行标记,标记静态节点
  }
  const code = generate(ast, options); // 3.生成代码
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  };
});
