// Diagnóstico temporal: solo se activa con ?debug=1 en la URL.
(function () {
  var params = new URLSearchParams(window.location.search);
  if (params.get("debug") !== "1") return;

  var box = document.createElement("pre");
  box.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;max-height:45vh;overflow:auto;margin:0;padding:10px;background:rgba(0,0,0,.85);color:#fff;font:12px/1.4 monospace;white-space:pre-wrap;border-radius:8px";
  document.body.appendChild(box);

  function log(line) {
    box.textContent += line + "\n";
  }

  log("UA: " + navigator.userAgent);
  log("URL: " + window.location.href);
  log("token: " + (params.get("invite") || "(sin token)"));

  window.addEventListener("error", function (event) {
    log("ERROR JS: " + event.message + " @ " + event.filename + ":" + event.lineno);
  });

  var key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdHVnemh4bGFqeWpkbmp0ZWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDY2MzAsImV4cCI6MjA4MDgyMjYzMH0.GnEzF-iJuiZJH5IVUgszWOq5qv4AeHfFf8Y3_YRW5FA";
  fetch("https://fotugzhxlajyjdnjteld.supabase.co/rest/v1/rpc/get_invite_by_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": key, "Authorization": "Bearer " + key },
    body: JSON.stringify({ p_token: params.get("invite") })
  })
    .then(function (response) {
      log("Supabase HTTP: " + response.status);
      return response.text();
    })
    .then(function (text) {
      log("Respuesta: " + text.slice(0, 300));
    })
    .catch(function (error) {
      log("FALLÓ la consulta: " + error);
    });

  setTimeout(function () {
    var section = document.getElementById("seccion-invitados");
    var names = document.getElementById("nombres-invitados");
    log("Sección existe: " + !!section + " | oculta: " + (section ? section.hidden : "-"));
    log("Nombres: " + (names ? JSON.stringify(names.textContent) : "-"));
    log("Script personalización cargado: " + !!document.querySelector('script[src*="invitation-personalization"]'));
  }, 4000);
})();
