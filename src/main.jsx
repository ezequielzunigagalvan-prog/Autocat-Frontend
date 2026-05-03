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
  BriefcaseBusiness,
  MessageSquareText,
  Scissors,
  Send,
  Settings,
  Stethoscope,
  UserRound,
  LogOut,
  Copy,
  Save,
  Plus,
  ShieldCheck,
  XCircle
} from "lucide-react";
import "./styles.css";

const DEFAULT_LOCAL_BACKEND_URL = "http://localhost:4000";
const DEFAULT_PRODUCTION_BACKEND_URL = "https://autochat-backend-production.up.railway.app";
const rawApiUrl = import.meta.env.VITE_API_URL || "";
const rawPublicAppUrl = import.meta.env.VITE_PUBLIC_APP_URL || "";
const isBrowserProduction = typeof window !== "undefined" && !window.location.hostname.includes("localhost");
function cleanConfiguredUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  const normalized = url.toLowerCase();
  if (normalized.includes("tu-backend-railway") || normalized.includes("your-backend")) return "";
  if (normalized.includes("localhost") && isBrowserProduction) return "";
  return url.replace(/\/$/, "");
}
const fallbackBackendUrl = isBrowserProduction ? DEFAULT_PRODUCTION_BACKEND_URL : DEFAULT_LOCAL_BACKEND_URL;
const API_URL = cleanConfiguredUrl(rawApiUrl) || cleanConfiguredUrl(rawPublicAppUrl) || fallbackBackendUrl;
const PUBLIC_APP_URL = cleanConfiguredUrl(rawPublicAppUrl) || API_URL;
const FRONTEND_URL = window.location.origin;
const LANDING_URL = `${FRONTEND_URL}`;
const PROJECTS_URL = `${FRONTEND_URL}/proyectos`;
const DEMO_BARBERIA_URL = `${FRONTEND_URL}/demo-barberia`;
const DEMO_DENTAL_URL = `${FRONTEND_URL}/demo-dental`;
const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || `${FRONTEND_URL}/admin`;
const LEAD_STATUSES = [
  ["all", "Todos"],
  ["nuevo", "Nuevos"],
  ["contactado", "Contactados"],
  ["cita_agendada", "Cita agendada"],
  ["ganado", "Ganados"],
  ["perdido", "Perdidos"]
];
const CONTACT_FIELD_OPTIONS = [
  ["name", "Nombre"],
  ["phone", "Teléfono / WhatsApp"],
  ["email", "Correo"],
  ["company", "Empresa"],
  ["position", "Puesto / cargo"],
  ["address", "Dirección / ubicación"],
  ["city", "Ciudad / zona"],
  ["equipment", "Equipo / sistema"],
  ["details", "Detalles adicionales"],
  ["urgency", "Urgencia"],
  ["preferredTime", "Horario preferido"]
];
const DEFAULT_CONTACT_FIELDS = ["name", "phone"];
const WIDGET_STYLE_OPTIONS = [
  ["premium", "Premium"],
  ["industrial", "Industrial"],
  ["minimal", "Minimalista"],
  ["salud", "Salud"],
  ["elegante", "Elegante"]
];
const WIDGET_POSITION_OPTIONS = [
  ["right", "Derecha"],
  ["left", "Izquierda"]
];
const DEFAULT_WIDGET_REPLIES = [
  { label: "Ver servicios", value: "servicios" },
  { label: "Solicitar cotización", value: "cotización" },
  { label: "Atención", value: "atención" }
];
const SEGMENT_OPTIONS = [
  ["industrial", "Industrial / cotizaciones"],
  ["servicios", "Servicios generales"],
  ["salud", "Salud / consultorios"],
  ["inmobiliaria", "Inmobiliaria"],
  ["educacion", "Educación / cursos"],
  ["estetica", "Citas / agenda"]
];
const AUTOMATION_TYPE_OPTIONS = [
  ["appointment", "Agenda / citas"],
  ["quote", "Cotizaciones"],
  ["lead", "Captura de leads"],
  ["hybrid", "Mixto"]
];
const QUOTE_SEGMENTS = ["industrial", "servicios", "proyectos", "inmobiliaria", "educacion"];
const CLIENT_TEMPLATES = {
  industrial: {
    label: "Industrial / cotizaciones",
    niche: "industrial",
    automationType: "quote",
    hours: "Lunes a viernes de 8:00 a 18:00",
    tone: "técnico, claro y profesional",
    widgetInitialMessage: "Hola. Puedo ayudarte con servicios de filtración, lubricación industrial y solicitudes de cotización. Cuéntame qué servicio necesitas y en qué planta o ciudad se requiere.",
    widgetPrompt: "Necesito cotizar filtración de aceite hidráulico",
    services: [
      { name: "Filtración de aceite hidráulico", durationMinutes: 60, price: 0, bufferMinutes: 10 },
      { name: "Filtración de aceite dieléctrico", durationMinutes: 60, price: 0, bufferMinutes: 10 },
      { name: "Lubricación industrial", durationMinutes: 60, price: 0, bufferMinutes: 10 },
      { name: "Análisis de aceite", durationMinutes: 45, price: 0, bufferMinutes: 10 },
      { name: "Flushing o limpieza de sistema", durationMinutes: 60, price: 0, bufferMinutes: 10 },
      { name: "Cotización de servicio en planta", durationMinutes: 60, price: 0, bufferMinutes: 10 }
    ],
    faqs: [
      { question: "¿Qué datos necesitan para cotizar?", answer: "Empresa, ubicación, servicio requerido, tipo de equipo, capacidad aproximada en litros, condición actual del fluido y urgencia." },
      { question: "¿Pueden dar precio inmediato?", answer: "No siempre. El precio depende del equipo, volumen, ubicación, condición del aceite, accesos y alcance del servicio." },
      { question: "¿Atienden servicios en planta?", answer: "Sí. El asistente captura ubicación, contacto, datos técnicos y urgencia para preparar la cotización." },
      { question: "¿Pueden atender urgencias?", answer: "El asistente marca la solicitud como prioritaria para que el equipo la revise rápido." }
    ]
  },
  servicios: {
    label: "Servicios generales",
    niche: "servicios",
    automationType: "quote",
    hours: "Lunes a viernes de 9:00 a 18:00",
    tone: "amable, directo y comercial",
    widgetInitialMessage: "Hola. Puedo ayudarte a registrar tu solicitud y preparar una cotización. Cuéntame qué servicio necesitas.",
    widgetPrompt: "Quiero cotizar un servicio",
    services: [
      { name: "Cotización", durationMinutes: 30, price: 0, bufferMinutes: 10 },
      { name: "Visita técnica", durationMinutes: 60, price: 0, bufferMinutes: 10 },
      { name: "Diagnóstico del proyecto", durationMinutes: 45, price: 0, bufferMinutes: 10 },
      { name: "Seguimiento comercial", durationMinutes: 30, price: 0, bufferMinutes: 10 }
    ],
    faqs: [
      { question: "¿Cómo solicito una cotización?", answer: "Comparte nombre, teléfono, servicio, ubicación, alcance del proyecto y fecha tentativa." },
      { question: "¿Cuándo me contactan?", answer: "El equipo revisa la solicitud y da seguimiento con la información capturada." },
      { question: "¿El precio es fijo?", answer: "Depende del alcance. El asistente recopila datos para preparar una propuesta adecuada." }
    ]
  },
  salud: {
    label: "Salud / consultorios",
    niche: "salud",
    automationType: "lead",
    hours: "Lunes a viernes de 9:00 a 18:00",
    tone: "profesional, empático y claro",
    widgetInitialMessage: "Hola. Puedo orientarte con información general y registrar tu solicitud para seguimiento del equipo.",
    widgetPrompt: "Quiero información sobre una valoración",
    services: [
      { name: "Valoración", durationMinutes: 45, price: 0, bufferMinutes: 10 },
      { name: "Consulta", durationMinutes: 45, price: 0, bufferMinutes: 10 },
      { name: "Urgencia o caso prioritario", durationMinutes: 45, price: 0, bufferMinutes: 10 }
    ],
    faqs: [
      { question: "¿El asistente diagnostica?", answer: "No. Solo brinda información general y captura la solicitud para que el equipo dé seguimiento." },
      { question: "¿Qué datos pide?", answer: "Nombre, teléfono, motivo de consulta, horario preferido y si es urgente." },
      { question: "¿Puede priorizar urgencias?", answer: "Sí. Puede marcar casos urgentes para atención humana." }
    ]
  },
  inmobiliaria: {
    label: "Inmobiliaria",
    niche: "inmobiliaria",
    automationType: "hybrid",
    hours: "Lunes a sábado de 9:00 a 19:00",
    tone: "comercial, claro y orientado a calificar prospectos",
    widgetInitialMessage: "Hola. Puedo ayudarte a encontrar, rentar, vender o agendar una visita. Cuéntame qué estás buscando.",
    widgetPrompt: "Busco una propiedad en renta",
    services: [
      { name: "Comprar propiedad", durationMinutes: 45, price: 0, bufferMinutes: 10 },
      { name: "Rentar propiedad", durationMinutes: 45, price: 0, bufferMinutes: 10 },
      { name: "Vender propiedad", durationMinutes: 45, price: 0, bufferMinutes: 10 },
      { name: "Agendar visita", durationMinutes: 45, price: 0, bufferMinutes: 10 }
    ],
    faqs: [
      { question: "¿Qué datos pide para compradores?", answer: "Zona, presupuesto, tipo de propiedad, forma de pago y fecha tentativa." },
      { question: "¿Puede agendar visitas?", answer: "Puede capturar horario preferido y datos del prospecto para confirmación." }
    ]
  },
  educacion: {
    label: "Educación / cursos",
    niche: "educacion",
    automationType: "lead",
    hours: "Lunes a viernes de 9:00 a 18:00",
    tone: "claro, amable y orientado a inscripción",
    widgetInitialMessage: "Hola. Puedo ayudarte con información de cursos, horarios, modalidad e inscripción.",
    widgetPrompt: "Quiero información de un curso",
    services: [
      { name: "Información de cursos", durationMinutes: 30, price: 0, bufferMinutes: 10 },
      { name: "Inscripción", durationMinutes: 30, price: 0, bufferMinutes: 10 },
      { name: "Asesoría académica", durationMinutes: 45, price: 0, bufferMinutes: 10 }
    ],
    faqs: [
      { question: "¿Qué datos pide para informes?", answer: "Nombre, teléfono, curso de interés, modalidad, horario preferido y fecha de inicio." },
      { question: "¿Puede filtrar interesados?", answer: "Sí. Captura curso, presupuesto, modalidad y nivel de interés." }
    ]
  },
  citas: {
    label: "Citas / agenda",
    niche: "estetica",
    automationType: "appointment",
    hours: "Lunes a sábado de 10:00 a 20:00",
    tone: "amable y profesional",
    widgetInitialMessage: "Hola. Puedo ayudarte con servicios, horarios y solicitudes de cita.",
    widgetPrompt: "Quiero agendar un servicio",
    services: [
      { name: "Servicio principal", durationMinutes: 45, price: 0, bufferMinutes: 10 },
      { name: "Valoración", durationMinutes: 30, price: 0, bufferMinutes: 10 }
    ],
    faqs: [
      { question: "¿Puedo agendar por chat?", answer: "Sí. El asistente pide servicio, día, hora y nombre para registrar la solicitud." }
    ]
  }
};
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

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfToday() {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

function endOfThisWeek() {
  const date = endOfToday();
  date.setDate(date.getDate() + (6 - date.getDay()));
  return date;
}

function isFollowUpOverdue(customer) {
  if (!customer?.followUpAt) return false;
  return new Date(customer.followUpAt) < new Date();
}

function getFollowUpSummary(customer) {
  const quote = getQuoteRequestInfo(customer);
  return quote?.service || customer?.conversations?.[0]?.inboundText || customer?.notes || "Sin solicitud registrada";
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
      <a className="public-brand" href={LANDING_URL}>AutoChat Web</a>
      <div className="public-links">
        <a href={PROJECTS_URL}>Proyectos</a>
        <a href={`${LANDING_URL}#demos`}>Demos</a>
        {!compact && <a className="public-button" href="#contacto">Solicitar diagnóstico</a>}
      </div>
    </nav>
  );
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function parseServiceContactFields(service) {
  if (Array.isArray(service?.contactFields)) return service.contactFields.length ? service.contactFields : DEFAULT_CONTACT_FIELDS;
  if (typeof service?.contactFields === "string") {
    try {
      const parsed = JSON.parse(service.contactFields);
      return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_CONTACT_FIELDS;
    } catch {
      return DEFAULT_CONTACT_FIELDS;
    }
  }
  return DEFAULT_CONTACT_FIELDS;
}

function contactFieldsForService(services = [], selectedServiceName = "") {
  if (!selectedServiceName) return ["name", "phone", "email"];
  const selected = services.find((service) => normalizeText(service.name) === normalizeText(selectedServiceName));
  return parseServiceContactFields(selected);
}

function quoteDefaultContactFields() {
  return ["name", "phone", "email", "company", "city", "equipment", "urgency"];
}

function parseWidgetQuickReplies(value) {
  if (Array.isArray(value)) return value.length ? value : DEFAULT_WIDGET_REPLIES;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_WIDGET_REPLIES;
    } catch {
      return DEFAULT_WIDGET_REPLIES;
    }
  }
  return DEFAULT_WIDGET_REPLIES;
}

