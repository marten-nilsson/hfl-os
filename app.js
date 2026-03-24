/* ============================================
   HappyFlow OS — App Logic
   ============================================ */

/* ============================================
   PASSWORD GATE
   ============================================ */
(function () {
  const PASS = 'kaspar';
  const overlay = document.getElementById('gateOverlay');
  const form = document.getElementById('gateForm');
  const input = document.getElementById('gatePassword');
  const error = document.getElementById('gateError');

  if (sessionStorage.getItem('hfl_auth') === '1') {
    overlay.classList.add('hidden');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value === PASS) {
      sessionStorage.setItem('hfl_auth', '1');
      overlay.classList.add('hidden');
      input.value = '';
      error.classList.remove('visible');
    } else {
      error.classList.add('visible');
      input.value = '';
      input.focus();
    }
  });
})();

let currentLang = 'sv';

// Navigation
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initCharts();
  initShipments();
  initLanguage();
  initCompanySelector();
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const views = document.querySelectorAll('.view');
  const pageTitle = document.getElementById('pageTitle');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = item.dataset.view;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      views.forEach(v => v.classList.remove('active'));
      const targetView = document.getElementById(`view-${viewId}`);
      if (targetView) {
        targetView.classList.add('active');
      }

      pageTitle.textContent = getTitle(viewId);

      document.getElementById('sidebar').classList.remove('open');

      if (viewId === 'analytics') setTimeout(initConsumptionChart, 100);
      if (viewId === 'dashboard') setTimeout(initCharts, 100);
      if (viewId === 'costs') setTimeout(initCostDashboardCharts, 100);
    });
  });
}

function getTitle(viewId) {
  const titles = {
    sv: {
      dashboard: 'Dashboard',
      automat: 'Automat — Track & Trace',
      'automat-shipments': 'Försändelser',
      invoice: 'Invoice Audit',
      costs: 'Cost Dashboard',
      reklamation: 'Reklamation',
      crossborder: 'Crossborder',
      labels: 'Label Engine',
      analytics: 'Analytics'
    },
    en: {
      dashboard: 'Dashboard',
      automat: 'Automat — Track & Trace',
      'automat-shipments': 'Shipments',
      invoice: 'Invoice Audit',
      costs: 'Cost Dashboard',
      reklamation: 'Claims',
      crossborder: 'Crossborder',
      labels: 'Label Engine',
      analytics: 'Analytics'
    },
    no: {
      dashboard: 'Dashboard',
      automat: 'Automat — Sporing',
      'automat-shipments': 'Forsendelser',
      invoice: 'Fakturakontroll',
      costs: 'Kostnads-dashboard',
      reklamation: 'Reklamasjon',
      crossborder: 'Crossborder',
      labels: 'Etikett-motor',
      analytics: 'Analyse'
    }
  };
  return (titles[currentLang] || titles.sv)[viewId] || 'Dashboard';
}

function switchView(viewId) {
  const views = document.querySelectorAll('.view');
  const pageTitle = document.getElementById('pageTitle');
  views.forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) targetView.classList.add('active');
  pageTitle.textContent = getTitle(viewId);
}

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.getElementById('main').addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
}

/* ============================================
   SHIPMENTS SUB-PAGE
   ============================================ */
function initShipments() {
  // Go to shipments sub-page
  const goBtn = document.getElementById('goToShipments');
  if (goBtn) {
    goBtn.addEventListener('click', () => {
      switchView('automat-shipments');
      // Keep Automat highlighted in nav
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelector('[data-view="automat"]').classList.add('active');
    });
  }

  // Back to Automat
  const backBtn = document.getElementById('backToAutomat');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      switchView('automat');
      document.getElementById('pageTitle').textContent = getTitle('automat');
    });
  }

  // Carrier tabs
  const carrierTabs = document.querySelectorAll('.carrier-tab');
  const carrierPanels = document.querySelectorAll('.carrier-panel');

  carrierTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const carrier = tab.dataset.carrier;
      carrierTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      carrierPanels.forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(`panel-${carrier}`);
      if (panel) panel.classList.add('active');
    });
  });
}

