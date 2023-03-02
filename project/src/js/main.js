document.addEventListener('DOMContentLoaded', function() {
  lazyload();

  const mediaQuery = window.matchMedia('(min-width: 1025px)');
  const mediaMobile = window.matchMedia('(max-width: 520px)');


  var contactsCard = gsap.timeline({paused: true});
  contactsCard.to('.location__title', {opacity: 0, duration: .3, delay: .2, ease: "power2.out"})
              .to('.location__desc', {opacity: 0, duration: .3, ease: "power2.out"}, "-=.4")
              .to('.location__link', {opacity: 0, duration: .3, ease: "power2.out"}, "-=.6")
  if (mediaQuery.matches) {
    contactsCard.to('.location', {xPercent: -110, opacity: 0, display: 'none', duration: 1, ease: "power2.out"})
  } else {
    contactsCard.to('.location', {y: 100, opacity: 0, display: 'none', duration: 1, ease: "power2.out"})
  }


  var closeLocation = document.querySelector('.location__btn');
  closeLocation.addEventListener('click', function() {
    contactsCard.play();
  })

  ymaps.ready(function () {
    var myMap = new ymaps.Map("map", {
        center: [55.76728852249407,37.63085601571822],
        zoom: 14,
    });

    function setBounds () {
      myMap.setBounds([[55.7490421456633,37.56493804696823],[55.78552632726671,37.69677398446822]]);
    }

    const myPlacemark = new ymaps.Placemark([55.76971660192312,37.63984683582488], {
      hintContent: 'Нажмите, чтобы связаться с нами:)'}, {
      iconLayout: 'default#image',
      iconImageHref: 'img/dot.png',
      iconImageSize: [12, 12],
      iconImageOffset: [-20, 1]
    });
    myMap.geoObjects.add(myPlacemark);
    myMap.container.fitToViewport();
    myPlacemark.events.add('click', function () {
      contactsCard.reverse();
    });
  });

  let navShow = gsap.timeline({paused: true});
  navShow.to('.burger', {display: 'none', opacity: 0})
          .to('.mobile-wrap', {display: 'flex', opacity: 1, xPercent: 80, duration: .5, ease: "power2.out"}, "-=.1")
          .from('.mobile-wrap__link', {y: 100, opacity: 0.2, duration: .5}, "-=.4")

  let burger = document.querySelector('.burger');
  let burgerClose = document.querySelector('.mobile-wrap__close');

  burger.addEventListener('click', function () {
    navShow.play();
  });
  burgerClose.addEventListener('click', function () {
    navShow.reverse();
  })

  let navLinksOnMobile = document.querySelectorAll('.nav__link');
  for (let elem of navLinksOnMobile) {
    elem.addEventListener('click', function () {
      if (mediaMobile.matches) {
        navShow.reverse();
      }
    })
  }

  let searchShow = gsap.timeline({paused: true});
  searchShow.to('.header__btn', {opacity: 0, delay: .1, duration: .5, ease: "power2.out"})
            .to('.header__form', {visibility: 'visible', opacity: 1, duration: .5, ease: "power2.out"}, "-=.4")
            .to('.header__btn', {visibility: 'hidden', duration: .1, ease: "power2.out"}, "-=.2")
            .to('.search__input', {x: 0, duration: .3, ease: "power2.out"}, "-=.3")

  let searchBtn = document.querySelector('.header__btn');
  let searchClose = document.querySelector('.form__close');
  let searchSubmit = document.querySelector('.header__form');
  let searchInput = document.querySelector('.search__input');
  searchBtn.addEventListener('click', function () {
    searchShow.play();
  })
  searchClose.addEventListener('click', function () {
    searchShow.reverse();
  })
  searchSubmit.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!searchInput.value) {
      return;
    }
    searchShow.reverse();
  })

  const validateStyle = {
    errorLabelStyle: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      padding: '3px 23px',
      fontFamily: 'Roboto',
      fontWeight: '400',
      fontSize: '9px',
      lineHeight: '11px',
      color: '#FF3030',
      outline: '2px solid #FF3030',
      pointerEvents: 'none'
    },
    focusInvalidField: false,
  }
  const mailValidationRules = [
    {
      rule: 'required',
      errorMessage: 'Обязательное поле',
    },
    {
      rule: 'email',
      errorMessage: 'Недопустимый формат',
    },
  ]

  const validation = new window.JustValidate('#form_expanded', validateStyle);
  validation.addField('#input_name', [
    {
      rule: 'minLength',
      value: 2,
      errorMessage: 'Слишком короткое имя',
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Имя не может быть длиннее 30 символов',
    },
    {
      rule: 'required',
      errorMessage: 'Обязательное поле',
    },
  ])
  validation.addField('#mail_sec', mailValidationRules)
  console.log(validation.isValid, validation)

  const mailValidate = new window.JustValidate('#form', validateStyle);

  mailValidate.addField('#mail', mailValidationRules)
});
