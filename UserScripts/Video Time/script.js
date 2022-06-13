// ==UserScript==
// @name         [YouTube] Stream current time
// @version      0.1
// @author       SL1900
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const sleep = (time) => new Promise(resolve=>setTimeout(resolve,time));

    class TimeNode extends HTMLElement{
        static get is(){ return "time-node"; }
        constructor(){
            super();

            const wrapper = document.createElement("div");
            wrapper.setAttribute("class", "wrapper");
            wrapper.id = "time-node";

            const style = document.createElement("style");

            style.textContent = `
               #time-node{
                  display: flex;
                  justify-content: left;
                  align-items: center;
                  user-select: none;
                  color: var(--yt-spec-text-secondary);
               }
               `;

            this.appendChild(style);
            this.wrapper = this.appendChild(wrapper);
            setInterval(()=>this.Update.apply(this),500);
        }
        Update(){
            this.wrapper.innerHTML = $(".video-stream")[0] && time_format($(".video-stream")[0].currentTime);
        }
    }
    customElements.define(TimeNode.is, TimeNode);

    $(document).ready(async ()=>{

        setInterval(RemoveClipButton,1000)

        //Wait for time element to appear
        while(!$("#info-strings yt-formatted-string").length) await sleep(500);

        //if(!steamTimeNode.innerHTML.includes("streaming")) return;

        let videoIsLive = false;
        setInterval(()=>{
            if($("time-node").length) return;

            let node = new TimeNode();
            $("#info-text")[0].appendChild(node);
        },1e3);
    });

    function RemoveClipButton(){
        let clip_button = $("yt-formatted-string").filter((i,e)=>e.innerHTML == "Clip");
        if(clip_button.length){
            let button_container = clip_button.parent().parent()[0]
            button_container.style.display = "none";
        }

        let save_button = $("yt-formatted-string").filter((i,e)=>e.innerHTML == "Save");
        if(save_button.length){
            let button_container = save_button.parent().parent()[0]
            button_container.style.display = "flex";
        }
    }

    function time_format(time_string){
        let hours = Math.floor(+time_string / 60 / 60).toString();
        let minutes = Math.floor(+time_string / 60 % 60).toString();
        let seconds = Math.floor(+time_string % 60).toString();

        //console.log(`H:${hours} M:${minutes} S:${seconds}`);
        return `${hours.padStart(2,"0")}:${minutes.padStart(2,"0")}:${seconds.padStart(2,"0")}`;
    }
})();
