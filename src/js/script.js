import * as THREE from 'three';

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
    src: './assets/hdr/HDR_029_Sky_Cloudy_Ref.hdr'
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