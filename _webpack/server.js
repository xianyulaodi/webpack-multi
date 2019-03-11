const path = require('path');
const commander = require('./lib/cmd');
const port = commander.port;
const product = commander.product;

module.exports = {

  devServer: {
    hot: true,
    contentBase: path.join(__dirname, product, 'dist'),
    port: port
  }
}