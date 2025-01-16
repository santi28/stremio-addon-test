import parseTorrent from "parse-torrent";
import { addonBuilder, serveHTTP } from "stremio-addon-sdk";

const builder = new addonBuilder({
  id: "org.stremio.magent-links",
  version: "1.0.0",
  name: "Magent Links",
  description: "Brings the stream from remote magnet links",
  catalogs: [],
  resources: ["stream"],
  types: ["series"],
  idPrefixes: ["tt"], // for IMDB ids
});

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

// Manejador de streams
builder.defineStreamHandler(async ({ type, id }) => {
  console.log(`Solicitud de stream recibida: Tipo=${type}, ID=${id}`);

  if (type !== "series") {
    console.warn(`Tipo no soportado: ${type}`);
    return { streams: [] };
  }

  const links = magnetLinks[id];
  if (!links) {
    console.warn(`No se encontraron enlaces para el ID: ${id}`);
    return { streams: [] };
  }

  try {
    // Mapear los enlaces magnet a streams compatibles
    const streams = await Promise.all(
      links.map(async (item) => {
        try {
          const parsed = await parseTorrent(item.magnet);

          return {
            title: item.title,
            infoHash: parsed.infoHash,
            sources: [...(parsed.xt || []), ...(parsed.tr || [])],
          };
        } catch (error) {
          console.error(`Error al analizar el enlace magnet: ${item.magnet}`, error);
          return null;
        }
      })
    );

    // Filtrar streams válidos
    return { streams: streams.filter((s) => s !== null) };
  } catch (error) {
    console.error("Error en el manejador de streams:", error);
    return { streams: [] };
  }
});

// Iniciar el servidor HTTP
const PORT = 7800;
const addonInterface = builder.getInterface();

serveHTTP(addonInterface, { port: PORT });

console.log(`Stremio addon ejecutándose en http://localhost:${PORT}`);