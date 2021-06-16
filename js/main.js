var WDSlider = (function(){
  var isPressed = false;
  var startX;
  var lastX;
  var movedPercent;

  var slider;
  var sliderContainers = document.querySelectorAll('.WD-slider-container');
  
  var slides = [];
  var LeftButton;
  var RightButton;
  var dotContainer;

  var curSlide = 0;

  var createDots = function () {
      slides.forEach(function (_, i) {
          dotContainer.insertAdjacentHTML(
              'beforeend',
              `<button class="WD-dot" data-slide="${i}"></button>`
          );
      });
  };

  var createSlideNavButtons = function () {
    console.log(slider)
      slider.insertAdjacentHTML(
          'beforeend',
          "<button class='WD-slider-btn WD-slider-btn-left'>&larr;</button>"
      );
      slider.insertAdjacentHTML(
        'beforeend',
        `<button class="WD-slider-btn WD-slider-btn-right">&rarr;</button>`
    );
  };

  var initializeObjectsForSlider = function(evt){
    slider = evt.currentTarget;
    slides = slider.querySelectorAll('.WD-slider-component');
    curSlide = evt.target.dataset.curSlide
  };

  var dotClickHandler = function (e) {
    if (e.target.classList.contains('WD-dot')) {
      var slide = e.target.dataset.slide;
      //console.log("dot click handler", slide)
      goToSlide(slide,e);
      activateDot(slide,e);
      updateCurSlideState(slide,e);
    }
  };

  var updateCurSlideState = function(SlideCount,evt){
    evt.target.closest(".WD-slider-container").dataset.curSlide = SlideCount;
  };

  var slideMouseDownHandler = function(evt){
      evt.preventDefault();
      console.log("curSlide",evt.currentTarget.dataset);
      console.log(evt.currentTarget);
      //initializeObjectsForSlider(evt);
      var selectedSlideContainer_Slides = evt.currentTarget.querySelectorAll(".WD-slider-component");
      selectedSlideContainer_Slides.forEach(function(slide){
          console.log(slide.contains(evt.target));
      })
      if(evt.target.classList.contains("WD-slider-btn") || 
      evt.target.classList.contains("WD-dot") || 
      evt.target.classList.contains("WD-dots")) return;

      isPressed = true
      startX = evt.offsetX;
  };

  var slideMouseMoveHandler = function(evt){
      evt.preventDefault();
      if(!isPressed) return;
      lastX = evt.offsetX;

      var width = parseInt(window.getComputedStyle(slider).width.replace("px",""))
      movedPercent = ( (startX - lastX) * 100 / width ) 
      var selectedSlideContainer_Slides = evt.currentTarget.querySelectorAll(".WD-slider-component");
      selectedSlideContainer_Slides.forEach(function(s, i) {
          var style = window.getComputedStyle(s);
          var matrix = parseInt(style.transform.split(",")[4].trim());
          //s.style.transform = `translateX(${( (100 * (i - 0)) - movedPercent) }%)`
          s.style.transform = `translateX(${( (100 * (matrix/width))   - movedPercent) }%)`
      });
  };

  var slideMouseUpHandler = function(evt){
      if(!isPressed) return;
      
      if(evt.target.classList.contains("WD-slider-btn") || 
      evt.target.classList.contains("WD-dot") || 
      evt.target.classList.contains("WD-dots")) return;
      
      if(movedPercent > 5){
        nextSlide(evt);
      }
      else if(movedPercent < -5){
        prevSlide(evt);
      }
      else{
          goToSlide(curSlide)
      }
      movedPercent = 0;
      isPressed = false;
  }

  var activateDot = function (slide,evt=null) {
    if(evt != null){
      slider = evt.target.closest(".WD-slider-container")
    }

    if(typeof slider != undefined){
      slider.querySelectorAll('.WD-dot').forEach(function(dot){
          dot.classList.remove('WD-dots-active')
      });
      slider.querySelector(`.WD-dot[data-slide="${slide}"]`).classList.add('WD-dots-active');
    }
  };

  var goToSlide = function (slide,evt=null) {
    if(evt!=null){
      slides = evt.target.closest(".WD-slider-container").querySelectorAll(".WD-slider-component")
    }
    slides.forEach(function(s, i){
        s.style.transform = `translateX(${100 * (i - slide)}%)`
    });
  };

// Next slide
  var nextSlide = function (evt) {
      var selectedSlideContainer_CurSlide = parseInt(evt.target.closest(".WD-slider-container").dataset.curSlide);
      if (selectedSlideContainer_CurSlide === evt.target.closest(".WD-slider-container").querySelectorAll(".WD-slider-component").length - 1) {
        selectedSlideContainer_CurSlide = 0;
      } 
      else {
        selectedSlideContainer_CurSlide += 1;
      }
      goToSlide(selectedSlideContainer_CurSlide,evt);
      activateDot(selectedSlideContainer_CurSlide,evt);
      updateCurSlideState(selectedSlideContainer_CurSlide,evt);
  };

  var prevSlide = function (evt) {
      var selectedSlideContainer_CurSlide = parseInt(evt.target.closest(".WD-slider-container").dataset.curSlide);
      if (selectedSlideContainer_CurSlide === 0) {
        selectedSlideContainer_CurSlide = evt.target.closest(".WD-slider-container").querySelectorAll(".WD-slider-component").length - 1;
      } else {
        selectedSlideContainer_CurSlide -= 1;
      }
      goToSlide(selectedSlideContainer_CurSlide,evt);
      activateDot(selectedSlideContainer_CurSlide,evt);
      updateCurSlideState(selectedSlideContainer_CurSlide,evt);
  };

  var init = function () {

    sliderContainers.forEach(function(sliderContainer){
      sliderContainer.dataset.curSlide = curSlide;
      slider = sliderContainer;

      sliderContainer.addEventListener("mousedown", slideMouseDownHandler);
      sliderContainer.addEventListener("mousemove", slideMouseMoveHandler);
      sliderContainer.addEventListener("mouseup", slideMouseUpHandler);
      sliderContainer.addEventListener("mouseleave", slideMouseUpHandler);

      dotContainer = sliderContainer.querySelector('.WD-dots');

      dotContainer.addEventListener('click', dotClickHandler);

      slides = sliderContainer.querySelectorAll('.WD-slider-component');

      goToSlide(curSlide);

      createSlideNavButtons();

      LeftButton = sliderContainer.querySelector('.WD-slider-btn-left');
      RightButton = sliderContainer.querySelector('.WD-slider-btn-right');

      RightButton.addEventListener('click', nextSlide);
      LeftButton.addEventListener('click', prevSlide);

      createDots();

      activateDot(curSlide);
    });

  };

  return {init:init}
}());

window.addEventListener("DOMContentLoaded",function(evt){WDSlider.init();})