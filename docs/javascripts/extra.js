function enableHeaderHomeLink() {
  const title = document.querySelector(".md-header__title");
  const homeLink = document.querySelector(".md-header__button.md-logo");

  if (!title || !homeLink || title.dataset.homeLinkReady) return;

  title.dataset.homeLinkReady = "true";
  title.setAttribute("role", "link");
  title.setAttribute("tabindex", "0");
  title.setAttribute("aria-label", "Atlas36 홈으로 이동");

  const goHome = () => window.location.assign(homeLink.href);

  title.addEventListener("click", goHome);
  title.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goHome();
    }
  });
}

function configureMapNavigation() {
  const homeLink = document.querySelector(".md-header__button.md-logo");
  const primaryLinks = document.querySelectorAll(
    ".md-nav--primary > .md-nav__list > .md-nav__item > .md-nav__link",
  );

  if (!homeLink) return;

  primaryLinks.forEach((link) => {
    if (link.textContent.trim() !== "지도") return;

    const mapUrl = new URL(homeLink.href);
    mapUrl.hash = "visited-map";
    link.href = mapUrl.href;
  });
}

function configurePrimaryNavigation() {
  const alwaysOpenLabels = new Set(["장소", "테마파크"]);
  const sections = document.querySelectorAll(
    ".md-nav--primary > .md-nav__list > .md-nav__item--section",
  );

  sections.forEach((section) => {
    const label = section.querySelector(":scope > .md-nav__link");
    const name = label?.textContent.trim();

    section.classList.toggle("nav-section--always-open", alwaysOpenLabels.has(name));
    section.classList.toggle("nav-section--collapsible", name === "기록");

    if (name === "기록") {
      const toggle = section.querySelector(":scope > .md-nav__toggle");
      const navigation = section.querySelector(":scope > .md-nav");

      if (!toggle || !label || section.dataset.collapsibleReady) return;

      section.dataset.collapsibleReady = "true";
      toggle.checked = false;
      section.classList.remove("nav-section--expanded");

      const toggleHistory = () => {
        const expanded = !section.classList.contains("nav-section--expanded");
        section.classList.toggle("nav-section--expanded", expanded);
        toggle.checked = expanded;
        navigation?.setAttribute("aria-expanded", String(expanded));
      };

      label.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleHistory();
      }, { capture: true });

      label.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopImmediatePropagation();
          toggleHistory();
        }
      }, { capture: true });
    }
  });
}

let masonryTimer;

function layoutCardGrids() {
  const grids = document.querySelectorAll(".place-grid, .history-grid");

  grids.forEach((grid) => {
    const cards = grid.querySelectorAll(":scope > .destination-card");
    cards.forEach((card) => card.style.removeProperty("grid-row-end"));

    if (window.matchMedia("(max-width: 44.984375em)").matches) {
      grid.style.removeProperty("grid-auto-rows");
      return;
    }

    const rowHeight = 4;
    const gap = Number.parseFloat(window.getComputedStyle(grid).rowGap) || 0;
    grid.style.gridAutoRows = `${rowHeight}px`;

    cards.forEach((card) => {
      const height = card.getBoundingClientRect().height;
      const rowSpan = Math.ceil((height + gap) / (rowHeight + gap));
      card.style.gridRowEnd = `span ${rowSpan}`;
    });
  });
}

function schedulePlaceGridLayout() {
  window.clearTimeout(masonryTimer);
  masonryTimer = window.setTimeout(layoutCardGrids, 50);
}

enableHeaderHomeLink();
configureMapNavigation();
configurePrimaryNavigation();
schedulePlaceGridLayout();

if (!window.placeGridResizeReady) {
  window.placeGridResizeReady = true;
  window.addEventListener("resize", schedulePlaceGridLayout);
}

if (document.fonts) {
  document.fonts.ready.then(schedulePlaceGridLayout);
}

if (typeof document$ !== "undefined") {
  document$.subscribe(() => {
    enableHeaderHomeLink();
    configureMapNavigation();
    configurePrimaryNavigation();
    schedulePlaceGridLayout();
  });
}
