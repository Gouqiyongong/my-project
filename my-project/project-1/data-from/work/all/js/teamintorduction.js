import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import '../css/teamintorduction.css';
import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/js/bootstrap.min.js';
import head from '../view/component/header.html';
import body from '../view/teamintorductionBody.html';
import {toHerf, addZore} from './room/room.js';

;(function(){
  var teamintorduction = {
    init(){
      $(document).ready(function(){
        $('body').prepend($(body));
        $('body').prepend($(head));
        toHerf($('#ht-pages a'), 3);
      })
    },
    active(){
      this.init();
    }
  }

  teamintorduction.active();
})();