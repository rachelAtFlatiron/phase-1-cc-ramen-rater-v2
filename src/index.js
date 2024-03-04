// index.js
const ramenMenu = document.getElementById('ramen-menu')
const ramenForm = document.getElementById('new-ramen')
const formToEdit = document.getElementById('edit-ramen')
const detailImg = document.querySelector('.detail-image')
const detailName = document.querySelector('.name')
const restaurant = document.querySelector('.restaurant')
const rating = document.querySelector('#rating-display')
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
  restaurant.textContent = ramen.restaurant 
  rating.textContent = ramen.rating 
  detailComment.textContent = ramen.comment
};

const deleteRamen = () => {
  //clear details section
  detailImg.src = undefined 
  detailComment.textContent = "" 
  detailName.textContent = "" 
  restaurant.textContent = "" 
  rating.textContent = "" 

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
  rating.textContent = e.target.rating.value
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
  formToEdit.addEventListener('submit', (e) => editSubmitListener(e))
  //add delete button 
  const deleteButton = document.createElement('button')
  deleteButton.textContent = "Delete"
  ramenDetail.append(deleteButton)
  deleteButton.addEventListener('click', () => {deleteRamen()})
}

main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
