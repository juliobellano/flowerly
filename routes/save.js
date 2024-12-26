const express = require('express');
const router = express.Router();
const FlowerPosition = require('../models/flower.models');
const { v4: uuidv4 } = require('uuid');

// Save flower positions
router.post('/save-positions', async (req, res) => {
  try {
      const { giftcardId, flowers } = req.body;
      
      const mappedFlowers = flowers.map(flower => ({
          uuid: flower.uuid,
          position: flower.position,
          rotation: flower.rotation,
          scale: flower.scale,
          geometryType: flower.geometry.type,
          materialColor: flower.material.color,
          materialType: flower.material.type
      }));

      const result = await FlowerPosition.findOneAndUpdate(
          { giftcardId },
          { giftcardId, flowers: mappedFlowers },
          { upsert: true, new: true }
      );

      res.json({ success: true, data: result });
  } catch (error) {
      console.error('Save error:', error);
      res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/get-positions/:giftcardId', async (req, res) => {
  try {
      const positions = await FlowerPosition.findOne({ 
          giftcardId: req.params.giftcardId 
      });
      res.json({ success: true, data: positions });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
// Get flower positions
router.get('/get-positions/:giftcardId', async (req, res) => {
    try {
        const { giftcardId } = req.params;
        const positions = await FlowerPosition.findOne({ giftcardId });
        
        if (!positions) {
            return res.status(404).json({
                success: false,
                error: 'Giftcard not found'
            });
        }
        
        res.json({ success: true, data: positions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;