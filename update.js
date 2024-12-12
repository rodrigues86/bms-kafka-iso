const fs = require("fs").promises; // Use fs.promises for promise-based file operations

const inputListPath = "./optionIds-languages.json";
const outputArrayPath = "./languages.doc.json";

async function main() {
  try {
    const inputList = await loadFile(inputListPath);
    const outputArray = await loadFile(outputArrayPath);

    addRegions(inputList, outputArray);
    await saveFile(outputArrayPath, outputArray);

    console.log("Regions successfully added!");
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

const addRegions = (inputList, outputArray) => {
  for (let inputRegion of inputList.sort()) {
    const countryCode = inputRegion.slice(0, inputRegion.indexOf("-") + 1);
    for (let location of outputArray) {
      if (
        location.regions.some((r) => r.includes(countryCode)) &&
        !location.regions.includes(inputRegion) &&
        inputRegion.includes("-") &&
        inputRegion.length > 3
      ) {
        console.log(`${inputRegion} should be added.`);
        location.regions.push(inputRegion);
      }
    }
  }
};

main();
