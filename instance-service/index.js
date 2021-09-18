const express = require('express')
const PouchDb = require('pouchdb');

const createVM = require('./compute/create');
const getVMDetails = require('./compute/get');

const app = express();

const db = new PouchDb('instance_meta')

const data = {};

app.get('/', (req, res) => {
    return res.send('Instance Management Service UP');
});

app.post('/setup', async (req, res) => {
    const { user = 'randuser' } = req.query || {};

    try {
        const response = await createVM(`${user}-${Date.now()}`);

        await db.put(response);

        return res.status(200).json({ message: 'VM Created', meta: response });
    } catch (ex) {
        console.error(ex);
        return res.status(500).send({ message: 'Error spinning up VM.' })
    }
    
});

app.get('/fetchDetails', async (req, res) => {
    const { id } = req.query || {};

    if (!id) {
        return res.status(400).json({ message: 'Invalid UserName' });
    }

    // await db.get(id);
    const response = await getVMDetails(id);

    return res.json(response);

});

app.listen(process.env.PORT, () =>{
    console.log(`Server started on PORT ${process.env.PORT}`);
});