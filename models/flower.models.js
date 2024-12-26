const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
  giftcardId: String,
  flowers: [{
    uuid: String,
    position: {
      x: Number,
      y: Number,
      z: Number
    },
    rotation: {
      x: Number,
      y: Number,
      z: Number
    },
    scale: {
      x: Number,
      y: Number,
      z: Number
    },
    geometryType: String,
    materialColor: String,
    materialType: String
  }]
});

module.exports = mongoose.model('FlowerPosition', flowerSchema);