var WDSlider = (function(){
  var isPressed = false;
  var startX;
  var lastX;
  var movedPercent;

  var slider = document.querySelector('.WD-slider-container');
  var slides = document.querySelectorAll('.WD-slider-component');
  var btnLeft = document.querySelector('.WD-slider-btn-left');
  var btnRight = document.querySelector('.WD-slider-btn-right');
  var dotContainer = document.querySelector('.WD-dots');

  var curSlide = 0;
  var maxSlide = slides.length;

  var createDots = function () {
      slides.forEach(function (_, i) {
          dotContainer.insertAdjacentHTML(
              'beforeend',
              `<button class="WD-dot" data-slide="${i}"></button>`
          );
      });
  };

  var captureSlideHandler = function(evt){
      var nodes = Array.prototype.slice.call(slider.children)

      //curSlide = nodes.indexOf(evt.currentTarget);
  };

  var slideMouseDownHandler = function(evt){
      evt.preventDefault();
      slides.forEach(function(slide){
          console.log(slide.contains(evt.target));
      })
      if(evt.target.classList.contains("WD-slider-btn") || evt.target.classList.contains("WD-dot") || evt.target.classList.contains("WD-dots")) return;
      isPressed = true
      startX = evt.offsetX;
  };

  var slideMouseMoveHandler = function(evt){
      evt.preventDefault();
      if(!isPressed) return;
      lastX = evt.offsetX;

      var width = parseInt(window.getComputedStyle(slider).width.replace("px",""))
      movedPercent = ( (startX - lastX) * 100 / width ) 
      slides.forEach(function(s, i) {
          var style = window.getComputedStyle(s);
          var matrix = new WebKitCSSMatrix(style.transform);
          //s.style.transform = `translateX(${( (100 * (i - 0)) - movedPercent) }%)`
          s.style.transform = `translateX(${( (100 * (matrix.m41/width))   - movedPercent) }%)`
      });
  };

  var slideMouseUpHandler = function(evt){
      if(!isPressed) return;
      
      if(evt.target.classList.contains("WD-slider-btn") || evt.target.classList.contains("WD-dot") || evt.target.classList.contains("WD-dots")) return;
      
      if(movedPercent > 5){
        nextSlide();
      }
      else if(movedPercent < -5){
        prevSlide();
      }
      else{
          goToSlide(curSlide)
      }
      movedPercent = 0;
      isPressed = false;
  }

  var activateDot = function (slide) {
      document.querySelectorAll('.WD-dot').forEach(function(dot){
          dot.classList.remove('WD-dots-active')
      });
      document.querySelector(`.WD-dot[data-slide="${slide}"]`).classList.add('WD-dots-active');
  };

  var goToSlide = function (slide) {
      slides.forEach(function(s, i){
          s.style.transform = `translateX(${100 * (i - slide)}%)`
      });
  };

// Next slide
  var nextSlide = function () {
      if (curSlide === maxSlide - 1) {
          curSlide = 0;
      } else {
          curSlide++;
      }
      goToSlide(curSlide);
      activateDot(curSlide);
  };

  var prevSlide = function () {
      if (curSlide === 0) {
        curSlide = maxSlide - 1;
      } else {
        curSlide--;
      }
      goToSlide(curSlide);
      activateDot(curSlide);
  };

  var init = function () {

      btnRight.addEventListener('click', nextSlide);
      btnLeft.addEventListener('click', prevSlide);
  
      slider.addEventListener("mousedown", slideMouseDownHandler);
      slider.addEventListener("mousemove", slideMouseMoveHandler);
      slider.addEventListener("mouseup", slideMouseUpHandler);
      slider.addEventListener("mouseleave", slideMouseUpHandler);
      slides.forEach(function(slide){
          slide.addEventListener("mousedown",captureSlideHandler);
      })

      dotContainer.addEventListener('click', function (e) {
          if (e.target.classList.contains('WD-dot')) {
            var slide = e.target.dataset.slide;
            goToSlide(slide);
            activateDot(slide);
          }
        });

      goToSlide(0);
      createDots();

      activateDot(0);
  };

  return {init:init}
}());

window.addEventListener("DOMContentLoaded",function(evt){WDSlider.init();})