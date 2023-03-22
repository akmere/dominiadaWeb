import { createReadStream, statSync } from 'fs'
import { pipeline } from 'stream'
import getConfig from 'next/config'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default (req, res) => {
    try {
        const { pid } = req.query;
        let filePath = `${serverRuntimeConfig.recordingsFolder}/${pid}.hbr2`;
        var stat = statSync(filePath);
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': stat.size,
            'Content-disposition': `attachment; filename=${pid}.hbr2`
        });
        var readStream = createReadStream(filePath);
        readStream.pipe(res);
    }
    catch (e) {
        res.status(404).send('404 NOT FOUND')
    }
}