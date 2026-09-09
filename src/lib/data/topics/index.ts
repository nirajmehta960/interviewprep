import type { ConceptualQuestion } from "../conceptual";
import { javaQuestions } from "./java";
import { pythonQuestions } from "./python";
import { javascriptQuestions } from "./javascript";
import { springBootQuestions } from "./spring_boot";
import { oopQuestions } from "./oop";
import { dbmsQuestions } from "./dbms";
import { osQuestions } from "./os";
import { systemDesignQuestions } from "./system-design";
import { networksQuestions } from "./networks";
import { restApisQuestions } from "./rest-apis";
import { backendQuestions } from "./backend";
import { gitQuestions } from "./git";
import { testingQuestions } from "./testing";
import { behavioralQuestions } from "./behavioral";
import { dataAnalystQuestions } from "./data_analyst";
import { dataEngineerQuestions } from "./data_engineer";
import { businessAnalystQuestions } from "./business_analyst";
import { aiEngineerQuestions } from "./ai_engineer";
import { productManagerQuestions } from "./product_manager";
import { frameworksQuestions } from "./frameworks";
import { nodeQuestions } from "./nodejs";
import { expressQuestions } from "./express";

export { javaQuestions } from "./java";
export { pythonQuestions } from "./python";
export { javascriptQuestions } from "./javascript";
export { springBootQuestions } from "./spring_boot";
export { oopQuestions } from "./oop";
export { dbmsQuestions } from "./dbms";
export { osQuestions } from "./os";
export { systemDesignQuestions } from "./system-design";
export { networksQuestions } from "./networks";
export { restApisQuestions } from "./rest-apis";
export { backendQuestions } from "./backend";
export { gitQuestions } from "./git";
export { testingQuestions } from "./testing";
export { behavioralQuestions } from "./behavioral";
export { dataAnalystQuestions } from "./data_analyst";
export { dataEngineerQuestions } from "./data_engineer";
export { businessAnalystQuestions } from "./business_analyst";
export { aiEngineerQuestions } from "./ai_engineer";
export { productManagerQuestions } from "./product_manager";
export { frameworksQuestions } from "./frameworks";
export { nodeQuestions } from "./nodejs";
export { expressQuestions } from "./express";

/** Modular topic questions bundled together */
export const allModularQuestions: ConceptualQuestion[] = [
  ...javaQuestions,
  ...pythonQuestions,
  ...javascriptQuestions,
  ...springBootQuestions,
  ...oopQuestions,
  ...dbmsQuestions,
  ...osQuestions,
  ...systemDesignQuestions,
  ...networksQuestions,
  ...restApisQuestions,
  ...backendQuestions,
  ...gitQuestions,
  ...testingQuestions,
  ...behavioralQuestions,
  ...dataAnalystQuestions,
  ...dataEngineerQuestions,
  ...businessAnalystQuestions,
  ...aiEngineerQuestions,
  ...productManagerQuestions,
  ...frameworksQuestions,
  ...nodeQuestions,
  ...expressQuestions,
];