// Toggle shipment expand/collapse
function toggleShipment(header) {
  const card = header.closest('.shipment-card');
  card.classList.toggle('open');
}

/* ============================================
   LANGUAGE SUPPORT
   ============================================ */
const translations = {
  sv: {
    // Sidebar
    'nav.dashboard': 'Dashboard',
    'nav.automat': 'Automat',
    'nav.invoice': 'Invoice Audit',
    'nav.reklamation': 'Reklamation',
    'nav.crossborder': 'Crossborder',
    'nav.labels': 'Label Engine',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Inställningar',
    // Topbar
    'search.placeholder': 'Sök order, tracking...',
    // Dashboard KPIs
    'kpi.orders': 'Ordrar denna vecka',
    'kpi.orders.change': '+12% vs förra veckan',
    'kpi.ontime': 'Leverans i tid',
    'kpi.recovered': 'Återvunnet denna månad',
    'kpi.recovered.sub': 'Reklamationer',
    'kpi.attention': 'Kräver uppmärksamhet',
    'kpi.attention.sub': 'Se Automat',
    // Dashboard cards
    'card.costs': 'Fraktkostnader per vecka',
    'card.carriers': 'Transportörer - fördelning',
    'card.activity': 'Senaste aktiviteter',
    'card.activity.all': 'Visa alla',
    'card.stock': 'Lageröversikt',
    'card.stock.link': 'Inköpsförslag →',
    // Automat
    'automat.title': 'Automat — Track & Trace',
    'automat.desc': 'Proaktiv bevakning av leveranser. Pushar aktiviteter för saker som <em>inte har hänt</em>.',
    'automat.newrule': 'Ny regel',
    'automat.shipments': 'Visa försändelser',
    'automat.rules': 'Aktiva regler',
    'automat.critical': 'Kritisk',
    'automat.warning': 'Varning',
    'automat.info': 'Info',
    'automat.contact': 'Kontakta transportör',
    'automat.notify': 'Notifiera kund',
    'automat.escalate': 'Eskalera ärende',
    'automat.details': 'Visa detaljer',
    'automat.showorders': 'Visa ordrar',
    // Shipments
    'shipments.title': 'Försändelser per transportör',
    'shipments.desc': 'Alla aktiva försändelser med detaljerad status och subaktiviteter.',
    'shipments.back': 'Tillbaka',
    'shipments.all': 'Alla',
    'shipments.transit': 'I transit',
    'shipments.delivered': 'Levererad',
    'shipments.problem': 'Problem',
    'shipments.search': 'Sök tracking, order...',
    'shipments.info': 'Försändelseinfo',
    'shipments.activities': 'Aktiviteter',
    // Invoice
    'invoice.title': 'Invoice Audit',
    'invoice.desc': 'Veckovis kontroll av fraktkostnader. Se avvikelser och trender.',
    'invoice.import': 'Importera faktura',
    'invoice.total': 'Total fraktkostnad v.10',
    'invoice.deviation': 'Avvikelse från avtal',
    'invoice.saving': 'Besparing YTD',
    'invoice.avg': 'Snitt per kolli',
    // Reklamation
    'reklam.title': 'Reklamation',
    'reklam.desc': 'Automatiserad reklamationshantering mot transportörer. HFL tar 10% av återvunnet värde.',
    'reklam.new': 'Nytt ärende',
    'reklam.recovered': 'Återvunnet totalt (YTD)',
    'reklam.rate': 'Godkännandegrad',
    'reklam.time': 'Snitt handläggningstid',
    'reklam.open': 'Öppna ärenden',
    // Crossborder
    'cross.title': 'Crossborder',
    'cross.desc': 'Internationell frakt via Worldease. Tull, moms och compliance på ett ställe.',
    'cross.new': 'Ny crossborder-order',
    'cross.countries': 'Länder aktiva',
    'cross.orders': 'Internationella ordrar (mars)',
    'cross.compliance': 'Tull-compliance',
    'cross.transit': 'Snitt transittid EU',
    'cross.markets': 'Marknader',
    // Labels
    'labels.title': 'Label Engine',
    'labels.desc': 'Skapa fraktetiketter snabbt. Automatisk prisberäkning med +20% marginal.',
    'labels.create': 'Skapa etikett',
    'labels.recent': 'Senaste etiketter',
    'labels.from': 'Från',
    'labels.to': 'Till',
    'labels.carrier': 'Transportör',
    'labels.month': 'Etiketter denna månad',
    'labels.avgprice': 'Snittpris',
    // Analytics
    'analytics.title': 'Analytics',
    'analytics.desc': 'Åtgång, lager, stock management & proaktiva inköpsförslag.',
    'analytics.export': 'Exportera',
    'analytics.suggest': 'Inköpsförslag',
    'analytics.skus': 'SKU:er i lager',
    'analytics.units': 'Enheter totalt',
    'analytics.below': 'Under min-nivå',
    'analytics.days': 'Snitt lagerdagar',
    'analytics.proactive': 'Proaktiva inköpsförslag',
    'analytics.consumption': 'Åtgång — Top produkter',
    'analytics.urgent': 'Brådskande',
    'analytics.soon': 'Snart',
    'analytics.plan': 'Planera',
    'analytics.createpo': 'Skapa inköpsorder',
    // Cost Dashboard
    'nav.costs': 'Cost Dashboard',
    'costs.title': 'Cost Dashboard',
    'costs.desc': 'Överblick av era fraktkostnader, trender och besparingsmöjligheter.',
    'costs.export': 'Exportera',
    'costs.total': 'Total fraktkostnad',
    'costs.perparcel': 'Kostnad per kolli',
    'costs.savings': 'Besparingar (identifierade)',
    'costs.shipments': 'Försändelser totalt',
    'costs.trend': 'Kostnadstrend',
    'costs.bycarrier': 'Kostnad per transportör',
    'costs.breakdown': 'Kostnadsfördelning',
    'costs.insights': 'Insikter & Besparingar',
    'costs.monthly': 'Månadsjämförelse'
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.automat': 'Automat',
    'nav.invoice': 'Invoice Audit',
    'nav.reklamation': 'Claims',
    'nav.crossborder': 'Crossborder',
    'nav.labels': 'Label Engine',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'search.placeholder': 'Search order, tracking...',
    'kpi.orders': 'Orders this week',
    'kpi.orders.change': '+12% vs last week',
    'kpi.ontime': 'On-time delivery',
    'kpi.recovered': 'Recovered this month',
    'kpi.recovered.sub': 'Claims',
    'kpi.attention': 'Needs attention',
    'kpi.attention.sub': 'See Automat',
    'card.costs': 'Shipping costs per week',
    'card.carriers': 'Carriers - distribution',
    'card.activity': 'Recent activities',
    'card.activity.all': 'View all',
    'card.stock': 'Stock overview',
    'card.stock.link': 'Purchase suggestions →',
    'automat.title': 'Automat — Track & Trace',
    'automat.desc': 'Proactive shipment monitoring. Pushes activities for things that <em>haven\'t happened</em>.',
    'automat.newrule': 'New rule',
    'automat.shipments': 'View shipments',
    'automat.rules': 'Active rules',
    'automat.critical': 'Critical',
    'automat.warning': 'Warning',
    'automat.info': 'Info',
    'automat.contact': 'Contact carrier',
    'automat.notify': 'Notify customer',
    'automat.escalate': 'Escalate case',
    'automat.details': 'View details',
    'automat.showorders': 'View orders',
    'shipments.title': 'Shipments by carrier',
    'shipments.desc': 'All active shipments with detailed status and sub-activities.',
    'shipments.back': 'Back',
    'shipments.all': 'All',
    'shipments.transit': 'In transit',
    'shipments.delivered': 'Delivered',
    'shipments.problem': 'Problem',
    'shipments.search': 'Search tracking, order...',
    'shipments.info': 'Shipment info',
    'shipments.activities': 'Activities',
    'invoice.title': 'Invoice Audit',
    'invoice.desc': 'Weekly control of shipping costs. View deviations and trends.',
    'invoice.import': 'Import invoice',
    'invoice.total': 'Total shipping cost w.10',
    'invoice.deviation': 'Deviation from contract',
    'invoice.saving': 'Savings YTD',
    'invoice.avg': 'Avg per parcel',
    'reklam.title': 'Claims',
    'reklam.desc': 'Automated claims handling against carriers. HFL takes 10% of recovered value.',
    'reklam.new': 'New case',
    'reklam.recovered': 'Recovered total (YTD)',
    'reklam.rate': 'Approval rate',
    'reklam.time': 'Avg processing time',
    'reklam.open': 'Open cases',
    'cross.title': 'Crossborder',
    'cross.desc': 'International shipping via Worldease. Customs, VAT and compliance in one place.',
    'cross.new': 'New crossborder order',
    'cross.countries': 'Countries active',
    'cross.orders': 'International orders (March)',
    'cross.compliance': 'Customs compliance',
    'cross.transit': 'Avg transit time EU',
    'cross.markets': 'Markets',
    'labels.title': 'Label Engine',
    'labels.desc': 'Create shipping labels fast. Automatic pricing with +20% margin.',
    'labels.create': 'Create label',
    'labels.recent': 'Recent labels',
    'labels.from': 'From',
    'labels.to': 'To',
    'labels.carrier': 'Carrier',
    'labels.month': 'Labels this month',
    'labels.avgprice': 'Avg price',
    'analytics.title': 'Analytics',
    'analytics.desc': 'Consumption, stock, stock management & proactive purchase suggestions.',
    'analytics.export': 'Export',
    'analytics.suggest': 'Purchase suggestions',
    'analytics.skus': 'SKUs in stock',
    'analytics.units': 'Total units',
    'analytics.below': 'Below min level',
    'analytics.days': 'Avg stock days',
    'analytics.proactive': 'Proactive purchase suggestions',
    'analytics.consumption': 'Consumption — Top products',
    'analytics.urgent': 'Urgent',
    'analytics.soon': 'Soon',
    'analytics.plan': 'Plan',
    'analytics.createpo': 'Create purchase order',
    // Cost Dashboard
    'nav.costs': 'Cost Dashboard',
    'costs.title': 'Cost Dashboard',
    'costs.desc': 'Overview of your shipping costs, trends and savings opportunities.',
    'costs.export': 'Export',
    'costs.total': 'Total shipping cost',
    'costs.perparcel': 'Cost per parcel',
    'costs.savings': 'Savings (identified)',
    'costs.shipments': 'Total shipments',
    'costs.trend': 'Cost trend',
    'costs.bycarrier': 'Cost by carrier',
    'costs.breakdown': 'Cost breakdown',
    'costs.insights': 'Insights & Savings',
    'costs.monthly': 'Monthly comparison'
  },
  no: {
    'nav.dashboard': 'Dashboard',
    'nav.automat': 'Automat',
    'nav.invoice': 'Fakturakontroll',
    'nav.reklamation': 'Reklamasjon',
    'nav.crossborder': 'Crossborder',
    'nav.labels': 'Etikett-motor',
    'nav.analytics': 'Analyse',
    'nav.settings': 'Innstillinger',
    'search.placeholder': 'Søk ordre, sporing...',
    'kpi.orders': 'Ordrer denne uken',
    'kpi.orders.change': '+12% vs forrige uke',
    'kpi.ontime': 'Levering i tide',
    'kpi.recovered': 'Gjenvunnet denne måneden',
    'kpi.recovered.sub': 'Reklamasjoner',
    'kpi.attention': 'Krever oppmerksomhet',
    'kpi.attention.sub': 'Se Automat',
    'card.costs': 'Fraktkostnader per uke',
    'card.carriers': 'Transportører - fordeling',
    'card.activity': 'Siste aktiviteter',
    'card.activity.all': 'Vis alle',
    'card.stock': 'Lageroversikt',
    'card.stock.link': 'Innkjøpsforslag →',
    'automat.title': 'Automat — Sporing',
    'automat.desc': 'Proaktiv overvåking av leveranser. Pusher aktiviteter for ting som <em>ikke har skjedd</em>.',
    'automat.newrule': 'Ny regel',
    'automat.shipments': 'Vis forsendelser',
    'automat.rules': 'Aktive regler',
    'automat.critical': 'Kritisk',
    'automat.warning': 'Advarsel',
    'automat.info': 'Info',
    'automat.contact': 'Kontakt transportør',
    'automat.notify': 'Varsle kunde',
    'automat.escalate': 'Eskaler sak',
    'automat.details': 'Vis detaljer',
    'automat.showorders': 'Vis ordrer',
    'shipments.title': 'Forsendelser per transportør',
    'shipments.desc': 'Alle aktive forsendelser med detaljert status og subaktiviteter.',
    'shipments.back': 'Tilbake',
    'shipments.all': 'Alle',
    'shipments.transit': 'I transit',
    'shipments.delivered': 'Levert',
    'shipments.problem': 'Problem',
    'shipments.search': 'Søk sporing, ordre...',
    'shipments.info': 'Forsendelsesinfo',
    'shipments.activities': 'Aktiviteter',
    'invoice.title': 'Fakturakontroll',
    'invoice.desc': 'Ukentlig kontroll av fraktkostnader. Se avvik og trender.',
    'invoice.import': 'Importer faktura',
    'invoice.total': 'Total fraktkostnad uke 10',
    'invoice.deviation': 'Avvik fra avtale',
    'invoice.saving': 'Besparelse YTD',
    'invoice.avg': 'Snitt per kolli',
    'reklam.title': 'Reklamasjon',
    'reklam.desc': 'Automatisert reklamasjonshåndtering mot transportører. HFL tar 10% av gjenvunnet verdi.',
    'reklam.new': 'Ny sak',
    'reklam.recovered': 'Gjenvunnet totalt (YTD)',
    'reklam.rate': 'Godkjenningsgrad',
    'reklam.time': 'Snitt behandlingstid',
    'reklam.open': 'Åpne saker',
    'cross.title': 'Crossborder',
    'cross.desc': 'Internasjonal frakt via Worldease. Toll, moms og compliance på ett sted.',
    'cross.new': 'Ny crossborder-ordre',
    'cross.countries': 'Land aktive',
    'cross.orders': 'Internasjonale ordrer (mars)',
    'cross.compliance': 'Toll-compliance',
    'cross.transit': 'Snitt transittid EU',
    'cross.markets': 'Markeder',
    'labels.title': 'Etikett-motor',
    'labels.desc': 'Lag fraktetiketter raskt. Automatisk prisberegning med +20% margin.',
    'labels.create': 'Lag etikett',
    'labels.recent': 'Siste etiketter',
    'labels.from': 'Fra',
    'labels.to': 'Til',
    'labels.carrier': 'Transportør',
    'labels.month': 'Etiketter denne måneden',
    'labels.avgprice': 'Snittpris',
    'analytics.title': 'Analyse',
    'analytics.desc': 'Forbruk, lager, lagerstyring & proaktive innkjøpsforslag.',
    'analytics.export': 'Eksporter',
    'analytics.suggest': 'Innkjøpsforslag',
    'analytics.skus': 'SKU-er på lager',
    'analytics.units': 'Enheter totalt',
    'analytics.below': 'Under min-nivå',
    'analytics.days': 'Snitt lagerdager',
    'analytics.proactive': 'Proaktive innkjøpsforslag',
    'analytics.consumption': 'Forbruk — Topp produkter',
    'analytics.urgent': 'Haster',
    'analytics.soon': 'Snart',
    'analytics.plan': 'Planlegg',
    'analytics.createpo': 'Lag innkjøpsordre',
    // Cost Dashboard
    'nav.costs': 'Kostnads-dashboard',
    'costs.title': 'Kostnads-dashboard',
    'costs.desc': 'Oversikt over fraktkostnader, trender og besparingsmuligheter.',
    'costs.export': 'Eksporter',
    'costs.total': 'Total fraktkostnad',
    'costs.perparcel': 'Kostnad per kolli',
    'costs.savings': 'Besparelser (identifiserte)',
    'costs.shipments': 'Forsendelser totalt',
    'costs.trend': 'Kostnadstrend',
    'costs.bycarrier': 'Kostnad per transportør',
    'costs.breakdown': 'Kostnadsfordeling',
    'costs.insights': 'Innsikter & Besparelser',
    'costs.monthly': 'Månedssammenligning'
  }
};

