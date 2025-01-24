let classifier;
let imageModelURL = "https://teachablemachine.withgoogle.com/models/_7FwZ1ewW/";

let video;
let label = "";
let confidence = 0;

const images = [
  {
    src: "https://i.pinimg.com/736x/f4/7e/d8/f47ed8f0acd6fe8ee238d75ef26df199.jpg",
    category: "Ofensiva",
  },
  {
    src: "https://i.pinimg.com/736x/a9/b3/5f/a9b35f29537a463c277eb9535db791f3.jpg",
    category: "Ofensiva",
  },
  {
    src: "https://i.pinimg.com/736x/6b/2c/60/6b2c6067ef2eca70cd24cd22cdd3e565.jpg",
    category: "Ofensiva",
  },
  {
    src: "https://i.pinimg.com/736x/4c/9b/77/4c9b77c2e9124f52fdf8a9ab69e37bd0.jpg",
    category: "Ofensiva",
  },
  {
    src: "https://i.pinimg.com/736x/5e/35/b2/5e35b289ba6ea676610fd648377e3548.jpg",
    category: "Defensiva",
  },
  {
    src: "https://i.pinimg.com/736x/df/78/55/df78557e738a417a72d4cfdeb6091b64.jpg",
    category: "Defensiva",
  },
  {
    src: "https://i.pinimg.com/736x/3a/75/b7/3a75b7faba86a993b7f0bd7024a283ee.jpg",
    category: "Defensiva",
  },
  {
    src: "https://i.pinimg.com/736x/75/e1/0b/75e10bc062d5ac10da1f10d354fb18ec.jpg",
    category: "Defensiva",
  },
];

let currentImageIndex = 0;
let imageChanged = false; // Esta variable controla si ya se ha cambiado la imagen

// Variables para el confeti
let confettiParticles = [];
let confettiActive = false;
let confettiTimer = 0;

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

  // Efecto de confeti
  if (confettiActive) {
    for (let i = 0; i < confettiParticles.length; i++) {
      let particle = confettiParticles[i];
      particle.update();
      particle.show();
    }

    // Desactivar confeti después de 2 segundos
    if (millis() - confettiTimer > 2000) {
      confettiActive = false;
      confettiParticles = []; // Limpiar partículas
    }
  }
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

  // Verificar condiciones para cambiar la imagen
  if (shouldChangeImage()) {
    nextImage();
    imageChanged = true; // Marca que la imagen ya fue cambiada
    startConfetti(); // Inicia el efecto de confeti
  }

  classifyVideo(); // Continuar con la clasificación
}

function shouldChangeImage() {
  return (
    (label === "moneda de dolar" &&
      confidence > 0.9 &&
      images[currentImageIndex].category === "Defensiva") ||
    (label === "mando de juego" &&
      confidence > 0.9 &&
      images[currentImageIndex].category === "Ofensiva")
  );
}

function nextImage() {
  let newIndex;

  // Asegurarnos de no repetir la misma imagen
  do {
    newIndex = Math.floor(Math.random() * images.length);
  } while (newIndex === currentImageIndex); // No repetir la imagen

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

// Función para iniciar el efecto de confeti
function startConfetti() {
  confettiActive = true;
  confettiTimer = millis(); // Inicia el temporizador

  // Crear partículas de confeti
  for (let i = 0; i < 100; i++) {
    confettiParticles.push(new ConfettiParticle());
  }
}

// Clase para crear las partículas de confeti
class ConfettiParticle {
  constructor() {
    // Las partículas pueden originarse desde los laterales de la pantalla de la computadora
    let side = random(["top", "left", "right"]);

    if (side === "top") {
      this.x = random(width);
      this.y = random(-50, -10); // Parte superior de la pantalla
    } else if (side === "left") {
      this.x = random(-50, -10); // Lateral izquierdo
      this.y = random(height);
    } else {
      this.x = random(width + 10, width + 50); // Lateral derecho
      this.y = random(height);
    }

    this.size = random(5, 10);
    this.speed = random(2, 5);
    this.angle = random(TWO_PI);
    this.color = color(random(255), random(255), random(255)); // Colores aleatorios
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.size *= 0.98; // Hacer que las partículas se hagan más pequeñas
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }
}
