const fs = require("fs").promises; // Use fs.promises for promise-based file operations

const inputListPath = "./optionIds-regions.json";
const loadArrayPath = "./regions.doc.json";
const outputArrayPath = "./missing.regions.json";

const missingRegions = [];

async function main() {
  try {
    const inputList = await loadFile(inputListPath);
    const loadArray = await loadFile(loadArrayPath);

    // checkNoRegion(inputList, loadArray);
    countLocations(loadArray);

    // await saveFile(outputArrayPath, missingRegions);
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

async function saveFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    throw new Error(`Failed to save file at ${filePath}: ${err.message}`);
  }
}

const checkNoRegion = (inputList, outputArray) => {
  for (let inputRegion of inputList.sort()) {
    let existsInAnyRegion = false;
    const countryCode = inputRegion.slice(0, inputRegion.indexOf("-") + 1);
    for (let location of outputArray) {
      if (location.regions.some((r) => r.includes(countryCode))) {
        existsInAnyRegion = true;
        break;
      }
    }

    if (!existsInAnyRegion) {
      console.log(`${inputRegion} does not exist in any regions.`);
      missingRegions.push(inputRegion);
    }

    console.log(i);
  }
};

const countLocations = (outputArray) => {
  let i = 0;
  for (let location of outputArray) {
    i++;
  }
  console.log(i);
};

main();