function t(key) {
  return (translations[currentLang] || translations.sv)[key] || translations.sv[key] || key;
}

function initLanguage() {
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLang = btn.dataset.lang;
      applyTranslations();
    });
  });
}

function applyTranslations() {
  // Apply translations to all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (el.dataset.i18nHtml) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  // Apply to placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  // Update current page title
  const activeView = document.querySelector('.view.active');
  if (activeView) {
    const viewId = activeView.id.replace('view-', '');
    document.getElementById('pageTitle').textContent = getTitle(viewId);
  }

  // Update company selector label
  updateCompanyLabel();
}

/* ============================================
   COMPANY SELECTOR (multi-select)
   ============================================ */
const companyNames = {
  minbutik: 'MinButik.se',
  sportshop: 'SportShop.se',
  nordicwear: 'NordicWear.no'
};

function initCompanySelector() {
  const selector = document.getElementById('companySelector');
  const trigger = document.getElementById('companySelectorTrigger');
  const dropdown = document.getElementById('companySelectorDropdown');
  const selectAllBtn = document.getElementById('companySelectAll');
  const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');

  // Toggle dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    selector.classList.toggle('open');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target)) {
      selector.classList.remove('open');
    }
  });

  // Checkbox change
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateCompanyLabel();
      filterByCompany();
    });
  });

  // Select all / Deselect all
  selectAllBtn.addEventListener('click', () => {
    const allChecked = [...checkboxes].every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
    updateCompanyLabel();
    filterByCompany();
  });

  updateCompanyLabel();
}

