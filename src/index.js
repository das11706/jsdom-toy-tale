let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', (event) => {
        event.preventDefault()
        postToy(event.target)
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


// When the page loads, make a 'GET' request to fetch 
// all the toy objects. With the response data, 
// make a <div class="card"> for each toy and 
// add it to the toy-collection div.

function getToys() {
  return fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToys(toy)
      })
    })
}

// When a user submits the toy form, two things should happen:

// a POST request should be sent 
// to http://localhost:3000/toys and the new toy added 
// to Andy's Toy Collection.
// If the post is successful, the toy should be 
// added to the DOM without reloading the page.

function postToy(toy_data) {
  return fetch("http://localhost:3000/toys", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": toy_data.name.value,
      "image": toy_data.image.value,
      "likes": 0
    })
  })
    .then(response => response.json())
    .then ((obj_toy) => {
      renderToys(obj_toy)
    })
}


let divCollect = document.querySelector('#toy-collection')


function renderToys(toy) {
  let h2 = document.createElement('h2')
  h2.innerText = toy.name

  let img = document.createElement('img')
  img.setAttribute('src', toy.image)
  img.setAttribute('class', 'toy-avatar')

  let p = document.createElement('p')
  p.innerText = `${toy.likes} likes`

  let btn = document.createElement('button')
  btn.setAttribute('class', 'like-btn')
  btn.setAttribute('id', toy.id)
  btn.innerText = "like"
  btn.addEventListener('click', (event) => {
    console.log(event.target.dataset);
    likes(event)
  })

  let divCard = document.createElement('div')
  divCard.setAttribute('class', 'card')
  divCard.append(h2, img, p, btn)
  divCollect.append(divCard)

}



// When a user clicks on a toy's like button, 
// two things should happen:

// A patch request (i.e., method: "PATCH") should be sent 
// to the server at http://localhost:3000/toys/:id, updating 
// the number of likes that the specific toy has
// If the patch is successful, the toy's like count 
// should be updated in the DOM without reloading the page



function likes(event) {
  event.preventDefault()
  
  let more = parseInt(event.target.previousElementSibling.innerText) + 1

  fetch(`http://localhost:3000/toys/${event.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": more
    })
  })
  .then(response => response.json())
  .then((like_obj => {
    event.target.previousElementSibling.innerText = `${more} likes`;
  }))
}