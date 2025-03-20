console.log('Three.js script loading...');

import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

console.log('THREE object:', THREE);
console.log('OrbitControls:', OrbitControls);

let Editorcamera, Editorscene, editorRenderer, ground, bouquetLower, bouquetUpper, ribbon, raycaster, pointer, pointerGround, hoveredMesh, activeMesh;
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load('/textures/wrap.png');
colorTexture.colorSpace = THREE.SRGBColorSpace;
const material = new THREE.MeshPhysicalMaterial({ map: colorTexture });
material.side = THREE.DoubleSide

let hoveredMeshUUID = null;
const geometries = [
    'textures/blue.PNG',
    'textures/kindaPink.PNG',
    'textures/orange.PNG',
    'textures/pinkNoSmile.PNG',
    'textures/pinkSmile.PNG',
    'textures/redSmile.PNG',
    'textures/whiteSmile.PNG'
];

function main() {

    async function loadFromUrl(specificId = null) {
        // Get ID either from URL parameters or passed argument
        const urlParams = new URLSearchParams(window.location.search);
        const id = specificId || urlParams.get('id') || 'test-giftcard-1';
        
        try {
            const response = await fetch(`/api/get-positions/${id}`);
            const data = await response.json();
            
            if (!data.success || !data.data?.flowers) {
                console.error('Invalid flower data:', data);
                return;
            }
    
            // Clear existing flowers
            const meshesToRemove = Editorscene.children.filter(
                child => child.type === "Mesh" && 
                child !== ground && 
                child !== bouquetLower && 
                child !== bouquetUpper && 
                child !== ribbon
            );
            meshesToRemove.forEach(mesh => {
                mesh.geometry.dispose();
                mesh.material.dispose();
                Editorscene.remove(mesh);
            });
            
            // Load flowers
            data.data.flowers.forEach((flowerData) => {
                try {
                    const textureIndex = flowerData.textureIndex;
                    
                    if (textureIndex === undefined || textureIndex < 0 || textureIndex >= geometries.length) {
                        console.error(`Invalid textureIndex:`, textureIndex);
                        return;
                    }
    
                    const texturePath = geometries[textureIndex];
                    
                    const texture = new THREE.TextureLoader().load(texturePath);
                    const geometry = new THREE.PlaneGeometry(7, 11, 1, 1);
                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                        alphaTest: 0.1,
                        side: THREE.DoubleSide
                    });
                    
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(
                        Number(flowerData.position.x),
                        Number(flowerData.position.y),
                        Number(flowerData.position.z)
                    );
                    
                    Editorscene.add(mesh);
                } catch (error) {
                    console.error('Error creating flower:', error);
                }
            });
        } catch (error) {
            console.error('Error loading flower positions:', error);
        }
    }

    const canvas = document.getElementById('OptionCanvas');
    const editorCanvas = document.getElementById('editor');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
    editorRenderer = new THREE.WebGLRenderer({ antialias: true, canvas: editorCanvas, alpha:true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(window.devicePixelRatio);

    editorRenderer.setClearColor(0xF2D4C2, 1);
    editorRenderer.setSize(editorCanvas.clientWidth * window.devicePixelRatio, editorCanvas.clientHeight * window.devicePixelRatio, false);
    editorRenderer.shadowMap.enabled = true;
    
    function makeOptionScene(sceneElement) {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xd7b0b0);

        const camera = new THREE.PerspectiveCamera(50, 1, 1, 10);
        camera.position.set(0, 0, 2);

        const controls = new OrbitControls(camera, sceneElement);
        controls.minDistance = 2;
        controls.maxDistance = 5;
        controls.enablePan = false;
        controls.enableZoom = false;

        // Add lights
        scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444, 3));
        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(1, 1, 1);
        scene.add(light);

        return { scene, camera, controls, element: sceneElement };
    }

    function makeEditorScene() {
        Editorscene = new THREE.Scene();
    
        Editorcamera = new THREE.PerspectiveCamera(60, editorCanvas.clientWidth / editorCanvas.clientHeight, 0.1, 1000);
        Editorcamera.position.set(0, 0, 35);
    
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        Editorscene.add(ambientLight);
        
        Editorcamera.lookAt(new THREE.Vector3(0, 0, 0));

        raycaster = new THREE.Raycaster();
        pointer = new THREE.Vector2();
        pointerGround = new THREE.Vector3();
    }

    function setUpOptionScene() {
    
        const content = document.getElementById('content');
        const scenes = [];

        for (let i = 0; i < geometries.length; i++) {
            // Create list item
            const element = document.createElement('div');
            element.className = 'list-item';
            element.setAttribute('data-array-number', i); // Set data attribute

            // Add event listener directly to the element
            element.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                console.log('Event target:', event.target);
    
                if (activeMesh) {return;}

                const arrayNumber = event.currentTarget.getAttribute('data-array-number');
                putOnCanvas(parseInt(arrayNumber)); // Pass the array index to create the geometry
            });
    
            // Create scene container
            const sceneElement = document.createElement('div');
            sceneElement.className = 'scene-container'; // Optional for styling
            element.appendChild(sceneElement);
    
            // Create description
            const descriptionElement = document.createElement('div');
            descriptionElement.innerText = 'Flower ' + (i + 1);
            element.appendChild(descriptionElement);
    
            content.appendChild(element);

            // Create scene
            const sceneInfo = makeOptionScene(sceneElement);
    
            // Create scene
            const texture = new THREE.TextureLoader().load(geometries[i]);
            const geometry = new THREE.BoxGeometry(1, 1, 1);
    
            // Create geometry and material
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: false,
                alphaTest: 0.2,
                side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(geometry, material);
            sceneInfo.scene.add(mesh);
    
            scenes.push(sceneInfo);
        }
    
        return scenes;
    }

    function setUpEditorScene() {
        makeEditorScene();
        loadFromUrl();

        const textureLoader = new THREE.TextureLoader();
        const Bouquettexture1 = new THREE.TextureLoader().load('textures/lowerLayer.PNG');
        const Bouquettexture2 = new THREE.TextureLoader().load('textures/upperLayer.PNG');
        const ribbonTexture= new THREE.TextureLoader().load('textures/ribbon.PNG');
        
        // Create materials with shared properties
        const commonMaterialProps = {
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        };
     
        const materials = {
            ground: new THREE.MeshPhysicalMaterial({ color: 0xF2D4C2 }),
            bouquetLower: new THREE.MeshBasicMaterial({ map: Bouquettexture1, ...commonMaterialProps }),
            bouquetUpper: new THREE.MeshBasicMaterial({ map: Bouquettexture2, ...commonMaterialProps }),
            ribbon: new THREE.MeshBasicMaterial({ map: ribbonTexture, ...commonMaterialProps }) 
        };
     
        const geometries = {
            ground: new THREE.PlaneGeometry(35, 40),
            bouquet: new THREE.PlaneGeometry(23, 30, 1, 1),
            ribbon: new THREE.PlaneGeometry(20, 15, 1, 1)
        };
     
        ground = new THREE.Mesh(geometries.ground, materials.ground);
        bouquetLower = new THREE.Mesh(geometries.bouquet, materials.bouquetLower);
        bouquetUpper = new THREE.Mesh(geometries.bouquet, materials.bouquetUpper);
        ribbon = new THREE.Mesh(geometries.ribbon, materials.ribbon);
     
        bouquetLower.position.set(0, 5, 0);
        bouquetUpper.position.set(0, 4.3, 3);
        ribbon.position.set(0, -2, 3);
        Editorscene.add(ground, bouquetLower, bouquetUpper, ribbon);
     }

    function putOnCanvas(arr) {
        const texture = new THREE.TextureLoader().load(geometries[arr]);
        const geometry = new THREE.PlaneGeometry(7, 11, 1, 1); // Add this line - you need a geometry

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
    
        // Set the new flower's position slightly above others
        const maxZ = Editorscene.children
            .filter(child => child !== ground)
            .reduce((max, child) => Math.max(max, child.position.z), 0);
        
        setTimeout(() => {mesh.position.set(0, 5, maxZ + 0.1); }, 200);
        
        Editorscene.add(mesh);
        activeMesh = mesh;
    }

    const removeMesh = (event) => {
        if (event.key === 'Backspace' && hoveredMesh 
            && hoveredMesh !== ground 
            && hoveredMesh !== bouquetLower 
            && hoveredMesh !== bouquetUpper
            && hoveredMesh !== ribbon)  {
            event.preventDefault(); // Prevents default delete behavior
            console.log('delete');
            const object = Editorscene.getObjectByProperty('uuid', hoveredMeshUUID);
            
            if (object) {
                // Dispose of geometry and material
                if (object.geometry) { object.geometry.dispose(); }
                if (object.material) { object.material.dispose(); }
    
                // Remove object from scene
                Editorscene.remove(object);
                hoveredMesh = null;
                hoveredMeshUUID = null;
            } else {
                console.log("Object not found in the scene.");
            }
        }
    };

    
    const onPointerMove = (event) => {
        const editorCanvas = document.getElementById('editor');
        const rect = editorCanvas.getBoundingClientRect();
        
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(pointer, Editorcamera);
    
        // Filter bouquetUpper from raycasting
        const targetObjects = Editorscene.children.filter(obj => obj !== bouquetUpper && obj !== ribbon);
        const hits = raycaster.intersectObjects(targetObjects, true);
        
        const flowerHits = hits.filter(hit => hit.object !== ground && hit.object !== bouquetLower);
        
        hoveredMesh = flowerHits.length > 0 ? flowerHits[0].object : null;
        hoveredMeshUUID = hoveredMesh ? hoveredMesh.uuid : null;
    
        const groundHits = raycaster.intersectObject(ground, true);
        if (groundHits.length > 0) {
            pointerGround.copy(groundHits[0].point);
        }
    };

    let isObjectBeingMoved = false;
    
    const onPointerDown = (event) => {
        if (hoveredMesh 
            && hoveredMesh !== ground 
            && hoveredMesh !== bouquetLower 
            && hoveredMesh !== bouquetUpper
            && hoveredMesh !== ribbon
            && !isObjectBeingMoved) {
            activeMesh = hoveredMesh;
            isObjectBeingMoved = true;
        }
    };
      
    const onPointerUp = () => {
        activeMesh = null;
        isObjectBeingMoved = false;
    };

    const scenes = setUpOptionScene();

    function updateSize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width !== width || canvas.height !== height) {
            renderer.setSize(width, height, false);
        }
    }

    function animate() {
        updateSize();

        // Get the scroll position
        const divX = document.getElementById('divOption');
        const scrollTop = divX.scrollTop;
        canvas.style.transform = `translateY(${scrollTop}px)`;

        // Clear the renderer
        renderer.setScissorTest(false);
        renderer.clear();
        renderer.setScissorTest(true);

        // Render each scene
        scenes.forEach((sceneInfo) => {
            const { scene, camera, controls, element } = sceneInfo;
            const rect = element.getBoundingClientRect();

            // Check if scene is in view
            if (
                rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
                rect.right < 0 || rect.left > renderer.domElement.clientWidth
            ) {return;}

            // Calculate viewport
            const width = rect.right - rect.left;
            const height = rect.bottom - rect.top;
            const left = rect.left;
            const bottom = renderer.domElement.clientHeight - rect.bottom;

            // Set viewport and scissor
            renderer.setViewport(left, bottom, width, height);
            renderer.setScissor(left, bottom, width, height);

            // Update camera
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            // Update controls
            controls.update();

            // Render scene
            renderer.render(scene, camera);
        });

        if (activeMesh) {
            pointerGround.z = Math.max(...Editorscene.children
                .filter(child => child !== ground && child !== bouquetUpper && child !== ribbon && child !== activeMesh)
                .map(child => child.position.z)) + 0.1;
            activeMesh.position.lerp(pointerGround, 0.7);
        }
        editorRenderer.render(Editorscene, Editorcamera);
        // Continue the animation loop
        requestAnimationFrame(animate);
    }
    setUpEditorScene();
    // Start the animation loop
    requestAnimationFrame(animate);

    window.addEventListener('keydown', removeMesh);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', () => {
        Editorcamera.aspect = window.innerWidth / window.innerHeight;
        Editorcamera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}


