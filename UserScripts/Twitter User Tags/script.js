// ==UserScript==
// @name         [Twitter] User tags
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  idk
// @author       SL1900
// @match        *://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function saveData(){
        GM_xmlhttpRequest({
            method: 'POST',
            url: "https://StoreNote.dumbone.repl.co/set",
            data: JSON.stringify({filename: "tags.json", content: localStorage.getItem("slTags")}),
            onload: function () { },
            headers:{"Content-type": "application/json"}
        });
    }

    function getData(){
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://StoreNote.dumbone.repl.co/get?filename=tags.json",
            onload: function (res) {
                localStorage.setItem("slTags",res.responseText);
            },
            headers:{"Content-type": "application/json"}
        });
    }

    if(!localStorage.getItem("slTags")){
        getData();
    }

    setInterval(()=>{
        console.log("[Twitter tags] Syncing...");
        if(localStorage.getItem("slTags"))
            saveData();
    },60000);

    let style = document.createElement("style");
            style.textContent = `
            .sl-note-modal{
              position: fixed;
              inset: 0;
              background-color: #00000088;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 5px;
            }
            .sl-note-modal *{
              user-select: none;
            }
            `;
    document.body.appendChild(style);

    class NoteNode extends HTMLElement{
        static get is(){ return "note-node" }
        constructor(username){
            if(!username) username = "default";
            super();

            let storedData = localStorage.getItem("slTags");
            if(storedData) this.tags = JSON.parse(storedData);
            else this.tags = {};

            this.username = username;

            let wrapper = document.createElement("div");
            wrapper.classList.add("wrapper");
            this.wrapper = this.appendChild(wrapper);

            let text_node = document.createElement("div");
            text_node.innerHTML = "PLACEHOLDER";
            this.text_node = this.wrapper.appendChild(text_node);

            this.style.cursor = "pointer";
            this.style.userSelect = "none";

            this.onclick = this.CreateModal;
            this.Update.apply(this);
        }
        CreateModal(event){
            this.tags = JSON.parse(localStorage.getItem("slTags"));
            event.stopPropagation();
            event.preventDefault();

            let style = document.createElement("style");
            style.textContent = `
            :root{
              --bg: lightgray;
              --bg-tag: #A0EDFF;
              --border: #00CAD9;
              --border-secondly: white;
            }
            .sl-modal-wrapper{
              position: relative;
              width: 90%;
              height: 80%;
              border: 2px solid var(--border-secondly);
              border-radius: 5px;
              background: var(--bg);
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
            }
            .sl-modal-body{
              flex: 1;
              border-top: 2px solid var(--border-secondly);
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
            }
            .sl-modal-tags{
              display: flex;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
              width: 80%;
            }
            .sl-modal-edit-btn{
              border: 2px solid var(--border-secondly);
              border-radius: 5px;
              display: flex;
              align-items: center;
              padding: 2px;
              margin: 2px;
              cursor: pointer;
            }
            .sl-modal-tag-input,
            .sl-modal-search-input,
            .sl-modal-edit-name-input,
            .sl-modal-edit-tag-input,
            .sl-modal-edit-selected-input
            {
              margin: 0 5px;
              user-select: text;
            }
            .sl-modal-username{
              border: 2px solid var(--border-secondly);
              border-radius: 5px;
              padding: 2px;
              margin: 1px 2px;
            }
            .sl-modal-search{
              display: flex;
              align-items: center;
              width: 90%;
            }
            .sl-modal-search input{
              flex: 1;
            }
            .sl-modal-tag-node{
              border: 2px solid var(--border);
              border-radius: 5px;
	          margin: 2px;
	          padding: 4px;
	          display: flex;
	          align-items: center;
              background-color: var(--bg-tag);
            }
            .sl-modal-edit-menu{
              display: none;
              position: absolute;
              inset: 0;
              background-color: var(--bg);
            }
            .sl-modal-edit-menu.enabled{
              display: flex;
            }
            .sl-modal-edit-close-btn{
              position: absolute;
              top: 5px;
              right: 5px;
            }
            .sl-modal-edit-sidebar{
              border-right: 2px solid var(--border-secondly);
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            .sl-modal-edit-sidebar select{
              flex: 1;

              width: 100%;
            }
            .sl-modal-edit-main{
              align-items: center;
              display: flex;
              padding: 5px;
              flex: 3;
            }
            .sl-modal-edit-select-buttons{
              display: flex;
            }
            .sl-modal-edit-select-buttons div{
              border: 2px solid var(--border-secondly);
              border-radius: 5px;
              padding: 2px;
              margin: 2px;
            }
            .sl-modal-add-tag-btn{
              padding: 2px 4px;
              margin: 3px 5px 3px 0;
              border: 2px solid var(--border-secondly);
              border-radius: 5px;
              background: var(--bg);
            }
            .sl-modal-edit-change-btn{
              height: 80%;
            }
            .sl-modal-edit-main-inputs{
              flex: 1;
              display: flex;
              flex-direction: column;
              height: 100%;
             }
             .sl-modal-edit-users-list{
               flex: 1;
               overflow-y: scroll;
               margin: 5px;
               padding: 2px;
               border: 2px solid var(--border-secondly);
               background-color: var(--bg);
               border-radius: 5px;
               display: flex;
               flex-direction: column;
             }
             .sl-modal-edit-users-list-item{
               margin: 4px;
               padding: 2px;
               border: 2px solid var(--border);
               border-radius: 5px;
               background-color: white;
               cursor: pointer;
             }
            `;

            let modal_o = document.createElement("div");
            let modal = document.body.appendChild(modal_o);
            modal.classList.add("sl-note-modal");
            modal.id = "sl-modal";

            $(window).click(function() {
                let modal = $("#sl-modal");
                if(modal.length) modal.remove();
            });

            modal.innerHTML = `
            <div class="sl-modal-wrapper">
              <div class="sl-modal-search">
                <!--
                Search:
                <input type="text" class="sl-modal-search-input" value="No functionality for now">
                -->
                Tag:
                <input type="text" placeholder="tag name in list|tag name on page" class="sl-modal-tag-input">
                <div class="sl-modal-add-tag-btn">+</div>
                <div class="sl-modal-username">${this.username}</div>
                <div class="sl-modal-edit-btn">EDIT</div>
              </div>
              <div class="sl-modal-body">
                <div class="sl-modal-tags"></div>
              </div>
              <div class="sl-modal-edit-menu">
                <div class="sl-modal-edit-sidebar">
                  <select class="sl-modal-edit-select" size="2"></select>
                  <div class="sl-modal-edit-select-buttons">
                    <div class="sl-modal-edit-select-refesh">REFRESH</div>
                    <div class="sl-modal-edit-select-up">UP</div>
                    <div class="sl-modal-edit-select-down">DOWN</div>
                  </div>
                </div>
                <div class="sl-modal-edit-main">
                  <div class="sl-modal-edit-main-inputs">
                    Selected:
                    <input type="text" class="sl-modal-edit-selected-input" disabled>
                    Name:
                    <input type="text" class="sl-modal-edit-name-input">
                    Tag:
                    <input type="text" class="sl-modal-edit-tag-input">
                    <div class="sl-modal-edit-users-list"></div>
                  </div>
                  <button class="sl-modal-edit-change-btn">Change</button>
                </div>
                <div class="sl-modal-edit-close-btn">X</div>
              </div>
            </div>
            `;

            this.searchInput = modal.querySelector(".sl-modal-search-input");
            this.tagInput = modal.querySelector(".sl-modal-tag-input");
            this.tagsNode = modal.querySelector(".sl-modal-tags");
            this.editNameInput = modal.querySelector(".sl-modal-edit-name-input");
            this.editTagInput = modal.querySelector(".sl-modal-edit-tag-input");
            this.editSelectedInput = modal.querySelector(".sl-modal-edit-selected-input");
            this.editChangeBtn = modal.querySelector(".sl-modal-edit-change-btn");
            this.editUsersList = modal.querySelector(".sl-modal-edit-users-list");
            this.editUsersList.onscroll = (event) => { event.stopPropagation(); }
            this.addTagBtn = modal.querySelector(".sl-modal-add-tag-btn");

            this.addTagBtn.onclick = ()=> this.ModalAddTag.apply(this);

            this.editChangeBtn.onclick = (event)=>{
                this.EditTag.apply(this);
            }
            modal.querySelector(".sl-modal-wrapper").onclick = (event)=>{
                event.stopPropagation();
            }

            modal.querySelector(".sl-modal-edit-btn").onclick = (event)=>{
                modal.querySelector(".sl-modal-edit-menu").classList.add("enabled");
                this.UpdateEditMenu.apply(this);
            }
            modal.querySelector(".sl-modal-edit-select-refesh").onclick = (event)=>{
                this.UpdateEditMenu.apply(this);
            }

            modal.querySelector(".sl-modal-edit-close-btn").onclick = (event)=>{
                modal.querySelector(".sl-modal-edit-menu").classList.remove("enabled");
                this.UpdateModal.apply(this);
            }
            modal.querySelector(".sl-modal-edit-select-down").onclick = (event)=>{
                this.MoveTagDown.apply(this);
            }
            modal.querySelector(".sl-modal-edit-select-up").onclick = (event)=>{
                this.MoveTagUp.apply(this);
            }


            this.editSelect = modal.querySelector(".sl-modal-edit-select");
            this.editSelect.onchange = ()=>{ this.OnSelectChange.apply(this)};
            this.editMain = modal.querySelector(".sl-modal-edit-main");

            this.UpdateModal.apply(this);

            modal.appendChild(style);
        }
        EditTag(){
            let old_name = this.editSelectedInput.value;
            let new_name = this.editNameInput.value;
            let new_tag = this.editTagInput.value;

            if(!old_name) return;

            if(old_name != new_name){
                let tag_entries = Object.entries(this.tags);
                let index = getIndex(tag_entries, old_name);


                Object.defineProperty(this.tags, new_name, Object.getOwnPropertyDescriptor(this.tags, old_name));
                delete this.tags[old_name];

                this.UpdateEditMenu.apply(this);

                this.editSelect.selectedIndex = tag_entries.length - 1;
                for(let i = 0; i < tag_entries.length - index - 1;i++){
                    this.MoveTagUp.apply(this);
                }
            }

            this.tags[new_name].icon = new_tag;

            localStorage.setItem("slTags",JSON.stringify(this.tags));

            this.UpdateEditMenu.apply(this);

            function getIndex(inp, value){
                let index = -1;
                for(let i = 0; i < inp.length; i++){
                    if(inp[i][0] == value) index = i;
                }
                return index;
            }
        }
        OnSelectChange(){
            this.UpdateEditMenu.apply(this);

        }
        MoveTagDown(){
            let result = {};
            let entries = Object.entries(this.tags);
            let index = getIndex(entries, this.editSelect.value);
            if(index == -1) return;
            let cut = entries.splice(index,1);
            entries.splice(index+1, 0, cut[0]);
            for(let [name,value] of entries){
                result[name] = value;
            }
            this.tags = result;
            localStorage.setItem("slTags",JSON.stringify(this.tags));

            this.editSelect.selectedIndex += 1;

            this.UpdateModal.apply(this);
            this.UpdateEditMenu.apply(this);

            function getIndex(inp, value){
                let index = -1;
                for(let i = 0; i < inp.length; i++){
                    if(inp[i][0] == value) index = i;
                }
                return index;
            }
        }
        MoveTagUp(){
            let result = {};
            let entries = Object.entries(this.tags);
            let index = getIndex(entries, this.editSelect.value);
            if(index == -1 || index == 0) return;
            let cut = entries.splice(index,1);
            entries.splice(index-1, 0, cut[0]);
            for(let [name,value] of entries){
                result[name] = value;
            }
            this.tags = result;
            localStorage.setItem("slTags",JSON.stringify(this.tags));

            this.editSelect.selectedIndex -= 1;

            this.UpdateModal.apply(this);
            this.UpdateEditMenu.apply(this);

            function getIndex(inp, value){
                let index = -1;
                for(let i = 0; i < inp.length; i++){
                    if(inp[i][0] == value) index = i;
                }
                return index;
            }
        }
        UpdateEditMenu(){
            let selected = this.editSelect.selectedIndex;

            this.editSelect.innerHTML = "";

            for(let [name, value] of Object.entries(this.tags)){
                let option = document.createElement("option");
                option.value = name;
                option.innerHTML = name;
                option.classList.add("sl-modal-edit-select-option");
                this.editSelect.appendChild(option);
            }

            this.editSelect.selectedIndex = selected;
            let selected_name = this.editSelect.value;

            if(this.tags[selected_name]){
                this.editNameInput.value = selected_name;
                this.editSelectedInput.value = selected_name;
                this.editTagInput.value = this.tags[selected_name].icon;

                this.editUsersList.innerHTML = "";

                console.log(this.tags[selected_name]);

                for(let [username, value] of Object.entries(this.tags[selected_name].users)){
                    let user_node = document.createElement("a");
                    user_node.href = "https://twitter.com/" + username.slice(1);
                    user_node.classList.add("sl-modal-edit-users-list-item");
                    user_node.innerHTML = username;

                    this.editUsersList.appendChild(user_node);
                }
            }
        }
        ModalAddTag(){
            let [name, icon] = this.tagInput.value.split("|");
            this.tagInput.value = "";
            if(!this.tags[name]){
                this.tags[name] = {icon: icon, users: {}};
                localStorage.setItem("slTags",JSON.stringify(this.tags));
            }
            this.UpdateModal.apply(this);
        }
        ModalAddAddButton(){
            let btn = document.createElement("div");
            btn.classList.add("sl-modal-add-tag-btn");
            btn.innerHTML = "+";
            let i_btn = this.tagsNode.appendChild(btn);
            i_btn.onclick = ()=>{ this.ModalAddTag.apply(this); }
        }
        UpdateModal(){
            this.tagsNode.innerHTML = "";
            for(let [tagname, tagvalue] of Object.entries(this.tags) ){
                let tagNode = createElement("label","sl-modal-tag-node");
                
                tagNode.username = tagname;

                let check = document.createElement("input");
                check.type = "checkbox";
                let user_checked = this.tags[tagname].users[this.username];
                check.checked = !!user_checked;

                tagNode.check = tagNode.appendChild(check);

                tagNode.check.onclick = (event)=>{
                    if(event.currentTarget.checked)
                    {
                        this.tags[tagname].users[this.username] = true;
                        localStorage.setItem("slTags",JSON.stringify(this.tags));
                    }
                    else
                    {
                        delete this.tags[tagname].users[this.username];
                        localStorage.setItem("slTags",JSON.stringify(this.tags));
                    }
                }

                let text_node = document.createElement("div");
                text_node.innerHTML += `${tagname} | ${tagvalue.icon}`;
                tagNode.appendChild(text_node);

                let del = document.createElement("div");
                del.innerHTML = "X";
                del.style.marginLeft = "2px";
                del.style.borderRadius = "2px";
                del.style.padding = "0 2px";
                del.pressed = 0;
                let i_del = tagNode.appendChild(del);
                i_del.onclick = (event)=>{
                    event.stopPropagation();
                    event.preventDefault();

                    let node = event.currentTarget;
                    node.pressed += 1;
                    let timeout_id;
                    if(node.pressed == 1){
                        node.style.color = "red";
                        timeout_id = setTimeout(()=>{
                            node.pressed = 0;
                            node.style.color = "black";
                        },500);
                    }
                    if(node.pressed < 2) return;
                    let tagNode = node.parentNode;
                    delete this.tags[tagNode.username];
                    localStorage.setItem("slTags",JSON.stringify(this.tags));
                    tagNode.remove();

                };

                this.tagsNode.appendChild(tagNode);
            }
        }
        connectedCallback(){
            setInterval(()=>{this.Update.apply(this)},500)
        }
        Update(){
            this.tags = JSON.parse(localStorage.getItem("slTags"));
            let result_node = document.createElement("div");
            for(let [name,value] of Object.entries(this.tags)){
                if(!value.users[this.username]) continue;

                let tagElement = document.createElement("div");
                tagElement.innerHTML = value.icon;
                tagElement.style.border = "2px solid lightgray";
                tagElement.style.padding = "2px";
                tagElement.style.margin = "0 2px";
                tagElement.style.borderRadius = "5px";

                result_node.appendChild(tagElement);
            }
            if(result_node.childElementCount == 0){
                let tagElement = document.createElement("div");
                tagElement.innerHTML = "No_tags";
                tagElement.style.border = "2px solid gray";
                tagElement.style.background = "lightgray";
                tagElement.style.padding = "2px";
                tagElement.style.margin = "0 2px";
                tagElement.style.borderRadius = "5px";

                result_node.appendChild(tagElement);
            }
            result_node.style.display = "flex";
            result_node.style.flexWrap = "wrap";

            if(this.wrapper.firstChild.innerHTML == result_node.innerHTML) return;

            this.wrapper.innerHTML = "";
            this.wrapper.appendChild(result_node);
        }
    }
    customElements.define(NoteNode.is, NoteNode);

    let sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

    $(document).ready(()=>{ setInterval(CheckUsernames,200); } );

    function CheckUsernames(){
        //console.log("[CHECKING USERNAMES]");

        //Target usernames in "Following" list
        let usernames = $(".css-18t94o4.css-1dbjc4n.r-1ny4l3l.r-ymttw5.r-1f1sjgu.r-o7ynqc.r-6416eg .css-1dbjc4n.r-1iusvr4.r-16y2uox .r-18u37iz.r-1wbh5a2");

        for(let username of usernames){
            let name = username.querySelector("div  div > div > span").innerHTML;
            if(username.style.alignItems != "center") username.style.alignItems = "center";

            if(username.sl_note_added) continue;
            username.sl_note_added = true;

            let noteNode = new NoteNode(name);
            username.appendChild(noteNode);
        }

        //Target username in user profile
        let profile_username = $(`[aria-label="Home timeline"] [data-testid="UserName"] > div > div > div:nth-child(2) span`)[0];

        if(profile_username && !profile_username.sl_note_added){
            profile_username.sl_note_added = true;

            let noteNode = new NoteNode(profile_username.innerHTML);
            noteNode.setAttribute("Source","Profile");
            profile_username.appendChild(noteNode);
        }

        //Target usernames in feed
        let tweet_usernames = $(`[data-testid="tweet"] .r-18u37iz [role="link"].r-1wbh5a2.r-dnmrzs  div > div > span`);

        for(let username of tweet_usernames){
            if(username.sl_note_added) continue;
            username.sl_note_added = true;

            let name = username.innerHTML;
            username.style.display = "flex";
            username.style.flexDirection = "row";
            username.style.alignItems = "center";
            username.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.flexWrap = "wrap";

            let noteNode = new NoteNode(name);
            noteNode.setAttribute("Source","Feed");
            username.appendChild(noteNode);
        }

        //Target username in tweet
        let tweet_username = $(`[aria-label="Timeline: Conversation"] > div > div:first-child [data-testid="tweet"] .css-1dbjc4n.r-1wbh5a2.r-dnmrzs.r-1ny4l3l .r-18u37iz [role="link"].r-dnmrzs.r-1ny4l3l span.r-poiln3`)[0];
        if(tweet_username && !tweet_username.sl_note_added){
            tweet_username.sl_note_added = true;

            let noteNode = new NoteNode(tweet_username.innerHTML);
            noteNode.setAttribute("Source","Tweet");
            tweet_username.appendChild(noteNode);
        }
    }

    function createElement(type,classname){
        let element = document.createElement(type);
        element.classList.add(classname);
        return element;
    }
})();
