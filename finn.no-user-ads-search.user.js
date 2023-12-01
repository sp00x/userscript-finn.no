// ==UserScript==
// @name         Finn.no: søk i enkeltbrukeres annonser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Søk i enkeltbrukeres annonser på Finn.no
// @author       sp00x
// @match        https://www.finn.no/profile?userId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=finn.no
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", () => {

        let ads = document.querySelector("profile-active-ads-podlet")
        if (ads) {
            let el = document.createElement("div");
            el.innerHTML = `
            <div>
              <h3>Søk i annonser</h3>
              <div><button style="padding: 0.25em; border: 1px solid black;" class="x-loadall">Last alle annonser</button></div>
              <div style="margin: 1em 0em;">
                <input class="x-search" type="text" style="border: 1px solid gray; width: 100%" placeholder="skriv søketest her"></input>
              </div>
            </div>`;
            ads.parentNode.insertBefore(el, ads);

            let loadAllEl = el.querySelector("button.x-loadall");
            let startTop = document.body.scrollTop;
            loadAllEl.onclick = () => {
                const checkForMoreAds = () => {
                    let loadingEl = ads.shadowRoot.querySelector("div.infinite-scroll-component > p.mt-16");
                    if (loadingEl) {
                        console.log("more to load...");
                        window.scrollTo(0, document.body.scrollHeight);
                        setTimeout(checkForMoreAds, 150);
                    } else {
                        window.scrollTo(0, startTop);
                        console.log("all loaded!");
                    }
                }
                checkForMoreAds();
            }

            let searchEl = el.querySelector("input.x-search");
            searchEl.onkeydown = (e) => {
                if (e.key == "Enter") {
                    let searchText = searchEl.value.toLowerCase().trim();
                    const allAds = ads.shadowRoot.querySelectorAll(".grid > div");
                    for (let i = 0; allAds.length > i; i++) {
                        let ad = allAds[i];
                        let p = ad.querySelector("p.text-body");
                        if (p) {
                            let text = p.innerText.toLowerCase();
                            //console.log(i, text);
                            let show = searchText == "" || (text.indexOf(searchText) >= 0);
                            ad.style.display = show ? "block" : "none";
                        }
                    }
                }
            };
            console.log(searchEl);
        }
    });
})();