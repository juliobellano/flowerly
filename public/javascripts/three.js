console.log('Three.js script loading...');

import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

console.log('THREE object:', THREE);
console.log('OrbitControls:', OrbitControls);

let Editorcamera, Editorscene, editorRenderer, ground, lightPrimary, lightSecondary, raycaster, pointer, pointerGround, hoveredMesh, activeMesh, EditorControls;

const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load('/textures/bouquet.png');
colorTexture.colorSpace = THREE.SRGBColorSpace;
colorTexture.minFilter = THREE.NearestFilter; //use the checkboard 1024 1024 so you will understand
colorTexture.magFilter = THREE.NearestFilter; //use the checkboard 8x8 so you will understand
const material = new THREE.MeshPhysicalMaterial({ map: colorTexture });
material.side = THREE.DoubleSide


let hoveredMeshUUID = null;

function main() {
    console.log('Main function started');


    const canvas = document.getElementById('OptionCanvas');
    const editorCanvas = document.getElementById('editor');

    console.log('Canvas elements:', {canvas, editorCanvas});

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
    editorRenderer = new THREE.WebGLRenderer({ antialias: true, canvas: editorCanvas });
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(window.devicePixelRatio);

    editorRenderer.setClearColor(0xffffff, 1);
    editorRenderer.setSize(editorCanvas.clientWidth * window.devicePixelRatio, editorCanvas.clientHeight * window.devicePixelRatio, false);
    editorRenderer.shadowMap.enabled = true;
    function putOnCanvas(arr) {
        const geometries = [
            new THREE.BoxGeometry(5, 5, 5),
            new THREE.SphereGeometry(1.5, 12, 8),
            new THREE.DodecahedronGeometry(5),
            new THREE.CylinderGeometry(5, 5, 10, 12)
        ];
        const geometry = geometries[arr];
        const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0x888888 + 0x888888 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0;

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        Editorscene.add(mesh);
        activeMesh = mesh;
    }

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
        Editorscene.background = new THREE.Color(0x333333);
    
        Editorcamera = new THREE.PerspectiveCamera(60, editorCanvas.clientWidth / editorCanvas.clientHeight, 0.1, 1000);
        Editorcamera.position.set(-18, 15, 20);
    
        EditorControls = new OrbitControls(Editorcamera, editorCanvas);
        EditorControls.enableDamping = false;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        Editorscene.add(ambientLight);
        
        lightPrimary = new THREE.PointLight(0xffffff, 1.0, 10.0);
        lightPrimary.position.set(2.0, 2.0, 2.0);
        lightPrimary.castShadow = true;

        lightSecondary = new THREE.PointLight(0x8888ff, 1.0, 10.0);
        lightSecondary.position.set(-2.0, 2.0, -2.0);
        lightSecondary.castShadow = true;

        Editorscene.add(lightPrimary, lightSecondary);
        Editorcamera.lookAt(new THREE.Vector3(0, 0, 0));

        raycaster = new THREE.Raycaster();
        pointer = new THREE.Vector2();
        pointerGround = new THREE.Vector3();

        const axesHelper = new THREE.AxesHelper( 3 );
        Editorscene.add( axesHelper );  
    }

    function setUpOptionScene() {
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.5, 12, 8),
            new THREE.DodecahedronGeometry(0.5),
            new THREE.CylinderGeometry(0.5, 0.5, 1, 12)
        ];
    
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
    
                if (activeMesh) return;
    
                const arrayNumber = event.currentTarget.getAttribute('data-array-number');
                putOnCanvas(parseInt(arrayNumber)); // Pass the array index to create the geometry
            });
    
            // Create scene container
            const sceneElement = document.createElement('div');
            sceneElement.className = 'scene-container'; // Optional for styling
            element.appendChild(sceneElement);
    
            // Create description
            const descriptionElement = document.createElement('div');
            descriptionElement.innerText = 'Scene ' + (i + 1);
            element.appendChild(descriptionElement);
    
            content.appendChild(element);
    
            // Create scene
            const sceneInfo = makeOptionScene(sceneElement);
    
            // Create geometry and material
            const geometry = geometries[i];
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(Math.random(), 1, 0.75),
                roughness: 0.5,
                metalness: 0,
                flatShading: true
            });
    
            const mesh = new THREE.Mesh(geometry, material);
            sceneInfo.scene.add(mesh);
    
            scenes.push(sceneInfo);
        }
    
        return scenes;
    }

    function setUpEditorScene() {
        makeEditorScene();
        ground = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), material);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        Editorscene.add(ground);
    
    }
    const removeMesh = (event) => {
        if (event.key === 'Backspace' && hoveredMesh && hoveredMesh !== ground)  {
            event.preventDefault(); // Prevents default delete behavior
            console.log('delete');
            const object = Editorscene.getObjectByProperty('uuid', hoveredMeshUUID);
            
            if (object) {
                // Dispose of geometry and material
                if (object.geometry) { object.geometry.dispose(); }
                if (object.material) { object.material.dispose(); }
    
                // Remove object from scene
                Editorscene.remove(object);
                console.log(`Mesh with UUID ${hoveredMeshUUID} removed from the scene.`);
    
                // Clear hoveredMesh and hoveredMeshUUID after removal
                hoveredMesh = null;
                hoveredMeshUUID = null;
            } else {
                console.log("Object not found in the scene.");
            }
        }
    };
    const onPointerMove = (event) => {
        // Get the canvas rect to calculate relative coordinates
        const editorCanvas = document.getElementById('editor');
        const rect = editorCanvas.getBoundingClientRect();
        
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(pointer, Editorcamera);
    
        const hits = raycaster.intersectObjects(Editorscene.children, true);
        hoveredMesh = hits.length > 0 ? hits[0].object : null;
        hoveredMeshUUID = hoveredMesh ? hoveredMesh.uuid : null;

        if (hoveredMesh) { console.log("Hovered Mesh UUID:", hoveredMeshUUID); }

        const groundHits = raycaster.intersectObject(ground, true);
        if (groundHits.length > 0) { 
            pointerGround.copy(groundHits[0].point); 
        }
    };

    let isObjectBeingMoved = false;
    
    const onPointerDown = (event) => {
        console.log(Editorscene.children);
        if (hoveredMesh && hoveredMesh !== ground) {
          activeMesh = hoveredMesh;
          // Disable controls when moving an object
          EditorControls.enabled = false;
          isObjectBeingMoved = true;
        }
    };
      
    const onPointerUp = () => {
        activeMesh = null;
        // Re-enable controls when object movement is complete
        EditorControls.enabled = true;
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
            activeMesh.position.lerp(pointerGround, 0.3);
          }
        EditorControls.update();
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

/**
 * adding text into the canvas (https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text.html)
 * 
 */