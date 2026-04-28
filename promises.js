/* 
1.Get astronaut list.
2.For each astronaut, fetch their Wikipedia info.
3.Wait for ALL results to come back.
4.Show them nicely on the webpage. 
*/


const astrosUrl = "https://raw.githubusercontent.com/openai/gpt-demo-data/main/astronauts.json";
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if(xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject( Error(xhr.statusText) );
      }
    };
    xhr.onerror = () => reject( Error('A network error occurred') );
    xhr.send();
  });
}

function getProfiles(json) { //The json has a list of astronauts (json.people).
  const profiles = json.people.map( person => { //For each astronaut (person.map), it makes another request to Wikipedia (getJSON(wikiUrl + person.name)).
    return getJSON(wikiUrl + person.name); //That gives us a bunch of promises (one for each astronaut).
  }); 
  return Promise.all(profiles); // It is a all or none response.
}

//"Take the astronaut list → fetch Wikipedia info for all of them → wait until everyone’s info is ready."




function generateHTML(data) {
  data.map(person=> {
    const section = document.createElement('section'); //For each astronaut: Make a new <section> in the page.
    peopleList.appendChild(section); //Add it inside peopleList.
    // The ? says: "Only try to get .source if thumbnail exists. Otherwise, just return undefined."
    section.innerHTML = `
      <img src=${person.thumbnail?.source}> 
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
    `;
  })
  // if (data.type === 'standard') {} else {section.innerHTML = `
  //     <img src="img/profile.jpg" alt="ocean clouds seen from space">
  //     <h2>${data.title}</h2>
  //     <p>Results unavailable for ${data.title}</p>
  //     ${data.extract_html}
  //   `;
  // }
}

//"Take the astronaut details → build a section for each → put it on the webpage."


btn.addEventListener('click', (event) => {
  event.target.textContent = "Loading..." //When the button is clicked, it shows the text.

  getJSON(astrosUrl) //Fetch a list of astronauts.
    .then(getProfiles) //Data is handed to it to get more details (profiles of astronauts).
    .then(generateHTML) //Finished profiles are handed to it which builds and shows the info on the webpage.
    .catch( err => {
      peopleList.innerHTML = '<h3>Oops! Something went wrong.</h3>';
      console.log(err) 
    })
    .finally( ()=>  event.target.remove())

    //"Get the data → process it → show it → if there’s a problem, catch it."

});

