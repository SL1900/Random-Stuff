// ==UserScript==
// @name         [YouTube] Chat emoji categories trim
// @version      0.2
// @description  Script that leaves only one emoji category in Youtube Chat to prevent lag when opening emoji menu
// @author       SL1900
// @match        *://*.youtube.com/live_chat*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/846039
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        $("#emoji.yt-live-chat-message-input-renderer")[0].data.categories =
            $("#emoji.yt-live-chat-message-input-renderer")[0].data.categories.slice(0,1);

        $("#emoji.yt-live-chat-message-input-renderer")[0].data.categoryButtons =
            $("#emoji.yt-live-chat-message-input-renderer")[0].data.categoryButtons.slice(0,1);
    })
})();
