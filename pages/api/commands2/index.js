import fs from 'fs';

export default async function handler(req, res) {
    const path = `public/commands.json`;
    var data = fs.readFileSync(path, 'utf8');
    var json = JSON.parse(data);

    res.status(200).json(json);
}