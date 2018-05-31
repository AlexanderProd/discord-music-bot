const functions = require('./../functions.js');

module.exports = {
    name: 'play',
    description: '// TODO: ',
    async execute(message, args) {

      functions.PlayCommand(args.join(" "), message);

    },
};
