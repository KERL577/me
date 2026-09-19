(function () {
  "use strict";

  var data = window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.categories ? window.PORTFOLIO_DATA.categories : [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function catImages(c) { return (c.images && c.images.length ? c.images : []); }

  var toastEl = $("#toast");
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2200);
  }

  /* 复制 */
  function copyText(text, msg) {
    function done() { toast(msg || "已复制"); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        legacyCopy(text); done();
      });
    } else { legacyCopy(text); done(); }
  }
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove();
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (btn) { e.preventDefault(); copyText(btn.getAttribute("data-copy"), btn.getAttribute("data-copy-msg") || "微信号已复制：whl1961hxq"); }
  });

  /* 导航滚动状态 */
  var header = $("#site-header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 10); }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 移动端菜单 */
  var menuBtn = $("#menuToggle"), mobileMenu = $("#mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      var open = mobileMenu.hidden;
      mobileMenu.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  /* 作品文件夹：浮层展示 */
  var workLightbox = $("#workLightbox");
  var lightboxImg = $("#lightboxImg");
  var folderImgs = { app: [], logo: [], web: [] };
  (function buildFolderLists() {
    var counts = { app: 22, logo: 16, web: 34 };
    Object.keys(counts).forEach(function (k) {
      for (var i = 1; i <= counts[k]; i++) folderImgs[k].push("assets/life/work/" + k + "/" + i + ".webp");
    });
  })();
  var lbIdx = 0;
  function showLb(i) {
    var list = folderImgs[$("#workLightbox").getAttribute("data-folder-list")];
    if (!list || !list.length) return;
    lbIdx = ((i % list.length) + list.length) % list.length;
    lightboxImg.src = list[lbIdx];
    lightboxImg.alt = "作品 " + (lbIdx + 1);
  }
  function openLb(key) {
    if (!workLightbox || !folderImgs[key] || !folderImgs[key].length) return;
    workLightbox.setAttribute("data-folder-list", key);
    lbIdx = 0;
    showLb(0);
    workLightbox.hidden = false;
    document.body.style.overflow = "hidden";
    applyLbSize();
    lightboxImg.focus();
  }
  function closeLb() {
    if (workLightbox && !workLightbox.hidden) {
      workLightbox.hidden = true;
      document.body.style.overflow = "";
      clearLbPos();
    }
  }
  $all("[data-folder]").forEach(function (b) {
    b.addEventListener("click", function () { openLb(b.getAttribute("data-folder")); });
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-lightbox-close]")) { closeLb(); return; }
    var p = e.target.closest(".lightbox-prev");
    var n = e.target.closest(".lightbox-next");
    if ((p || n) && workLightbox && !workLightbox.hidden) {
      var list = folderImgs[workLightbox.getAttribute("data-folder-list")];
      if (list) { lbIdx = ((lbIdx + (p ? -1 : 1)) % list.length + list.length) % list.length; showLb(lbIdx); }
    }
  });
  document.addEventListener("keydown", function (e) {
    if (workLightbox && !workLightbox.hidden) {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showLb(lbIdx - 1);
      if (e.key === "ArrowRight") showLb(lbIdx + 1);
    }
  });

  /* 浮层自由调整大小/拖动 */
  var lbWin = $("#lightboxWindow");
  var lbDirs = null, lbStart = null;
  var LB_MIN_W = 340, LB_MIN_H = 240;
  var lbPref = null;
  try { lbPref = JSON.parse(localStorage.getItem("workLightboxSize") || "null"); } catch (e) { lbPref = null; }
  function applyLbSize() {
    if (!lbWin) return;
    if (lbPref && lbPref.w && lbPref.h) {
      var vw = document.documentElement.clientWidth, vh = window.innerHeight;
      lbWin.style.width = Math.max(LB_MIN_W, Math.min(lbPref.w, vw - 16)) + "px";
      lbWin.style.height = Math.max(LB_MIN_H, Math.min(lbPref.h, vh - 16)) + "px";
    } else {
      lbWin.style.width = ""; lbWin.style.height = "";
    }
  }
  function clearLbPos() {
    if (!lbWin) return;
    lbWin.style.position = ""; lbWin.style.left = ""; lbWin.style.top = "";
  }
  function lbDragEnd() {
    if (!lbWin || !lbStart) return;
    try { lbPref = { w: parseInt(lbWin.style.width, 10), h: parseInt(lbWin.style.height, 10) }; localStorage.setItem("workLightboxSize", JSON.stringify(lbPref)); } catch (e) {}
    lbWin.removeEventListener("pointermove", lbDragMove);
    lbWin.removeEventListener("pointerup", lbDragEnd);
    lbWin.removeEventListener("pointercancel", lbDragEnd);
    lbDirs = null; lbStart = null;
    lbWin.classList.remove("is-resizing");
  }
  function lbDragMove(e) {
    if (!lbStart) return;
    e.preventDefault();
    var vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var dx = e.clientX - lbStart.x, dy = e.clientY - lbStart.y;
    if (lbDirs === "move") {
      var L = Math.max(0, Math.min(lbStart.l + dx, vw - lbStart.w));
      var T = Math.max(0, Math.min(lbStart.t + dy, vh - lbStart.h));
      lbWin.style.left = L + "px"; lbWin.style.top = T + "px";
      return;
    }
    var l = lbStart.l, t = lbStart.t, w = lbStart.w, h = lbStart.h;
    if (lbDirs.indexOf("w") >= 0) l = lbStart.l + dx;
    if (lbDirs.indexOf("n") >= 0) t = lbStart.t + dy;
    if (lbDirs.indexOf("e") >= 0) w = lbStart.w + dx;
    if (lbDirs.indexOf("s") >= 0) h = lbStart.h + dy;
    if (lbDirs.indexOf("w") >= 0) w = lbStart.r - l;
    if (lbDirs.indexOf("n") >= 0) h = lbStart.b - t;
    l = Math.max(0, Math.min(l, vw - LB_MIN_W));
    t = Math.max(0, Math.min(t, vh - LB_MIN_H));
    w = Math.max(LB_MIN_W, Math.min(w, vw - l));
    h = Math.max(LB_MIN_H, Math.min(h, vh - t));
    lbWin.style.width = w + "px"; lbWin.style.height = h + "px";
    if (lbDirs.indexOf("w") >= 0) lbWin.style.left = l + "px";
    if (lbDirs.indexOf("n") >= 0) lbWin.style.top = t + "px";
  }
  function lbStartGesture(e, dirs) {
    if (!lbWin || workLightbox.hidden) return;
    e.preventDefault();
    var r = lbWin.getBoundingClientRect();
    lbDirs = dirs; lbStart = { x: e.clientX, y: e.clientY, l: r.left, t: r.top, w: r.width, h: r.height, r: r.left + r.width, b: r.top + r.height };
    lbWin.style.position = "absolute"; lbWin.style.left = r.left + "px"; lbWin.style.top = r.top + "px";
    lbWin.classList.add("is-resizing");
    lbWin.setPointerCapture(e.pointerId);
    lbWin.addEventListener("pointermove", lbDragMove);
    lbWin.addEventListener("pointerup", lbDragEnd);
    lbWin.addEventListener("pointercancel", lbDragEnd);
  }
  if (lbWin) {
    $all("[data-resize]", lbWin).forEach(function (h) {
      h.addEventListener("pointerdown", function (e) { lbStartGesture(e, h.getAttribute("data-resize")); });
    });
    var lbDragBar = lbWin.querySelector("[data-lightbox-drag]");
    if (lbDragBar) lbDragBar.addEventListener("pointerdown", function (e) { lbStartGesture(e, "move"); });
  }

  /* 弹窗 */
  var modal = $("#workModal");
  var modalImg = $("#modalImg");
  var modalTitle = $("#modalTitle");
  var modalType = $("#modalType");
  var modalDesc = $("#modalDesc");
  var modalMeta = $("#modalMeta");
  var modalCounter = $("#modalCounter");
  var viewerIdx = 0;

  function openWork(i) {
    var c = data[i];
    if (!c) return;
    viewerIdx = 0;
    modalTitle.textContent = c.name;
    modalType.textContent = c.type + " · " + c.year;
    modalDesc.textContent = c.description;
    modalMeta.innerHTML = (c.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    showImage(c);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalImg.focus();
  }
  function showImage(c) {
    var imgs = catImages(c);
    var src = imgs.length ? imgs[viewerIdx % imgs.length] : c.cover;
    modalImg.src = src;
    modalImg.alt = c.name + " 作品 " + (viewerIdx + 1);
    modalCounter.textContent = (imgs.length ? viewerIdx % imgs.length + 1 : 1) + " / " + (imgs.length || 1);
  }
  function closeModal() { if (modal) { modal.hidden = true; document.body.style.overflow = ""; } }
  document.addEventListener("click", function (e) {
    var w = e.target.closest("[data-work]");
    if (w) {
      var i = parseInt(w.getAttribute("data-index"), 10);
      if (!isNaN(i) && data[i]) { currentWorkIdx = i; openWork(i); }
      return;
    }
    if (e.target.closest("[data-modal-close]")) { closeModal(); return; }
    var p = e.target.closest(".modal-prev");
    var n = e.target.closest(".modal-next");
    if ((p || n) && modal && !modal.hidden) { stepModal(p ? -1 : 1); }
  });
  function stepModal(d) {
    var c = data[currentWorkIdx];
    var n = catImages(c).length || 1;
    viewerIdx = ((viewerIdx + d) % n + n) % n;
    showImage(c);
  }
  document.addEventListener("keydown", function (e) {
    if (modal && !modal.hidden) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") stepModal(-1);
      if (e.key === "ArrowRight") stepModal(1);
    }
  });
  var currentWorkIdx = 0;

  /* 微信 popover */
  var pop = $("#wechat-popover");
  var popTriggers = $all("[data-wechat]");
  function togglePop(force) {
    if (!pop) return;
    var show = force != null ? force : pop.hidden;
    pop.hidden = !show;
    popTriggers.forEach(function (t) { t.setAttribute("aria-expanded", String(show)); });
  }
  popTriggers.forEach(function (t) { t.addEventListener("click", function () { togglePop(); }); });
  document.addEventListener("click", function (e) {
    if (pop && !pop.hidden && !e.target.closest("#wechat-popover") && !e.target.closest("[data-wechat]")) togglePop(false);
  });
  var popClose = $("[data-wechat-close]");
  if (popClose) popClose.addEventListener("click", function () { togglePop(false); });

  /* 滚动 reveal */
  var reveals = $all(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.16 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* hero 头像鼠标互动：平滑跟随 + 3D 透视倾斜 */
  var heroAvatar = document.querySelector(".hero-avatar-card img");
  var heroCard = document.querySelector(".hero-avatar-card");
  var hero = document.querySelector(".hero");
  if (heroAvatar && heroCard && hero && window.matchMedia("(hover: hover)").matches && !reduceMotion) {
    var tiltX = 0, tiltY = 0, offX = 0, offY = 0;
    var wantTiltX = 0, wantTiltY = 0, wantOffX = 0, wantOffY = 0;
    var raf = null;
    function arm() { if (!raf) raf = requestAnimationFrame(tick); }
    hero.addEventListener("pointermove", function (e) {
      var r = heroCard.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      wantTiltX = -dy * 12;
      wantTiltY = dx * 14;
      wantOffX = dx * 14;
      wantOffY = dy * 10;
      arm();
    });
    hero.addEventListener("pointerleave", function () {
      wantTiltX = wantTiltY = wantOffX = wantOffY = 0;
      arm();
    });
    function tick() {
      tiltX += (wantTiltX - tiltX) * 0.11;
      tiltY += (wantTiltY - tiltY) * 0.11;
      offX += (wantOffX - offX) * 0.11;
      offY += (wantOffY - offY) * 0.11;
      heroAvatar.style.transform = "perspective(900px) translate3d(" + offX.toFixed(2) + "px," + offY.toFixed(2) + "px,0) rotateX(" + tiltX.toFixed(2) + "deg) rotateY(" + tiltY.toFixed(2) + "deg)";
      if (Math.abs(wantTiltX - tiltX) > .05 || Math.abs(wantTiltY - tiltY) > .05 || Math.abs(wantOffX - offX) > .05 || Math.abs(wantOffY - offY) > .05) {
        raf = requestAnimationFrame(tick);
      } else { raf = null; }
    }
  }
})();