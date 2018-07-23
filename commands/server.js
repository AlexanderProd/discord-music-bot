const { digitalOceanApiKey } = require('./../config.json');
const DigitalOcean = require('do-wrapper').default, api = new DigitalOcean(digitalOceanApiKey, 2);

module.exports = {
    name: 'server',
    description: 'Wird verwendet um einen Gamerserver zu verwalten.',
    async execute(message, args) {

      /* api.accountGetKeys().then((data) => {
        console.log("ID of first SSH Key: " + data.body.ssh_keys[0].id);
      }).catch((error) => {
        console.log(error.body);
      });

      api.imagesGetAll({
        "private": true
      }).then((data) => {
        console.log(data.body);
        console.log("ID of first Snapshot: " + data.body.images[0].id);
      }).catch((error) => {
        console.log(error.body);
      });

      api.dropletsGetAll().then((data) => {
        console.log(data.body);
      }).catch((error) => {
        console.log(error.body);
      }); */

      if (args[0] == "create") {
        api.dropletsCreate({
          "name": "server",
          "region": "fra1",
          "size": "c-1vcpu-2gb",
          "image": "36438118",
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
          console.log("Created droplet with ID: " + data.body.droplet.id);
        }).catch((error) => {
          console.log(error.body);
        });
      }

      if (args[0] == "assign"){
      }

      if (args[0] == "delete"){
        destroyDroplet(args[1], message);
      }

    },
};

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
};

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
};

function assignFloatingIp(floating_ip){
  api.floatingIpsRequestAction(floating_ip,
    {
      "type": "assign",
      "droplet_id": 102992992
    }
  ).then((data) => {
    console.log(data.body);
  }).catch((error) => {
    console.log(error.body);
  });
}
