(function () {
  const content = window.CARVAS_CONTENT;

  if (!content) {
    return;
  }

  const { company, meta, nav, hero, benefits, about, services, projects, gallery, contact, footer } = content;
  const header = document.getElementById("top");
  const app = document.getElementById("app");
  const siteFooter = document.getElementById("site-footer");
  const floatingWhatsapp = document.getElementById("floating-whatsapp");
  const imageModal = document.getElementById("image-modal");
  const imageModalImage = document.getElementById("image-modal-image");
  const imageModalClose = document.getElementById("image-modal-close");
  let modalTrigger = null;

  applyMeta(meta);
  renderHeader();
  renderMain();
  renderFooter();
  wireInteractions();

  function applyMeta(pageMeta) {
    document.title = pageMeta.title;
    setMeta('meta[name="description"]', "content", pageMeta.description);
    setMeta('meta[property="og:title"]', "content", pageMeta.title);
    setMeta('meta[property="og:description"]', "content", pageMeta.description);
    setMeta('meta[property="og:image"]', "content", pageMeta.ogImage);
  }

  function setMeta(selector, attribute, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute(attribute, value);
    }
  }

  function renderHeader() {
    header.innerHTML = `
      <div class="topbar">
        <div class="container topbar__inner">
          <p>${company.address}</p>
          <div class="topbar__links">
            <a href="${company.instagram}" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>
      <div class="navbar-wrap">
        <div class="container navbar">
          <a class="brand" href="#inicio" aria-label="Ir al inicio de Constructora Carvas">
            <img src="${company.logo}" alt="Logo de ${company.name}" />
            <span>
              <strong>${company.shortName}</strong>
              <small>Constructora</small>
            </span>
          </a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
            <span></span><span></span><span></span>
          </button>
          <nav class="primary-nav" id="primary-nav" aria-label="Principal">
            ${nav
              .map((item) => `<a href="${item.href}" class="nav-link">${item.label}</a>`)
              .join("")}
            <button class="nav-cta" type="button" data-whatsapp-message="Hola Constructora Carvas, quiero hablar sobre mi proyecto.">
              Cotiza ahora
            </button>
          </nav>
        </div>
      </div>
    `;
  }

  function renderMain() {
    app.innerHTML = `
      ${renderHero()}
      ${renderBenefits()}
      ${renderAbout()}
      ${renderServices()}
      ${renderProjects()}
      ${renderGallery()}
      ${renderContact()}
    `;
  }

  function renderHero() {
    return `
      <section class="hero section" id="inicio">
        <div class="hero__media">
          ${hero.slides
            .map(
              (slide, index) => `
                <figure class="hero__slide ${index === 0 ? "is-active" : ""}" data-slide="${index}">
                  <img src="${slide.image}" alt="${slide.alt}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} />
                </figure>
              `
            )
            .join("")}
          <div class="hero__overlay"></div>
          <div class="hero__grid"></div>
        </div>
        <div class="container hero__content">
          <div class="hero__copy" data-reveal>
            <p class="eyebrow">${hero.eyebrow}</p>
            <h1>${hero.title}</h1>
            <p class="hero__subtitle">${hero.subtitle}</p>
            <div class="hero__actions">
              <button type="button" class="button button--primary" data-whatsapp-message="${hero.primaryCta.message}">
                ${hero.primaryCta.label}
              </button>
              <a class="button button--ghost" href="${hero.secondaryCta.href}">
                ${hero.secondaryCta.label}
              </a>
            </div>
          </div>
          <aside class="hero__panel" data-reveal>
            <p class="hero__panel-label">Construye con confianza</p>
            <ul class="hero__highlights">
              ${hero.highlights.map((item) => `<li>${item}</li>`).join("")}
            </ul>
            <div class="hero__meta">
              ${hero.slides
                .map(
                  (slide, index) => `
                    <button type="button" class="hero__dot ${index === 0 ? "is-active" : ""}" data-go-slide="${index}" aria-label="Ver ${slide.label}">
                      <span>${slide.label}</span>
                    </button>
                  `
                )
                .join("")}
            </div>
          </aside>
        </div>
      </section>
    `;
  }

  function renderBenefits() {
    return `
      <section class="trust-band section">
        <div class="container trust-band__inner" data-reveal>
          <div>
            <p class="eyebrow">Asesoría personalizada</p>
            <h2>Construye con confianza. Construye con profesionales.</h2>
          </div>
          <div class="trust-band__grid">
            ${benefits.map((item) => `<article class="trust-chip">${item}</article>`).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderAbout() {
    return `
      <section class="section about" id="nosotros">
        <div class="container about__grid">
          <div class="about__copy" data-reveal>
            <p class="eyebrow">${about.eyebrow}</p>
            <h2>${about.title}</h2>
            <p>${about.description}</p>
            ${about.extra ? `<p>${about.extra}</p>` : ""}
          </div>
          <figure class="about__figure" data-reveal>
            <img src="${about.image}" alt="${about.alt}" loading="lazy" />
          </figure>
        </div>
      </section>
    `;
  }

  function renderServices() {
    return `
      <section class="section services" id="servicios">
        <div class="container">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">NUESTROS SERVICIOS</p>
            <h2>Calidad y compromiso en cada proyecto</h2>
          </div>
          <div class="services__grid">
            ${services
              .map(
                (service, index) => `
                  <article class="service-card" data-reveal style="transition-delay:${index * 40}ms">
                    <span class="service-card__index">0${index + 1}</span>
                    <h3>${service.title}</h3>
                    ${service.description ? `<p>${service.description}</p>` : ""}
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderProjects() {
    return `
      <section class="section projects" id="proyectos">
        <div class="container">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">Proyectos destacados</p>
            <h2>Algunos trabajos recientes.</h2>
            <p>Casas, radieres y obras complementarias.</p>
          </div>
          <div class="projects__list">
            ${projects
              .map(
                (project, index) => `
                  <article class="project-card ${index % 2 === 0 ? "project-card--accent" : ""}" data-reveal>
                    <div class="project-card__media">
                      <button
                        type="button"
                        class="image-trigger"
                        data-image-src="${project.cover}"
                        data-image-alt="${project.alt}"
                        aria-label="Ampliar imagen principal de ${project.name}"
                      >
                        <img src="${project.cover}" alt="${project.alt}" loading="lazy" />
                      </button>
                    </div>
                    <div class="project-card__body">
                      <div class="project-card__topline">
                        <span>${project.surface}</span>
                        <small>${project.type}</small>
                      </div>
                      <h3>${project.name}</h3>
                      <p>${project.summary}</p>
                      <ul class="project-card__attributes">
                        ${project.attributes.map((attribute) => `<li>${attribute}</li>`).join("")}
                      </ul>
                      <div class="project-card__gallery">
                        ${project.gallery
                          .map(
                            (image) => `
                              <figure>
                                <button
                                  type="button"
                                  class="image-trigger image-trigger--thumb"
                                  data-image-src="${image}"
                                  data-image-alt="Detalle del proyecto ${project.name}"
                                  aria-label="Ampliar imagen del proyecto ${project.name}"
                                >
                                  <img src="${image}" alt="Detalle del proyecto ${project.name}" loading="lazy" />
                                </button>
                              </figure>
                            `
                          )
                          .join("")}
                      </div>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderGallery() {
    return `
      <section class="section gallery" id="galeria">
        <div class="container">
          <div class="section-heading" data-reveal>
            <p class="eyebrow">Galería de trabajos</p>
            <h2>Galería de trabajos.</h2>
            <p>Imágenes reales de obras y avances.</p>
          </div>
          <div class="gallery__masonry">
            ${gallery
              .map(
                (item, index) => `
                  <figure class="gallery-card ${index % 3 === 0 ? "gallery-card--large" : ""}" data-reveal>
                    <button
                      type="button"
                      class="image-trigger"
                      data-image-src="${item.image}"
                      data-image-alt="${item.alt}"
                      aria-label="Ampliar imagen de galería"
                    >
                      <img src="${item.image}" alt="${item.alt}" loading="lazy" />
                    </button>
                  </figure>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderContact() {
    return `
      <section class="section contact" id="contacto">
        <div class="container contact__grid">
          <div class="contact__content" data-reveal>
            <p class="eyebrow">Contacto</p>
            <h2>${contact.title}</h2>
            ${contact.description ? `<p>${contact.description}</p>` : ""}
            <div class="contact__details">
              <a href="mailto:${company.email}">${company.email}</a>
              <p>${company.address}</p>
            </div>
            <div class="contact__quicklinks">
              ${contact.quickLinks
                .map((link) => `<button type="button" class="quicklink" data-quicklink="${link.kind}">${link.label}</button>`)
                .join("")}
            </div>
          </div>
          <div class="contact__form-wrap" data-reveal>
            <div class="contact__form-card">
              <h3>${contact.form.title}</h3>
              <form id="contact-form" novalidate>
                ${contact.form.fields
                  .map((field) =>
                    field.type === "textarea"
                      ? `
                        <label class="field">
                          <span>${field.label}${field.required ? " *" : ""}</span>
                          <textarea name="${field.name}" rows="5" ${field.required ? "required" : ""}></textarea>
                        </label>
                      `
                      : `
                        <label class="field">
                          <span>${field.label}${field.required ? " *" : ""}</span>
                          <input type="${field.type}" name="${field.name}" ${field.required ? "required" : ""} />
                        </label>
                      `
                  )
                  .join("")}
                <button type="submit" class="button button--primary button--full">${contact.form.submitLabel}</button>
                <p class="form-hint">El formulario abrirá WhatsApp con tu mensaje listo para enviar.</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderFooter() {
    if (!siteFooter) {
      return;
    }

    siteFooter.innerHTML = `
      <div class="container site-footer__inner">
        <div class="site-footer__brand">
          <img src="${company.logo}" alt="Logo de ${company.name}" />
          <div>
            <h2>${footer.title}</h2>
            <p>${footer.text}</p>
          </div>
        </div>
        <div class="site-footer__details">
          <p>${company.phoneDisplay}</p>
          <a href="mailto:${company.email}">${company.email}</a>
          <p>${company.address}</p>
          <a href="${company.instagram}" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
    `;
  }

  function wireInteractions() {
    wireMenu();
    wireWhatsappButtons();
    wireQuickLinks();
    wireForm();
    wireHeroCarousel();
    wireRevealAnimations();
    wireImageTriggers();
    wireImageModal();
  }

  function wireMenu() {
    const toggle = header.querySelector(".menu-toggle");
    const navElement = header.querySelector(".primary-nav");

    if (!toggle || !navElement) {
      return;
    }

    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      navElement.classList.toggle("is-open", !expanded);
    });

    navElement.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        navElement.classList.remove("is-open");
      });
    });
  }

  function wireWhatsappButtons() {
    const buttons = document.querySelectorAll("[data-whatsapp-message]");
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        openWhatsApp(button.getAttribute("data-whatsapp-message"));
      });
    });

    if (floatingWhatsapp) {
      floatingWhatsapp.addEventListener("click", function () {
        openWhatsApp("Hola Constructora Carvas, quiero cotizar mi proyecto.");
      });
    }
  }

  function wireQuickLinks() {
    document.querySelectorAll("[data-quicklink]").forEach((button) => {
      button.addEventListener("click", function () {
        const kind = button.getAttribute("data-quicklink");
        if (kind === "instagram") {
          window.open(company.instagram, "_blank", "noopener");
          return;
        }
        if (kind === "email") {
          window.location.href = `mailto:${company.email}`;
          return;
        }
        openWhatsApp("Hola Constructora Carvas, quiero conversar sobre mi proyecto.");
      });
    });
  }

  function wireForm() {
    const form = document.getElementById("contact-form");
    if (!form) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const data = new FormData(form);
      const message = [
        "Hola Constructora Carvas, me gustaría cotizar un proyecto.",
        `Nombre: ${valueOrFallback(data.get("name"))}`,
        `Teléfono: ${valueOrFallback(data.get("phone"))}`,
        `Correo: ${valueOrFallback(data.get("email"), "No indicado")}`,
        `Asunto: ${valueOrFallback(data.get("subject"))}`,
        `Mensaje: ${valueOrFallback(data.get("message"))}`,
      ].join("\n");

      openWhatsApp(message);
    });
  }

  function wireHeroCarousel() {
    const slides = Array.from(document.querySelectorAll(".hero__slide"));
    const dots = Array.from(document.querySelectorAll(".hero__dot"));

    if (!slides.length) {
      return;
    }

    let currentIndex = 0;
    let timerId = null;

    const goToSlide = function (index) {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === currentIndex));
      dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === currentIndex));
    };

    const startTimer = function () {
      timerId = window.setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 5500);
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", function () {
        const index = Number(dot.getAttribute("data-go-slide"));
        goToSlide(index);
        window.clearInterval(timerId);
        startTimer();
      });
    });

    startTimer();
  }

  function wireRevealAnimations() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || !revealItems.length) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function wireImageTriggers() {
    document.querySelectorAll(".image-trigger").forEach((button) => {
      button.addEventListener("click", function () {
        openImageModal(button.getAttribute("data-image-src"), button.getAttribute("data-image-alt"), button);
      });
    });
  }

  function wireImageModal() {
    if (!imageModal || !imageModalImage || !imageModalClose) {
      return;
    }

    imageModalClose.addEventListener("click", closeImageModal);
    imageModal.querySelectorAll("[data-close-image-modal]").forEach((element) => {
      element.addEventListener("click", closeImageModal);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !imageModal.hidden) {
        closeImageModal();
      }
    });
  }

  function openImageModal(src, alt, trigger) {
    if (!imageModal || !imageModalImage) {
      return;
    }

    modalTrigger = trigger || null;
    imageModalImage.src = src;
    imageModalImage.alt = alt || "";
    imageModal.hidden = false;
    document.body.classList.add("modal-open");
    imageModalClose.focus();
  }

  function closeImageModal() {
    if (!imageModal || !imageModalImage) {
      return;
    }

    imageModal.hidden = true;
    imageModalImage.removeAttribute("src");
    imageModalImage.alt = "";
    document.body.classList.remove("modal-open");
    if (modalTrigger) {
      modalTrigger.focus();
      modalTrigger = null;
    }
  }

  function valueOrFallback(value, fallback) {
    const normalized = String(value || "").trim();
    return normalized || fallback || "";
  }

  function openWhatsApp(message) {
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener");
  }

  function buildWhatsAppUrl(message) {
    return `https://wa.me/${company.phoneRaw}?text=${encodeURIComponent(message)}`;
  }
})();
