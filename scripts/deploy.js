import {resolve} from "path";

import fs from "fs";

import * as chameleon from "../utils/chameleon/index.js";

import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const { getBuiltThemeFiles } = chameleon;

const getFiles = () => {
  const path = resolve(__dirname, '../themes');
  return fs.readdirSync(path);
};

const buildThemeFiles = async () => {
  const files = getFiles();
  const mergedJson = files.reduce(
    (acc, file) => ({
      ...acc,
      [file]: JSON.parse(
        fs.readFileSync(
          resolve(__dirname, `../themes/${file}`)
        )
      ),
    }),
    {}
  );
  const themeFiles = await getBuiltThemeFiles(files, mergedJson);
  Object.keys(themeFiles).forEach(key => {
    fs.writeFileSync(
      resolve(__dirname, `../builtThemes/${key}.json`),
      JSON.stringify(themeFiles[key]),
      'utf8'
    );
  });
};

buildThemeFiles();
