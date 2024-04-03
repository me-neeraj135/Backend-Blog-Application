/** @format */

let dropDownDiv = document.querySelector(`.profileHeading`);
let ul = document.querySelector(`.profileUl`);

function handleDisplay(e) {
  let t = e.target;
  console.log(t);
  ul.classList.toggle(`display-none`);
}

dropDownDiv.addEventListener(`click`, handleDisplay);
