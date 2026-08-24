const visitedCities = [
  { city: "오키나와", country: "일본", flag: "🇯🇵", years: "2013", coordinates: [26.2124, 127.6809] },
  { city: "런던", country: "영국", flag: "🇬🇧", years: "2013–2014", coordinates: [51.5074, -0.1278] },
  { city: "맨체스터", country: "영국", flag: "🇬🇧", years: "2013–2014", coordinates: [53.4808, -2.2426] },
  { city: "리버풀", country: "영국", flag: "🇬🇧", years: "2013–2014", coordinates: [53.4084, -2.9916] },
  { city: "파리", country: "프랑스", flag: "🇫🇷", years: "2013–2014", coordinates: [48.8566, 2.3522] },
  { city: "니스", country: "프랑스", flag: "🇫🇷", years: "2013–2014", coordinates: [43.7102, 7.262] },
  { city: "바르셀로나", country: "스페인", flag: "🇪🇸", years: "2013–2014", coordinates: [41.3874, 2.1686] },
  { city: "포르투", country: "포르투갈", flag: "🇵🇹", years: "2013–2014", coordinates: [41.1579, -8.6291] },
  { city: "마드리드", country: "스페인", flag: "🇪🇸", years: "2013–2014", coordinates: [40.4168, -3.7038] },
  { city: "암스테르담", country: "네덜란드", flag: "🇳🇱", years: "2016", coordinates: [52.3676, 4.9041] },
  { city: "로테르담", country: "네덜란드", flag: "🇳🇱", years: "2016", coordinates: [51.9244, 4.4777] },
  { city: "브뤼셀", country: "벨기에", flag: "🇧🇪", years: "2016", coordinates: [50.8503, 4.3517] },
  { city: "브뤼허", country: "벨기에", flag: "🇧🇪", years: "2016", coordinates: [51.2093, 3.2247] },
  { city: "룩셈부르크", country: "룩셈부르크", flag: "🇱🇺", years: "2016", coordinates: [49.6116, 6.1319] },
  { city: "부다페스트", country: "헝가리", flag: "🇭🇺", years: "2016", coordinates: [47.4979, 19.0402] },
  { city: "빈", country: "오스트리아", flag: "🇦🇹", years: "2016", coordinates: [48.2082, 16.3738] },
  { city: "잘츠부르크", country: "오스트리아", flag: "🇦🇹", years: "2016", coordinates: [47.8095, 13.055] },
  { city: "뮌헨", country: "독일", flag: "🇩🇪", years: "2016 · 2026", coordinates: [48.1351, 11.582] },
  { city: "드레스덴", country: "독일", flag: "🇩🇪", years: "2016", coordinates: [51.0504, 13.7373] },
  { city: "프라하", country: "체코", flag: "🇨🇿", years: "2016", coordinates: [50.0755, 14.4378] },
  { city: "시애틀", country: "미국", flag: "🇺🇸", years: "2019", coordinates: [47.6062, -122.3321] },
  { city: "밴쿠버", country: "캐나다", flag: "🇨🇦", years: "2019", coordinates: [49.2827, -123.1207] },
  { city: "밴프", country: "캐나다", flag: "🇨🇦", years: "2019", coordinates: [51.1784, -115.5708] },
  { city: "토론토", country: "캐나다", flag: "🇨🇦", years: "2019", coordinates: [43.6532, -79.3832] },
  { city: "오타와", country: "캐나다", flag: "🇨🇦", years: "2019", coordinates: [45.4215, -75.6972] },
  { city: "몬트리올", country: "캐나다", flag: "🇨🇦", years: "2019", coordinates: [45.5019, -73.5674] },
  { city: "퀘벡", country: "캐나다", flag: "🇨🇦", years: "2019", coordinates: [46.8139, -71.208] },
  { city: "뉴욕", country: "미국", flag: "🇺🇸", years: "2019", coordinates: [40.7128, -74.006] },
  { city: "마이애미", country: "미국", flag: "🇺🇸", years: "2021", coordinates: [25.7617, -80.1918] },
  { city: "오사카", country: "일본", flag: "🇯🇵", years: "2022", coordinates: [34.6937, 135.5023] },
  { city: "교토", country: "일본", flag: "🇯🇵", years: "2022", coordinates: [35.0116, 135.7681] },
  { city: "롱비치", country: "미국", flag: "🇺🇸", years: "2022", coordinates: [33.7701, -118.1937] },
  { city: "나고야", country: "일본", flag: "🇯🇵", years: "2023", coordinates: [35.1815, 136.9066] },
  { city: "디트로이트", country: "미국", flag: "🇺🇸", years: "2023", coordinates: [42.3314, -83.0458] },
  { city: "오스틴", country: "미국", flag: "🇺🇸", years: "2023", coordinates: [30.2672, -97.7431] },
  { city: "아부다비", country: "아랍에미리트", flag: "🇦🇪", years: "2024", coordinates: [24.4539, 54.3773] },
  { city: "샌프란시스코 01 · 02", country: "미국", flag: "🇺🇸", years: "2024", coordinates: [37.7749, -122.4194] },
  { city: "상하이", country: "중국", flag: "🇨🇳", years: "2025", coordinates: [31.2304, 121.4737] },
  { city: "항저우", country: "중국", flag: "🇨🇳", years: "2025", coordinates: [30.2741, 120.1551] },
  { city: "라스베이거스", country: "미국", flag: "🇺🇸", years: "2026", coordinates: [36.1699, -115.1398] },
  { city: "베이징", country: "중국", flag: "🇨🇳", years: "2026", coordinates: [39.9042, 116.4074] },
  { city: "취리히", country: "스위스", flag: "🇨🇭", years: "2026", coordinates: [47.3769, 8.5417] },
  { city: "루체른", country: "스위스", flag: "🇨🇭", years: "2026", coordinates: [47.0502, 8.3093] },
  { city: "인터라켄", country: "스위스", flag: "🇨🇭", years: "2026", coordinates: [46.6863, 7.8632] },
  { city: "체르마트", country: "스위스", flag: "🇨🇭", years: "2026", coordinates: [46.0207, 7.7491] },
  { city: "로잔", country: "스위스", flag: "🇨🇭", years: "2026", coordinates: [46.5197, 6.6323] },
];

function createVisitedCityPopup(place) {
  const content = document.createElement("div");
  const title = document.createElement("strong");
  const details = document.createElement("span");

  title.textContent = `${place.flag} ${place.city}`;
  details.textContent = `${place.years} · ${place.country}`;
  content.append(title, details);

  return content;
}

function initializeVisitedMap() {
  const mapElement = document.querySelector("#travel-map");

  if (!mapElement || mapElement.dataset.mapReady || typeof L === "undefined") return;

  mapElement.dataset.mapReady = "true";

  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    worldCopyJump: true,
    zoomDelta: 0.5,
    zoomSnap: 0.5,
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const bounds = [];

  visitedCities.forEach((place) => {
    L.circleMarker(place.coordinates, {
      radius: 6,
      color: "#ffffff",
      weight: 2,
      fillColor: "#e9663d",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup(createVisitedCityPopup(place));

    bounds.push(place.coordinates);
  });

  map.fitBounds(bounds, { padding: [24, 24] });
  map.panBy([0, 40], { animate: false });
}

initializeVisitedMap();

if (typeof document$ !== "undefined") {
  document$.subscribe(initializeVisitedMap);
}
