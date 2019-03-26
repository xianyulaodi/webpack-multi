import modal from '$components/modal';
require('./css/style.css');

console.log(process.env.NODE_ENV);

document.getElementById('app').innerHTML = modal.test;
