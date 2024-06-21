import { k } from "./kaboomCtx";
import { scaleFactor } from "./constants";

k.loadSprite("spritesheet" , "./spritesheet.png" , {
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

k.loadSprite("map" , "./map.png") ; 

k.setBackground(k.Color.fromHex("#311047")) ; 

//creating our first scene 
//in kanoom  js
k.scene("main" , async () => {
    const mapData = await(await fetch("./map.json")).json() ;
    //load the data until not mobin it

    const layers = mapData.layers ;


    // map is the game object
    const map = k.make([
        k.sprite("map") , 
        k.pos(0), //the initial position of the sprite when the game is loaded
        k.scale(scaleFactor) //scaling the sprite
    ]) ;

    //game object for the player: 
    const player = k.make([
        k.sprite("spritesheet" , {anim: "idle-down"}),
        k.area({ 
            shape: new k.Rect(k.vec2(0, 3) , 10 , 10) 
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


    //when hit by the boundary: 
    for(const layer of layers){
        if(layer.name == "boundaries"){
            for(const boundary of layer.objects){
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0) , boundary.width , boundary.height) , 
                    }) , 
                    k.body({isStatic : true}) , 
                    k.pos(boundary.x , boundary.y) , 
                    boundary.name , 
                ]) ; 

                if(boundary.name){
                    player.onCollide(boundary.name , ()=>{
                        player.isInDialogue = true ;

                        //TODO : add dialogue
                        const dialogues = require("./dialogues.json") ;
                        const dialogue = dialogues[boundary.name];
                        if(dialogue){
                            //TODO: dialogue display logic
                            console.log(dialogue);
                        }
                        else{
                            console.log("error in displaying dialogues");
                        }
                    })
                }
            }
        }
    }

    k.keyDown("left", () => {
        player.move(-player.speed, 0);
    });
    
    k.keyDown("right", () => {
        player.move(player.speed, 0);
    });
    
    k.keyDown("up", () => {
        player.move(0, -player.speed);
    });
    
    k.keyDown("down", () => {
        player.move(0, player.speed);
    });


})

k.go("main")