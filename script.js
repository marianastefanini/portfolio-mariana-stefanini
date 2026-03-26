document.addEventListener("DOMContentLoaded", () => {
  const galleriesByTitle = {
    "Entenda os jargões do mercado financeiro em 5 minutos": buildGallery(
      "Jargões",
      10,
      true
    ),
    "O futuro com a Inteligência Artificial": buildGallery(
      "Inteligencia Artificial",
      8,
      true
    ),
    "Eleições Norte-Americanas": buildGallery("Eleições", 8, true),
    "Os impactos das Eleições Norte-Americanas nos investimentos": buildGallery(
      "Impactos Eleições",
      9,
      true
    ),
    "Distribuição de Dividendos: o que todo investidor precisa saber": buildGallery(
      "Dividendos",
      9,
      false
    ),
    "Os impactos do Plano Safra para o mercado de commodities": Array.from(
      { length: 9 },
      (_, index) => `Plano Safra/${String(index + 1).padStart(2, "0")}.png`
    )
  };

  const cards = document.querySelectorAll(".card");
  if (!cards.length) return;

  const modal = createModal();
  document.body.appendChild(modal.overlay);

  cards.forEach((card, cardIndex) => {
    const title = card.querySelector(".card-title")?.textContent?.trim();
    const images = title ? galleriesByTitle[title] : null;
    const baseImage = card.querySelector(".card-img");

    if (!baseImage || !images || !images.length) return;

    let currentIndex = 0;
    const media = document.createElement("div");
    media.className = "card-media";

    const image = baseImage.cloneNode(true);
    image.src = images[currentIndex];
    image.dataset.carouselImage = "true";

    const prevButton = createNavButton("card-nav prev", "<", "Imagem anterior");
    const nextButton = createNavButton("card-nav next", ">", "Próxima imagem");
    const counter = document.createElement("div");
    counter.className = "card-counter";

    const hint = document.createElement("button");
    hint.type = "button";
    hint.className = "card-open-gallery";
    hint.textContent = "Ver galeria";
    hint.setAttribute("aria-label", "Abrir galeria de imagens");

    const updateCardImage = () => {
      image.src = images[currentIndex];
      counter.textContent = `${currentIndex + 1}/${images.length}`;
    };

    const changeCardImage = (step) => {
      currentIndex = (currentIndex + step + images.length) % images.length;
      updateCardImage();
    };

    const openGallery = () => {
      modal.open(images, currentIndex, image.alt || "Imagem do projeto");
    };

    prevButton.addEventListener("click", (event) => {
      event.stopPropagation();
      changeCardImage(-1);
    });

    nextButton.addEventListener("click", (event) => {
      event.stopPropagation();
      changeCardImage(1);
    });

    hint.addEventListener("click", (event) => {
      event.stopPropagation();
      openGallery();
    });

    image.addEventListener("click", openGallery);

    media.append(image, prevButton, nextButton, counter, hint);
    baseImage.replaceWith(media);
    updateCardImage();
  });
});

function createNavButton(className, label, ariaLabel) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);
  return button;
}

function createModal() {
  const overlay = document.createElement("div");
  overlay.className = "gallery-modal";
  overlay.setAttribute("aria-hidden", "true");

  overlay.innerHTML = `
    <div class="gallery-dialog" role="dialog" aria-modal="true" aria-label="Galeria de imagens">
      <button type="button" class="gallery-close" aria-label="Fechar galeria">x</button>
      <button type="button" class="gallery-nav prev" aria-label="Imagem anterior">&lt;</button>
      <figure class="gallery-figure">
        <img class="gallery-image" src="" alt="">
        <figcaption class="gallery-caption"></figcaption>
      </figure>
      <button type="button" class="gallery-nav next" aria-label="Próxima imagem">&gt;</button>
    </div>
  `;

  const dialog = overlay.querySelector(".gallery-dialog");
  const image = overlay.querySelector(".gallery-image");
  const caption = overlay.querySelector(".gallery-caption");
  const closeButton = overlay.querySelector(".gallery-close");
  const prevButton = overlay.querySelector(".gallery-nav.prev");
  const nextButton = overlay.querySelector(".gallery-nav.next");

  let images = [];
  let currentIndex = 0;

  const render = () => {
    image.src = images[currentIndex];
    image.alt = caption.dataset.altText || "Imagem da galeria";
    caption.textContent = `Imagem ${currentIndex + 1} de ${images.length}`;
  };

  const changeImage = (step) => {
    if (!images.length) return;
    currentIndex = (currentIndex + step + images.length) % images.length;
    render();
  };

  const close = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  const open = (newImages, startIndex, altText) => {
    images = newImages;
    currentIndex = startIndex;
    caption.dataset.altText = altText;
    render();
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  closeButton.addEventListener("click", close);
  prevButton.addEventListener("click", () => changeImage(-1));
  nextButton.addEventListener("click", () => changeImage(1));

  overlay.addEventListener("click", (event) => {
    if (!dialog.contains(event.target)) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("is-open")) return;

    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") changeImage(-1);
    if (event.key === "ArrowRight") changeImage(1);
  });

  return { overlay, open };
}

function buildGallery(folder, total, padWithZero) {
  return Array.from({ length: total }, (_, index) => {
    const fileNumber = padWithZero
      ? String(index + 1).padStart(2, "0")
      : String(index + 1);

    return `${folder}/${fileNumber}.png`;
  });
}
