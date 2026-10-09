
import {
  FACEBOOK_LINK,
  INSTGRAM_LINK,
  TWITTER_LINK,
} from "../../../../config.js";
import { EmailSubject } from "../../../enum/email.enum.js";

export const htmlTemplates = {


  [EmailSubject.CONFIRM_EMAIL]: ({ title = "confirm-email", code }) => {
    return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>${title}</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #88BDBF;
  "
>

  <table
    border="0"
    cellpadding="0"
    cellspacing="0"
    width="100%"
    style="
      margin: 0;
      padding: 30px 0;
      background-color: #88BDBF;
    "
  >

    <tr>
      <td align="center">

        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="600"
          style="
            background-color: #F3F3F3;
            border: 1px solid #630E2B;
          "
        >

          <!-- Header -->
          <tr>
            <td style="padding: 30px;">

              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
              >

                <tr>

                  <td align="left">
                    <img
                      src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"
                      width="100"
                      alt="Logo"
                      style="
                        display: block;
                        border: 0;
                        outline: none;
                        text-decoration: none;
                      "
                    >
                  </td>

                  <td align="right">
                    <a
                      href="http://localhost:4200/#/"
                      target="_blank"
                      style="
                        text-decoration: none;
                        color: #630E2B;
                      "
                    >
                      View In Website
                    </a>
                  </td>

                </tr>

              </table>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">

              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="
                  background-color: #FFFFFF;
                  text-align: center;
                "
              >

                <!-- Icon -->
                <tr>
                  <td
                    style="
                      background-color: #630E2B;
                      padding: 25px;
                    "
                  >

                    <img
                      src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png"
                      width="50"
                      height="50"
                      alt="Email Icon"
                      style="
                        display: block;
                        margin: 0 auto;
                        border: 0;
                        outline: none;
                        text-decoration: none;
                      "
                    >

                  </td>
                </tr>

                <!-- Title -->
                <tr>
                  <td>

                    <h1
                      style="
                        margin: 0;
                        padding: 25px 10px;
                        color: #630E2B;
                        font-size: 28px;
                      "
                    >
                      ${title}
                    </h1>

                  </td>
                </tr>

                <!-- Code -->
                <tr>
                  <td
                    style="
                      padding: 10px 30px 30px 30px;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        padding: 15px 20px;
                        border-radius: 4px;
                        color: #FFFFFF;
                        background-color: #630E2B;
                        font-size: 20px;
                        font-weight: bold;
                        text-align: center;
                      "
                    >
                      ${code}
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>

          <!-- Social Media -->
          <tr>
            <td
              align="center"
              style="
                padding: 0 30px 30px 30px;
              "
            >

              <h3
                style="
                  margin: 0 0 20px 0;
                  color: #000000;
                  font-size: 18px;
                "
              >
                Stay in touch
              </h3>

              <!-- Facebook -->
              <a
                href="https://www.google.com"
                target="_blank"
                style="
                  text-decoration: none;
                  margin: 0 5px;
                "
              >
                <img
                  src="${FACEBOOK_LINK}"
                  width="50"
                  height="50"
                  alt="Facebook"
                  style="
                    display: inline-block;
                    border: 0;
                    outline: none;
                    text-decoration: none;
                  "
                >
              </a>

              <!-- Instagram -->
              <a
                href="https://www.google.com"
                target="_blank"
                style="
                  text-decoration: none;
                  margin: 0 5px;
                "
              >
                <img
                  src="${INSTGRAM_LINK}"
                  width="50"
                  height="50"
                  alt="Instagram"
                  style="
                    display: inline-block;
                    border: 0;
                    outline: none;
                    text-decoration: none;
                  "
                >
              </a>

              <!-- Twitter -->
              <a
                href="https://www.google.com"
                target="_blank"
                style="
                  text-decoration: none;
                  margin: 0 5px;
                "
              >
                <img
                  src="${TWITTER_LINK}"
                  width="50"
                  height="50"
                  alt="Twitter"
                  style="
                    display: inline-block;
                    border: 0;
                    outline: none;
                    text-decoration: none;
                  "
                >
              </a>

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>

</html>
    `;
  },


  
  [EmailSubject.TWO_STEP_VERIFICATION]: ({
    title = "Two-Step Verification",
    code,
  }) => {
    return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>${title}</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #F5F7F8;
    font-family: Arial, sans-serif;
  "
>

  <table
    border="0"
    cellpadding="0"
    cellspacing="0"
    width="100%"
    style="
      padding: 40px 0;
      background-color: #F5F7F8;
    "
  >

    <tr>
      <td align="center">

        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="600"
          style="
            max-width: 600px;
            background-color: #FFFFFF;
            border-radius: 12px;
            border: 1px solid #E5E7EB;
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                padding: 35px 30px 20px 30px;
              "
            >

              <img
                src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"
                width="90"
                alt="Logo"
                style="
                  display: block;
                  border: 0;
                "
              >

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td
              align="center"
              style="
                padding: 10px 40px 40px 40px;
              "
            >

              <h1
                style="
                  margin: 0 0 15px 0;
                  color: #263238;
                  font-size: 26px;
                  font-weight: 600;
                "
              >
                ${title}
              </h1>

              <p
                style="
                  margin: 0 0 25px 0;
                  color: #6B7280;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                Use the verification code below to complete
                your two-step verification.
              </p>

              <!-- OTP -->
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                style="
                  margin: 0 auto 25px auto;
                "
              >

                <tr>
                  <td
                    align="center"
                    style="
                      padding: 18px 35px;
                      background-color: #F0F7F7;
                      border: 1px solid #D6E7E8;
                      border-radius: 8px;
                    "
                  >

                    <span
                      style="
                        color: #365F63;
                        font-size: 30px;
                        font-weight: bold;
                        letter-spacing: 6px;
                      "
                    >
                      ${code}
                    </span>

                  </td>
                </tr>

              </table>

              <p
                style="
                  margin: 0;
                  color: #9CA3AF;
                  font-size: 13px;
                  line-height: 1.5;
                "
              >
                This code is valid for a limited time.
                If you did not request this code, please ignore this email.
              </p>

            </td>
          </tr>

          <!-- Social Media -->
          <tr>
            <td
              align="center"
              style="
                padding: 20px 30px 30px 30px;
                border-top: 1px solid #EEEEEE;
              "
            >

              <p
                style="
                  margin: 0 0 15px 0;
                  color: #9CA3AF;
                  font-size: 13px;
                "
              >
                Stay in touch
              </p>

              <!-- Facebook -->
              <a
                href="https://www.google.com"
                target="_blank"
                style="
                  text-decoration: none;
                  margin: 0 5px;
                "
              >
                <img
                  src="${FACEBOOK_LINK}"
                  width="35"
                  height="35"
                  alt="Facebook"
                  style="
                    display: inline-block;
                    border: 0;
                  "
                >
              </a>

              <!-- Instagram -->
              <a
                href="https://www.google.com"
                target="_blank"
                style="
                  text-decoration: none;
                  margin: 0 5px;
                "
              >
                <img
                  src="${INSTGRAM_LINK}"
                  width="35"
                  height="35"
                  alt="Instagram"
                  style="
                    display: inline-block;
                    border: 0;
                  "
                >
              </a>

              <!-- Twitter -->
              <a
                href="https://www.google.com"
                target="_blank"
                style="
                  text-decoration: none;
                  margin: 0 5px;
                "
              >
                <img
                  src="${TWITTER_LINK}"
                  width="35"
                  height="35"
                  alt="Twitter"
                  style="
                    display: inline-block;
                    border: 0;
                  "
                >
              </a>

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>

</html>
    `;
  },
  [EmailSubject.FORGOT_PASSWORD]: ({
  title = "Forgot Password",
  code,
}) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Use the code below to reset your password:</p>
        <h2>${code}</h2>
        <p>
          If you did not request a password reset,
          please ignore this email.
        </p>
      </body>
    </html>
  `;
},

};


export const confirmEmailTemplate = ({ subject, data = {} }) => {
  return htmlTemplates[subject](data);
};


