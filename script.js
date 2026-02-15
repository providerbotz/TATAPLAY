const SOURCE_2 = "https://allinonereborn.online/tatatv-web/live.php?id=71242";
const SOURCE_3 = "https://allinonereborn.online/amit/host.php?id=54059";
const API_URL =
  "https://raw.githubusercontent.com/abusaeeidx/CricHd-playlists-Auto-Update-permanent/refs/heads/main/api.json";
const NS_PACKAGE = "com.genuine.leone";

document.addEventListener("DOMContentLoaded", () => {
  setupPlayer("player2", SOURCE_2, "p2-status");
  setupPlayer("player3", SOURCE_3, "p3-status");
  fetchChannels();
});

function setupPlayer(id, url, statusId) {
  const player = jwplayer(id).setup({
    file: url,
    type: "hls",
    aspectratio: "16:9",
    autostart: false,
  });

  player.on("ready", () => updateStatus(statusId, "LIVE"));
  player.on("play", () => updateStatus(statusId, "PLAYING"));
  player.on("error", () => updateStatus(statusId, "OFFLINE"));
}

function updateStatus(id, text) {
  const el = document.getElementById(id);
  el.innerText = text;
  el.classList.remove("badge-neutral");
  el.classList.add("badge-error");
}

async function fetchChannels() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const container = document.getElementById("channel-container");
    document.getElementById("loading")?.remove();

    data.slice(0, 12).forEach(ch => {
      container.innerHTML += `
      <div class="channel-card p-4 text-center">
        <img src="${ch.logo}" class="h-16 mx-auto mb-2"/>
        <p class="text-xs">${ch.name}</p>
        <button class="btn btn-error btn-sm mt-2"
          onclick="playInNS('${ch.link}')">NS PLAY</button>
      </div>`;
    });
  } catch {
    document.getElementById("loading").innerText = "FAILED TO LOAD STREAMS";
  }
}

function playInNS(url) {
  window.location.href =
    `intent:${url}#Intent;package=${NS_PACKAGE};type=video/*;end`;
}
