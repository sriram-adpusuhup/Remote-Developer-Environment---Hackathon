const express = require('express')
const uuid = require('uuid').v4;

const createVM = require('./compute/create');
const getVMDetails = require('./compute/get');

const app = express();

app.get('/', (req, res) => {
    return res.send('Instance Management Service UP');
});

app.post('/setup', async (req, res) => {
    const { user = 'randuser' } = req.query || {};

    try {
        const instanceName = `${user}-${Date.now()}`;
        const instancePassword = uuid()

        const response = await createVM(instanceName, instancePassword);

        const [ instanceDetails = {} ] = await getVMDetails(instanceName);

        const [ networkInterface = {} ] = instanceDetails.networkInterfaces || {};

        const [ accessConfig = {} ] = networkInterface.accessConfigs || {};

        return res.status(200).json({ message: 'VM Created', meta: response, ip: accessConfig.natIP, username: 'apadmin', password: instancePassword });
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