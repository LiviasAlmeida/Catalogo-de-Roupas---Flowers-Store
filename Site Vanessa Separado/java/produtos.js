document.addEventListener("DOMContentLoaded", function () {
  const navPrincipal = document.querySelector(".navegacao-principal");
  const filtros = document.querySelector("#vinicius-produtos .vinicius-filtros");
  const linksCategorias = Array.from(document.querySelectorAll("#vinicius-produtos .vinicius-filtro-btn"));
  const btnVoltarTopo = document.getElementById("btn-voltar-topo");

  // Controle da setinha para voltar ao topo
  if (btnVoltarTopo) {
    btnVoltarTopo.addEventListener("click", function () {
      const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: 0,
        behavior: reduzirMovimento ? "auto" : "smooth",
      });
    });
  }

  function ehMobile() {
    return window.innerWidth <= 768;
  }

  function atualizarAlturasSticky() {
    const mobile = ehMobile();
    const alturaNav = !mobile && navPrincipal ? Math.ceil(navPrincipal.getBoundingClientRect().height) : 0;
    const alturaFiltros = filtros ? Math.ceil(filtros.getBoundingClientRect().height) : 58;
    document.documentElement.style.setProperty("--altura-nav-principal", `${alturaNav}px`);
    document.documentElement.style.setProperty("--offset-categorias", `${alturaNav + alturaFiltros + 12}px`);
  }

  function atualizarEstadoScroll() {
    const scrollAtual = window.scrollY;
    const mobile = ehMobile();
    const alturaNav = !mobile && navPrincipal ? Math.ceil(navPrincipal.getBoundingClientRect().height) : 0;

    // Ativa sombra discreta quando a barra de categorias está fixa no topo
    if (filtros) {
      const rectFiltros = filtros.getBoundingClientRect();
      if (rectFiltros.top <= alturaNav + 2 && scrollAtual > 40) {
        filtros.classList.add("fixo");
      } else {
        filtros.classList.remove("fixo");
      }
    }

    // Exibe a setinha de voltar ao topo após rolar a página
    if (btnVoltarTopo) {
      if (scrollAtual > 250) {
        btnVoltarTopo.classList.add("visivel");
      } else {
        btnVoltarTopo.classList.remove("visivel");
      }
    }

    // ScrollSpy: destaca a categoria atualmente visível na tela
    const alturaFiltros = filtros ? Math.ceil(filtros.getBoundingClientRect().height) : 58;
    const pontoReferencia = alturaNav + alturaFiltros + 36;
    let categoriaAtivaId = "";

    const secoes = document.querySelectorAll(".vinicius-titulo-categoria[id]");
    secoes.forEach((titulo) => {
      const rect = titulo.getBoundingClientRect();
      if (rect.top <= pontoReferencia) {
        categoriaAtivaId = titulo.id;
      }
    });

    linksCategorias.forEach((link) => {
      const alvo = link.getAttribute("href");
      const ehAtivo = categoriaAtivaId && alvo === `#${categoriaAtivaId}`;
      if (ehAtivo) {
        if (!link.classList.contains("ativo")) {
          link.classList.add("ativo");
          link.setAttribute("aria-current", "true");
          if (filtros && filtros.scrollWidth > filtros.clientWidth) {
            const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const destinoLeft = link.offsetLeft - (filtros.clientWidth - link.offsetWidth) / 2;
            filtros.scrollTo({
              left: Math.max(0, destinoLeft),
              behavior: reduzirMovimento ? "auto" : "smooth",
            });
          }
        }
      } else {
        link.classList.remove("ativo");
        link.removeAttribute("aria-current");
      }
    });
  }

  let ticking = false;
  function aoRolar() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        atualizarEstadoScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Observa mudanças de altura da barra de navegação (ex: carregamento de fonte ou redimensionamento)
  if ("ResizeObserver" in window) {
    const observador = new ResizeObserver(function () {
      atualizarAlturasSticky();
      atualizarEstadoScroll();
    });
    if (navPrincipal) observador.observe(navPrincipal);
    if (filtros) observador.observe(filtros);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      atualizarAlturasSticky();
      atualizarEstadoScroll();
    });
  }

  window.addEventListener("scroll", aoRolar, { passive: true });
  window.addEventListener("resize", function () {
    atualizarAlturasSticky();
    atualizarEstadoScroll();
  });
  document.addEventListener("catalogoCarregado", function () {
    atualizarAlturasSticky();
    if (window.location.hash) {
      const alvo = document.querySelector(window.location.hash);
      if (alvo) {
        alvo.scrollIntoView({ behavior: "auto" });
      }
    }
    atualizarEstadoScroll();
  });

  atualizarAlturasSticky();
  atualizarEstadoScroll();
});