const astrosUrl = 'https://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Handle all fetch requests


// This function catches any error.
async function getJSON(url){
    try {
        // all code that needs to be executed.
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        // expection code from try block.
        throw error;
    }
}

async function getPeopleInSpace(url){
    const peopleJSON = await getJSON(url);

    const profiles = peopleJSON.people.map( async(person)=>{
        const craft = person.craft;
        const profileJSON= await getJSON(wikiUrl + person.name); 

        return{...profileJSON, craft};
    });

    return Promise.all(profiles);
}

// Generate the markup for each profile
function generateHTML(data) {
  data.map( person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    // Check if request returns a 'standard' page from Wiki
      section.innerHTML = `
        <img src="${person.thumbnail?.source || 'profile.jpg'}" alt="ocean clouds seen from space">    
        <span>${person.craft}</span>
        <h2>${person.title}</h2>
        <p>${person.description}</p>
        <p>${person.extract}</p>
      `;
    //   if (person.type === 'standard') {
    // } else {
    //   section.innerHTML = `
    //     <img src="profile.jpg" alt="ocean clouds seen from space">
    //     <h2>${person.title}</h2>
    //     <p>Results unavailable for ${person.title}</p>
    //     ${person.extract_html}
    //   `;
    // }
  });
  
}

btn.addEventListener('click', async (event) => {
  event.target.textContent = "Loading...";
  getPeopleInSpace(astrosUrl)
  .then(generateHTML)
  .catch(e => { // This a user friendly error message.
    peopleList.innerHTML ='<h3>Oops! Something went wrong.</h3>';
    console.error(e);
  })
  .finally(()=> event.target.remove())




// Synchronous...
  // const astros = await getPeopleInSpace(astrosUrl);
  // generateHTML(astros);
  // event.target.remove();

 
});