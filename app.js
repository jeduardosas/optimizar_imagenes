import fse from 'fs-extra';
import sharp from 'sharp';
import chalk from 'chalk';

const inputFolder = 'src';
const outputFolder = 'opt';

const targetSize = { width: 1920/* ,height: 1920 */ };
const smallSize = 200;

const processImage = async () => {
  try {
    // Crear las carpetas de salida
    await Promise.all([
      fse.ensureDir(`${outputFolder}/png`),
      fse.ensureDir(`${outputFolder}/webp`),
      fse.ensureDir(`${outputFolder}/small`),
    ]);

    const files = await fse.readdir(inputFolder);
    if (files.length === 0) {
      console.log(chalk.bgRed('No hay imágenes'));
      return;
    }

    for (const file of files) {
      const inputPath = `${inputFolder}/${file}`;
      const imageName = file.split('.')[0];
      const pngOutputPath = `${outputFolder}/png/${imageName}.png`;
      const webpOutputPath = `${outputFolder}/webp/${imageName}.webp`;
      const smallWebpOutputPath = `${outputFolder}/small/small_${imageName}.webp`;

      // Convertir la imagen a PNG
      await sharp(inputPath).resize(targetSize).toFile(pngOutputPath);

      // Convertir la imagen a WebP
      await sharp(inputPath).resize(targetSize).toFile(webpOutputPath);

      // Crear la miniatura en formato WebP
      await sharp(inputPath).resize({ width: smallSize, height: smallSize }).toFile(smallWebpOutputPath);

      console.log(chalk.bgRed(`Se ha procesado la imagen ${file}`));
    }

    console.log(chalk.bgBlue('Cámara papi, ya se acabó la opimización'));
    console.log(chalk.bgBlue(`Se han procesado ${files.length} imágenes`));
    console.log(chalk.bgBlue(`Puedes encontrar las imágenes procesadas en la carpeta ${outputFolder}`));
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

processImage();