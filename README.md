# TRIAGE-MEDICO

Aplicación web responsiva para captura de triage, identificación de signos de alarma y asignación automática orientativa de prioridad.

## Funciones actuales

- Derechohabiencia: IMSS, ISSSTE, IMSS-Bienestar, Secretaría de Salud, privado y otros.
- Campo NSS/afiliación condicionado para IMSS e ISSSTE.
- Fecha de nacimiento y cálculo automático de edad en años, meses y días.
- Identificación de paciente pediátrico o adulto.
- Presión arterial con formato automático `120/80`.
- Captura de FC, FR, SpO₂, temperatura y glucosa capilar.
- Alertas visuales de signos vitales fuera de rango.
- Clasificación automática en Azul, Verde, Amarillo, Naranja o Rojo.
- Formato profesional para impresión.
- Diseño adaptable a celular, tableta y computadora.

## Uso local

No requiere instalación. Descarga el repositorio y abre `index.html` en un navegador moderno.

## Publicación con GitHub Pages

El flujo incluido en `.github/workflows/pages.yml` publica automáticamente la página cuando se envían cambios a `main`. En GitHub, entra a **Settings → Pages** y selecciona **GitHub Actions** como fuente si todavía no está habilitado.

## Aviso clínico

Esta herramienta es de apoyo y no sustituye protocolos institucionales, juicio clínico ni reevaluación médica. Los umbrales deben validarse y adaptarse al sistema de triage utilizado por la institución antes de emplearse en atención real.