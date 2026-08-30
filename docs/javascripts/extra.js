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
    link.classList.add("nav-map-link");
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

function configureOverviewNavigation() {
  const homeLink = document.querySelector(".md-header__button.md-logo");
  if (!homeLink) return;

  const overviewSections = document.querySelectorAll(
    ".md-nav--primary .md-nav__item--nested",
  );

  overviewSections.forEach((section) => {
    const label = section.querySelector(":scope > .md-nav__link");
    const name = label?.querySelector(".md-ellipsis")?.textContent.trim();
    const directOverviewPaths = {
      "대한민국": "places/korea/korea/",
      "일본": "places/japan/japan/",
      "Disney Parks": "theme-parks/disney/disney-parks/",
      "Disneyland Resort": "theme-parks/disney/disneyland-resort/",
      "Walt Disney World": "theme-parks/disney/walt-disney-world/",
      "Tokyo Disney Resort": "theme-parks/disney/tokyo-disney-resort/",
      "Disneyland Paris": "theme-parks/disney/disneyland-paris/",
      "Universal Studios": "theme-parks/universal/universal-studios/",
      "Orlando Resort": "theme-parks/universal/universal-orlando-resort/",
    };
    const overviewHref = directOverviewPaths[name]
      ? new URL(directOverviewPaths[name], homeLink.href).href
      : null;

    if (!label || !overviewHref || section.dataset.overviewLinkReady) return;

    section.dataset.overviewLinkReady = "true";
    label.setAttribute("aria-label", `${name} 페이지로 이동`);

    label.addEventListener("click", (event) => {
      if (event.target.closest(".md-nav__icon")) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(overviewHref);
    }, { capture: true });

    label.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(overviewHref);
    }, { capture: true });
  });
}

function showLastUpdatedTime() {
  const content = document.querySelector(".md-content__inner");
  if (!content) return;

  const source = content.querySelector(".page-updated-source");
  const pageUpdatedTime = source?.dataset.updated;
  if (!pageUpdatedTime) return;

  let updated = content.querySelector(".page-updated");
  if (!updated) {
    updated = document.createElement("p");
    updated.className = "page-updated";
    content.append(updated);
  }

  updated.textContent = `Last updated: ${pageUpdatedTime}`;
  source.remove();
}

const exchangeCurrencies = ["USD", "EUR", "CHF", "JPY", "CNY", "SGD"];
let exchangeRateCache;
let exchangeRateCacheKey;
const exchangeHistoryCache = {};
const svgNamespace = "http://www.w3.org/2000/svg";
const exchangeRateStorageKey = "atlas36-exchange-rates";
const exchangeHistoryStoragePrefix = "atlas36-exchange-history-";

function getExchangeCycleKey(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
  const beforeCheckTime = Number(parts.hour) * 60 + Number(parts.minute) < 9 * 60 + 30;
  const cycleDate = beforeCheckTime ? new Date(date.getTime() - 24 * 60 * 60 * 1000) : date;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(cycleDate);
}

function readStoredExchangeData(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch {
    return null;
  }
}

function storeExchangeData(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 공간을 사용할 수 없어도 현재 페이지의 환율 표시는 유지합니다.
  }
}

function renderExchangeRates(data) {
  const updated = document.querySelector("#exchange-updated");
  if (!updated || !data?.rates) return;

  exchangeCurrencies.forEach((currency) => {
    const card = document.querySelector(`.exchange-card[data-currency="${currency}"]`);
    const value = card?.querySelector("strong");
    const rate = data.rates[currency];
    if (!value || !rate) return;

    const unit = currency === "JPY" ? 100 : 1;
    const won = unit / rate;
    value.textContent = `${Math.round(won).toLocaleString("ko-KR")}원`;
  });

  const timestamp = data.timestamp ? new Date(data.timestamp * 1000) : new Date();
  updated.textContent = `${timestamp.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: "Asia/Seoul",
  })} 기준 · 매일 09:30 KST 확인`;
}

async function updateExchangeRates() {
  const panel = document.querySelector(".exchange-panel");
  if (!panel) return;

  const cycleKey = getExchangeCycleKey();
  const stored = readStoredExchangeData(exchangeRateStorageKey);

  if (exchangeRateCache && exchangeRateCacheKey === cycleKey) {
    renderExchangeRates(exchangeRateCache);
    return;
  }

  if (stored?.cycleKey === cycleKey && stored.data) {
    exchangeRateCache = stored.data;
    exchangeRateCacheKey = cycleKey;
    renderExchangeRates(exchangeRateCache);
    return;
  }

  if (exchangeRateCache) renderExchangeRates(exchangeRateCache);

  try {
    const response = await fetch(
      "https://ratata.money/api/v1/rates/latest?base=KRW&symbols=USD,EUR,CHF,JPY,CNY,SGD",
    );
    if (!response.ok) throw new Error("Exchange rate request failed");
    exchangeRateCache = await response.json();
    exchangeRateCacheKey = cycleKey;
    storeExchangeData(exchangeRateStorageKey, { cycleKey, data: exchangeRateCache });
    renderExchangeRates(exchangeRateCache);
  } catch {
    const updated = document.querySelector("#exchange-updated");
    if (updated && !exchangeRateCache) updated.textContent = "환율을 불러올 수 없음";
  }
}

