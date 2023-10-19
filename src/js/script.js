import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import Canvas from "./_canvas";

let canvas, scene, camera, renderer, controls;

Canvas.init();

// Make glass material transparent for the flower
const flowerMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 1,
    thickness: 1.2,
    roughness: 1,
    envMapIntensity: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
    normalRepeat: new THREE.Vector2(0.5, 0.5),
    transparent: true,
}); 


Canvas.addHDR({
    src: './assets/hdr/industrial_sunset_puresky_1k.hdr',
    intensity: 1.5
});


// const sphere = Canvas.addSphere({
//     radius: 15,
//     position: {
//         x: 0,
//         y: 0,
//         z: 0
//     }
// });
// sphere.material.side = THREE.BackSide;
// Load GLTF material from file into sphere.material
// const gltfLoader = new GLTFLoader();
// gltfLoader.load('./assets/textures/grass_medium_01_2k.gltf/grass_medium_01_2k.gltf', function(gltf) {
//     sphere.material = gltf.scene.children[0].material;
// });


// console.log(sphere);


Canvas.addModel({
    modelName: 'model',
    src: './assets/textures/grass_medium_01_2k.gltf/grass_medium_01_2k.gltf', 
    callback: function(scene, model) {

        model.scale.set(1, 1, 1);
        model.position.set(0, -10, 0);
        model.rotation.set(0, 0, 0);

        console.log(model);


        // model.children[0].material = flowerMaterial;

        scene.add(model);

    }
});

Canvas.addModel({
    modelName: 'model',
    src: './assets/models/2.gltf', 
    callback: function(scene, model) {

        model.scale.set(1, 1, 1);
        model.position.set(0, -10, 0);
        model.rotation.set(0, 0, 0);

        console.log(model);


        model.children[0].material = flowerMaterial;

        scene.add(model);

        const animate = () => {
            requestAnimationFrame(animate);
            model.rotation.y += 0.01;
        } 
        animate();
    }
});