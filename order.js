(function () {
  "use strict";

  var fmt = function (n) {
    return "$" + n.toFixed(2);
  };

  /* ---------------- Tabs ---------------- */
  var tabStencil = document.getElementById("tab-stencil");
  var tabPcb = document.getElementById("tab-pcb");
  var panelStencil = document.getElementById("panel-stencil");
  var panelPcb = document.getElementById("panel-pcb");

  function showTab(which) {
    var isStencil = which === "stencil";
    tabStencil.classList.toggle("active", isStencil);
    tabPcb.classList.toggle("active", !isStencil);
    tabStencil.setAttribute("aria-selected", isStencil);
    tabPcb.setAttribute("aria-selected", !isStencil);
    panelStencil.hidden = !isStencil;
    panelPcb.hidden = isStencil;
  }

  if (tabStencil && tabPcb) {
    tabStencil.addEventListener("click", function () { showTab("stencil"); });
    tabPcb.addEventListener("click", function () { showTab("pcb"); });
  }

  /* ---------------- Stencil calculator ---------------- */
  var STENCIL_BASE = 5;
  var STENCIL_PER_CM2 = 0.05;

  var stenWidth = document.getElementById("sten-width");
  var stenHeight = document.getElementById("sten-height");
  var stenResult = document.getElementById("sten-result");

  function calcStencil() {
    var w = parseFloat(stenWidth.value) || 0;
    var h = parseFloat(stenHeight.value) || 0;
    var area = Math.max(w, 0) * Math.max(h, 0);
    var price = STENCIL_BASE + area * STENCIL_PER_CM2;
    stenResult.textContent = fmt(price);
  }

  [stenWidth, stenHeight].forEach(function (el) {
    if (el) el.addEventListener("input", calcStencil);
  });

  /* ---------------- PCB calculator ----------------
     Base + area rate are the only figures we stand behind here.
     IC sourcing / complexity / extra-layer surcharges are real line
     items but are quoted individually once we see the project, so
     the calculator lists them rather than inventing a dollar figure. */
  var PCB_BASE = 5;
  var PCB_PER_CM2 = 0.10;

  var pcbWidth = document.getElementById("pcb-width");
  var pcbHeight = document.getElementById("pcb-height");
  var pcbLayers = document.getElementById("pcb-layers");
  var pcbComplexity = document.getElementById("pcb-complexity");
  var pcbSourcing = document.getElementById("pcb-sourcing");
  var pcbResult = document.getElementById("pcb-result");
  var pcbSurcharges = document.getElementById("pcb-surcharges");

  function calcPcb() {
    var w = parseFloat(pcbWidth.value) || 0;
    var h = parseFloat(pcbHeight.value) || 0;
    var area = Math.max(w, 0) * Math.max(h, 0);
    var price = PCB_BASE + area * PCB_PER_CM2;
    pcbResult.textContent = fmt(price);

    var notes = [];
    if (pcbSourcing.checked) {
      notes.push("Main IC sourcing — quoted once we know the parts");
    }
    if (pcbComplexity.value === "med") {
      notes.push("Medium chip &amp; routing complexity — quoted after design review");
    } else if (pcbComplexity.value === "high") {
      notes.push("High chip &amp; routing complexity — quoted after design review");
    }
    var layers = parseInt(pcbLayers.value, 10);
    if (layers > 2) {
      notes.push(layers + "-layer board — surcharge for layers beyond 2");
    }

    pcbSurcharges.innerHTML = notes.map(function (n) {
      return "<li>" + n + "</li>";
    }).join("");
  }

  [pcbWidth, pcbHeight, pcbLayers, pcbComplexity, pcbSourcing].forEach(function (el) {
    if (el) el.addEventListener("input", calcPcb);
  });

  /* ---------------- Order form -> mailto ---------------- */
  var orderForm = document.getElementById("order-form-el");
  var ORDER_EMAIL = "10matthew.robinson@gmail.com";

  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("of-name").value.trim();
      var email = document.getElementById("of-email").value.trim();
      var type = document.getElementById("of-type").value;
      var details = document.getElementById("of-details").value.trim();

      var subject = "Order inquiry: " + type + (name ? " — " + name : "");
      var bodyLines = [
        "Name: " + name,
        "Email: " + email,
        "Ordering: " + type,
        "",
        "Project details:",
        details || "(none provided)",
        "",
        "Attach your Gerber files or chip list to this email before sending."
      ];
      var mailto = "mailto:" + ORDER_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;
    });
  }

  /* ---------------- Init ---------------- */
  calcStencil();
  calcPcb();
})();
