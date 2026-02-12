export const emailTemplates = {
  /**
   * Generate OTP email HTML template
   * @param {string} otp - The OTP code
   * @param {number} validityMinutes - How long the OTP is valid
   * @returns {string} HTML email template
   */
  otpTemplate: (otp, validityMinutes = 15) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 600px;">
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Password Reset Request</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #4a5568; font-size: 16px; margin: 0 0 20px;">Hello,</p>
              
              <p style="color: #4a5568; font-size: 16px; margin: 0 0 30px;">
                We received a request to reset your password. To proceed with the password reset, please use the verification code below:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; display: inline-block;">
                      <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Your Verification Code</p>
                      <div style="background-color: rgba(255, 255, 255, 0.95); border-radius: 8px; padding: 20px 40px; margin: 0;">
                        <p style="color: #667eea; font-size: 36px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #fff5f5; border-left: 4px solid #fc8181; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #742a2a; font-size: 14px; margin: 0; line-height: 1.6;">
                      <strong>⏱️ Code Validity:</strong> This verification code will expire in <strong>${validityMinutes} minutes</strong>.<br>
                      <strong>🔒 Security Notice:</strong> If you did not request this password reset, please ignore this email or contact support immediately.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #4a5568; font-size: 16px; margin: 30px 0 0;">
                Thank you for using our laboratory management system.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0 0 10px;">
                <strong>Laboratory Management System</strong>
              </p>
              <p style="color: #a0aec0; font-size: 12px; margin: 0 0 15px;">
                Secure • Reliable • Professional Healthcare Solutions
              </p>
              <div style="margin: 20px 0;">
                <p style="color: #a0aec0; font-size: 11px; margin: 0; line-height: 1.6;">
                  This is an automated email. Please do not reply to this message.<br>
                  © ${new Date().getFullYear()} Laboratory Management System. All rights reserved.
                </p>
              </div>
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

  /**
   * Generate welcome email HTML template
   * @param {string} email - User's email
   * @param {string} role - User's role
   * @returns {string} HTML email template
   */
  welcomeTemplate: (email, role) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Laboratory Management System</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 600px;">
          <tr>
            <td style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome Aboard!</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #4a5568; font-size: 16px; margin: 0 0 20px;">Hello,</p>
              
              <p style="color: #4a5568; font-size: 16px; margin: 0 0 20px;">
                Your account has been successfully created! Welcome to the Laboratory Management System.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #f7fafc; border-radius: 8px;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="color: #2d3748; font-size: 14px; margin: 0 0 15px;"><strong>Account Details:</strong></p>
                    <p style="color: #4a5568; font-size: 14px; margin: 0 0 8px;">📧 <strong>Email:</strong> ${email}</p>
                    <p style="color: #4a5568; font-size: 14px; margin: 0;">👤 <strong>Role:</strong> <span style="background-color: #48bb78; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: uppercase;">${role}</span></p>
                  </td>
                </tr>
              </table>

              <p style="color: #4a5568; font-size: 16px; margin: 30px 0;">
                You can now access all the features available for your role. Get started by logging into your account.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0 0 10px;">
                <strong>Laboratory Management System</strong>
              </p>
              <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                Secure • Reliable • Professional Healthcare Solutions
              </p>
              <p style="color: #a0aec0; font-size: 11px; margin: 20px 0 0;">
                © ${new Date().getFullYear()} Laboratory Management System. All rights reserved.
              </p>
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

  /**
   * Generate password reset success email HTML template
   * @returns {string} HTML email template
   */
  passwordResetSuccessTemplate: () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Successfully Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 600px;">
          <tr>
            <td style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px 30px; text-align: center;">
              <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Password Reset Successful</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #4a5568; font-size: 16px; margin: 0 0 20px;">Hello,</p>
              
              <p style="color: #4a5568; font-size: 16px; margin: 0 0 30px;">
                Your password has been successfully reset. You can now log in to your account using your new password.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #f0fff4; border-left: 4px solid #48bb78; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #22543d; font-size: 14px; margin: 0; line-height: 1.6;">
                      <strong>✓ Security Alert:</strong> If you did not make this change, please contact our support team immediately to secure your account.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #4a5568; font-size: 16px; margin: 30px 0 0;">
                Thank you for keeping your account secure.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0 0 10px;">
                <strong>Laboratory Management System</strong>
              </p>
              <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                Secure • Reliable • Professional Healthcare Solutions
              </p>
              <p style="color: #a0aec0; font-size: 11px; margin: 20px 0 0;">
                © ${new Date().getFullYear()} Laboratory Management System. All rights reserved.
              </p>
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
};

export default emailTemplates;
