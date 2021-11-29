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

const tableCountries = document.getElementById("table-country");
const btnSearch = document.getElementById("btn-search");
let input = document.getElementById("search-country");
// generated from function
let btnDetails = document.getElementsByClassName("btn-details");
let btnStates = document.getElementsByClassName("btn-states");

async function getAllCountries() {
  try {
    const response = await fetch(
      `https://api.countrystatecity.in/v1/countries/`,
      requestOptions
    );
    const countries = await response.json();

    for (let country of countries) {
      tableCountries.innerHTML += `
        <td>
          <li class="country-list">${country.name} ${country.iso2}
            <button class="btn-details" id=${country.iso2} value=${country}>Details</button>
            <button class="btn-states" id=${country.iso2}>States</button>
          </li>
        </td>
        `;
    }

    searchCountry(countries);
    getCountryDetails(btnDetails);
    getCountryStates(btnStates);
  } catch (error) {
    console.log(error);
  }
}
getAllCountries();

function getCountryDetails(btnDetails) {
  for (let i = 0; i < btnDetails.length; i++) {
    btnDetails[i].addEventListener("click", async function (e) {
      let iso2 = e.target.id;
      // console.log(iso2);
      const responseCountryDetails = await fetch(
        `https://api.countrystatecity.in/v1/countries/${iso2}`,
        requestOptions
      );
      const countryDetails = await responseCountryDetails.json();
      console.log(countryDetails);
      console.log(countryDetails.capital);

      const tableDetails = document.getElementById("table-country-details");
      tableDetails.innerHTML = "";
      // tableDetails.append(countryDetails);
      tableDetails.innerHTML = `
      <li>Native: ${countryDetails.native}</li>
      <li>Name: ${countryDetails.name}</li>
      <li>Numeric_code: ${countryDetails.numeric_code}</li>
      <li>iso2: ${countryDetails.iso2}</li>
      <li>Capital: ${countryDetails.capital}</li>
      <li>Region: ${countryDetails.region}</li>
      <li>Currency: ${countryDetails.currency}</li>
      <li>Subregion: ${countryDetails.subregion}</li>
      
      `;
    });
  }
}

function getCountryStates(btnStates) {
  for (let i = 0; i < btnStates.length; i++) {
    btnStates[i].addEventListener("click", async function (e) {
      let iso2 = e.target.id;
      console.log(iso2);

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
    });
  }
}

function searchCountry(countries) {
  btnSearch.addEventListener("click", function () {
    const searchCountry = countries.filter((count) => {
      if (input.value === count.name) {
        tableCountries.innerHTML = `
        <td>
          <li class="country-list">${count.name} ${count.iso2}
            <button class="btn-details" id=${count.iso2} value=${count}>Details</button>
            <button class="btn-states" id=${count.iso2}>States</button>
          </li>
        </td> `;
        getCountryDetails(btnDetails);
        getCountryStates(btnStates);
      }
    });
  });
}
