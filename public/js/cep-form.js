(function () {
  var form = document.getElementById("enquireForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    var nameEl = document.getElementById("cep_efName");
    var phoneEl = document.getElementById("cep_efPhone");
    var emailEl = document.getElementById("cep_efEmail");
    var clinicEl = document.getElementById("cep_efClinic");
    var interestEl = document.getElementById("cep_efInterest");
    var messageEl = document.getElementById("cep_efMsg");
    var submitBtn = form.querySelector('button[type="submit"]');

    var name = (nameEl && nameEl.value ? nameEl.value : "").trim();
    var phone = (phoneEl && phoneEl.value ? phoneEl.value : "").replace(/\D/g, "");
    var email = (emailEl && emailEl.value ? emailEl.value : "").trim();
    var clinic = (clinicEl && clinicEl.value ? clinicEl.value : "").trim();
    var interest = (interestEl && interestEl.value) || "Chronic Endometritis Panel";
    var message = (messageEl && messageEl.value ? messageEl.value : "").trim();

    function setError(el, on) {
      if (!el) return;
      var wrap = el.closest(".ef-row");
      if (wrap) wrap.classList.toggle("has-error", !!on);
    }

    var ok = true;
    setError(nameEl, name === "");
    if (name === "") ok = false;
    setError(phoneEl, !/^[6-9]\d{9}$/.test(phone));
    if (!/^[6-9]\d{9}$/.test(phone)) ok = false;
    setError(emailEl, email !== "" && email.indexOf("@") < 1);
    if (email !== "" && email.indexOf("@") < 1) ok = false;
    if (!ok) return;

    var original = submitBtn ? submitBtn.textContent : "Send enquiry";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    var payload = new URLSearchParams();
    payload.set("method", "landing_page_enquiry");
    payload.set("name", name);
    payload.set("phone", phone);
    payload.set("email", email);
    payload.set("scan", interest);
    payload.set("message", [clinic ? "Clinic: " + clinic : "", message].filter(Boolean).join("\n"));
    payload.set("terms", "Yes");

    fetch("/scripts/ajax/index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*",
      },
      body: payload.toString(),
    })
      .then(function (res) {
        return res.text();
      })
      .then(function (text) {
        var data = {};
        try {
          data = JSON.parse(text);
        } catch (err) {
          var match = text.match(/\{[\s\S]*\}/);
          if (match) data = JSON.parse(match[0]);
        }
        var result = String(data.RESULT || data.result || "").toUpperCase();
        if (result === "OK" || data.id) {
          form.classList.add("submitted");
        } else {
          alert(data.error_msg || "Could not submit. Please try again.");
        }
      })
      .catch(function () {
        alert("Could not submit. Please try again.");
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = original;
        }
      });
  });
})();
