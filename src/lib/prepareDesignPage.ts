const routeMap: Record<string, string> = {
  'Homepage.dc.html': '/',
  'Programs.dc.html': '/programs/',
  'About.dc.html': '/about/',
  'News.dc.html': '/news/',
  'Our-Team.dc.html': '/our-team/',
  'Volunteer.dc.html': '/volunteer/',
  'Donate.dc.html': '/donate/',
  'Contact.dc.html': '/contact/',
  'Privacy-Policy.dc.html': '/privacy-policy/',
  'Terms-of-Use.dc.html': '/terms-of-use/',
};

const buttonStyles: Record<string, string> = {
  primary: 'background:var(--color-brand);color:var(--color-text-inverse);',
  accent: 'background:var(--color-accent);color:var(--color-brand-strong);',
  secondary: 'background:var(--color-surface);color:var(--color-brand);border:1.5px solid var(--color-border-strong);',
  ghost: 'background:transparent;color:var(--color-brand);',
  inverse: 'background:var(--color-surface);color:var(--color-brand-strong);',
};

function replaceDesignComponents(markup: string): string {
  markup = markup.replace(
    /<x-import[^>]*SectionHeader[^>]*eyebrow="([^"]*)"[^>]*title="([^"]*)"[^>]*><\/x-import>/gi,
    (_all, eyebrow, title) => `<div style="display:flex;flex-direction:column;gap:12px;align-items:center;text-align:center;max-width:640px;margin:0 auto;font-family:var(--font-body);"><div style="font-family:var(--font-display);font-weight:700;font-size:14px;letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--color-brand);">${eyebrow}</div><h2 style="font-size:var(--text-3xl);font-weight:800;color:var(--color-text);">${title}</h2></div>`,
  );
  markup = markup.replace(
    /<x-import[^>]*Button[^>]*variant="([^"]*)"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/x-import>/gi,
    (_all, variant, href, label) => `<a href="${href}" class="design-button" style="${buttonStyles[variant] ?? buttonStyles.primary}">${label}</a>`,
  );
  return markup;
}

function replaceImageSlots(markup: string): string {
  return markup.replace(/<image-slot\s+([^>]*?)><\/image-slot>/gi, (_all, attrs: string) => {
    const src = attrs.match(/\bsrc="([^"]*)"/i)?.[1] ?? '';
    const alt = attrs.match(/\bplaceholder="([^"]*)"/i)?.[1] ?? '';
    const id = attrs.match(/\bid="([^"]*)"/i)?.[1];
    const style = attrs.match(/\bstyle="([^"]*)"/i)?.[1];
    return `<img${id ? ` id="${id}"` : ''} class="design-image" src="${src}" alt="${alt}"${style ? ` style="${style}"` : ''}>`;
  });
}

function homepageContent(markup: string): string {
  markup = markup.replace('<div style="{{ curveStyle }}"></div>', '<div style="position:absolute;left:-10%;width:120%;height:140px;bottom:-70px;background:var(--color-bg);border-radius:50%;"></div>');
  const carousel = (name: string, sources: string[], alt: string) => sources.map((src, index) => `<img class="design-image carousel-slide${index === 0 ? ' is-active' : ''}" data-carousel="${name}" src="${src}" alt="${alt}">`).join('');
  markup = markup.replace(/<sc-for list="\{\{ workshopImages \}\}"[\s\S]*?<\/sc-for>/i, carousel('workshops', ['/assets/workshops-1.jpeg', '/assets/workshops-2.jpeg', '/assets/workshops-3.jpg'], 'STEM workshop'));
  markup = markup.replace(/<sc-for list="\{\{ roboticsImages \}\}"[\s\S]*?<\/sc-for>/i, carousel('robotics', ['/assets/robotics-1.jpeg', '/assets/robotics-2.jpeg', '/assets/robotics-3.png'], 'Zero Robotics'));
  markup = markup
    .replace('onClick="{{ prevWorkshop }}"', 'data-carousel-control="workshops" data-direction="-1"')
    .replace('onClick="{{ nextWorkshop }}"', 'data-carousel-control="workshops" data-direction="1"')
    .replace('onClick="{{ prevRobotics }}"', 'data-carousel-control="robotics" data-direction="-1"')
    .replace('onClick="{{ nextRobotics }}"', 'data-carousel-control="robotics" data-direction="1"');
  return `${markup}<script>${carouselScript}</script>`;
}

