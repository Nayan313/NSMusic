
let currentIndex = {};

function cardS(cardSliderId, direction) {
  const cardSlider = document.getElementById(cardSliderId);
  const cardSlides = cardSlider.querySelector(".cardSlides");
  const totalSlides = cardSlides.children.length;
  if (!currentIndex[cardSliderId]) {
    currentIndex[cardSliderId] = 0;
  }

  currentIndex[cardSliderId] += direction;

  if (currentIndex[cardSliderId] >= totalSlides) {
    currentIndex[cardSliderId] = 0;
  } else if (currentIndex[cardSliderId] < 0) {
    currentIndex[cardSliderId] = totalSlides - 1;
  }

  const cardWidth = cardSlides.children[0].offsetWidth; // Assuming all cards have the same width
  const cardOffset = -currentIndex[cardSliderId] * cardWidth;
  cardSlides.style.transform = `translateX(${cardOffset}px)`;
}





function hideAllSections() {
  document.querySelector(".Home-content").style.display = "none";
  document.querySelector(".Explore-section").style.display = "none";
  document.querySelector(".CurrentPlaylist-section").style.display = "none";
  document.querySelector(".Artist-section").style.display = "none";
  document.querySelector(".Album-section").style.display = "none";
}

const SectionButtons = document.querySelectorAll(".SidebarButtons");

SectionButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    SectionButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});
let OpenPlaylist = document.querySelectorAll("#OpenPlaylist");
let OpenExplore = document.querySelectorAll("#OpenExplore");
let OpenHome = document.querySelectorAll("#OpenHome");

OpenExplore.forEach((e)=>{
  e.addEventListener("click",()=>{
    hideAllSections();
    document.querySelector(".Explore-section").style.display = "block";
  })
})
OpenHome.forEach((e)=>{
  e.addEventListener("click",()=>{
    hideAllSections();
    document.querySelector(".Home-content").style.display = "block";
  })
})

OpenPlaylist.forEach((e)=>{
  e.addEventListener("click",()=>{
    hideAllSections();
    document.querySelector(".CurrentPlaylist-section").style.display = "block";
  })
})


document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});