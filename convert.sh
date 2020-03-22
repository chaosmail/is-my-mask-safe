# convert custom vision model to tf.js
# https://docs.microsoft.com/en-us/azure/cognitive-services/custom-vision-service/export-model-python

MODELDIR=$1
OUTPUTDIR=$2

# Copy the labels
cp $MODELDIR/labels.txt $OUTPUTDIR

# https://github.com/tensorflow/tfjs/tree/master/tfjs-converter
. venv/bin/activate

tensorflowjs_converter --input_format=tf_frozen_model --output_node_names loss:0 $MODELDIR/model.pb $OUTPUTDIR