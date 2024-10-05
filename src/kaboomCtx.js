import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import { scaleFactor } from "./constants";

export const k = kaboom({
    global : false , 
    touchToMouse : true ,
    canvas: document.getElementById("game"),
});