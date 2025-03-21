const mongoose = require("mongoose");

const flowerSchema = new mongoose.Schema({
  giftcardId: String,
  flowers: [
    {
      textureIndex: Number,
      position: {
        x: Number,
        y: Number,
        z: Number,
      },
    },
  ],
});

module.exports = mongoose.model("FlowerPosition", flowerSchema);
