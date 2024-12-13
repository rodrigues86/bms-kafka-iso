import { promises as fs } from "fs";
import ISO6391 from "iso-639-1";
import { iso6393 } from "iso-639-3";
import { iso6392 } from "iso-639-2";
const inputListPath = "./optionIds-languages.json";

async function main() {
  try {
    const inputList = await loadFile(inputListPath);

    checkNoISO(inputList);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function loadFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Failed to load file at ${filePath}: ${err.message}`);
  }
}

const checkNoISO = (languages) => {
  const isoLangs = [
    ...iso6393.map((isoLang) => isoLang.iso6393),
    ...iso6392.map((isoLang) => isoLang.iso6391),
    ...iso6392.map((isoLang) => isoLang.iso6392B),
    ...iso6393.map((isoLang) => isoLang.iso6391),
  ];

  console.log(isoLangs.includes("dua"));
  const langsNoIso = languages.filter(
    (lang) =>
      !isoLangs.includes(lang.toLowerCase()) &&
      !ISO6391.validate(lang.toLowerCase())
  );
  console.log(JSON.stringify(langsNoIso));
};

main();
