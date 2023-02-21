window.addEventListener("load", (event) => {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  // Solve Cube
  var solver = [];
  function solveCube() {
    for (let x = 0; x < solver.length / 2; x++) {
      var temp = solver[x];
      solver[x] = solver[solver.length - 1 - x];
      solver[solver.length - 1 - x] = temp;
    }
    for (let i = 0; i < solver.length + 1; i++) {
      setTimeout(() => {
        if (solver[i] === "S" && finish == 1) {
          finish = 0;
          rotateFace(osurface, "y", -1);
        }
        if (solver[i] === "s" && finish == 1) {
          finish = 0;
          rotateFace(osurface, "y", 1);
        }
        if (solver[i] === "w" && finish == 1) {
          finish = 0;
          rotateFace(rsurface, "y", -1);
        }
        if (solver[i] === "W" && finish == 1) {
          finish = 0;
          rotateFace(rsurface, "y", 1);
        }
        if (solver[i] === "a" && finish == 1) {
          finish = 0;
          rotateFace(bsurface, "x", -1);
        }
        if (solver[i] === "A" && finish == 1) {
          finish = 0;
          rotateFace(bsurface, "x", 1);
        }
        if (solver[i] === "d" && finish == 1) {
          finish = 0;
          rotateFace(gsurface, "x", 1);
        }
        if (solver[i] === "D" && finish == 1) {
          finish = 0;
          rotateFace(gsurface, "x", -1);
        }
        if (solver[i] === "e" && finish == 1) {
          finish = 0;
          rotateFace(wsurface, "z", -1);
        }
        if (solver[i] === "E" && finish == 1) {
          finish = 0;
          rotateFace(wsurface, "z", 1);
        }
        if (solver[i] === "q" && finish == 1) {
          finish = 0;
          rotateFace(ysurface, "z", 1);
        }
        if (solver[i] === "Q" && finish == 1) {
          finish = 0;
          rotateFace(ysurface, "z", -1);
        }
        if (i == solver.length) {
          solver = [];
        }
      }, 150 * i);
    }
  }

  // Top Right Button Click
  const topright = document.querySelector(".top-right");
  topright.addEventListener("click", function () {
    solveCube();
  });

  // Set click event for button
  const topleft = document.querySelector(".top-left");
  topleft.addEventListener("click", function () {
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        if (finish === 1) {
          finish = 0;
          let rnd = Math.floor(Math.random() * 12);
          console.log(rnd);
          switch (rnd) {
            case 0:
              rotateFace(osurface, "y", 1);
              solver.push("S");
              break;
            case 1:
              rotateFace(osurface, "y", -1);
              solver.push("s");
              break;
            case 2:
              rotateFace(rsurface, "y", 1);
              solver.push("w");
              break;
            case 3:
              rotateFace(rsurface, "y", -1);
              solver.push("W");
              break;
            case 4:
              rotateFace(bsurface, "x", 1);
              solver.push("a");
              break;
            case 5:
              rotateFace(bsurface, "x", -1);
              solver.push("A");
              break;
            case 6:
              rotateFace(gsurface, "x", -1);
              solver.push("d");
              break;
            case 7:
              rotateFace(gsurface, "x", 1);
              solver.push("D");
              break;
            case 8:
              rotateFace(wsurface, "z", 1);
              solver.push("e");
              break;
            case 9:
              rotateFace(wsurface, "z", -1);
              solver.push("E");
              break;
            case 10:
              rotateFace(ysurface, "z", -1);
              solver.push("q");
              break;
            case 11:
              rotateFace(ysurface, "z", 1);
              solver.push("Q");
              break;
            default:
              break;
          }
        }
        console.log(i);
      }, 150 * i);
    }
  });

  // Box Array
  var boxes = [];

  // Scene
  var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera(
      "Camera",
      1.05,
      1.25,
      10,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    var lighttop = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    var lightbottom = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, -1, 0),
      scene
    );
    lighttop.intensity = 0.7;
    lightbottom.intensity = 0.7;

    // RubiksCube Colors
    var faceColors = [
      new BABYLON.Color4(1, 1, 1, 1),
      new BABYLON.Color4(1, 1, 0, 1),
      new BABYLON.Color4(0, 0, 1, 1),
      new BABYLON.Color4(0, 1, 0, 1),
      new BABYLON.Color4(1, 0, 0, 1),
      new BABYLON.Color4(1, 0.5, 0, 1),
      new BABYLON.Color4(0, 0, 0, 0),
    ];

    // define the face UV coordinates for each face
    var faceUV = [
      // top face
      new BABYLON.Vector4(0, 0, 1, 1),
      // bottom face
      new BABYLON.Vector4(0, 0, 1, 1),
      // front face
      new BABYLON.Vector4(0, 0, 1, 1),
      // back face
      new BABYLON.Vector4(0, 0, 1, 1),
      // right face
      new BABYLON.Vector4(0, 0, 1, 1),
      // left face
      new BABYLON.Vector4(0, 0, 1, 1),
    ];

    // define the options for creating the cube
    var options = {
      faceUV: faceUV,
      faceColors: [
        faceColors[0],
        faceColors[1],
        faceColors[2],
        faceColors[3],
        faceColors[4],
        faceColors[5],
      ],
      size: 1,
    };

    // define spacing
    var spacing = 1.04; //1.04
    var offset = spacing - spacing * 2;

    // define the initial and hover scaling factors
    var initialScale = 1;
    var hoverScale = 1.07;

    // define edgewidth
    var edgewidth = 4.0;

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        for (var z = 0; z < 3; z++) {
          var box = BABYLON.MeshBuilder.CreateBox(
            "box" + x + y + z,
            options,
            scene
          );
          box.position.x = x * spacing + offset;
          box.position.y = y * spacing + offset;
          box.position.z = z * spacing + offset;
          // push
          box.setParent(cubeParent);
          boxes.push(box);
          //Edges
          box.enableEdgesRendering(1);
          box.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
          box.edgesWidth = edgewidth;
          //Hover
          box.actionManager = new BABYLON.ActionManager(scene);
          box.actionManager.registerAction(
            new BABYLON.SetValueAction(
              BABYLON.ActionManager.OnPointerOverTrigger,
              box,
              "scaling",
              new BABYLON.Vector3(hoverScale, hoverScale, hoverScale)
            )
          );
          box.actionManager.registerAction(
            new BABYLON.SetValueAction(
              BABYLON.ActionManager.OnPointerOutTrigger,
              box,
              "scaling",
              new BABYLON.Vector3(initialScale, initialScale, initialScale)
            )
          );
        }
      }
    }
    return scene;
  };

  var scene = createScene();

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });

  // Coords-Getter
  var xmin;
  var xmax;
  var ymin;
  var ymax;
  var zmin;
  var zmax;
  function cordGetter() {
    for (let i = 0; i < boxes.length; i++) {
      let box = boxes[i].position;
      xmin = typeof xmin === "undefined" ? box.x : Math.min(xmin, box.x);
      xmax = typeof xmax === "undefined" ? box.x : Math.max(xmax, box.x);
      ymin = typeof ymin === "undefined" ? box.y : Math.min(ymin, box.y);
      ymax = typeof ymax === "undefined" ? box.y : Math.max(ymax, box.y);
      zmin = typeof zmin === "undefined" ? box.z : Math.min(zmin, box.z);
      zmax = typeof zmax === "undefined" ? box.z : Math.max(zmax, box.z);
    }
  }

  // surfaceGetter
  var cubeParent = new BABYLON.Mesh("cubeParent", scene);
  var gsurface = new BABYLON.Mesh("gsurface", scene);
  var bsurface = new BABYLON.Mesh("bsurface", scene);
  var wsurface = new BABYLON.Mesh("wsurface", scene);
  var ysurface = new BABYLON.Mesh("ysurface", scene);
  var rsurface = new BABYLON.Mesh("rsurface", scene);
  var osurface = new BABYLON.Mesh("osurface", scene);
  function surfaceGetter(target) {
    // iterate over all boxes and remove their parent
    cordGetter();
    for (var i = 0; i < boxes.length; i++) {
      if (
        parseFloat(boxes[i].position.x.toFixed(2)) == xmin &&
        target == gsurface
      ) {
        boxes[i].setParent(gsurface); //GreenSurface
      }
      if (
        parseFloat(boxes[i].position.x.toFixed(2)) == xmax &&
        target == bsurface
      ) {
        boxes[i].setParent(bsurface); //BlueSurface
      }
      if (
        parseFloat(boxes[i].position.y.toFixed(2)) == ymin &&
        target == osurface
      ) {
        boxes[i].setParent(osurface); //OrangeSurface
      }
      if (
        parseFloat(boxes[i].position.y.toFixed(2)) == ymax &&
        target == rsurface
      ) {
        boxes[i].setParent(rsurface); //RedSurface
      }
      if (
        parseFloat(boxes[i].position.z.toFixed(2)) == zmin &&
        target == ysurface
      ) {
        boxes[i].setParent(ysurface); //YellowSurface
      }
      if (
        parseFloat(boxes[i].position.z.toFixed(2)) == zmax &&
        target == wsurface
      ) {
        boxes[i].setParent(wsurface); //WhiteSurface
      }
    }
  }

  // Rotation
  var finish = 1;
  function rotateFace(target, axis, angle) {
    surfaceGetter(target);

    var animationType = BABYLON.Animation.ANIMATIONTYPE_FLOAT;
    var animationLoopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;
    var animationGroup = new BABYLON.AnimationGroup("rotationAnimationGroup");

    var rotationAxis = "rotation." + axis;
    var rotationAngle = (Math.PI / 2) * angle;

    var animation = new BABYLON.Animation(
      "rotateAnimation",
      rotationAxis,
      60,
      animationType,
      animationLoopMode
    );

    var keyframes = [];
    keyframes.push({ frame: 0, value: target.rotation[axis] });
    keyframes.push({ frame: 8, value: target.rotation[axis] + rotationAngle }); //10
    animation.setKeys(keyframes);

    animationGroup.addTargetedAnimation(animation, target);

    // attach callback function to onAnimationEnd event
    animationGroup.onAnimationGroupEndObservable.add(() => {
      console.log("ENDE");
      cleanSurface();
      finish = 1;
    });

    animationGroup.play();
  }

  function cleanSurface() {
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].setParent(cubeParent);
    }
    gsurface.dispose();
    bsurface.dispose();
    wsurface.dispose();
    ysurface.dispose();
    rsurface.dispose();
    osurface.dispose();
    gsurface = new BABYLON.Mesh("gsurface", scene);
    bsurface = new BABYLON.Mesh("bsurface", scene);
    wsurface = new BABYLON.Mesh("wsurface", scene);
    ysurface = new BABYLON.Mesh("ysurface", scene);
    rsurface = new BABYLON.Mesh("rsurface", scene);
    osurface = new BABYLON.Mesh("osurface", scene);
  }

  // Controls
  document.addEventListener("keydown", function (event) {
    if (event.key === "S" && finish == 1) {
      finish = 0;
      rotateFace(osurface, "y", 1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "s" && finish == 1) {
      finish = 0;
      rotateFace(osurface, "y", -1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "w" && finish == 1) {
      finish = 0;
      rotateFace(rsurface, "y", 1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "W" && finish == 1) {
      finish = 0;
      rotateFace(rsurface, "y", -1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "a" && finish == 1) {
      finish = 0;
      rotateFace(bsurface, "x", 1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "A" && finish == 1) {
      finish = 0;
      rotateFace(bsurface, "x", -1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "d" && finish == 1) {
      finish = 0;
      rotateFace(gsurface, "x", -1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "D" && finish == 1) {
      finish = 0;
      rotateFace(gsurface, "x", 1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "e" && finish == 1) {
      finish = 0;
      rotateFace(wsurface, "z", 1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "E" && finish == 1) {
      finish = 0;
      rotateFace(wsurface, "z", -1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "q" && finish == 1) {
      finish = 0;
      rotateFace(ysurface, "z", -1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "Q" && finish == 1) {
      finish = 0;
      rotateFace(ysurface, "z", 1);
      solver.push(event.key);
      console.log(solver);
    }
    if (event.key === "p") {
      solveCube();
    }
  });
  //FALK SPECIAL SEIN VATER
  /* scene.debugLayer.show(); */

  /* // create the X axis
  var xPoints = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(5, 0, 0)];
  var xColor = new BABYLON.Color3(1, 0, 0); // red
  var xAxis = BABYLON.MeshBuilder.CreateLines(
    "xAxis",
    { points: xPoints, updatable: true },
    scene
  );
  xAxis.color = xColor;

  // create the Y axis
  var yPoints = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 5, 0)];
  var yColor = new BABYLON.Color3(0, 1, 0); // green
  var yAxis = BABYLON.MeshBuilder.CreateLines(
    "yAxis",
    { points: yPoints, updatable: true },
    scene
  );
  yAxis.color = yColor;

  // create the Z axis
  var zPoints = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 5)];
  var zColor = new BABYLON.Color3(0, 0, 1); // blue
  var zAxis = BABYLON.MeshBuilder.CreateLines(
    "zAxis",
    { points: zPoints, updatable: true },
    scene
  );
  zAxis.color = zColor; */
});
