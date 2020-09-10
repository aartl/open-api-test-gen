import * as fileSystem from 'fs';
import { exit } from 'process';
import { rulesFromOpenApiDefinitions } from './rules';
import fetch from 'node-fetch';
import { IRule } from './interfaces/interfaces';

const isUrl = (s: string) => /http(s)?:\/\//.test(s);

const getRulesFromLocalFile = (filePath: string): IRule[] => {
  try {
    const content = fileSystem.readFileSync(filePath).toString('utf-8');
    const rules = rulesFromOpenApiDefinitions(JSON.parse(content));
    return rules;
  } catch {
    console.error('Cannot read file: ' + filePath);
    exit(1);
  }
};

const getRulesFromUrl = async (url: string): Promise<IRule[]> => {
  try {
    const response = (await fetch(url)).json();
    const rules = rulesFromOpenApiDefinitions(await response);
    return rules;
  } catch {
    console.error('Could not get JSON from: ' + url);
    exit(1);
  }
};

const main = async () => {
  if (process.argv.length !== 3) {
    console.log('Usage: node get-rules-from-open-api.js swagger-doc.json');
    exit(1);
  }
  const fileName = process.argv[2];

  const rules = isUrl(fileName) ? await getRulesFromUrl(fileName) : getRulesFromLocalFile(fileName);
  rules.forEach((r) => console.log(`${Object.keys(r)[0]}: ${r[Object.keys(r)[0]]}`));
};

main().then(() => {
  exit(0);
});
