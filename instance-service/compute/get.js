function main(
    instanceName,
    project = 'apcentrallogging',
    zone = 'asia-south2-a'
) {

    const compute = require("@google-cloud/compute");

    async function get() {

        const instancesClient = new compute.InstancesClient();

        return await instancesClient.get({
            instance: instanceName,
            project: project,
            zone: zone
        })
    }


    return get();
}

module.exports = main;