function appendSvgElement(parent, name, attributes = {}, textContent = "") {
  const element = document.createElementNS(svgNamespace, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (textContent) element.textContent = textContent;
  parent.append(element);
  return element;
}

function renderExchangeChart(currency, points) {
  const svg = document.querySelector(`[data-exchange-chart="${currency}"]`);
  if (!svg || !points?.length) return;

  svg.replaceChildren();
  const unit = currency === "JPY" ? 100 : 1;
  const values = points.map((point) => ({
    date: point.date,
    value: unit / point.rate,
  }));
  const width = 120;
  const height = 52;
  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const rawMin = Math.min(...values.map((point) => point.value));
  const rawMax = Math.max(...values.map((point) => point.value));
  const range = rawMax - rawMin || rawMax * 0.01 || 1;
  const min = rawMin - range * 0.12;
  const max = rawMax + range * 0.12;
  const x = (index) => padding + (index / Math.max(values.length - 1, 1)) * chartWidth;
  const y = (value) => padding + ((max - value) / (max - min)) * chartHeight;

  const polyline = appendSvgElement(svg, "polyline", {
    points: values.map((point, index) => `${x(index)},${y(point.value)}`).join(" "),
    class: "exchange-chart-line",
  });
  polyline.setAttribute("aria-hidden", "true");

  const unitLabel = currency === "JPY" ? "100 JPY" : `1 ${currency}`;
  svg.setAttribute("aria-label", `최근 1년 ${unitLabel} 원화 환율 일별 그래프`);
}

async function updateExchangeChart(currency) {
  const svg = document.querySelector(`[data-exchange-chart="${currency}"]`);
  if (!svg) return;

  const cycleKey = getExchangeCycleKey();
  const storageKey = `${exchangeHistoryStoragePrefix}${currency}`;
  const stored = readStoredExchangeData(storageKey);

  if (exchangeHistoryCache[currency]?.cycleKey === cycleKey) {
    renderExchangeChart(currency, exchangeHistoryCache[currency].points);
    return;
  }

  if (stored?.cycleKey === cycleKey && stored.points) {
    exchangeHistoryCache[currency] = stored;
    renderExchangeChart(currency, stored.points);
    return;
  }

  try {
    const response = await fetch(
      `https://ratata.money/api/v1/rates/history?base=KRW&symbol=${currency}&range=1y`,
    );
    if (!response.ok) throw new Error("Exchange rate history request failed");
    const data = await response.json();
    exchangeHistoryCache[currency] = { cycleKey, points: data.points };
    storeExchangeData(storageKey, exchangeHistoryCache[currency]);
    renderExchangeChart(currency, data.points);
  } catch {
    svg.setAttribute("aria-label", `${currency} 그래프를 불러올 수 없음`);
  }
}

function configureExchangeChart() {
  const chartGrid = document.querySelector(".exchange-grid");
  if (!chartGrid || chartGrid.dataset.ready) return;

  chartGrid.dataset.ready = "true";
  exchangeCurrencies.forEach(updateExchangeChart);
}

function scheduleDailyExchangeRefresh() {
  const now = new Date();
  const koreaNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  let nextCheck = Date.UTC(
    koreaNow.getUTCFullYear(),
    koreaNow.getUTCMonth(),
    koreaNow.getUTCDate(),
    0,
    30,
  );
  if (nextCheck <= now.getTime()) nextCheck += 24 * 60 * 60 * 1000;

  window.setTimeout(() => {
    exchangeRateCache = undefined;
    exchangeRateCacheKey = undefined;
    Object.keys(exchangeHistoryCache).forEach((currency) => delete exchangeHistoryCache[currency]);
    updateExchangeRates();
    exchangeCurrencies.forEach(updateExchangeChart);
    scheduleDailyExchangeRefresh();
  }, nextCheck - now.getTime());
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
configureOverviewNavigation();
showLastUpdatedTime();
updateExchangeRates();
configureExchangeChart();
schedulePlaceGridLayout();

if (!window.placeGridResizeReady) {
  window.placeGridResizeReady = true;
  window.addEventListener("resize", schedulePlaceGridLayout);
}

if (document.fonts) {
  document.fonts.ready.then(schedulePlaceGridLayout);
}

if (!window.exchangeRateRefreshReady) {
  window.exchangeRateRefreshReady = true;
  scheduleDailyExchangeRefresh();
}

if (typeof document$ !== "undefined") {
  document$.subscribe(() => {
    enableHeaderHomeLink();
    configureMapNavigation();
    configurePrimaryNavigation();
    configureOverviewNavigation();
    showLastUpdatedTime();
    updateExchangeRates();
    configureExchangeChart();
    schedulePlaceGridLayout();
  });
}
