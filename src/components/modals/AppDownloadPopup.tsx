"use client";

import { useEffect } from "react";
import styles from "./AppDownloadPopup.module.css";

const IOS_URL =
  "https://apps.apple.com/in/app/modern-diagnostic-health-app/id6504657715";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.mdrcindia.booking";

function Stars() {
  return (
    <span className={styles.mdrcStars} aria-label="4 out of 5 stars">
      <svg viewBox="0 0 24 24">
        <path d="M12 17.3l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.76L6.82 21z" />
      </svg>
      <svg viewBox="0 0 24 24">
        <path d="M12 17.3l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.76L6.82 21z" />
      </svg>
      <svg viewBox="0 0 24 24">
        <path d="M12 17.3l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.76L6.82 21z" />
      </svg>
      <svg viewBox="0 0 24 24">
        <path d="M12 17.3l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.76L6.82 21z" />
      </svg>
      <svg className={styles.mdrcStarEmpty} viewBox="0 0 24 24">
        <path d="M12 17.3l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.76L6.82 21z" />
      </svg>
      <span className={styles.mdrcRatingText}>4.0</span>
    </span>
  );
}

export default function AppDownloadPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.mdrcPopupOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mdrc-popup-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.mdrcPopup} role="document">
        <button
          type="button"
          className={styles.mdrcPopupClose}
          aria-label="Close popup"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"
              fill="currentColor"
            />
          </svg>
        </button>

        <img
          className={styles.mdrcPopupLogo}
          src="/assets/images/logo/mdrc-app-popup-logo.jpg"
          alt="Modern Diagnostic & Research Centre"
        />

        <h2 id="mdrc-popup-title" className={styles.mdrcPopupTitle}>
          Download Our App
        </h2>
        <p className={styles.mdrcPopupSubtitle}>
          Book <strong>Tests & Scans</strong> easily on the Modern Diagnostic
          Health App — faster booking, reports & updates at your fingertips.
        </p>

        <div className={styles.mdrcPopupStats} aria-label="Company highlights">
          <div className={styles.mdrcPopupStat}>
            <span className={styles.mdrcPopupStatValue}>41+ Years</span>
            <span className={styles.mdrcPopupStatLabel}>Expertise</span>
          </div>
          <div className={styles.mdrcPopupStat}>
            <span className={styles.mdrcPopupStatValue}>25+ Labs</span>
            <span className={styles.mdrcPopupStatLabel}>Across India</span>
          </div>
          <div className={styles.mdrcPopupStat}>
            <span className={styles.mdrcPopupStatValue}>1.5 Crore+</span>
            <span className={styles.mdrcPopupStatLabel}>
              Satisfied Customers
            </span>
          </div>
        </div>

        <div className={styles.mdrcPopupStores}>
          <a
            className={styles.mdrcStoreBtn}
            href={IOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download iOS app on the App Store — 4 star rating"
          >
            <svg
              className={styles.mdrcStoreIcon}
              viewBox="0 0 48 48"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="#111111"
                d="M33.6 24.7c0-4.3 3.5-6.4 3.7-6.5-2-2.9-5.1-3.3-6.2-3.3-2.6-.3-5.1 1.6-6.4 1.6-1.3 0-3.4-1.5-5.6-1.5-2.9.1-5.5 1.7-7 4.2-3 5.2-.8 12.8 2.1 17 1.4 2 3.1 4.3 5.3 4.2 2.1-.1 2.9-1.4 5.5-1.4s3.3 1.4 5.5 1.3c2.3-.1 3.7-2.1 5.1-4.1 1.6-2.3 2.2-4.6 2.3-4.7-.1 0-4.3-1.7-4.3-6.8z"
              />
              <path
                fill="#111111"
                d="M29.1 12.4c1.2-1.4 2-3.4 1.8-5.4-1.7.1-3.8 1.2-5 2.6-1.1 1.3-2.1 3.3-1.8 5.3 1.9.1 3.9-1 5-2.5z"
              />
            </svg>
            <span className={styles.mdrcStoreName}>iOS</span>
            <Stars />
            <span className={styles.mdrcStoreCta}>Download on App Store</span>
          </a>

          <a
            className={styles.mdrcStoreBtn}
            href={ANDROID_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download Android app on Google Play — 4 star rating"
          >
            <svg
              className={styles.mdrcStoreIcon}
              viewBox="0 0 48 48"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="#32BBFF"
                d="M7.3 4.2c-.5.3-.8.9-.8 1.6v36.4c0 .7.3 1.3.8 1.6l19.4-19.8L7.3 4.2z"
              />
              <path
                fill="#32BBFF"
                d="M30.2 27.1l-5.1-5.1 5.1-5.1 6.2 3.5c1.3.7 1.3 2.5 0 3.2l-6.2 3.5z"
              />
              <path
                fill="#29CC5E"
                d="M30.2 27.1L7.3 43.8c.6.4 1.4.4 2.1 0l20.8-11.8v-4.9z"
              />
              <path
                fill="#FFC400"
                d="M30.2 16.9L9.4 5.1c-.7-.4-1.5-.4-2.1 0l22.9 16.7v-4.9z"
              />
              <path fill="#F44336" d="M24.9 22 7.3 4.2l-.1.1L25.1 22.1 24.9 22z" />
            </svg>
            <span className={styles.mdrcStoreName}>Android</span>
            <Stars />
            <span className={styles.mdrcStoreCta}>Get it on Google Play</span>
          </a>
        </div>

        <p className={styles.mdrcPopupNote}>
          Modern Diagnostic &amp; Research Centre Ltd.
        </p>
      </div>
    </div>
  );
}
