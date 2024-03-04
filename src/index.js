/*
  TESTING COMMENT CHANGES
  IF YOU WERE TO PAIR PROGRAM
  person 1: types -> commits -> pushes changes to remote (github.com)
  person 2: pull changes from remote (from github.com) -> types -> commits -> push changes to remote (github.com)

  EACH WORKING ON YOUR OWN BRANCH
  **MAIN IS ALWAYS SUPPOSED TO BE A WORKING BRANCH
  **MERGE MAIN INTO YOUR BRANCH SO YOU KNOW THERE ARE NO CONFLICTS
  **MAKE SURE MAIN IS ALWAYS UP TO DATE
  1. make changes on your branch
  2. commit them
  3. merge main into your branch
  4. make sure everything works, all conflicts are resolved, everything is as expected, etc.
  5. push your branch changes to remote (github.com)
  6. switch back to main
  7. merge your branch into main
  8. push local changes in main to remote (github.com)
*/

// index.js
const ramenMenu = document.getElementById('ramen-menu')
const ramenForm = document.getElementById('new-ramen')
const editForm = document.getElementById('edit-ramen')
const detailImg = document.querySelector('.detail-image')
const detailName = document.querySelector('.name')
const detailRestaurant = document.querySelector('.restaurant')
const detailRating = document.querySelector('#rating-display')
const detailComment = document.querySelector('#comment-display')
//curRamen also aligns with ramen.id
let curRamen = 0
const url = "http://localhost:3000"
const ramenDetail = document.getElementById('ramen-detail')
// Callbacks
const handleClick = (ramen) => {
  console.log(ramen)
  //curRamen also aligns with ramen.id
  curRamen = ramen.id
  
  detailImg.src = ramen.image 
  detailName.textContent = ramen.name 
  detailRestaurant.textContent = ramen.restaurant 
  detailRating.textContent = ramen.rating 
  detailComment.textContent = ramen.comment
};

const deleteRamen = () => {
  //clear details section
  detailImg.src = undefined 
  detailComment.textContent = "" 
  detailName.textContent = "" 
  detailRestaurant.textContent = "" 
  detailRating.textContent = "" 

  //remove from menu
  //1. compare curRamen (ramen.id) to menu img's id (ramen.id)
  let escapedId = CSS.escape(curRamen)
  const removeMenuDiv = document.querySelector(`#${escapedId}`)
  removeMenuDiv.remove()
  //DELETE
}

const addRamenToMenu = (ramen) => {
  const ramenImg = document.createElement('img')
  ramenImg.src = ramen.image
  ramenImg.className = "menu-img"
  
  ramenImg.id = ramen.id
  ramenMenu.append(ramenImg)
  ramenImg.addEventListener('click', () => handleClick(ramen))
}

const addSubmitListener = (e) => {
  e.preventDefault()
  //ramen object
  const newRamen = {
    name: e.target.name.value,
    restaurant: e.target.restaurant.value,
    image: e.target.image.value,
    rating: e.target.rating.value,
    comment: e.target["new-comment"].value
  }
  addRamenToMenu(newRamen)
}

const editSubmitListener = (e) => {
  e.preventDefault()
  detailComment.textContent = e.target["new-comment"].value 
  detailRating.textContent = e.target.rating.value
  //PATCH request might be nice 
  
}

const displayRamens = () => {
  // request data from server 
  fetch(`${url}/ramens`)
  .then(res => {
    if(res.ok){
      return res.json()
    } else {
      console.error('something went wrong')
    }
  })
  .then(ramens => {
    //display image in ramenMenu
    ramens.forEach(ramen => {
      addRamenToMenu(ramen)
    })
    
  })
  .catch(err => console.error('something went wrong'))

};

const main = () => {
  // Invoke displayRamens here

  displayRamens()
  // Invoke addSubmitListener here
  ramenForm.addEventListener('submit', (e) => addSubmitListener(e))
  fetch(`${url}/ramens/3`)
  .then(res => {
    if (res.ok) {
      return res.json()
    } else {
      console.error('something went wrong')
    }
  })
  .then(ramen => {
    handleClick(ramen)
  })
  editForm.addEventListener('submit', (e) => editSubmitListener(e))
  //add delete button 
  const deleteButton = document.createElement('button')
  deleteButton.textContent = "Delete"
  ramenDetail.append(deleteButton)
  deleteButton.addEventListener('click', () => {deleteRamen()})
}

document.addEventListener('DOMContentLoaded', () => main())

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