const widgetDefaults = {
  demo_barberia: {
    name: "Cliente Barbería",
    phone: "+525551111111",
    email: "cliente@demo.com",
    prompt: "Quiero un corte clásico mañana por la tarde",
    title: "AutoChat Barbería",
    intro: "Prueba servicios, horarios y agenda guiada.",
    hello: "Hola. Soy el asistente de la barbería demo. Puedo ayudarte con servicios, precios, horarios y solicitudes de cita."
  },
  demo_dental: {
    name: "Paciente Demo",
    phone: "+525552222222",
    email: "paciente@demo.com",
    prompt: "Quiero una valoración dental esta semana",
    title: "AutoChat Dental",
    intro: "Orientación inicial y captura de pacientes.",
    hello: "Hola. Soy el asistente de la clínica dental demo. Puedo orientarte con tratamientos, horarios y solicitudes de cita."
  },
  demo_proyectos: {
    name: "Alejandro",
    phone: "+525553333333",
    email: "contacto@negocio.com",
    prompt: "Tengo una estética, atiendo lunes a sábado, hago uñas y faciales, quiero capturar nombre, WhatsApp, servicio y horario.",
    title: "Diagnóstico AutoChat",
    intro: "Cuéntame tu proyecto y genero un ejemplo.",
    hello: "Hola. Para preparar tu diagnóstico, cuéntame qué negocio tienes, tus servicios, horarios, qué datos necesitas pedir y qué quieres automatizar."
  }
};