main();


async function saveFlowerPositions() {
    const flowers = Editorscene.children
        .filter(child => child.type === "Mesh" && 
            child !== ground && 
            child !== bouquetLower && 
            child !== bouquetUpper && 
            child !== ribbon)
        .map(flower => {
            const textureUrl = flower.material.map.image.src;
            const textureIndex = geometries.findIndex(path => 
                textureUrl.includes(path.split('/').pop())
            );
            
            return {
                textureIndex: textureIndex,
                position: {
                    x: flower.position.x,
                    y: flower.position.y,
                    z: flower.position.z
                }
            };
        });

    try {
        const giftcardId = generateId();
        const response = await fetch('/api/save-positions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                giftcardId,
                flowers
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const shareableLink = `${window.location.origin}/create?id=${giftcardId}`;

            Swal.fire({
                title: "Your Link is Ready!",
                background:"#DBD0B7",
                color: "#000000",
                icon: "info",
                iconColor:"#EE4B2B",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Copy Link!"
              }).then((result) => {
                if (result.isConfirmed) {
                    navigator.clipboard.writeText(shareableLink);
                    
                    Swal.fire({
                        title: "Link Copied!",
                        color: "#000000",
                        background:"#DBD0B7",
                        text: "Send it to your beloved friend!",
                        iconColor:"#008000",
                        icon: "success"
                    });

                    const defaults = {
                        spread: 360,
                        ticks: 50,
                        gravity: 0,
                        decay: 0.94,
                        startVelocity: 30,
                        shapes: ["heart"],
                        colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
                        zIndex: 99,
                      };
                      
                      confetti({
                        ...defaults,
                        particleCount: 50,
                        scalar: 2,
                      });
                      
                      confetti({
                        ...defaults,
                        particleCount: 25,
                        scalar: 3,
                      });
                      
                      confetti({
                        ...defaults,
                        particleCount: 10,
                        scalar: 4,
                      });

                }
              });
        } else {
            alert('Error saving flowers: ' + result.error);
        }
    } catch (error) {
        console.error('Save error:', error);
        alert('Error saving flowers');
    }
}

//generate unique id
function generateId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Update event listeners
document.getElementById('saveButton').addEventListener('click', saveFlowerPositions);
document.getElementById('loadButton').addEventListener('click', testtest);


function testtest () {
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["heart"],
        colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
      };
      
      confetti({
        ...defaults,
        particleCount: 50,
        scalar: 2,
      });
      
      confetti({
        ...defaults,
        particleCount: 25,
        scalar: 3,
      });
      
      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 4,
      });
}