const carouselScript = `
(() => {
  const indexes = { workshops: 0, robotics: 0 };
  const show = (name, next) => {
    const slides = [...document.querySelectorAll('[data-carousel="' + name + '"]')];
    if (!slides.length) return;
    indexes[name] = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === indexes[name]));
  };
  document.querySelectorAll('[data-carousel-control]').forEach((button) => button.addEventListener('click', () => {
    const name = button.dataset.carouselControl;
    show(name, indexes[name] + Number(button.dataset.direction));
  }));
  window.setInterval(() => { show('workshops', indexes.workshops + 1); show('robotics', indexes.robotics + 1); }, 4500);
})();`;

function volunteerContent(markup: string): string {
  const docs = [
    ['Welcome Guide', 'An introduction to SBSA and what to expect as a volunteer.', '/assets/volunteer/welcome-guide.pdf'],
    ['Volunteer Contract', 'Our expectations and commitments for all volunteers.', '/assets/volunteer/volunteer-contract.pdf'],
    ['Photo Release Form', 'Consent for photos taken during workshops and events.', '/assets/volunteer/photo-release-form.pdf'],
  ];
  const cards = docs.map(([title, description, href]) => `<a href="${href}" target="_blank" rel="noopener" class="sbsa-reveal document-card" style="flex:1 1 260px;max-width:320px;background:var(--color-surface);border-radius:0;box-shadow:var(--shadow-sm);padding:24px;display:flex;flex-direction:column;gap:8px;cursor:pointer;text-decoration:none;"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><div style="font-family:var(--font-display);font-weight:700;font-size:16px;color:var(--color-text);">${title}</div><span style="font-size:13px;color:var(--color-brand);">↗</span></div><div style="font-size:14px;color:var(--color-text-muted);">${description}</div></a>`).join('');
  return markup.replace(/<sc-for list="\{\{ artifacts \}\}"[\s\S]*?<\/sc-for>/i, cards);
}

const months = [
  { name: 'September 2026', start: 2, days: 30, events: { 16: ['Arlington'], 22: ['Lincoln'], 30: ['Arlington'] } },
  { name: 'October 2026', start: 4, days: 31, events: { 6: ['Lincoln'], 13: ['Wood'], 14: ['Arlington'], 20: ['Lincoln'], 27: ['Lincoln', 'Wood'], 28: ['Arlington'] } },
  { name: 'November 2026', start: 0, days: 30, events: { 3: ['Lincoln'], 4: ['Arlington'], 17: ['Lincoln'], 18: ['Arlington'] } },
  { name: 'December 2026', start: 2, days: 31, events: { 1: ['Lincoln', 'Wood'], 2: ['Arlington'], 8: ['Wood'] } },
] as const;

function calendarMarkup(): string {
  const first = months[0];
  const cells: string[] = [];
  const total = Math.ceil((first.start + first.days) / 7) * 7;
  for (let cell = 0; cell < total; cell++) {
    const day = cell - first.start + 1;
    if (day < 1 || day > first.days) cells.push('<div style="background:var(--color-bg-subtle);min-height:92px;"></div>');
    else {
      const events = (first.events as Record<number, readonly string[]>)[day] ?? [];
      const badges = events.map((name) => {
        const colors = name === 'Arlington' ? ['var(--color-brand)', '#fff'] : name === 'Lincoln' ? ['var(--green-600)', '#fff'] : ['var(--color-accent)', 'var(--color-brand-strong)'];
        return `<div style="font-size:10px;font-weight:700;color:${colors[1]};background:${colors[0]};padding:1px 4px;">${name}</div>`;
      }).join('');
      cells.push(`<div style="background:${events.length ? 'var(--color-bg-tint)' : 'var(--color-surface)'};min-height:92px;padding:6px;"><div style="font-size:12px;color:var(--color-text-muted);">${day}</div><div style="display:flex;flex-direction:column;gap:1px;margin-top:2px;">${badges}</div></div>`);
    }
  }
  return `<div id="workshop-calendar" class="sbsa-reveal" style="background:var(--color-surface);box-shadow:var(--shadow-md);"><div style="background:var(--color-brand-strong);color:#fff;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;"><button type="button" data-calendar-prev aria-label="Previous month" class="calendar-nav" style="opacity:.35;">‹</button><div data-calendar-title style="font-family:var(--font-display);font-weight:800;font-size:16px;">September 2026</div><button type="button" data-calendar-next aria-label="Next month" class="calendar-nav">›</button></div><div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:12px;font-weight:700;color:var(--color-text-muted);padding:10px 1px 6px;"><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div></div><div data-calendar-grid style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:var(--color-border);padding:0 1px 1px;">${cells.join('')}</div></div><script>${calendarScript}</script>`;
}

