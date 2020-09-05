import { IRule, IOpenApiDocSegment, IOpenApiProp } from './interfaces/interfaces';
import { value } from 'jsonpath';
import * as assert from 'assert';
const refToJsonPath = (ref: string) => ref.replace(/#/g, '$').replace(/\//g, '.');

let parentDefs: IOpenApiDocSegment | null = null;

export const rulesFromOpenApiDefinitions = (openDoc: IOpenApiDocSegment, prepend = '$.'): IRule[] => {
  parentDefs = parentDefs === null ? openDoc : parentDefs;
  const definitions = openDoc.definitions || openDoc.properties;
  assert(definitions !== undefined);

  const ignoredProps = ['type', 'ApiResponse'];
  let rules: IRule[] = [];
  for (const propName in definitions) {
    let items: IRule[] = [];
    let currentProp: IOpenApiProp = definitions[propName];
    if (ignoredProps.includes(propName)) continue;
    if (typeof currentProp['$ref'] === 'string') {
      currentProp = <IOpenApiProp>value(parentDefs, refToJsonPath(currentProp['$ref']));
    }

    const currentPath = prepend + propName;

    if (currentProp.type === 'string') {
      if (currentProp.format === 'date-time') {
        items = [{ [currentPath]: 'is a date' }];
      } else {
        items = [{ [currentPath]: 'is text' }];
      }
    } else if (currentProp.type.includes('int') || currentProp.type.includes('float')) {
      items = [{ [currentPath]: 'is a number' }];
    } else if (currentProp.type === 'array') {
      if (typeof currentProp.items!['$ref'] === 'string') {
        items = rulesFromOpenApiDefinitions(
          value(parentDefs, refToJsonPath(currentProp.items!['$ref'])),
          currentPath + '.'
        );
      } else {
        const arrayType = currentProp.items!.type!;
        if (arrayType === 'string') {
          if ((<any>currentProp.items!).format === 'date-time') {
            items = [{ [currentPath]: 'is a date' }];
          } else {
            items = [{ [currentPath]: 'is text' }];
          }
        } else if (arrayType.includes('int') || arrayType.includes('float')) {
          items = [{ [currentPath]: 'is a number' }];
        }
      }
    } else if (currentProp.type === 'object') {
      items = rulesFromOpenApiDefinitions(currentProp, currentPath + '.');
    }

    rules = rules.concat(items);
  }

  return rules;
};
