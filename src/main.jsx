import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Ban,
  Bot,
  CalendarDays,
  CalendarX,
  Clock,
  HelpCircle,
  Inbox,
  MessageSquareText,
  RefreshCw,
  Scissors,
  Send,
  Settings,
  Stethoscope,
  UserRound,
  LogOut,
  Copy,
  Save,
  Plus,
  XCircle
} from "lucide-react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const PUBLIC_APP_URL = (import.meta.env.VITE_PUBLIC_APP_URL || API_URL).replace(/\/$/, "");
const FRONTEND_URL = window.location.origin;
const DEMO_BARBERIA_URL = `${PUBLIC_APP_URL}/demo-barberia.html`;
const DEMO_DENTAL_URL = `${PUBLIC_APP_URL}/demo-dental.html`;
const LEAD_STATUSES = [
  ["all", "Todos"],
  ["nuevo", "Nuevos"],
  ["contactado", "Contactados"],
  ["cita_agendada", "Cita agendada"],
  ["perdido", "Perdidos"]
];
const DAYS = [
  ["1", "Lunes"],
  ["2", "Martes"],
  ["3", "Miércoles"],
  ["4", "Jueves"],
  ["5", "Viernes"],
  ["6", "Sábado"],
  ["0", "Domingo"]
];

function parseSchedule(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return {};
  }
}

function defaultSchedule() {
  return DAYS.reduce((acc, [day]) => {
    acc[day] = day === "0" ? [] : [{ start: "10:00", end: "20:00" }];
    return acc;
  }, {});
}

function toDatetimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function toApiDate(value) {
  return value ? new Date(value).toISOString() : "";
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString("es-MX") : "";
}


const demoPages = {
  "/demo-barberia": {
    type: "barber",
    businessId: "demo_barberia",
    title: "Barbería Demo",
    eyebrow: "Demo con asistente automático",
    description: "Corte, barba y arreglo personal con atención rápida desde la página. Abre el chat para pedir precios, horarios o solicitar una cita.",
    primary: "Probar asistente",
    secondary: "Ver servicios",
    servicesTitle: "Servicios populares",
    servicesLead: "Precios de ejemplo para mostrar cómo el asistente puede responder dudas frecuentes y guiar al cliente hacia una solicitud de cita.",
    services: [
      ["Corte clásico", "Lavado rápido, corte y peinado.", "$180"],
      ["Corte + barba", "Corte completo y delineado de barba.", "$280"],
      ["Barba premium", "Toalla caliente, perfilado y aceite.", "$150"],
      ["Facial express", "Limpieza rápida y mascarilla.", "$220"]
    ],
    infoTitle: "Información del negocio",
    infoLead: "El bot puede contestar esta información automáticamente y capturar al cliente si quiere seguimiento.",
    info: [["Horario", "Lunes a sábado de 10:00 a 20:00. Domingo cerrado."], ["Ubicación", "Sucursal Centro, cerca de zona comercial."], ["Agenda", "Solicitudes por chat web con nombre, teléfono y servicio."]],
    storyTitle: "Experiencia lista para vender",
    story: "Esta página funciona como demo para mostrarle a una barbería cómo se vería su asistente: captura el lead, responde dudas y deja la conversación en el panel.",
    faqs: [["¿Necesito pagar WhatsApp API?", "No para esta fase. El asistente funciona desde la página web y captura leads directamente."], ["¿El negocio ve los clientes?", "Sí. Los leads quedan en el panel con estado, notas y conversación completa."], ["¿Se puede adaptar a otra estética?", "Sí. Se cambian servicios, textos, precios, horarios y colores para cada negocio."]]
  },
  "/demo-dental": {
    type: "dental",
    businessId: "demo_dental",
    title: "Clínica Dental Demo",
    eyebrow: "Demo con asistente para pacientes",
    description: "Un asistente web que orienta al paciente, responde dudas comunes y captura solicitudes de valoración sin depender de WhatsApp API.",
    primary: "Probar asistente",
    secondary: "Ver tratamientos",
    servicesTitle: "Tratamientos frecuentes",
    servicesLead: "Servicios de ejemplo para mostrar cómo el asistente puede orientar pacientes y generar solicitudes claras para el equipo.",
    services: [["Valoración inicial", "Revisión general y plan sugerido.", "$300"], ["Limpieza dental", "Profilaxis y recomendaciones de cuidado.", "$650"], ["Ortodoncia", "Evaluación para brackets o alineadores.", "Desde $900"], ["Urgencia dental", "Dolor, inflamación o molestia repentina.", "Prioridad"]],
    infoTitle: "Atención clara desde el primer mensaje",
    infoLead: "El asistente no diagnostica. Captura la solicitud, orienta con información general y pasa el caso al equipo para seguimiento.",
    info: [["Captura del paciente", "Nombre, teléfono, correo y motivo de consulta."], ["Clasificación", "Valoración, limpieza, ortodoncia o urgencia."], ["Seguimiento", "El equipo ve el lead, notas e historial completo en el panel."]],
    storyTitle: "Demo para mostrar a clínicas",
    story: "Esta página enseña cómo una clínica dental puede recibir solicitudes desde su sitio web, incluso sin conectar WhatsApp oficial.",
    faqs: [["¿El bot da diagnósticos?", "No. Solo brinda información general y captura la solicitud para que la revise el equipo."], ["¿Puede priorizar urgencias?", "Sí. Puede identificar mensajes de dolor o urgencia y marcarlos para atención humana."], ["¿Se adapta a tratamientos reales?", "Sí. Se configuran servicios, precios, horarios, preguntas frecuentes y tono de la clínica."]]
  }
};

function PublicNav({ compact = false }) {
  return (
    <nav className="public-nav" aria-label="Navegación principal">
      <a className="public-brand" href="/">AutoChat Web</a>
      <div className="public-links">
        <a href="/proyectos">Proyectos</a>
        <a href="/#demos">Demos</a>
        <a href="/admin">Panel</a>
        {!compact && <a className="public-button" href="#contacto">Solicitar diagnóstico</a>}
      </div>
    </nav>
  );
}

function PublicWidget({ businessId }) {
  useEffect(() => {
    const existing = document.querySelector("script[data-autochat-public-widget]");
    if (existing) existing.remove();
    document.querySelector("#ac-toggle")?.parentElement?.remove();
    const script = document.createElement("script");
    script.src = API_URL + "/public/widget.js";
    script.dataset.apiUrl = API_URL;
    script.dataset.businessId = businessId;
    script.dataset.autochatPublicWidget = "true";
    document.body.appendChild(script);
    return () => {
      script.remove();
      document.querySelector("#ac-toggle")?.parentElement?.remove();
    };
  }, [businessId]);
  return null;
}

