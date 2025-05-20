import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { parse } from "yaml";

function buildBluePrints() {
  // read yaml
  const f = readFileSync(
    join(process.cwd(), "src/assets/sde/fsd/blueprints.yaml"),
    "utf8",
  );
  const data = parse(f);

  // build data
  const bps = {};
  for (const key in data) {
    const dd = data[key];

    // skip null manufacturing
    if (!dd.activities.manufacturing) continue;

    bps[key] = {
      id: key,
      blueprintTypeID: dd.blueprintTypeID,
      activities: {
        manufacturing: {
          materials: dd.activities.manufacturing.materials,
          products: dd.activities.manufacturing.products,
          time: dd.activities.manufacturing.time,
        },
      },
    };
  }

  // save to json
  writeFileSync(
    join(process.cwd(), "src/assets/json/sde-blueprints.json"),
    JSON.stringify(bps, null, 2),
    "utf8",
  );
}

function buildMarketGroups() {
  // read yaml
  const f = readFileSync(
    join(process.cwd(), "src/assets/sde/fsd/marketGroups.yaml"),
    "utf8",
  );
  const data = parse(f);

  // build data
  const mg = {};
  for (const key in data) {
    const dd = data[key];
    mg[key] = {
      id: key,
      name: dd.nameID.zh,
      hasTypes: dd.hasTypes,
      parentGroupID: dd.parentGroupID,
    };
  }

  // save to json
  writeFileSync(
    join(process.cwd(), "src/assets/json/sde-marketgroups.json"),
    JSON.stringify(mg, null, 2),
    "utf8",
  );
}

function buildTypes() {
  // read yaml
  const f = readFileSync(
    join(process.cwd(), "src/assets/sde/fsd/types.yaml"),
    "utf8",
  );
  const data = parse(f);

  // build data
  const tts = {};
  for (const key in data) {
    const dd = data[key];

    // skip if not published
    if (!dd.published) continue;

    tts[key] = {
      id: key,
      name: dd.name.zh,
      marketGroupID: dd.marketGroupID,
    };
  }

  // save to json
  writeFileSync(
    join(process.cwd(), "src/assets/json/sde-types.json"),
    JSON.stringify(tts, null, 2),
    "utf8",
  );
}

function main() {
  console.log("building sde...");
  try {
    buildBluePrints();
    console.log("blueprints done");
    buildMarketGroups();
    console.log("market groups done");
    buildTypes();
    console.log("types done");
    console.log("build sde done");
  } catch (err) {
    console.error("build sde error", err);
  }
}

main();
