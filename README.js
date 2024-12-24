// models/FlowerPosition.js
const mongoose = require('mongoose');

// routes/flowers.js
const express = require('express');
const router = express.Router();
const FlowerPosition = require('../models/flower.models');

// Save flower positions
router.post('/save-positions', async (req, res) => {
  try {
    const { giftcardId, flowers } = req.body;
    
    // Update if exists, create if doesn't
    const result = await FlowerPosition.findOneAndUpdate(
      { giftcardId },
      { giftcardId, flowers },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get flower positions
router.get('/get-positions/:giftcardId', async (req, res) => {
  try {
    const { giftcardId } = req.params;
    const positions = await FlowerPosition.findOne({ giftcardId });
    res.json({ success: true, data: positions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

// Modified Three.js scene code to save positions
function saveFlowerPositions() {
  const flowers = Editorscene.children
    .filter(child => child.type === "Mesh" && child !== ground)
    .map(flower => ({
      uuid: flower.uuid,
      position: {
        x: flower.position.x,
        y: flower.position.y,
        z: flower.position.z
      },
      rotation: {
        x: flower.rotation.x,
        y: flower.rotation.y,
        z: flower.rotation.z
      },
      scale: {
        x: flower.scale.x,
        y: flower.scale.y,
        z: flower.scale.z
      },
      geometry: {
        type: flower.geometry.type
      },
      material: {
        color: flower.material.color.getHexString(),
        type: flower.material.type
      }
    }));

  // Send to backend
  fetch('/api/flowers/save-positions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      giftcardId: 'unique-giftcard-id', // Replace with actual giftcard ID
      flowers
    })
  });
}

// Load flower positions
async function loadFlowerPositions(giftcardId) {
  try {
    const response = await fetch(`/api/flowers/get-positions/${giftcardId}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      // Clear existing flowers (except ground)
      Editorscene.children
        .filter(child => child.type === "Mesh" && child !== ground)
        .forEach(flower => {
          Editorscene.remove(flower);
        });
      
      // Recreate flowers from saved positions
      data.data.flowers.forEach(flowerData => {
        let geometry;
        switch(flowerData.geometry.type) {
          case 'SphereGeometry':
            geometry = new THREE.SphereGeometry(1.5, 12, 8);
            break;
          case 'BoxGeometry':
            geometry = new THREE.BoxGeometry(5, 5, 5);
            break;
          // Add other geometry types as needed
        }
        
        const material = new THREE.MeshStandardMaterial({
          color: parseInt(flowerData.material.color, 16)
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          flowerData.position.x,
          flowerData.position.y,
          flowerData.position.z
        );
        mesh.rotation.set(
          flowerData.rotation.x,
          flowerData.rotation.y,
          flowerData.rotation.z
        );
        mesh.scale.set(
          flowerData.scale.x,
          flowerData.scale.y,
          flowerData.scale.z
        );
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        Editorscene.add(mesh);
      });
    }
  } catch (error) {
    console.error('Error loading flower positions:', error);
  }
}

// Add save button event listener
document.getElementById('saveButton').addEventListener('click', saveFlowerPositions);

// Load positions when the scene initializes
loadFlowerPositions('unique-giftcard-id'); // Replace with actual giftcard ID