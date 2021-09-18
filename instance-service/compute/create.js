const uuid = require('uuid').v4;
/**
 * Sends an instance creation request to GCP and waits for it to complete.
 *
 * @param {string} projectId - ID or number of the project you want to use.
 * @param {string} zone - Name of the zone you want to check, for example: us-west3-b
 * @param {string} instanceName - Name of the new machine.
 * @param {string} machineType - Machine type you want to create in following format:
 *    "zones/{zone}/machineTypes/{type_name}". For example:
 *    "zones/europe-west3-c/machineTypes/f1-micro"
 *    You can find the list of available machine types using:
 *    https://cloud.google.com/sdk/gcloud/reference/compute/machine-types/list
 * @param {string} sourceImage - Path the the disk image you want to use for your boot
 *    disk. This can be one of the public images
 *    (e.g. "projects/debian-cloud/global/images/family/debian-10")
 *    or a private image you have access to.
 *    You can check the list of available public images using:
 *    $ gcloud compute images list
 * @param {string} networkName - Name of the network you want the new instance to use.
 *    For example: global/networks/default - if you want to use the default network.
 */
function main(
    instanceName,
    projectId = "apcentrallogging", 
    zone = "asia-south2-a",
    machineType = "e2-small",
    sourceImage = "projects/debian-cloud/global/images/debian-10-buster-v20210916",
    networkName = "global/networks/default"
) {
  // [START compute_instances_create]
/**
   * TODO(developer): Uncomment and replace these variables before running the sample.
   */
  // const projectId = 'YOUR_PROJECT_ID';
  // const zone = 'europe-central2-b'
  // const instanceName = 'YOUR_INSTANCE_NAME'
  // const machineType = 'n1-standard-1';
  // const sourceImage = 'projects/debian-cloud/global/images/family/debian-10';
  // const networkName = 'global/networks/default';

const compute = require("@google-cloud/compute");
//   const computeProtos = compute.protos.google.cloud.compute.v1;

  // Create a new instance with the values provided above in the specified project and zone.
async function createInstance() {
    const instancesClient = new compute.InstancesClient();

    console.log(`Creating the ${instanceName} instance in ${zone}...`);

    let [response] = await instancesClient.insert({
        instanceResource: {
            name: instanceName,
            disks: [
            {
                // Describe the size and source image of the boot disk to attach to the instance.
                initializeParams: {
                diskSizeGb: "10",
                sourceImage,
                },
                autoDelete: true,
                boot: true,
                // type: computeProtos.AttachedDisk.Type.PERSISTENT,
            },
            ],
            machineType: `zones/${zone}/machineTypes/${machineType}`,
            networkInterfaces: [
                {
                    // Use the network interface provided in the networkName argument.
                    network: networkName,
                    subnetwork: `regions/asia-south2/subnetworks/default`,
                    accessConfigs: [
                        {
                            name: 'External NAT'
                        }
                    ]
                },
            ],
            tags: {
                items: ['http-server', 'https-server']
            }
        },
        project: projectId,
        zone,
    });

    console.log({ response });

    const operationsClient = new compute.ZoneOperationsClient();

    // vars are passed directly to response
    while (response.status != "DONE") {
        const [operation] = await operationsClient.wait({
            operation: response.name,
            project: projectId,
            zone: response.zone.split('/').pop()
        });

        response = operation;
    }


    console.log("Instance created.");

    return { ...response, instance: instanceName };

}

    return createInstance();
  // [END compute_instances_create]
}

module.exports = main;