const mongoose = require('mongoose');

const flowerPositionSchema = new mongoose.Schema({
  giftcardId: { type: String, required: true },
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
    geometry: {
      type: String  // Store the geometry type (sphere, box, etc.)
    },
    material: {
      color: String,
      type: String
    }
  }]
});

const FlowerPosition = mongoose.model('FlowerPosition', flowerPositionSchema);
module.exports = FlowerPosition;