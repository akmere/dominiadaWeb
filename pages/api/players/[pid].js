import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
    const { pid } = req.query;
    const data = await prisma.$queryRaw`SELECT Nick, Role, RegisteredOn FROM Players WHERE Pk=${parseInt(pid)}`;

    res.status(200).json(data);
}