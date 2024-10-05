import { dialogueData, scaleFactor } from "./constants.js";
import { k } from "./kaboomCtx.js";
import { displayDialogue, setCamScale } from "./utils.js";

k.loadSprite("spritesheet" , "/spritesheet.png" , {
    sliceX: 39 , 
    sliceY: 31 , 
    anims : {
        "idle-down": 936 , 
        "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
        "idle-side": 975,
        "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
        "idle-up": 1014,
        "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
    }
});

k.loadSprite("map" , "/myroom.png") ; 

k.setBackground(k.Color.fromHex("#000000")) ; 

//creating our first scene 
//in kanoom  js
k.scene("main" , async () => {
    const mapData = await(await fetch("/myroom.json")).json() ;
    //load the data until not mobin it

    const layers = mapData.layers ;


    // map is the game object
    const map = k.add([
        k.sprite("map") , 
        k.anchor("center") ,
        k.pos(), //the initial position of the sprite when the game is loaded
        k.scale(scaleFactor) //scaling the sprite
    ]) ;

    //game object for the player: 
    const player = k.make(
        [
        k.sprite("spritesheet" , {anim: "idle-down"}),
        k.area({ 
            shape: new k.Rect(k.vec2(0 , 3) , 10 , 10) 
        })  , 
        k.body() , 
        k.anchor("center") , 
        k.pos() ,
        k.scale(scaleFactor) , 
        {
            speed: 250 , 
            direction : "down" , 
            isInDialogue : false
        } , 
        "player" , 
    ]) ; 

 
    for(const layer of layers){
        //when hit by boundary
        if(layer.name == "boundaries"){
            for(const boundary of layer.objects){
                console.log("boundary hit  :"  , boundary.name);
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0) , boundary.width, boundary.height ) , 
                    }) , 
                    k.body({isStatic : true}) ,
                    console.log("boundary.x : " , boundary.x, "boundary.y : " , boundary.y) , 
                    k.pos(boundary.x, boundary.y ) , 
                    boundary.name , 
                ]) ; 

                if(boundary.name){
                    //console.log("boundary name hit : " , boundary.name);
                    player.onCollide(boundary.name , ()=>{
                        player.isInDialogue = true ;
                        player.isMoving = false ;
                        console.log("player collided with boundary : " , boundary.name);
                        displayDialogue(dialogueData[boundary.name] , () => {
                            player.isInDialogue = false ;
                        });
                    })
                }
            }
            continue;
        }
        // console.log("loaded till here");
        // Adjusting player's initial position calculation
        if(layer.name == "spawnpoints"){
            for(const spawnpoint of layer.objects){
                if(spawnpoint.name == "player"){
                    // console.log("spawnpoint x: " , spawnpoint.x *3 , " spawnpoint y"  ,  spawnpoint.y*3);
                    player.pos = k.vec2(map.pos.x + spawnpoint.x * scaleFactor, map.pos.y + spawnpoint.y * scaleFactor);
                    k.add(player);  
                    continue;
                }
            }
        }

    }

    setCamScale(k) ;    

    k.onResize(() => {
        setCamScale(k);
    });

    k.onUpdate(() => {
        k.camPos(player.worldPos().x, player.worldPos().y);
        // console.log("player world pos : " , player.worldPos().x , player.worldPos().y);
    });

    k.onMouseDown((mouseBtn) => {
        // console.log("mouse pressed down");
        if (mouseBtn !== "left" || player.isInDialogue) return;
    
        
        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);
    
        const mouseAngle = player.pos.angle(worldMousePos);
    
        const lowerBound = 50;
        const upperBound = 125;
    
        if (
          mouseAngle > lowerBound &&
          mouseAngle < upperBound &&
          player.curAnim() !== "walk-up"
        ) {
          player.play("walk-up");
          player.direction = "up";
          return;
        }
    
        if (
          mouseAngle < -lowerBound &&
          mouseAngle > -upperBound &&
          player.curAnim() !== "walk-down"
        ) {
          player.play("walk-down");
          player.direction = "down";
          return;
        }
    
        if (Math.abs(mouseAngle) > upperBound) {
          player.flipX = false;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "right";
          return;
        }
    
        if (Math.abs(mouseAngle) < lowerBound) {
          player.flipX = true;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "left";
          return;
        }
      });   

    // k.onKeyDown ((key) => { 
    //     //if(player.isInDialogue) return ;
    //     if(key === "up" || key === "down" || key === "left" || key === "right"){
    //         player.play("walk-"+key);
    //         player.direction = key;
    //     }
    // });
    
    k.onMouseRelease(() => {
        stopanim();
    });
    
    function stopanim() {
        //console.log("stop animation");
        // Assuming you have a way to determine if the player is moving or not
        if(player.direction === "down"){
            player.play("idle-down");
            return ;
        }
        if(player.direction === "up"){
            player.play("idle-up");
            return ;
        }
        if(player.direction === "left" || player.direction === "right"){
            player.play("idle-side");
            return ;
        }
    }


});

k.go("main");