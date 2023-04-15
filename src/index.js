import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

const debouncedHandleTask = debounce(handleTask, DEBOUNCE_DELAY);
input.addEventListener('input', debouncedHandleTask);

function handleTask(e) {
  e.preventDefault();

  const input = e.target;
  const value = input.value.trim();
  clearList();

  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        return (countryList.innerHTML = data.reduce(
          (markup, country) => createMarkupList(country) + markup,
          ''
        ));
      } else if (data.length === 1) {
        return (countryInfo.innerHTML = data.reduce(
          (markup, country) => createMarkupCountry(country) + markup,
          ''
        ));
      }
    })
    .catch(errorCountry);
}

function clearList() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function createMarkupList({ name, flags }) {
  return `
  <li>
  <img src="${flags.svg}" alt=" ${name.official}" width="30" hight="20">
    <p class="flag-countries">${name.official}</p>
  </li>
  `;
}

function createMarkupCountry({ name, capital, population, flags, languages }) {
  return `<li>
  <img src="${flags.svg}" alt=" ${name.official}" width="30" hight="20">
    <p class="country flag-countries"><b>${name.official}</b></p>
  <p><b>Capital</b>: ${capital}</p>
  <p><b>Population</b>: ${population}</p>
  <p><b>Languages</b>: ${Object.values(languages)}</p>
  </li>`;
}

function errorCountry() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
