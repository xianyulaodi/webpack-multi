import modal from '$components/modal';
import commonData from 'utils/test';  //  也可以 import commonData from '$common/utils/test';

require('./css/style.css');

document.getElementById('app').innerHTML = `${modal.test}<br /><br />${commonData.common}`;
