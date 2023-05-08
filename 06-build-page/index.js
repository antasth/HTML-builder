let fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const stylesPath = path.join(__dirname, "styles");
const distPath = path.join(__dirname, "project-dist");
const indexPath = path.join(__dirname, "project-dist", "index.html");
const assetsPath = path.join(__dirname, "assets");
const assetsCopyPath = path.join(__dirname, "project-dist", "assets");
const templatePath = path.join(__dirname, "template.html");
const componentsPath = path.join(__dirname, "components");

async function removeDir(dirPath) {
  await fsPromises.rm(dirPath, { recursive: true, force: true }, (err) => {
    console.error(err);
  });
}
async function createDir(dirPath) {
  fsPromises.mkdir(dirPath, { recursive: true });
}
async function readFile(filePath) {
  const readStream = fs.createReadStream(filePath, "utf-8");
  for await (const data of readStream) {
    return data;
  }
}
async function writeFile(filePath, data) {
  const file = fs.createWriteStream(filePath, "utf-8");
  file.write(data);
}
async function getComponents(data) {
  let begin = -1;
  let components = {};
  while ((begin = data.indexOf("{{", begin + 1)) !== -1) {
    let end = data.indexOf("}}", begin + 1);
    let componentName = data.slice(begin + 2, end);

    let componentData = await readFile(
      path.join(componentsPath, componentName + ".html")
    );
    components[componentName] = componentData;
  }
  return components;
}

async function replaceTemplate(template, components) {
  for (let component in components) {
    if (template.includes(component)) {
      template = template.replace(
        `{{${component}}}`,
        components[component] + "\n"
      );
    }
  }
  return template;
}

const mergeStyles = async (fromPath, toPath) => {
  const stylesBundle = fs.createWriteStream(
    path.join(toPath, "style.css"),
    "utf-8"
  );

  fs.readdir(fromPath, (error, files) => {
    if (error) throw error;

    files.forEach((file) => {
      let filePath = path.join(fromPath, file);
      fs.stat(filePath, (error, stats) => {
        if (error) throw error;
        if (stats.isFile() && path.extname(file) === ".css") {
          fs.readFile(filePath, "utf-8", (error, data) => {
            if (error) throw error;
            stylesBundle.write(data);
            stylesBundle.write("\n");
          });
        }
      });
    });
  });
};

const copyFiles = async (pathFrom, pathTo) => {
  fs.readdir(pathFrom, (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
      let filePath = path.join(pathFrom, file);
      fs.stat(filePath, (error, stats) => {
        if (error) throw error;
        if (stats.isFile()) {
          fs.copyFile(
            path.join(pathFrom, file),
            path.join(pathTo, file),
            (error) => {
              if (error) throw error;
            }
          );
        } else if (stats.isDirectory()) {
          const targetPath = path.join(pathTo, path.basename(file));
          createDir(targetPath);
          copyFiles(filePath, targetPath);
        }
      });
    });
  });
};

async function buildPage() {
  await removeDir(distPath);
  await createDir(distPath);
  const templateData = await readFile(templatePath);
  const components = await getComponents(templateData);
  const index = await replaceTemplate(templateData, components);
  await writeFile(indexPath, index);
  await mergeStyles(stylesPath, distPath);
  await createDir(assetsCopyPath);
  await copyFiles(assetsPath, assetsCopyPath);
}
buildPage();
