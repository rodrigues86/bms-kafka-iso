import { promises as fs } from "fs"; 
import { iso31661, iso31662, iso31663 } from "iso-3166";
const inputListPath = "./optionIds-regions.json";

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

const checkNoISO = (inputList) => {
  const iso1Regions = iso31661.map(
    (isoRegion) => `${isoRegion.alpha2}-${isoRegion.alpha3}`
  );
  const iso2Regions = iso31662.map((isoRegion) => `${isoRegion.code}`);
  const iso3Regions = iso31663.map(
    (isoRegion) => `${isoRegion.from.alpha2}-${isoRegion.from.alpha3}`
  );

  const isoRegions = [...iso1Regions, ...iso2Regions, ...iso3Regions];

  const regionsNoIso = inputList.filter((region) => !isoRegions.includes(region));

  console.log(JSON.stringify(regionsNoIso));
};

main();
