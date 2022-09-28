import {resolve} from "path";

import fs from "fs";

import * as chameleon from "../utils/chameleon/index.js";

import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const { getBuiltThemeFiles } = chameleon;

const getFiles = (localPath, root = '') => {
  const files = fs.readdirSync(localPath);
  const finalFiles = [];
  files.forEach(file => {
    const filePath = resolve(localPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {

      const children = getFiles(filePath, `${root}${file}/`);
      finalFiles.push(...children);
      return;
    }
    finalFiles.push(`${root}${file}`)
  });

  return finalFiles;
};

const buildThemeFiles = async () => {
  const path = resolve(__dirname, '../themes');
  const files = getFiles(path);
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
