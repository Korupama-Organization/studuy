import { useEffect } from 'react';
import backgroundForPc from '../../assets/BackgroundforPC.png';

const pageTitle = '404 - Trang không tìm thấy';

const notFoundStyles = `
    :root {
      --bg-url: url("${backgroundForPc}");
      --ink: #f7f8ff;
      --muted: rgba(255, 255, 255, 0.88);
      --cyan: #21f3ff;
      --pink: #ff4de7;
      --violet: #9b6cff;
      --button: #e87add;
      --button-hover: #f18bef;
      --shadow: rgba(16, 18, 44, 0.42);
    }

    * { box-sizing: border-box; }

    html, body {
      width: 100%;
      min-width: 320px;
      min-height: 100%;
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #111827;
    }

    body { overflow: hidden; }

    .error-page {
      position: relative;
      min-height: 100vh;
      min-height: 100dvh;
      color: var(--ink);
      overflow: hidden;
      isolation: isolate;
    }

    /* 16:9 stage keeps the decorative overlays aligned with the background image. */
    .stage {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: -1;
      width: max(100vw, 177.7778vh);
      height: max(100vh, 56.25vw);
      transform: translate(-50%, -50%);
      overflow: hidden;
    }

    .background {
      position: absolute;
      inset: 0;
      background-image: var(--bg-url);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      filter: saturate(0.82) brightness(0.74) contrast(1.04);
      transform: scale(1.012);
    }

    .tone {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 58% 47%, rgba(48, 70, 126, 0.12) 0 22%, rgba(20, 28, 65, 0.24) 45%, rgba(13, 16, 42, 0.55) 100%),
        linear-gradient(90deg, rgba(17, 20, 55, 0.82) 0%, rgba(27, 31, 72, 0.48) 31%, rgba(31, 38, 80, 0.18) 58%, rgba(27, 28, 69, 0.34) 100%),
        linear-gradient(0deg, rgba(26, 19, 58, 0.48) 0%, rgba(11, 15, 39, 0.06) 45%, rgba(7, 11, 32, 0.22) 100%);
      pointer-events: none;
    }

    .scanlines {
      position: absolute;
      inset: 0;
      opacity: 0.24;
      mix-blend-mode: screen;
      background:
        repeating-linear-gradient(
          0deg,
          rgba(255,255,255,0) 0 42px,
          rgba(58,240,255,0.18) 43px,
          rgba(58,240,255,0) 46px,
          rgba(255,72,230,0.13) 47px,
          rgba(255,72,230,0) 51px
        );
      animation: scan-drift 7s linear infinite;
      pointer-events: none;
    }

    .noise {
      position: absolute;
      inset: -12%;
      opacity: 0.18;
      background-image:
        radial-gradient(circle, rgba(255,255,255,0.38) 0 1px, transparent 1.5px),
        radial-gradient(circle, rgba(51,238,255,0.35) 0 1px, transparent 1.5px);
      background-size: 48px 48px, 73px 73px;
      background-position: 0 0, 15px 24px;
      mix-blend-mode: screen;
      animation: twinkle 6s steps(5) infinite;
      pointer-events: none;
    }

    .copy {
      position: absolute;
      z-index: 2;
      top: clamp(4.8rem, 16vh, 11rem);
      left: clamp(1.5rem, 8.2vw, 9.75rem);
      width: min(44rem, calc(100vw - 3rem));
      text-shadow: 0 12px 34px rgba(6, 10, 28, 0.42);
    }

    .code-wrap {
      position: relative;
      display: inline-block;
      margin-bottom: clamp(1rem, 1.45vw, 1.45rem);
    }

    .error-code {
      position: relative;
      display: inline-block;
      margin: 0;
      color: var(--ink);
      font-size: clamp(7.2rem, 13.7vw, 16.5rem);
      font-weight: 900;
      line-height: 0.78;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      text-shadow:
        -0.045em 0 var(--cyan),
        0.044em 0 var(--pink),
        0 0.08em 0 rgba(16, 18, 55, 0.18),
        0 18px 36px rgba(15, 15, 50, 0.25);
      animation: micro-jitter 3.8s steps(1, end) infinite;
    }

    .error-code::before,
    .error-code::after {
      content: attr(data-text);
      position: absolute;
      inset: 0;
      color: var(--ink);
      overflow: hidden;
      pointer-events: none;
    }

    .error-code::before {
      clip-path: polygon(0 13%, 100% 13%, 100% 43%, 0 43%);
      text-shadow: -0.07em 0 var(--cyan);
      transform: translate(-0.035em, -0.008em);
      animation: glitch-top 2.7s linear infinite alternate-reverse;
    }

    .error-code::after {
      clip-path: polygon(0 57%, 100% 57%, 100% 81%, 0 81%);
      text-shadow: 0.07em 0 var(--pink);
      transform: translate(0.032em, 0.012em);
      animation: glitch-bottom 3.1s linear infinite alternate-reverse;
    }

    .bar {
      position: absolute;
      height: clamp(3px, 0.34vw, 7px);
      border-radius: 999px;
      background: currentColor;
      box-shadow: 0 0 18px currentColor;
      opacity: 0.9;
      animation: bar-flicker 2.4s steps(1, end) infinite;
    }

    .bar-cyan { color: var(--cyan); }
    .bar-pink { color: var(--pink); }
    .bar-violet { color: #b59bff; }

    .bar-a { width: 24%; left: -4%; top: 61%; }
    .bar-b { width: 10%; left: 75%; top: 27%; animation-delay: 0.3s; }
    .bar-c { width: 13%; left: 91%; top: 53%; animation-delay: 0.65s; }
    .bar-d { width: 17%; left: -1%; top: 84%; animation-delay: 0.9s; }
    .bar-e { width: 8%; left: 51%; top: 42%; animation-delay: 1.2s; }

    .title {
      margin: 0 0 clamp(0.7rem, 1vw, 1rem);
      color: rgba(255, 255, 255, 0.96);
      font-size: clamp(1.35rem, 2.1vw, 2.25rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
      text-transform: uppercase;
    }

    .description {
      max-width: 30rem;
      margin: 0 0 clamp(1.35rem, 2vw, 2rem);
      color: var(--muted);
      font-size: clamp(1rem, 1.35vw, 1.5rem);
      font-weight: 650;
      line-height: 1.32;
    }

    .home-link {
      display: inline-flex;
      min-width: clamp(10rem, 13vw, 15rem);
      min-height: clamp(2.9rem, 3.7vw, 3.65rem);
      align-items: center;
      justify-content: center;
      padding: 0.85rem 2.15rem;
      border: 0;
      border-radius: 999px;
      color: #fff;
      background: linear-gradient(90deg, #e877dd 0%, #ec82df 54%, #d86cf0 100%);
      box-shadow: 0 14px 24px rgba(26, 22, 65, 0.28), 0 5px 0 rgba(31, 22, 79, 0.09) inset;
      font-size: clamp(0.88rem, 0.9vw, 1rem);
      font-weight: 800;
      line-height: 1;
      text-decoration: none;
      transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
      will-change: transform;
    }

    .home-link:hover {
      transform: translateY(-2px);
      filter: saturate(1.08) brightness(1.05);
      box-shadow: 0 17px 28px rgba(26, 22, 65, 0.35), 0 5px 0 rgba(31, 22, 79, 0.07) inset;
    }

    .home-link:active { transform: translateY(0); }

    .home-link:focus-visible {
      outline: 4px solid rgba(33, 243, 255, 0.65);
      outline-offset: 5px;
    }

    .lens-error {
      position: absolute;
      z-index: 2;
      left: 57.2%;
      top: 58.4%;
      width: min(8.7%, 10rem);
      aspect-ratio: 1;
      border-radius: 50%;
      background:
        radial-gradient(circle at 31% 26%, rgba(255,255,255,0.34) 0 11%, transparent 12% 100%),
        radial-gradient(circle at 50% 48%, rgba(48, 148, 212, 0.55) 0 53%, rgba(37, 45, 116, 0.68) 54% 100%);
      border: max(5px, 0.48vw) solid #f24832;
      box-shadow:
        0 0 0 max(2px, 0.15vw) rgba(105, 28, 20, 0.65),
        inset 0 0 0 max(4px, 0.3vw) rgba(255, 119, 61, 0.56),
        0 8px 20px rgba(23, 12, 42, 0.35);
      transform: translate(-50%, -50%) rotate(-8deg);
      opacity: 0.95;
    }

    .lens-error::before,
    .lens-error::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 62%;
      height: max(7px, 0.52vw);
      border-radius: 999px;
      background: #ff4b4b;
      box-shadow: 0 0 0 max(2px, 0.11vw) rgba(134, 18, 38, 0.52), 0 0 18px rgba(255, 58, 72, 0.38);
      transform-origin: center;
    }

    .lens-error::before { transform: translate(-50%, -50%) rotate(45deg); }
    .lens-error::after { transform: translate(-50%, -50%) rotate(-45deg); }

    // .tear {
    //   position: absolute;
    //   z-index: 2;
    //   left: 63.35%;
    //   top: 65%;
    //   width: min(1.15%, 1.35rem);
    //   aspect-ratio: 0.68;
    //   border-radius: 55% 55% 62% 62%;
    //   background: linear-gradient(180deg, #bff8ff 0%, #35d7ff 48%, #249adf 100%);
    //   box-shadow: inset 0 0 0 2px rgba(255,255,255,0.28), 0 4px 10px rgba(0, 39, 88, 0.25);
    //   transform: rotate(10deg);
    //   opacity: 0.9;
    // }

    .tear::before {
      content: "";
      position: absolute;
      top: -38%;
      left: 50%;
      width: 78%;
      aspect-ratio: 1;
      background: inherit;
      border-radius: 50% 50% 0 50%;
      transform: translateX(-50%) rotate(45deg);
    }

    .frown {
      position: absolute;
      z-index: 2;
      left: 60.95%;
      top: 66.2%;
      width: min(4.2%, 5rem);
      height: min(2.2%, 1.65rem);
      border-top: max(4px, 0.35vw) solid #13285e;
      border-radius: 50% 50% 0 0;
      transform: rotate(6deg);
      opacity: 0.72;
      filter: drop-shadow(0 1px 0 rgba(255,255,255,0.12));
    }

    .artifact {
      position: absolute;
      z-index: 3;
      height: max(3px, 0.28vw);
      border-radius: 999px;
      background: currentColor;
      box-shadow: 0 0 14px currentColor;
      opacity: 0.85;
      animation: artifact-flicker 3.6s steps(1, end) infinite;
    }

    .artifact-a { left: 84%; top: 21%; width: 4.6%; color: #21f3ff; }
    .artifact-b { left: 90%; top: 34%; width: 3.8%; color: #ff4de7; animation-delay: 0.5s; }
    .artifact-c { left: 80%; top: 29%; width: 2.4%; color: #8bbdff; animation-delay: 1.2s; }
    .artifact-d { left: 12%; top: 31%; width: 3.2%; color: #ff4de7; animation-delay: 1.8s; }
    .artifact-e { left: 9%; top: 40%; width: 5.4%; color: #21f3ff; animation-delay: 2.2s; }

    @keyframes scan-drift {
      0% { transform: translateY(-7%); }
      100% { transform: translateY(7%); }
    }

    @keyframes twinkle {
      0%, 100% { transform: translate3d(0,0,0); opacity: 0.13; }
      35% { transform: translate3d(-8px,4px,0); opacity: 0.2; }
      70% { transform: translate3d(6px,-5px,0); opacity: 0.16; }
    }

    @keyframes micro-jitter {
      0%, 72%, 100% { transform: translate(0, 0); }
      73% { transform: translate(-0.02em, 0.006em); }
      74% { transform: translate(0.012em, -0.006em); }
      75% { transform: translate(0, 0); }
      91% { transform: translate(0.008em, 0); }
      92% { transform: translate(-0.008em, 0.006em); }
      93% { transform: translate(0, 0); }
    }

    @keyframes glitch-top {
      0% { clip-path: polygon(0 12%, 100% 12%, 100% 39%, 0 39%); transform: translate(-0.025em, 0); }
      24% { clip-path: polygon(0 20%, 100% 20%, 100% 50%, 0 50%); transform: translate(-0.055em, -0.01em); }
      45% { clip-path: polygon(0 5%, 100% 5%, 100% 32%, 0 32%); transform: translate(0.015em, 0.004em); }
      68% { clip-path: polygon(0 34%, 100% 34%, 100% 58%, 0 58%); transform: translate(-0.04em, 0.012em); }
      100% { clip-path: polygon(0 16%, 100% 16%, 100% 43%, 0 43%); transform: translate(-0.025em, 0); }
    }

    @keyframes glitch-bottom {
      0% { clip-path: polygon(0 56%, 100% 56%, 100% 83%, 0 83%); transform: translate(0.03em, 0.006em); }
      28% { clip-path: polygon(0 64%, 100% 64%, 100% 92%, 0 92%); transform: translate(0.06em, 0.012em); }
      51% { clip-path: polygon(0 44%, 100% 44%, 100% 70%, 0 70%); transform: translate(-0.01em, -0.004em); }
      76% { clip-path: polygon(0 72%, 100% 72%, 100% 96%, 0 96%); transform: translate(0.045em, -0.01em); }
      100% { clip-path: polygon(0 58%, 100% 58%, 100% 80%, 0 80%); transform: translate(0.03em, 0.006em); }
    }

    @keyframes bar-flicker {
      0%, 35%, 42%, 72%, 100% { transform: translateX(0); opacity: 0.92; }
      36% { transform: translateX(14px); opacity: 0.45; }
      37% { transform: translateX(-9px); opacity: 1; }
      73% { transform: translateX(-12px); opacity: 0.35; }
      74% { transform: translateX(6px); opacity: 0.96; }
    }

    @keyframes artifact-flicker {
      0%, 58%, 100% { opacity: 0.72; transform: translateX(0); }
      59% { opacity: 0.2; transform: translateX(16px); }
      60% { opacity: 0.95; transform: translateX(-8px); }
      78% { opacity: 0.4; transform: translateX(10px); }
      79% { opacity: 0.82; transform: translateX(0); }
    }

    @media (max-width: 900px) {
      body { overflow: auto; }
      .error-page { min-height: 100dvh; }
      .stage {
        left: 63%;
        width: max(125vw, 177.7778vh);
      }
      .copy {
        top: clamp(3.5rem, 10vh, 6rem);
        left: 1.4rem;
        right: 1.4rem;
        width: auto;
      }
      .error-code { font-size: clamp(6.4rem, 30vw, 10.5rem); }
      .title { max-width: 20rem; }
      .description { max-width: 21rem; }
      .home-link { min-width: 10.8rem; }
      .artifact-a, .artifact-b, .artifact-c { display: none; }
    }

    @media (max-width: 520px) {
      .background { filter: saturate(0.78) brightness(0.62) contrast(1.04); }
      .tone {
        background:
          linear-gradient(180deg, rgba(12, 14, 38, 0.78) 0%, rgba(18, 20, 52, 0.48) 35%, rgba(18, 20, 52, 0.62) 100%),
          linear-gradient(90deg, rgba(13, 15, 42, 0.78), rgba(13, 15, 42, 0.18));
      }
      .copy { top: 3.75rem; }
      .description { font-weight: 600; }
      .lens-error, .tear, .frown { opacity: 0.65; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
    }
  
`;

