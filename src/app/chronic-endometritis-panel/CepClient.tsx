"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import requests from "@/lib/httpServices";

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

      try {
        const formData = new FormData();
        formData.append("view", "test_booking_inquiry");
        formData.append("name", name?.value.trim() || "");
        formData.append("phone", cleanPhone);
        formData.append("city", clinic?.value.trim() || "Gurugram");
        formData.append("address", clinic?.value.trim() || "Gurugram");
        formData.append("enquiry_type", interest?.value || "Chronic Endometritis Panel");
        formData.append("test_type", "Chronic Endometritis Panel");
        if (email?.value.trim()) formData.append("email", email.value.trim());
        if (message?.value.trim()) formData.append("message", message.value.trim());

        const result = await requests.post("/webApi/index.php", formData);
        if (result?.msgCode === "1" || result === 0 || result?.RESULT === "OK") {
          form.classList.add("submitted");
        } else {
          toast.error(result?.message || "Could not submit. Please try again.");
        }
      } catch {
        toast.error("Failed to connect to the server.");
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
