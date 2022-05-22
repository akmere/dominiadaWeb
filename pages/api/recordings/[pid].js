import fs from 'fs'
import getConfig from 'next/config'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default async function handler(req, res) {
    const { pid } = req.query;
    const path = `${serverRuntimeConfig.recordingsFolder}/${pid}.hbr2`
    console.log(path);
    let exists = true;
    console.log(`path: ${path}`);
    try{
    await fs.promises.access(path);
    }
    catch (e) {
        exists = false;
    }

    return res.status(200).json(exists);
}