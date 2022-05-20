import fs from 'fs'

export default async function handler(req, res) {
    const { pid } = req.query;
    const path = `public/recordings/${pid}.hbr2`
    let exists = false;
    console.log(`path: ${path}`);
    await fs.access(path, fs.constants.R_OK, err => {
        console.log("CHECKING")
        if(!err) {
            console.log('exists');
            exists = true;
        }
        else console.log(err);
        res.status(200).json(exists);
    });
}