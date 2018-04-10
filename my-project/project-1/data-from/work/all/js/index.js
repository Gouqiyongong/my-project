import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import '../fullPage/jquery.fullpage.css';
import head from '../view/component/header.html';
import body from '../view/indexBody.html';
import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/js/bootstrap.min.js';


;(function () {
  $(document).ready(function () {
    $('body').prepend($(body));
    $('body').prepend($(head));
    $('#fullpage').fullpage({
      'anchors': ['pages-1', 'pages-2', 'pages-3', 'pages-4', 'footer'],
      'menu': '#ht-pages',
      'css3': true,
      'scrollingSpeed': 800,
      'verticalCentered': true,
      'navigation': true,
      'slidesColor': ['#F0F2F4', '#fff', '#fff',  '#fff'],
      'navigationTooltips': ['event study', 'inline', 'odl', 'team introduction', 'end']
    });
  });
})();