function LandingPage() {
  return (
    <main className="public-page">
      <section className="public-hero landing-hero">
        <PublicNav />
        <div className="public-hero-content">
          <span className="public-eyebrow">Automatización web personalizada</span>
          <h1>Asistentes web hechos para tu proceso</h1>
          <p>Creamos asistentes automáticos para páginas y landing pages que responden preguntas, capturan clientes y organizan solicitudes según el flujo real de cada negocio.</p>
          <div className="public-actions"><a className="public-button" href="/proyectos">Ver cómo funciona</a><a className="public-button secondary" href="#demos">Ver demos</a></div>
        </div>
      </section>
      <section className="public-section" id="soluciones"><div className="public-inner"><h2>Tu negocio no necesita otro formulario abandonado</h2><p className="public-lead">AutoChat se implementa por proyecto. Analizamos qué preguntas recibe tu negocio, qué datos necesita capturar y cómo debe avanzar cada oportunidad.</p><div className="public-grid three"><article><strong>Captura de clientes</strong><span>Nombre, teléfono, correo y contexto de la solicitud desde el primer contacto.</span></article><article><strong>Respuestas automáticas</strong><span>Servicios, precios, horarios, ubicación, políticas y preguntas frecuentes.</span></article><article><strong>Seguimiento comercial</strong><span>Panel de leads con estados, notas internas y conversación completa.</span></article></div></div></section>
      <section className="public-section public-band"><div className="public-inner public-split"><div><h2>Un canal propio, sin depender de WhatsApp API</h2><p className="public-lead">El asistente vive en la página del cliente. WhatsApp oficial puede agregarse después como fase premium, pero el proyecto puede venderse y operar desde web desde el día uno.</p><a className="public-button" href="/proyectos">Ver proceso de trabajo</a></div><div className="public-preview" aria-label="Vista previa del asistente"><header><span></span><span></span><span></span></header><div className="preview-lines"><b></b><i></i><i></i><i></i></div><div className="preview-chat"><strong>Asistente</strong><span></span><span></span><span></span></div></div></div></section>
      <section className="public-section" id="demos"><div className="public-inner"><h2>Demos como ejemplos, no como límite</h2><p className="public-lead">Estas demos muestran distintos tonos y flujos. El asistente se adapta a cualquier negocio que necesite responder, filtrar y dar seguimiento.</p><div className="public-grid three"><article><strong>Barbería / estética</strong><span>Servicios, precios, horarios y solicitudes de cita como ejemplo comercial.</span><a className="public-button" href={DEMO_BARBERIA_URL}>Ver demo</a></article><article><strong>Clínica dental</strong><span>Valoración, limpieza, urgencias y captura de paciente con tono profesional.</span><a className="public-button" href={DEMO_DENTAL_URL}>Ver demo</a></article><article><strong>Proyecto personalizado</strong><span>Talleres, consultorios, inmobiliarias, cursos, despachos, servicios técnicos y más.</span><a className="public-button" href="/proyectos">Ver proyectos</a></article></div></div></section>
      <section className="public-section" id="paquetes"><div className="public-inner"><h2>Implementación por proyecto</h2><p className="public-lead">El precio depende del flujo, contenido y nivel de personalización. La idea es empezar ligero y crecer cuando el canal demuestre valor.</p><div className="public-grid three price-grid"><article><strong>Proyecto inicial</strong><b>$2,500+</b><span>Widget web, flujo conversacional, captura de leads y panel de seguimiento.</span></article><article><strong>Proyecto avanzado</strong><b>$6,000+</b><span>Landing personalizada, FAQs, reglas de negocio, agenda o cotización.</span></article><article><strong>Mantenimiento</strong><b>$500+</b><span>Hosting básico, soporte, ajustes menores y mejoras del flujo.</span></article></div></div></section>
      <section className="public-section public-cta" id="contacto"><div className="public-inner"><h2>Solicita un diagnóstico del flujo</h2><p className="public-lead">Abre el chat, deja tus datos y cuéntanos qué proceso quieres automatizar en tu página.</p><a className="public-button" href="/proyectos">Ver soluciones por proyecto</a></div></section>
      <PublicFooter />
      <PublicWidget businessId="demo_proyectos" />
    </main>
  );
}

function ProjectsPage() {
  return (
    <main className="public-page">
      <section className="public-hero projects-hero"><PublicNav /><div className="public-hero-content"><span className="public-eyebrow">Soluciones por proyecto</span><h1>Automatizamos el primer contacto de tu negocio</h1><p>Diseñamos asistentes web para capturar clientes, responder preguntas y ordenar solicitudes según tu proceso: cotizaciones, citas, servicios, pacientes, alumnos o prospectos.</p><div className="public-actions"><a className="public-button" href="#proceso">Ver proceso</a><a className="public-button secondary" href="#casos">Ver casos de uso</a></div></div></section>
      <section className="public-section"><div className="public-inner"><h2>Qué podemos automatizar</h2><p className="public-lead">No partimos de un nicho fijo. Partimos de la pregunta: qué necesitas capturar, responder o filtrar antes de que intervenga una persona.</p><div className="public-grid three"><article><strong>Leads y prospectos</strong><span>Captura datos y motivo de contacto para que ventas dé seguimiento.</span></article><article><strong>Cotizaciones</strong><span>Recopila datos iniciales para preparar precios o propuestas.</span></article><article><strong>Solicitudes de cita</strong><span>Pide servicio, día, hora, datos del cliente y deja todo en panel.</span></article><article><strong>Soporte inicial</strong><span>Responde preguntas frecuentes y deriva a humano cuando hace falta.</span></article><article><strong>Precalificación</strong><span>Filtra prospectos por necesidad, presupuesto, ubicación o urgencia.</span></article><article><strong>Registro de interesados</strong><span>Ideal para cursos, eventos, servicios profesionales o campañas.</span></article></div></div></section>
      <section className="public-section public-band" id="proceso"><div className="public-inner"><h2>Proceso de trabajo</h2><p className="public-lead">Una implementación pequeña puede arrancar rápido. Luego se mejora con datos reales de los clientes que escriben.</p><div className="public-grid three"><article><strong>1. Diagnóstico</strong><span>Definimos objetivo, preguntas frecuentes y datos a capturar.</span></article><article><strong>2. Flujo</strong><span>Armamos el recorrido conversacional y reglas básicas.</span></article><article><strong>3. Implementación</strong><span>Instalamos widget o landing y conectamos el panel de leads.</span></article><article><strong>4. Prueba</strong><span>Probamos casos reales y ajustamos tono, respuestas y formularios.</span></article><article><strong>5. Operación</strong><span>El equipo da seguimiento desde la bandeja de leads.</span></article><article><strong>6. Mejora</strong><span>Se agregan automatizaciones o canales premium cuando conviene.</span></article></div></div></section>
      <section className="public-section" id="casos"><div className="public-inner"><h2>Casos de uso posibles</h2><p className="public-lead">Las demos actuales son ejemplos. El mismo enfoque aplica a muchos tipos de negocio.</p><div className="public-grid three"><article><strong>Servicios locales</strong><span>Barberías, estéticas, talleres, limpieza, reparaciones, instaladores.</span></article><article><strong>Profesionales</strong><span>Abogados, contadores, arquitectos, consultores, agencias.</span></article><article><strong>Salud y bienestar</strong><span>Consultorios, dentistas, psicólogos, spas, gimnasios, terapeutas.</span></article><article><strong>Educación</strong><span>Cursos, escuelas, academias, talleres y capacitaciones.</span></article><article><strong>Inmobiliarias</strong><span>Captura de compradores, renta, presupuesto, zona y seguimiento.</span></article><article><strong>B2B</strong><span>Solicitudes comerciales, demos, cotizaciones y clasificación de prospectos.</span></article></div></div></section>
      <section className="public-section public-cta" id="contacto"><div className="public-inner"><h2>Cuéntanos qué quieres automatizar</h2><p className="public-lead">Abre el chat y describe tu negocio. La idea es convertir tu proceso actual en un asistente web claro y medible.</p><a className="public-button" href="#">Chat disponible abajo</a></div></section>
      <PublicFooter />
      <PublicWidget businessId="demo_proyectos" />
    </main>
  );
}

