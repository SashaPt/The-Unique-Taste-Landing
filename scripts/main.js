const lang = document.querySelectorAll('.lang');
const langOptions = document.querySelectorAll('.lang__options');
const options = document.querySelectorAll('.lang__option');
const selectedLang = document.querySelectorAll('.lang__selected');

const burger = document.querySelectorAll('.burger');
const menu = document.querySelector('.header__nav-wrapper');

const puzzles1 = document.querySelectorAll(
  '.about-author__picture_first .about-author__picture-puzzle'
);
const puzzles2 = document.querySelectorAll(
  '.about-author__picture_second .about-author__picture-puzzle'
);
let changeValue = 1;
let selectedLanguage = 'rus';

const changeLang = (event) => {
  if (
    event.target.dataset.lang === 'eng' &&
    event.target !== event.currentTarget
  ) {
    selectedLanguage = 'eng';
    selectedLang.forEach((item) => {
      item.innerHTML = 'ENG';
    });
  } else {
    selectedLanguage = 'rus';
    selectedLang.forEach((item) => {
      item.innerHTML = 'RUS';
    });
  }
};

const selectLang = (event) => {
  changeValue *= -1;

  event.currentTarget
    .querySelector('.lang__options')
    .classList.toggle('hidden');
  event.currentTarget.querySelector('.lang__block').classList.toggle('hidden');

  for (let option of options) {
    if (option.dataset.lang === selectedLanguage) {
      option.style.order = -1;
      option.querySelector('img').classList.remove('hidden');
      option.querySelector('img').style.transform = `scale(${changeValue})`;
    } else {
      option.style.order = 2;
      option.querySelector('img').classList.add('hidden');
    }
  }

  langOptions.forEach((options) => {
    options.addEventListener('click', (event) => {
      changeLang(event);
    });
  });
};

const toggleMenu = () => {
  menu.classList.toggle('hidden');
  menu
    .querySelector('nav').classList.toggle('scale-width');
};

const openPicture = (collection) => {
  collection.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('about-author__picture-puzzle_hidden');
    }, index * 500);
  });
  setTimeout(() => {
    collection.forEach((item) => {
      item.classList.remove('about-author__picture-puzzle_hidden');
    });
  }, collection.length * 500);
};

const onLoad = () => {
  lang.forEach((lang) => {
    lang.addEventListener('click', (event) => {
      selectLang(event);
    });
  });

  burger.forEach((burger) => {
    burger.addEventListener('click', toggleMenu);
  });
  menu.addEventListener('click', toggleMenu);
  menu
    .querySelector('nav')
    .addEventListener('click', (event) => event.stopPropagation());

  openPicture(puzzles1);
  openPicture(puzzles2);

  setInterval(() => {
    openPicture(puzzles1);
    openPicture(puzzles2);
  }, 500 * (puzzles1.length + 1));
};
window.addEventListener('load', onLoad);