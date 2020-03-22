# Is my mask safe to use for COVID-19

[Hackathon project](https://devpost.com/software/einfuhr-von-schutzmasken-und-selbst-schnelltest-verteilung) demo [#WirVsVirus](https://wirvsvirushackathon.devpost.com/) for identifying face mask and determining their quality using Machine Learning. This demo can run on any device with a browser and a webcam.

1. Open https://chaosmail.github.io/is-my-mask-safe/
2. Allow access to the camera
3. Get in the center of the frame
4. Click "analyze"
5. Follow the steps to make sure your mask is safe
6. Share

## Tech

We train a classification model using [CustomVision.ai](https://www.customvision.ai/), export the model and embed the model using [TensorFlow.js](https://www.tensorflow.org/js) in a static website. The demo is served from Github Pages.