function DemoPage({ page }) {
  return (
    <main className={'public-page demo-page ' + page.type}>
      <section className="public-hero demo-hero"><PublicNav compact /><div className="public-hero-content"><span className="public-eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.description}</p><div className="public-actions"><a className="public-button" href="#probar">{page.primary}</a><a className="public-button secondary" href="#servicios">{page.secondary}</a></div></div></section>
      <section className="public-section" id="servicios"><div className="public-inner"><h2>{page.servicesTitle}</h2><p className="public-lead">{page.servicesLead}</p><div className="public-grid four">{page.services.map(([name, desc, price]) => <article key={name}><strong>{name}</strong><span>{desc}</span><b>{price}</b></article>)}</div></div></section>
      <section className="public-section public-band"><div className="public-inner"><h2>{page.infoTitle}</h2><p className="public-lead">{page.infoLead}</p><div className="public-grid three">{page.info.map(([name, desc]) => <article key={name}><strong>{name}</strong><span>{desc}</span></article>)}</div></div></section>
      <section className="public-section"><div className="public-inner public-split"><div><h2>{page.storyTitle}</h2><p className="public-lead">{page.story}</p><a className="public-button" href="#probar">Abrir chat</a></div><div className="demo-photo" aria-label={page.title}></div></div></section>
      <section className="public-section"><div className="public-inner"><h2>Preguntas frecuentes</h2><div className="public-grid three">{page.faqs.map(([question, answer]) => <article key={question}><strong>{question}</strong><span>{answer}</span></article>)}</div></div></section>
      <section className="public-section public-cta" id="probar"><div className="public-inner"><h2>Prueba el asistente</h2><p className="public-lead">Abre el chat de la esquina inferior derecha, deja tus datos y pregunta por un servicio u horario disponible.</p><a className="public-button" href="#">Chat disponible abajo</a></div></section>
      <PublicFooter label={page.title} />
      <PublicWidget businessId={page.businessId} />
    </main>
  );
}

function PublicFooter({ label = "AutoChat Web" }) {
  return <footer className="public-footer"><div className="public-inner"><strong>{label}</strong><span>Automatización web personalizada para negocios.</span></div></footer>;
}

function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "/admin") return <AdminApp />;
  if (path === "/proyectos") return <ProjectsPage />;
  if (demoPages[path]) return <DemoPage page={demoPages[path]} />;
  return <LandingPage />;
}

