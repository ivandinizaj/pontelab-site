/**
 * Código baseado em 
 * @param  {[type]}  ele [description]
 * @param  {[type]}  cls [description]
 * @return {Boolean}     [description]
 */
function hasClass(ele,cls){
  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) ? true : false ;
}

function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += ' '+cls;
  return true
}

function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
    return true;
  } 
  return false;
}

function isEmpty(obj) {
  for(var prop in obj)
      if(obj.hasOwnProperty(prop))
          return false;

  return true;
}  
  
var $lateral_menu_trigger = document.querySelector('#cd-menu-trigger'),
    $content_wrapper = document.querySelector('.cd-main-content'),
    $navigation = document.querySelector('header');

//open-close lateral menu clicking on the menu icon
$lateral_menu_trigger.addEventListener('click', function(event){
  event.preventDefault();
  
  $lateral_menu_trigger.classList.toggle('is-clicked');
  
  $navigation.classList.toggle('lateral-menu-is-open');
  
  $content_wrapper.classList.toggle('lateral-menu-is-open');

  $content_wrapper.addEventListener('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
    // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
    document.querySelector('body').classList.toggle('overflow-hidden');
    console.log(this);
  });

  
  document.querySelector('#cd-lateral-nav').classList.toggle('lateral-menu-is-open');
  
  //check if transitions are not supported - i.e. in IE9
  if(hasClass(document.querySelector('html'),'no-csstransitions')) {
    document.querySelector('body').classList.toggle('overflow-hidden');
  }

});



//close lateral menu clicking outside the menu itself
$content_wrapper.addEventListener('click', function(event){

  removeClass($lateral_menu_trigger,'is-clicked');
  removeClass($navigation,'lateral-menu-is-open');
  removeClass($content_wrapper,'lateral-menu-is-open');

  $content_wrapper.addEventListener('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
    removeClass(document.querySelector('body'),'overflow-hidden');
  });

  removeClass(document.querySelector('#cd-lateral-nav'),'lateral-menu-is-open');
  //check if transitions are not supported
  if(hasClass(document.querySelector('html'),'no-csstransitions'))
    removeClass(document.querySelector('body'),'overflow-hidden');
  

});
