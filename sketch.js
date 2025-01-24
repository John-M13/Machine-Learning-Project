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
    src: "https://i.pinimg.com/736x/76/a1/db/76a1db22ec15a090aac8021295b43892.jpg",
    category: "Equilibrada",
  },
  {
    src: "https://i.pinimg.com/736x/28/99/5a/28995a1e1775f0fec82121cb16a4b47a.jpg",
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

  // Check conditions for image transition
  const currentCategory = images[currentImageIndex].category;

  if (
    label === "targeta de bus" &&
    confidence > 0.8 &&
    currentCategory === "Ofensiva"
  ) {
    nextImage();
  } else if (
    label === "moneda de dolar" &&
    confidence > 0.8 &&
    currentCategory === "Equilibrada"
  ) {
    nextImage();
  } else if (
    label === "mando de videojuego" &&
    confidence > 0.8 &&
    currentCategory === "Defensiva"
  ) {
    nextImage();
  }

  classifyVideo(); // Keep classifying
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length; // Move to the next image
  updateImage();
}

function updateImage() {
  const imageElement = document.getElementById("current-image");
  const categoryLabel = document.getElementById("category-label");

  imageElement.src = images[currentImageIndex].src;
  categoryLabel.textContent = `Categoría: ${images[currentImageIndex].category}`;
}
