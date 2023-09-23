// ==UserScript==
// @author              tunmenee on https://vim.li
// @id                  mobile-open
// @name                Open Portal In Scanner
// @category Misc
// @version 1.0.2
// @namespace https://github.com/ManjTi/IITC-Plugin-Open-Mobile/
// @description Open selected portal in scanner (mobile only)
// @updateURL      https://raw.githubusercontent.com/ManjTi/IITC-Plugin-Open-Mobile/main/mobile.meta.js
// @downloadURL    https://raw.githubusercontent.com/ManjTi/IITC-Plugin-Open-Mobile/main/mobile.user.js
// @runAt          document-end
// @include https://intel.ingress.com/intel*
// @match https://intel.ingress.com/intel*
// @grant none
// ==/UserScript==

function wrapper(plugin_info) {
    if (typeof window.plugin !== 'function') window.plugin = function () { };
    plugin_info.buildName = 'mobile-open';
    plugin_info.dateTimeVersion = '1';
    plugin_info.pluginId = 'mobile-open';

    function setup() {
        

        //add css
        $('<style>').prop('type', 'text/css').html(`
        .mobilelink {
            margin: -30px 0px 0px calc(50% - 112px);
            position: fixed;
            right: 0px;
        }
        .mobilelink a {
            color: white;
            background-color: #9430e9;
            padding: 5px;
            text-weight: bold;
            display: block;
            width: fit-content;
            text-align: center;
        }
        @keyframes pulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(148, 48, 233, 0.4);
            }

            70% {
                transform: scale(1);
                box-shadow: 0 0 0 10px rgba(148, 48, 233, 0);
            }

            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(148, 48, 233, 0);
            }
        }
        `).appendTo('head');
        
        window.addHook('portalSelected', updateMobile);
        //when holding on button, hide before clicking on a new portal
        window.addHook('portalDetailsUpdated', function () {
            $("#updatestatus").find(".mobilelink").remove();
        }
        );
    }

    //link structure https://link.ingress.com/?link=https://intel.ingress.com/portal/guid'
    function updateMobile(data) {
        var guid = data.selectedPortalGuid;
        var url = 'https://link.ingress.com/?link=https://intel.ingress.com/portal/' + guid;
        var html = '<a href="' + url + '" target="_blank">Open in scanner</a>';
        //add to updatestatus container
        //if already exists, replace
        $("#updatestatus").find(".mobilelink").remove();
        //add before the first child
        $("#updatestatus").prepend('<div class="mobilelink">' + html + '</div>');
        //add animation once
        $(".mobilelink").addClass("animated pulse");

    }

    // Add an info property for IITC's plugin system
    setup.info = plugin_info;

    // Make sure window.bootPlugins exists and is an array
    if (!window.bootPlugins) window.bootPlugins = [];
    // Add our startup hook
    window.bootPlugins.push(setup);
    // If IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();
}

// Create a script element to hold our content script
var script = document.createElement('script');
var info = {};

// GM_info is defined by the assorted monkey-themed browser extensions
// and holds information parsed from the script header.
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
        version: GM_info.script.version,
        name: GM_info.script.name,
        description: GM_info.script.description
    };
}

// Create a text node and our IIFE inside of it
var textContent = document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ')');
// Add some content to the script element
script.appendChild(textContent);
// Finally, inject it... wherever.
(document.body || document.head || document.documentElement).appendChild(script);
