const fs = require("fs").promises; // Use fs.promises for promise-based file operations
const ISO6391 = require("iso-639-1");
const inputListPath = "./languages.doc.json";

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
  Object.keys(languages).forEach((language) => {
    if (!ISO6391.validate(language)) {
      console.log(`${language} does not exists in iso 639`);
    }
  });
};

main();
