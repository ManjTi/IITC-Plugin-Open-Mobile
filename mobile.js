// ==UserScript==
// @author              tunmenee
// @id                  mobile-open
// @name                Open In Scanner
// @category Misc
// @version 1.0.1
// @namespace https://github.com/ManjTi/IITC-Plugin-Open-Mobile/
// @description Open selected portal in scanner (mobile only)
// @include https://intel.ingress.com/intel*
// @match https://intel.ingress.com/intel*
// @grant none
// ==/UserScript==

// Wrapper function that will be stringified and injected
// into the document. Because of this, normal closure rules
// do not apply here.


function wrapper(plugin_info) {

    // Make sure that window.plugin exists. IITC defines it as a no-op function,
    // and other plugins assume the same.
    if (typeof window.plugin !== 'function') window.plugin = function () { };

    // Name of the IITC build for first-party plugins
    plugin_info.buildName = 'mobile-open';

    // Datetime-derived version of the plugin
    plugin_info.dateTimeVersion = '1';

    // ID/name of the plugin
    plugin_info.pluginId = 'mobile-open';

    // The entry point for this plugin.
    function setup() {
        window.addHook('portalSelected', updateMobile);

        //add css
        var css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = `
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
        }`
        document.head.appendChild(css);

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
