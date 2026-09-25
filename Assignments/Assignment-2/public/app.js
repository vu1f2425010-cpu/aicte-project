const uploadForm = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const previewBox = document.getElementById('previewBox');
const previewImage = document.getElementById('previewImage');
const galleryList = document.getElementById('galleryList');

const API_URL = 'http://localhost:5002';

function renderImageList(images) {
  if (!images.length) {
    galleryList.innerHTML = '<li class="empty-state">No uploaded images yet.</li>';
    return;
  }

  galleryList.innerHTML = images
    .map(
      image => `
        <li>
          <img src="${API_URL}${image}" alt="Uploaded image" />
        </li>
      `
    )
    .join('');
}

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewImage.src = reader.result;
    previewBox.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = imageInput.files[0];

  if (!file) {
    alert('Choose an image first.');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    const images = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
    images.push(data.imageUrl);
    localStorage.setItem('uploadedImages', JSON.stringify(images));
    renderImageList(images);
    uploadForm.reset();
    previewBox.classList.add('hidden');
  } catch (error) {
    alert('Image upload failed.');
  }
});

const savedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
renderImageList(savedImages);
