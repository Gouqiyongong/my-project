import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import '../css/platform.css';
import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/js/bootstrap.min.js';
import head from '../view/component/header.html';
import body from '../view/platformBody.html';
import {
  toHerf
} from './room/room.js';

;
(function () {
  var platform = {
    init() {
      $(document).ready(function () {
        $('body').prepend($(body));
        $('body').prepend($(head));
        toHerf($('#ht-pages a'), 2);
      })
    },

    active(){
      this.init();
    }
  }

  platform.active();
})()