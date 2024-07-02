// import styles bundle
import 'swiper/css/bundle';

import './style.scss';

import * as utils from './js/utils/utils';

import noUiSlider from './js/utils/nouislider.min';
import './style/libs/nouislider.css';

// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

window.addEventListener('DOMContentLoaded', () => {
  // accordion
  utils.accordion();

  improveSlider();

  chooseAppartForm();

  ipotekaForm();

  otchetSlider();

  menuFunctionality();
});



const spinnerBlock = `
  <div class="loadingio-spinner-double-ring-nq4q5u6dq7r"><div class="ldio-x2uulkbinbj">
  <div></div>
  <div></div>
  <div><div></div></div>
  <div><div></div></div>
  </div></div>
`;
const spinnerContainer = document.createElement('div');
spinnerContainer.classList.add('spinner-container');
spinnerContainer.innerHTML = spinnerBlock;


function improveSlider() {
  if (!document.querySelector('.improve__swiper')) return;


  const slider = new Swiper('.improve__swiper', {
    // If we need pagination
    pagination: {
      el: '.improve-swiper-pagination',
    },
    // Navigation arrows
    navigation: {
      nextEl: '.improve-swiper-button-next',
      prevEl: '.improve-swiper-button-prev',
    },
    speed: 500,
    loop: true,
  });
}


// функционал выбора квартиры
function chooseAppartForm() {
  if (!document.querySelector('#choose-appartment-form')) return;

  const sliderFloor = document.getElementById('slider-floor');

  noUiSlider.create(sliderFloor, {
      start: [1, 4],
      connect: true,
      step: 1,
      tooltips: [
        { to: function(value) { return Math.round(value); } },
        { to: function(value) { return Math.round(value); } }
      ],
      range: {
          'min': 1,
          'max': 4
      }
  });
  
  sliderFloor.noUiSlider.on('set.one', function (e) {
    chooseAppartChanged();
   });
  
  const sliderSquare = document.getElementById('slider-square');
   
  noUiSlider.create(sliderSquare, {
      start: [24, 98],
      connect: true,
      step: 1,
      tooltips: [
        { to: function(value) { return Math.round(value); } },
        { to: function(value) { return Math.round(value); } }
      ],
      range: {
          'min': 24,
          'max': 98
      }
  });
   
  sliderSquare.noUiSlider.on('set.one', function (e) {
    chooseAppartChanged();
  });
  
  
  const sliderCost = document.getElementById('slider-cost');
  
  noUiSlider.create(sliderCost, {
      start: [6, 17],
      connect: true,
      step: 1,
      tooltips: [
        { to: function(value) { return Math.round(value); } },
        { to: function(value) { return Math.round(value); } }
      ],
      range: {
          'min': 6,
          'max': 17
      }
  });
  
  sliderCost.noUiSlider.on('set.one', function (e) {
    chooseAppartChanged();
  });
  
  const formResetBtn = document.querySelector('[form-reset]');
  formResetBtn.addEventListener('click', () => {
    sliderFloor.noUiSlider.set([1, 4]);
    sliderSquare.noUiSlider.set([24, 98]);
    sliderCost.noUiSlider.set([6, 17]);
  });
  
  const chooseAppartForm = document.querySelector('#choose-appartment-form');
  chooseAppartForm.addEventListener('input', (e) => {
  
    chooseAppartChanged();
  });
  
  function roundValuesObject(obj) {
    Object.keys(obj).forEach(function(key){ obj[key] = Math.round(obj[key]) });
    return obj;
  }
  
  const cooseAppartResult = document.querySelector('#choose-appartment__result');
  function chooseAppartChanged() {
    let floors = sliderFloor.noUiSlider.get();
    let square = sliderSquare.noUiSlider.get();
    let cost = sliderCost.noUiSlider.get();
  
    floors = roundValuesObject(floors);
    square = roundValuesObject(square);
    cost = roundValuesObject(cost);
  
    // const formData = new FormData(chooseAppartForm)
    const formData = new FormData(chooseAppartForm);
  
    formData.set('floors', floors);  
    formData.set('square', square);  
    formData.set('cost', cost);
    
    const formObject = Object.fromEntries(formData.entries());
  
    console.log(formObject);
  
  
    // TODO: add fetch
  
    // cooseAppartResult.innerHTML = '';
    cooseAppartResult.append(spinnerContainer);
  
    // REMOVE IT WHEN FETCH IS READY
    setTimeout(() => {
      spinnerContainer.remove();
    }, 2000);
  
  }
}


