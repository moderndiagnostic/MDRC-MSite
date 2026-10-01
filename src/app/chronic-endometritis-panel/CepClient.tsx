"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

const PHP_ENQUIRY_URL = "https://www.mdrcindia.com/scripts/ajax/index.php";
const LOCAL_ENQUIRY_URL = "/chronic-endometritis-panel/enquiry";

function parseJson(text: string) {
  try {
    return JSON.parse(text) as { RESULT?: string; result?: string; id?: number; error_msg?: string };
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as { RESULT?: string; result?: string; id?: number; error_msg?: string };
    } catch {
      return null;
    }
  }
}

function isSuccess(data: { RESULT?: string; result?: string; id?: number } | null) {
  const result = String(data?.RESULT ?? data?.result ?? "").toUpperCase();
  return result === "OK" || Boolean(data?.id);
}

export default function CepClient({ html }: { html: string }) {
  useEffect(() => {
    const root = document.querySelector(".cep-page");
    if (!root) return undefined;

    const onFaqClick = (event: Event) => {
      const button = (event.target as HTMLElement).closest(".faq-q");
      if (!button || !root.contains(button)) return;
      const item = button.closest(".faq-item");
      const answer = item?.querySelector(".faq-a") as HTMLElement | null;
      if (!item || !answer) return;

      const isOpen = item.classList.contains("open");
      root.querySelectorAll(".faq-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
        const openAnswer = openItem.querySelector(".faq-a") as HTMLElement | null;
        if (openAnswer) openAnswer.style.maxHeight = "0";
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    };

    const onSubmit = async (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      const form = event.currentTarget as HTMLFormElement;
      const name = form.querySelector<HTMLInputElement>("#cep_efName");
      const phone = form.querySelector<HTMLInputElement>("#cep_efPhone");
      const email = form.querySelector<HTMLInputElement>("#cep_efEmail");
      const clinic = form.querySelector<HTMLInputElement>("#cep_efClinic");
      const interest = form.querySelector<HTMLSelectElement>("#cep_efInterest");
      const message = form.querySelector<HTMLTextAreaElement>("#cep_efMsg");
      const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      let valid = true;

      const setError = (input: HTMLElement | null, hasError: boolean) => {
        input?.closest(".ef-row")?.classList.toggle("has-error", hasError);
        if (hasError) valid = false;
      };

      const cleanPhone = (phone?.value || "").replace(/\D/g, "");
      setError(name, !name?.value.trim());
      setError(phone, !/^[6-9]\d{9}$/.test(cleanPhone));
      setError(
        email,
        Boolean(email?.value.trim()) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.value.trim() || ""),
      );

      if (!valid) return;

      const originalLabel = submitBtn?.textContent || "Send enquiry";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      const payload = new URLSearchParams();
      payload.set("method", "landing_page_enquiry");
      payload.set("name", name?.value.trim() || "");
      payload.set("phone", cleanPhone);
      payload.set("email", email?.value.trim() || "");
      payload.set("scan", interest?.value || "Chronic Endometritis Panel");
      payload.set(
        "message",
        [clinic?.value.trim() && `Clinic: ${clinic.value.trim()}`, message?.value.trim()]
          .filter(Boolean)
          .join("\n"),
      );
      payload.set("terms", "Yes");

      const host = window.location.hostname;
      const urls =
        host === "localhost" || host === "127.0.0.1"
          ? [LOCAL_ENQUIRY_URL, PHP_ENQUIRY_URL]
          : [PHP_ENQUIRY_URL, LOCAL_ENQUIRY_URL];

      try {
        let saved = false;
        let errorMsg = "Could not submit. Please try again.";

        for (const url of urls) {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json, text/plain, */*",
            },
            body: payload.toString(),
          });
          const data = parseJson(await res.text());
          if (isSuccess(data)) {
            saved = true;
            break;
          }
          if (data?.error_msg) errorMsg = data.error_msg;
        }

        if (saved) {
          form.classList.add("submitted");
        } else {
          toast.error(errorMsg);
        }
      } catch {
        toast.error("Could not submit. Please try again.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    };

    const onReset = () => {
      const form = document.getElementById("enquireForm") as HTMLFormElement | null;
      form?.classList.remove("submitted");
      form?.reset();
    };

    root.addEventListener("click", onFaqClick);
    const form = document.getElementById("enquireForm");
    const resetBtn = document.getElementById("cep_efReset");
    form?.addEventListener("submit", onSubmit);
    resetBtn?.addEventListener("click", onReset);

    return () => {
      root.removeEventListener("click", onFaqClick);
      form?.removeEventListener("submit", onSubmit);
      resetBtn?.removeEventListener("click", onReset);
    };
  }, [html]);

  return (
    <div className="cep-page bg-white min-h-screen" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
