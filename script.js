// --- Hamburger menu ---
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// --- Mini-galerie ---
document.querySelectorAll(".gallery-section").forEach((section) => {
  const track = section.querySelector(".gallery-track");
  const prev = section.querySelector(".prev");
  const next = section.querySelector(".next");
  const imgs = Array.from(track.querySelectorAll("img"));
  if (!track || !imgs.length) return;

  let currentIndex = 0;

  function updateArrows() {
    if (prev) prev.style.display = currentIndex > 0 ? "block" : "none";
    if (next) next.style.display = currentIndex < imgs.length - 1 ? "block" : "none";
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, imgs.length - 1));
    track.classList.add("disable-hover");
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateArrows();
    setTimeout(() => track.classList.remove("disable-hover"), 400);
  }

  if (prev) prev.addEventListener("click", () => goTo(currentIndex - 1));
  if (next) next.addEventListener("click", () => goTo(currentIndex + 1));

  function keyHandler(e) {
    if (e.key === "ArrowLeft") goTo(currentIndex - 1);
    if (e.key === "ArrowRight") goTo(currentIndex + 1);
  }

  section.addEventListener("mouseenter", () => {
    document.addEventListener("keydown", keyHandler);
  });
  section.addEventListener("mouseleave", () => {
    document.removeEventListener("keydown", keyHandler);
  });

  goTo(0);
});


// --- Lightbox ---
(() => {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCaption = document.getElementById("lightbox-caption");
  const lbCounter = document.getElementById("lightbox-counter");
  const btnClose = document.getElementById("lightbox-close");
  const btnPrev = document.getElementById("lightbox-prev");
  const btnNext = document.getElementById("lightbox-next");

  // 🔹 Wykrywanie języka na podstawie nazwy pliku:
  const isEnglish = window.location.pathname.includes("-en.html");

  const allImgs = Array.from(document.querySelectorAll("img[data-full]"));
  if (!lightbox || !lbImg || !allImgs.length) return;

  const imgData = allImgs.map((img) => ({
    el: img,
    full: img.getAttribute("data-full") || img.src,
    caption: img.alt || "",
    gallery: img.getAttribute("data-gallery") || "default",
  }));

  let currentGallery = [];
  let currentIndex = 0;
  let isOpen = false;

  function updateArrows() {
    if (!currentGallery.length) return;
    btnPrev.style.display = currentIndex > 0 ? "flex" : "none";
    btnNext.style.display = currentIndex < currentGallery.length - 1 ? "flex" : "none";
  }

  function openLightbox(index, galleryItems) {
    currentGallery = galleryItems;
    currentIndex = index;
    const item = currentGallery[index];
    if (!item) return;

    lbImg.src = item.full;
    lbImg.alt = item.caption;
    lbCaption.textContent = item.caption || "";
    // 🔹 Zmieniony tekst zależnie od języka:
    lbCounter.textContent = isEnglish
      ? `Image ${index + 1} of ${galleryItems.length}`
      : `Obraz ${index + 1} z ${galleryItems.length}`;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    isOpen = true;
    updateArrows();

    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    lbCaption.textContent = "";
    lbCounter.textContent = "";
    isOpen = false;
    document.body.style.overflow = "";
  }

  function showNext() {
    if (currentIndex < currentGallery.length - 1) {
      currentIndex++;
      openLightbox(currentIndex, currentGallery);
    }
  }

  function showPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      openLightbox(currentIndex, currentGallery);
    }
  }

  imgData.forEach((item) => {
    item.el.style.cursor = "zoom-in";
    item.el.addEventListener("click", (e) => {
      e.preventDefault();
      const group = item.gallery;
      const groupItems = imgData.filter((im) => im.gallery === group);
      const indexInGroup = groupItems.findIndex((im) => im.el === item.el);
      openLightbox(indexInGroup, groupItems);
    });
  });

  btnClose.addEventListener("click", closeLightbox);
  btnPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });
  btnNext.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  lbImg.addEventListener("dragstart", (e) => e.preventDefault());
})();


