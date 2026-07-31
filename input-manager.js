/* TRIAGE input manager v3: Safari/iPad compatible + institutional themes */
(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const digits = (value, max) => String(value || '').replace(/\D/g, '').slice(0, max);

  const institutionalThemes = {
    imss: {
      primary: '#006847',
      secondary: '#0b5d46',
      accent: '#bc955c',
      background: '#edf5f1',
      line: '#cddfd7',
      ink: '#173a30'
    },
    bienestar: {
      primary: '#611232',
      secondary: '#9f2241',
      accent: '#bc955c',
      background: '#f7eff2',
      line: '#e2cdd5',
      ink: '#421125'
    },
    salud: {
      primary: '#611232',
      secondary: '#9f2241',
      accent: '#bc955c',
      background: '#f7eff2',
      line: '#e2cdd5',
      ink: '#421125'
    },
    issste: {
      primary: '#005f73',
      secondary: '#007f86',
      accent: '#78a22f',
      background: '#edf6f7',
      line: '#c9dfe2',
      ink: '#173c43'
    },
    private: {
      primary: '#334155',
      secondary: '#475569',
      accent: '#94a3b8',
      background: '#f1f5f9',
      line: '#d7dee7',
      ink: '#1e293b'
    }
  };

  function getStoredProfile() {
    try {
      return JSON.parse(localStorage.getItem('triageProfileV3') || 'null');
    } catch {
      return null;
    }
  }

  function applyInstitutionTheme(institution) {
    const key = institutionalThemes[institution] ? institution : 'private';
    const theme = institutionalThemes[key];
    const root = document.documentElement;
    root.dataset.institution = key;
    root.style.setProperty('--p', theme.primary);
    root.style.setProperty('--s', theme.secondary);
    root.style.setProperty('--a', theme.accent);
    root.style.setProperty('--bg', theme.background);
    root.style.setProperty('--line', theme.line);
    root.style.setProperty('--ink', theme.ink);
    document.body?.setAttribute('data-institution', key);
  }

  function setupInstitutionTheme() {
    const selector = byId('profileInstitution');
    const profileButton = byId('profileBtn');
    const editButton = byId('editProfileBtn');
    const profile = getStoredProfile();

    applyInstitutionTheme(profile?.institution || selector?.value || 'bienestar');

    selector?.addEventListener('change', () => applyInstitutionTheme(selector.value));
    profileButton?.addEventListener('click', () => {
      applyInstitutionTheme(selector?.value || 'bienestar');
      setTimeout(() => applyInstitutionTheme(getStoredProfile()?.institution || selector?.value || 'bienestar'), 0);
    });
    editButton?.addEventListener('click', () => {
      setTimeout(() => applyInstitutionTheme(selector?.value || getStoredProfile()?.institution || 'bienestar'), 0);
    });

    window.addEventListener('storage', event => {
      if (event.key === 'triageProfileV3') applyInstitutionTheme(getStoredProfile()?.institution || 'bienestar');
    });
  }

  function enhancePrintForm() {
    const originalBuildPrint = window.buildPrint;
    if (typeof originalBuildPrint !== 'function') return;

    window.buildPrint = function enhancedBuildPrint(visit) {
      originalBuildPrint(visit);
      const sheet = byId('printSheet');
      const meta = sheet?.querySelector('.meta');
      const form = sheet?.querySelector('.form');
      const institution = visit?.institution || getStoredProfile()?.institution || 'bienestar';
      const classifiedAt = new Date(visit?.savedAt || Date.now());

      if (form) {
        form.dataset.institution = institution;
        form.classList.add(`print-${institution}`);
      }
      if (meta) {
        const date = classifiedAt.toLocaleDateString('es-MX');
        const time = classifiedAt.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        meta.innerHTML = `<div><b>Fecha:</b> ${date}</div><div><b>Hora de clasificación:</b> ${time}</div>`;
      }
    };
  }

  function parseBirth(value) {
    const raw = digits(value, 8);
    if (raw.length !== 8) return null;
    const day = Number(raw.slice(0, 2));
    const month = Number(raw.slice(2, 4));
    const year = Number(raw.slice(4, 8));
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day ||
      year < 1900 ||
      date > new Date()
    ) return null;
    return date;
  }

  function formatBirth(value) {
    const raw = digits(value, 8);
    if (raw.length <= 2) return raw.length === 2 ? raw + '/' : raw;
    if (raw.length <= 4) return raw.slice(0, 2) + '/' + raw.slice(2) + (raw.length === 4 ? '/' : '');
    return raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4);
  }

  function updateAge() {
    const birth = byId('birth');
    const age = byId('age');
    if (!birth || !age) return;
    const date = parseBirth(birth.value);
    if (!date) {
      age.textContent = digits(birth.value, 8).length === 8 ? 'Fecha inválida' : 'Sin fecha válida';
      return;
    }
    const now = new Date();
    let years = now.getFullYear() - date.getFullYear();
    let months = now.getMonth() - date.getMonth();
    let days = now.getDate() - date.getDate();
    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    age.textContent = `${years} años, ${months} meses, ${days} días`;
  }

  function configureTextNumeric(el, max, callback) {
    if (!el) return;
    el.type = 'text';
    el.inputMode = 'numeric';
    el.pattern = '[0-9]*';
    el.autocomplete = 'off';
    el.addEventListener('input', () => {
      el.value = digits(el.value, max);
      callback?.();
    }, true);
    el.addEventListener('paste', () => setTimeout(() => {
      el.value = digits(el.value, max);
      callback?.();
    }, 0), true);
  }

  function setupBirth() {
    const el = byId('birth');
    if (!el) return;
    el.type = 'text';
    el.inputMode = 'numeric';
    el.pattern = '[0-9/]*';
    el.maxLength = 10;
    el.autocomplete = 'off';
    const sanitize = () => {
      el.value = formatBirth(el.value);
      updateAge();
    };
    el.addEventListener('input', sanitize, true);
    el.addEventListener('change', sanitize, true);
    el.addEventListener('paste', () => setTimeout(sanitize, 0), true);
    el.addEventListener('blur', sanitize, true);
  }

  function setupTemperature() {
    const el = byId('temp');
    if (!el) return;
    el.type = 'text';
    el.inputMode = 'decimal';
    el.pattern = '[0-9.]*';
    el.maxLength = 4;
    el.addEventListener('input', () => {
      let value = el.value.replace(',', '.').replace(/[^0-9.]/g, '');
      const parts = value.split('.');
      el.value = parts[0].slice(0, 2) + (parts.length > 1 ? '.' + parts.slice(1).join('').slice(0, 1) : '');
      window.evaluate?.();
    }, true);
  }

  function setupBloodPressure() {
    const el = byId('bp');
    if (!el) return;
    el.type = 'text';
    el.inputMode = 'numeric';
    el.pattern = '[0-9/]*';
    el.maxLength = 7;
    el.addEventListener('input', () => {
      const raw = String(el.value || '').replace(/[^0-9/]/g, '');
      const numbers = raw.replace(/\D/g, '').slice(0, 6);
      if (raw.includes('/')) {
        const [a = '', ...rest] = raw.split('/');
        el.value = digits(a, 3) + '/' + digits(rest.join(''), 3);
      } else if (numbers.length > 3) {
        el.value = numbers.slice(0, 3) + '/' + numbers.slice(3);
      } else {
        el.value = numbers;
      }
      window.evaluate?.();
    }, true);
  }

  function blockInvalidBirthBeforeSave() {
    const button = byId('savePrintBtn');
    if (!button) return;
    button.addEventListener('click', event => {
      const birth = byId('birth');
      if (!birth || parseBirth(birth.value)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      alert('Capture una fecha de nacimiento real en formato DD/MM/AAAA.');
      birth.focus();
    }, true);
  }

  function setup() {
    setupInstitutionTheme();
    enhancePrintForm();
    setupBirth();
    configureTextNumeric(byId('profileLicense'), 12);
    configureTextNumeric(byId('nss'), 11);
    configureTextNumeric(byId('hr'), 3, () => window.evaluate?.());
    configureTextNumeric(byId('rr'), 2, () => window.evaluate?.());
    configureTextNumeric(byId('glucose'), 3, () => window.evaluate?.());
    configureTextNumeric(byId('spo2'), 3, () => window.evaluate?.());
    setupTemperature();
    setupBloodPressure();
    blockInvalidBirthBeforeSave();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }
})();
