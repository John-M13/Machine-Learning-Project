// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/pVvhnVTDQ/";

// Video
let video;
let label = "";
let confidence = 0;

// Images and categories
const images = [
  {
    src: "https://i.pinimg.com/736x/f4/7e/d8/f47ed8f0acd6fe8ee238d75ef26df199.jpg",
    category: "Ofensiva",
  },
  {
    src: "https://i.pinimg.com/736x/4c/ff/63/4cff63e0d8e57bce59784c0869fe6230.jpg",
    category: "Ofensiva",
  },
  {
    src: "https://i.pinimg.com/736x/a9/b3/5f/a9b35f29537a463c277eb9535db791f3.jpg",
    category: "Ofensiva",
  },
  {
    src: "https://i.pinimg.com/736x/76/a1/db/76a1db22ec15a090aac8021295b43892.jpg",
    category: "Equilibrada",
  },
  {
    src: "https://i.pinimg.com/736x/76/a1/db/76a1db22ec15a090aac8021295b43892.jpg",
    category: "Equilibrada",
  },
  {
    src: "https://i.pinimg.com/736x/4c/ff/63/4cff63e0d8e57bce59784c0869fe6230.jpg",
    category: "Equilibrada",
  },
  {
    src: "https://i.pinimg.com/736x/75/e1/0b/75e10bc062d5ac10da1f10d354fb18ec.jpg",
    category: "Defensiva",
  },
  {
    src: "https://i.pinimg.com/736x/3a/75/b7/3a75b7faba86a993b7f0bd7024a283ee.jpg",
    category: "Defensiva",
  },
];

let currentImageIndex = 0;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  createCanvas(400, 300);
  video = createCapture(VIDEO);
  video.size(400, 280);
  video.hide();

  // Display the first image
  updateImage();

  // Start classifying after the video has loaded
  video.elt.addEventListener("loadeddata", () => {
    classifyVideo();
  });

  // Add event listener to the change image button
  const changeImageBtn = document.getElementById("change-image-btn");
  changeImageBtn.addEventListener("click", () => {
    nextImage();
  });
}

function draw() {
  background(0);
  image(video, 0, 0);

  // Display classification results
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
  textSize(8);
  textAlign(LEFT);
  text(confidence, 10, height - 4);
}

function classifyVideo() {
  classifier.classify(video, gotResult);
}

function gotResult(results, error) {
  if (error) {
    console.error(error);
    return;
  }

  label = results[0].label;
  confidence = results[0].confidence;

  console.log(`Label: ${label}, Confidence: ${confidence}`);

  // Check conditions for image transition
  const currentCategory = images[currentImageIndex].category;

  if (
    label === "targeta de bus" &&
    confidence > 0.8 &&
    currentCategory === "Ofensiva"
  ) {
    nextImage();
  }

  classifyVideo(); // Keep classifying
}

function nextImage() {
  let newIndex;

  do {
    newIndex = Math.floor(Math.random() * images.length);
  } while (newIndex === currentImageIndex);

  currentImageIndex = newIndex;
  updateImage();
}

function updateImage() {
  const imageElement = document.getElementById("current-image");

  if (imageElement) {
    const currentImage = images[currentImageIndex];
    imageElement.src = currentImage.src;
    console.log(`Updated to image: ${currentImage.src}`);
  } else {
    console.error("Error: HTML element not found.");
  }
}
