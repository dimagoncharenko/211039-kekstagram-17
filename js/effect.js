'use strict';

(function () {
  var PIN_STEP = 20;

  var EFFECT_ORIGINAL = 'effects__preview--none';
  var EFFECT_CLASS_PREFFIX = 'effects__preview--';

  var Effect = {
    CHROME: 'chrome',
    SEPIA: 'sepia',
    MARVIN: 'marvin',
    PHOBOS: 'phobos',
    HEAT: 'heat',
    NONE: 'none'
  };

  var FilterStyle = {
    GRAYSCALE: 'grayscale',
    SEPIA: 'sepia',
    INVERT: 'invert',
    BLUR: 'blur',
    BRIGHTNESS: 'brightness'
  };

  var uploadPopup = document.querySelector('.img-upload__overlay');
  var effectPin = uploadPopup.querySelector('.effect-level__pin');
  var effectBar = uploadPopup.querySelector('.effect-level__depth');
  var effectRadio = uploadPopup.querySelectorAll('.effects__radio');
  var inputEffectValue = uploadPopup.querySelector('input[name="effect-level"]');
  var uploadImg = uploadPopup.querySelector('.img-upload__preview img');
  var effectLevel = uploadPopup.querySelector('.effect-level');

  var getAllEffectClasses = function () {
    var effectClasses = [];
    effectRadio.forEach(function (radioItem) {
      var effectClass = 'effects__preview--' + radioItem.value;
      effectClasses.push(effectClass);
    });

    return effectClasses;
  };

  var removeAllEffect = function () {
    var effectClasses = getAllEffectClasses();
    uploadImg.classList.remove.apply(uploadImg.classList, effectClasses);
  };

  window.effect = {
    removeAllEffect: removeAllEffect
  };

  var calculateEffect = function (effectName, percent) {
    var value;
    var effect = effectName.toString();

    switch (effect) {
      case Effect.CHROME:
        value = percent / 100;
        break;

      case Effect.SEPIA:
        value = percent / 100;
        break;

      case Effect.MARVIN:
        value = percent + '%';
        break;

      case Effect.PHOBOS:
        value = (percent * 3) / 100 + 'px';
        break;

      case Effect.HEAT:
        value = (percent * 2) / 100 + 1;
        break;
    }

    return value;
  };

  var addFilterEffect = function (evt) {
    var radioItem = evt.target;
    var radioValue = radioItem.value;
    removeAllEffect();

    uploadImg.style.filter = '';
    inputEffectValue.value = '0';
    uploadImg.classList.add(EFFECT_CLASS_PREFFIX + radioValue);
    effectPin.style.left = '100%';
    effectBar.style.width = '100%';
    inputEffectValue.value = '100';

    if (uploadImg.classList.contains(EFFECT_ORIGINAL)) {
      effectLevel.classList.add('hidden');
    } else {
      effectLevel.classList.remove('hidden');
    }
  };

  effectRadio.forEach(function (radioItem) {
    radioItem.addEventListener('click', addFilterEffect);
  });

  var getFilterStyleCss = function (element, filter, valueEffect) {
    element.style.filter = filter + '(' + valueEffect + ')';
  };

  var effectLevelLine = uploadPopup.querySelector('.effect-level__line');

  var applyEffect = function () {
    var inputRadioChecked = uploadPopup.querySelector('.effects__radio:checked');
    var currentEffect = inputRadioChecked.value;
    var valuePin = parseInt(effectPin.style.left, 10);
    var valueEffect = calculateEffect(currentEffect, valuePin);
    effectBar.style.width = valuePin + '%';
    inputEffectValue.value = valuePin;

    switch (currentEffect) {
      case Effect.CHROME:
        getFilterStyleCss(uploadImg, FilterStyle.GRAYSCALE, valueEffect);
        break;

      case Effect.SEPIA:
        getFilterStyleCss(uploadImg, FilterStyle.SEPIA, valueEffect);
        break;

      case Effect.MARVIN:
        getFilterStyleCss(uploadImg, FilterStyle.INVERT, valueEffect);
        break;

      case Effect.PHOBOS:
        getFilterStyleCss(uploadImg, FilterStyle.BLUR, valueEffect);
        break;

      case Effect.HEAT:
        getFilterStyleCss(uploadImg, FilterStyle.BRIGHTNESS, valueEffect);
        break;
    }
  };

  var convertCoordInPercent = function (coord, fullWidth) {
    return (coord * 100) / fullWidth + '%';
  };

  var onPinArrowsPress = function (evt) {
    var startPinCoord = effectPin.offsetLeft;
    var effectLevelLineWidth = effectLevelLine.offsetWidth;
    var newPinCoord;

    switch (evt.keyCode) {
      case (window.util.KEY_CODE.ARROW_LEFT):
        newPinCoord = startPinCoord - PIN_STEP;
        if (newPinCoord < 0) {
          newPinCoord = 0;
        }
        break;

      case (window.util.KEY_CODE.ARROW_RIGHT):
        newPinCoord = startPinCoord + PIN_STEP;
        if (newPinCoord > effectLevelLineWidth) {
          newPinCoord = effectLevelLineWidth;
        }
        break;
    }

    var pinPosition = convertCoordInPercent(newPinCoord, effectLevelLineWidth);
    effectPin.style.left = pinPosition;
    applyEffect();
  };

  effectPin.addEventListener('keydown', onPinArrowsPress);

  effectPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoord = evt.clientX;
    var effectLevelLineWidth = effectLevelLine.offsetWidth;
    var coordSliderLine = effectLevelLine.getBoundingClientRect();
    var coordSliderLineRight = coordSliderLine.left + effectLevelLineWidth;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoord - moveEvt.clientX;
      startCoord = moveEvt.clientX;
      var effectPinCoord = effectPin.offsetLeft - shift;

      if (moveEvt.clientX < coordSliderLine.left) {
        effectPinCoord = 0;
      }

      if (moveEvt.clientX > coordSliderLineRight) {
        effectPinCoord = effectLevelLineWidth;
      }
      var pinPosition = convertCoordInPercent(effectPinCoord, effectLevelLineWidth);
      effectPin.style.left = pinPosition;

      applyEffect();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  effectLevelLine.addEventListener('click', function (evt) {
    if (evt.target !== effectPin) {
      var coordClickLine = evt.offsetX;
      var effectLevelLineWidth = effectLevelLine.offsetWidth;
      var pinPosition = convertCoordInPercent(coordClickLine, effectLevelLineWidth);
      effectPin.style.left = pinPosition;
      applyEffect();
    }
  });

})();