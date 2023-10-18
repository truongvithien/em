import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let canvas, scene, camera, renderer, controls;

const Canvas = {
    dom: function(opts) {
        const defs = {
            container: '.canvas_wrapper',
            id: 'canvas',
            width: window.innerWidth,
            height: window.innerHeight
        }

        const sets = Object.assign({}, defs, opts);

        const canvas = document.createElement('canvas');
        canvas.id = sets.id;
        canvas.width = sets.width;
        canvas.height = sets.height;
        $(sets.container).append(canvas);

        return canvas;
    },
    init: function(opts) {
        const defs = {
            canvas: {
                container: '.canvas_wrapper',
                el:'#canvas',
                width: window.innerWidth,
                height: window.innerHeight
            }
        }

        const sets = Object.assign({}, defs, opts);

        // If canvas is not defined, create it 

        if (!$(sets.canvas.el).length) {
            Canvas.dom({
                container: sets.canvas.container,
                id: sets.canvas.el.replace('#', ''), 
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        canvas = $(sets.canvas.el)[0];
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true, preserveDrawingBuffer: true});
        controls = new OrbitControls(camera, canvas);

        controls.enableDamping = true;

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
11
        camera.position.set(0, 0, 25);
        camera.filmGauge = 55;

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        controls.update();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 0, 1).normalize();
        scene.add(light);

        window.addEventListener('resize', () => {
            renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
            camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
            camera.updateProjectionMatrix();
        }, false);

        this.animate();
    },
    addHDR: function(opts) {
        const defs = {
            src: './assets/hdr/industrial_sunset_puresky_1k.exr'
        };

        const sets = Object.assign({}, defs, opts);

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        new RGBELoader()
            .setDataType(THREE.UnsignedByteType)
            .load(sets.src, function(texture) {
                const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                scene.background = envMap;
                scene.environment = envMap;
                texture.dispose();
                pmremGenerator.dispose();
            });
        
        

    
    },
    addBox: function(opts) {
        const defs = {
            size: 100,
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            color: 0x00ff00
        };

        const sets = Object.assign({}, defs, opts);

        const geometry = new THREE.BoxGeometry(sets.size, sets.size, sets.size);
        const material = new THREE.MeshBasicMaterial({color: sets.color});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(sets.position.x, sets.position.y, sets.position.z);
        mesh.material.opacity = 0.5;
        mesh.material.transparent = true;
        mesh.material.side = THREE.DoubleSide;
        scene.add(mesh);

        const animate = () => {
            requestAnimationFrame(animate);
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.02;
        }
        animate();

    },
    addModel: async function(opts) {
        const defs = {
            modelName: 'model',
            src: './assets/models/model.gltf',
            callback: function(model) {
                console.log(model);
            }
        };

        const sets = Object.assign({}, defs, opts);

        const loader = new GLTFLoader();
        loader.load(sets.src, async (gltf) => {
            const model = gltf.scene;
            model.name = sets.modelName;

            sets.callback(scene, model);

        }, undefined, (error) => {
            console.error(error);
        });


    },
    addToScene: function(obj) {
        scene.add(obj);
    },
    animate: function() {
        requestAnimationFrame(Canvas.animate);
        controls.update();
        renderer.render(scene, camera);
    }
}

export default Canvas;