export default function NotFound() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = pageTitle;

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <>
      <style>{notFoundStyles}</style>
      <main className="error-page" aria-labelledby="page-title">
        <div className="stage" aria-hidden="true">
          <div className="background" />
          <div className="tone" />
          <div className="scanlines" />
          <div className="noise" />
          <div className="lens-error" />
          <div className="tear" />
          <div className="frown" />
          <span className="artifact artifact-a" />
          <span className="artifact artifact-b" />
          <span className="artifact artifact-c" />
          <span className="artifact artifact-d" />
          <span className="artifact artifact-e" />
        </div>

        <section className="copy">
          <div className="code-wrap" aria-label="404">
            <p className="error-code" data-text="404" aria-hidden="true">
              404
            </p>
            <span className="bar bar-a bar-cyan" />
            <span className="bar bar-b bar-pink" />
            <span className="bar bar-c bar-violet" />
            <span className="bar bar-d bar-cyan" />
            <span className="bar bar-e bar-pink" />
          </div>
          <h1 className="title" id="page-title">
            Trang không tìm thấy
          </h1>
          <p className="description">
            Dường như chú gấu trúc đã đi lạc.
            <br />
            Vui lòng quay lại.
          </p>
          <a className="home-link" href="/" aria-label="Quay về trang chủ">
            Về trang chủ
          </a>
        </section>
      </main>
    </>
  );
}
