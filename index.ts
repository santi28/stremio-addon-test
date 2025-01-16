// const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
// const fs = require("fs");
// const path = require("path");

import parseTorrent from "parse-torrent";
import { addonBuilder, serveHTTP } from "stremio-addon-sdk";
// import fs from "fs";
// import path from "path";

// const MAGNETS_FILE = path.join(__dirname, "magnets.json");

// Función para leer y escribir enlaces magnet
// definir una forma de manejar la lista de reproducción
// function readMagnets() {
//   if (!fs.existsSync(MAGNETS_FILE)) {
//     fs.writeFileSync(MAGNETS_FILE, JSON.stringify([]));
//   }
//   return JSON.parse(fs.readFileSync(MAGNETS_FILE));
// }

// function addMagnet(magnet) {
//   const magnets = readMagnets();
//   magnets.push({ id: magnets.length + 1, magnet });
//   fs.writeFileSync(MAGNETS_FILE, JSON.stringify(magnets));
// }

const builder = new addonBuilder({
  id: "org.latest_release_streams",
  version: "1.0.0",
  name: "Remote Magnet Links Streams",
  description: "Brings the stream from remote magnet links",
  catalogs: [],
  resources: ["stream"],
  types: ["movie"],
  idPrefixes: ["tt"], // for IMDB ids
});

const API_URL = "https://api.npoint.io/3f10a371a620d5e65b3e";

const magnetLinks: { [key: string]: { title: string; magnet: string; }[] } = {
  "tt11640018:2:10": [
    {
      "title": "La Brea - S02E10 - 1080p - Dual Audio",
      "magnet": "magnet:?xt=urn:btih:60f834a10a4d763aefe5f1c650bfe4dce95ab7b1&dn=La.Brea.S02e10.2022.1080P-Dual-Lat&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2f&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce"
    }
  ],
  "tt11640018:2:11": [
    {
      "title": "La Brea - S02E11 - 1080p - Dual Audio",
      "magnet": "magnet:?xt=urn:btih:eaad3140e9d00905327e25267886402e6fb1d8ae&dn=La.Brea.S02e11.2022.1080P-Dual-Lat&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2f&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce"
    }
  ],
  "tt11640018:2:12": [
    {
      "title": "La Brea - S02E12 - 1080p - Dual Audio",
      "magnet": "magnet:?xt=urn:btih:0477cc08a1c6d2f1a120161839aa1d2b4b14bf68&dn=Brea.S02e12.2019.1080P-Dual-Lat&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce"
    }
  ],
  "tt11640018:2:13": [
    {
      "title": "La Brea - S02E13 - 1080p - Dual Audio",
      "magnet": "magnet:?xt=urn:btih:aaec0436a3b8bc28b8f0a3260de82713c3180e7b&dn=Brea.S02e13.2019.1080P-Dual-Lat&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce"
    }
  ],
  "tt11640018:2:14": [
    {
      "title": "La Brea - S02E14 - 1080p - Dual Audio",
      "magnet": "magnet:?xt=urn:btih:e1c95921c1976bf1da3470121a825fe84b9d41b6&dn=Brea.S02e14.2019.1080P-Dual-Lat&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce"
    }
  ]
}

builder.defineStreamHandler(async ({ type, id }) => {
  console.log("Stream requested:", type, id);

  if (type === "series") {
      try {
        if (magnetLinks[id]) {
          return {
                streams: await Promise.all(magnetLinks[id].map(async (item) => {
                  const { infoHash, xt, tr } = await parseTorrent(item.magnet);

                  return {
                    title: item.title,
                    infoHash: infoHash,
                    sources: [...xt || [], ...tr || []],
                  }
                }))
            }
          }
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  }
  return { streams: [] };
});

// Iniciar el servidor HTTP
const addonInterface = builder.getInterface();
serveHTTP(addonInterface, { port: 7800 });

console.log("Stremio addon running on http://localhost:7800");
