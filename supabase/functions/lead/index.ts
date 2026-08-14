// FOAM.MEDIA — public lead endpoint (raport / newsletter / kontakt)
// Insert do CRM (service role) + maile przez Resend.
import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = "https://raport.barabashflow.pl";
const FROM = "FOAM.MEDIA <raport@barabashflow.pl>";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (d: unknown, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { ...cors, "content-type": "application/json" } });

function shell(title: string, body: string, cta?: { href: string; label: string }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#eef2fb;font-family:'Familjen Grotesk',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:28px 16px;">
    <div style="background:linear-gradient(180deg,#4168ee 0%,#5ea0c6 100%);border-radius:16px;overflow:hidden;">
      <div style="padding:36px 32px 8px;">
        <div style="color:#fff;font-size:26px;font-weight:700;letter-spacing:-0.03em;">foam<span style="opacity:.75;font-size:14px;">.media</span></div>
      </div>
      <div style="padding:20px 32px 36px;color:#fff;">
        <div style="font-size:22px;font-weight:600;letter-spacing:-0.03em;line-height:1.15;margin-bottom:12px;">${title}</div>
        <div style="font-size:15px;line-height:1.55;color:rgba(255,255,255,.92);">${body}</div>
        ${cta ? `<div style="margin-top:24px;"><a href="${cta.href}" style="display:inline-block;background:#fff;color:#4f87d8;text-decoration:none;font-weight:600;font-size:15px;padding:12px 26px;border-radius:999px;">${cta.label}</a></div>` : ""}
      </div>
    </div>
    <div style="padding:18px 8px;color:#8ba0c4;font-size:12px;font-family:monospace;">foam.media &middot; built on media connections</div>
  </div></body></html>`;
}

async function send(key: string, to: string, subject: string, html: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!r.ok) console.error("resend", r.status, await r.text());
  return r.ok;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    const b = await req.json();
    const kind = String(b.kind || "");
    const email = String(b.email || "").trim().toLowerCase();
    if (!["raport", "newsletter", "kontakt"].includes(kind)) return json({ error: "bad kind" }, 400);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return json({ error: "bad email" }, 400);
    if (kind !== "kontakt" && !b.consent_rodo) return json({ error: "consent" }, 400);

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // newsletter/raport: nie duplikuj subskrypcji tego samego maila
    if (kind === "newsletter") {
      const { data: dup } = await sb.from("leads").select("id").eq("kind", "newsletter").eq("email", email).limit(1);
      if (dup && dup.length) return json({ ok: true, dup: true });
    }

    const row = {
      kind,
      email,
      name: String(b.name || "").slice(0, 200) || null,
      company: String(b.company || "").slice(0, 200) || null,
      role: String(b.role || "").slice(0, 200) || null,
      topic: String(b.topic || "").slice(0, 100) || null,
      message: String(b.message || "").slice(0, 5000) || null,
      consent_rodo: !!b.consent_rodo,
      consent_marketing: !!b.consent_marketing,
      source: String(b.source || "").slice(0, 200) || null,
    };
    const { error } = await sb.from("leads").insert(row);
    if (error) return json({ error: error.message }, 500);

    const KEY = Deno.env.get("RESEND_KEY") || "";
    const NOTIFY = Deno.env.get("NOTIFY_TO") || "";
    if (KEY) {
      if (kind === "raport") {
        await send(KEY, email, "twój raport — foam.media",
          shell("twój raport jest gotowy.",
            `dzięki za pobranie. w raporcie: jak małe sygnały składają się na siłę przekazu — dane, wnioski i rekomendacje dla nowoczesnych kampanii.`,
            { href: `${SITE}/raport/pelny`, label: "otwórz raport" }));
      } else if (kind === "newsletter") {
        await send(KEY, email, "witaj w the connections",
          shell("witaj w the connections.",
            `od teraz raz na jakiś czas dostaniesz od nas krótki sygnał: obserwacje o mediach, kampaniach i połączeniach, które robią różnicę. bez szumu.`));
      } else if (kind === "kontakt" && NOTIFY) {
        await send(KEY, NOTIFY, `nowa wiadomość — ${row.topic || "kontakt"} — foam.media`,
          shell("nowa wiadomość z formularza.",
            `<b>od:</b> ${row.name || "—"} &lt;${email}&gt;<br><b>firma:</b> ${row.company || "—"}<br><b>temat:</b> ${row.topic || "—"}<br><br>${(row.message || "").replace(/</g, "&lt;").replace(/\n/g, "<br>")}`));
      }
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 400);
  }
});
