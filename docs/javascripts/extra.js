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
    schedulePlaceGridLayout();
  });
}
