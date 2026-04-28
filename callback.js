const astrosUrl = 'https://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Make an AJAX request
function getJSON(url, hiba) { // hiba para, returns data as soon server sends it.
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = () => {
    if(xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      // console.log(data);
      return hiba(data);
    }
  };
  xhr.send();
}

// Generate the markup for each profile
function generateHTML(data) {
  const section = document.createElement('section');
  peopleList.appendChild(section);
  // Check if request returns a 'standard' page from Wiki
  // if (data.type === 'standard') {
    section.innerHTML = `
      <img src=${data.thumbnail.source}>
      <h2>${data.title}</h2>
      <p>${data.description}</p>
      <p>${data.extract}</p>
    `;
}
//   } else {
//     section.innerHTML = `
//       <img src="profile.jpg" alt="ocean clouds seen from space">
//       <h2>${data.title}</h2>
//       <p>Results unavailable for ${data.title}</p>
//       ${data.extract_html}
//     `;
//   }
// }

btn.addEventListener('click' , (event) =>{
  getJSON(astrosUrl, (json)=>{ //It (API) gives an array of people in space, json receives info from getJson func.
    json.people.map( person => { // Loops through each astronaut in the "people" array
      getJSON(wikiUrl + person.name, generateHTML ); // request to `wikiUrl + person.name` (also API) for each astonaut. Once data comes back, it calls `generateHTML` to render info in the DOM.
    });
  });
  event.target.remove(); // It removes the button after loading info.
});