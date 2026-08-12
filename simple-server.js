const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;
const referenceProductImage = '/Users/harshaweb/Downloads/untitled folder/WhatsApp Image 2026-08-11 at 13.52.04.jpeg';
const homeRechargeImage = '/Users/harshaweb/Downloads/tre-main/assets/home-recharge-preview.png';
const productCardImage = '/Users/harshaweb/Downloads/tre-main/assets/product-card-box.png';
const svipProductCardImage = '/Users/harshaweb/Downloads/tre-main/assets/svip-product-card-box.png';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Legacy - Local Demo</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #17202a;
      background: #f5f7fb;
    }
    button, input, select, textarea { font: inherit; }
    button { cursor: pointer; }
    .shell { min-height: 100vh; display: flex; flex-direction: column; }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      background: rgba(255,255,255,0.88);
      border-bottom: 1px solid rgba(207,216,229,0.72);
      box-shadow: 0 12px 34px rgba(22, 34, 51, 0.10);
      backdrop-filter: blur(16px);
    }
    .topbar:before {
      content: "";
      display: block;
      height: 3px;
      background: linear-gradient(90deg, #17a56b, #ff8908, #0d6efd);
    }
    .topbar-inner {
      max-width: 1180px;
      margin: 0 auto;
      padding: 10px 18px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 900; letter-spacing: 0; color: #0f172a; }
    .mark {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      color: #fff;
      background: linear-gradient(135deg, #101827, #17a56b 48%, #ff8908);
      font-weight: 900;
      box-shadow: 0 10px 24px rgba(23,165,107,0.32);
    }
    .brand-copy { display: grid; gap: 1px; }
    .brand-copy strong { font-size: 22px; line-height: 1; }
    .brand-copy small { color: #68788f; font-size: 11px; font-weight: 850; text-transform: uppercase; }
    .nav {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: flex-end;
      padding: 6px;
      border: 1px solid rgba(207,216,229,0.72);
      background: rgba(248,250,252,0.72);
      border-radius: 8px;
    }
    .nav button, .btn {
      border: 1px solid #cfd8e5;
      background: #fff;
      color: #223044;
      border-radius: 8px;
      min-height: 38px;
      padding: 8px 12px;
      font-weight: 750;
      transition: 0.18s ease;
    }
    .nav button {
      border: 0;
      background: transparent;
      color: #475569;
      min-height: 36px;
      padding: 8px 11px;
    }
    .nav button:hover, .btn:hover { border-color: #17a56b; color: #0f7d52; }
    .nav button:hover { background: #ffffff; box-shadow: 0 8px 18px rgba(22,34,51,0.08); }
    .nav button.active { background: #111827; color: #ffffff; box-shadow: 0 10px 24px rgba(17,24,39,0.22); }
    .btn.primary {
      background: #17a56b;
      border-color: #17a56b;
      color: #fff;
    }
    .btn.blue {
      background: #0d6efd;
      border-color: #0d6efd;
      color: #fff;
    }
    .btn.warn {
      background: #ff8908;
      border-color: #ff8908;
      color: #fff;
    }
    .btn.danger {
      background: #ef4444;
      border-color: #ef4444;
      color: #fff;
    }
    main { flex: 1; }
    .page {
      display: none;
      max-width: 1180px;
      margin: 0 auto;
      padding: 22px 18px 36px;
    }
    #home {
      max-width: none;
      width: 100%;
      padding: 0 0 36px;
    }
    .page.active { display: block; }
    .hero {
      min-height: calc(100vh - 78px);
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      align-items: center;
      gap: 26px;
      margin-top: 0;
      padding: clamp(24px, 4vw, 56px);
      border-radius: 0;
      background:
        radial-gradient(circle at 78% 18%, rgba(255,211,106,0.22), transparent 28%),
        radial-gradient(circle at 18% 82%, rgba(139,92,246,0.28), transparent 30%),
        linear-gradient(135deg, #16052a, #080213 58%, #1b0a2f);
      border: 1px solid rgba(189,140,255,0.46);
      box-shadow: 0 28px 70px rgba(59, 11, 103, 0.28);
      color: #fff;
      overflow: hidden;
      position: relative;
    }
    .hero:before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg, rgba(255,255,255,0.08), transparent 36%, rgba(255,211,106,0.08));
      pointer-events: none;
    }
    .hero > * { position: relative; z-index: 1; }
    .hero .badge {
      background: rgba(255,211,106,0.12);
      color: #ffd36a;
      border-color: rgba(255,211,106,0.48);
    }
    .hero h1 {
      font-size: clamp(42px, 6.6vw, 86px);
      line-height: 1;
      margin: 0 0 18px;
      letter-spacing: 0;
      color: #ffffff;
      text-shadow: 0 0 24px rgba(189,140,255,0.48);
    }
    .hero p { margin: 0 0 22px; color: #e7d3ff; font-size: 18px; max-width: 640px; }
    .hero .form-actions, .hero .strip { max-width: 760px; }
    .hero-panel {
      background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04));
      border: 1px solid rgba(189,140,255,0.42);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(8,2,19,0.46);
    }
    .hero-screen {
      min-height: min(680px, calc(100vh - 156px));
      padding: clamp(16px, 2vw, 26px);
      background:
        radial-gradient(circle at 80% 12%, rgba(255,211,106,0.22), transparent 30%),
        linear-gradient(180deg, rgba(139,92,246,0.30), transparent 42%),
        #10021f;
      color: #fff;
    }
    .home-svip-showcase {
      position: relative;
      min-height: clamp(280px, 34vh, 430px);
      border: 1px solid rgba(255,211,106,0.28);
      border-radius: 8px;
      overflow: hidden;
      margin: 12px 0 14px;
      background: #080213;
      box-shadow: 0 18px 44px rgba(0,0,0,0.34);
    }
    .home-svip-showcase img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(1.2) brightness(0.92) hue-rotate(16deg);
    }
    .home-svip-overlay {
      position: relative;
      z-index: 1;
      min-height: clamp(280px, 34vh, 430px);
      display: grid;
      align-content: end;
      justify-items: center;
      text-align: center;
      padding: 95px 16px 16px;
      background: linear-gradient(180deg, transparent, rgba(22,2,46,0.76) 48%, rgba(8,2,19,0.98));
    }
    .home-svip-overlay span { color: #ffd36a; font-size: 12px; font-weight: 950; }
    .home-svip-overlay strong {
      color: #fff;
      font-size: 32px;
      text-shadow: 0 0 18px rgba(189,140,255,0.8), 0 2px 14px rgba(0,0,0,0.8);
    }
    .home-svip-summary {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 12px;
      align-items: center;
      margin-top: -18px;
      padding: 12px;
      border: 1px solid rgba(255,211,106,0.34);
      border-radius: 8px;
      background: linear-gradient(135deg, #18032f, #2a0751);
      position: relative;
      z-index: 2;
    }
    .home-svip-badge {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: #260848;
      border: 3px solid #ffd36a;
      color: #fff;
      font-weight: 950;
      box-shadow: 0 0 18px rgba(255,211,106,0.62);
    }
    .home-svip-summary strong { color: #ffd36a; display: block; }
    .home-svip-summary small { color: #e7d3ff; font-weight: 850; }
    .miner-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 18px; }
    .miner-card {
      border: 1px solid rgba(255,211,106,0.22);
      background: rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 14px;
    }
    .metric { color: #ffd36a; font-size: 26px; font-weight: 900; margin-top: 8px; }
    .strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 22px;
    }
    .strip > div, .card {
      background: #ffffff;
      border: 1px solid #d9e0ea;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 6px 20px rgba(22, 34, 51, 0.05);
    }
    .hero .strip > div {
      background: linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.06));
      border-color: rgba(255,211,106,0.24);
      box-shadow: 0 12px 28px rgba(8,2,19,0.24);
    }
    .hero .strip .label { color: #e7d3ff; }
    .hero .strip .value { color: #ffd36a; }
    .detail-band {
      margin: 10px 0 24px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    .detail-card {
      background: #ffffff;
      border: 1px solid #d9e0ea;
      border-radius: 8px;
      padding: 18px;
      box-shadow: 0 8px 24px rgba(22, 34, 51, 0.06);
      display: grid;
      gap: 10px;
    }
    .detail-card h3 { margin: 0; }
    .detail-card p { margin: 0; color: #526176; line-height: 1.55; }
    .check-list { list-style: none; margin: 4px 0 0; padding: 0; display: grid; gap: 8px; color: #35465f; }
    .check-list li { display: flex; gap: 8px; align-items: flex-start; }
    .check-list li:before {
      content: "✓";
      flex: 0 0 20px;
      height: 20px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #e8f8f0;
      color: #0f7d52;
      font-size: 12px;
      font-weight: 950;
    }
    .timeline {
      margin: 16px 0 24px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      padding: 14px;
      border: 1px solid rgba(189, 140, 255, 0.28);
      border-radius: 8px;
      background: radial-gradient(circle at 14% 18%, rgba(255, 211, 106, 0.16), transparent 24%), linear-gradient(135deg, #130620, #07111a 62%, #0b2c27);
      box-shadow: 0 22px 58px rgba(7, 17, 26, 0.18);
    }
    .step {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.05));
      border: 1px solid rgba(255, 211, 106, 0.18);
      border-radius: 8px;
      padding: 16px;
      position: relative;
      overflow: hidden;
      min-height: 178px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 14px 32px rgba(0, 0, 0, 0.18);
    }
    .step:before {
      content: "";
      position: absolute;
      inset: 0 0 auto;
      height: 4px;
      background: linear-gradient(90deg, #ffd36a, #8ff0bf);
    }
    .step-number {
      width: 42px;
      height: 42px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background: radial-gradient(circle at 35% 25%, #fff6cf, #ffd36a 44%, #b47a14);
      color: #17022e;
      font-weight: 950;
      margin-bottom: 14px;
      box-shadow: 0 10px 24px rgba(255, 211, 106, 0.22);
    }
    .step strong { display: block; margin-bottom: 6px; color: #ffffff; font-size: 18px; }
    .step span { color: #d6f7e7; line-height: 1.48; }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin: 14px 0 24px;
    }
    .info-card {
      background: #ffffff;
      border: 1px solid #d9e0ea;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 8px 24px rgba(22, 34, 51, 0.06);
    }
    .info-card strong { display: block; margin-bottom: 8px; }
    .info-card span { color: #526176; line-height: 1.5; }
    .home-wide {
      background: radial-gradient(circle at 88% 18%, rgba(255, 211, 106, 0.18), transparent 28%), linear-gradient(135deg, #12051f, #07111a 58%, #0e2d2a);
      border: 1px solid rgba(143, 240, 191, 0.24);
      border-radius: 8px;
      padding: 18px;
      box-shadow: 0 22px 58px rgba(7, 17, 26, 0.24);
      margin: 14px 0 24px;
      color: #ffffff;
      overflow: hidden;
      position: relative;
    }
    .home-wide h3 { margin: 0 0 8px; color: #ffffff; }
    .home-wide p { margin: 0; color: #d6f7e7; line-height: 1.6; }
    .wallet-support-layout {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 18px;
      align-items: stretch;
    }
    .support-kicker {
      display: inline-flex;
      width: fit-content;
      border: 1px solid rgba(255, 211, 106, 0.34);
      border-radius: 999px;
      padding: 6px 10px;
      margin-bottom: 10px;
      background: rgba(255, 211, 106, 0.1);
      color: #ffd36a;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0;
    }
    .support-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
    }
    .stat-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 0;
    }
    .stat-list div {
      border: 1px solid rgba(143, 240, 191, 0.2);
      border-radius: 8px;
      padding: 13px;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    .stat-list .label { color: #9ff0c3; }
    .stat-list .value { color: #ffffff; font-size: 20px; }
    .payment-flow {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 14px;
    }
    .payment-flow span {
      border: 1px solid rgba(255, 211, 106, 0.2);
      border-radius: 8px;
      padding: 10px 12px;
      background: rgba(255, 211, 106, 0.08);
      color: #fff6cf;
      font-weight: 850;
      text-align: center;
    }
    .contact-footer {
      background: #111827;
      color: #ffffff;
      border-radius: 8px;
      padding: 14px;
      margin: 16px 0 0;
      box-shadow: 0 18px 45px rgba(17, 24, 39, 0.2);
      display: grid;
      grid-template-columns: minmax(220px, 300px) 1fr;
      gap: 12px;
      align-items: start;
    }
    .contact-footer h2 { margin: 0 0 6px; color: #ffffff; }
    .contact-footer p { margin: 0; color: #cbd5e1; line-height: 1.45; }
    .contact-copy {
      display: grid;
      gap: 10px;
      align-content: start;
    }
    .contact-visual {
      border: 1px solid rgba(143, 240, 191, 0.26);
      border-radius: 8px;
      padding: 8px;
      background: linear-gradient(135deg, rgba(20, 184, 166, 0.16), rgba(15, 23, 42, 0.74));
      box-shadow: 0 18px 42px rgba(20, 184, 166, 0.14);
    }
    .contact-visual img {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 5;
      max-height: 240px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid rgba(143, 240, 191, 0.22);
      background: #07111a;
      filter: saturate(1.14) brightness(0.98) hue-rotate(0deg);
    }
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      grid-column: 1 / -1;
    }
    .contact-card {
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 11px;
    }
    .contact-card .label { color: #93c5fd; }
    .contact-card strong { display: block; margin: 6px 0; color: #ffffff; }
    .contact-card span { color: #cbd5e1; line-height: 1.45; }
    .auth-popup {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
      place-items: center;
      padding: 18px;
      background: rgba(7, 17, 26, 0.72);
      backdrop-filter: blur(8px);
    }
    .auth-popup.active { display: grid; }
    .auth-dialog {
      width: min(430px, 100%);
      border: 1px solid rgba(255, 211, 106, 0.28);
      border-radius: 8px;
      padding: 18px;
      background: radial-gradient(circle at 86% 12%, rgba(255, 211, 106, 0.18), transparent 30%), linear-gradient(135deg, #17022e, #07111a 62%, #0e2d2a);
      color: #ffffff;
      box-shadow: 0 28px 70px rgba(0, 0, 0, 0.36);
    }
    .auth-dialog h2 { margin: 0 0 8px; color: #ffffff; }
    .auth-dialog p { margin: 0; color: #d6f7e7; line-height: 1.5; }
    .auth-dialog-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 14px;
    }
    .auth-close {
      width: 36px;
      height: 36px;
      padding: 0;
      border-radius: 8px;
      display: grid;
      place-items: center;
    }
    .auth-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 16px;
    }
    .auth-option {
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 8px;
      padding: 14px;
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      text-align: left;
      cursor: pointer;
    }
    .auth-option strong { display: block; margin-bottom: 6px; color: #ffd36a; }
    .auth-option span { color: #d6f7e7; line-height: 1.4; }
    .label { color: #68788f; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0; }
    .value { font-size: 24px; font-weight: 900; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .grid.two { grid-template-columns: repeat(2, 1fr); }
    .section-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 12px;
      margin: 18px 0 14px;
    }
    h2 { margin: 0; font-size: 28px; }
    h3 { margin: 0 0 10px; }
    .muted { color: #68788f; }
    .form {
      max-width: 450px;
      margin: 24px auto;
      background: #fff;
      border: 1px solid #d9e0ea;
      border-radius: 8px;
      padding: 18px;
      box-shadow: 0 10px 30px rgba(22, 34, 51, 0.08);
    }
    .field { display: grid; gap: 6px; margin: 12px 0; }
    .field label { font-size: 13px; font-weight: 800; color: #35465f; }
    .field input, .field select, .field textarea {
      width: 100%;
      border: 1px solid #cfd8e5;
      border-radius: 8px;
      padding: 11px 12px;
      min-height: 42px;
      background: #fff;
    }
    .field textarea { min-height: 90px; resize: vertical; }
    .password-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8px;
      align-items: center;
    }
    .password-row .btn {
      min-height: 42px;
      padding: 8px 12px;
      white-space: nowrap;
    }
    .form-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
    .payment-options {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin: 12px 0;
    }
    .payment-option {
      border: 1px solid #d9e0ea;
      border-radius: 8px;
      background: #fff;
      padding: 12px;
      min-height: 92px;
      display: grid;
      gap: 5px;
      cursor: pointer;
    }
    .payment-option strong { display: block; }
    .payment-option span { color: #526176; font-size: 13px; line-height: 1.35; }
    .payment-option.active { border-color: #17a56b; background: #f0fbf6; }
    .payment-option:focus-visible { outline: 3px solid rgba(23,165,107,0.24); outline-offset: 2px; }
    .plan-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      margin: 8px 0 18px;
      background: #fff;
      border: 1px solid #ecedf2;
      border-radius: 8px;
      box-shadow: 0 8px 28px rgba(22, 34, 51, 0.08);
      overflow: hidden;
    }
    .plan-action {
      min-height: 92px;
      display: grid;
      place-items: center;
      gap: 7px;
      border: 0;
      border-right: 1px solid #ecedf2;
      background: #fff;
      color: #111827;
      font-weight: 850;
    }
    .plan-action:last-child { border-right: 0; }
    .action-icon {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      color: #ff8908;
      font-size: 30px;
      line-height: 1;
    }
    .plan-filter {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 10px 0 16px;
      background: #fff;
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 8px 28px rgba(22, 34, 51, 0.07);
    }
    .plan-filter button { border: 0; min-height: 56px; color: #8a8f9a; font-size: 18px; }
    .plan-filter button.active {
      background: #ff8908;
      border-color: #ff8908;
      color: #fff;
    }
    .featured-plan {
      background: #fff;
      border: 1px solid #eef0f4;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 22px;
      box-shadow: 0 10px 30px rgba(22, 34, 51, 0.08);
    }
    .featured-art {
      min-height: 330px;
      padding: 34px 34px 24px;
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 20px;
      align-items: center;
      color: #fff;
      background:
        radial-gradient(circle at 78% 72%, rgba(174, 61, 255, 0.55), transparent 20%),
        radial-gradient(circle at 62% 35%, rgba(255, 255, 255, 0.25), transparent 6%),
        linear-gradient(135deg, #06041c 0%, #180736 52%, #07031a 100%);
      position: relative;
      overflow: hidden;
    }
    .featured-art:after {
      content: "";
      position: absolute;
      inset: auto 2% -28% 38%;
      height: 210px;
      border-radius: 50%;
      border: 3px solid rgba(171, 85, 255, 0.65);
      box-shadow: 0 0 34px rgba(171, 85, 255, 0.85);
      transform: rotate(-3deg);
    }
    .featured-copy { position: relative; z-index: 2; }
    .crown { color: #ffd36a; font-size: 42px; line-height: 1; margin-bottom: 6px; }
    .featured-copy h3 { font-size: 46px; color: #ffd36a; margin: 0 0 8px; }
    .benefits { display: grid; gap: 8px; padding: 0; margin: 14px 0 0; list-style: none; }
    .benefits li:before { content: "✓"; color: #1e1f2c; background: #ffd36a; border-radius: 50%; padding: 0 5px; margin-right: 8px; font-weight: 950; }
    .featured-boxes {
      position: relative;
      z-index: 2;
      min-height: 238px;
      display: flex;
      align-items: end;
      justify-content: center;
      gap: 24px;
    }
    .package {
      width: 118px;
      height: 190px;
      border-radius: 4px;
      display: grid;
      align-content: center;
      justify-items: center;
      padding: 14px 10px;
      color: #f8d879;
      background: linear-gradient(160deg, #21104d 0%, #070317 58%, #ba8b2d 59%, #f7d16b 100%);
      box-shadow: 18px 18px 35px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.22);
      position: relative;
    }
    .package.small { width: 92px; height: 142px; }
    .package.vip1 { color: #e7f5ff; background: linear-gradient(160deg, #0758c9 0%, #052848 58%, #0ca6a9 59%, #a9f5ff 100%); }
    .package.vip2 { color: #e4fffb; background: linear-gradient(160deg, #088488 0%, #063b42 58%, #b88627 59%, #f8d06d 100%); }
    .package.vip3 { color: #1e293b; background: linear-gradient(160deg, #f7f7f7 0%, #aeb6c2 58%, #e5e7eb 59%, #f8fafc 100%); }
    .package.svip1 { color: #f8d879; background: linear-gradient(160deg, #21104d 0%, #070317 58%, #ba8b2d 59%, #f7d16b 100%); }
    .package.svip2 { color: #f8d879; background: linear-gradient(160deg, #171717 0%, #020202 58%, #b8872c 59%, #f4cf67 100%); }
    .package.svip3 { color: #1f1605; background: linear-gradient(160deg, #89611d 0%, #f2ce65 58%, #2d1b05 59%, #070502 100%); }
    .package.svip4 { color: #f8d879; background: linear-gradient(160deg, #42136e 0%, #160326 58%, #6d28d9 59%, #c084fc 100%); }
    .package.svip5 { color: #f8d879; background: linear-gradient(160deg, #111111 0%, #020202 58%, #5b3812 59%, #d6a63b 100%); }
    .package.svip6 { color: #1f1605; background: linear-gradient(160deg, #b47712 0%, #f8d56b 58%, #7c4a08 59%, #fff3b0 100%); }
    .package.svip7 { color: #dff7ff; background: linear-gradient(160deg, #053b96 0%, #031a47 58%, #075bd8 59%, #38bdf8 100%); }
    .package.svip8 { color: #ffe8e8; background: linear-gradient(160deg, #8b0f0f 0%, #320202 58%, #b91c1c 59%, #f87171 100%); }
    .package.svip9 { color: #eaffea; background: linear-gradient(160deg, #14532d 0%, #052e16 58%, #15803d 59%, #86efac 100%); }
    .package.svip10 { color: #1e293b; background: linear-gradient(160deg, #f1f5f9 0%, #b9c1cc 58%, #64748b 59%, #ffffff 100%); }
    .package:before {
      content: "";
      position: absolute;
      top: 28px;
      left: 0;
      right: 0;
      height: 8px;
      background: rgba(255,255,255,0.5);
      box-shadow: 0 0 15px rgba(255,255,255,0.8);
    }
    .package .mini-crown { font-size: 26px; }
    .package .pack-brand { font-size: 11px; color: currentColor; font-weight: 800; margin-top: 5px; }
    .package .pack-name { font-size: 25px; font-weight: 950; margin-top: 8px; color: currentColor; }
    .package.small .pack-name { font-size: 16px; }
    .diamond {
      width: 30px;
      height: 30px;
      margin-top: 12px;
      transform: rotate(45deg);
      background: linear-gradient(135deg, #a855f7, #fff, #6d28d9);
      box-shadow: 0 0 20px rgba(168,85,247,0.8);
    }
    .featured-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      text-align: center;
      padding: 20px 8px;
      border-bottom: 1px solid #edf0f5;
    }
    .featured-stats > div { border-right: 1px solid #edf0f5; }
    .featured-stats > div:last-child { border-right: 0; }
    .featured-stats strong { display: block; font-size: 24px; margin-top: 6px; }
    .featured-buy {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 28px 24px;
    }
    .featured-buy .amount { font-size: 32px; font-weight: 950; }
    .same-products {
      margin: -4px 0 22px;
      border-radius: 8px;
      overflow: hidden;
      min-height: 190px;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      align-items: end;
      gap: 10px;
      padding: 24px 18px 12px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2)),
        linear-gradient(135deg, #376b3a 0%, #f7c76b 50%, #315f33 100%);
      box-shadow: 0 10px 30px rgba(22, 34, 51, 0.1);
    }
    .gallery-item { display: grid; justify-items: center; gap: 6px; min-width: 0; }
    .product-caption {
      color: #fff;
      text-shadow: 0 1px 3px rgba(0,0,0,0.45);
      text-align: center;
      font-weight: 900;
    }
    .reference-products {
      margin: 0 0 22px;
      background: #fff;
      border: 1px solid #eef0f4;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 10px 30px rgba(22, 34, 51, 0.08);
    }
    .reference-products img {
      display: block;
      width: 100%;
      max-height: 720px;
      object-fit: contain;
      border-radius: 8px;
      background: #f8fafc;
    }
    .home-image-caption {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      padding: 12px 6px 2px;
    }
    .home-image-caption p { margin: 4px 0 0; }
    #home .reference-products {
      margin: 26px clamp(14px, 3vw, 42px) 28px;
      background: linear-gradient(135deg, #17022e, #080213);
      border-color: rgba(189,140,255,0.42);
      box-shadow: 0 22px 58px rgba(111,28,191,0.24);
    }
    #home .reference-products img {
      aspect-ratio: 16 / 7;
      max-height: 760px;
      object-fit: cover;
      background: #0b0414;
      border: 1px solid rgba(255,211,106,0.16);
      filter: saturate(1.2) brightness(0.94) hue-rotate(16deg);
    }
    #home .home-image-caption .label { color: #ffd36a; }
    #home .home-image-caption .muted { color: #e7d3ff; }
    #home .detail-card, #home .info-card {
      background: linear-gradient(180deg, #ffffff, #fbf7ff);
      border-color: rgba(189,140,255,0.28);
      box-shadow: 0 14px 34px rgba(111,28,191,0.10);
    }
    #home .detail-card h3, #home .info-card strong { color: #2a0751; }
    #home > .section-head, #home > .detail-band, #home > .timeline, #home > .info-grid, #home > .home-wide, #home > .contact-footer, #home > h2, #home > p, #home > .feature-row {
      margin-left: clamp(14px, 3vw, 42px);
      margin-right: clamp(14px, 3vw, 42px);
    }
    .plan {
      display: grid;
      gap: 10px;
      background: linear-gradient(180deg, #fff, #f7fbff);
    }
    .plan.svip {
      background: linear-gradient(180deg, #1a0530, #080213);
      border-color: #bd8cff;
      color: #fff;
      box-shadow: 0 22px 58px rgba(111,28,191,0.34), 0 0 0 1px rgba(255,211,106,0.2);
    }
    .plan.svip .product-box { border: 1px solid rgba(189,140,255,0.62); box-shadow: inset 0 -90px 120px rgba(80, 20, 140, 0.45); }
    .plan.svip .product-overlay { background: linear-gradient(180deg, transparent, rgba(31,5,59,0.82) 52%, rgba(8,2,19,0.98)); padding-top: 92px; }
    .plan.svip .product-overlay span { color: #ffd36a; }
    .plan.svip .product-overlay strong { text-shadow: 0 0 18px rgba(189,140,255,0.8), 0 2px 14px rgba(0,0,0,0.8); }
    .plan.svip .plan-title h3, .plan.svip .value { color: #fff; }
    .plan.svip .row { border-bottom-color: rgba(255,255,255,0.16); }
    .plan.svip .row span { color: #d9c8ef; }
    .plan.svip .badge { background: #2a0751; color: #ffd36a; }
    .product-box {
      min-height: 220px;
      border-radius: 8px;
      color: #fff;
      display: grid;
      align-items: end;
      position: relative;
      overflow: hidden;
      background: #07120d;
    }
    .product-box img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .product-color-0 img { filter: hue-rotate(0deg) saturate(1.08); }
    .product-color-1 img { filter: hue-rotate(42deg) saturate(1.18); }
    .product-color-2 img { filter: hue-rotate(86deg) saturate(1.2); }
    .product-color-3 img { filter: hue-rotate(138deg) saturate(1.18); }
    .product-color-4 img { filter: hue-rotate(184deg) saturate(1.2); }
    .product-color-5 img { filter: hue-rotate(228deg) saturate(1.18); }
    .product-color-6 img { filter: hue-rotate(274deg) saturate(1.15); }
    .product-color-7 img { filter: hue-rotate(316deg) saturate(1.18); }
    .product-color-8 img { filter: hue-rotate(24deg) saturate(1.28) brightness(1.08); }
    .product-color-9 img { filter: hue-rotate(110deg) saturate(1.3) brightness(1.06); }
    .product-color-10 img { filter: hue-rotate(205deg) saturate(1.26) brightness(1.05); }
    .product-color-11 img { filter: hue-rotate(292deg) saturate(1.24) brightness(1.06); }
    .svip-color-0 img { filter: hue-rotate(0deg) saturate(1.16) brightness(1.04); }
    .svip-color-1 img { filter: hue-rotate(32deg) saturate(1.24) brightness(1.08); }
    .svip-color-2 img { filter: hue-rotate(74deg) saturate(1.25) brightness(1.06); }
    .svip-color-3 img { filter: hue-rotate(126deg) saturate(1.22) brightness(1.08); }
    .svip-color-4 img { filter: hue-rotate(182deg) saturate(1.22) brightness(1.06); }
    .svip-color-5 img { filter: hue-rotate(246deg) saturate(1.2) brightness(1.08); }
    .product-overlay {
      position: relative;
      z-index: 1;
      width: 100%;
      padding: 80px 14px 15px;
      text-align: center;
      background: linear-gradient(180deg, transparent, rgba(3,9,7,0.88) 64%, rgba(3,9,7,0.96));
    }
    .product-overlay span { color: #f7d66f; font-size: 12px; font-weight: 900; }
    .product-overlay strong { display: block; color: #fff; font-size: 28px; margin-top: 4px; text-shadow: 0 2px 12px rgba(0,0,0,0.7); }
    .product-name { position: relative; z-index: 1; font-size: 24px; font-weight: 950; }
    .product-sub { position: relative; z-index: 1; color: rgba(255,255,255,0.8); font-weight: 800; }
    .plan-title { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 4px 9px;
      background: #e8f8f0;
      color: #0f7d52;
      font-size: 12px;
      font-weight: 900;
    }
    .rows { display: grid; gap: 8px; margin: 8px 0; }
    .row { display: flex; justify-content: space-between; gap: 10px; border-bottom: 1px solid #eef2f7; padding-bottom: 7px; }
    .row strong { text-align: right; }
    .toast {
      position: fixed;
      top: 76px;
      right: 18px;
      z-index: 50;
      background: #17202a;
      color: #fff;
      border-radius: 8px;
      padding: 12px 14px;
      max-width: 360px;
      display: none;
      box-shadow: 0 14px 34px rgba(0,0,0,0.25);
    }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; }
    th, td { padding: 11px; border-bottom: 1px solid #eef2f7; text-align: left; }
    th { background: #f8fafc; color: #526176; font-size: 12px; text-transform: uppercase; letter-spacing: 0; }
    .notice {
      padding: 12px;
      border: 1px solid #b7e5cf;
      background: #f0fbf6;
      color: #145c41;
      border-radius: 8px;
      margin: 14px 0;
    }
    .admin-panel { max-width: 1180px; margin: 0 auto; }
    .admin-tools { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }
    .admin-table { max-height: 340px; overflow: auto; border: 1px solid #eef2f7; border-radius: 8px; }
    .qr-preview {
      width: 220px;
      max-width: 100%;
      aspect-ratio: 1;
      border: 1px dashed #cfd8e5;
      border-radius: 8px;
      display: grid;
      place-items: center;
      overflow: hidden;
      background: #f8fafc;
      color: #68788f;
      font-weight: 850;
      text-align: center;
      padding: 12px;
    }
    .qr-preview img { width: 100%; height: 100%; object-fit: contain; }
    @media (max-width: 820px) {
      .hero { grid-template-columns: 1fr; min-height: auto; }
      .strip, .grid, .grid.two, .detail-band, .timeline, .info-grid, .stat-list, .payment-options, .contact-grid, .wallet-support-layout, .payment-flow { grid-template-columns: 1fr; }
      .topbar-inner { align-items: flex-start; flex-wrap: wrap; }
      .nav { gap: 6px; }
      .nav button { padding: 7px 9px; font-size: 13px; }
      .hero-screen { min-height: 330px; }
      .plan-actions { grid-template-columns: repeat(4, 1fr); }
      .plan-action { min-height: 78px; font-size: 13px; }
      .plan-filter button { min-height: 48px; font-size: 15px; }
      .featured-art { grid-template-columns: 1fr; min-height: 360px; padding: 24px; }
      .featured-copy h3 { font-size: 36px; }
      .featured-boxes { min-height: 170px; gap: 14px; }
      .package { width: 86px; height: 138px; }
      .package .pack-name { font-size: 17px; }
      .package.small { width: 68px; height: 106px; }
      .featured-stats strong { font-size: 19px; }
      .featured-buy { padding: 14px 16px 18px; }
      .featured-buy .amount { font-size: 26px; }
      .same-products { grid-template-columns: repeat(3, 1fr); }
    }
    @media (min-width: 821px) and (max-width: 1024px) {
      .hero { grid-template-columns: 1fr; min-height: auto; }
      .grid, .detail-band, .timeline, .info-grid, .payment-options, .contact-grid { grid-template-columns: repeat(2, 1fr); }
      .grid.two { grid-template-columns: repeat(2, 1fr); }
      .topbar-inner { align-items: flex-start; flex-wrap: wrap; }
      .nav { max-width: 100%; overflow-x: auto; padding-bottom: 2px; }
      .product-box { min-height: 220px; }
      .reference-products img { max-height: 520px; }
    }
    @media (max-width: 640px) {
      body { font-size: 15px; }
      .topbar-inner { display: grid; grid-template-columns: 1fr; padding: 10px 12px; }
      .brand-copy strong { font-size: 20px; }
      .brand-copy small { display: none; }
      .mark { width: 32px; height: 32px; }
      .nav { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width: 100%; gap: 7px; overflow: visible; padding: 6px; }
      .nav button, .btn { min-height: 40px; padding: 8px 9px; font-size: 14px; white-space: normal; }
      .page { padding: 14px 12px 28px; }
      #home { padding: 0 0 28px; }
      .hero { padding: 18px; gap: 14px; min-height: auto; }
      .hero h1 { font-size: 34px; line-height: 1.04; }
      .hero p { font-size: 16px; line-height: 1.55; }
      .form-actions { display: grid; grid-template-columns: 1fr; }
      .form-actions .btn, .form-actions button { width: 100%; }
      .strip, .miner-grid, .grid, .grid.two, .detail-band, .timeline, .info-grid, .stat-list, .payment-options, .home-plans, .contact-grid, .wallet-support-layout, .payment-flow, .auth-options { grid-template-columns: 1fr; }
      .contact-footer { grid-template-columns: 1fr; padding: 12px; }
      .contact-grid { grid-column: auto; }
      .contact-visual img { aspect-ratio: 16 / 6; max-height: 220px; }
      .plan-actions { grid-template-columns: repeat(2, 1fr); }
      .plan-action { min-height: 58px; }
      .plan-filter { grid-template-columns: 1fr; }
      .featured-plan, .reference-products, .card, .form { padding: 12px; }
      .featured-copy h3 { font-size: 32px; }
      .product-box { min-height: 220px; }
      .product-overlay, .plan.svip .product-overlay { padding-top: 82px; }
      .product-overlay strong { font-size: 26px; }
      .plan-title { align-items: flex-start; }
      .value { font-size: 22px; }
      table { min-width: 680px; }
      .admin-table, .table-wrap, div[style*="overflow:auto"] { overflow-x: auto; }
      .toast { left: 12px; right: 12px; top: auto; bottom: 14px; max-width: none; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand" onclick="go('home')" role="button" tabindex="0"><div class="mark">L</div><div class="brand-copy"><strong>Legacy</strong><small>Premium VIP Platform</small></div></div>
        <nav class="nav" id="nav"></nav>
      </div>
    </header>

    <main>
      <section class="page active" id="home">
        <div class="hero">
          <div>
            <span class="badge">SVIP-style wallet, plans and income system</span>
            <h1>Legacy premium VIP and SVIP income platform.</h1>
            <p>Register with a referral code, recharge your wallet, choose premium products, track rewards, and manage support from one polished dashboard.</p>
            <div class="form-actions">
              <button class="btn primary" onclick="openAuthPopup()">Create Account</button>
              <button class="btn" onclick="openAuthPopup()">Login</button>
              <button class="btn blue" onclick="go('plans')">View Plans</button>
            </div>
            <div class="strip">
              <div><div class="label">Members</div><div class="value" id="statUsers">0</div></div>
              <div><div class="label">Demo Paid</div><div class="value" id="statPaid">₹0</div></div>
              <div><div class="label">Plans</div><div class="value">19</div></div>
              <div><div class="label">Referral</div><div class="value">3 Lv</div></div>
            </div>
          </div>
          <div class="hero-panel">
            <div class="hero-screen">
              <div class="label" style="color:#9dd7bd">Live account preview</div>
              <h2 style="margin-top:6px">Dashboard</h2>
              <div class="home-svip-showcase">
                <img src="/assets/svip-product-card-box.png" alt="SVIP premium product image">
                <div class="home-svip-overlay"><span>SVIP PRODUCT</span><strong>LEGACY SVIP</strong><span>PREMIUM PLAN</span></div>
              </div>
              <div class="home-svip-summary">
                <div class="home-svip-badge">S</div>
                <div><small>Daily income up to</small><strong>₹800 / Day</strong></div>
              </div>
              <div class="miner-grid">
                <div class="miner-card"><div class="label" style="color:#aeb8ca">Balance</div><div class="metric" id="heroBalance">₹0</div></div>
                <div class="miner-card"><div class="label" style="color:#aeb8ca">Today Income</div><div class="metric" id="heroIncome">₹0</div></div>
                <div class="miner-card"><div class="label" style="color:#aeb8ca">Active Plan</div><div class="metric" id="heroPlan">None</div></div>
                <div class="miner-card"><div class="label" style="color:#aeb8ca">Referral Code</div><div class="metric" id="heroRef">----</div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="reference-products">
          <img src="/assets/svip-product-card-box.png" alt="SVIP premium product image">
          <div class="home-image-caption">
            <div><div class="label">Recharge & Wallet Preview</div><p class="muted">A different home visual focused on QR, UPI, bank, USDT, wallet balance, and premium account features.</p></div>
            <button class="btn warn" onclick="go('recharge')">Recharge</button>
          </div>
        </div>
        <div class="section-head">
          <div><h2>Everything included</h2><p class="muted">A clearer overview of what visitors can do after opening the app.</p></div>
        </div>
        <div class="detail-band">
          <div class="detail-card">
            <h3>Member Wallet</h3>
            <p>Users can create an account, recharge with the current payment detail, receive a UTR reference, and see balance changes in the dashboard.</p>
            <ul class="check-list"><li>Recharge history</li><li>Withdrawal requests</li><li>Income and bonus totals</li></ul>
          </div>
          <div class="detail-card">
            <h3>VIP Products</h3>
            <p>The plans page separates VIP and SVIP products so visitors can compare investment amount, daily income, total income, validity, and slots.</p>
            <ul class="check-list"><li>VIP and SVIP filters</li><li>Featured product preview</li><li>One-click plan purchase</li></ul>
          </div>
          <div class="detail-card">
            <h3>Admin Control</h3>
            <p>The admin panel keeps the demo manageable with product editing, QR uploads, user balances, payment complaints, and support messages.</p>
            <ul class="check-list"><li>Edit plans anytime</li><li>Approve transactions</li><li>Review complaints</li></ul>
          </div>
        </div>
        <div class="section-head">
          <div><h2>How it works</h2><p class="muted">A simple end-to-end flow for new users.</p></div>
        </div>
        <div class="timeline">
          <div class="step"><div class="step-number">1</div><strong>Register</strong><span>Create a member account with mobile number, password, and optional invite code.</span></div>
          <div class="step"><div class="step-number">2</div><strong>Recharge</strong><span>Add wallet balance using UPI, bank transfer, or USDT and keep the generated UTR.</span></div>
          <div class="step"><div class="step-number">3</div><strong>Choose Plan</strong><span>Compare VIP and SVIP products, then activate the plan that matches the wallet balance.</span></div>
          <div class="step"><div class="step-number">4</div><strong>Track Growth</strong><span>Use dashboard, referral team, support, and complaint tools to manage the account.</span></div>
        </div>
        <div class="section-head">
          <div><h2>Plan details</h2><p class="muted">Quick information users look for before selecting a product.</p></div>
        </div>
        <div class="info-grid">
          <div class="info-card"><strong>VIP Entry Plans</strong><span>Lower price options help new members test the wallet, recharge, and daily income flow before upgrading.</span></div>
          <div class="info-card"><strong>SVIP Premium Plans</strong><span>Higher-tier products show larger daily income, longer tracking value, and limited slot availability.</span></div>
          <div class="info-card"><strong>Daily Income View</strong><span>Each product displays daily income, total return, validity days, plan price, and slot count together.</span></div>
          <div class="info-card"><strong>Recharge First</strong><span>Users add balance, keep the UTR reference, and then buy a product from the available wallet amount.</span></div>
        </div>
        <div class="home-wide">
          <div class="wallet-support-layout">
            <div>
              <span class="support-kicker">Secure payment workflow</span>
              <h3>Wallet, payments, and support</h3>
              <p>The home page now explains the full member journey: register, recharge with current QR or payment details, save the UTR, activate a plan, request withdrawal, raise payment complaints, and contact support when something needs review.</p>
              <div class="support-actions">
                <button class="btn warn" onclick="go('recharge')">Recharge Now</button>
                <button class="btn primary" onclick="go('complaint')">Track UTR</button>
                <button class="btn" onclick="go('support')">Support</button>
              </div>
            </div>
            <div class="stat-list">
              <div><div class="label">Recharge</div><div class="value">UPI / Bank / USDT</div></div>
              <div><div class="label">Complaint</div><div class="value">UTR Tracking</div></div>
              <div><div class="label">Admin</div><div class="value">Review Panel</div></div>
            </div>
            <div class="payment-flow">
              <span>Register</span>
              <span>Recharge</span>
              <span>Activate Plan</span>
              <span>Withdraw</span>
            </div>
          </div>
        </div>
        <div class="detail-band">
          <div class="detail-card"><h3>Referral Team</h3><p>Members get a personal invite code and shareable referral link so new registrations can be connected to their team.</p><ul class="check-list"><li>Auto-filled invite links</li><li>Team member list</li><li>Bonus summary</li></ul></div>
          <div class="detail-card"><h3>Withdrawal Flow</h3><p>Wallet users can submit withdrawal requests with UPI or bank details, and admins can review transaction history.</p><ul class="check-list"><li>Amount validation</li><li>Payment address field</li><li>Dashboard history</li></ul></div>
          <div class="detail-card"><h3>Admin Overview</h3><p>Admins can update QR details, add or edit products, approve payments, manage balances, and check support messages.</p><ul class="check-list"><li>Product controls</li><li>QR and payment settings</li><li>Complaint status updates</li></ul></div>
        </div>
        <div class="contact-footer">
          <div class="contact-copy">
            <div>
              <h2>Contact Details</h2>
              <p>Need help with recharge, UTR, withdrawal, products, or account access? Use the support details below.</p>
            </div>
            <div class="form-actions">
              <button class="btn primary" onclick="go('support')">Contact Support</button>
              <button class="btn warn" onclick="go('complaint')">Payment Complaint</button>
            </div>
          </div>
          <div class="contact-visual">
            <img src="/assets/product-card-box.png" alt="VIP product support image">
          </div>
          <div class="contact-grid">
            <div class="contact-card"><div class="label">Customer Support</div><strong>support@legacy.app</strong><span>Send account and app questions anytime.</span></div>
            <div class="contact-card"><div class="label">Phone / WhatsApp</div><strong>+91 98765 43210</strong><span>Quick help for recharge and withdrawal issues.</span></div>
            <div class="contact-card"><div class="label">Payment Help</div><strong>UTR Complaint Desk</strong><span>Submit your UTR number when a payment needs review.</span></div>
            <div class="contact-card"><div class="label">Office Hours</div><strong>Mon-Sat, 9 AM - 7 PM</strong><span>Requests are checked during support hours.</span></div>
          </div>
        </div>
      </section>

      <section class="page" id="register">
        <form class="form" onsubmit="registerUser(event)">
          <h2>Register</h2>
          <p class="muted">Referral links fill the invite code automatically.</p>
          <div class="field"><label>Name</label><input id="regName" required placeholder="Your name"></div>
          <div class="field"><label>Mobile Number</label><input id="regPhone" required placeholder="10 digit mobile"></div>
          <div class="field"><label>Password</label><div class="password-row"><input id="regPass" type="password" required placeholder="Create password"><button class="btn" type="button" onclick="togglePassword('regPass', this)">Show</button></div></div>
          <div class="field"><label>Invite Code</label><input id="regRef" placeholder="Referral code"></div>
          <button class="btn primary" style="width:100%">Register</button>
          <p class="muted">Already have account? <a href="#login" onclick="go('login')">Login</a></p>
        </form>
      </section>

      <section class="page" id="login">
        <form class="form" onsubmit="loginUser(event)">
          <h2>Login</h2>
          <div class="field"><label>Mobile Number</label><input id="loginPhone" required placeholder="Registered mobile"></div>
          <div class="field"><label>Password</label><div class="password-row"><input id="loginPass" type="password" required placeholder="Password"><button class="btn" type="button" onclick="togglePassword('loginPass', this)">Show</button></div></div>
          <button class="btn primary" style="width:100%">Login</button>
          <p class="muted">New user? <a href="#register" onclick="go('register')">Create account</a></p>
        </form>
      </section>

      <section class="page" id="dashboard">
        <div class="section-head"><div><h2>Dashboard</h2><p class="muted">Account summary and quick actions.</p></div><button class="btn danger" onclick="logout()">Logout</button></div>
        <div class="grid">
          <div class="card"><div class="label">Wallet Balance</div><div class="value" id="dashBalance">₹0</div></div>
          <div class="card"><div class="label">Total Income</div><div class="value" id="dashIncome">₹0</div></div>
          <div class="card"><div class="label">Team Bonus</div><div class="value" id="dashBonus">₹0</div></div>
        </div>
        <div class="grid two" style="margin-top:14px">
          <div class="card">
            <h3>Quick Actions</h3>
            <div class="form-actions">
              <button class="btn blue" onclick="go('recharge')">Recharge</button>
              <button class="btn warn" onclick="go('complaint')">Payment Complaint</button>
              <button class="btn warn" onclick="go('withdraw')">Withdraw</button>
              <button class="btn primary" onclick="go('plans')">Buy Plan</button>
              <button class="btn" onclick="go('referrals')">Team</button>
            </div>
          </div>
          <div class="card">
            <h3>Active Investments</h3>
            <div id="investmentList" class="rows"></div>
          </div>
        </div>
        <div class="section-head"><h2>Transactions</h2></div>
        <div style="overflow:auto"><table><thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>UTR</th><th>Status</th></tr></thead><tbody id="txRows"></tbody></table></div>
      </section>

      <section class="page" id="plans">
        <div class="section-head"><div><h2>Products & Plans</h2><p class="muted">Investment plans start from ₹550 and go up to ₹18,000.</p></div></div>
        <div class="plan-actions">
          <button class="plan-action" onclick="go('recharge')"><span class="action-icon">↯</span><span>Recharge</span></button>
          <button class="plan-action" onclick="go('withdraw')"><span class="action-icon">▣</span><span>Withdraw</span></button>
          <button class="plan-action" onclick="go('support')"><span class="action-icon">◉</span><span>Channels</span></button>
          <button class="plan-action" onclick="go('dashboard')"><span class="action-icon">◎</span><span>Online</span></button>
        </div>
        <div class="plan-filter">
          <button class="btn active" data-filter="ALL" onclick="setPlanFilter('ALL')">All Products</button>
          <button class="btn" data-filter="VIP" onclick="setPlanFilter('VIP')">VIP Plan</button>
          <button class="btn" data-filter="SVIP" onclick="setPlanFilter('SVIP')">SVIP Plan</button>
        </div>
        <div class="detail-band">
          <div class="detail-card"><h3>VIP Plan Details</h3><p>VIP products are designed as starter-to-premium options with clear daily income, total income, validity days, and available slots.</p></div>
          <div class="detail-card"><h3>SVIP Plan Details</h3><p>SVIP products highlight higher-tier packages and limited slots while keeping the same simple invest, earn, and track workflow.</p></div>
          <div class="detail-card"><h3>Before You Invest</h3><p>Recharge first, keep your UTR number, check the plan amount, and use Payment Complaint if a transaction needs review.</p></div>
        </div>
        <div class="featured-plan" id="featuredPlan"></div>
        <div class="reference-products">
          <img src="/assets/reference-products.jpeg" alt="VIP and SVIP product plans">
        </div>
        <div class="same-products" id="sameProducts"></div>
        <div class="grid" id="plansGrid"></div>
      </section>

      <section class="page" id="recharge">
        <form class="form" onsubmit="recharge(event)">
          <h2>Recharge</h2>
          <div class="notice">Scan the current QR or use the payment detail below. Demo mode credits instantly after submit.</div>
          <div class="field"><label>Current QR</label><div class="qr-preview" id="rechargeQr">No QR added</div></div>
          <div class="payment-options">
            <div class="payment-option active" data-method="QR Code" role="button" tabindex="0" onclick="selectPaymentMethod('QR Code')" onkeydown="paymentKey(event,'QR Code')"><strong>QR Code</strong><span>Scan the current QR image and submit recharge.</span></div>
            <div class="payment-option" data-method="UPI" role="button" tabindex="0" onclick="selectPaymentMethod('UPI')" onkeydown="paymentKey(event,'UPI')"><strong>UPI</strong><span>Use the payment detail or UPI ID shown below.</span></div>
            <div class="payment-option" data-method="Bank Transfer" role="button" tabindex="0" onclick="selectPaymentMethod('Bank Transfer')" onkeydown="paymentKey(event,'Bank Transfer')"><strong>Bank</strong><span>Send by bank transfer and keep your reference.</span></div>
            <div class="payment-option" data-method="USDT" role="button" tabindex="0" onclick="selectPaymentMethod('USDT')" onkeydown="paymentKey(event,'USDT')"><strong>USDT</strong><span>Use crypto payment details if enabled by admin.</span></div>
          </div>
          <div class="field"><label>UPI / Bank / USDT Detail</label><input id="rechargePaymentDetail" readonly></div>
          <div class="field"><label>Amount</label><input id="rechargeAmount" type="number" min="100" value="1000" required></div>
          <div class="field"><label>Payment Method</label><select id="payMethod" onchange="selectPaymentMethod(this.value)"><option>QR Code</option><option>UPI</option><option>Bank Transfer</option><option>USDT</option></select></div>
          <button class="btn primary" style="width:100%">Submit Recharge</button>
          <button class="btn" type="button" style="width:100%; margin-top:10px" onclick="go('complaint')">Payment Issue Complaint</button>
          <div class="notice" id="lastUtrBox" style="display:none"></div>
        </form>
      </section>

      <section class="page" id="withdraw">
        <form class="form" onsubmit="withdraw(event)">
          <h2>Withdraw</h2>
          <div class="field"><label>Amount</label><input id="withdrawAmount" type="number" min="100" value="500" required></div>
          <div class="field"><label>UPI / Bank Detail</label><input id="withdrawTo" required placeholder="Payment address"></div>
          <button class="btn warn" style="width:100%">Request Withdrawal</button>
        </form>
      </section>

      <section class="page" id="referrals">
        <div class="section-head"><div><h2>Referral Team</h2><p class="muted">Share your link and track local demo users.</p></div></div>
        <div class="grid two">
          <div class="card">
            <div class="label">Your Code</div><div class="value" id="myCode">----</div>
            <div class="field"><label>Referral Link</label><input id="refLink" readonly></div>
            <button class="btn primary" onclick="copyReferral()">Copy Link</button>
          </div>
          <div class="card">
            <div class="label">Team Size</div><div class="value" id="teamSize">0</div>
            <p class="muted">Level rewards are simulated when referred users buy plans.</p>
          </div>
        </div>
        <div class="section-head"><h2>Team Members</h2></div>
        <div style="overflow:auto"><table><thead><tr><th>Name</th><th>Phone</th><th>Joined</th></tr></thead><tbody id="teamRows"></tbody></table></div>
      </section>

      <section class="page" id="support">
        <form class="form" onsubmit="sendSupport(event)">
          <h2>Support</h2>
          <div class="field"><label>Subject</label><input id="supportSubject" required placeholder="How can we help?"></div>
          <div class="field"><label>Message</label><textarea id="supportMessage" required placeholder="Write your message"></textarea></div>
          <button class="btn primary" style="width:100%">Send Message</button>
        </form>
      </section>

      <section class="page" id="complaint">
        <form class="form" onsubmit="sendComplaint(event)">
          <h2>Payment Complaint</h2>
          <p class="muted">Use this if your payment is done but balance, UTR, or approval has an issue.</p>
          <div class="field"><label>UTR Number</label><input id="complaintUtr" placeholder="Enter UTR number"></div>
          <div class="field"><label>Amount Paid</label><input id="complaintAmount" type="number" min="1" required placeholder="Amount"></div>
          <div class="field"><label>Payment Method</label><select id="complaintMethod"><option>UPI</option><option>Bank Transfer</option><option>USDT</option><option>Other</option></select></div>
          <div class="field"><label>Issue Type</label><select id="complaintIssue"><option>Payment done but balance not added</option><option>Wrong UTR generated</option><option>QR/payment detail issue</option><option>Recharge pending</option><option>Other payment issue</option></select></div>
          <div class="field"><label>Details</label><textarea id="complaintMessage" required placeholder="Explain your payment problem"></textarea></div>
          <button class="btn warn" style="width:100%">Submit Complaint</button>
        </form>
      </section>

      <section class="page" id="admin-login">
        <form class="form" onsubmit="adminLogin(event)">
          <h2>Admin Login</h2>
          <p class="muted">Local demo password: admin123</p>
          <div class="field"><label>Password</label><div class="password-row"><input id="adminPass" type="password" required placeholder="Admin password"><button class="btn" type="button" onclick="togglePassword('adminPass', this)">Show</button></div></div>
          <button class="btn danger" style="width:100%">Open Admin Panel</button>
        </form>
      </section>

      <section class="page" id="admin">
        <div class="admin-panel">
          <div class="section-head">
            <div><h2>Admin Panel</h2><p class="muted">Manage products, QR, users, transactions, support, and system data.</p></div>
            <button class="btn danger" onclick="adminLogout()">Admin Logout</button>
          </div>
          <div class="grid">
            <div class="card"><div class="label">Users</div><div class="value" id="adminUserCount">0</div></div>
            <div class="card"><div class="label">Products</div><div class="value" id="adminPlanCount">0</div></div>
            <div class="card"><div class="label">Transactions</div><div class="value" id="adminTxCount">0</div></div>
          </div>

          <div class="grid two" style="margin-top:14px">
            <form class="card" onsubmit="saveAdminSettings(event)">
              <h3>QR & Payment</h3>
              <div class="field"><label>Payment Detail / UPI</label><input id="adminPaymentDetail" placeholder="example@upi"></div>
              <div class="field"><label>Upload QR Image</label><input id="adminQrFile" type="file" accept="image/*" onchange="previewAdminQr(event)"></div>
              <div class="qr-preview" id="adminQrPreview">No QR added</div>
              <div class="form-actions">
                <button class="btn primary">Save QR Settings</button>
                <button class="btn" type="button" onclick="clearQr()">Remove QR</button>
              </div>
            </form>

            <form class="card" onsubmit="saveProduct(event)">
              <h3 id="productFormTitle">Add Product</h3>
              <input id="productOriginalName" type="hidden">
              <div class="grid two">
                <div class="field"><label>Name</label><input id="productName" required placeholder="SVIP-11"></div>
                <div class="field"><label>Type</label><select id="productType"><option>VIP</option><option>SVIP</option></select></div>
                <div class="field"><label>Invest Amount</label><input id="productPrice" type="number" required min="550" max="18000"></div>
                <div class="field"><label>Daily Income</label><input id="productDaily" type="number" required min="1"></div>
                <div class="field"><label>Total Income</label><input id="productTotal" type="number" required min="1"></div>
                <div class="field"><label>Validity Days</label><input id="productDays" type="number" required min="1" value="100"></div>
                <div class="field"><label>Limit / Slots</label><input id="productSlots" type="number" required min="1" value="10"></div>
              </div>
              <div class="form-actions">
                <button class="btn primary">Save Product</button>
                <button class="btn" type="button" onclick="resetProductForm()">Clear</button>
              </div>
            </form>
          </div>

          <div class="section-head"><h2>Products</h2><div class="admin-tools"><button class="btn" onclick="restoreDefaultProducts()">Restore Defaults</button></div></div>
          <div class="admin-table"><table><thead><tr><th>Name</th><th>Type</th><th>Invest</th><th>Daily</th><th>Total</th><th>Days</th><th>Limit</th><th>Action</th></tr></thead><tbody id="adminProductRows"></tbody></table></div>

          <div class="section-head"><h2>Users</h2></div>
          <div class="admin-table"><table><thead><tr><th>Name</th><th>Phone</th><th>Balance</th><th>Plan</th><th>Referral</th><th>Action</th></tr></thead><tbody id="adminUserRows"></tbody></table></div>

          <div class="section-head"><h2>Transactions</h2></div>
          <div class="admin-table"><table><thead><tr><th>Date</th><th>User</th><th>Type</th><th>Amount</th><th>UTR</th><th>Status</th><th>Action</th></tr></thead><tbody id="adminTxRows"></tbody></table></div>

          <div class="section-head"><h2>Support Messages</h2></div>
          <div class="admin-table"><table><thead><tr><th>Date</th><th>User</th><th>Subject</th><th>Message</th><th>Action</th></tr></thead><tbody id="adminSupportRows"></tbody></table></div>

          <div class="section-head"><h2>Payment Complaints</h2></div>
          <div class="admin-table"><table><thead><tr><th>Date</th><th>User</th><th>UTR</th><th>Amount</th><th>Method</th><th>Issue</th><th>Status</th><th>Action</th></tr></thead><tbody id="adminComplaintRows"></tbody></table></div>

          <div class="card" style="margin-top:14px">
            <h3>System Tools</h3>
            <div class="admin-tools">
              <button class="btn blue" onclick="exportSystem()">Export Data</button>
              <button class="btn danger" onclick="resetSystem()">Reset All Local Data</button>
            </div>
          </div>
        </div>
      </section>
    </main>

  </div>
  <div class="auth-popup" id="authPopup" onclick="popupBackdrop(event)">
    <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="authPopupTitle">
      <div class="auth-dialog-head">
        <div>
          <h2 id="authPopupTitle">Welcome to Legacy</h2>
          <p>Create a new account or login to continue with wallet, recharge, products, and dashboard.</p>
        </div>
        <button class="btn auth-close" type="button" onclick="closeAuthPopup()" aria-label="Close">&times;</button>
      </div>
      <div class="auth-options">
        <button class="auth-option" type="button" onclick="chooseAuth('register')"><strong>Create Account</strong><span>Start with mobile, password, and invite code.</span></button>
        <button class="auth-option" type="button" onclick="chooseAuth('login')"><strong>Login</strong><span>Open your wallet, products, and income dashboard.</span></button>
      </div>
    </div>
  </div>
  <div class="toast" id="toast"></div>

  <script>
    var activePlanFilter = 'ALL';
    var defaultPlans = [
      {name:'VIP-1', type:'VIP', price:550, daily:30, total:3000, days:100, slots:100},
      {name:'VIP-2', type:'VIP', price:1500, daily:80, total:8000, days:100, slots:80},
      {name:'VIP-3', type:'VIP', price:3000, daily:150, total:15000, days:100, slots:60},
      {name:'VIP-4', type:'VIP', price:5000, daily:220, total:22000, days:100, slots:40},
      {name:'VIP-5', type:'VIP', price:8000, daily:400, total:40000, days:100, slots:30},
      {name:'VIP-6', type:'VIP', price:12000, daily:600, total:60000, days:100, slots:20},
      {name:'VIP-7', type:'VIP', price:18000, daily:800, total:80000, days:100, slots:15},
      {name:'SVIP-1', type:'SVIP', price:1200, daily:50, total:5000, days:100, slots:10},
      {name:'SVIP-2', type:'SVIP', price:3000, daily:150, total:15000, days:100, slots:10},
      {name:'SVIP-3', type:'SVIP', price:6000, daily:300, total:30000, days:100, slots:10},
      {name:'SVIP-4', type:'SVIP', price:12000, daily:600, total:60000, days:100, slots:10},
      {name:'SVIP-5', type:'SVIP', price:18000, daily:800, total:80000, days:100, slots:10}
    ];
    var plans = [];
    var state = load();
    plans = state.plans;

    function load() {
      var saved = localStorage.getItem('legacy_demo_state');
      var data = saved ? JSON.parse(saved) : {};
      if (!Array.isArray(data.users)) data.users = [];
      if (!Array.isArray(data.transactions)) data.transactions = [];
      if (!Array.isArray(data.investments)) data.investments = [];
      if (!Array.isArray(data.support)) data.support = [];
      if (!Array.isArray(data.complaints)) data.complaints = [];
      if (!Array.isArray(data.plans)) data.plans = defaultPlans.slice();
      data.plans = data.plans.filter(function(p){ return Number(p.price) >= 550 && Number(p.price) <= 18000; });
      defaultPlans.forEach(function(plan) {
        if (!data.plans.some(function(p){ return p.name === plan.name; })) data.plans.push(plan);
      });
      data.plans.sort(function(a, b){ return a.price - b.price || a.name.localeCompare(b.name); });
      if (!data.settings) data.settings = { paymentDetail: 'demo@upi', qr: '' };
      if (typeof data.admin !== 'boolean') data.admin = false;
      if (!('session' in data)) data.session = null;
      return data;
    }
    function save() { localStorage.setItem('legacy_demo_state', JSON.stringify(state)); }
    function money(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
    function today() { return new Date().toLocaleDateString('en-IN'); }
    function generateUtr() {
      var stamp = Date.now().toString().slice(-8);
      var random = Math.floor(100000 + Math.random() * 900000);
      return 'UTR' + stamp + random;
    }
    function currentUser() { return state.users.find(function(u){ return u.id === state.session; }); }
    function toast(msg) {
      var el = document.getElementById('toast');
      el.textContent = msg;
      el.style.display = 'block';
      clearTimeout(window.toastTimer);
      window.toastTimer = setTimeout(function(){ el.style.display = 'none'; }, 2600);
    }
    function codeFromName(name) {
      return 'INV' + Math.random().toString(36).slice(2, 6).toUpperCase() + String(Date.now()).slice(-3);
    }
    function requireLogin(next) {
      if (!currentUser()) {
        toast('Please login first.');
        openAuthPopup();
        return false;
      }
      if (next) go(next);
      return true;
    }
    function openAuthPopup() {
      var popup = document.getElementById('authPopup');
      if (popup) popup.classList.add('active');
    }
    function closeAuthPopup() {
      var popup = document.getElementById('authPopup');
      if (popup) popup.classList.remove('active');
    }
    function popupBackdrop(event) {
      if (event.target && event.target.id === 'authPopup') closeAuthPopup();
    }
    function chooseAuth(page) {
      closeAuthPopup();
      go(page);
    }
    function go(page) {
      if (['dashboard','recharge','withdraw','referrals','complaint'].indexOf(page) >= 0 && !currentUser()) {
        page = 'login';
        toast('Login required.');
      }
      if (page === 'admin' && !state.admin) {
        page = 'admin-login';
        toast('Admin password required.');
      }
      document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
      var target = document.getElementById(page) || document.getElementById('home');
      target.classList.add('active');
      document.querySelectorAll('[data-tab]').forEach(function(b){
        b.classList.toggle('active', b.getAttribute('data-tab') === page);
      });
      location.hash = page;
      render();
      window.scrollTo(0, 0);
    }
    function togglePassword(inputId, button) {
      var input = document.getElementById(inputId);
      if (!input) return;
      var isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      button.textContent = isHidden ? 'Hide' : 'Show';
      button.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    }
    function selectPaymentMethod(method) {
      var select = document.getElementById('payMethod') || document.getElementById('rechargeMethod');
      if (select) select.value = method;
      document.querySelectorAll('#recharge .payment-option').forEach(function(card) {
        card.classList.toggle('active', card.getAttribute('data-method') === method);
      });
    }
    function paymentKey(event, method) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectPaymentMethod(method);
      }
    }
    function renderNav() {
      var nav = document.getElementById('nav');
      var user = currentUser();
      if (user) {
        nav.innerHTML = '<button onclick="go(\\'home\\')" data-tab="home">Home</button><button onclick="go(\\'plans\\')" data-tab="plans">Plans</button><button onclick="go(\\'dashboard\\')" data-tab="dashboard">Dashboard</button><button onclick="go(\\'recharge\\')">Recharge</button><button onclick="go(\\'complaint\\')">Complaint</button><button onclick="go(\\'withdraw\\')">Withdraw</button><button onclick="go(\\'referrals\\')" data-tab="referrals">Team</button><button onclick="go(\\'support\\')" data-tab="support">Support</button><button onclick="logout()">Logout</button>';
      } else {
        nav.innerHTML = '<button onclick="go(\\'home\\')" data-tab="home">Home</button><button onclick="go(\\'plans\\')" data-tab="plans">Plans</button><button onclick="go(\\'support\\')" data-tab="support">Support</button><button onclick="openAuthPopup()">Login</button><button class="btn primary" onclick="openAuthPopup()">Register</button>';
      }
    }
    function renderPlans() {
      var grid = document.getElementById('plansGrid');
      var visiblePlans = activePlanFilter === 'ALL' ? plans : plans.filter(function(p){ return p.type === activePlanFilter; });
      var heroPlan = activePlanFilter === 'VIP' ? plans.find(function(p){ return p.type === 'VIP'; }) : plans.find(function(p){ return p.name === 'SVIP-1'; }) || plans.find(function(p){ return p.type === 'SVIP'; }) || plans[0];
      document.querySelectorAll('[data-filter]').forEach(function(btn){
        btn.classList.toggle('active', btn.getAttribute('data-filter') === activePlanFilter);
      });
      renderFeaturedPlan(heroPlan);
      renderSameProducts();
      grid.innerHTML = visiblePlans.map(function(p, index){
        var isSvip = p.type === 'SVIP';
        var buttonClass = isSvip ? 'btn warn' : 'btn primary';
        var colorClass = isSvip ? 'svip-color-' + (index % 6) : 'product-color-' + (index % 12);
        var productImage = isSvip ? '/assets/svip-product-card-box.png' : '/assets/product-card-box.png';
        return '<div class="card plan ' + (isSvip ? 'svip' : '') + '"><div class="product-box ' + colorClass + '"><img src="' + productImage + '" alt="' + p.name + ' product image"><div class="product-overlay"><span>' + p.type + ' PRODUCT</span><strong>' + p.name + '</strong></div></div><div class="plan-title"><h3>' + p.name + '</h3><span class="badge">' + p.type + '</span></div><div class="value">' + money(p.price) + '</div><div class="rows"><div class="row"><span>Daily income</span><strong style="color:#dc2626">' + money(p.daily) + '</strong></div><div class="row"><span>Total income</span><strong style="color:#16a34a">' + money(p.total) + '</strong></div><div class="row"><span>Validity</span><strong>' + p.days + ' Days</strong></div><div class="row"><span>Limit</span><strong>0/' + p.slots + '</strong></div><div class="row"><span>Team reward</span><strong>10% / 5% / 2%</strong></div></div><button class="' + buttonClass + '" onclick="buyPlan(\\'' + p.name + '\\')">Invest Now</button></div>';
      }).join('');
    }
    function packageMarkup(p, size) {
      var cls = productClass(p);
      return '<div class="package ' + (size || '') + ' ' + cls + '"><div class="mini-crown">♛</div><div class="pack-brand">SHIVASHA</div><div class="pack-name">' + p.name + '</div><div class="diamond"></div></div>';
    }
    function productClass(p) {
      if (p.name.indexOf('VIP-1') === 0) return 'vip1';
      if (p.name.indexOf('VIP-2') === 0) return 'vip2';
      if (p.name.indexOf('VIP-3') === 0) return 'vip3';
      if (p.name.indexOf('SVIP-10') === 0) return 'svip10';
      if (p.name.indexOf('SVIP-9') === 0) return 'svip9';
      if (p.name.indexOf('SVIP-8') === 0) return 'svip8';
      if (p.name.indexOf('SVIP-7') === 0) return 'svip7';
      if (p.name.indexOf('SVIP-6') === 0) return 'svip6';
      if (p.name.indexOf('SVIP-5') === 0) return 'svip5';
      if (p.name.indexOf('SVIP-4') === 0) return 'svip4';
      if (p.name.indexOf('SVIP-2') === 0) return 'svip2';
      if (p.name.indexOf('SVIP-3') === 0) return 'svip3';
      return p.type === 'SVIP' ? 'svip1' : 'vip1';
    }
    function renderSameProducts() {
      var el = document.getElementById('sameProducts');
      if (!el) return;
      var productNames = ['VIP-1','VIP-2','VIP-3','VIP-4','VIP-5','VIP-6','VIP-7','SVIP-1','SVIP-2','SVIP-3','SVIP-4','SVIP-5'];
      el.innerHTML = productNames.map(function(name){
        var p = plans.find(function(item){ return item.name === name; });
        if (!p) return '';
        return '<div class="gallery-item">' + packageMarkup(p, 'small') + '<div class="product-caption">' + p.name + '</div></div>';
      }).join('');
    }
    function renderFeaturedPlan(p) {
      var el = document.getElementById('featuredPlan');
      if (!el) return;
      var isSvip = p.type === 'SVIP';
      var title = isSvip ? 'SVIP PLAN' : 'VIP PLAN';
      var copy = isSvip ? 'Premium Benefits' : 'Daily Income Benefits';
      el.innerHTML = '<div class="featured-art"><div class="featured-copy"><div class="crown">♛</div><h3>' + title + '</h3><strong>' + copy + '</strong><ul class="benefits"><li>Higher Daily Income</li><li>Faster Returns</li><li>Exclusive Rewards</li><li>Priority Support</li></ul><div style="margin-top:28px"><span class="badge" style="background:rgba(255,255,255,.14); color:#fff">Limit: 0/' + p.slots + '</span></div></div><div class="featured-boxes">' + packageMarkup(p, '') + packageMarkup(p, '') + '</div></div><div class="featured-stats"><div><span class="muted">Daily income</span><strong style="color:#dc2626">' + money(p.daily) + '</strong></div><div><span class="muted">Validity period</span><strong>' + p.days + ' Days</strong></div><div><span class="muted">Total income</span><strong style="color:#16a34a">' + money(p.total) + '</strong></div></div><div class="featured-buy"><div><div class="muted">Invest</div><div class="amount">' + money(p.price) + '</div></div><button class="btn warn" style="min-width:210px; min-height:58px; font-size:22px" onclick="buyPlan(\\'' + p.name + '\\')">Invest Now</button></div>';
    }
    function setPlanFilter(filter) {
      activePlanFilter = filter;
      renderPlans();
    }
    function renderQr() {
      var qr = state.settings && state.settings.qr;
      var detail = state.settings && state.settings.paymentDetail ? state.settings.paymentDetail : '';
      var rechargeQr = document.getElementById('rechargeQr');
      var adminQr = document.getElementById('adminQrPreview');
      if (rechargeQr) rechargeQr.innerHTML = qr ? '<img src="' + qr + '" alt="Payment QR">' : 'No QR added';
      if (adminQr) adminQr.innerHTML = qr ? '<img src="' + qr + '" alt="Payment QR">' : 'No QR added';
      var rechargeDetail = document.getElementById('rechargePaymentDetail');
      var adminDetail = document.getElementById('adminPaymentDetail');
      if (rechargeDetail) rechargeDetail.value = detail;
      if (adminDetail) adminDetail.value = detail;
    }
    function adminLogin(e) {
      e.preventDefault();
      if (document.getElementById('adminPass').value !== 'admin123') return toast('Wrong admin password.');
      state.admin = true;
      save();
      document.getElementById('adminPass').value = '';
      toast('Admin panel opened.');
      go('admin');
    }
    function adminLogout() {
      state.admin = false;
      save();
      toast('Admin logged out.');
      go('home');
    }
    function renderAdmin() {
      if (!document.getElementById('adminProductRows')) return;
      document.getElementById('adminUserCount').textContent = state.users.length;
      document.getElementById('adminPlanCount').textContent = plans.length;
      document.getElementById('adminTxCount').textContent = state.transactions.length;
      document.getElementById('adminProductRows').innerHTML = plans.map(function(p){
        return '<tr><td>' + p.name + '</td><td>' + p.type + '</td><td>' + money(p.price) + '</td><td>' + money(p.daily) + '</td><td>' + money(p.total) + '</td><td>' + p.days + '</td><td>' + p.slots + '</td><td><button class="btn" onclick="editProduct(\\'' + p.name + '\\')">Edit</button> <button class="btn danger" onclick="deleteProduct(\\'' + p.name + '\\')">Delete</button></td></tr>';
      }).join('');
      document.getElementById('adminUserRows').innerHTML = state.users.length ? state.users.map(function(u){
        return '<tr><td>' + u.name + '</td><td>' + u.phone + '</td><td>' + money(u.balance) + '</td><td>' + (u.plan || '-') + '</td><td>' + (u.ref || '-') + '</td><td><button class="btn" onclick="adjustUserBalance(' + u.id + ')">Balance</button> <button class="btn danger" onclick="deleteUser(' + u.id + ')">Delete</button></td></tr>';
      }).join('') : '<tr><td colspan="6" class="muted">No users yet.</td></tr>';
      document.getElementById('adminTxRows').innerHTML = state.transactions.length ? state.transactions.slice().reverse().map(function(t, reverseIndex){
        var index = state.transactions.length - 1 - reverseIndex;
        var u = state.users.find(function(user){ return user.id === t.userId; });
        return '<tr><td>' + t.date + '</td><td>' + (u ? u.phone : '-') + '</td><td>' + t.type + '</td><td>' + money(t.amount) + '</td><td>' + (t.utr || '-') + '</td><td>' + t.status + '</td><td><button class="btn" onclick="setTxStatus(' + index + ', \\'success\\')">Approve</button> <button class="btn warn" onclick="setTxStatus(' + index + ', \\'rejected\\')">Reject</button></td></tr>';
      }).join('') : '<tr><td colspan="7" class="muted">No transactions yet.</td></tr>';
      document.getElementById('adminSupportRows').innerHTML = state.support.length ? state.support.slice().reverse().map(function(s, reverseIndex){
        var index = state.support.length - 1 - reverseIndex;
        var u = state.users.find(function(user){ return user.id === s.userId; });
        return '<tr><td>' + s.date + '</td><td>' + (u ? u.phone : '-') + '</td><td>' + s.subject + '</td><td>' + s.message + '</td><td><button class="btn danger" onclick="deleteSupport(' + index + ')">Delete</button></td></tr>';
      }).join('') : '<tr><td colspan="5" class="muted">No support messages yet.</td></tr>';
      document.getElementById('adminComplaintRows').innerHTML = state.complaints.length ? state.complaints.slice().reverse().map(function(c, reverseIndex){
        var index = state.complaints.length - 1 - reverseIndex;
        var u = state.users.find(function(user){ return user.id === c.userId; });
        return '<tr><td>' + c.date + '</td><td>' + (u ? u.phone : '-') + '</td><td>' + (c.utr || '-') + '</td><td>' + money(c.amount) + '</td><td>' + c.method + '</td><td>' + c.issue + '</td><td>' + c.status + '</td><td><button class="btn" onclick="setComplaintStatus(' + index + ', \\'resolved\\')">Resolve</button> <button class="btn warn" onclick="setComplaintStatus(' + index + ', \\'reviewing\\')">Review</button> <button class="btn danger" onclick="deleteComplaint(' + index + ')">Delete</button></td></tr>';
      }).join('') : '<tr><td colspan="8" class="muted">No payment complaints yet.</td></tr>';
    }
    function saveProduct(e) {
      e.preventDefault();
      var original = document.getElementById('productOriginalName').value;
      var product = {
        name: document.getElementById('productName').value.trim().toUpperCase(),
        type: document.getElementById('productType').value,
        price: Number(document.getElementById('productPrice').value),
        daily: Number(document.getElementById('productDaily').value),
        total: Number(document.getElementById('productTotal').value),
        days: Number(document.getElementById('productDays').value),
        slots: Number(document.getElementById('productSlots').value)
      };
      if (product.price < 550 || product.price > 18000) return toast('Plan amount must be between ₹550 and ₹18,000.');
      var duplicate = plans.find(function(p){ return p.name === product.name && p.name !== original; });
      if (duplicate) return toast('Product name already exists.');
      plans = original ? plans.map(function(p){ return p.name === original ? product : p; }) : plans.concat(product);
      state.plans = plans;
      save();
      resetProductForm();
      toast('Product saved.');
      render();
    }
    function editProduct(name) {
      var p = plans.find(function(item){ return item.name === name; });
      if (!p) return;
      document.getElementById('productFormTitle').textContent = 'Edit Product';
      document.getElementById('productOriginalName').value = p.name;
      document.getElementById('productName').value = p.name;
      document.getElementById('productType').value = p.type;
      document.getElementById('productPrice').value = p.price;
      document.getElementById('productDaily').value = p.daily;
      document.getElementById('productTotal').value = p.total;
      document.getElementById('productDays').value = p.days;
      document.getElementById('productSlots').value = p.slots;
      toast('Editing ' + p.name);
    }
    function resetProductForm() {
      document.getElementById('productFormTitle').textContent = 'Add Product';
      document.getElementById('productOriginalName').value = '';
      ['productName','productPrice','productDaily','productTotal'].forEach(function(id){ document.getElementById(id).value = ''; });
      document.getElementById('productType').value = 'VIP';
      document.getElementById('productDays').value = 100;
      document.getElementById('productSlots').value = 10;
    }
    function deleteProduct(name) {
      if (!confirm('Delete product ' + name + '?')) return;
      plans = plans.filter(function(p){ return p.name !== name; });
      state.plans = plans;
      save();
      render();
      toast('Product deleted.');
    }
    function restoreDefaultProducts() {
      if (!confirm('Restore default products?')) return;
      plans = defaultPlans.slice();
      state.plans = plans;
      save();
      render();
      toast('Default products restored.');
    }
    function previewAdminQr(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function() {
        state.settings.qr = reader.result;
        save();
        renderQr();
      };
      reader.readAsDataURL(file);
    }
    function saveAdminSettings(e) {
      e.preventDefault();
      state.settings.paymentDetail = document.getElementById('adminPaymentDetail').value.trim();
      save();
      renderQr();
      toast('Payment settings saved.');
    }
    function clearQr() {
      state.settings.qr = '';
      document.getElementById('adminQrFile').value = '';
      save();
      renderQr();
      toast('QR removed.');
    }
    function adjustUserBalance(id) {
      var user = state.users.find(function(u){ return u.id === id; });
      if (!user) return;
      var amount = Number(prompt('Enter amount to add or subtract. Example: 500 or -200', '0'));
      if (!amount) return;
      user.balance += amount;
      state.transactions.push({userId:user.id, date:today(), type:'admin adjustment', amount:amount, status:'success'});
      save();
      render();
      toast('Balance updated.');
    }
    function deleteUser(id) {
      if (!confirm('Delete this user?')) return;
      state.users = state.users.filter(function(u){ return u.id !== id; });
      state.transactions = state.transactions.filter(function(t){ return t.userId !== id; });
      state.investments = state.investments.filter(function(i){ return i.userId !== id; });
      if (state.session === id) state.session = null;
      save();
      render();
      toast('User deleted.');
    }
    function setTxStatus(index, status) {
      if (!state.transactions[index]) return;
      state.transactions[index].status = status;
      save();
      render();
      toast('Transaction ' + status + '.');
    }
    function deleteSupport(index) {
      state.support.splice(index, 1);
      save();
      render();
      toast('Support message deleted.');
    }
    function setComplaintStatus(index, status) {
      if (!state.complaints[index]) return;
      state.complaints[index].status = status;
      save();
      render();
      toast('Complaint marked ' + status + '.');
    }
    function deleteComplaint(index) {
      state.complaints.splice(index, 1);
      save();
      render();
      toast('Complaint deleted.');
    }
    function exportSystem() {
      var blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'legacy-system-export.json';
      a.click();
      URL.revokeObjectURL(a.href);
    }
    function resetSystem() {
      if (!confirm('Reset all local users, products, QR, and transactions?')) return;
      localStorage.removeItem('legacy_demo_state');
      state = load();
      plans = state.plans;
      save();
      render();
      toast('System reset complete.');
      go('home');
    }
    function renderDashboard() {
      var user = currentUser();
      var allPaid = state.transactions.filter(function(t){ return t.type !== 'withdraw'; }).reduce(function(sum,t){ return sum + t.amount; }, 0);
      document.getElementById('statUsers').textContent = state.users.length;
      document.getElementById('statPaid').textContent = money(allPaid);
      document.getElementById('heroBalance').textContent = user ? money(user.balance) : '₹0';
      document.getElementById('heroIncome').textContent = user ? money(user.income) : '₹0';
      document.getElementById('heroPlan').textContent = user && user.plan ? user.plan : 'None';
      document.getElementById('heroRef').textContent = user ? user.code : '----';
      if (!user) return;
      document.getElementById('dashBalance').textContent = money(user.balance);
      document.getElementById('dashIncome').textContent = money(user.income);
      document.getElementById('dashBonus').textContent = money(user.bonus);
      var inv = state.investments.filter(function(i){ return i.userId === user.id; });
      document.getElementById('investmentList').innerHTML = inv.length ? inv.map(function(i){
        return '<div class="row"><span>' + i.plan + '</span><strong>' + money(i.price) + '</strong></div>';
      }).join('') : '<p class="muted">No active plan yet.</p>';
      var tx = state.transactions.filter(function(t){ return t.userId === user.id; }).slice().reverse();
      document.getElementById('txRows').innerHTML = tx.length ? tx.map(function(t){
        return '<tr><td>' + t.date + '</td><td>' + t.type + '</td><td>' + money(t.amount) + '</td><td>' + (t.utr || '-') + '</td><td>' + t.status + '</td></tr>';
      }).join('') : '<tr><td colspan="5" class="muted">No transactions yet.</td></tr>';
      document.getElementById('myCode').textContent = user.code;
      document.getElementById('refLink').value = location.origin + '/register?ref=' + user.code;
      var team = state.users.filter(function(u){ return u.ref === user.code; });
      document.getElementById('teamSize').textContent = team.length;
      document.getElementById('teamRows').innerHTML = team.length ? team.map(function(u){
        return '<tr><td>' + u.name + '</td><td>' + u.phone + '</td><td>' + u.joined + '</td></tr>';
      }).join('') : '<tr><td colspan="3" class="muted">No team members yet.</td></tr>';
    }
    function render() { renderNav(); renderPlans(); renderDashboard(); renderQr(); renderAdmin(); }
    function registerUser(e) {
      e.preventDefault();
      var phone = document.getElementById('regPhone').value.trim();
      if (state.users.some(function(u){ return u.phone === phone; })) return toast('Mobile number already registered.');
      var user = {
        id: Date.now(),
        name: document.getElementById('regName').value.trim(),
        phone: phone,
        pass: document.getElementById('regPass').value,
        ref: document.getElementById('regRef').value.trim().toUpperCase(),
        code: codeFromName(document.getElementById('regName').value),
        balance: 0,
        income: 0,
        bonus: 0,
        plan: '',
        joined: today()
      };
      state.users.push(user);
      state.session = user.id;
      save();
      toast('Registration complete.');
      go('dashboard');
    }
    function loginUser(e) {
      e.preventDefault();
      var phone = document.getElementById('loginPhone').value.trim();
      var pass = document.getElementById('loginPass').value;
      var user = state.users.find(function(u){ return u.phone === phone && u.pass === pass; });
      if (!user) return toast('Wrong mobile number or password.');
      state.session = user.id;
      save();
      toast('Logged in.');
      go('dashboard');
    }
    function logout() { state.session = null; save(); toast('Logged out.'); go('home'); }
    function recharge(e) {
      e.preventDefault();
      var user = currentUser(); if (!user) return requireLogin();
      var amount = Number(document.getElementById('rechargeAmount').value);
      var method = document.getElementById('payMethod').value;
      var utr = generateUtr();
      user.balance += amount;
      state.transactions.push({userId:user.id, date:today(), type:'recharge', method:method, amount:amount, utr:utr, status:'success'});
      save();
      var box = document.getElementById('lastUtrBox');
      if (box) {
        box.style.display = 'block';
        box.innerHTML = '<strong>Payment completed.</strong><br>Generated UTR Number: <strong>' + utr + '</strong>';
      }
      toast('Recharge credited. UTR: ' + utr);
      go('dashboard');
    }
    function withdraw(e) {
      e.preventDefault();
      var user = currentUser(); if (!user) return requireLogin();
      var amount = Number(document.getElementById('withdrawAmount').value);
      if (amount > user.balance) return toast('Insufficient wallet balance.');
      user.balance -= amount;
      state.transactions.push({userId:user.id, date:today(), type:'withdraw', amount:amount, status:'pending'});
      save();
      toast('Withdrawal request submitted.');
      go('dashboard');
    }
    function buyPlan(name) {
      var user = currentUser(); if (!user) return requireLogin();
      var p = plans.find(function(item){ return item.name === name; });
      if (user.balance < p.price) return toast('Recharge wallet before buying this plan.');
      user.balance -= p.price;
      user.plan = p.name;
      user.income += p.daily;
      state.investments.push({userId:user.id, plan:p.name, price:p.price, daily:p.daily, total:p.total, days:p.days, date:today()});
      state.transactions.push({userId:user.id, date:today(), type:'plan purchase', amount:p.price, status:'active'});
      var sponsor = state.users.find(function(u){ return u.code === user.ref; });
      if (sponsor) {
        var bonus = Math.round(p.price * 0.10);
        sponsor.balance += bonus;
        sponsor.bonus += bonus;
        state.transactions.push({userId:sponsor.id, date:today(), type:'referral bonus', amount:bonus, status:'success'});
      }
      save();
      toast(p.name + ' activated.');
      go('dashboard');
    }
    function sendSupport(e) {
      e.preventDefault();
      var user = currentUser();
      state.support.push({
        userId: user ? user.id : null,
        subject: document.getElementById('supportSubject').value,
        message: document.getElementById('supportMessage').value,
        date: today()
      });
      save();
      e.target.reset();
      toast('Support message saved.');
    }
    function sendComplaint(e) {
      e.preventDefault();
      var user = currentUser(); if (!user) return requireLogin();
      var complaint = {
        userId: user.id,
        date: today(),
        utr: document.getElementById('complaintUtr').value.trim().toUpperCase(),
        amount: Number(document.getElementById('complaintAmount').value),
        method: document.getElementById('complaintMethod').value,
        issue: document.getElementById('complaintIssue').value,
        message: document.getElementById('complaintMessage').value.trim(),
        status: 'pending'
      };
      state.complaints.push(complaint);
      save();
      e.target.reset();
      toast('Payment complaint submitted.');
      go('dashboard');
    }
    function copyReferral() {
      var input = document.getElementById('refLink');
      input.select();
      document.execCommand('copy');
      toast('Referral link copied.');
    }
    function initRef() {
      var params = new URLSearchParams(location.search);
      var ref = params.get('ref');
      if (ref) document.getElementById('regRef').value = ref.toUpperCase();
    }
    initRef();
    render();
    var start = location.pathname.indexOf('admin') >= 0 ? 'admin-login' : (location.hash ? location.hash.replace('#','') : (location.pathname.indexOf('register') >= 0 ? 'register' : 'home'));
    go(start);
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url && req.url.startsWith('/assets/reference-products.jpeg')) {
    fs.readFile(referenceProductImage, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Product image not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' });
      res.end(data);
    });
    return;
  }
  if (req.url && req.url.startsWith('/assets/home-recharge-preview.png')) {
    fs.readFile(homeRechargeImage, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Home image not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' });
      res.end(data);
    });
    return;
  }
  if (req.url && req.url.startsWith('/assets/product-card-box.png')) {
    fs.readFile(productCardImage, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Product card image not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' });
      res.end(data);
    });
    return;
  }
  if (req.url && req.url.startsWith('/assets/svip-product-card-box.png')) {
    fs.readFile(svipProductCardImage, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('SVIP product card image not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' });
      res.end(data);
    });
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(htmlContent);
});

server.listen(PORT, () => {
  console.log('\\n====================================');
  console.log('SERVER IS RUNNING');
  console.log('====================================');
  console.log('Open: http://localhost:' + PORT);
  console.log('Register with referral: http://localhost:' + PORT + '/register?ref=INV2625MXUN');
  console.log('====================================\\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('\\nPort ' + PORT + ' is already in use. Stop the old server or set PORT=3001.\\n');
  } else {
    console.error('Server error:', err);
  }
});
