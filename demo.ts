import parseTorrent from 'parse-torrent'

console.log(await parseTorrent('magnet:?xt=urn:btih:60f834a10a4d763aefe5f1c650bfe4dce95ab7b1&dn=La.Brea.S02e10.2022.1080P-Dual-Lat&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2f&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce')
)