function getSelectedCompanies() {
  const checkboxes = document.querySelectorAll('#companySelectorDropdown input[type="checkbox"]');
  return [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);
}

function updateCompanyLabel() {
  const selected = getSelectedCompanies();
  const label = document.getElementById('companySelectorLabel');
  const total = Object.keys(companyNames).length;
  const selectAllBtn = document.getElementById('companySelectAll');

  if (selected.length === 0) {
    label.textContent = currentLang === 'en' ? 'No company selected' : currentLang === 'no' ? 'Ingen valgt' : 'Inget valt';
  } else if (selected.length === total) {
    label.textContent = currentLang === 'en' ? `All companies (${total})` : currentLang === 'no' ? `Alle selskaper (${total})` : `Alla företag (${total})`;
  } else if (selected.length === 1) {
    label.textContent = companyNames[selected[0]];
  } else {
    label.textContent = `${selected.length} ${currentLang === 'en' ? 'companies' : currentLang === 'no' ? 'selskaper' : 'företag'}`;
  }

  // Toggle button text
  const allChecked = selected.length === total;
  selectAllBtn.textContent = allChecked
    ? (currentLang === 'en' ? 'Deselect all' : currentLang === 'no' ? 'Fjern alle' : 'Avmarkera alla')
    : (currentLang === 'en' ? 'Select all' : currentLang === 'no' ? 'Velg alle' : 'Välj alla');
}

