const { digitalOceanApiKey } = require('./../config.json');
const DigitalOcean = require('do-wrapper').default, api = new DigitalOcean(digitalOceanApiKey, 10);
const fs = require('fs');
const f = require('../functions.js');
const timeout = ms => new Promise(res => setTimeout(res, ms));

var running = false;

module.exports = {
    name: 'server',
    description: 'Wird verwendet um einen Gamerserver zu verwalten.',
    async execute(message, args) {
      console.log(f.t()+message.author.tag+` used the server command`);
      console.log(f.t()+"Server is " + (running == true ? "running." : "not running."));

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

      if ((args[0] == "start") && (running === false)){
        running = true;
        await createDroplet(`direwolf20--${await f.timestamp()}`, await getLatestSnapshotId()/* "36600050" */);
        message.channel.send("Alles klar, Server wird gestartet!")

        await timeout(120000);

        await assignFloatingIp('138.68.113.86', await getActiveDropletId(), message);
        await message.channel.send("Server wurde gestartet, er könnte aber noch nicht sofort im Spiel zu sehen sein.")
      }

      if (args[0] == "assign"){
        assignFloatingIp(args[1], await getActiveDropletId(), message);
      }

      if (args[0] == "stop" && (running === true)){
        console.log(f.t()+ "Shuttung down server");

        const oldSnapshot = await getLatestSnapshotId();

        await shutdownDroplet(await getActiveDropletId());
        await createSnapshot(await getActiveDropletId(), `direwolf20--${f.timestamp()}`);

        await setTimeout(destroyDroplet, 300000, await getActiveDropletId());
        message.channel.send("Server wird heruntergefahren!");

        await deleteSnapshot(oldSnapshot);
        running = false;
      }

      if(args[0] == "snapshot"){
        createSnapshot(await getActiveDropletId(),"test")
      }

    },
}


function destroyDroplet(droplet_id){
  api.dropletsDelete(droplet_id).then((data) => {
    console.log(f.t()+"Deleted droplet!");
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
    console.log(f.t()+"Shutdown sucessfull!")
  }).catch((error) => {
    console.log(error.body);
  });
}


async function createSnapshot(droplet_id, snapshot_name){
  await api.dropletsRequestAction(droplet_id,
    {
      "type": "snapshot",
      "name": snapshot_name
    }
  ).then((data) => {
    console.log(f.t()+`Created Snapshot ${data.body.action.id} from droplet ${droplet_id}`);
  }).catch((error) => {
    console.log(error.body);
  });

  await timeout(420000);
  api.dropletsGetSnapshots(droplet_id).then((data) => {
    writeToJSON(data.body.snapshots[0],"snapshot-properties")
    console.log(f.t()+"Snapshot properties were saved to file.");
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
    console.log(f.t()+`Assigned ${floating_ip} to droplet!`);
  }).catch((error) => {
    console.log(error.body);
  });
}


function createDroplet(name, image){
  api.dropletsCreate({
    "name": name,
    "region": "fra1",
    "size": "s-4vcpu-8gb",
    "image": `${image}`,
    "ssh_keys":[
      "22040871"
    ],
    "backups":false,
    "ipv6":false,
    "user_data":null,
    "private_networking":null,
    "volumes": null,
    "monitoring":true,
    "tags":null
  }).then((data) => {
    writeToJSON(data.body, "server-properties");
    console.log(f.t()+"Created droplet with ID: " + data.body.droplet.id);
    console.log(f.t()+"Droplet properties were saved to file.");
  }).catch((error) => {
    console.log(error.body);
  });
}


function getSnapshotId(){
  return api.imagesGetAll({
    "private": true
  }).then((data) => {
    console.log(f.t()+"ID of first Snapshot: " + data.body.images[0].id);
    return(data.body.images[0].id);
  }).catch((error) => {
    console.log(error.body);
  });
}


function deleteSnapshot(snapshot_id){
  api.imagesDelete(snapshot_id).then((data) => {
    console.log(f.t()+`Deleted snapshot with ID: ${snapshot_id}`);
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


async function getLatestSnapshotId() {
   var objectValue = await JSON.parse(fs.readFileSync('snapshot-properties.json', 'utf8'));
   console.log(f.t()+`Latest snapshot ID is ${objectValue.id}`)
   return String(objectValue.id);
}
