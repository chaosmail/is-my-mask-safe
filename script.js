const inputDiv = document.getElementById('input-div');
const resultDiv = document.getElementById('result-div');
const video = document.getElementById('video-input');
const image = document.getElementById('img-result');
const labels = document.getElementsByClassName('label');

let track;
if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      track = stream.getVideoTracks()[0]
    })
    .catch((err) => {
      console.log("Something went wrong with loading the video!");
      console.error(err);
    });
}

const btnAnalyze = document.getElementById('analyze');
btnAnalyze.addEventListener("click", function() {
  takePhoto();
});

const btnRetry = document.getElementById('retry');
btnRetry.addEventListener("click", function() {
  inputDiv.classList.remove('hidden');
  resultDiv.classList.add('hidden');
  for (let i = 0; i < labels.length; ++i) {
    labels[i].classList.add('hidden');
  }
});

// Load the model
const MODEL_URL = 'web_model/model.json';
let model;
tf.loadGraphModel(MODEL_URL).then(m => {
  btnAnalyze.disabled = false;
  model = m;
});

function takePhoto() {
  let imageCapture = new ImageCapture(track);
  imageCapture.takePhoto()
    .then(onPhotoTaken)
    .catch((err) => {
      console.log("Something went wrong with taking the picture!");
      console.error(err);
    });
}

function onPhotoTaken(blob) {
  inputDiv.classList.add('hidden');
  resultDiv.classList.remove('hidden');
  
  let aspectRatio = track.getSettings().aspectRatio;
  let width = image.offsetWidth;
  let height = Math.max(image.offsetWidth / aspectRatio, 224);
  image.height = height;
  image.src = URL.createObjectURL(blob);

  predictMask();
}

const width=224, height=224;
function predictMask() {
  // Preprocess the image from the webcam
  let rgb = tf.browser.fromPixels(video);
  let bgr = tf.reverse(rgb, -1);
  let preprocessed = tf.image.resizeBilinear(bgr, [width, height]).reshape([1,width,height,3]);
  
  // Predict the image class
  let prediction = model.predict(preprocessed);
  let proba = prediction.as1D().dataSync();

  let label = argMax(proba);
  let div = document.getElementById('label-' + label);
  if (div) {
    div.classList.remove('hidden');
  }
  addProgress(label, proba[label])
  console.log(label, proba[label]);
}

function addProgress(label, proba) {
  const container = document.getElementById('proba-' + label);
  container.innerHTML = "";
  const probaLabel = new ProgressBar.Circle(container, {
    strokeWidth: 12,
    easing: 'easeOut',
    duration: 1500,
    color: '#007bff',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: null
  });
  probaLabel.animate(proba);
  probaLabel._container.title = "Confidence " + Math.round(proba * 100) + "%";
}

function argMax(arr) {
  return arr.indexOf(Math.max.apply(Math, arr))
}