const calendarScript = `
(() => {
  const months = ${JSON.stringify(months)};
  const root = document.querySelector('#workshop-calendar'); let index = 0;
  const colors = { Arlington: ['var(--color-brand)', '#fff'], Lincoln: ['var(--green-600)', '#fff'], Wood: ['var(--color-accent)', 'var(--color-brand-strong)'] };
  const render = () => {
    const month = months[index]; root.querySelector('[data-calendar-title]').textContent = month.name;
    const grid = root.querySelector('[data-calendar-grid]'); grid.replaceChildren();
    const total = Math.ceil((month.start + month.days) / 7) * 7;
    for (let cell = 0; cell < total; cell++) {
      const day = cell - month.start + 1; const box = document.createElement('div'); box.style.minHeight = '92px';
      if (day < 1 || day > month.days) { box.style.background = 'var(--color-bg-subtle)'; }
      else { const events = month.events[day] || []; box.style.cssText += 'background:' + (events.length ? 'var(--color-bg-tint)' : 'var(--color-surface)') + ';padding:6px;'; box.innerHTML = '<div style="font-size:12px;color:var(--color-text-muted)">' + day + '</div><div style="display:flex;flex-direction:column;gap:1px;margin-top:2px">' + events.map(name => '<div style="font-size:10px;font-weight:700;color:' + colors[name][1] + ';background:' + colors[name][0] + ';padding:1px 4px">' + name + '</div>').join('') + '</div>'; }
      grid.append(box);
    }
    root.querySelector('[data-calendar-prev]').style.opacity = index === 0 ? '.35' : '1'; root.querySelector('[data-calendar-next]').style.opacity = index === months.length - 1 ? '.35' : '1';
  };
  root.querySelector('[data-calendar-prev]').addEventListener('click', () => { index = Math.max(0, index - 1); render(); });
  root.querySelector('[data-calendar-next]').addEventListener('click', () => { index = Math.min(months.length - 1, index + 1); render(); }); render();
})();`;

function newsContent(markup: string): string {
  return markup.replace(
    /<div class="sbsa-reveal" style="background: var\(--color-surface\); box-shadow: var\(--shadow-md\);">[\s\S]*?(?=\s*<div style="text-align: center; margin-top: 48px;">)/i,
    `${calendarMarkup()}\n\n  `,
  );
}

export function prepareDesignPage(source: string): string {
  const body = source.match(/<x-dc>([\s\S]*?)<\/x-dc>/i)?.[1] ?? source;
  const helmet = body.match(/<helmet>([\s\S]*?)<\/helmet>/i)?.[1] ?? '';
  const styles = [...helmet.matchAll(/<style>([\s\S]*?)<\/style>/gi)].map((m) => `<style>${m[1]}</style>`).join('\n');
  let markup = `${styles}\n${body.replace(/<helmet>[\s\S]*?<\/helmet>/i, '')}`;
  for (const [file, route] of Object.entries(routeMap)) markup = markup.replaceAll(`./${file}`, route);
  // The export points Home at the hero's #top anchor, which sits below the
  // masthead. Route to the document itself so Home always opens at scroll 0.
  markup = markup.replaceAll('href="/#top"', 'href="/"').replaceAll('href="#top"', 'href="/"');
  markup = markup.replaceAll('href="./assets/', 'href="/assets/').replaceAll('src="./assets/', 'src="/assets/').replaceAll("'./assets/", "'/assets/").replaceAll('"./assets/', '"/assets/');
  markup = replaceDesignComponents(markup);
  if (source.includes('workshopImages')) markup = homepageContent(markup);
  if (source.includes('artifacts = docs.map')) markup = volunteerContent(markup);
  if (source.includes('September 2026')) markup = newsContent(markup);
  markup = markup.replaceAll('{{ navColorAbout }}', '#fff').replaceAll('{{ navColorNews }}', 'var(--green-100)').replaceAll('{{ navColorTeam }}', 'var(--green-100)');
  markup = replaceImageSlots(markup);
  return markup.replace(/<script type="text\/x-dc"[\s\S]*?<\/script>/gi, '');
}
