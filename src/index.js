const url = "http://localhost:3000";
const ramenMenu = document.getElementById("ramen-menu");
const ramenForm = document.getElementById("new-ramen");
const ramenEditForm = document.getElementById('edit-ramen')
const deleteBtn = document.getElementById('delete-btn')
let currentRamen = 0

deleteBtn.addEventListener('click', () => {
  fetch(`${url}/ramens/${currentRamen}`, {
    method: 'DELETE'
  })
  .then(res => {
    if(res.ok){
      res.json()
    } else {
      throw 'delete went wrong'
    }
  })
  .then(data => {
    //remove picture from nav bar
    const ramenToRemoveFromNav = document.querySelector(`img[data-id='${currentRamen}']`)
    ramenToRemoveFromNav.remove()
    //update currentRamen to existing ramen
    //update details to said ramen
    const newFirstRamen = document.querySelector(`#ramen-menu img:first-child`)
    console.log(newFirstRamen)
    currentRamen = parseInt(newFirstRamen.getAttribute('data-id'))
    fetch(`${url}/ramens/${currentRamen}`)
    .then(res => res.json())
    .then(ramen => renderRamen(ramen))
  })
})

ramenForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //build new ramen object such that it looks exactly as it does in db.json
  //get values from form
  const newRamen = {
    name: e.target.name.value,
    restaurant: e.target.restaurant.value,
    image: e.target.image.value,
    rating: parseInt(e.target.rating.value),
    comment: e.target["new-comment"].value,
  };

  //make post request
  fetch(`${url}/ramens`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(newRamen),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw "something went wrong with the POST";
      }
    })
    .then((ramen) => {
      //render new ramen to the page (pessimistically )
      let img = document.createElement("img");
      img.src = ramen.image;
      ramenMenu.append(img);
      //for user interaction
      img.addEventListener("click", () => {
        //NOTE I AM USING THE DATA THAT IS COMING BACK FROM THE SERVER
        //not the newRamen object I created above
        addImageToNav(ramen);
      });
      //so the ramen loads in details immediately upon successful POST request
      renderRamen(ramen);
    });
});

ramenEditForm.addEventListener('submit', (e) => {
  e.preventDefault() 

  //gather information from form
  const newData = {
    rating: parseInt(e.target.rating.value),
    comment: e.target['new-comment'].value 
  }
  //make a patch request
  fetch(`${url}/ramens/${currentRamen}`, {
    method: 'PATCH',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(newData)
  })
  .then(res => res.json())
  //pessimistically update the nav bar / details
  .then(ramenFromServer => {
    let curMenuImage = document.querySelector(`img[data-id='${ramenFromServer.id}']`)
    curMenuImage.removeEventListener('click', () => {
      renderRamen(ramen);
    })
    curMenuImage.addEventListener('click', () => renderRamen(ramenFromServer))
    //renders details to center of page
    renderRamen(ramenFromServer)
  })
})

const displayRamens = () => {
  //1. get information needed
  //2. iterate over the information
  //3. create, update, and append our images
  fetch(`${url}/ramens`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((ramens) => {
      ramens.forEach((ramen) => {
          addImageToNav(ramen)
      });
      //render first ramen on page load (just use renderRamen with the specific ramen to render)
      renderRamen(ramens[0]);
    });
};

const addImageToNav = (ramen) => {
  let img = document.createElement("img");
  img.setAttribute('data-id', `${ramen.id}`)

  img.src = ramen.image;
  ramenMenu.append(img);
  img.addEventListener("click", () => {
    renderRamen(ramen);
  });
}

const renderRamen = (ramen) => {
  //you could also FETCH localhost:3000/ramens/3
  currentRamen = ramen.id 

  const detailImage = document.getElementsByClassName("detail-image")[0];
  const detailName = document.querySelector("#ramen-detail .name");
  const detailRating = document.getElementById("rating-display");
  const detailComment = document.getElementById("comment-display");
  const detailRestaurant = document.querySelector("#ramen-detail .restaurant");

  detailImage.src = ramen.image;
  detailName.textContent = ramen.name;
  detailRestaurant.textContent = ramen.restaurant;
  detailComment.textContent = ramen.comment;
  detailRating.textContent = ramen.rating;
};

displayRamens();

// Export functions for testing
// export {
//   displayRamens,
//   addSubmitListener,
//   handleClick,
//   main,
// };
