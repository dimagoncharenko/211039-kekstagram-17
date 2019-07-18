'use strict';

(function () {
  var AVATAR_URL = 'img/avatar-';
  var SVG = '.svg';
  var cloneComment = document.querySelector('.social__comment').cloneNode(true);

  var showBigPhoto = function (photos, pictures) {
    var bigPicture = document.querySelector('.big-picture');
    var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
    var likes = bigPicture.querySelector('.likes-count');
    var caption = bigPicture.querySelector('.social__caption');
    var commentsCount = bigPicture.querySelector('.comments-count');
    var commentsWrapper = bigPicture.querySelector('.social__comments');
    var comments = bigPicture.querySelectorAll('.social__comment');
    var fragment = document.createDocumentFragment();
    var commentsCoutWrapper = bigPicture.querySelector('.social__comment-count');
    var commentLoader = bigPicture.querySelector('.comments-loader');
    var closeBtn = bigPicture.querySelector('.big-picture__cancel');

    var onPhotoEscPress = function (evt) {
      if (evt.keyCode === window.util.KEY_CODE.ESC) {
        onPhotoClose();
      }
    };

    var onPhotoClose = function () {
      bigPicture.classList.add('hidden');
      window.util.delNodeList(Array.from(commentsWrapper.children));

      closeBtn.removeEventListener('click', onPhotoClose);
      commentLoader.removeEventListener('click', onLoadClick);
    };

    var fragmentComment = document.createDocumentFragment();
    var allCommetns;

    var updateCountComments = function () {
      commentsCoutWrapper.firstChild.remove();
      commentsCoutWrapper.insertAdjacentText('afterbegin', commentsWrapper.children.length + ' из ');
      if (commentsWrapper.children.length === allCommetns.length) {
        commentLoader.classList.add('hidden')
      } else {
        commentLoader.classList.remove('hidden');
      }
    };

    var showPartComments = function (comments) {
      allCommetns = Array.from(comments).slice();
      var cloneComments = Array.from(comments).slice(0, 5);
      cloneComments.forEach(function (comment) {
        fragmentComment.appendChild(comment);
      });
      commentsWrapper.appendChild(fragmentComment);
      updateCountComments();
    };

    var onLoadClick = function () {
      var fragmentLoadComments = document.createDocumentFragment();
      var currentComents = document.querySelectorAll('.social__comment');
      var count = 0;
      currentComents = allCommetns.filter(function (comment, i) {
        if (comment !== currentComents[i]) {
          count++;
          if (count > 5) {
            return false;
          }
          return comment;
        } else {
          return false;
        }
      });
      currentComents.forEach(function (comment) {
        fragmentLoadComments.appendChild(comment);
      });
      commentsWrapper.appendChild(fragmentLoadComments);
      updateCountComments();
    };

    var applyImgParametrs = function (photosArray, i) {
      bigPictureImg.src = photosArray[i].url;
      likes.textContent = photosArray[i].likes;
      caption.textContent = photosArray[i].description;
      commentsCount.textContent = photosArray[i].comments.length;
      window.util.delNodeList(comments);
      photosArray[i].comments.forEach(function (comment) {
        var commentElement = cloneComment.cloneNode(true);
        commentElement.querySelector('.social__picture').src = AVATAR_URL + window.util.getRandomNumber(1, 6) + SVG;
        commentElement.querySelector('.social__picture').alt = comment.name;
        commentElement.querySelector('.social__text').textContent = comment.message;
        fragment.appendChild(commentElement);
      });
      var allComments = fragment.children;
      showPartComments(allComments);
    };

    var onPhotoOpen = function (i) {
      bigPicture.classList.remove('hidden');
      applyImgParametrs(photos, i);
      closeBtn.addEventListener('click', onPhotoClose);
      document.addEventListener('keydown', onPhotoEscPress);
      commentLoader.addEventListener('click', onLoadClick);
    };

    pictures.forEach(function (item, i) {
      item.addEventListener('click', function () {
        onPhotoOpen(i);
      });
    });
  };

  window.showBigPhoto = showBigPhoto;
})();
