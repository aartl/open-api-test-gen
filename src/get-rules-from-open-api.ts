import * as fileSystem from 'fs';
import { exit } from 'process';
import { rulesFromOpenApiDefinitions } from './rules';

if (process.argv.length !== 3) {
  console.log('Usage: node get-rules-from-open-api.js swagger-doc.json');
  exit(1);
}

const fileName = process.argv[2];

try {
  const content = fileSystem.readFileSync(fileName).toString('utf-8');
  const rules = rulesFromOpenApiDefinitions(JSON.parse(content));
  rules.forEach((r) => console.log(`${Object.keys(r)[0]}: ${r[Object.keys(r)[0]]}`));
} catch {
  console.error('Cannot read file:' + fileName);
  exit(1);
}
