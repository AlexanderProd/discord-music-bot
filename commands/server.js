const { digitalOceanApiKey } = require('./../config.json');
const DigitalOcean = require('do-wrapper').default, api = new DigitalOcean(digitalOceanApiKey, 2);
const fs = require('fs');

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
      if (args[0] == "create"){
        createDroplet(await getImagesId());
      }

      if (args[0] == "create") {
      }

      if (args[0] == "assign"){
        assignFloatingIp(args[1], message);
      }

      if (args[0] == "delete"){
        destroyDroplet(args[1], message);
      }

    },
}

function destroyDroplet(droplet_id, message){
  api.dropletsDelete(droplet_id).then((data) => {
    if(data !== undefined){
      console.log(data.body);
    } else {
      console.log("Deleted droplet!");
      message.channel.send("Server deleted!");
    }
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
  }).catch((error) => {
    console.log(error.body);
  });
}

function assignFloatingIp(floating_ip, message){
  api.floatingIpsRequestAction(floating_ip,
    {
      "type": "assign",
      "droplet_id": 102992992
    }
  ).then((data) => {
    message.reply("Sucessfully assgined!");
    console.log(data.body);
  }).catch((error) => {
    console.log(error.body);
  });
}

function createDroplet(image){
  api.dropletsCreate({
    "name": "server",
    "region": "fra1",
    "size": "c-1vcpu-2gb",
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
    console.log(data.body);
    writeToJSON(data.body);
    console.log("Created droplet with ID: " + data.body.droplet.id);
  }).catch((error) => {
    console.log(error.body);
  });
}

function getImagesId(){
  return api.imagesGetAll({
    "private": true
  }).then((data) => {
    console.log(data.body);
    console.log("ID of first Snapshot: " + data.body.images[0].id);
    return(data.body.images[0].id);
  }).catch((error) => {
    console.log(error.body);
  });
}

function writeToJSON(input){
  var content = JSON.stringify(input);

  fs.writeFile("server-properties.json", content, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
}
