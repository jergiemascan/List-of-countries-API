"use strict";

var headers = new Headers();
headers.append(
  "X-CSCAPI-KEY",
  "OEdqVFdCeEV6MnE1d3BsSnFNeTdJVEpoRTdua0lFb05RMjdWM0lReQ=="
);

var requestOptions = {
  method: "GET",
  headers: headers,
  redirect: "follow",
};
/********************************************************************/
const tableCountries = document.getElementById("table-country");
let allCountries = [];
let globalISO = "";

async function getAllCountries() {
  try {
    const response = await fetch(
      `https://api.countrystatecity.in/v1/countries/`,
      requestOptions
    );
    const countries = await response.json();
    // console.log(countries);
    allCountries = countries;
    for (let country of countries) {
      tableCountries.innerHTML += `
        <td>
          <li class="country-list">${country.name} ${country.iso2}
            <button onClick="getCountryDetails(event)"  id=${country.iso2}>Details</button>
            <button onClick="getCountryStates(event)" id=${country.iso2}>States</button>
          </li>
        </td>
      `;
    }
  } catch (error) {
    console.log(error);
  }
}
getAllCountries();

async function getCountryDetails(event) {
  try {
    let iso2 = event.target.id;
    // console.log(iso2);
    if (globalISO !== iso2) {
      document.getElementById("table-country-states").innerHTML = "";
    }

    globalISO = iso2;
    const responseCountryDetails = await fetch(
      `https://api.countrystatecity.in/v1/countries/${iso2}`,
      requestOptions
    );
    const countryDetails = await responseCountryDetails.json();
    // console.log(countryDetails);

    const tableDetails = document.getElementById("table-country-details");
    tableDetails.innerHTML = "";
    // tableDetails.append(countryDetails);
    tableDetails.innerHTML = `
    <td class="details-list">
      <li>Native: ${countryDetails.native}</li>
      <li>Name: ${countryDetails.name}</li>
      <li>Numeric_code: ${countryDetails.numeric_code}</li>
      <li>iso2: ${countryDetails.iso2}</li>
      <li>Capital: ${countryDetails.capital}</li>
      <li>Region: ${countryDetails.region}</li>
      <li>Currency: ${countryDetails.currency}</li>
      <li>Subregion: ${countryDetails.subregion}</li>
    </td>
  `;
  } catch (error) {
    console.log(error);
  }
}

async function getCountryStates(event) {
  try {
    let iso2 = event.target.id;
    // console.log(iso2);
    if (globalISO !== iso2) {
      document.getElementById("table-country-details").innerHTML = "";
    }
    globalISO = iso2;

    const response2 = await fetch(
      `https://api.countrystatecity.in/v1/countries/${iso2}/states`,
      requestOptions
    );
    let tableStates = document.getElementById("table-country-states");
    const countryStatesData = await response2.json();
    // console.log(countryStatesData);
    if (countryStatesData.length === 0) {
      tableStates.innerHTML = `<p class="errorMessage">No States found</p>`;
    } else {
      tableStates.innerHTML = "";
      for (let state of countryStatesData) {
        tableStates.innerHTML += `<li class="state-list">${state.name} ${state.iso2}</li>`;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

let input = document.getElementById("search-country");
function searchCountry(event) {
  try {
    let inputValue = event.target.value;
    tableCountries.innerHTML = "";

    for (let country of allCountries) {
      if (country.name.includes(capitalizeFirstLetter(inputValue))) {
        tableCountries.innerHTML += `
    <td>
      <li class="country-list">${country.name} ${country.iso2}
        <button onClick="getCountryDetails(event)"  id=${country.iso2}>Details</button>
        <button onClick="getCountryStates(event)" id=${country.iso2}>States</button>
      </li>
    </td>
    `;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
