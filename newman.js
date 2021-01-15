require("dot_functions_utils");
const newman = require('newman'); // require newman in your project
const { execSync } = require('child_process');
const { readdirSync, rmdirSync } = require('fs');

rmdirSync(`./reporte`, { recursive: true });

const FOLDER_NAME = process.env.FOLDER_NAME || "report";

const files = readdirSync("./collection", { encoding: "utf-8" });

const executeNewman = collection => new Promise((resolve, reject) => {
  newman.run({
    collection: require(`${__dirname}/collection/${collection}`),
    environment: require('./Environment/Environment.json'),
    reporters: ['cli', 'json'],
    reporter: {
      json: {
        export: `${__dirname}/${FOLDER_NAME}/${collection}`
      }
    }
  }, function (err) {
    if (err) return reject(err);
    console.log('collection run complete!');
    return resolve('collection run complete!');
  });
});

files.forEachSync(async collection => {
  console.log("------------------------------------------------------------------------------------------------------------------------------");
  console.log(`${__dirname}/collection/${collection}`);
  let commitInfo = execSync(`git log -1 --date=short --pretty=format:"Last commit by %an on %ad" -- ./collection/${collection}`).toString();
  commitInfo ? console.log(`\n${commitInfo}\n`) : console.log(`\nNo commit yet\n`);
  await executeNewman(collection);
});
