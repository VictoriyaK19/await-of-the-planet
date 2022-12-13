import 'regenerator-runtime/runtime'
import EventEmitter, { prototype } from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();
    this._loading = document.querySelector("progress");
    this._load();
    this._create();
    this._startLoading();
    this._stopLoading();
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
  </article>
  `;
}

async _load() {
  const URL = "https://swapi.boom.dev/api/planets";
  const arrayPlanets = [];
  const rawData = await fetch(URL);
  const planetsData = await rawData.json();

  let next = planetsData.next;
  let numberOfPages = parseInt(planetsData.count / 10);
  for (let i = 1; i <= numberOfPages; i++) {
    // The substring() method returns the part of the string between the start and end indexes, or to the end of the string. In this case it selects "https://swapi.boom.dev/api/planets?page=" and i adds the number of page
    next = next.substring(0, next.length - 1) + i;

    if (next !== null) {
      const allRawPlanets = await fetch(next);
      const allPlanets = await allRawPlanets.json();
      const results = allPlanets.results;
      results.forEach((element) => {
        arrayPlanets.push(element);
      });
    }
  }
  return arrayPlanets;
}

async _create() {
  const planets = await this._load();
  planets.forEach((planet) => {
    const name = planet.name;
    const terrain = planet.terrain;
    const population = planet.population;
    const box = document.createElement("div");
    box.innerHTML = this._render({ name, terrain, population });
    box.classList.add("box");
    document.body.querySelector(".main").appendChild(box);
  });
}

_startLoading() {
  this._loading.style.display = "block";
}

_stopLoading() {
  this._loading.style.display = "none";
}
}