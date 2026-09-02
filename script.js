(function () {
  const AED_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344.84 299.91" aria-hidden="true"><path fill="currentColor" d="M342.14,140.96l2.7,2.54v-7.72c0-17-11.92-30.84-26.56-30.84h-23.41C278.49,36.7,222.69,0,139.68,0c-52.86,0-59.65,0-109.71,0,0,0,15.03,12.63,15.03,52.4v52.58h-27.68c-5.38,0-10.43-2.08-14.61-6.01l-2.7-2.54v7.72c0,17.01,11.92,30.84,26.56,30.84h18.44s0,29.99,0,29.99h-27.68c-5.38,0-10.43-2.07-14.61-6.01l-2.7-2.54v7.71c0,17,11.92,30.82,26.56,30.82h18.44s0,54.89,0,54.89c0,38.65-15.03,50.06-15.03,50.06h109.71c85.62,0,139.64-36.96,155.38-104.98h32.46c5.38,0,10.43,2.07,14.61,6l2.7,2.54v-7.71c0-17-11.92-30.83-26.56-30.83h-18.9c.32-4.88.49-9.87.49-15s-.18-10.11-.51-14.99h28.17c5.37,0,10.43,2.07,14.61,6.01ZM89.96,15.01h45.86c61.7,0,97.44,27.33,108.1,89.94l-153.96.02V15.01ZM136.21,284.93h-46.26v-89.98l153.87-.02c-9.97,56.66-42.07,88.38-107.61,90ZM247.34,149.96c0,5.13-.11,10.13-.34,14.99l-157.04.02v-29.99l157.05-.02c.22,4.84.33,9.83.33,15Z"/></svg>';

  const UI_STRINGS = {
    en: { search: "Search", noResults: "No items found.", brand: "Shot Specialty Cafe" },
    ar: { search: "بحث", noResults: "لا توجد نتائج.", brand: "شوت كافيه" },
  };

  let currentLang = "en";
  let activeCategoryId = MENU_DATA[0].id;

  const navEl = document.getElementById("category-nav");
  const mainEl = document.getElementById("menu-main");
  const searchInput = document.getElementById("search-input");
  const searchBar = document.getElementById("search-bar");
  const searchToggle = document.getElementById("search-toggle");
  const searchEmpty = document.getElementById("search-empty");
  const brandEl = document.getElementById("brand-name");
  const footerBrandEl = document.getElementById("footer-brand");

  function renderNav() {
    navEl.innerHTML = "";
    MENU_DATA.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cat-item" + (cat.id === activeCategoryId ? " active" : "");
      btn.dataset.catId = cat.id;

      const icon = document.createElement("div");
      icon.className = "cat-icon" + (cat.isNewBadge ? " new-badge" : "");
      if (cat.isNewBadge) {
        icon.textContent = currentLang === "ar" ? "جديد" : "NEW";
      } else {
        const img = document.createElement("img");
        img.src = cat.icon;
        img.alt = "";
        img.loading = "lazy";
        icon.appendChild(img);
      }

      const label = document.createElement("span");
      label.className = "cat-label";
      label.textContent = currentLang === "ar" ? cat.nameAr : cat.name;

      btn.appendChild(icon);
      btn.appendChild(label);
      btn.addEventListener("click", () => selectCategory(cat.id));
      navEl.appendChild(btn);
    });
  }

  function itemRow(item) {
    const row = document.createElement("div");
    row.className = "item-row";

    const imgWrap = document.createElement("div");
    if (item.img) {
      imgWrap.className = "item-img";
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.name;
      img.loading = "lazy";
      imgWrap.appendChild(img);
    } else {
      imgWrap.className = "item-img empty";
    }

    const body = document.createElement("div");
    body.className = "item-body";

    const name = document.createElement("h3");
    name.className = "item-name";
    name.textContent = currentLang === "ar" && item.nameAr ? item.nameAr : item.name;

    const desc = document.createElement("p");
    desc.className = "item-desc";
    desc.textContent = currentLang === "ar" && item.descAr ? item.descAr : item.desc;

    const price = document.createElement("div");
    price.className = "item-price";
    price.innerHTML = AED_SVG + " " + item.price;

    body.appendChild(name);
    body.appendChild(desc);
    body.appendChild(price);

    row.appendChild(imgWrap);
    row.appendChild(body);
    return row;
  }

  function renderSections() {
    mainEl.innerHTML = "";
    MENU_DATA.forEach((cat) => {
      const section = document.createElement("section");
      section.className = "category-section" + (cat.id === activeCategoryId ? " active" : "");
      section.dataset.catId = cat.id;

      const title = document.createElement("h2");
      title.className = "category-title";
      title.textContent = currentLang === "ar" ? cat.nameAr : cat.name;
      section.appendChild(title);

      cat.items.forEach((item) => section.appendChild(itemRow(item)));
      mainEl.appendChild(section);
    });
  }

  function selectCategory(catId) {
    activeCategoryId = catId;
    searchInput.value = "";
    renderNav();
    renderSections();
    mainEl.hidden = false;
    searchEmpty.hidden = true;
  }

  function runSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      renderSections();
      mainEl.hidden = false;
      searchEmpty.hidden = true;
      return;
    }

    mainEl.innerHTML = "";
    let found = 0;

    MENU_DATA.forEach((cat) => {
      const matches = cat.items.filter((item) =>
        item.name.toLowerCase().includes(q) || (item.nameAr && item.nameAr.includes(query.trim()))
      );
      if (!matches.length) return;

      const section = document.createElement("section");
      section.className = "category-section active";

      const title = document.createElement("h2");
      title.className = "category-title";
      title.textContent = currentLang === "ar" ? cat.nameAr : cat.name;
      section.appendChild(title);

      matches.forEach((item) => section.appendChild(itemRow(item)));
      mainEl.appendChild(section);
      found += matches.length;
    });

    mainEl.hidden = found === 0;
    searchEmpty.hidden = found !== 0;
  }

  function setLang(lang) {
    currentLang = lang;
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    brandEl.textContent = UI_STRINGS[lang].brand;
    footerBrandEl.textContent = UI_STRINGS[lang].brand;
    searchInput.placeholder = UI_STRINGS[lang].search;
    searchEmpty.textContent = UI_STRINGS[lang].noResults;

    renderNav();
    if (searchInput.value.trim()) {
      runSearch(searchInput.value);
    } else {
      renderSections();
    }
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  searchToggle.addEventListener("click", () => {
    searchBar.hidden = !searchBar.hidden;
    if (!searchBar.hidden) searchInput.focus();
  });

  searchInput.addEventListener("input", () => runSearch(searchInput.value));

  renderNav();
  renderSections();
})();
