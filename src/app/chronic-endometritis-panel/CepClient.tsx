"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import requests from "@/lib/httpServices";

const CEP_ENQUIRY_API = "/chronic-endometritis-panel/enquiry";

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

      const fd = new FormData();
      fd.append("name", name?.value.trim() || "");
      fd.append("phone", cleanPhone);
      fd.append("email", email?.value.trim() || "");
      fd.append("clinic", clinic?.value.trim() || "");
      fd.append("scan", interest?.value || "Chronic Endometritis Panel");
      fd.append("interest", interest?.value || "Chronic Endometritis Panel");
      fd.append("message", message?.value.trim() || "");
      fd.append("terms", "Yes");

      const restoreBtn = () => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      };

      try {
        const res = await fetch(CEP_ENQUIRY_API, {
          method: "POST",
          body: fd,
          credentials: "same-origin",
        });
        const data = await res.json().catch(() => null);
        if (String(data?.RESULT || "").toUpperCase() === "OK" || data?.id) {
          form.classList.add("submitted");
          restoreBtn();
          return;
        }

        const ajax = new FormData();
        ajax.append("method", "landing_page_enquiry");
        ajax.append("name", name?.value.trim() || "");
        ajax.append("phone", cleanPhone);
        ajax.append("email", email?.value.trim() || "");
        ajax.append("scan", interest?.value || "Chronic Endometritis Panel");
        ajax.append(
          "message",
          [clinic?.value.trim() && `Clinic: ${clinic.value.trim()}`, message?.value.trim()]
            .filter(Boolean)
            .join("\n"),
        );
        ajax.append("terms", "Yes");

        const php = await requests.post("/scripts/ajax/index.php", ajax);
        if (String(php?.RESULT || php?.result || "").toUpperCase() === "OK" || php?.id) {
          form.classList.add("submitted");
        } else {
          toast.error(php?.error_msg || data?.error_msg || "Could not submit. Please try again.");
        }
      } catch {
        toast.error("Could not submit. Please try again.");
      } finally {
        restoreBtn();
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