const IPOTEKA_COST_SLIDER_MIN = 5_144_989;
const IPOTEKA_COST_SLIDER_MAX = 14_000_000;
const PERCENT_START_VAL = 20;
const FIRST_PAY_MIN = 15;
const FIRST_PAY_MAX = 90;
const SROK_MIN = 1;
const SROK_MAX = 30;
const SROK_START_VAL = 12;

function ipotekaForm() {

  if (!document.getElementById('ipoteka-form')) return;

  // СТОИМОСТЬ НЕДВИЖИМОСТИ

  const sliderCost = document.getElementById('slider-ipoteka-cost');

  noUiSlider.create(sliderCost, {
      start: [IPOTEKA_COST_SLIDER_MIN],
      connect: 'lower',
      step: 1,
      // tooltips: [
      //   { to: function(value) { return Math.round(value); } }
      // ],
      range: {
          'min': IPOTEKA_COST_SLIDER_MIN,
          'max': IPOTEKA_COST_SLIDER_MAX
      }
  });

  const inputCost = document.getElementById('input-ipoteka-cost');
  inputCost.value = IPOTEKA_COST_SLIDER_MIN;
  inputCost.setAttribute('min', IPOTEKA_COST_SLIDER_MIN);
  inputCost.setAttribute('max', IPOTEKA_COST_SLIDER_MAX);

  sliderCost.noUiSlider.on('slide', function (value) {
    inputCost.setAttribute('type', 'text');
    inputCost.value = Math.round(value).toLocaleString();
    
    const percent = sliderPercent.noUiSlider.get();
    const firstPay = calcFirstPay(value, percent);
    inputFirstPay.value = firstPay;
    console.log(value, percent, firstPay);
  });
  inputCost.addEventListener('focus', () => {
    const val = inputCost.value;
    const newVal = val.toString().replaceAll(String.fromCharCode(160), '');
    inputCost.setAttribute('type', 'number');
    inputCost.value = newVal;
  });
  inputCost.addEventListener('focusout', () => {
    sliderCost.noUiSlider.set(inputCost.value);
    const val = inputCost.value;
    inputCost.setAttribute('type', 'text');
    const value = Math.round(inputCost.value).toLocaleString();
    inputCost.value = value;

    const percent = sliderPercent.noUiSlider.get();
    const firstPay = calcFirstPay(val, percent);
    inputFirstPay.value = firstPay;
    console.log(val, percent, firstPay);
  });

  // ПЕРВОНАЧАЛЬНЫЙ ВЗНОС

  const sliderPercent = document.getElementById('slider-first-pay');

  noUiSlider.create(sliderPercent, {
      start: [PERCENT_START_VAL],
      connect: 'lower',
      step: 1,
      // tooltips: [
      //   { to: function(value) { return Math.round(value); } },
      //   { to: function(value) { return Math.round(value); } }
      // ],
      range: {
          'min': FIRST_PAY_MIN,
          'max': FIRST_PAY_MAX
      }
  });

  const inputPercent = document.getElementById('input-ipoteka-percent');
  const inputFirstPay= document.getElementById('input-ipoteka-firstpay');
  inputPercent.value = PERCENT_START_VAL;

  const firstPayVal = calcFirstPay(IPOTEKA_COST_SLIDER_MIN, PERCENT_START_VAL);
  inputFirstPay.value = firstPayVal.toLocaleString();

  sliderPercent.noUiSlider.on('slide', function (value) {
    inputPercent.value = Math.round(value).toLocaleString();

    const cost = sliderCost.noUiSlider.get();
    const firstPayVal = calcFirstPay(cost, value);
    inputFirstPay.value = firstPayVal.toLocaleString();
  });

  inputFirstPay.addEventListener('focus', () => {
    const val = inputFirstPay.value;
    const newVal = val.toString().replaceAll(String.fromCharCode(160), '');
    inputFirstPay.setAttribute('type', 'number');
    inputFirstPay.value = newVal;
  });
  inputFirstPay.addEventListener('focusout', () => {
    // sliderCost.noUiSlider.set(inputCost.value);
    inputFirstPay.setAttribute('type', 'text');
    const val = inputFirstPay.value;
    const value = Math.round(val).toLocaleString();
    inputFirstPay.value = value;

    const cost = sliderCost.noUiSlider.get();
    const percent = calcPercent(cost, val);
    sliderPercent.noUiSlider.set(percent);
    inputPercent.value = percent;
    console.log(percent, cost, val);
  });

  inputPercent.addEventListener('change', () => {
    const value = inputPercent.value;
    sliderPercent.noUiSlider.set(value);
    const cost = sliderCost.noUiSlider.get();
    const firstPayVal = calcFirstPay(cost, value);
    inputFirstPay.value = firstPayVal.toLocaleString();
  });

    // СРОК

  const sliderSrok = document.getElementById('slider-srok');

  noUiSlider.create(sliderSrok, {
      start: [SROK_START_VAL],
      connect: 'lower',
      step: 1,
      // tooltips: [
      //   { to: function(value) { return Math.round(value); } },
      //   { to: function(value) { return Math.round(value); } }
      // ],
      range: {
          'min': SROK_MIN,
          'max': SROK_MAX
      }
  });

  const inputSrok = document.getElementById('input-ipoteka-srok');
  inputSrok.value = SROK_START_VAL;

  sliderSrok.noUiSlider.on('slide', function (value) {
    inputSrok.value = Math.round(value).toLocaleString();
  });

  inputSrok.addEventListener('change', () => {
    const value = inputSrok.value;
    sliderSrok.noUiSlider.set(value);
  });

  sliderCost.noUiSlider.on('set.one', function (e) {
    recalcIpoteka();
  });
  sliderPercent.noUiSlider.on('set.one', function (e) {
    recalcIpoteka();
  });
  sliderSrok.noUiSlider.on('set.one', function (e) {
    recalcIpoteka();
  });

  const resultContainer = document.getElementById('ipoteka-result');
  const form = document.getElementById('ipoteka-form');

  function recalcIpoteka() {
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
  
    console.log(formObject);
  
  
    // TODO: add fetch
  
    resultContainer.append(spinnerContainer);
  
    // REMOVE IT WHEN FETCH IS READY
    setTimeout(() => {
      spinnerContainer.remove();
      changeDisplayPrice();
    }, 2000);
  }

  const priceBlock = document.querySelector('.ipoteka__month-pay .total');
  const worningMess = document.createElement('p');
  worningMess.classList.add('worning-mess');
  worningMess.textContent = 'Скорректируйте данные';
  function changeDisplayPrice() {
    const items = document.querySelector('.grid__container').querySelectorAll('.grid__item');

    if (items.length < 1) {
      priceBlock.append(worningMess);
      return;
    }
    worningMess.remove();
    console.log(items);
    const price = items[0].querySelector('.price').textContent;
    priceBlock.querySelector('span').textContent = price;
  }

  function calcFirstPay(cost, percent) {
    return Math.round(cost * percent / 100);
  }
  function calcPercent(cost, firstPay) {
    return Math.round(firstPay * 100 / cost);
  }
}

function otchetSlider() {
  if (!document.querySelector('.otchet__photo-swiper')) return;

  const slider = new Swiper('.otchet__photo-swiper', {
    // Navigation arrows
    navigation: {
      nextEl: '.otchet__photo-swiper-btn-next',
      prevEl: '.otchet__photo-swiper-btn-prev',
    },
    speed: 500,
    loop: true,
  });

  const slides = document.querySelector('.otchet__photo-swiper').querySelectorAll('.swiper-slide');
  const numSpan = document.querySelector('.otchet__photo-swiper-num span');
  numSpan.textContent = slides.length;
}

function menuFunctionality() {
  const hamburgers = document.querySelectorAll('[data-burger="open"]');
  const burgerMenu = document.querySelector('.menu-panel__wrapper');
  const hamburgerClose = document.querySelector('[data-burger="close"]');
  
  function closeBurgerMenu() {
    burgerMenu.classList.remove('active');
  };
  
  function openBurgerMenu() {
    burgerMenu.classList.add('active');
  };
  
  hamburgers.forEach(hamburger => {
    hamburger.addEventListener('click', openBurgerMenu);
  })

  hamburgerClose.addEventListener('click', closeBurgerMenu);
}