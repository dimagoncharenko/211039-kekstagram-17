'use strict';

(function () {

  var SCALE = {
    STEP: 25,
    MIN: 25,
    MAX: 100
  };

  var scale = document.querySelector('.scale');
  var buttonScaleSmaller = scale.querySelector('.scale__control--smaller');
  var buttonScaleBigger = scale.querySelector('.scale__control--bigger');
  var inputScale = scale.querySelector('.scale__control--value');
  var uploadImg = document.querySelector('.img-upload__preview img');

  var getTransformStyleCss = function (element, scaleStyle) {
    element.style.transform = 'scale' + '(' + scaleStyle + ')';
  };

  var onSizeButtonClick = function (evt) {
    var scaleNumber = parseInt(inputScale.value, 10);
    if (evt.target === buttonScaleSmaller) {
      if (scaleNumber > SCALE.MIN) {
        scaleNumber = scaleNumber - SCALE.STEP;
        if (scaleNumber < SCALE.MIN) {
          scaleNumber = SCALE.MIN;
        }
      }
    } else {
      if (scaleNumber < SCALE.MAX) {
        scaleNumber = scaleNumber + SCALE.STEP;
        if (scaleNumber > SCALE.MAX) {
          scaleNumber = SCALE.MAX;
        }
      }
    }

    var scaleStyle = scaleNumber / 100;
    inputScale.value = scaleNumber + '%';
    getTransformStyleCss(uploadImg, scaleStyle);
  };

  buttonScaleSmaller.addEventListener('click', onSizeButtonClick);
  buttonScaleBigger.addEventListener('click', onSizeButtonClick);
})();