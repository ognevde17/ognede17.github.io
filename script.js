// Gallery logic
const galleryItems = document.querySelectorAll('.gallery-item');
const popup = document.querySelector('.gallery-popup');
const popupImage = document.querySelector('.popup-image');
let currentIndex = 0;

function showPopup(index) {
  currentIndex = index;
  popupImage.src = galleryItems[index].src;
  popup.style.display = 'flex';
  updateControls();
}

function updateControls() {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
  nextBtn.style.display = currentIndex === galleryItems.length - 1 ? 'none' : 'block';
}

// Event listeners
galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => showPopup(index));
});

document.querySelector('.close-popup').addEventListener('click', () => {
  popup.style.display = 'none';
});

document.querySelector('.prev-btn').addEventListener('click', () => {
  if(currentIndex > 0) showPopup(currentIndex - 1);
});

document.querySelector('.next-btn').addEventListener('click', () => {
  if(currentIndex < galleryItems.length - 1) showPopup(currentIndex + 1);
});

// Таймер для попапа
let popupShown = localStorage.getItem('popupClosed');

function showTimedPopup() {
  if(!popupShown) {
    setTimeout(() => {
      const popup = document.createElement('div');
      popup.className = 'timed-popup';
      // Добавить стили и содержимое попапа
      document.body.appendChild(popup);
    }, 30000);
  }
}

// При закрытии попапа
localStorage.setItem('popupClosed', 'true');