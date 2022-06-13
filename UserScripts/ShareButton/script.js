// ==UserScript==
// @name         [YouTube] Add share button
// @version      0.1
// @author       SL1900
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let document_ready = false;
    let sleep = (time) => new Promise(resolve => setTimeout(resolve,time));

    class ShareButton extends HTMLElement  {
        static get is() { return "share-button"; }
        static get properties() {

        }
        constructor() {
            super();

            const shadow = this.attachShadow({ mode: "open" });
            const wrapper = document.createElement("div");
            wrapper.setAttribute("class", "wrapper");
            wrapper.innerHTML = "SHARE";
            wrapper.id = "sl-share-button";

            const style = document.createElement("style");

            style.textContent = `
               #sl-share-button{
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  user-select: none;
                  cursor: pointer;
                  font-size: var(--ytd-tab-system-font-size);
                  color: var(--yt-button-icon-button-text-color,var(--yt-spec-text-secondary));
                  border-radius: 5px;
                  height: 100%;
                  width: 60px;
                   margin: 0px 4px;
               }
               .sl-asb-animation { animation: 0.5s linear circle; }
               @keyframes circle{
                 0%     { background-color: #ffffff00; }
                 49.99% { background-color: #ffffffaa; }
                 50%    { background-color: #ffffff00; }
                 100%   { background-color: #ffffffaa; }
               }
               `;

            shadow.appendChild(style);
            this.wrapper = shadow.appendChild(wrapper);
            this.onclick = this.OnClick;
        }

        OnClick(){
            let link = window.location.href;
            let video_id = link.match(/(?<=\?v=).+?(?=(&|$))/ig);
            console.log(`[Add share button] Link copied to clipboard. [https://youtu.be/${video_id}]`);
            navigator.clipboard.writeText(`https://youtu.be/${video_id}`);

            this.wrapper.innerHTML = "COPIED!";
            this.wrapper.classList.add("sl-asb-animation");

            setTimeout(()=>{
                this.wrapper.innerHTML = "SHARE";
                this.wrapper.classList.remove("sl-asb-animation");
            },1000);
        }
    }
    customElements.define(ShareButton.is, ShareButton);

    //Wait for element to appear on page
    $(document).ready(async ()=>{
        for(;;){
            if($("#menu yt-formatted-string").filter((i,e)=>{ return e.innerHTML == "Share"}).length) break;
            await sleep(200);
        }

        document_ready = true;
        inject_button();
    });

    setInterval(()=>{
        if(!document_ready) return;
        if($("share-button").length != 0) return;

        inject_button();
    },200);

    //Inject button onto a page
    function inject_button()
    {
        console.log("[INJECTING SHARE BUTTON]");

        let share_button =
            $("#menu yt-formatted-string")
              .filter((i,e)=>{ return e.innerHTML == "Share"})
              .parent().parent();
        share_button.get()[0].style.display = "none";

        const replacer = new ShareButton();
        share_button.get(0).after(replacer);
    }
})();