//próba tekstu przeniesienia
function reorderAboutTitle() {
  const title = document.querySelector('.about-details-container .title') || 
                document.querySelector('.section-container > .title');
  const photoContainer = document.querySelector('.plain-container2pl');
  const aboutWrap = document.querySelector('.about-details-container');
  const section = document.querySelector('.section-container');

  if (!title || !photoContainer || !aboutWrap || !section) return;

  const breakpoint = 1200; // 75em ≈ 1200px, możesz zmienić jeśli chcesz

  if (window.innerWidth <= breakpoint) {
    // === Wąski ekran: tytuł nad zdjęcie ===
    if (title.parentElement !== section) {
      section.insertBefore(title, photoContainer);
    }
  } else {
    // === Szeroki ekran: tytuł wraca do kontenera ===
    if (title.parentElement !== aboutWrap) {
      aboutWrap.insertBefore(title, aboutWrap.firstChild);
    }
  }
}

// Uruchom przy starcie i przy zmianie rozmiaru
window.addEventListener('load', reorderAboutTitle);
window.addEventListener('resize', reorderAboutTitle);

function reorderAboutTitleEn() {
  const photoContainer = document.querySelector('.plain-container2');
  const aboutWrap = document.querySelector('.about-details-container');
  const section = document.querySelector('.section-container');
  if (!photoContainer || !aboutWrap || !section) return;

  const breakpoint = 1200;

  // Szukamy elementów niezależnie od ich aktualnego położenia:
  const title = document.querySelector('.title');
  const subtitle = document.querySelector('.section__text__p1');
  if (!title || !subtitle) return;

  // Szukamy istniejącego wrappera (jeśli wcześniej został utworzony)
  const existingWrapper = document.querySelector('.title-block');

  if (window.innerWidth <= breakpoint) {
    // === Wąski ekran: przenieś tytuł + podtytuł nad zdjęcie ===
    if (!existingWrapper) {
      const wrapper = document.createElement('div');
      wrapper.className = 'title-block';
      wrapper.appendChild(subtitle);
      wrapper.appendChild(title);
      section.insertBefore(wrapper, photoContainer);
    }
  } else {
    // === Szeroki ekran: przywróć elementy do .about-details-container ===
    if (existingWrapper) {
      aboutWrap.insertBefore(subtitle, aboutWrap.firstChild);
      aboutWrap.insertBefore(title, subtitle.nextSibling);
      existingWrapper.remove();
    } else {
      // Dla pewności, jeśli z jakiegoś powodu wrappera nie ma, ale elementy są w złym miejscu
      if (title.parentElement !== aboutWrap) {
        aboutWrap.insertBefore(subtitle, aboutWrap.firstChild);
        aboutWrap.insertBefore(title, subtitle.nextSibling);
      }
    }
  }
}

// Uruchom przy starcie i przy zmianie rozmiaru
window.addEventListener('load', reorderAboutTitleEn);
window.addEventListener('resize', reorderAboutTitleEn);


//Łamanie słów


// Zakładam, że masz już załadowany Hypher i pl.js
document.addEventListener("DOMContentLoaded", () => {
  // Tworzymy instancję Hypher z polskim słownikiem
  const h = new Hypher(PL); // PL – polski słownik z pl.js

  // Funkcja, która dzieli słowa i wstawia <wbr> lub dywiz
  function hyphenateElement(element) {
    element.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.nodeValue.split(/\b/); // dzielimy tekst na słowa i znaki graniczne
        const hyphenated = words.map(word => {
          // Hypher zwraca tablicę części słowa
          const parts = h.hyphenate(word);
          return parts.join("\u00AD"); // miękki dywiz – HTML interpretuje jako znak dzielenia
        }).join('');
        const span = document.createElement('span');
        span.innerHTML = hyphenated;
        node.replaceWith(span);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        hyphenateElement(node); // rekurencyjnie dla dzieci
      }
    });
  }

  // Wybieramy wszystkie opisy galerii
  const descriptions = document.querySelectorAll('.gallery-description, .gallery-description-muszla, .about-description');

  descriptions.forEach(el => {
    hyphenateElement(el);
  });
});




// const textDiv = document.querySelector('.gallery-description');

// function insertHyphens(word, minLength = 5) {
//   if (word.length < minLength) return word;
  
//   let result = '';
//   for (let i = 0; i < word.length; i += minLength) {
//     if (i + minLength < word.length) {
//       result += word.slice(i, i + minLength) + '-';
//     } else {
//       result += word.slice(i);
//     }
//   }
//   return result;
// }

// const words = textDiv.textContent.split(' ');

// textDiv.innerHTML = words.map(w => insertHyphens(w)).join(' ');

