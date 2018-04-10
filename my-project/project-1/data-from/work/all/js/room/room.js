function toHerf(ele, index){
  $.each(ele, function(i, item){
    if(i == 0){
      $(item).attr('href', 'index.html');
    }
    if(index && i == index){
      $(item).attr('href', '#');
      $(item).parent().siblings().removeClass('active');
      $(item).parent().addClass('active');
      console.log(item);
    }
    else{
      switch(i){
        case 1: $(item).attr('href', 'inline.html'); break;
        case 2: $(item).attr('href', 'platform.html'); break;
        case 3: $(item).attr('href', 'teamintorduction.html'); break;
      }
    }
  })
}


function formatDate(tm) {
  var d = new Date(tm);
  return (d.getFullYear()) + "-" + addZore((d.getMonth() + 1)) + "-" + addZore((d.getDate()));
}

function addZore(num) {
  return num < 10 ? '0' + num : num;
}

export {toHerf, formatDate, addZore};