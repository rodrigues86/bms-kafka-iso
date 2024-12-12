const fs = require("fs").promises; // Use fs.promises for promise-based file operations
const inputListPath = "./optionIds-regions.json";

async function main() {
  try {
    const inputList = await loadFile(inputListPath);

    checkNoFIPS(inputList);
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

const checkNoFIPS = async (inputList) => {
  const baseUrl =
    "https://api.census.gov/data/2020/acs/acs5?get=NAME&for=state:";
  const results = [];
  const codes = [];

  for (let fipsCode = 1; fipsCode <= 56; fipsCode++) {
    const formattedFipsCode = fipsCode.toString().padStart(2, "0");
    try {
      const response = await fetch(`${baseUrl}${formattedFipsCode}`);
      const data = await response.json();

      if (data.length > 1) {
        codes.push(`US-${formattedFipsCode}`);
        results.push({ code: `US-${formattedFipsCode}`, state: data[1][0] });
      } else {
        console.log(`FIPS US-${formattedFipsCode} not found.`);
      }
    } catch (error) {
      console.error(
        `Error fetching FIPS US-${formattedFipsCode}:`,
        error.message
      );
    }
  }

  console.log("Codes:", JSON.stringify(codes));
  console.log("Results:", results);
};

main();
