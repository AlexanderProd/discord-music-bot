const { digitalOceanApiKey } = require('./../config.json');
const DigitalOcean = require('do-wrapper').default, api = new DigitalOcean(digitalOceanApiKey, 2);
const fs = require('fs');
const functions = require('../functions.js')

module.exports = {
    name: 'server',
    description: 'Wird verwendet um einen Gamerserver zu verwalten.',
    async execute(message, args) {

      /* api.accountGetKeys().then((data) => {
        console.log("ID of first SSH Key: " + data.body.ssh_keys[0].id);
      }).catch((error) => {
        console.log(error.body);
      });

      api.dropletsGetAll().then((data) => {
        console.log(data.body);
      }).catch((error) => {
        console.log(error.body);
      }); */

      if (args[0] == "start"){
        await createDroplet(`direwolf20--${await functions.timestamp()}`, await getSnapshotId());
        message.channel.send("Alles klar Diggah Server wird gestartet!")

        const timeout = ms => new Promise(res => setTimeout(res, ms));
        await timeout(120000);

        assignFloatingIp('138.68.113.86', await getActiveDropletId(), message);
        message.channel.send("Dude es kann a weng dauern bis der Server im Spiel zu sehen ist.")
      }

      if (args[0] == "assign"){
        assignFloatingIp(args[1], await getActiveDropletId(), message);
      }

      if (args[0] == "stop"){
        message.reply("Stecker wird gezogen.")
        shutdownDroplet(await getActiveDropletId());
        await setTimeout(destroyDroplet, 30000, await getActiveDropletId());
        message.channel.send("Server is jetzt abgeschaltet!");
      }

      if(args[0] == "snapshot"){
        createSnapshot(await getActiveDropletId(), "test-snapshot");
      }

    },
}

function destroyDroplet(droplet_id){
  api.dropletsDelete(droplet_id).then((data) => {
    console.log("Deleted droplet!");
  }).catch((error) => {
    console.log(error.body);
  });
}

function shutdownDroplet(droplet_id){
  api.dropletsRequestAction(droplet_id,
    {
      "type": "shutdown"
    }
  ).then((data) => {
    console.log(data.body);
    console.log("Shutdown sucessfull!")
  }).catch((error) => {
    console.log(error.body);
  });
}

function createSnapshot(droplet_id, snapshot_name){
  api.dropletsRequestAction(droplet_id,
    {
      "type": "snapshot",
      "name": snapshot_name
    }
  ).then((data) => {
    console.log(`Created Snapshot from droplet ${droplet_id}`);
    writeToJSON(data.body, "snapshot-properties");
    console.log("Snapshot properties were saved to file.");
  }).catch((error) => {
    console.log(error.body);
  });
}

function assignFloatingIp(floating_ip, droplet_id, message){
  api.floatingIpsRequestAction(floating_ip,
    {
      "type": "assign",
      "droplet_id": droplet_id
    }
  ).then((data) => {
    message.channel.send("Server IP ist " + floating_ip)
    console.log(`Assigned ${floating_ip} to droplet!`);
  }).catch((error) => {
    console.log(error.body);
  });
}

function createDroplet(name, image){
  api.dropletsCreate({
    "name": name,
    "region": "fra1",
    "size": "c-2",
    "image": `${image}`,
    "ssh_keys":[
      "22040871"
    ],
    "backups":false,
    "ipv6":false,
    "user_data":null,
    "private_networking":null,
    "volumes": null,
    "tags":null
  }).then((data) => {
    writeToJSON(data.body, "server-properties");
    console.log("Created droplet with ID: " + data.body.droplet.id);
    console.log("Droplet properties were saved to file.");
  }).catch((error) => {
    console.log(error.body);
  });
}

function getSnapshotId(){
  return api.imagesGetAll({
    "private": true
  }).then((data) => {
    console.log("ID of first Snapshot: " + data.body.images[0].id);
    return(data.body.images[0].id);
  }).catch((error) => {
    console.log(error.body);
  });
}

function writeToJSON(input, fileName){
  var content = JSON.stringify(input);

  fs.writeFile(`${fileName}.json`, content, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }

  });
}

function getActiveDropletId() {
   var objectValue = JSON.parse(fs.readFileSync('server-properties.json', 'utf8'));
   return objectValue.droplet.id;
}