function filterByCompany() {
  const selected = getSelectedCompanies();
  const items = document.querySelectorAll('[data-company]');

  items.forEach(item => {
    const company = item.dataset.company;
    if (selected.includes(company) || selected.length === 0) {
      item.classList.remove('company-hidden');
    } else {
      item.classList.add('company-hidden');
    }
  });
}

/* ============================================
   CHARTS
   ============================================ */

let costChartInstance = null;
let carrierChartInstance = null;
let consumptionChartInstance = null;

function initCharts() {
  initCostChart();
  initCarrierChart();
}

function initCostChart() {
  const ctx = document.getElementById('costChart');
  if (!ctx) return;

  if (costChartInstance) costChartInstance.destroy();

  costChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['v.3', 'v.4', 'v.5', 'v.6', 'v.7', 'v.8', 'v.9', 'v.10'],
      datasets: [
        {
          label: 'PostNord',
          data: [38200, 36800, 41200, 39500, 40100, 38900, 39600, 42350],
          backgroundColor: '#800020',
          borderRadius: 4,
        },
        {
          label: 'DHL',
          data: [24100, 26300, 25800, 27200, 28100, 27800, 28200, 31470],
          backgroundColor: '#6F8FAF',
          borderRadius: 4,
        },
        {
          label: 'Budbee',
          data: [8200, 7900, 9100, 8600, 9800, 10200, 9800, 10500],
          backgroundColor: '#D0D5DD',
          borderRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { family: 'Open Sans', size: 12 } }
        },
        tooltip: {
          backgroundColor: '#1D2939', titleFont: { family: 'Open Sans', size: 13 }, bodyFont: { family: 'Open Sans', size: 12 },
          padding: 12, cornerRadius: 8,
          callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toLocaleString('sv-SE')} kr` }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Open Sans', size: 12 }, color: '#667085' } },
        y: { grid: { color: '#F0F2F5' }, ticks: { font: { family: 'Open Sans', size: 11 }, color: '#98A2B3', callback: (val) => (val / 1000) + 'k' } }
      }
    }
  });
}

function initCarrierChart() {
  const ctx = document.getElementById('carrierChart');
  if (!ctx) return;

  if (carrierChartInstance) carrierChartInstance.destroy();

  carrierChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['PostNord', 'DHL', 'Budbee', 'Övrigt'],
      datasets: [{
        data: [54, 28, 12, 6],
        backgroundColor: ['#800020', '#6F8FAF', '#12B76A', '#D0D5DD'],
        borderWidth: 0, hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { family: 'Open Sans', size: 12 } }
        },
        tooltip: {
          backgroundColor: '#1D2939', titleFont: { family: 'Open Sans', size: 13 }, bodyFont: { family: 'Open Sans', size: 12 },
          padding: 12, cornerRadius: 8,
          callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}%` }
        }
      }
    }
  });
}

