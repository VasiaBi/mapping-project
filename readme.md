# Mapping project
This is a template for the mapping project of the course HCI208.

---

It contains the assets directory with a number of photos, downloaded from a mobile phone.

---
the `process_img.js` file is a json script that when run

`node process_img.js` it creates the geodata .json file that contains info extracted from the photos (geolocation and thumbnails).

The `map.html` file contains the mapping application, it is a thematic map under the title *this winter trips*.

It shows the data from the geodata.json file, and the current location of the user.

Dependencies are:

`exifreader` and `fs`.