const { digitalOceanApi } = require('./../config.json');
const DigitalOcean = require('do-wrapper').default, api = new DigitalOcean(digitalOceanApi, 2);

module.exports = {
    name: 'server',
    description: 'Wird verwendet um einen Gamerserver zu verwalten.',
    async execute(message, args) {

      api.accountGetKeys().then((data) => {
        console.log("ID of first SSH Key: " + data.body.ssh_keys[0].id);
      }).catch((error) => {
        console.log(error.body);
      });

      /* api.dropletsCreate({
        "name": "server",
        "region": "fra1",
        "size": "s-2vcpu-4gb",
        "image": "ubuntu-s-2vcpu-4gb-fra1-01"
      }).then((data) => {
        console.log(data.body);
      }).catch((error) => {
        console.log(error.body);
      }); */

      /* api.dropletsGetAll().then((data) => {
        console.log(data.body);
      }).catch((error) => {
        console.log(error.body);
      }); */

    },
};
