// Time String Setup
function getTimeString(time){
  const hour = parseInt(time / 3600);
  let remainingSecond = (time % 3600);
  const minute = parseInt(remainingSecond / 60);
  const second = remainingSecond % 60;
  return`${hour} hour ${minute} minute ${second} second ago`;
}

const removeActiveClass = () =>{
  const buttons = document.getElementsByClassName("catergory-btn");
  console.log(buttons);
  for(let btn of buttons){
    btn.classList.remove("active");
  }
}

// 1- Fetch, Load and show categories on html

// LoadCategories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((err) => console.log(err));
};

// LoadVideos section
const loadVideos = (searchText) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((err) => console.log(err));
};

// LoadCAtegoryVideos
const loadCategoryVideos = (id) =>{
  // alert(id);
   fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      // active class remove kora
      removeActiveClass();
      // Id er class k active kora
      const activeBtn = document.getElementById(`btn-${id}`)
      activeBtn.classList.add("active");
      displayVideos(data.category)
    })
    .catch((err) => console.log(err));
};

const loadVideoDetails = async(videoId) =>{
  // console.log(videoId);
  const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(uri);
  const data = await res.json();
  displayDetails(data.video);
};

const displayDetails = (video) =>{
    const detailContainer = document.getElementById("modal-content");

    detailContainer.innerHTML = `
    <img src=${video.thumbnail} />
    <p>${video.description}</p>
    `

    // way-1
    // document.getElementById("showModalData").click();

    // way-2
    document.getElementById("customModal").showModal();
}

// const cardDemo = {
//     "category_id": "1003",
//     "video_id": "aaac",
//     "thumbnail": "https://i.ibb.co/NTncwqH/luahg-at-pain.jpg",
//     "title": "Laugh at My Pain",
//     "authors": [
//         {
//             "profile_picture": "https://i.ibb.co/XVHM7NP/kevin.jpg",
//             "profile_name": "Kevin Hart",
//             "verified": false
//         }
//     ],
//     "others": {
//         "views": "1.1K",
//         "posted_date": "13885"
//     },
//     "description": "Comedian Kevin Hart brings his unique brand of humor to life in 'Laugh at My Pain.' With 1.1K views, this show offers a hilarious and candid look into Kevin's personal stories, struggles, and triumphs. It's a laugh-out-loud experience filled with sharp wit, clever insights, and a relatable charm that keeps audiences coming back for more."
// }

// Display Videos
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";

  if(videos.length == 0){
    videoContainer.classList.remove("grid")
    videoContainer.innerHTML = `
    <div class="min-h-screen flex flex-col gap-5 justify-center items-center">
    <img class="w-42 " src="assets/Icon.png" />
    <h2 class="text-center font-bold text-xl">Oops!! Sorry, There is no <br> content here.
    </h2>
    </div>
    `;
    return;
  }
  else{
    videoContainer.classList.add("grid")
  }

  videos.forEach((video) => {
    console.log(video);
    const card = document.createElement("div");
    card.classList = "card card-compact ";
    card.innerHTML = `
    <figure class="h-[250px] relative">
    <img
      src=${video.thumbnail}
      class="h-full w-full object-cover"
      alt="Shoes" />
      ${video.others.posted_date.length == 0 ? "" : `<span class="absolute right-2 bottom-2 rounded p-1 bg-black text-white text-sm">${getTimeString(video.others.posted_date)}</span>`}
      
  </figure>
  <div class="px-0 py-2 flex gap-2">
    <div>
    <img class="w-10 h-10 rounded-full object-cover" src=${
      video.authors[0].profile_picture
    } />
    </div>
    <div>
    <h2 class="font-bold">${video.title}</h2>
    <div class="flex gap-2 items-center">
    <p class="text-gray-500">${video.authors[0].profile_name}</p>
    ${video.authors[0].verified == false
        ? `<img class="w-5 h-5" src="https://img.icons8.com/?size=96&id=D9RtvkuOe31p&format=png" />
`
        : ""}
    </div>
    <p><button onclick="loadVideoDetails('${video.video_id}')" class="btn btn-sm btn-error text-white font-bold">Details</button></p>
    </div>
  </div>
    `;

    videoContainer.append(card);
  });
};
// DisplayCategories show buttons
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories");
  categories.forEach((item) => {
    // console.log(item);

    //   Create Button
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
    <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn catergory-btn">
    ${item.category}
    </button>
    `

    //   Add button to category container
    categoryContainer.append(buttonContainer);
  });
};

document.getElementById("search-input").addEventListener("keyup", (event) =>{
  loadVideos(event.target.value);
})

// function call

loadCategories();
loadVideos();