function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem("autochat_token") || "");
  const [view, setView] = useState("dashboard");
  const [loginForm, setLoginForm] = useState({ email: "admin@autochat.test", password: "123456" });
  const [businesses, setBusinesses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [conversations, setConversations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [calendar, setCalendar] = useState(null);
  const [leadFilter, setLeadFilter] = useState("all");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [leadNotes, setLeadNotes] = useState("");
  const [message, setMessage] = useState("Quiero agendar una cita");
  const [sender, setSender] = useState("+525550000001");
  const [notice, setNotice] = useState("");
  const [blockForm, setBlockForm] = useState({
    staffId: "",
    startsAt: "",
    endsAt: "",
    reason: "Bloqueo manual"
  });
  const [rescheduleForm, setRescheduleForm] = useState({ appointmentId: "", startsAt: "" });
  const [settingsForm, setSettingsForm] = useState({});
  const [scheduleForm, setScheduleForm] = useState(defaultSchedule());
  const [serviceForm, setServiceForm] = useState({
    id: "",
    name: "",
    durationMinutes: 45,
    price: 0,
    bufferMinutes: 10,
    active: true
  });
  const [faqForm, setFaqForm] = useState({ id: "", question: "", answer: "", active: true });
  const [customerForm, setCustomerForm] = useState({ id: "", name: "", email: "", notes: "", leadStatus: "nuevo" });
  const [manualReply, setManualReply] = useState({ customerId: "", text: "" });
  const [templateForm, setTemplateForm] = useState({ id: "", key: "", name: "", body: "", active: true });
  const [staffForm, setStaffForm] = useState({ name: "", serviceIds: [] });

  const selected = useMemo(
    () => businesses.find((business) => business.id === selectedId) || businesses[0],
    [businesses, selectedId]
  );

  function authHeaders(extra = {}) {
    return { ...extra, Authorization: `Bearer ${token}` };
  }

  async function apiFetch(path, options = {}) {
    const headers = authHeaders(options.headers || {});
    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem("autochat_token");
      setToken("");
    }
    return response;
  }

  async function login(event) {
    event.preventDefault();
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm)
    });
    const body = await response.json();
    if (!response.ok) {
      setNotice(body.error || "No se pudo iniciar sesión.");
      return;
    }
    localStorage.setItem("autochat_token", body.token);
    setToken(body.token);
    setNotice("");
  }

  function logout() {
    localStorage.removeItem("autochat_token");
    setToken("");
    setBusinesses([]);
  }

  async function loadData(businessId = selected?.id) {
    if (!token) return;
    const [businessRes, conversationsRes, appointmentsRes, staffRes, blocksRes, customersRes, dashboardRes, inboxRes, templatesRes, remindersRes, calendarRes] = await Promise.all([
      apiFetch(`/api/businesses`),
      apiFetch(`/api/conversations${businessId ? `?businessId=${businessId}` : ""}`),
      businessId ? apiFetch(`/api/appointments?businessId=${businessId}`) : Promise.resolve({ json: async () => [] }),
      businessId ? apiFetch(`/api/businesses/${businessId}/staff`) : Promise.resolve({ json: async () => [] }),
      businessId ? apiFetch(`/api/businesses/${businessId}/blocks`) : Promise.resolve({ json: async () => [] }),
      businessId ? apiFetch(`/api/businesses/${businessId}/customers`) : Promise.resolve({ json: async () => [] }),
      businessId ? apiFetch(`/api/dashboard/${businessId}`) : Promise.resolve({ json: async () => null }),
      businessId ? apiFetch(`/api/inbox/${businessId}${leadFilter !== "all" ? `?status=${leadFilter}` : ""}`) : Promise.resolve({ json: async () => [] }),
      businessId ? apiFetch(`/api/templates/${businessId}`) : Promise.resolve({ json: async () => [] }),
      businessId ? apiFetch(`/api/reminders/${businessId}`) : Promise.resolve({ json: async () => [] }),
      businessId ? apiFetch(`/api/calendar/${businessId}`) : Promise.resolve({ json: async () => null })
    ]);

    const businessData = await businessRes.json();
    setBusinesses(businessData);
    if (!selectedId && businessData[0]) setSelectedId(businessData[0].id);
    setConversations(await conversationsRes.json());
    setAppointments(await appointmentsRes.json());
    setStaff(await staffRes.json());
    setBlocks(await blocksRes.json());
    setCustomers(await customersRes.json());
    setDashboard(await dashboardRes.json());
    setInbox(await inboxRes.json());
    setTemplates(await templatesRes.json());
    setReminders(await remindersRes.json());
    setCalendar(await calendarRes.json());
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  useEffect(() => {
    if (token && selected?.id) loadData(selected.id);
  }, [selected?.id, leadFilter]);

  useEffect(() => {
    if (selectedLeadId && !inbox.some((customer) => customer.id === selectedLeadId)) {
      setSelectedLeadId("");
      setLeadNotes("");
    }
  }, [inbox, selectedLeadId]);

  useEffect(() => {
    if (!selected) return;
    setSettingsForm({
      name: selected.name || "",
      phone: selected.phone || "",
      address: selected.address || "",
      hours: selected.hours || "",
      tone: selected.tone || "",
      whatsappSender: selected.whatsappSender || "",
      whatsappProvider: selected.whatsappProvider || "none",
      metaPhoneNumberId: selected.metaPhoneNumberId || "",
      metaAccessToken: selected.metaAccessToken || "",
      metaVerifyToken: selected.metaVerifyToken || "",
      metaBusinessAccountId: selected.metaBusinessAccountId || "",
      dialog360ApiKey: selected.dialog360ApiKey || "",
      dialog360ChannelId: selected.dialog360ChannelId || "",
      bookingWindowDays: selected.bookingWindowDays || 60,
      cancellationMinHours: selected.cancellationMinHours || 2,
      defaultBufferMinutes: selected.defaultBufferMinutes || 10,
      holdMinutes: selected.holdMinutes || 10
    });
    setScheduleForm({ ...defaultSchedule(), ...parseSchedule(selected.weeklySchedule) });
  }, [selected?.id]);

  async function sendMessage(event) {
    event.preventDefault();
    if (!message.trim() || !selected) return;

    await fetch(`${API_URL}/api/conversations/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: selected.id, from: sender, text: message })
    });
    setMessage("");
    await loadData(selected.id);
  }

  async function createBlock(event) {
    event.preventDefault();
    if (!selected || !blockForm.startsAt || !blockForm.endsAt) return;

    const response = await apiFetch(`/api/businesses/${selected.id}/blocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        staffId: blockForm.staffId || undefined,
        startsAt: toApiDate(blockForm.startsAt),
        endsAt: toApiDate(blockForm.endsAt),
        reason: blockForm.reason,
        type: "manual_block"
      })
    });

    setNotice(response.ok ? "Bloqueo creado." : "No se pudo crear el bloqueo.");
    if (response.ok) {
      setBlockForm({ staffId: "", startsAt: "", endsAt: "", reason: "Bloqueo manual" });
      await loadData(selected.id);
    }
  }

  async function deleteBlock(id) {
    const response = await apiFetch(`/api/businesses/${selected.id}/blocks/${id}`, {
      method: "DELETE"
    });
    setNotice(response.ok ? "Bloqueo eliminado." : "No se pudo eliminar el bloqueo.");
    await loadData(selected.id);
  }

  async function cancelAppointment(id) {
    const response = await apiFetch(`/api/appointments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" })
    });
    const body = await response.json();
    setNotice(response.ok ? "Cita cancelada." : body.message || "No se pudo cancelar.");
    await loadData(selected.id);
  }

  async function rescheduleAppointment(event) {
    event.preventDefault();
    if (!rescheduleForm.appointmentId || !rescheduleForm.startsAt) return;

    const response = await apiFetch(`/api/appointments/${rescheduleForm.appointmentId}/reschedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startsAt: toApiDate(rescheduleForm.startsAt) })
    });
    const body = await response.json();
    setNotice(response.ok ? "Cita reagendada." : body.message || "No se pudo reagendar.");
    if (response.ok) setRescheduleForm({ appointmentId: "", startsAt: "" });
    await loadData(selected.id);
  }

  async function saveSettings(event) {
    event.preventDefault();
    const response = await apiFetch(`/api/businesses/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settingsForm, weeklySchedule: JSON.stringify(scheduleForm) })
    });
    const body = await response.json();
    setNotice(response.ok ? "Configuración guardada." : body.error || "No se pudo guardar.");
    await loadData(selected.id);
  }

  function updateScheduleDay(day, field, value) {
    setScheduleForm((current) => {
      const currentWindow = current[day]?.[0] || { start: "10:00", end: "20:00" };
      return { ...current, [day]: [{ ...currentWindow, [field]: value }] };
    });
  }

  function toggleClosed(day, closed) {
    setScheduleForm((current) => ({
      ...current,
      [day]: closed ? [] : [{ start: "10:00", end: "20:00" }]
    }));
  }

  function editService(service) {
    setServiceForm({
      id: service.id,
      name: service.name,
      durationMinutes: service.durationMinutes,
      price: service.price,
      bufferMinutes: service.bufferMinutes ?? selected.defaultBufferMinutes ?? 10,
      active: service.active
    });
  }

  async function saveService(event) {
    event.preventDefault();
    if (!serviceForm.name.trim()) return;
    const payload = {
      name: serviceForm.name,
      durationMinutes: Number(serviceForm.durationMinutes),
      price: Number(serviceForm.price),
      bufferMinutes: Number(serviceForm.bufferMinutes),
      active: Boolean(serviceForm.active)
    };
    const path = serviceForm.id
      ? `/api/businesses/${selected.id}/services/${serviceForm.id}`
      : `/api/businesses/${selected.id}/services`;
    const response = await apiFetch(path, {
      method: serviceForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json();
    setNotice(response.ok ? "Servicio guardado." : body.error || "No se pudo guardar el servicio.");
    if (response.ok) {
      setServiceForm({ id: "", name: "", durationMinutes: 45, price: 0, bufferMinutes: 10, active: true });
      await loadData(selected.id);
    }
  }

  async function toggleService(service) {
    const response = await apiFetch(`/api/businesses/${selected.id}/services/${service.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !service.active })
    });
    setNotice(response.ok ? "Servicio actualizado." : "No se pudo actualizar el servicio.");
    await loadData(selected.id);
  }

  function editFaq(faq) {
    setFaqForm({ id: faq.id, question: faq.question, answer: faq.answer, active: faq.active });
  }

  async function saveFaq(event) {
    event.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;
    const path = faqForm.id
      ? `/api/businesses/${selected.id}/faqs/${faqForm.id}`
      : `/api/businesses/${selected.id}/faqs`;
    const response = await apiFetch(path, {
      method: faqForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: faqForm.question,
        answer: faqForm.answer,
        active: faqForm.active
      })
    });
    const body = await response.json();
    setNotice(response.ok ? "FAQ guardada." : body.error || "No se pudo guardar la FAQ.");
    if (response.ok) {
      setFaqForm({ id: "", question: "", answer: "", active: true });
      await loadData(selected.id);
    }
  }

  async function toggleFaq(faq) {
    const response = await apiFetch(`/api/businesses/${selected.id}/faqs/${faq.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !faq.active })
    });
    setNotice(response.ok ? "FAQ actualizada." : "No se pudo actualizar la FAQ.");
    await loadData(selected.id);
  }

  function editCustomer(customer) {
    setCustomerForm({
      id: customer.id,
      name: customer.name,
      email: customer.email || "",
      notes: customer.notes || "",
      leadStatus: customer.leadStatus || "nuevo"
    });
  }

  async function saveCustomer(event) {
    event.preventDefault();
    if (!customerForm.id) return;
    const response = await apiFetch(`/api/businesses/${selected.id}/customers/${customerForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: customerForm.name,
        email: customerForm.email,
        notes: customerForm.notes,
        leadStatus: customerForm.leadStatus
      })
    });
    const body = await response.json();
    setNotice(response.ok ? "Cliente guardado." : body.error || "No se pudo guardar el cliente.");
    if (response.ok) {
      setCustomerForm({ id: "", name: "", email: "", notes: "", leadStatus: "nuevo" });
      await loadData(selected.id);
    }
  }

  async function toggleCustomerBot(customer) {
    const response = await apiFetch(`/api/inbox/${selected.id}/customers/${customer.id}/bot`, {
      method: "PATCH"
    });
    setNotice(response.ok ? "Estado del bot actualizado." : "No se pudo actualizar el bot.");
    await loadData(selected.id);
  }

  async function updateLead(customer, updates, successMessage = "Lead actualizado.") {
    const response = await apiFetch(`/api/inbox/${selected.id}/customers/${customer.id}/lead`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    const body = await response.json();
    setNotice(response.ok ? successMessage : body.error || "No se pudo actualizar el lead.");
    await loadData(selected.id);
  }

  function selectLead(customer) {
    setSelectedLeadId(customer.id);
    setLeadNotes(customer.notes || "");
  }

  async function copyText(value, label = "Texto") {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(`${label} copiado.`);
    } catch {
      setNotice("No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.");
    }
  }

  async function sendManualReply(event) {
    event.preventDefault();
    if (!manualReply.customerId || !manualReply.text.trim()) return;
    const response = await apiFetch(`/api/inbox/${selected.id}/customers/${manualReply.customerId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: manualReply.text })
    });
    setNotice(response.ok ? "Respuesta manual guardada." : "No se pudo guardar la respuesta.");
    if (response.ok) setManualReply({ customerId: "", text: "" });
    await loadData(selected.id);
  }

  function editTemplate(template) {
    setTemplateForm({
      id: template.id,
      key: template.key,
      name: template.name,
      body: template.body,
      active: template.active
    });
  }

  async function saveTemplate(event) {
    event.preventDefault();
    const path = templateForm.id
      ? `/api/templates/${selected.id}/${templateForm.id}`
      : `/api/templates/${selected.id}`;
    const response = await apiFetch(path, {
      method: templateForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: templateForm.key,
        name: templateForm.name,
        body: templateForm.body,
        active: templateForm.active
      })
    });
    const body = await response.json();
    setNotice(response.ok ? "Plantilla guardada." : body.error || "No se pudo guardar plantilla.");
    if (response.ok) {
      setTemplateForm({ id: "", key: "", name: "", body: "", active: true });
      await loadData(selected.id);
    }
  }

  async function runReminders() {
    const response = await apiFetch("/api/reminders/run", { method: "POST" });
    const body = await response.json();
    setNotice(response.ok ? `Recordatorios: creados ${body.created}, procesados ${body.processed}.` : body.error || "No se pudo correr recordatorios.");
    await loadData(selected.id);
  }

  async function createStaff(event) {
    event.preventDefault();
    if (!staffForm.name.trim()) return;
    const path = staffForm.id
      ? `/api/businesses/${selected.id}/staff/${staffForm.id}`
      : `/api/businesses/${selected.id}/staff`;
    const response = await apiFetch(path, {
      method: staffForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffForm)
    });
    const body = await response.json();
    setNotice(response.ok ? "Personal guardado." : body.error || "No se pudo guardar personal.");
    if (response.ok) setStaffForm({ id: "", name: "", serviceIds: [] });
    await loadData(selected.id);
  }

  function editStaff(person) {
    setStaffForm({
      id: person.id,
      name: person.name,
      serviceIds: person.staffServices?.map((item) => item.service.id) || []
    });
  }

  const visibleAppointments = appointments.filter((appointment) =>
    ["confirmed", "hold"].includes(appointment.status)
  );
  const selectedLead = inbox.find((customer) => customer.id === selectedLeadId) || inbox[0];
  const widgetScript = `<script src="${API_URL}/public/widget.js" data-api-url="${API_URL}" data-business-id="${selected?.id || ""}"></script>`;
  const publicLinks = [
    ["Landing general", `${FRONTEND_URL}/`],
    ["Soluciones por proyecto", `${FRONTEND_URL}/proyectos`],
    ["Demo barbería", DEMO_BARBERIA_URL],
    ["Demo dental", DEMO_DENTAL_URL],
    ["Panel admin", `${FRONTEND_URL}/admin`]
  ];
  useEffect(() => {
    if (selectedLead) setLeadNotes(selectedLead.notes || "");
  }, [selectedLead?.id, selectedLead?.notes]);
  const weekDays = calendar?.weekStart
    ? Array.from({ length: 7 }, (_, index) => {
        const date = new Date(calendar.weekStart);
        date.setDate(date.getDate() + index);
        return date;
      })
    : [];
  const workHours = Array.from({ length: 12 }, (_, index) => 8 + index);

  function sameDay(a, b) {
    return new Date(a).toDateString() === new Date(b).toDateString();
  }

  function itemsForDay(day) {
    const appts = calendar?.appointments?.filter((item) => sameDay(item.startsAt, day)).map((item) => ({
      id: `apt-${item.id}`,
      type: item.status,
      startsAt: item.startsAt,
      title: item.serviceName,
      subtitle: `${item.customerName}${item.staff?.name ? ` · ${item.staff.name}` : ""}`
    })) || [];
    const dayBlocks = calendar?.blocks?.filter((item) => sameDay(item.startsAt, day)).map((item) => ({
      id: `block-${item.id}`,
      type: "block",
      startsAt: item.startsAt,
      title: item.reason || "Bloqueo",
      subtitle: item.staff?.name || "Todo el negocio"
    })) || [];
    return [...appts, ...dayBlocks].sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  }

  function itemsForDayHour(day, hour) {
    return itemsForDay(day).filter((item) => new Date(item.startsAt).getHours() === hour);
  }

  if (!token) {
    return (
      <main className="login-shell">
        <form className="login-panel" onSubmit={login}>
          <div className="brand dark"><Bot size={24} /> AutoChat</div>
          <h1>Iniciar sesión</h1>
          <input
            value={loginForm.email}
            onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
            aria-label="Correo"
          />
          <input
            type="password"
            value={loginForm.password}
            onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
            aria-label="Contraseña"
          />
          <button type="submit">Entrar</button>
          <p>Demo: admin@autochat.test / 123456</p>
          <a className="public-login-link" href="/">Volver a la landing</a>
          {notice && <span>{notice}</span>}
        </form>
      </main>
    );
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><Bot size={24} /> AutoChat</div>
        <button className="logout" type="button" onClick={logout}><LogOut size={18} /> Salir</button>
        <div className="view-switch" aria-label="Secciones">
          <button
            className={view === "dashboard" ? "active" : ""}
            type="button"
            onClick={() => setView("dashboard")}
          >
            <CalendarDays size={18} />
            <span>Dashboard</span>
          </button>
          <button
            className={view === "settings" ? "active" : ""}
            type="button"
            onClick={() => setView("settings")}
          >
            <Settings size={18} />
            <span>Configuración</span>
          </button>
        </div>
        <p className="sidebar-label">Negocios</p>
        <nav>
          {businesses.map((business) => (
            <button
              className={business.id === selected?.id ? "active" : ""}
              key={business.id}
              onClick={() => setSelectedId(business.id)}
            >
              {business.niche === "clinica_dental" ? <Stethoscope size={18} /> : <Scissors size={18} />}
              <span>{business.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p>{selected?.niche?.replace("_", " ")}</p>
            <h1>{view === "settings" ? "Configuración" : selected?.name || "AutoChat"}</h1>
          </div>
          <span>{view === "settings" ? selected?.name : "Asistente web + captura de leads"}</span>
        </header>

        {notice && <button className="notice" onClick={() => setNotice("")}>{notice}</button>}

        <section className="grid">
          {view === "dashboard" && <div className="panel metrics-panel">
            <h2>Dashboard web</h2>
            <div className="metrics">
              <article><strong>{dashboard?.newLeads ?? 0}</strong><span>Leads nuevos</span></article>
              <article><strong>{dashboard?.appointmentsToday ?? 0}</strong><span>Citas hoy</span></article>
              <article><strong>{dashboard?.upcomingAppointments ?? 0}</strong><span>Próximas citas</span></article>
              <article><strong>{dashboard?.needsHuman ?? 0}</strong><span>Requieren humano</span></article>
            </div>
            <div className="top-services">
              {dashboard?.topServices?.map((service) => (
                <span key={service.name}>{service.name}: {service.count}</span>
              ))}
            </div>
          </div>}

          {view === "dashboard" && <div className="panel widget-panel">
            <h2><MessageSquareText size={20} /> Widget web</h2>
            <p className="panel-copy">Canal principal sin Twilio, Meta ni 360dialog. Inserta este código en la página del cliente para capturar leads y atender solicitudes.</p>
            <div className="link-list">
              {publicLinks.map(([label, url]) => (
                <label key={label}>
                  <span>{label}</span>
                  <div className="copy-row">
                    <input readOnly value={url} aria-label={label} />
                    <button type="button" onClick={() => copyText(url, label)} aria-label={`Copiar ${label}`}>
                      <Copy size={16} />
                    </button>
                  </div>
                </label>
              ))}
            </div>
            <label className="script-box">
              <span>Script para instalar en página del cliente</span>
              <textarea readOnly value={widgetScript} aria-label="Código widget" />
              <button type="button" onClick={() => copyText(widgetScript, "Script del widget")}><Copy size={16} /> Copiar script</button>
            </label>
          </div>}

          {view === "dashboard" && <div className="panel calendar-panel">
            <h2><CalendarDays size={20} /> Calendario semanal</h2>
            <div className="calendar-legend">
              <span className="legend confirmed">Confirmada</span>
              <span className="legend hold">Apartada</span>
              <span className="legend block">Bloqueo</span>
            </div>
            <div className="week-calendar">
              <div className="calendar-hour-head" />
              {weekDays.map((day) => (
                <div className="calendar-day-head" key={day.toISOString()}>
                  <strong>{day.toLocaleDateString("es-MX", { weekday: "short" })}</strong>
                  <span>{day.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}</span>
                </div>
              ))}
              {workHours.map((hour) => (
                <React.Fragment key={hour}>
                  <div className="calendar-hour">{String(hour).padStart(2, "0")}:00</div>
                  {weekDays.map((day) => (
                    <div className="calendar-cell" key={`${day.toISOString()}-${hour}`}>
                      {itemsForDayHour(day, hour).map((item) => (
                        <article className={`calendar-item ${item.type}`} key={item.id}>
                          <strong>{new Date(item.startsAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</strong>
                          <span>{item.title}</span>
                          <small>{item.subtitle}</small>
                        </article>
                      ))}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>}

          {view === "settings" && <div className="panel business-panel">
            <h2>Configuración inicial</h2>
            <form className="settings-form" onSubmit={saveSettings}>
              <label>
                <span>Nombre del negocio</span>
                <input value={settingsForm.name || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label>
                <span>Teléfono</span>
                <input value={settingsForm.phone || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, phone: event.target.value }))} />
              </label>
              <label>
                <span>Direccion</span>
                <input value={settingsForm.address || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, address: event.target.value }))} />
              </label>
              <label>
                <span>Horario visible</span>
                <input value={settingsForm.hours || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, hours: event.target.value }))} />
              </label>
              <label>
                <span>WhatsApp oficial opcional</span>
                <select value={settingsForm.whatsappProvider || "none"} onChange={(event) => setSettingsForm((current) => ({ ...current, whatsappProvider: event.target.value }))}>
                  <option value="none">No usar WhatsApp API</option>
                  <option value="twilio">Twilio</option>
                  <option value="meta">Meta Cloud API</option>
                  <option value="360dialog">360dialog</option>
                </select>
              </label>
              {settingsForm.whatsappProvider !== "none" && (
                <label>
                  <span>Numero WhatsApp</span>
                  <input value={settingsForm.whatsappSender || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, whatsappSender: event.target.value }))} placeholder={settingsForm.whatsappProvider === "meta" ? "+525550000000" : "whatsapp:+14155238886"} />
                </label>
              )}
              {settingsForm.whatsappProvider === "meta" && (
                <>
                  <label>
                    <span>Meta phone number ID</span>
                    <input value={settingsForm.metaPhoneNumberId || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, metaPhoneNumberId: event.target.value }))} />
                  </label>
                  <label>
                    <span>Meta business account ID</span>
                    <input value={settingsForm.metaBusinessAccountId || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, metaBusinessAccountId: event.target.value }))} />
                  </label>
                  <label>
                    <span>Meta verify token</span>
                    <input value={settingsForm.metaVerifyToken || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, metaVerifyToken: event.target.value }))} placeholder="usa el mismo que en .env si prefieres global" />
                  </label>
                  <label>
                    <span>Meta access token</span>
                    <input type="password" value={settingsForm.metaAccessToken || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, metaAccessToken: event.target.value }))} />
                  </label>
                  <label className="full-row">
                    <span>Webhook Meta</span>
                    <input readOnly value={`${API_URL}/webhooks/meta/whatsapp`} />
                  </label>
                </>
              )}
              {settingsForm.whatsappProvider === "twilio" && (
                <label className="full-row">
                  <span>Webhook Twilio</span>
                  <input readOnly value={`${API_URL}/webhooks/twilio/whatsapp`} />
                </label>
              )}
              {settingsForm.whatsappProvider === "360dialog" && (
                <>
                  <label>
                    <span>360dialog API key</span>
                    <input type="password" value={settingsForm.dialog360ApiKey || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, dialog360ApiKey: event.target.value }))} />
                  </label>
                  <label>
                    <span>360dialog channel ID</span>
                    <input value={settingsForm.dialog360ChannelId || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, dialog360ChannelId: event.target.value }))} placeholder="phone_number_id opcional" />
                  </label>
                  <label className="full-row">
                    <span>Webhook 360dialog</span>
                    <input readOnly value={`${API_URL}/webhooks/360dialog/whatsapp`} />
                  </label>
                </>
              )}
              <label>
                <span>Ventana de agenda</span>
                <div className="unit-input">
                  <input type="number" min="1" value={settingsForm.bookingWindowDays || 60} onChange={(event) => setSettingsForm((current) => ({ ...current, bookingWindowDays: Number(event.target.value) }))} />
                  <small>días</small>
                </div>
              </label>
              <label>
                <span>Anticipacion para cancelar/reagendar</span>
                <div className="unit-input">
                  <input type="number" min="0" value={settingsForm.cancellationMinHours || 2} onChange={(event) => setSettingsForm((current) => ({ ...current, cancellationMinHours: Number(event.target.value) }))} />
                  <small>horas</small>
                </div>
              </label>
              <label>
                <span>Buffer entre citas</span>
                <div className="unit-input">
                  <input type="number" min="0" value={settingsForm.defaultBufferMinutes || 10} onChange={(event) => setSettingsForm((current) => ({ ...current, defaultBufferMinutes: Number(event.target.value) }))} />
                  <small>min</small>
                </div>
              </label>
              <label>
                <span>Apartado temporal</span>
                <div className="unit-input">
                  <input type="number" min="1" value={settingsForm.holdMinutes || 10} onChange={(event) => setSettingsForm((current) => ({ ...current, holdMinutes: Number(event.target.value) }))} />
                  <small>min</small>
                </div>
              </label>
              <button type="submit"><Save size={18} /> Guardar</button>
            </form>

            <h3>Servicios</h3>
            <form className="service-form" onSubmit={saveService}>
              <label>
                <span>Servicio</span>
                <input
                  value={serviceForm.name}
                  onChange={(event) => setServiceForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Corte, limpieza, valoración"
                />
              </label>
              <label>
                <span>Duracion</span>
                <div className="unit-input">
                  <input
                    type="number"
                    min="1"
                    value={serviceForm.durationMinutes}
                    onChange={(event) => setServiceForm((current) => ({ ...current, durationMinutes: Number(event.target.value) }))}
                  />
                  <small>min</small>
                </div>
              </label>
              <label>
                <span>Precio</span>
                <div className="unit-input">
                  <input
                    type="number"
                    min="0"
                    value={serviceForm.price}
                    onChange={(event) => setServiceForm((current) => ({ ...current, price: Number(event.target.value) }))}
                  />
                  <small>$</small>
                </div>
              </label>
              <label>
                <span>Buffer</span>
                <div className="unit-input">
                  <input
                    type="number"
                    min="0"
                    value={serviceForm.bufferMinutes}
                    onChange={(event) => setServiceForm((current) => ({ ...current, bufferMinutes: Number(event.target.value) }))}
                  />
                  <small>min</small>
                </div>
              </label>
              <label className="inline-check">
                <input
                  type="checkbox"
                  checked={serviceForm.active}
                  onChange={(event) => setServiceForm((current) => ({ ...current, active: event.target.checked }))}
                />
                Activo
              </label>
              <button type="submit">{serviceForm.id ? <Save size={18} /> : <Plus size={18} />} {serviceForm.id ? "Guardar servicio" : "Crear servicio"}</button>
            </form>
            <div className="services">
              {selected?.services?.map((service) => (
                <article key={service.id}>
                  <strong>{service.name}</strong>
                  <span>{service.durationMinutes} min, ${service.price}, buffer {service.bufferMinutes ?? selected.defaultBufferMinutes} min</span>
                  <div className="mini-actions">
                    <button type="button" onClick={() => editService(service)}>Editar</button>
                    <button type="button" onClick={() => toggleService(service)}>{service.active ? "Desactivar" : "Activar"}</button>
                  </div>
                </article>
              ))}
            </div>

            <h3>Horarios laborales</h3>
            <div className="schedule-editor">
              {DAYS.map(([day, label]) => {
                const isClosed = !scheduleForm[day]?.length;
                const window = scheduleForm[day]?.[0] || { start: "10:00", end: "20:00" };
                return (
                  <article key={day}>
                    <strong>{label}</strong>
                    <label className="inline-check">
                      <input type="checkbox" checked={isClosed} onChange={(event) => toggleClosed(day, event.target.checked)} />
                      Cerrado
                    </label>
                    <input type="time" value={window.start} disabled={isClosed} onChange={(event) => updateScheduleDay(day, "start", event.target.value)} aria-label={`${label} abre`} />
                    <input type="time" value={window.end} disabled={isClosed} onChange={(event) => updateScheduleDay(day, "end", event.target.value)} aria-label={`${label} cierra`} />
                  </article>
                );
              })}
            </div>

            <h3><UserRound size={16} /> Personal</h3>
            <form className="staff-form" onSubmit={createStaff}>
              <label>
                <span>Nombre del empleado</span>
                <input
                  value={staffForm.name}
                  onChange={(event) => setStaffForm((current) => ({ ...current, name: event.target.value }))}
                />
              </label>
              <label>
                <span>Servicios que puede realizar</span>
              <select
                multiple
                value={staffForm.serviceIds}
                onChange={(event) => setStaffForm((current) => ({
                  ...current,
                  serviceIds: [...event.target.selectedOptions].map((option) => option.value)
                }))}
                aria-label="Servicios"
              >
                {selected?.services?.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
              </select>
              </label>
              <button type="submit"><UserRound size={18} /> {staffForm.id ? "Guardar empleado" : "Agregar empleado"}</button>
            </form>
            <div className="services">
              {staff.map((person) => (
                <article key={person.id}>
                  <strong>{person.name}</strong>
                  <span>{person.staffServices?.map((item) => item.service.name).join(", ") || "Disponible"}</span>
                  <div className="mini-actions">
                    <button type="button" onClick={() => editStaff(person)}>Editar</button>
                  </div>
                </article>
              ))}
            </div>
          </div>}

          {view === "dashboard" && <div className="panel inbox-panel">
            <h2><Inbox size={20} /> Bandeja de leads</h2>
            <div className="lead-filters">
              {LEAD_STATUSES.map(([value, label]) => (
                <button
                  className={leadFilter === value ? "active" : ""}
                  key={value}
                  type="button"
                  onClick={() => setLeadFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="inbox-list">
              {inbox.map((customer) => (
                <article key={customer.id} className={`${customer.needsHuman ? "needs-human" : ""} ${selectedLead?.id === customer.id ? "selected" : ""}`}>
                  <div>
                    <strong>{customer.name}</strong>
                    <span>{customer.phone}{customer.email ? `, ${customer.email}` : ""}</span>
                    <span className={`lead-badge ${customer.leadStatus || "nuevo"}`}>{LEAD_STATUSES.find(([value]) => value === (customer.leadStatus || "nuevo"))?.[1] || "Nuevo"}</span>
                    <small>{customer.conversations?.[0]?.inboundText || customer.conversations?.[0]?.outboundText || "Sin mensajes"}</small>
                  </div>
                  <div className="mini-actions">
                    <button type="button" onClick={() => selectLead(customer)}>Ver</button>
                    <button type="button" onClick={() => updateLead(customer, { leadStatus: "contactado", needsHuman: false }, "Lead marcado como contactado.")}>Marcar contactado</button>
                    <button type="button" onClick={() => toggleCustomerBot(customer)}>{customer.botPaused ? "Activar bot" : "Pausar bot"}</button>
                    <button type="button" onClick={() => setManualReply({ customerId: customer.id, text: "" })}>Responder</button>
                  </div>
                </article>
              ))}
            </div>
            {selectedLead && (
              <div className="lead-detail">
                <div className="lead-detail-head">
                  <div>
                    <strong>{selectedLead.name}</strong>
                    <span>{selectedLead.phone}{selectedLead.email ? `, ${selectedLead.email}` : ""}</span>
                  </div>
                  <select
                    value={selectedLead.leadStatus || "nuevo"}
                    onChange={(event) => updateLead(selectedLead, { leadStatus: event.target.value }, "Estado del lead actualizado.")}
                    aria-label="Estado del lead"
                  >
                    {LEAD_STATUSES.filter(([value]) => value !== "all").map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <form className="lead-notes-form" onSubmit={(event) => {
                  event.preventDefault();
                  updateLead(selectedLead, { notes: leadNotes }, "Notas guardadas.");
                }}>
                  <textarea value={leadNotes} onChange={(event) => setLeadNotes(event.target.value)} placeholder="Notas internas del lead" />
                  <button type="submit"><Save size={18} /> Guardar notas</button>
                </form>
                <div className="conversation-thread">
                  {[...(selectedLead.conversations || [])].reverse().map((item) => (
                    <article key={item.id}>
                      {item.inboundText && <p className="thread-in"><span>Cliente</span>{item.inboundText}</p>}
                      {item.outboundText && <p className="thread-out"><span>{item.handledBy === "human" ? "Humano" : "Bot"}</span>{item.outboundText}</p>}
                    </article>
                  ))}
                </div>
              </div>
            )}
            {manualReply.customerId && (
              <form className="manual-reply-form" onSubmit={sendManualReply}>
                <textarea value={manualReply.text} onChange={(event) => setManualReply((current) => ({ ...current, text: event.target.value }))} />
                <button type="submit"><Send size={18} /> Guardar respuesta</button>
              </form>
            )}
          </div>}

          {view === "dashboard" && <div className="panel chat-panel">
            <h2><MessageSquareText size={20} /> Prueba del bot</h2>
            <div className="messages">
              {conversations.map((item) => (
                <article key={item.id}>
                  <span>{item.from}</span>
                  <p>{item.inboundText}</p>
                  <strong>{item.outboundText}</strong>
                </article>
              ))}
            </div>
            <form className="chat-form" onSubmit={sendMessage}>
              <input value={sender} onChange={(event) => setSender(event.target.value)} aria-label="Cliente" />
              <input value={message} onChange={(event) => setMessage(event.target.value)} aria-label="Mensaje" />
              <button type="submit" aria-label="Enviar"><Send size={18} /></button>
            </form>
            <div className="quick-actions">
              <button type="button" onClick={() => setMessage("cancelar mi cita")}>Cancelar cita</button>
              <button type="button" onClick={() => setMessage("reagendar mi cita")}>Reagendar cita</button>
            </div>
          </div>}

          {view === "settings" && <div className="panel templates-panel">
            <h2>Plantillas</h2>
            <form className="template-form" onSubmit={saveTemplate}>
              <input value={templateForm.key} onChange={(event) => setTemplateForm((current) => ({ ...current, key: event.target.value }))} placeholder="clave" />
              <input value={templateForm.name} onChange={(event) => setTemplateForm((current) => ({ ...current, name: event.target.value }))} placeholder="nombre" />
              <textarea value={templateForm.body} onChange={(event) => setTemplateForm((current) => ({ ...current, body: event.target.value }))} placeholder="mensaje con {{variables}}" />
              <label className="inline-check">
                <input type="checkbox" checked={templateForm.active} onChange={(event) => setTemplateForm((current) => ({ ...current, active: event.target.checked }))} />
                Activa
              </label>
              <button type="submit"><Save size={18} /> Guardar plantilla</button>
            </form>
            <div className="list">
              {templates.map((template) => (
                <article key={template.id}>
                  <div>
                    <strong>{template.name}</strong>
                    <span>{template.body}</span>
                  </div>
                  <button type="button" onClick={() => editTemplate(template)}>Editar</button>
                </article>
              ))}
            </div>
          </div>}

          {view === "dashboard" && <div className="panel reminders-panel">
            <h2>Recordatorios</h2>
            <button className="run-button" type="button" onClick={runReminders}>Correr ahora</button>
            <div className="list">
              {reminders.length === 0 ? <p className="empty">Sin recordatorios.</p> : reminders.map((reminder) => (
                <article key={reminder.id}>
                  <div>
                    <strong>{reminder.type}</strong>
                    <span>{reminder.customer?.name} - {formatDate(reminder.scheduledAt)}</span>
                    <small>{reminder.status}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>}

          {view === "settings" && <div className="panel blocks-panel">
            <h2><Ban size={20} /> Bloqueos manuales</h2>
            <form className="stack-form" onSubmit={createBlock}>
              <select
                value={blockForm.staffId}
                onChange={(event) => setBlockForm((current) => ({ ...current, staffId: event.target.value }))}
                aria-label="Personal"
              >
                <option value="">Todo el negocio</option>
                {staff.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
              </select>
              <input
                type="datetime-local"
                value={blockForm.startsAt}
                onChange={(event) => setBlockForm((current) => ({ ...current, startsAt: event.target.value }))}
                aria-label="Inicio"
              />
              <input
                type="datetime-local"
                value={blockForm.endsAt}
                onChange={(event) => setBlockForm((current) => ({ ...current, endsAt: event.target.value }))}
                aria-label="Fin"
              />
              <input
                value={blockForm.reason}
                onChange={(event) => setBlockForm((current) => ({ ...current, reason: event.target.value }))}
                aria-label="Motivo"
              />
              <button type="submit"><CalendarX size={18} /> Bloquear</button>
            </form>

            <div className="list">
              {blocks.length === 0 ? <p className="empty">Sin bloqueos.</p> : blocks.map((block) => (
                <article key={block.id}>
                  <div>
                    <strong>{block.reason || "Bloqueo"}</strong>
                    <span>{formatDate(block.startsAt)} a {formatDate(block.endsAt)}</span>
                  </div>
                  <button type="button" onClick={() => deleteBlock(block.id)} aria-label="Eliminar bloqueo">
                    <XCircle size={18} />
                  </button>
                </article>
              ))}
            </div>
          </div>}

          {view === "settings" && <div className="panel knowledge-panel">
            <h2><HelpCircle size={20} /> Base de conocimiento</h2>
            <form className="faq-form" onSubmit={saveFaq}>
              <label>
                <span>Pregunta clave</span>
                <input
                  value={faqForm.question}
                  onChange={(event) => setFaqForm((current) => ({ ...current, question: event.target.value }))}
                />
              </label>
              <label>
                <span>Respuesta del bot</span>
                <textarea
                  value={faqForm.answer}
                  onChange={(event) => setFaqForm((current) => ({ ...current, answer: event.target.value }))}
                />
              </label>
              <label className="inline-check">
                <input
                  type="checkbox"
                  checked={faqForm.active}
                  onChange={(event) => setFaqForm((current) => ({ ...current, active: event.target.checked }))}
                />
                Activa
              </label>
              <button type="submit"><Save size={18} /> {faqForm.id ? "Guardar FAQ" : "Crear FAQ"}</button>
            </form>

            <div className="list">
              {selected?.faqs?.map((faq) => (
                <article key={faq.id}>
                  <div>
                    <strong>{faq.question}</strong>
                    <span>{faq.answer}</span>
                  </div>
                  <div className="mini-actions">
                    <button type="button" onClick={() => editFaq(faq)}>Editar</button>
                    <button type="button" onClick={() => toggleFaq(faq)}>{faq.active ? "Desactivar" : "Activar"}</button>
                  </div>
                </article>
              ))}
            </div>
          </div>}

          {view === "dashboard" && <div className="panel appointments-panel">
            <h2><CalendarDays size={20} /> Citas</h2>
            {visibleAppointments.length === 0 ? (
              <p className="empty">Aún no hay citas activas.</p>
            ) : visibleAppointments.map((appointment) => (
              <article key={appointment.id}>
                <div>
                  <strong>{appointment.customerName}</strong>
                  <span>{appointment.serviceName}</span>
                  <time><Clock size={14} /> {formatDate(appointment.startsAt)}</time>
                  {appointment.status === "hold" && <small>Apartada hasta {formatDate(appointment.holdExpiresAt)}</small>}
                </div>
                <div className="row-actions">
                  <button type="button" onClick={() => cancelAppointment(appointment.id)} aria-label="Cancelar cita">
                    <XCircle size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRescheduleForm({ appointmentId: appointment.id, startsAt: toDatetimeLocal(appointment.startsAt) })}
                    aria-label="Reagendar cita"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </article>
            ))}

            <form className="reschedule-form" onSubmit={rescheduleAppointment}>
              <select
                value={rescheduleForm.appointmentId}
                onChange={(event) => setRescheduleForm((current) => ({ ...current, appointmentId: event.target.value }))}
                aria-label="Cita"
              >
                <option value="">Seleccionar cita</option>
                {visibleAppointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    {appointment.customerName} - {appointment.serviceName}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={rescheduleForm.startsAt}
                onChange={(event) => setRescheduleForm((current) => ({ ...current, startsAt: event.target.value }))}
                aria-label="Nueva fecha"
              />
              <button type="submit"><RefreshCw size={18} /> Reagendar</button>
            </form>
          </div>}

          {view === "dashboard" && <div className="panel customers-panel">
            <h2><UserRound size={20} /> Clientes</h2>
            {customerForm.id && (
              <form className="customer-form" onSubmit={saveCustomer}>
                <input value={customerForm.name} onChange={(event) => setCustomerForm((current) => ({ ...current, name: event.target.value }))} aria-label="Nombre cliente" />
                <input value={customerForm.email} onChange={(event) => setCustomerForm((current) => ({ ...current, email: event.target.value }))} aria-label="Email cliente" />
                <select value={customerForm.leadStatus} onChange={(event) => setCustomerForm((current) => ({ ...current, leadStatus: event.target.value }))} aria-label="Estado lead">
                  {LEAD_STATUSES.filter(([value]) => value !== "all").map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <textarea value={customerForm.notes} onChange={(event) => setCustomerForm((current) => ({ ...current, notes: event.target.value }))} aria-label="Notas cliente" />
                <button type="submit"><Save size={18} /> Guardar cliente</button>
              </form>
            )}
            <div className="customer-list">
              {customers.length === 0 ? <p className="empty">Aún no hay clientes.</p> : customers.map((customer) => (
                <article key={customer.id}>
                  <div>
                    <strong>{customer.name}</strong>
                    <span>{customer.phone}{customer.email ? `, ${customer.email}` : ""}</span>
                    <small>{LEAD_STATUSES.find(([value]) => value === (customer.leadStatus || "nuevo"))?.[1] || "Nuevo"}</small>
                    {customer.notes && <small>{customer.notes}</small>}
                  </div>
                  <div className="customer-history">
                    <span>{customer.appointments?.length || 0} citas recientes</span>
                    <span>{customer.conversations?.length || 0} mensajes recientes</span>
                  </div>
                  <button type="button" onClick={() => editCustomer(customer)}>Editar</button>
                </article>
              ))}
            </div>
          </div>}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
