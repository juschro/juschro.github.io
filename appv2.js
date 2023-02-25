window.addEventListener("load", (event) => {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);
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
    canvas.addEventListener("pointerdown", function (event) {
      if (scene.pick(scene.pointerX, scene.pointerY).hit) {
        camera.detachControl(canvas);
        canvas.addEventListener("pointermove", pointermove);
        // calculate the starting vector based on the mouse coordinates
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        startingVector = pickResult.pickedPoint
          .subtract(camera.position)
          .normalize();
        // set the axis of rotation based on your needs (e.g. the x, y, or z axis)
        axisOfRotationx = new BABYLON.Vector3(1, 0, 0); // rotate around the x axis
        axisOfRotationy = new BABYLON.Vector3(0, 1, 0); // rotate around the y axis
        axisOfRotationz = new BABYLON.Vector3(0, 0, 1); // rotate around the z axis
      }
      camera.attachControl(canvas);
    });
    function pointermove(event) {
      // calculate the current vector based on the mouse coordinates
      const pickResult = scene.pick(scene.pointerX, scene.pointerY);
      if (pickResult.hit) {
        const currentVector = pickResult.pickedPoint
          .subtract(camera.position)
          .normalize();
        // calculate the angle between the starting and current vectors
        anglex = BABYLON.Vector3.GetAngleBetweenVectors(
          startingVector,
          currentVector,
          axisOfRotationx
        );
        angley = BABYLON.Vector3.GetAngleBetweenVectors(
          startingVector,
          currentVector,
          axisOfRotationy
        );
        anglez = BABYLON.Vector3.GetAngleBetweenVectors(
          startingVector,
          currentVector,
          axisOfRotationz
        );
        // calculate the sign of the angle
        const cross = BABYLON.Vector3.Cross(startingVector, currentVector);
        const dotx = BABYLON.Vector3.Dot(cross, axisOfRotationx);
        const doty = BABYLON.Vector3.Dot(cross, axisOfRotationy);
        const dotz = BABYLON.Vector3.Dot(cross, axisOfRotationz);
        signx = Math.sign(dotx);
        signy = Math.sign(doty);
        signz = Math.sign(dotz);
      }
    }
    canvas.addEventListener("pointerup", function (event) {
      canvas.removeEventListener("pointermove", pointermove);
    });
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
    return scene;
  };

  // Scene Start
  var scene = createScene();
  engine.runRenderLoop(function () {
    scene.render();
  });
  window.addEventListener("resize", function () {
    engine.resize();
  });

  // VARS
  //ANGLE
  var startingVector; // the initial vector when the mouse button was pressed
  var axisOfRotationx; // the axis around which to calculate the angle
  var axisOfRotationy;
  var axisOfRotationz;
  var anglex; // the angle of the drag, in radians
  var angley;
  var anglez;
  var signx; // the sign of the angle, either 1 or -1
  var signy;
  var signz;
  //ANGLE
  var firstMesh = null;
  var secondMesh = null;
  var firstlocal = null;
  var secondlocal = null;
  var localx = null;
  var localy = null;
  var localz = null;
  var advtarget = null;
  var advtargetvalue = null;
  var dragx = null;
  var dragy = null;
  var dragz = null;
  var boxes = [];
  var solving = 0;
  var solver = [];
  var finish = 1;
  var xmin;
  var xmax;
  var ymin;
  var ymax;
  var zmin;
  var zmax;
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
    new BABYLON.Vector4(0, 0, 1, 1), // top face
    new BABYLON.Vector4(0, 0, 1, 1), // bottom face
    new BABYLON.Vector4(0, 0, 1, 1), // front face
    new BABYLON.Vector4(0, 0, 1, 1), // back face
    new BABYLON.Vector4(0, 0, 1, 1), // right face
    new BABYLON.Vector4(0, 0, 1, 1), // left face
  ];
  // define the options for creating the cube
  var options = {
    faceUV: faceUV,
    faceColors: faceColors,
    size: 1,
  };
  // define spacing
  var spacing = 1.03; // 1.03 gut
  var offset = spacing - spacing * 2;
  // define the initial and hover scaling factors
  var initialScale = 1;
  var hoverScale = 1.07;
  // define edgewidth
  var edgewidth = 4.0;
  // definde surfaces
  var cubeParent = new BABYLON.Mesh("cubeParent", scene);
  var gsurface = new BABYLON.Mesh("gsurface", scene);
  var bsurface = new BABYLON.Mesh("bsurface", scene);
  var wsurface = new BABYLON.Mesh("wsurface", scene);
  var ysurface = new BABYLON.Mesh("ysurface", scene);
  var rsurface = new BABYLON.Mesh("rsurface", scene);
  var osurface = new BABYLON.Mesh("osurface", scene);
  //Test
  var xaxsurface = new BABYLON.Mesh("xaxsurface", scene);
  var yaxsurface = new BABYLON.Mesh("yaxsurface", scene);
  var zaxsurface = new BABYLON.Mesh("zaxsurface", scene);
  //Test

  // CubeSim
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        var box = BABYLON.MeshBuilder.CreateBox(
          "box" + x + y + z,
          options,
          scene
        );
        box.position.x = x * spacing + offset;
        box.position.y = y * spacing + offset;
        box.position.z = z * spacing + offset;
        boxes.push(box);
        box.enableEdgesRendering(1);
        box.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
        box.edgesWidth = edgewidth;
        //Hover
        /* box.actionManager = new BABYLON.ActionManager(scene);
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
        ); */
      }
    }
  }

  // CoordGetter
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

  // SurfaceGetter
  function surfaceGetter(target) {
    cordGetter();
    for (let i = 0; i < boxes.length; i++) {
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
      if (
        parseFloat(boxes[i].position.x.toFixed(2)) == 0 &&
        target == xaxsurface
      ) {
        boxes[i].setParent(xaxsurface); //xaxSurface
      }
      if (
        parseFloat(boxes[i].position.y.toFixed(2)) == 0 &&
        target == yaxsurface
      ) {
        boxes[i].setParent(yaxsurface); //yaxSurface
      }
      if (
        parseFloat(boxes[i].position.z.toFixed(2)) == 0 &&
        target == zaxsurface
      ) {
        boxes[i].setParent(zaxsurface); //zaxSurface
      }
    }
  }

  // SufaceCleaner
  function cleanSurface() {
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].setParent(cubeParent);
    }
    // Muss ich disposen und neu erstellen???
    /* gsurface.dispose(); 
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
    xaxsurface.dispose();
    yaxsurface.dispose();
    zaxsurface.dispose();
    xaxsurface = new BABYLON.Mesh("xaxsurface", scene);
    yaxsurface = new BABYLON.Mesh("yaxsurface", scene);
    zaxsurface = new BABYLON.Mesh("zaxsurface", scene); */
  }

  // Rotation
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
    keyframes.push({ frame: 8, value: target.rotation[axis] + rotationAngle }); //8
    animation.setKeys(keyframes);
    animationGroup.addTargetedAnimation(animation, target);
    // attach callback function to onAnimationEnd event
    animationGroup.onAnimationGroupEndObservable.add(() => {
      cleanSurface();
      finish = 1;
    });
    animationGroup.play();
  }

  // RandomCube
  function spinCube() {
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        if (finish === 1) {
          finish = 0;
          let rnd = Math.floor(Math.random() * 18);
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
            case 12:
              rotateFace(xaxsurface, "x", 1);
              solver.push("xax");
              break;
            case 13:
              rotateFace(xaxsurface, "x", -1);
              solver.push("Xax");
              break;
            case 14:
              rotateFace(yaxsurface, "y", 1);
              solver.push("yax");
              break;
            case 15:
              rotateFace(yaxsurface, "y", -1);
              solver.push("Yax");
              break;
            case 16:
              rotateFace(zaxsurface, "z", 1);
              solver.push("zax");
              break;
            case 17:
              rotateFace(zaxsurface, "z", -1);
              solver.push("Zax");
              break;
            default:
              break;
          }
        }
      }, 200 * i); //150 aber wenn lag ist rip
    }
  }

  // SolveCube
  function solveCube() {
    if (solving == 0 && finish == 1) {
      solving = 1;
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
          if (solver[i] === "xax" && finish == 1) {
            finish = 0;
            rotateFace(xaxsurface, "x", -1);
          }
          if (solver[i] === "Xax" && finish == 1) {
            finish = 0;
            rotateFace(xaxsurface, "x", 1);
          }
          if (solver[i] === "yax" && finish == 1) {
            finish = 0;
            rotateFace(yaxsurface, "y", -1);
          }
          if (solver[i] === "Yax" && finish == 1) {
            finish = 0;
            rotateFace(yaxsurface, "y", 1);
          }
          if (solver[i] === "zax" && finish == 1) {
            finish = 0;
            rotateFace(zaxsurface, "z", -1);
          }
          if (solver[i] === "Zax" && finish == 1) {
            finish = 0;
            rotateFace(zaxsurface, "z", 1);
          }
          if (i == solver.length) {
            solver = [];
            solving = 0;
          }
        }, 200 * i); //150 aber wenn lag ist rip
      }
    }
  }

  // Buttons
  const topright = document.querySelector(".top-right");
  topright.addEventListener("click", function () {
    if (solving == 0) {
      solveCube();
    }
  });
  const topleft = document.querySelector(".top-left");
  topleft.addEventListener("click", function () {
    if (solving == 0) {
      spinCube();
    }
  });

  // Controls
  document.addEventListener("keydown", function (event) {
    if (event.key === "S" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(osurface, "y", 1);
      solver.push(event.key);
    }
    if (event.key === "s" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(osurface, "y", -1);
      solver.push(event.key);
    }
    if (event.key === "w" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(rsurface, "y", 1);
      solver.push(event.key);
    }
    if (event.key === "W" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(rsurface, "y", -1);
      solver.push(event.key);
    }
    if (event.key === "a" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(bsurface, "x", 1);
      solver.push(event.key);
    }
    if (event.key === "A" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(bsurface, "x", -1);
      solver.push(event.key);
    }
    if (event.key === "d" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(gsurface, "x", -1);
      solver.push(event.key);
    }
    if (event.key === "D" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(gsurface, "x", 1);
      solver.push(event.key);
    }
    if (event.key === "e" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(wsurface, "z", 1);
      solver.push(event.key);
    }
    if (event.key === "E" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(wsurface, "z", -1);
      solver.push(event.key);
    }
    if (event.key === "q" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(ysurface, "z", -1);
      solver.push(event.key);
    }
    if (event.key === "Q" && finish == 1 && solving == 0) {
      finish = 0;
      rotateFace(ysurface, "z", 1);
      solver.push(event.key);
    }
  });

  // register an event handler for pointer down events
  canvas.addEventListener("pointerdown", function (event) {
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pickResult.hit) {
      firstMesh = pickResult.pickedMesh;
      firstlocal = pickResult.pickedPoint.subtract(
        firstMesh.getBoundingInfo().boundingBox.centerWorld
      );
      canvas.addEventListener("pointermove", onPointerMove);
    }
  });
  canvas.addEventListener("pointerup", function (event) {
    canvas.removeEventListener("pointermove", onPointerMove);
    secondMesh = null;
    secondlocal = null;
  });
  function onPointerMove(event) {
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pickResult.hit && firstlocal != null && finish == 1 && solving == 0) {
      secondlocal = pickResult.pickedPoint.subtract(
        firstMesh.getBoundingInfo().boundingBox.centerWorld
      );
      localx = Math.abs(firstlocal.x - secondlocal.x);
      localy = Math.abs(firstlocal.y - secondlocal.y);
      localz = Math.abs(firstlocal.z - secondlocal.z);
      if (localx > 0.2) {
        dragx = 1;
        advsurfaceGetter();
        firstlocal = null;
        secondlocal = null;
      }
      if (localy > 0.2) {
        dragy = 1;
        advsurfaceGetter();
        firstlocal = null;
        secondlocal = null;
      }
      if (localz > 0.2) {
        dragz = 1;
        advsurfaceGetter();
        firstlocal = null;
        secondlocal = null;
      }
    }
    /* if (
      pickResult.hit &&
      pickResult.pickedMesh !== firstMesh &&
      secondMesh == null
    ) {
      secondMesh = pickResult.pickedMesh;
    } */
  }
  function advsurfaceGetter() {
    cordGetter();
    var deltax =
      parseFloat(firstlocal.x.toFixed(4)) -
      parseFloat(secondlocal.x.toFixed(4));
    var deltay =
      parseFloat(firstlocal.y.toFixed(4)) -
      parseFloat(secondlocal.y.toFixed(4));
    var deltaz =
      parseFloat(firstlocal.z.toFixed(4)) -
      parseFloat(secondlocal.z.toFixed(4));
    if (deltax == 0 && dragy == 1) {
      //Senkrecht X
      //min max sollen die ebenene sein die auch um bswp zmin,zmax dann z rotieren
      if (parseFloat(firstMesh.position.z.toFixed(2)) === zmin) {
        firstMesh.setParent(ysurface);
        advtarget = ysurface;
        advtargetvalue = "zmin";
      }
      if (parseFloat(firstMesh.position.z.toFixed(2)) === zmax) {
        firstMesh.setParent(wsurface);
        advtarget = wsurface;
        advtargetvalue = "zmax";
      }
      if (parseFloat(firstMesh.position.z.toFixed(2)) === 0) {
        firstMesh.setParent(zaxsurface);
        advtarget = zaxsurface;
        advtargetvalue = "z0";
      }
    }
    if (deltax == 0 && dragz == 1) {
      //Senkrecht X
      if (parseFloat(firstMesh.position.y.toFixed(2)) === ymin) {
        firstMesh.setParent(osurface);
        advtarget = osurface;
        advtargetvalue = "ymin";
      }
      if (parseFloat(firstMesh.position.y.toFixed(2)) === ymax) {
        firstMesh.setParent(rsurface);
        advtarget = rsurface;
        advtargetvalue = "ymax";
      }
      if (parseFloat(firstMesh.position.y.toFixed(2)) === 0) {
        firstMesh.setParent(yaxsurface);
        advtarget = yaxsurface;
        advtargetvalue = "y0";
      }
    }
    if (deltay == 0 && dragx == 1) {
      //Senkrecht Y
      if (parseFloat(firstMesh.position.z.toFixed(2)) === zmin) {
        firstMesh.setParent(ysurface);
        advtarget = ysurface;
        advtargetvalue = "zmin";
      }
      if (parseFloat(firstMesh.position.z.toFixed(2)) === zmax) {
        firstMesh.setParent(wsurface);
        advtarget = wsurface;
        advtargetvalue = "zmax";
      }
      if (parseFloat(firstMesh.position.z.toFixed(2)) === 0) {
        firstMesh.setParent(zaxsurface);
        advtarget = zaxsurface;
        advtargetvalue = "z0";
      }
    }
    if (deltay == 0 && dragz == 1) {
      //Senkrecht Y
      if (parseFloat(firstMesh.position.x.toFixed(2)) === xmin) {
        firstMesh.setParent(gsurface);
        advtarget = gsurface;
        advtargetvalue = "xmin";
      }
      if (parseFloat(firstMesh.position.x.toFixed(2)) === xmax) {
        firstMesh.setParent(bsurface);
        advtarget = bsurface;
        advtargetvalue = "xmax";
      }
      if (parseFloat(firstMesh.position.x.toFixed(2)) === 0) {
        firstMesh.setParent(xaxsurface);
        advtarget = xaxsurface;
        advtargetvalue = "x0";
      }
    }
    if (deltaz == 0 && dragx == 1) {
      //Senkrecht Z
      if (parseFloat(firstMesh.position.y.toFixed(2)) === ymin) {
        firstMesh.setParent(osurface);
        advtarget = osurface;
        advtargetvalue = "ymin";
      }
      if (parseFloat(firstMesh.position.y.toFixed(2)) === ymax) {
        firstMesh.setParent(rsurface);
        advtarget = rsurface;
        advtargetvalue = "ymax";
      }
      if (parseFloat(firstMesh.position.y.toFixed(2)) === 0) {
        firstMesh.setParent(yaxsurface);
        advtarget = yaxsurface;
        advtargetvalue = "y0";
      }
    }
    if (deltaz == 0 && dragy == 1) {
      //Senkrecht Z
      if (parseFloat(firstMesh.position.x.toFixed(2)) === xmin) {
        firstMesh.setParent(gsurface);
        advtarget = gsurface;
        advtargetvalue = "xmin";
      }
      if (parseFloat(firstMesh.position.x.toFixed(2)) === xmax) {
        firstMesh.setParent(bsurface);
        advtarget = bsurface;
        advtargetvalue = "xmax";
      }
      if (parseFloat(firstMesh.position.x.toFixed(2)) === 0) {
        firstMesh.setParent(xaxsurface);
        advtarget = xaxsurface;
        advtargetvalue = "x0";
      }
    }
    for (let i = 0; i < boxes.length; i++) {
      let bx = parseFloat(boxes[i].position.x.toFixed(2));
      let by = parseFloat(boxes[i].position.y.toFixed(2));
      let bz = parseFloat(boxes[i].position.z.toFixed(2));
      if (advtargetvalue === "xmin" && bx === xmin) {
        boxes[i].setParent(advtarget);
      }
      if (advtargetvalue === "xmax" && bx === xmax) {
        boxes[i].setParent(advtarget);
      }
      if (advtargetvalue === "ymin" && by === ymin) {
        boxes[i].setParent(advtarget);
      }
      if (advtargetvalue === "ymax" && by === ymax) {
        boxes[i].setParent(advtarget);
      }
      if (advtargetvalue === "zmin" && bz === zmin) {
        boxes[i].setParent(advtarget);
      }
      if (advtargetvalue === "zmax" && bz === zmax) {
        boxes[i].setParent(advtarget);
      }
      if (advtargetvalue === "x0" && bx === 0) {
        boxes[i].setParent(advtarget);
      }
      if (advtargetvalue === "y0" && by === 0) {
        boxes[i].setParent(advtarget);
      }
      if (advtargetvalue === "z0" && bz === 0) {
        boxes[i].setParent(advtarget);
      }
    }
    if (advtargetvalue == "xmin") {
      finish = 0;
      rotateFace(advtarget, "x", -signx);
      if (-signx === 1) {
        solver.push("D");
      } else if (signx === 1) {
        solver.push("d");
      }
    }
    if (advtargetvalue == "xmax") {
      finish = 0;
      rotateFace(advtarget, "x", -signx);
      if (-signx === 1) {
        solver.push("a");
      } else if (signx === 1) {
        solver.push("A");
      }
    }
    if (advtargetvalue == "ymin") {
      finish = 0;
      rotateFace(advtarget, "y", -signy);
      if (-signy === 1) {
        solver.push("S");
      } else if (signy === 1) {
        solver.push("s");
      }
    }
    if (advtargetvalue == "ymax") {
      finish = 0;
      rotateFace(advtarget, "y", -signy);
      if (-signy === 1) {
        solver.push("w");
      } else if (signy === 1) {
        solver.push("W");
      }
    }
    if (advtargetvalue == "zmin") {
      finish = 0;
      rotateFace(advtarget, "z", -signz);
      if (-signz === 1) {
        solver.push("Q");
      } else if (signz === 1) {
        solver.push("q");
      }
    }
    if (advtargetvalue == "zmax") {
      finish = 0;
      rotateFace(advtarget, "z", -signz);
      if (-signz === 1) {
        solver.push("e");
      } else if (signz === 1) {
        solver.push("E");
      }
    }
    if (advtargetvalue == "x0") {
      finish = 0;
      rotateFace(advtarget, "x", -signx);
      if (-signx === 1) {
        solver.push("xax");
      } else if (signx === 1) {
        solver.push("Xax");
      }
    }
    if (advtargetvalue == "y0") {
      finish = 0;
      rotateFace(advtarget, "y", -signy);
      if (-signy === 1) {
        solver.push("yax");
      } else if (signy === 1) {
        solver.push("Yax");
      }
    }
    if (advtargetvalue == "z0") {
      finish = 0;
      rotateFace(advtarget, "z", -signz);
      if (-signz === 1) {
        solver.push("zax");
      } else if (signz === 1) {
        solver.push("Zax");
      }
    }
    advtarget = null;
    advtargetvalue = null;
    dragx = 0;
    dragy = 0;
    dragz = 0;
  }
});
// DebugLayer
/* scene.debugLayer.show(); */
// Coordinate System
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

// gibt Coordinaten von Cube bezogen auf Cubemittelpkt Urspung HUGE FÜR NICHT CUBE SWITCH SONDERN ÜBER KANTE ZIEHEN
/* const pickedMesh = pickResult.pickedMesh;
const localPosition = pickResult.pickedPoint.subtract(
  pickedMesh.getBoundingInfo().boundingBox.centerWorld
); */
