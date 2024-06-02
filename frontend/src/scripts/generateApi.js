import path from 'path';
import fs from 'fs';
import { generateApi } from 'swagger-typescript-api';

const fileName = 'api.ts';

// eslint-disable-next-line no-undef
const directory = path.resolve(process.cwd(), './src/lib/api/specs');

generateApi({
  name: fileName,
  output: directory,
  url: 'http://localhost:3005/api-docs.json', // Local BE
  singleHttpClient: true,
  httpClientType: 'axios',
  prettier: {
    printWidth: 120,
    tabWidth: 2,
    trailingComma: 'all',
    parser: 'typescript',
  },
})
  .then(({ files }) => {
    files.forEach(({ content }) => {
      if (content) fs.writeFileSync(`${directory}/${fileName}`, content, (e) => console.error(e));
    });
  })
  .catch((e) => {
    console.error(e);
  });
