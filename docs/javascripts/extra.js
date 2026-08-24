function enableHeaderHomeLink() {
  const title = document.querySelector(".md-header__title");
  const homeLink = document.querySelector(".md-header__button.md-logo");

  if (!title || !homeLink || title.dataset.homeLinkReady) return;

  title.dataset.homeLinkReady = "true";
  title.setAttribute("role", "link");
  title.setAttribute("tabindex", "0");
  title.setAttribute("aria-label", "여행 노트 홈으로 이동");

  const goHome = () => window.location.assign(homeLink.href);

  title.addEventListener("click", goHome);
  title.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goHome();
    }
  });
}

enableHeaderHomeLink();

if (typeof document$ !== "undefined") {
  document$.subscribe(enableHeaderHomeLink);
}
