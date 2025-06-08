import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { name, email, message } = await req.json();
    
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), 
        { headers: handleReturnCORS(req), status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: 'contact@debriefly.com',
      to: 'nathanieltjames24@gmail.com',
      subject: `Debriefly: Contact Form Inquiry from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    });

    return new Response(JSON.stringify(result), { 
      headers: handleReturnCORS(req),
      status: 200 
    });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: handleReturnCORS(req), status: 500 }
    );
  }
}); 