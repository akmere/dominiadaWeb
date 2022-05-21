import fs from 'fs'

export default async function handler(req, res) {
    const { pid } = req.query;
    const path = `public/recordings/${pid}.hbr2`
    let exists = true;
    console.log(`path: ${path}`);
    // await fs.access(path, fs.constants.R_OK, err => {
    //     console.log("CHECKING")
    //     if(!err) {
    //         console.log('exists');
    //         exists = true;
    //     }
    //     else {
    //         return res.status(200).json(exists);
    //     }
    //     return res.status(200).json(exists);
    // });
    try{
    await fs.promises.access(path);
    }
    catch (e) {
        exists = false;
    }

    return res.status(200).json(exists);
}