"use client";

import { useEffect } from "react";

export function EffectsLayer() {
  useEffect(() => {
    const clickableSelector = "a.button, button, .tab, .discover-item, .card, .menu-card, .footer-link";
    const observedRevealTargets = new WeakSet<HTMLElement>();
    const observedCountTargets = new WeakSet<HTMLElement>();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.14 }
    );

    const countObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          const end = Number(target.dataset.count || "0");
          const suffix = target.dataset.countSuffix || "";
          const decimals = Number.isInteger(end) ? 0 : 1;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / 1200, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            target.textContent = `${(end * eased).toFixed(decimals)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          countObserver.unobserve(target);
        }
      },
      { threshold: 0.35 }
    );

    function observePageEffects(root: ParentNode = document) {
      const revealTargets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
      const countTargets = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));

      revealTargets.forEach((target, index) => {
        if (observedRevealTargets.has(target)) return;
        observedRevealTargets.add(target);
        target.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
        revealObserver.observe(target);
      });

      countTargets.forEach((target) => {
        if (observedCountTargets.has(target)) return;
        observedCountTargets.add(target);
        countObserver.observe(target);
      });
    }

    observePageEffects();
    document.documentElement.classList.add("js-enabled");

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches("[data-reveal], [data-count]")) {
            observePageEffects(node.parentElement || document);
          } else {
            observePageEffects(node);
          }
        }
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(clickableSelector) as HTMLElement | null;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "click-ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      target.appendChild(ripple);

      window.setTimeout(() => ripple.remove(), 620);
    };

    document.addEventListener("click", onClick, { passive: true });

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
      mutationObserver.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