function PublicWidget({ businessId }) {
  const defaults = widgetDefaults[businessId] || widgetDefaults.demo_proyectos;
  const initialGreeting = /en qu[eé] puedo ayudarte/i.test(defaults.hello)
    ? defaults.hello
    : `${defaults.hello}\n\n¿En qué puedo ayudarte hoy?`;
  const [isOpen, setIsOpen] = useState(() => window.location.hash === "#chat");
  const [from, setFrom] = useState(() => `web-${businessId || "default"}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [leadError, setLeadError] = useState("");
  const [leadForm, setLeadForm] = useState({ name: defaults.name, phone: defaults.phone, email: defaults.email, company: "", address: "" });
  const [messageText, setMessageText] = useState(defaults.prompt);
  const [messages, setMessages] = useState([{ who: "bot", text: initialGreeting }]);
  const [contactNeeded, setContactNeeded] = useState(false);
  const [contactCaptured, setContactCaptured] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [selectedContactFields, setSelectedContactFields] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setLeadForm({ name: defaults.name, phone: defaults.phone, email: defaults.email, company: "", address: "" });
    setMessageText(defaults.prompt);
    setMessages([{ who: "bot", text: initialGreeting }]);
    setFrom(`web-${businessId || "default"}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    setContactNeeded(false);
    setContactCaptured(false);
    setSelectedServiceName("");
    setSelectedContactFields([]);
    setIsTyping(false);
    setLeadError("");
  }, [businessId]);

  function resetPublicWidget() {
    setLeadForm({ name: defaults.name, phone: defaults.phone, email: defaults.email, company: "", address: "" });
    setMessageText(defaults.prompt);
    setMessages([{ who: "bot", text: initialGreeting }]);
    setFrom(`web-${businessId || "default"}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    setContactNeeded(false);
    setContactCaptured(false);
    setSelectedServiceName("");
    setSelectedContactFields([]);
    setIsTyping(false);
    setLeadError("");
  }

  function closePublicWidget() {
    setIsOpen(false);
    resetPublicWidget();
  }

  useEffect(() => {
    window.AutoChatWidget = { open: () => setIsOpen(true), close: closePublicWidget };
    const openHandler = () => setIsOpen(true);
    window.addEventListener("autochat:open", openHandler);
    if (window.location.hash === "#chat") setIsOpen(true);
    return () => window.removeEventListener("autochat:open", openHandler);
  }, [defaults]);

  function updateSelectedService(text = "") {
    const explicit = String(text).match(/Servicio:\s*([^\n]+)/i) || String(text).match(/Has seleccionado:\s*([^\n]+)/i);
    if (explicit?.[1]) {
      setSelectedServiceName(explicit[1].trim());
      return;
    }
    const normalized = normalizeText(text);
    const match = (defaults.services || []).find((service) => normalized.includes(normalizeText(service.name)));
    if (match) setSelectedServiceName(match.name);
  }

  function updateContactConfig(conversation = {}) {
    if (Array.isArray(conversation.contactFields) && conversation.contactFields.length) {
      setSelectedContactFields(conversation.contactFields);
    }
    if (conversation.serviceName) {
      setSelectedServiceName(conversation.serviceName);
    }
  }

  const fieldMeta = {
    name: { placeholder: "Nombre", type: "text" },
    phone: { placeholder: "Teléfono / WhatsApp", type: "tel" },
    email: { placeholder: "Correo", type: "email" },
    company: { placeholder: "Empresa", type: "text" },
    position: { placeholder: "Puesto / cargo", type: "text" },
    address: { placeholder: "Dirección / ubicación", type: "text" },
    city: { placeholder: "Ciudad / zona", type: "text" },
    equipment: { placeholder: "Equipo / sistema", type: "text" },
    details: { placeholder: "Detalles adicionales", type: "text" },
    urgency: { placeholder: "Urgencia", type: "text" },
    preferredTime: { placeholder: "Horario preferido", type: "text" }
  };
  const contactFieldsToRender = selectedContactFields.length
    ? selectedContactFields
    : contactFieldsForService(defaults.services || [], selectedServiceName);
  const visibleContactFields = /cotiza|cotización|cotizacion|filtr|industrial|proyecto|renta|curso/i.test(`${defaults.prompt} ${defaults.hello}`) && contactFieldsToRender.length <= 2
    ? quoteDefaultContactFields()
    : contactFieldsToRender;

  function shouldAskContact(conversation) {
    if (contactCaptured) return false;
    const status = conversation?.status || "";
    const outbound = conversation?.outboundText || "";
    return (
      ["needs_human", "appointment_confirmed", "appointment_rescheduled", "appointment_cancelled"].includes(status) ||
      outbound.includes("dejé registrada tu solicitud") ||
      outbound.includes("revisará la información") ||
      outbound.includes("pasar con una persona")
    );
  }

  async function submitContact(event) {
    event.preventDefault();
    setLeadError("");
    try {
      const response = await fetch(API_URL + "/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          name: leadForm.name,
          phone: leadForm.phone,
          email: leadForm.email,
          company: leadForm.company,
          position: leadForm.position,
          address: leadForm.address,
          city: leadForm.city,
          equipment: leadForm.equipment,
          details: leadForm.details,
          urgency: leadForm.urgency,
          preferredTime: leadForm.preferredTime,
          previousFrom: from,
          source: "widget_web",
          notes: "Lead capturado al final del chat"
        })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "No se pudieron guardar los datos.");
      setFrom(body.from);
      setContactNeeded(false);
      setContactCaptured(true);
      setMessages((current) => [...current, { who: "bot", text: "Gracias. Ya guardé tus datos y el equipo podrá dar seguimiento a tu solicitud." }]);
    } catch (error) {
      setLeadError(error.message || "No se pudieron guardar los datos.");
    }
  }

  async function deliverWidgetText(rawText) {
    const text = rawText.trim();
    if (!text || !from) return;
    setMessageText("");
    setMessages((current) => [...current, { who: "me", text }]);
    try {
      setIsTyping(true);
      const response = await fetch(API_URL + "/api/conversations/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, from, text })
      });
      const body = await response.json();
      setIsTyping(false);
      setMessages((current) => [...current, { who: "bot", text: body.outboundText || "No pude responder en este momento." }]);
      updateContactConfig(body);
      updateSelectedService(body.outboundText || "");
      if (shouldAskContact(body)) setContactNeeded(true);
    } catch {
      setIsTyping(false);
      setMessages((current) => [...current, { who: "bot", text: "No pude conectar con el asistente. Intenta de nuevo en un momento." }]);
    }
  }

  async function sendWidgetMessage(event) {
    event.preventDefault();
    await deliverWidgetText(messageText);
  }

  function widgetQuickReplies(text) {
    const normalized = String(text || "").toLowerCase();
    if (normalized.includes("¿en qué puedo ayudarte") || normalized.includes("en que puedo ayudarte")) {
      const quoteMode = /cotiza|cotización|cotizacion|filtr|industrial|proyecto|renta|curso/i.test(`${defaults.prompt} ${defaults.hello}`);
      return [
        ["Ver servicios", "servicios"],
        [quoteMode ? "Solicitar cotización" : "Agendar cita", quoteMode ? "cotización" : "agendar cita"],
        ["Atención", "atención"]
      ];
    }
    if (normalized.includes("qué tan urgente") || normalized.includes("que tan urgente")) {
      return [["Urgente", "Urgente"], ["Esta semana", "Esta semana"], ["Programado", "Programado"]];
    }
    if (normalized.includes("servicios disponibles") || normalized.includes("estos son nuestros servicios")) {
      const matches = [...String(text).matchAll(/^\s*(\d+)\.\s+(.+)$/gm)].slice(0, 5);
      return matches.map((match) => [match[2].replace(/\s*\(.+\)$/, "").slice(0, 38), match[1]]);
    }
    return [];
  }

  function sendWidgetQuickReply(value) {
    deliverWidgetText(value);
  }

  return (
    <div className="react-widget-root">
      {!isOpen && <button className="react-widget-toggle" type="button" onClick={() => setIsOpen(true)}>Chat</button>}
      {isOpen && <section className="react-widget-panel" id="chat">
        <header>
          <div className="react-widget-avatar">AI</div>
          <div>
            <strong>{defaults.title}</strong>
            <span>{defaults.intro}</span>
          </div>
          <button type="button" onClick={closePublicWidget} aria-label="Cerrar chat">×</button>
        </header>
        <div className="react-widget-messages">
          {messages.map((item, index) => (
            <React.Fragment key={index}>
              <p className={item.who === "me" ? "me" : "bot"}><span>{item.who === "me" ? "Tú" : defaults.title}</span>{item.text}</p>
              {item.who !== "me" && widgetQuickReplies(item.text).length > 0 && (
                <div className="react-widget-options">
                  {widgetQuickReplies(item.text).map(([label, value]) => (
                    <button key={`${index}-${label}`} type="button" onClick={() => sendWidgetQuickReply(value)}>{label}</button>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
          {isTyping && (
            <p className="bot typing"><span>{defaults.title}</span><i></i><i></i><i></i></p>
          )}
        </div>
        {contactNeeded ? (
          <form className="react-widget-lead react-widget-contact" onSubmit={submitContact}>
            <strong>Datos de contacto</strong>
            <span>Para que el equipo pueda darte seguimiento, déjame tus datos.</span>
            {visibleContactFields.map((field) => (
              <input
                key={field}
                value={leadForm[field] || ""}
                onChange={(event) => setLeadForm((current) => ({ ...current, [field]: event.target.value }))}
                placeholder={fieldMeta[field]?.placeholder || field}
                type={fieldMeta[field]?.type || "text"}
                required
              />
            ))}
            <button type="submit">Enviar datos</button>
            {leadError && <small>{leadError}</small>}
          </form>
        ) : (
          <form className="react-widget-form" onSubmit={sendWidgetMessage}>
            <input value={messageText} onChange={(event) => setMessageText(event.target.value)} placeholder="Escribe..." />
            <button type="submit">Ir</button>
          </form>
        )}
      </section>}
    </div>
  );
}

function openPublicChat(event) {
  event.preventDefault();
  window.location.hash = "chat";
  window.dispatchEvent(new Event("autochat:open"));
  window.AutoChatWidget?.open?.();
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
          <div className="public-actions"><a className="public-button" href={PROJECTS_URL}>Ver cómo funciona</a><a className="public-button secondary" href="#demos">Ver demos</a></div>
        </div>
      </section>
      <section className="public-section diagnosis-section" id="diagnostico"><div className="public-inner diagnosis-wrap"><div><span className="public-eyebrow">Diagnóstico interactivo</span><h2>Primero entendemos tu negocio. Luego te mostramos cómo respondería tu asistente.</h2><p className="public-lead">El valor no está solo en poner un chat. Está en convertir tu proceso real en un flujo que capture datos, responda dudas y deje oportunidades listas para seguimiento.</p><div className="diagnosis-steps"><article><strong>1. Tu negocio</strong><span>Nombre, giro, horarios, ubicación y canales actuales.</span></article><article><strong>2. Tus servicios</strong><span>Qué vendes, precios base, duración, zonas o requisitos.</span></article><article><strong>3. Tus clientes</strong><span>Qué preguntan, qué datos necesitas y cuándo debe intervenir una persona.</span></article></div><a className="public-button" href="#chat" onClick={openPublicChat}>Probar diagnóstico</a></div><div className="diagnosis-chat"><strong>Ejemplo generado</strong><p><span>Cliente</span>Hola, tengo una estética y quiero automatizar citas para uñas y faciales.</p><p><span>AutoChat</span>Perfecto. Tu asistente puede pedir nombre, WhatsApp, servicio, día y horario. También puede responder precios, horarios, ubicación y dejar el lead en el panel como nuevo.</p><p><span>Resultado</span>El negocio recibe una solicitud clara, no solo un mensaje suelto.</p></div></div></section>
      <section className="public-section" id="soluciones"><div className="public-inner"><h2>Tu negocio no necesita otro formulario abandonado</h2><p className="public-lead">AutoChat se implementa por proyecto. Analizamos qué preguntas recibe tu negocio, qué datos necesita capturar y cómo debe avanzar cada oportunidad.</p><div className="public-grid three"><article><strong>Captura de clientes</strong><span>Nombre, teléfono, correo y contexto de la solicitud desde el primer contacto.</span></article><article><strong>Respuestas automáticas</strong><span>Servicios, precios, horarios, ubicación, políticas y preguntas frecuentes.</span></article><article><strong>Seguimiento comercial</strong><span>Panel de leads con estados, notas internas y conversación completa.</span></article></div></div></section>
      <section className="public-section public-band"><div className="public-inner public-split"><div><h2>Un canal propio, sin depender de WhatsApp API</h2><p className="public-lead">El asistente vive en la página del cliente. WhatsApp oficial puede agregarse después como fase premium, pero el proyecto puede venderse y operar desde web desde el día uno.</p><a className="public-button" href={PROJECTS_URL}>Ver proceso de trabajo</a></div><div className="public-preview" aria-label="Vista previa del asistente"><header><span></span><span></span><span></span></header><div className="preview-lines"><b></b><i></i><i></i><i></i></div><div className="preview-chat"><strong>Asistente</strong><span></span><span></span><span></span></div></div></div></section>
      <section className="public-section" id="demos"><div className="public-inner"><h2>Demos como ejemplos, no como límite</h2><p className="public-lead">Estas demos muestran distintos tonos y flujos. El asistente se adapta a cualquier negocio que necesite responder, filtrar y dar seguimiento.</p><div className="public-grid three"><article><strong>Barbería / estética</strong><span>Servicios, precios, horarios y solicitudes de cita como ejemplo comercial.</span><a className="public-button" href={DEMO_BARBERIA_URL}>Ver demo</a></article><article><strong>Clínica dental</strong><span>Valoración, limpieza, urgencias y captura de paciente con tono profesional.</span><a className="public-button" href={DEMO_DENTAL_URL}>Ver demo</a></article><article><strong>Proyecto personalizado</strong><span>Talleres, consultorios, inmobiliarias, cursos, despachos, servicios técnicos y más.</span><a className="public-button" href={PROJECTS_URL}>Ver proyectos</a></article></div></div></section>
      <section className="public-section" id="paquetes"><div className="public-inner"><h2>Implementación por proyecto</h2><p className="public-lead">El precio depende del flujo, contenido y nivel de personalización. La idea es empezar ligero y crecer cuando el canal demuestre valor.</p><div className="public-grid three price-grid"><article><strong>Proyecto inicial</strong><b>$2,500+</b><span>Widget web, flujo conversacional, captura de leads y panel de seguimiento.</span></article><article><strong>Proyecto avanzado</strong><b>$6,000+</b><span>Landing personalizada, FAQs, reglas de negocio, agenda o cotización.</span></article><article><strong>Mantenimiento</strong><b>$500+</b><span>Hosting básico, soporte, ajustes menores y mejoras del flujo.</span></article></div></div></section>
      <section className="public-section public-cta" id="contacto"><div className="public-inner cta-contact-wrap"><div><h2>Haz tu diagnóstico en el chat</h2><p className="public-lead">Abre el chat y escribe qué negocio tienes, tus servicios, horarios y qué quieres automatizar. El asistente te responderá con un ejemplo de flujo para tu caso.</p><div className="diagnosis-mini-grid"><span>Das contexto del negocio</span><span>Recibes ejemplo de conversación</span><span>Dejas tus datos de contacto al final</span></div><a className="public-button" href="#chat" onClick={openPublicChat}>Abrir diagnóstico</a></div><aside className="contact-note"><strong>Si te interesa implementarlo</strong><span>El chat te pedirá nombre, teléfono y correo al final del diagnóstico. Con esos datos puedo ponerme en contacto contigo para revisar tu proyecto y darte una propuesta.</span></aside></div></section>
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
      <section className="public-section public-cta" id="contacto"><div className="public-inner cta-contact-wrap"><div><h2>Cuéntanos qué quieres automatizar</h2><p className="public-lead">Abre el chat y describe tu negocio. La idea es convertir tu proceso actual en un asistente web claro y medible.</p><a className="public-button" href="#chat" onClick={openPublicChat}>Abrir diagnóstico</a></div><aside className="contact-note"><strong>Contacto después del diagnóstico</strong><span>Cuando dejes tus datos en el chat, el lead queda guardado en el panel para que pueda contactarte y aterrizar la implementación.</span></aside></div></section>
      <PublicFooter />
      <PublicWidget businessId="demo_proyectos" />
    </main>
  );
}

function DemoPage({ page }) {
  return (
    <main className={'public-page demo-page ' + page.type}>
      <section className="public-hero demo-hero"><PublicNav compact /><div className="public-hero-content"><span className="public-eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.description}</p><div className="public-actions"><a className="public-button" href="#probar">{page.primary}</a><a className="public-button secondary" href="#servicios">{page.secondary}</a><a className="public-button secondary" href={LANDING_URL}>Regresar al inicio</a></div></div></section>
      <section className="public-section" id="servicios"><div className="public-inner"><h2>{page.servicesTitle}</h2><p className="public-lead">{page.servicesLead}</p><div className="public-grid four">{page.services.map(([name, desc, price]) => <article key={name}><strong>{name}</strong><span>{desc}</span><b>{price}</b></article>)}</div></div></section>
      <section className="public-section public-band"><div className="public-inner"><h2>{page.infoTitle}</h2><p className="public-lead">{page.infoLead}</p><div className="public-grid three">{page.info.map(([name, desc]) => <article key={name}><strong>{name}</strong><span>{desc}</span></article>)}</div></div></section>
      <section className="public-section"><div className="public-inner public-split"><div><h2>{page.storyTitle}</h2><p className="public-lead">{page.story}</p><a className="public-button" href="#probar">Abrir chat</a></div><div className="demo-photo" aria-label={page.title}></div></div></section>
      <section className="public-section"><div className="public-inner"><h2>Preguntas frecuentes</h2><div className="public-grid three">{page.faqs.map(([question, answer]) => <article key={question}><strong>{question}</strong><span>{answer}</span></article>)}</div></div></section>
      <section className="public-section public-cta" id="probar"><div className="public-inner"><h2>Prueba el asistente</h2><p className="public-lead">Abre el chat, pregunta por un servicio u horario disponible y deja tus datos solo cuando quieras seguimiento.</p><a className="public-button" href="#chat" onClick={openPublicChat}>Abrir chat</a></div></section>
      <PublicFooter label={page.title} />
      <PublicWidget businessId={page.businessId} />
    </main>
  );
}

function PublicFooter({ label = "AutoChat Web" }) {
  return <footer className="public-footer"><div className="public-inner"><strong>{label}</strong><span>Automatización web personalizada para negocios.</span></div></footer>;
}

function parseQuoteFromNotes(notes = "") {
  if (!notes.includes("Solicitud de cotizaci")) return null;

  const getValue = (label) => {
    const line = notes.split("\n").find((item) => item.toLowerCase().startsWith(label.toLowerCase() + ":"));
    return line ? line.slice(label.length + 1).trim() : "";
  };

  return {
    service: getValue("Servicio"),
    details: getValue("Detalles"),
    location: getValue("Ubicación"),
    urgency: getValue("Urgencia")
  };
}

function getQuoteRequestInfo(customer) {
  if (!customer) return null;
  const fromNotes = parseQuoteFromNotes(customer.notes || "") || {};
  const quote = {
    service: customer.quoteService || fromNotes.service || "",
    details: customer.quoteDetails || fromNotes.details || "",
    location: customer.quoteLocation || fromNotes.location || "",
    urgency: customer.quoteUrgency || fromNotes.urgency || ""
  };
  const hasQuote = customer.lastIntent === "quote_complete" || Object.values(quote).some(Boolean);
  return hasQuote ? quote : null;
}

function buildLeadSummary(customer, format = "whatsapp") {
  if (!customer) return "";
  const quote = getQuoteRequestInfo(customer);
  const lines = [
    format === "email" ? "Resumen comercial del lead" : "Resumen del lead",
    `Nombre: ${customer.name || "Sin nombre"}`,
    `Teléfono: ${customer.phone || "Sin teléfono"}`,
    customer.email ? `Correo: ${customer.email}` : "",
    customer.company ? `Empresa: ${customer.company}` : "",
    customer.contactAddress ? `Dirección: ${customer.contactAddress}` : "",
    `Estado: ${LEAD_STATUSES.find(([value]) => value === (customer.leadStatus || "nuevo"))?.[1] || customer.leadStatus || "Nuevo"}`,
    customer.needsHuman ? "Atención: requiere seguimiento humano" : "Atención: ya marcado como atendido",
    quote ? "" : "",
    quote ? "Solicitud de cotización:" : "",
    quote ? `Servicio: ${quote.service || "No especificado"}` : "",
    quote ? `Detalles: ${quote.details || "No especificados"}` : "",
    quote ? `Ubicación: ${quote.location || "No especificada"}` : "",
    quote ? `Urgencia: ${quote.urgency || "No especificada"}` : "",
    customer.nextAction ? "" : "",
    customer.nextAction ? `Próxima acción: ${customer.nextAction}` : "",
    customer.followUpAt ? `Fecha de seguimiento: ${formatDate(customer.followUpAt)}` : "",
    customer.assignedTo ? `Responsable: ${customer.assignedTo}` : "",
    customer.notes ? "" : "",
    customer.notes ? `Notas: ${customer.notes}` : ""
  ].filter(Boolean);

  return lines.join(format === "email" ? "\n" : "\n");
}

function ConversationsPanel({ conversations = [], customers = [], selectedBusiness }) {
  const [selectedFrom, setSelectedFrom] = useState("");

  const conversationsByCustomer = useMemo(() => {
    const groups = {};

    conversations.forEach((conversation) => {
      const key = conversation.from || "unknown";

      if (!groups[key]) {
        const customer = customers.find((item) => item.phone === key);

        groups[key] = {
          from: key,
          customer,
          lastMessageAt: conversation.createdAt,
          messages: []
        };
      }

      groups[key].messages.push(conversation);
    });

    return Object.values(groups)
      .map((group) => {
        const messages = group.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return {
          ...group,
          messages,
          lastMessageAt: messages[messages.length - 1]?.createdAt
        };
      })
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
  }, [conversations, customers]);

  const selectedThread =
    conversationsByCustomer.find((thread) => thread.from === selectedFrom) ||
    conversationsByCustomer[0];

  useEffect(() => {
    if (!selectedFrom && conversationsByCustomer[0]) {
      setSelectedFrom(conversationsByCustomer[0].from);
    }
  }, [conversationsByCustomer, selectedFrom]);

  function getLeadStatusLabel(status) {
    const labels = {
      nuevo: "Nuevo",
      contactado: "Contactado",
      cita_agendada: "Cita agendada",
      perdido: "Perdido"
    };

    return labels[status] || status || "Sin estado";
  }

  const selectedQuote = getQuoteRequestInfo(selectedThread?.customer);

  return (
    <div className="conversations-layout">
      <section className="panel conversations-list-panel">
        <div className="panel-heading">
          <div>
            <h2><MessageSquareText size={20} /> Conversaciones</h2>
            <p>Chats recibidos para {selectedBusiness?.name || "este negocio"}.</p>
          </div>
        </div>

        {!conversationsByCustomer.length && (
          <div className="empty-state">
            <MessageSquareText size={28} />
            <strong>No hay conversaciones todavía</strong>
            <span>Cuando alguien use el widget, aparecerá aquí.</span>
          </div>
        )}

        <div className="conversation-list">
          {conversationsByCustomer.map((thread) => {
            const last = thread.messages[thread.messages.length - 1];
            const isActive = selectedThread?.from === thread.from;

            return (
              <button
                key={thread.from}
                className={isActive ? "conversation-item active" : "conversation-item"}
                type="button"
                onClick={() => setSelectedFrom(thread.from)}
              >
                <div className="conversation-avatar">
                  {(thread.customer?.name || thread.from || "?").slice(0, 1).toUpperCase()}
                </div>

                <div className="conversation-meta">
                  <strong>{thread.customer?.name || thread.from}</strong>
                  <span>{last?.inboundText || last?.outboundText || "Sin mensaje"}</span>
                  <small>{last?.createdAt ? formatDate(last.createdAt) : ""}</small>
                  {getQuoteRequestInfo(thread.customer) && <small className="quote-mini-label">Cotización completa</small>}
                </div>

                <em>{getLeadStatusLabel(thread.customer?.leadStatus)}</em>
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel conversation-detail-panel">
        {!selectedThread ? (
          <div className="empty-state">
            <Inbox size={32} />
            <strong>Selecciona una conversación</strong>
            <span>Aquí verás el historial completo del chat.</span>
          </div>
        ) : (
          <>
            <header className="conversation-detail-header">
              <div>
                <h2>{selectedThread.customer?.name || selectedThread.from}</h2>
                <span>{selectedThread.from}</span>
              </div>

              <div className="conversation-status">
                <strong>{getLeadStatusLabel(selectedThread.customer?.leadStatus)}</strong>
                {selectedThread.customer?.needsHuman && <span>Requiere atención</span>}
              </div>
            </header>

            <div className="conversation-customer-card">
              <div>
                <strong>Datos capturados</strong>
                <span>Nombre: {selectedThread.customer?.name || "Sin nombre"}</span>
                <span>Teléfono: {selectedThread.customer?.phone || selectedThread.from}</span>
                <span>Email: {selectedThread.customer?.email || "Sin correo"}</span>
                <span>Empresa: {selectedThread.customer?.company || "Sin empresa"}</span>
                <span>Dirección: {selectedThread.customer?.contactAddress || "Sin dirección"}</span>
              </div>

              <div>
                <strong>Notas</strong>
                <span>{selectedThread.customer?.notes || "Sin notas registradas"}</span>
              </div>
            </div>

            {selectedQuote && (
              <div className="quote-request-card">
                <div>
                  <span>Solicitud de cotización</span>
                  <strong>{selectedQuote.service || "Servicio no especificado"}</strong>
                </div>
                <dl>
                  <div>
                    <dt>Detalles técnicos</dt>
                    <dd>{selectedQuote.details || "Sin detalles"}</dd>
                  </div>
                  <div>
                    <dt>Ubicación</dt>
                    <dd>{selectedQuote.location || "Sin ubicación"}</dd>
                  </div>
                  <div>
                    <dt>Urgencia</dt>
                    <dd>{selectedQuote.urgency || "Sin urgencia"}</dd>
                  </div>
                  <div>
                    <dt>Estado</dt>
                    <dd>{selectedThread.customer?.needsHuman ? "Requiere atención humana" : "En seguimiento"}</dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="chat-thread">
              {selectedThread.messages.map((message) => (
                <React.Fragment key={message.id}>
                  {message.inboundText && (
                    <div className="chat-bubble user">
                      <span>Cliente</span>
                      <p>{message.inboundText}</p>
                      <small>{formatDate(message.createdAt)}</small>
                    </div>
                  )}

                  {message.outboundText && (
                    <div className="chat-bubble bot">
                      <span>{message.handledBy === "human" ? "Humano" : "AutoChat"}</span>
                      <p>{message.outboundText}</p>
                      <small>{message.status}</small>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function toICSDate(value) {
  return new Date(value).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICS(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function downloadAppointmentICS(appointment, business) {
  const start = new Date(appointment.startsAt);
  const duration = appointment.service?.durationMinutes || appointment.durationMinutes || 45;
  const end = new Date(start.getTime() + duration * 60 * 1000);
  const safeCustomerName = (appointment.customerName || "cliente").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "") || "cliente";

  const title = `${appointment.serviceName || "Cita"} - ${business?.name || "AutoChat"}`;
  const description = [
    `Cliente: ${appointment.customerName || ""}`,
    `Teléfono: ${appointment.customerPhone || ""}`,
    `Servicio: ${appointment.serviceName || ""}`,
    `Notas: ${appointment.notes || ""}`
  ].join("\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AutoChat//Appointments//ES",
    "BEGIN:VEVENT",
    `UID:${appointment.id}@autochat`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `cita-${safeCustomerName}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function AppointmentsPanel({
  appointments = [],
  calendar,
  selectedBusiness,
  cancelAppointment,
  rescheduleForm,
  setRescheduleForm,
  rescheduleAppointment
}) {
  const upcoming = appointments
    .filter((item) => ["confirmed", "hold"].includes(item.status))
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

  const past = appointments
    .filter((item) => !["confirmed", "hold"].includes(item.status))
    .sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));

  return (
    <div className="appointments-layout">
      <section className="panel appointments-main-panel">
        <div className="panel-heading">
          <div>
            <h2><CalendarDays size={20} /> Citas programadas</h2>
            <p>Agenda de {selectedBusiness?.name || "este negocio"}.</p>
          </div>
        </div>

        {!upcoming.length && (
          <div className="empty-state">
            <CalendarX size={30} />
            <strong>No hay citas próximas</strong>
            <span>Cuando el asistente agende una cita, aparecerá aquí.</span>
          </div>
        )}

        <div className="appointment-list">
          {upcoming.map((appointment) => (
            <article key={appointment.id} className="appointment-card">
              <div className="appointment-date">
                <strong>{new Date(appointment.startsAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}</strong>
                <span>{new Date(appointment.startsAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>

              <div className="appointment-info">
                <strong>{appointment.serviceName}</strong>
                <span>{appointment.customerName} · {appointment.customerPhone}</span>
                <small>{appointment.notes || "Sin notas"}</small>
              </div>

              <div className="appointment-status">
                <span className={`status-pill ${appointment.status}`}>{appointment.status}</span>
              </div>

              <div className="appointment-actions">
                <button type="button" onClick={() => downloadAppointmentICS(appointment, selectedBusiness)}>
                  Agregar a calendario
                </button>
                <button type="button" onClick={() => setRescheduleForm({ appointmentId: appointment.id, startsAt: toDatetimeLocal(appointment.startsAt) })}>
                  Reagendar
                </button>
                <button type="button" className="danger" onClick={() => cancelAppointment(appointment.id)}>
                  Cancelar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel appointment-side-panel">
        <h2><Clock size={20} /> Reagendar cita</h2>
        <form onSubmit={rescheduleAppointment} className="appointment-reschedule-form">
          <label>
            <span>Cita</span>
            <select
              value={rescheduleForm.appointmentId}
              onChange={(event) => setRescheduleForm((current) => ({ ...current, appointmentId: event.target.value }))}
            >
              <option value="">Selecciona cita</option>
              {upcoming.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.customerName} · {appointment.serviceName} · {formatDate(appointment.startsAt)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Nueva fecha y hora</span>
            <input
              type="datetime-local"
              value={rescheduleForm.startsAt}
              onChange={(event) => setRescheduleForm((current) => ({ ...current, startsAt: event.target.value }))}
            />
          </label>

          <button type="submit">Guardar cambio</button>
        </form>

        <div className="mini-calendar">
          <h3>Vista semanal</h3>
          {(calendar?.appointments || []).slice(0, 8).map((item) => (
            <div key={item.id} className="mini-calendar-item">
              <strong>{item.serviceName}</strong>
              <span>{item.customerName} · {formatDate(item.startsAt)}</span>
            </div>
          ))}
          {!calendar?.appointments?.length && <span>No hay citas esta semana.</span>}
        </div>

        {!!past.length && (
          <div className="past-appointments">
            <h3>Historial reciente</h3>
            {past.slice(0, 6).map((appointment) => (
              <div key={appointment.id}>
                <strong>{appointment.customerName}</strong>
                <span>{appointment.serviceName} · {appointment.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "/admin" || window.location.hash === "#admin") return <AdminApp />;
  if (path === "/proyectos") return <ProjectsPage />;
  if (demoPages[path]) return <DemoPage page={demoPages[path]} />;
  return <LandingPage />;
}

function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem("autochat_token") || "");
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("clients");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [businesses, setBusinesses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [mainDashboard, setMainDashboard] = useState(null);
  const [internalOverview, setInternalOverview] = useState(null);
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
  const [followUpFilter, setFollowUpFilter] = useState("overdue");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [leadNotes, setLeadNotes] = useState("");
  const [leadFollowUp, setLeadFollowUp] = useState({ nextAction: "", followUpAt: "", assignedTo: "" });
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
    contactFields: DEFAULT_CONTACT_FIELDS,
    active: true
  });
  const [faqForm, setFaqForm] = useState({ id: "", question: "", answer: "", active: true });
  const [customerForm, setCustomerForm] = useState({ id: "", name: "", email: "", notes: "", leadStatus: "nuevo" });
  const [manualReply, setManualReply] = useState({ customerId: "", text: "" });
  const [templateForm, setTemplateForm] = useState({ id: "", key: "", name: "", body: "", active: true });
  const [staffForm, setStaffForm] = useState({ name: "", serviceIds: [] });
  const [clientForm, setClientForm] = useState({ name: "", phone: "", address: "", template: "industrial" });

  const selected = useMemo(
    () => businesses.find((business) => business.id === selectedId) || businesses[0],
    [businesses, selectedId]
  );
  const selectedAutomationType = settingsForm.automationType || selected?.automationType || "";
  const selectedIsQuoteBased = selectedAutomationType
    ? ["quote", "hybrid"].includes(selectedAutomationType)
    : QUOTE_SEGMENTS.includes(settingsForm.niche || selected?.niche);

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
    setCurrentUser(body.user);
    setToken(body.token);
    setNotice("");
  }

  function logout() {
    localStorage.removeItem("autochat_token");
    setToken("");
    setCurrentUser(null);
    setInternalOverview(null);
    setBusinesses([]);
  }

  async function loadData(businessId = selected?.id) {
    if (!token) return;
    const profileRes = await apiFetch("/api/auth/me");
    if (!profileRes.ok) return;
    const profile = await profileRes.json();
    setCurrentUser(profile.user);

    const [mainDashboardRes, businessRes, conversationsRes, appointmentsRes, staffRes, blocksRes, customersRes, dashboardRes, inboxRes, templatesRes, remindersRes, calendarRes, internalRes] = await Promise.all([
      apiFetch(`/api/dashboard`),
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
      businessId ? apiFetch(`/api/calendar/${businessId}`) : Promise.resolve({ json: async () => null }),
      profile.user?.isInternalAdmin ? apiFetch("/api/internal/overview") : Promise.resolve({ json: async () => null })
    ]);

    setMainDashboard(await mainDashboardRes.json());
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
    setInternalOverview(await internalRes.json());
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
      niche: selected.niche || "servicios",
      automationType: selected.automationType || "appointment",
      phone: selected.phone || "",
      address: selected.address || "",
      hours: selected.hours || "",
      tone: selected.tone || "",
      widgetTitle: selected.widgetTitle || "Asistente",
      widgetIntro: selected.widgetIntro || "Deja tus datos para responderte y dar seguimiento a tu solicitud.",
      widgetInitialMessage: selected.widgetInitialMessage || "",
      widgetPrompt: selected.widgetPrompt || "Quiero información sobre sus servicios",
      widgetStyle: selected.widgetStyle || "premium",
      widgetPrimaryColor: selected.widgetPrimaryColor || "#1f5c50",
      widgetSecondaryColor: selected.widgetSecondaryColor || "#2f7a68",
      widgetAccentColor: selected.widgetAccentColor || "#c66d42",
      widgetBackgroundColor: selected.widgetBackgroundColor || "#f7f8f6",
      widgetLauncherText: selected.widgetLauncherText || "Chat",
      widgetAvatarText: selected.widgetAvatarText || "AI",
      widgetPosition: selected.widgetPosition || "right",
      widgetRadius: selected.widgetRadius || 24,
      widgetQuickReplies: parseWidgetQuickReplies(selected.widgetQuickReplies),
      widgetContactTitle: selected.widgetContactTitle || "Datos de contacto",
      widgetContactIntro: selected.widgetContactIntro || "Para que el equipo pueda darte seguimiento, déjame tus datos.",
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
    const payload = {
      ...settingsForm,
      widgetQuickReplies: (settingsForm.widgetQuickReplies || []).filter((item) => item.label?.trim() && item.value?.trim()),
      weeklySchedule: JSON.stringify(scheduleForm)
    };
    const response = await apiFetch(`/api/businesses/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json();
    setNotice(response.ok ? "Configuración guardada." : body.error || "No se pudo guardar.");
    await loadData(selected.id);
  }

  function updateWidgetQuickReply(index, field, value) {
    setSettingsForm((current) => {
      const replies = [...(current.widgetQuickReplies || DEFAULT_WIDGET_REPLIES)];
      replies[index] = { ...replies[index], [field]: value };
      return { ...current, widgetQuickReplies: replies };
    });
  }

  function addWidgetQuickReply() {
    setSettingsForm((current) => ({
      ...current,
      widgetQuickReplies: [...(current.widgetQuickReplies || DEFAULT_WIDGET_REPLIES), { label: "", value: "" }].slice(0, 6)
    }));
  }

  function removeWidgetQuickReply(index) {
    setSettingsForm((current) => ({
      ...current,
      widgetQuickReplies: (current.widgetQuickReplies || DEFAULT_WIDGET_REPLIES).filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  async function createClient(event) {
    event.preventDefault();
    const template = CLIENT_TEMPLATES[clientForm.template] || CLIENT_TEMPLATES.industrial;
    if (!clientForm.name.trim()) return;
    const response = await apiFetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: clientForm.name,
        phone: clientForm.phone,
        address: clientForm.address,
        niche: template.niche,
        automationType: template.automationType,
        hours: template.hours,
        tone: template.tone,
        widgetTitle: "Asistente",
        widgetIntro: "Deja tus datos y cuéntame qué servicio necesitas.",
        widgetInitialMessage: template.widgetInitialMessage,
        widgetPrompt: template.widgetPrompt,
        whatsappProvider: "none",
        services: template.services,
        faqs: template.faqs
      })
    });
    const body = await response.json();
    if (!response.ok) {
      setNotice(body.error || "No se pudo crear el cliente.");
      return;
    }
    setClientForm({ name: "", phone: "", address: "", template: "industrial" });
    setSelectedId(body.id);
    setView("settings");
    setNotice("Cliente creado con plantilla. Revisa su configuración antes de instalar el widget.");
    await loadData(body.id);
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
      contactFields: parseServiceContactFields(service),
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
      contactFields: serviceForm.contactFields?.length ? serviceForm.contactFields : DEFAULT_CONTACT_FIELDS,
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
      setServiceForm({ id: "", name: "", durationMinutes: 45, price: 0, bufferMinutes: 10, contactFields: DEFAULT_CONTACT_FIELDS, active: true });
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

  async function saveFollowUp(event) {
    event.preventDefault();
    if (!selectedLead) return;
    await updateLead(
      selectedLead,
      {
        nextAction: leadFollowUp.nextAction,
        followUpAt: leadFollowUp.followUpAt ? new Date(leadFollowUp.followUpAt).toISOString() : "",
        assignedTo: leadFollowUp.assignedTo
      },
      "Seguimiento guardado."
    );
  }

  async function completeFollowUp(customer) {
    await updateLead(
      customer,
      { nextAction: "", followUpAt: "", needsHuman: false },
      "Seguimiento marcado como realizado."
    );
  }

  function openFollowUpLead(customer) {
    setLeadFilter("all");
    setSelectedLeadId(customer.id);
    setLeadNotes(customer.notes || "");
    setLeadFollowUp({
      nextAction: customer.nextAction || "",
      followUpAt: toDatetimeLocal(customer.followUpAt),
      assignedTo: customer.assignedTo || ""
    });
    setView("dashboard");
  }

  function selectLead(customer) {
    setSelectedLeadId(customer.id);
    setLeadNotes(customer.notes || "");
    setLeadFollowUp({
      nextAction: customer.nextAction || "",
      followUpAt: toDatetimeLocal(customer.followUpAt),
      assignedTo: customer.assignedTo || ""
    });
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

  const selectedLead = inbox.find((customer) => customer.id === selectedLeadId) || inbox[0];
  const followUpLeads = useMemo(() => {
    const todayStart = startOfToday();
    const todayEnd = endOfToday();
    const weekEnd = endOfThisWeek();

    return customers
      .filter((customer) => {
        const followUpAt = customer.followUpAt ? new Date(customer.followUpAt) : null;

        if (followUpFilter === "overdue") return followUpAt && followUpAt < new Date();
        if (followUpFilter === "today") return followUpAt && followUpAt >= todayStart && followUpAt <= todayEnd;
        if (followUpFilter === "week") return followUpAt && followUpAt >= todayStart && followUpAt <= weekEnd;
        if (followUpFilter === "unassigned") return !customer.assignedTo;
        return followUpAt || customer.nextAction || !customer.assignedTo;
      })
      .sort((a, b) => {
        if (!a.followUpAt && !b.followUpAt) return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        if (!a.followUpAt) return 1;
        if (!b.followUpAt) return -1;
        return new Date(a.followUpAt) - new Date(b.followUpAt);
      });
  }, [customers, followUpFilter]);
  const widgetScript = `<script src="${API_URL}/public/widget.js?v=20260503c" data-api-url="${API_URL}" data-business-id="${selected?.id || ""}"></script>`;
  const publicLinks = [
    ["Landing general", LANDING_URL],
    ["Soluciones por proyecto", PROJECTS_URL],
    ["Demo barbería", DEMO_BARBERIA_URL],
    ["Demo dental", DEMO_DENTAL_URL],
    ["Panel admin", ADMIN_URL]
  ];
  useEffect(() => {
    if (selectedLead) {
      setLeadNotes(selectedLead.notes || "");
      setLeadFollowUp({
        nextAction: selectedLead.nextAction || "",
        followUpAt: toDatetimeLocal(selectedLead.followUpAt),
        assignedTo: selectedLead.assignedTo || ""
      });
    }
  }, [selectedLead?.id, selectedLead?.notes, selectedLead?.nextAction, selectedLead?.followUpAt, selectedLead?.assignedTo]);
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
          <p>Acceso privado para usuarios autorizados.</p>
          <a className="public-login-link" href={LANDING_URL}>Volver a la landing</a>
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
            className={view === "clients" ? "active" : ""}
            type="button"
            onClick={() => setView("clients")}
          >
            <BriefcaseBusiness size={18} />
            <span>Clientes</span>
          </button>
          <button
            className={view === "dashboard" ? "active" : ""}
            type="button"
            onClick={() => setView("dashboard")}
          >
            <CalendarDays size={18} />
            <span>Dashboard</span>
          </button>
          <button
            className={view === "conversations" ? "active" : ""}
            type="button"
            onClick={() => setView("conversations")}
          >
            <MessageSquareText size={18} />
            <span>Conversaciones</span>
          </button>
          <button
            className={view === "appointments" ? "active" : ""}
            type="button"
            onClick={() => setView("appointments")}
          >
            <CalendarDays size={18} />
            <span>Citas</span>
          </button>
          <button
            className={view === "followups" ? "active" : ""}
            type="button"
            onClick={() => setView("followups")}
          >
            <Clock size={18} />
            <span>Seguimientos</span>
          </button>
          <button
            className={view === "settings" ? "active" : ""}
            type="button"
            onClick={() => setView("settings")}
          >
            <Settings size={18} />
            <span>Configuración</span>
          </button>
          {currentUser?.isInternalAdmin && (
            <button
              className={view === "internal" ? "active" : ""}
              type="button"
              onClick={() => setView("internal")}
            >
              <ShieldCheck size={18} />
              <span>Interno</span>
            </button>
          )}
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
            <p>{view === "clients" ? "panel principal" : selected?.niche?.replace("_", " ")}</p>
            <h1>{view === "clients" ? "Clientes y oportunidades" : view === "settings" ? "Configuración" : view === "conversations" ? "Conversaciones" : view === "appointments" ? "Citas" : view === "followups" ? "Seguimientos" : view === "internal" ? "Control interno" : selected?.name || "AutoChat"}</h1>
          </div>
          <span>{view === "clients" ? "Vista general de proyectos" : view === "settings" ? selected?.name : view === "conversations" ? selected?.name || "Historial de chats" : view === "appointments" ? selected?.name || "Agenda del negocio" : view === "followups" ? selected?.name || "Próximas acciones" : view === "internal" ? "Administración privada de AutoChat" : "Asistente web + captura de leads"}</span>
        </header>

        {notice && <button className="notice" onClick={() => setNotice("")}>{notice}</button>}

        <section className="grid">
          {view === "conversations" && (
            <ConversationsPanel
              conversations={conversations}
              customers={customers}
              selectedBusiness={selected}
            />
          )}

          {view === "appointments" && (
            <AppointmentsPanel
              appointments={appointments}
              calendar={calendar}
              selectedBusiness={selected}
              cancelAppointment={cancelAppointment}
              rescheduleForm={rescheduleForm}
              setRescheduleForm={setRescheduleForm}
              rescheduleAppointment={rescheduleAppointment}
            />
          )}

          {view === "followups" && <div className="panel followups-panel">
            <div className="panel-heading">
              <div>
                <h2><Clock size={20} /> Seguimientos</h2>
                <p>Próximas acciones comerciales para {selected?.name || "este negocio"}.</p>
              </div>
            </div>
            <div className="followup-filters">
              {[
                ["overdue", "Vencidos"],
                ["today", "Hoy"],
                ["week", "Esta semana"],
                ["unassigned", "Sin responsable"],
                ["all", "Todos"]
              ].map(([value, label]) => (
                <button
                  className={followUpFilter === value ? "active" : ""}
                  key={value}
                  type="button"
                  onClick={() => setFollowUpFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            {!followUpLeads.length && (
              <div className="empty-state">
                <Clock size={30} />
                <strong>No hay seguimientos en este filtro</strong>
                <span>Programa una próxima acción desde la bandeja de leads.</span>
              </div>
            )}
            <div className="followup-list">
              {followUpLeads.map((customer) => (
                <article key={customer.id} className={isFollowUpOverdue(customer) ? "overdue" : ""}>
                  <div className="followup-main">
                    <strong>{customer.name || customer.phone}</strong>
                    <span>{customer.phone}{customer.email ? ` · ${customer.email}` : ""}</span>
                    <small>{getFollowUpSummary(customer)}</small>
                  </div>
                  <div className="followup-meta">
                    <span>Próxima acción</span>
                    <strong>{customer.nextAction || "Sin acción definida"}</strong>
                  </div>
                  <div className="followup-meta">
                    <span>Responsable</span>
                    <strong>{customer.assignedTo || "Sin responsable"}</strong>
                  </div>
                  <div className="followup-meta">
                    <span>Fecha límite</span>
                    <strong>{customer.followUpAt ? formatDate(customer.followUpAt) : "Sin fecha"}</strong>
                  </div>
                  <div className="followup-actions">
                    <button type="button" onClick={() => completeFollowUp(customer)}>Realizado</button>
                    <button type="button" onClick={() => openFollowUpLead(customer)}>Programar siguiente</button>
                    <button type="button" onClick={() => copyText(buildLeadSummary(customer, "whatsapp"), "Resumen para WhatsApp")}><Copy size={16} /> Copiar</button>
                  </div>
                </article>
              ))}
            </div>
          </div>}

          {view === "internal" && currentUser?.isInternalAdmin && <div className="panel internal-panel">
            <div className="panel-heading">
              <div>
                <h2><ShieldCheck size={20} /> Control interno</h2>
                <p>Vista privada para operar AutoChat completo sin mezclarlo con el panel del cliente.</p>
              </div>
            </div>
            <div className="security-note">
              <strong>Acceso protegido</strong>
              <span>Esta sección solo aparece para usuarios internos. El backend valida el rol en cada petición.</span>
            </div>
            <div className="metrics">
              <article><strong>{internalOverview?.totals?.businesses ?? 0}</strong><span>Negocios</span></article>
              <article><strong>{internalOverview?.totals?.users ?? 0}</strong><span>Usuarios</span></article>
              <article><strong>{internalOverview?.totals?.activeSessions ?? 0}</strong><span>Sesiones activas</span></article>
              <article><strong>{internalOverview?.totals?.totalLeads ?? 0}</strong><span>Leads totales</span></article>
              <article><strong>{internalOverview?.totals?.needsHuman ?? 0}</strong><span>Requieren atención</span></article>
              <article><strong>{internalOverview?.totals?.overdueFollowUps ?? 0}</strong><span>Seguimientos vencidos</span></article>
              <article><strong>{internalOverview?.totals?.wonLeads ?? 0}</strong><span>Ganados</span></article>
              <article><strong>{internalOverview?.totals?.lostLeads ?? 0}</strong><span>Perdidos</span></article>
            </div>
            <div className="internal-grid">
              <section>
                <h3>Negocios recientes</h3>
                <div className="internal-list">
                  {(internalOverview?.recentBusinesses || []).map((business) => (
                    <article key={business.id}>
                      <strong>{business.name}</strong>
                      <span>{business.niche} · {business.automationType}</span>
                      <small>{business.customers} leads · {business.conversations} mensajes · {business.appointments} citas</small>
                      <small>{business.owners?.map((owner) => `${owner.name} (${owner.email})`).join(", ") || "Sin dueño visible"}</small>
                    </article>
                  ))}
                </div>
              </section>
              <section>
                <h3>Leads que requieren revisión</h3>
                <div className="internal-list">
                  {(internalOverview?.recentLeads || []).map((lead) => (
                    <article key={lead.id} className={lead.needsHuman ? "needs-human" : ""}>
                      <strong>{lead.name || lead.phone}</strong>
                      <span>{lead.business?.name} · {lead.leadStatus}</span>
                      <small>{lead.conversations?.[0]?.inboundText || lead.notes || "Sin último mensaje"}</small>
                      <small>{lead.followUpAt ? `Seguimiento: ${formatDate(lead.followUpAt)}` : "Sin seguimiento"}</small>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>}

          {view === "clients" && <div className="panel metrics-panel">
            <h2><BriefcaseBusiness size={20} /> Operación general</h2>
            <div className="metrics">
              <article><strong>{mainDashboard?.totals?.clients ?? 0}</strong><span>Clientes/proyectos</span></article>
              <article><strong>{mainDashboard?.totals?.newLeads ?? 0}</strong><span>Leads nuevos</span></article>
              <article><strong>{mainDashboard?.totals?.needsHuman ?? 0}</strong><span>Requieren atención</span></article>
              <article><strong>{mainDashboard?.totals?.upcomingAppointments ?? 0}</strong><span>Citas próximas</span></article>
            </div>
          </div>}

          {view === "clients" && <div className="panel client-create-panel">
            <h2><Plus size={20} /> Nuevo cliente</h2>
            <p className="panel-copy">Crea un espacio separado por cliente. Cada uno tendrá su configuración, widget, leads, conversaciones y agenda.</p>
            <form className="client-template-form" onSubmit={createClient}>
              <label><span>Nombre del cliente</span><input value={clientForm.name} onChange={(event) => setClientForm((current) => ({ ...current, name: event.target.value }))} placeholder="Filtración y Lubricación Industrial" /></label>
              <label><span>Teléfono</span><input value={clientForm.phone} onChange={(event) => setClientForm((current) => ({ ...current, phone: event.target.value }))} placeholder="+52..." /></label>
              <label><span>Ubicación o zona</span><input value={clientForm.address} onChange={(event) => setClientForm((current) => ({ ...current, address: event.target.value }))} placeholder="Querétaro, Bajío, CDMX..." /></label>
              <label><span>Plantilla</span><select value={clientForm.template} onChange={(event) => setClientForm((current) => ({ ...current, template: event.target.value }))}>{Object.entries(CLIENT_TEMPLATES).map(([value, template]) => <option key={value} value={value}>{template.label}</option>)}</select></label>
              <button type="submit"><Plus size={18} /> Crear cliente</button>
            </form>
          </div>}

          {view === "clients" && <div className="panel client-list-panel">
            <h2><BriefcaseBusiness size={20} /> Clientes configurados</h2>
            <div className="client-cards">
              {(mainDashboard?.clients || businesses).map((business) => (
                <article key={business.id}>
                  <div><strong>{business.name}</strong><span>{business.niche?.replace("_", " ")}{business.phone ? ` · ${business.phone}` : ""}</span><small>{business.leads ?? 0} leads · {business.conversations ?? 0} mensajes · {business.appointments ?? 0} citas</small></div>
                  <div className="mini-actions"><button type="button" onClick={() => { setSelectedId(business.id); setView("dashboard"); }}>Dashboard</button><button type="button" onClick={() => { setSelectedId(business.id); setView("settings"); }}>Configuración</button></div>
                </article>
              ))}
            </div>
          </div>}

          {view === "clients" && <div className="panel recent-leads-panel">
            <h2><Inbox size={20} /> Últimos interesados</h2>
            <div className="client-cards">
              {(mainDashboard?.recentLeads || []).map((lead) => (
                <article key={lead.id}>
                  <div><strong>{lead.name}</strong><span>{lead.business?.name} · {lead.phone}{lead.email ? ` · ${lead.email}` : ""}</span><small>{lead.conversations?.[0]?.inboundText || lead.notes || "Lead capturado"}</small></div>
                  <button type="button" onClick={() => { setSelectedId(lead.businessId); setSelectedLeadId(lead.id); setView("dashboard"); }}>Abrir</button>
                </article>
              ))}
            </div>
          </div>}
          {view === "dashboard" && <div className="panel metrics-panel">
            <h2>Dashboard web</h2>
            <div className="metrics">
              <article><strong>{dashboard?.newLeads ?? 0}</strong><span>Leads nuevos</span></article>
              <article><strong>{dashboard?.appointmentsToday ?? 0}</strong><span>Citas hoy</span></article>
              <article><strong>{dashboard?.upcomingAppointments ?? 0}</strong><span>Próximas citas</span></article>
              <article><strong>{dashboard?.needsHuman ?? 0}</strong><span>Requieren humano</span></article>
              <article><strong>{dashboard?.activeCustomers ?? 0}</strong><span>Contactos totales</span></article>
              <article><strong>{dashboard?.conversations ?? 0}</strong><span>Mensajes registrados</span></article>
            </div>
            <div className="top-services">
              {dashboard?.topServices?.map((service) => (
                <span key={service.name}>{service.name}: {service.count}</span>
              ))}
            </div>
          </div>}

          {view === "dashboard" && <div className="panel dashboard-ops-panel">
            <h2><Bot size={20} /> Centro de control</h2>
            <div className="ops-grid">
              <article>
                <strong>Pendientes de seguimiento</strong>
                <span>{dashboard?.needsHuman ?? 0} conversación(es) requieren respuesta humana.</span>
                <small>Úsalo para cotizaciones, quejas o casos que el bot no debe cerrar solo.</small>
              </article>
              <article>
                <strong>Vista del visitante</strong>
                <span>{settingsForm.widgetTitle || selected?.widgetTitle || "Asistente"}</span>
                <small>{settingsForm.widgetIntro || selected?.widgetIntro || "Texto de entrada del widget"}</small>
              </article>
              <article>
                <strong>Agenda visual</strong>
                <span>{dashboard?.upcomingAppointments ?? 0} cita(s) próximas y bloqueos en calendario.</span>
                <small>Más adelante se puede conectar Google Calendar, pero por ahora el panel ya evita empalmes.</small>
              </article>
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
                <small className="field-help">Aparece en respuestas del bot, panel y mensajes de confirmación.</small>
              </label>
              <label>
                <span>Segmento del cliente</span>
                <select value={settingsForm.niche || "servicios"} onChange={(event) => setSettingsForm((current) => ({ ...current, niche: event.target.value }))}>
                  {SEGMENT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <small className="field-help">Describe el giro del cliente. Sirve para plantillas, tono y ejemplos.</small>
              </label>
              <label>
                <span>Tipo de automatización</span>
                <select value={settingsForm.automationType || "appointment"} onChange={(event) => setSettingsForm((current) => ({ ...current, automationType: event.target.value }))}>
                  {AUTOMATION_TYPE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <small className="field-help">Define el comportamiento principal del bot: agenda, cotización, captura simple o mixto.</small>
              </label>
              <label>
                <span>Teléfono</span>
                <input value={settingsForm.phone || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, phone: event.target.value }))} />
              </label>
              <label>
                <span>Dirección o sucursal</span>
                <input value={settingsForm.address || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, address: event.target.value }))} />
                <small className="field-help">Ejemplo: Sucursal Centro, Av. Salud 123 o servicio a domicilio.</small>
              </label>
              <label>
                <span>Horario visible</span>
                <input value={settingsForm.hours || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, hours: event.target.value }))} />
                <small className="field-help">Texto que responde el bot cuando preguntan horarios.</small>
              </label>
              <div className="form-section-title">Inicio del chat</div>
              <label>
                <span>Nombre visible del chat</span>
                <input value={settingsForm.widgetTitle || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetTitle: event.target.value }))} placeholder="Asistente de cotizaciones" />
                <small className="field-help">Aparece arriba del chat, como el nombre del asistente del negocio.</small>
              </label>
              <label>
                <span>Texto antes de pedir datos</span>
                <input value={settingsForm.widgetIntro || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetIntro: event.target.value }))} placeholder="Deja tus datos y cuéntame qué necesitas." />
                <small className="field-help">Aclara por qué el visitante debe dejar nombre, teléfono y correo.</small>
              </label>
              <label className="full-row">
                <span>Mensaje inicial del bot</span>
                <textarea value={settingsForm.widgetInitialMessage || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetInitialMessage: event.target.value }))} placeholder="Hola. Puedo ayudarte con servicios y cotizaciones..." />
                <small className="field-help">Este es el primer mensaje que responde el bot después de que el visitante deja sus datos.</small>
              </label>
              <label className="full-row">
                <span>Ejemplo dentro del campo de mensaje</span>
                <input value={settingsForm.widgetPrompt || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetPrompt: event.target.value }))} placeholder="Necesito cotizar filtración de aceite hidráulico" />
                <small className="field-help">Texto de ejemplo que aparece listo para que el visitante lo envíe o lo cambie.</small>
              </label>
              <div className="form-section-title">Diseño del widget</div>
              <label>
                <span>Estilo visual</span>
                <select value={settingsForm.widgetStyle || "premium"} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetStyle: event.target.value }))}>
                  {WIDGET_STYLE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <small className="field-help">Sirve para identificar la intención visual del proyecto sin tocar el widget base.</small>
              </label>
              <label>
                <span>Posición</span>
                <select value={settingsForm.widgetPosition || "right"} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetPosition: event.target.value }))}>
                  {WIDGET_POSITION_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label>
                <span>Texto del botón</span>
                <input value={settingsForm.widgetLauncherText || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetLauncherText: event.target.value }))} placeholder="Chat" />
              </label>
              <label>
                <span>Avatar</span>
                <input maxLength={3} value={settingsForm.widgetAvatarText || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetAvatarText: event.target.value }))} placeholder="AI" />
              </label>
              <label>
                <span>Color principal</span>
                <input type="color" value={settingsForm.widgetPrimaryColor || "#1f5c50"} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetPrimaryColor: event.target.value }))} />
              </label>
              <label>
                <span>Color secundario</span>
                <input type="color" value={settingsForm.widgetSecondaryColor || "#2f7a68"} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetSecondaryColor: event.target.value }))} />
              </label>
              <label>
                <span>Color de acción</span>
                <input type="color" value={settingsForm.widgetAccentColor || "#c66d42"} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetAccentColor: event.target.value }))} />
              </label>
              <label>
                <span>Fondo del chat</span>
                <input type="color" value={settingsForm.widgetBackgroundColor || "#f7f8f6"} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetBackgroundColor: event.target.value }))} />
              </label>
              <label>
                <span>Radio de esquinas</span>
                <div className="unit-input">
                  <input type="number" min="8" max="32" value={settingsForm.widgetRadius || 24} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetRadius: Number(event.target.value) }))} />
                  <small>px</small>
                </div>
              </label>
              <label>
                <span>Título del formulario</span>
                <input value={settingsForm.widgetContactTitle || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetContactTitle: event.target.value }))} placeholder="Datos de contacto" />
              </label>
              <label className="full-row">
                <span>Texto del formulario</span>
                <input value={settingsForm.widgetContactIntro || ""} onChange={(event) => setSettingsForm((current) => ({ ...current, widgetContactIntro: event.target.value }))} placeholder="Para que el equipo pueda darte seguimiento..." />
              </label>
              <div className="quick-replies-editor full-row">
                <div className="panel-heading compact">
                  <div>
                    <h3>Botones rápidos</h3>
                    <p>Configura opciones iniciales por proyecto sin modificar otros clientes.</p>
                  </div>
                  <button type="button" onClick={addWidgetQuickReply}>Agregar opción</button>
                </div>
                {(settingsForm.widgetQuickReplies || DEFAULT_WIDGET_REPLIES).map((reply, index) => (
                  <div className="quick-reply-row" key={`reply-${index}`}>
                    <input value={reply.label || ""} onChange={(event) => updateWidgetQuickReply(index, "label", event.target.value)} placeholder="Etiqueta visible" />
                    <input value={reply.value || ""} onChange={(event) => updateWidgetQuickReply(index, "value", event.target.value)} placeholder="Mensaje que envía" />
                    <button type="button" onClick={() => removeWidgetQuickReply(index)}>Quitar</button>
                  </div>
                ))}
              </div>
              <div
                className="widget-config-preview full-row"
                style={{
                  "--preview-primary": settingsForm.widgetPrimaryColor || "#1f5c50",
                  "--preview-secondary": settingsForm.widgetSecondaryColor || "#2f7a68",
                  "--preview-accent": settingsForm.widgetAccentColor || "#c66d42",
                  "--preview-bg": settingsForm.widgetBackgroundColor || "#f7f8f6",
                  "--preview-radius": `${settingsForm.widgetRadius || 24}px`
                }}
              >
                <div className="widget-preview-header">
                  <div className="widget-preview-avatar">{settingsForm.widgetAvatarText || "AI"}</div>
                  <div>
                    <strong>{settingsForm.widgetTitle || "Asistente"}</strong>
                    <span>{settingsForm.widgetIntro || "Deja tus datos para responderte."}</span>
                  </div>
                </div>
                <div className="widget-preview-body">
                  <p>{settingsForm.widgetInitialMessage || "Hola. Puedo ayudarte con servicios, cotizaciones y atención."}</p>
                  <div className="widget-preview-options">
                    {(settingsForm.widgetQuickReplies || DEFAULT_WIDGET_REPLIES).slice(0, 3).map((reply) => (
                      <button key={reply.label || reply.value} type="button">{reply.label || "Opción"}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-section-title">Canales de atención</div>
              <label>
                <span>WhatsApp oficial opcional</span>
                <select value={settingsForm.whatsappProvider || "none"} onChange={(event) => setSettingsForm((current) => ({ ...current, whatsappProvider: event.target.value }))}>
                  <option value="none">No usar WhatsApp API</option>
                  <option value="twilio">Twilio</option>
                  <option value="meta">Meta Cloud API</option>
                  <option value="360dialog">360dialog</option>
                </select>
                <small className="field-help">Por ahora puedes dejarlo apagado. El widget web funciona sin WhatsApp API.</small>
              </label>
              {settingsForm.whatsappProvider !== "none" && (
                <label>
                  <span>Número WhatsApp emisor</span>
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
              <div className="form-section-title">Reglas para citas</div>
              <label>
                <span>Días máximos para agendar</span>
                <div className="unit-input">
                  <input type="number" min="1" value={settingsForm.bookingWindowDays || 60} onChange={(event) => setSettingsForm((current) => ({ ...current, bookingWindowDays: Number(event.target.value) }))} />
                  <small>días</small>
                </div>
              </label>
              <label>
                <span>Anticipación para cancelar o reagendar</span>
                <div className="unit-input">
                  <input type="number" min="0" value={settingsForm.cancellationMinHours || 2} onChange={(event) => setSettingsForm((current) => ({ ...current, cancellationMinHours: Number(event.target.value) }))} />
                  <small>horas</small>
                </div>
                <small className="field-help">Si faltan menos horas, el bot manda el caso a una persona.</small>
              </label>
              <label>
                <span>Tiempo libre entre citas</span>
                <div className="unit-input">
                  <input type="number" min="0" value={settingsForm.defaultBufferMinutes || 10} onChange={(event) => setSettingsForm((current) => ({ ...current, defaultBufferMinutes: Number(event.target.value) }))} />
                  <small>min</small>
                </div>
                <small className="field-help">Margen para limpiar, preparar estación, cobrar o recibir al siguiente cliente.</small>
              </label>
              <label>
                <span>Tiempo para confirmar nombre</span>
                <div className="unit-input">
                  <input type="number" min="1" value={settingsForm.holdMinutes || 10} onChange={(event) => setSettingsForm((current) => ({ ...current, holdMinutes: Number(event.target.value) }))} />
                  <small>min</small>
                </div>
                <small className="field-help">Cuando el bot encuentra horario, lo aparta mientras el cliente termina de confirmar.</small>
              </label>
              <button type="submit"><Save size={18} /> Guardar configuración</button>
            </form>

            <h3>Servicios que puede ofrecer el bot</h3>
            <p className="panel-copy">{selectedIsQuoteBased ? "En este segmento los servicios se usan para clasificar y cotizar. Precio y duración son internos/opcionales; el bot no los mostrará como definitivos." : "Cada servicio define precio, duración y margen de agenda. El cliente puede pedirlo por nombre o número."}</p>
            <form className="service-form" onSubmit={saveService}>
              <label>
                <span>Nombre del servicio</span>
                <input
                  value={serviceForm.name}
                  onChange={(event) => setServiceForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Corte, limpieza, valoración"
                />
              </label>
              <label>
                <span>{selectedIsQuoteBased ? "Duración interna opcional" : "Duración"}</span>
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
                <span>{selectedIsQuoteBased ? "Precio base opcional" : "Precio"}</span>
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
                <span>{selectedIsQuoteBased ? "Margen interno" : "Margen después del servicio"}</span>
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
              <fieldset className="contact-field-options">
                <legend>Datos que pedirá este servicio</legend>
                {CONTACT_FIELD_OPTIONS.map(([value, label]) => (
                  <label key={value} className="inline-check">
                    <input
                      type="checkbox"
                      checked={(serviceForm.contactFields || []).includes(value)}
                      onChange={(event) => setServiceForm((current) => ({
                        ...current,
                        contactFields: event.target.checked
                          ? [...new Set([...(current.contactFields || []), value])]
                          : (current.contactFields || []).filter((field) => field !== value)
                      }))}
                    />
                    {label}
                  </label>
                ))}
                <small className="field-help">Selecciona solo los datos que este servicio necesita al final del chat.</small>
              </fieldset>
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
                  <span>{selectedIsQuoteBased ? "Por cotizar según condiciones del cliente" : `${service.durationMinutes} min, $${service.price}, margen ${service.bufferMinutes ?? selected.defaultBufferMinutes} min`}</span>
                  <small>Datos: {parseServiceContactFields(service).map((field) => CONTACT_FIELD_OPTIONS.find(([value]) => value === field)?.[1] || field).join(", ")}</small>
                  <div className="mini-actions">
                    <button type="button" onClick={() => editService(service)}>Editar</button>
                    <button type="button" onClick={() => toggleService(service)}>{service.active ? "Desactivar" : "Activar"}</button>
                  </div>
                </article>
              ))}
            </div>

            <h3>Horarios laborales</h3>
            <p className="panel-copy">Estos horarios sí afectan la agenda. Si un día está cerrado, el bot no debe aceptar citas ese día.</p>
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
            <p className="panel-copy">Asigna qué servicios puede realizar cada empleado para evitar empalmes y sugerir horarios reales.</p>
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
                <article key={customer.id} className={`${customer.needsHuman ? "needs-human" : ""} ${selectedLead?.id === customer.id ? "selected" : ""} ${isFollowUpOverdue(customer) ? "followup-overdue" : ""}`}>
                  <div>
                    <strong>{customer.name}</strong>
                    <span>{customer.phone}{customer.email ? `, ${customer.email}` : ""}</span>
                    <span className={`lead-badge ${customer.leadStatus || "nuevo"}`}>{LEAD_STATUSES.find(([value]) => value === (customer.leadStatus || "nuevo"))?.[1] || "Nuevo"}</span>
                    {getQuoteRequestInfo(customer) && <small className="quote-mini-label">Lead: cotización completa</small>}
                    {customer.nextAction && <small>Próxima acción: {customer.nextAction}</small>}
                    {customer.followUpAt && <small>Seguimiento: {formatDate(customer.followUpAt)}</small>}
                    <small>{customer.conversations?.[0]?.inboundText || customer.conversations?.[0]?.outboundText || "Sin mensajes"}</small>
                  </div>
                  <div className="mini-actions">
                    <button type="button" onClick={() => selectLead(customer)}>Ver</button>
                    <button type="button" onClick={() => updateLead(customer, { leadStatus: "contactado", needsHuman: false }, "Lead marcado como atendido.")}>Atendido</button>
                    <button type="button" onClick={() => updateLead(customer, { leadStatus: "ganado", needsHuman: false }, "Lead marcado como ganado.")}>Ganado</button>
                    <button type="button" onClick={() => updateLead(customer, { leadStatus: "perdido", needsHuman: false }, "Lead marcado como perdido.")}>Perdido</button>
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
                <div className="commercial-actions">
                  <button type="button" onClick={() => updateLead(selectedLead, { leadStatus: "contactado", needsHuman: false }, "Lead marcado como atendido.")}>Marcar atendido</button>
                  <button type="button" onClick={() => updateLead(selectedLead, { leadStatus: "ganado", needsHuman: false }, "Lead marcado como ganado.")}>Marcar ganado</button>
                  <button type="button" className="danger" onClick={() => updateLead(selectedLead, { leadStatus: "perdido", needsHuman: false }, "Lead marcado como perdido.")}>Marcar perdido</button>
                  <button type="button" onClick={() => copyText(buildLeadSummary(selectedLead, "whatsapp"), "Resumen para WhatsApp")}><Copy size={16} /> WhatsApp</button>
                  <button type="button" onClick={() => copyText(buildLeadSummary(selectedLead, "email"), "Resumen para correo")}><Copy size={16} /> Correo</button>
                </div>
                {(() => {
                  const quote = getQuoteRequestInfo(selectedLead);
                  return quote ? (
                    <div className="quote-request-card">
                      <div>
                        <span>Solicitud de cotización</span>
                        <strong>{quote.service || "Servicio no especificado"}</strong>
                      </div>
                      <dl>
                        <div><dt>Detalles técnicos</dt><dd>{quote.details || "Sin detalles"}</dd></div>
                        <div><dt>Ubicación</dt><dd>{quote.location || "Sin ubicación"}</dd></div>
                        <div><dt>Urgencia</dt><dd>{quote.urgency || "Sin urgencia"}</dd></div>
                        <div><dt>Estado</dt><dd>{selectedLead.needsHuman ? "Requiere atención humana" : "En seguimiento"}</dd></div>
                      </dl>
                    </div>
                  ) : null;
                })()}
                <form className="follow-up-form" onSubmit={saveFollowUp}>
                  <label>
                    <span>Próxima acción</span>
                    <input
                      value={leadFollowUp.nextAction}
                      onChange={(event) => setLeadFollowUp((current) => ({ ...current, nextAction: event.target.value }))}
                      placeholder="Llamar, enviar propuesta, validar alcance..."
                    />
                  </label>
                  <label>
                    <span>Fecha de seguimiento</span>
                    <input
                      type="datetime-local"
                      value={leadFollowUp.followUpAt}
                      onChange={(event) => setLeadFollowUp((current) => ({ ...current, followUpAt: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>Responsable</span>
                    <input
                      value={leadFollowUp.assignedTo}
                      onChange={(event) => setLeadFollowUp((current) => ({ ...current, assignedTo: event.target.value }))}
                      placeholder="Nombre del responsable"
                    />
                  </label>
                  <button type="submit"><Save size={18} /> Guardar seguimiento</button>
                </form>
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