function initConsumptionChart() {
  const ctx = document.getElementById('consumptionChart');
  if (!ctx) return;

  if (consumptionChartInstance) consumptionChartInstance.destroy();

  consumptionChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1 mar', '5 mar', '10 mar', '15 mar', '20 mar', '25 mar', '30 mar'],
      datasets: [
        {
          label: 'T-shirt Svart', data: [520, 480, 440, 380, 320, 280, 210],
          borderColor: '#800020', backgroundColor: 'rgba(128, 0, 32, 0.05)',
          fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2
        },
        {
          label: 'Hoodie Grå', data: [340, 320, 300, 280, 250, 210, 180],
          borderColor: '#6F8FAF', backgroundColor: 'rgba(111, 143, 175, 0.05)',
          fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2
        },
        {
          label: 'Sneakers Runner X', data: [480, 470, 462, 450, 440, 425, 412],
          borderColor: '#12B76A', backgroundColor: 'rgba(18, 183, 106, 0.05)',
          fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { family: 'Open Sans', size: 12 } }
        },
        tooltip: {
          backgroundColor: '#1D2939', titleFont: { family: 'Open Sans', size: 13 }, bodyFont: { family: 'Open Sans', size: 12 },
          padding: 12, cornerRadius: 8,
          callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} st` }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Open Sans', size: 12 }, color: '#667085' } },
        y: { grid: { color: '#F0F2F5' }, ticks: { font: { family: 'Open Sans', size: 11 }, color: '#98A2B3', callback: (val) => val + ' st' } }
      }
    }
  });
}

/* ============================================
   COST DASHBOARD CHARTS
   ============================================ */

let costTrendChartInstance = null;
let costByCarrierChartInstance = null;

function initCostDashboardCharts() {
  initCostTrendChart();
  initCostByCarrierChart();
}

function initCostTrendChart() {
  const ctx = document.getElementById('costTrendChart');
  if (!ctx) return;

  if (costTrendChartInstance) costTrendChartInstance.destroy();

  costTrendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Okt', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      datasets: [
        {
          label: 'Total kostnad',
          data: [212000, 207500, 245200, 235980, 238820, 248640],
          borderColor: '#800020',
          backgroundColor: 'rgba(128, 0, 32, 0.06)',
          fill: true, tension: 0.35, pointRadius: 4, borderWidth: 2.5,
          pointBackgroundColor: '#800020'
        },
        {
          label: 'Kostnad/kolli (×1000)',
          data: [51200, 50400, 35800, 52300, 49000, 47200],
          borderColor: '#6F8FAF',
          backgroundColor: 'transparent',
          fill: false, tension: 0.35, pointRadius: 3, borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: '#6F8FAF'
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { family: 'Open Sans', size: 12 } }
        },
        tooltip: {
          backgroundColor: '#1D2939', titleFont: { family: 'Open Sans', size: 13 }, bodyFont: { family: 'Open Sans', size: 12 },
          padding: 12, cornerRadius: 8,
          callbacks: {
            label: (ctx) => {
              if (ctx.datasetIndex === 0) return `Total: ${(ctx.raw / 1000).toFixed(0)}k kr`;
              return `Per kolli: ${(ctx.raw / 1000).toFixed(1)} kr`;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Open Sans', size: 12 }, color: '#667085' } },
        y: { grid: { color: '#F0F2F5' }, ticks: { font: { family: 'Open Sans', size: 11 }, color: '#98A2B3', callback: (val) => (val / 1000) + 'k' } }
      }
    }
  });
}

function initCostByCarrierChart() {
  const ctx = document.getElementById('costByCarrierChart');
  if (!ctx) return;

  if (costByCarrierChartInstance) costByCarrierChartInstance.destroy();

  costByCarrierChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['PostNord', 'DHL', 'Budbee', 'Övrigt'],
      datasets: [
        {
          label: 'Fraktkostnad',
          data: [129290, 74592, 29837, 14921],
          backgroundColor: ['#800020', '#6F8FAF', '#12B76A', '#D0D5DD'],
          borderRadius: 6,
          barPercentage: 0.6
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1D2939', titleFont: { family: 'Open Sans', size: 13 }, bodyFont: { family: 'Open Sans', size: 12 },
          padding: 12, cornerRadius: 8,
          callbacks: { label: (ctx) => `${ctx.raw.toLocaleString('sv-SE')} kr` }
        }
      },
      scales: {
        x: { grid: { color: '#F0F2F5' }, ticks: { font: { family: 'Open Sans', size: 11 }, color: '#98A2B3', callback: (val) => (val / 1000) + 'k kr' } },
        y: { grid: { display: false }, ticks: { font: { family: 'Open Sans', size: 13, weight: '600' }, color: '#344054' } }
      }
    }
  });
}
