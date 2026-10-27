const eventDate = new Date("2026-12-05T21:30:00-03:00");

const fields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

function updateCountdown() {
  const remaining = Math.max(0, eventDate.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  const values = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };

  Object.entries(values).forEach(([key, value]) => {
    fields[key].textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

const countdownButterflies = document.querySelector("#countdownButterflies");
const countdownRoutes = [
  ["-12%", "18%", "42%", "10%", "108%", "28%", "62deg", "78deg", "70deg"],
  ["108%", "34%", "58%", "25%", "-12%", "14%", "-64deg", "-78deg", "-68deg"],
  ["12%", "104%", "34%", "62%", "74%", "-10%", "18deg", "28deg", "20deg"],
  ["86%", "102%", "66%", "58%", "24%", "-12%", "-20deg", "-30deg", "-22deg"],
  ["-10%", "72%", "36%", "52%", "108%", "78%", "82deg", "96deg", "86deg"],
  ["108%", "68%", "64%", "46%", "-12%", "82%", "-86deg", "-98deg", "-88deg"],
  ["4%", "40%", "48%", "32%", "96%", "8%", "48deg", "62deg", "52deg"],
  ["96%", "12%", "52%", "38%", "2%", "56%", "-42deg", "-58deg", "-46deg"],
  ["28%", "108%", "44%", "70%", "18%", "-10%", "8deg", "-16deg", "-8deg"],
  ["72%", "-10%", "58%", "36%", "82%", "108%", "172deg", "156deg", "166deg"],
];

countdownRoutes.forEach((route, index) => {
  const butterfly = document.createElement("span");
  butterfly.className = "countdown-butterfly";
  const image = document.createElement("img");
  image.src = "assets/intro-zoe/butterfly-main.png";
  image.alt = "";
  const values = {
    "--start-x": route[0], "--start-y": route[1], "--middle-x": route[2], "--middle-y": route[3],
    "--end-x": route[4], "--end-y": route[5], "--start-rotation": route[6],
    "--middle-rotation": route[7], "--end-rotation": route[8],
    "--size": `${38 + (index % 4) * 9}px`, "--scale": 0.82 + (index % 3) * 0.09,
    "--duration": `${9.5 + (index % 5) * 1.15}s`, "--delay": `${-index * 1.37}s`,
    "--flap-duration": `${560 + (index % 4) * 90}ms`,
  };
  Object.entries(values).forEach(([key, value]) => butterfly.style.setProperty(key, value));
  butterfly.append(image);
  countdownButterflies.append(butterfly);
});

const locationDialog = document.querySelector("#locationDialog");
const openLocation = document.querySelector("#openLocation");
const closeLocation = document.querySelector("#closeLocation");
const copyAddress = document.querySelector("#copyAddress");
const copyStatus = document.querySelector("#copyStatus");
const address = "Baco Eventos, Nogoyá, Entre Ríos (-32.4305573, -59.8339424)";

openLocation.addEventListener("click", () => locationDialog.showModal());
closeLocation.addEventListener("click", () => locationDialog.close());

locationDialog.addEventListener("click", (event) => {
  if (event.target === locationDialog) locationDialog.close();
});

copyAddress.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(address);
    copyStatus.textContent = "Dirección copiada";
  } catch {
    const field = document.createElement("textarea");
    field.value = address;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    copyStatus.textContent = copied ? "Dirección copiada" : address;
  }
});

const giftDialog = document.querySelector("#giftDialog");
const openGifts = document.querySelector("#openGifts");
const closeGifts = document.querySelector("#closeGifts");
const copyAlias = document.querySelector("#copyAlias");
const aliasStatus = document.querySelector("#aliasStatus");

openGifts.addEventListener("click", () => giftDialog.showModal());
closeGifts.addEventListener("click", () => giftDialog.close());

giftDialog.addEventListener("click", (event) => {
  if (event.target === giftDialog) giftDialog.close();
});

async function copyGiftValue(value, message) {
  try {
    await navigator.clipboard.writeText(value);
    aliasStatus.textContent = message;
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    aliasStatus.textContent = copied ? message : value;
  }
}

copyAlias.addEventListener("click", () => copyGiftValue("CATRE.MANERA.PARQUE", "Alias copiado"));
document.querySelector("#copyCbu").addEventListener("click", () => copyGiftValue("0110379130037972363483", "CBU copiado"));

const audioFlower = document.querySelector("#audioFlower");
const invitationAudio = document.querySelector("#invitationAudio");
function syncAudioControl(isPlaying) {
  audioFlower.classList.toggle("is-playing", isPlaying);
  audioFlower.setAttribute("aria-pressed", String(isPlaying));
  audioFlower.setAttribute("aria-label", isPlaying ? "Detener música" : "Reproducir música");
}

let audioFadeFrame = 0;

function fadeAudioTo(targetVolume = 0.55, duration = 1800) {
  cancelAnimationFrame(audioFadeFrame);
  const startedAt = performance.now();
  const startingVolume = invitationAudio.volume;

  function step(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    invitationAudio.volume = startingVolume + (targetVolume - startingVolume) * eased;
    if (progress < 1) audioFadeFrame = requestAnimationFrame(step);
  }

  audioFadeFrame = requestAnimationFrame(step);
}

