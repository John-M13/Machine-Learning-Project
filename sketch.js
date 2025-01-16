// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/[...]";

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let confidence = 0;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  createCanvas(400, 300); // Canvas más ancho para centrar la cámara
  // Create the video capture
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide(); // Hide the HTML video element

  // Start classifying after the video has loaded
  video.elt.addEventListener("loadeddata", () => {
    classifyVideo();
  });
}

function draw() {
  background(0);

  // Calcular la posición para centrar el video
  let x = (width - video.width) / 2; // Coordenada X centrada
  let y = 20; // Coordenada Y ligeramente hacia abajo

  // Dibujar el video centrado
  image(video, x, y, 320, 240);

  // Dibujar el label y la confianza
  fill(255);
  textSize(16);
  textAlign(CENTER);

  // Mostrar el nombre del label y el nivel de confianza
  text(`Label: ${label}`, width / 2, 270);
  text(`Confidence: ${(confidence * 100).toFixed(2)}%`, width / 2, 290);
}

// Classify the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video); // Flip the video
  classifier.classify(flippedVideo, gotResult); // Classify the flipped video
  flippedVideo.remove(); // Remove flipped image
}

// When we get a result
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // Store the label and confidence
  label = results[0].label;
  confidence = results[0].confidence;
  // Call classifyVideo again to loop
  classifyVideo();
}
