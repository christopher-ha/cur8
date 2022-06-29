import nodemailer from "nodemailer"
async function customVerificationRequest({
  identifier: email,
  url,
  provider: { server, from },
}) {
  const { host } = new URL(url)
  const transport = nodemailer.createTransport(server)
  await transport.sendMail({
    to: email,
    from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, email }),
  })
}

// Email HTML body
// TypeScript version: function html({ url, host, email }: Record<"url" | "host" | "email", string>) {
function html({ url, host, email }) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`

  // Some simple styling options
  const backgroundColor = "#ffffff"
  const textColor = "#333333"
  const mainBackgroundColor = "#ffffff"
  const buttonBackgroundColor = "#ffffff"
  const buttonBorderColor = "#333333"
  const buttonTextColor = "#333333"

  return `
  <table
  bgcolor="#FFFFFF"
  width="100%"
  style="width:100%!important;background:#ffffff;margin:0;padding:0;min-width:100%"
>
  <tbody>
    <tr>
      <td align="center">
        <span style="display:none!important;color:#ffffff;margin:0;padding:0;font-size:1px;line-height:1px">
          {" "}
        </span>
        <div style="padding: 32px 64px; line-height: 1.5; max-width: 600px; text-align: left;">
          <div style="padding-bottom: 32px; border-bottom:1px solid #d7d7d7">
            <h1 style="color:#333;font-size:20px; font-weight: 500; margin-bottom: 0;">Login</h1>
            <a href="${url}" target="_blank" style="padding-bottom:1px;border-bottom:1px solid #111;display:inline-block;background-color:white;color:#111;text-decoration:none;padding:15px 30px;margin:16px auto;text-align:center;outline:none;border:1px solid #aaaaaa;border-radius:0.125rem">
              Click here to log in
            </a>
            <div style="color:#aaaaaa;margin-top:12px">
              <p>If you didn't try to login, you can safely ignore this email.</p>
              <p>(≧◡≦) ♡</p>
            </div>
          </div>
          <div style="padding-top: 40px; text-align: center;">
            <i style="margin-bottom: 24px; color: #333333">cur8 was made by creatives for creatives</i><br>
            <i style="margin-bottom: 24px; color: #333333">designed + developed by <a href="https://www.instagram.com/bhris001/" style="color: inherit; text-decoration: underline">@bhris001</a> — <a href="https://bhris.digital/" style="color: inherit; text-decoration: underline">bhris.digital</a></i>
        </div>
        </div>
      </td>
    </tr>
  </tbody>
</table>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
// TypeScript Version: function text({ url, host }: Record<"url" | "host", string>) {
function text({ url, host }) {
  return `Sign in to ${host}\n${url}\n\n`
}

export default customVerificationRequest
