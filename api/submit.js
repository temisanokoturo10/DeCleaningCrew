// api/submit.js
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Destructure form data from the request body
  const { name, phone, service, size, email, address, date, time, message } = req.body;

  // Build the email content
  const emailContent = `
New Booking Request from De Cleaning Crew Website

Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}
Address: ${address || "Not provided"}
Service: ${service}
Space/Load Size: ${size || "Not specified"}
Preferred Date: ${date || "Not selected"}
Preferred Time: ${time || "Not selected"}

Additional Message:
${message || "None"}
  `;

  try {
    // Send email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, // Use environment variable
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "De Cleaning Crew <onboarding@resend.dev>",
        to: "decleaningcrew75@gmail.com", // Your email
        subject: "New Booking Request",
        text: emailContent
      })
    });

    // Handle Resend API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", errorText);
      return res.status(500).json({ message: "Failed to send booking." });
    }

    // Success
    return res.status(200).json({ message: "Booking sent successfully!" });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Failed to send booking." });
  }
}