async function startInvitationAudio() {
  cancelAnimationFrame(audioFadeFrame);
  invitationAudio.volume = 0.04;

  try {
    await invitationAudio.play();
    syncAudioControl(true);
    fadeAudioTo(0.55);
  } catch {
    syncAudioControl(false);
  }
}

(() => {
  const intro = document.querySelector(".invitation-intro");
  const flockRoot = intro?.querySelector(".invitation-intro__flock");
  const main = document.querySelector("#invitationMain");
  if (!intro || !flockRoot) return;

  const routeTemplates = [
    ["-16vw", "82vh", "44vw", "56vh", "116vw", "22vh", "62deg", "70deg", "66deg"],
    ["116vw", "72vh", "58vw", "48vh", "-18vw", "14vh", "-62deg", "-70deg", "-66deg"],
    ["8vw", "112vh", "38vw", "58vh", "72vw", "-20vh", "18deg", "24deg", "20deg"],
    ["88vw", "112vh", "62vw", "55vh", "28vw", "-20vh", "-18deg", "-24deg", "-20deg"],
    ["-18vw", "30vh", "46vw", "20vh", "116vw", "62vh", "98deg", "82deg", "108deg"],
    ["116vw", "24vh", "56vw", "34vh", "-18vw", "70vh", "-98deg", "-82deg", "-108deg"],
    ["22vw", "-22vh", "45vw", "40vh", "78vw", "112vh", "162deg", "154deg", "160deg"],
    ["78vw", "-22vh", "58vw", "42vh", "20vw", "112vh", "-162deg", "-154deg", "-160deg"],
    ["-18vw", "94vh", "42vw", "68vh", "112vw", "84vh", "82deg", "96deg", "86deg"],
  ];

  const paths = Array.from({ length: 18 }, (_, index) => {
    const route = routeTemplates[index % routeTemplates.length];
    const offset = Math.floor(index / routeTemplates.length) * 7;
    return {
      size: 74 + (index * 13) % 42,
      delay: (index % 6) * 105 + Math.floor(index / 6) * 70,
      duration: 4400 + (index * 137) % 1100,
      startX: route[0], startY: `calc(${route[1]} - ${offset}vh)`,
      middleX: route[2], middleY: `calc(${route[3]} + ${offset / 2}vh)`,
      endX: route[4], endY: route[5],
      startRotation: route[6], middleRotation: route[7], endRotation: route[8],
      scale: 0.9 + (index % 4) * 0.08,
      flapDuration: 760 + (index % 5) * 85,
    };
  });

  const count = innerWidth < 768 ? 12 : innerWidth < 1100 ? 15 : 18;
  paths.slice(0, count).forEach((path) => {
    const butterfly = document.createElement("span");
    butterfly.className = "intro-butterfly";
    const image = document.createElement("img");
    image.src = "assets/intro-zoe/butterfly-main.png";
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    Object.entries({
      "--size": `${path.size}px`, "--delay": `${path.delay}ms`, "--duration": `${path.duration}ms`,
      "--flap-duration": `${path.flapDuration}ms`, "--start-x": path.startX, "--start-y": path.startY,
      "--middle-x": path.middleX, "--middle-y": path.middleY, "--end-x": path.endX,
      "--end-y": path.endY, "--start-rotation": path.startRotation,
      "--middle-rotation": path.middleRotation, "--end-rotation": path.endRotation, "--scale": path.scale,
    }).forEach(([key, value]) => butterfly.style.setProperty(key, value));
    butterfly.append(image);
    flockRoot.append(butterfly);
  });

  let transitioning = false;
  const enter = async (withMusic) => {
    if (transitioning) return;
    transitioning = true;
    intro.querySelectorAll("button").forEach((button) => { button.disabled = true; });

    if (withMusic) {
      await startInvitationAudio();
    } else {
      invitationAudio.pause();
      syncAudioControl(false);
    }

    intro.classList.add("is-leaving");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      document.body.classList.remove("intro-is-open");
      intro.remove();
      scrollTo(0, 0);
      main?.focus({ preventScroll: true });
    }, reduced ? 280 : 5200);
  };

  intro.querySelector("#zoeIntroWithMusic")?.addEventListener("click", () => enter(true));
  intro.querySelector("#zoeIntroWithoutMusic")?.addEventListener("click", () => enter(false));
})();

audioFlower.addEventListener("click", async () => {
  const willPlay = !audioFlower.classList.contains("is-playing");

  if (willPlay && invitationAudio.getAttribute("src")) {
    try {
      await invitationAudio.play();
    } catch {
      return;
    }
  } else if (!willPlay) {
    invitationAudio.pause();
  }

  audioFlower.classList.toggle("is-playing", willPlay);
  audioFlower.setAttribute("aria-pressed", String(willPlay));
  audioFlower.setAttribute("aria-label", willPlay ? "Detener música" : "Reproducir música");
});
