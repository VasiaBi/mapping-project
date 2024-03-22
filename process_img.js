const fs = require('fs');
const ExifReader = require('exifreader');
// import { load } from 'exifreader';

// Function to extract GPS coordinates and thumbnails from JPG files
function extractDataFromJPGFiles(directory) {
    // Read all files in the directory
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        const geojson = []
        // Filter JPG files
        const jpgFiles = files.filter(file => file.toLowerCase().endsWith('.jpg'));

        // Process each JPG file
        jpgFiles.forEach(file => {
            const filePath = `${directory}/${file}`;

            // Read file data
            try {
                // Read file content synchronously
                const data = fs.readFileSync(filePath);
                // Parse EXIF data
                const tags = ExifReader.load(data.buffer);

                // Extract GPS coordinates
                const gps = tags['GPSLatitude'] && tags['GPSLongitude']
                    ? {
                        latitude: tags['GPSLatitude'].description,
                        longitude: tags['GPSLongitude'].description
                    }
                    : null;

                // Extract thumbnail
                const thumbnail = tags['Thumbnail'] ? tags['Thumbnail'].image : null;
                if (gps && thumbnail) {
                    fs.writeFileSync(`${directory}/${file}.thumbnail.jpg`, Buffer.from(tags['Thumbnail'].image));
                    geojson.push({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [gps.longitude, gps.latitude]
                        },
                        properties: {
                            thumbnail: `${directory}/${file}.thumbnail.jpg`
                        }
                    })
                    // Do something with the extracted data
                    console.log('File:', file);
                    console.log('GPS:', gps);
                    console.log('Thumbnail:', `${directory}/${file}.thumbnail.jpg`);
                    console.log('---');
                }
            }
            catch (err) {
                console.error('Error reading file:', err);
            }
        });
        fs.writeFileSync("geodata.json", JSON.stringify(geojson))
    });

}

// Usage example
const directory = './assets';
extractDataFromJPGFiles(directory);
