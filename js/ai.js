const loadHubs = async (dataLimit) => {
  
  toggleSpinner(true)
  const url = ` https://openapi.programming-hero.com/api/ai/tools?limit=${dataLimit}`;
  const res = await fetch(url);
  const data = await res.json();
  diplayHubs(data.data.tools,dataLimit);
  toggleSpinner(false);
  
}

const diplayHubs = (hubs , dataLimit) => {
  const featureContainer = document.getElementById("feature-container");
  featureContainer.innerHTML = ''

  const showBtn = document.getElementById("see-btn");
  if (hubs.length > dataLimit) {
    hubs = hubs.slice(0, dataLimit);
    showBtn.classList.remove("d-none");
  }
  else {
    showBtn.classList.add("d-none");
  };
  hubs.forEach(hub => {
    const divCreate = document.createElement("div");
    divCreate.classList.add("col");
    divCreate.innerHTML = `
       <div class="card p-1 rounded-3 h-100">
       <img class="img-fluid h-100" src="${hub.image}" class="card-img-top" alt="...">
       <div class="card-body">
         <h5 class="card-title">Features</h5>
         <p class="card-text">1. ${hub.features[0]}</p>
         <p class="card-text">2. ${hub.features[1]}</p>
         <p class="card-text">3. ${hub.features[2]}</p>
       </div>
       <div class="card-footer d-flex justify-content-between align-items-center">
        <div>
            <h5 class="fw-bold">${hub.name}</h5>
            <div class="d-flex justify-content-between align-items-center">
               <i class="fa-solid fa-calendar-days"></i>
               <p class="fw-bold mt-3">${hub.published_in}</p>
            </div>
        </div>
        <div>
            <i onclick="showDetail(${hub.id})" class="fa-solid fa-arrow-right text-danger" data-bs-toggle="modal" data-bs-target="#hubDetailModal"></i>
        </div>
      </div>
     </div>
       `

    featureContainer.appendChild(divCreate)
    
  });
  

}

// sort data by date function
const sortByDate = (hub) => {
  hub.sort((a, b) => new Date(b.published_in) - new Date(a.published_in));
};

// sort button event listener
const sortBtn = document.getElementById('sort-btn');
sortBtn.addEventListener('click', () => {
  const divContainer = document.getElementById('container');
  const cards = divContainer.querySelectorAll('.card');
  const sortedData = [...cards].map(card => {
      return {
          card,
          date: card.querySelector('p > i.fa-solid.fa-calendar-days').nextSibling.textContent.trim()
      }
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  sortByDate(sortedData);

  sortedData.forEach((item) => {
      divContainer.appendChild(item.card);
  });
});


const showDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/ai/tool/${id<10?'0':''}${id}`
  const res = await fetch(url)
  const data = await res.json()
  displayHubDetails(data)
}




const displayHubDetails = hub => {
  toggleSpinner(true)
  console.log(hub.data.input_output_examples[0].input)

  const hubBody = document.getElementById("hub-details");
  hubBody.innerHTML = ''

  const divCreate = document.createElement("div");
  divCreate.innerHTML = `
  <div class="row d-flex justify-content-center align-items-center">
  <div class="col-md-12 col-lg-6 border rounded-4">
  <h1 class="my-3 text-center fw-bold">${hub.data.description}</h1>
  <div class="card-group gap-2">
  <div class="card text-center">
  
    <div class="card-body border">
      <h5 class="card-title text-success fw-bold">${hub.data.pricing[1].price !== "No cost" ? hub.data.pricing[0].price : hub.data.pricing[0].plan}</h5>
    </div>
  </div>
  <div class="card text-center">
    <div class="card-body border-none">
    <h5 class="card-title text-warning fw-bold">${hub.data.pricing[1].price !== "No cost" ? hub.data.pricing[1].price : hub.data.pricing[1].plan}</h5>
    </div>
  </div>
  <div class="card text-center">
    <div class="card-body border">
    <h5 class="card-title text-danger fw-bold">${hub.data.pricing[2].price !== "No cost" ? hub.data.pricing[2].price : hub.data.pricing[2].plan}</h5>
    </div>
  </div>
</div>

<div class="container mt-3">
  <div class="row">
    <div class="col">
      <h3 class="fw-bold">Features</h3>
      <ol class="mt-3 text-secondary">
        <li class="list-group-item">${hub.data.features[1].feature_name}</li>
        <li class="list-group-item">${hub.data.features[2].feature_name}</li>
        <li class="list-group-item">${hub.data.features[3].feature_name}</li>
      </ol>
    </div>
    <div class="col">
    <h3 class="fw-bold">Integrations</h3>
    <ol class="mt-3 text-secondary">
      <li class="list-group-item">${hub.data.integrations[0] ? hub.data.integrations[0] : "No data Found"}</li>
      <li class="list-group-item">${hub.data.integrations[1] ? hub.data.integrations[1] : "No data Found"}</li>
      <li class="list-group-item">${hub.data.integrations[2] ? hub.data.integrations[2] : "No data Found"}</li>
    </ol>
    </div>
  </div>
  </div>
  </div>
  <div class="col-md-12 col-lg-6 text-center  border rounded-4 p-5 position-relative">
  <img class="img-fluid" src="${hub.data.image_link[0]}" alt=""> 
  <h2 class="mt-2">${hub.data.input_output_examples[0].input ? hub.data.input_output_examples[0].input : "Can you give any example?"}</h2>
  <p class="mt-2 text-secondary">${hub.data.input_output_examples[0].output ? hub.data.input_output_examples[0].output : "No! Not Yet! Take a break!!!"}</p>
  <div class="position-absolute top-0 end-0 bg-danger rounded-2">
  <button class="btn  text-light" style="${hub.data.accuracy.score !== null ? '' : 'display: none;'}">${hub.data.accuracy.score !== null ? hub.data.accuracy.score * 100 : ''}% accuracy</button>
</div>
  </div>
  </div>
  `
  hubBody.appendChild(divCreate);
  toggleSpinner(false)
}


const seeMore = async () => {
  const url = ` https://openapi.programming-hero.com/api/ai/tools`;
  const res = await fetch(url);
  const data = await res.json();
  diplayHubs(data.data.tools);

}

const toggleSpinner = isToggle => {
    const loaderSection = document.getElementById("loader");
    if (isToggle) {
        loaderSection.classList.remove("d-none");
    }
    else {
        loaderSection.classList.add("d-none");
    }
};

const sortData = () => {
  // Sort data based on published date
  const sortedData = hub.data.tools.sort((a, b) => {
    const dateA = new Date(a.published_in);
    const dateB = new Date(b.published_in);
    return dateB - dateA;
  });
  diplayHubs(sortedData, dataLimit);
};


loadHubs(6);