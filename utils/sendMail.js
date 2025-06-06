const nodeMailer = require("nodemailer");
const httpStatusCode = require("http-status-codes");

function returnResetpasswordHTML(data,code) {
  return `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>  تغییر پسورد </title>
        <style>

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            direction: rtl;
          }
          .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .header img {
            max-width: 150px;
          }
          .content {
            padding: 20px;
          }
          .code {
            background-color: #f0f7ff;
            color: #0066cc;
            font-size: 24px;
            font-weight: bold;
            padding: 10px 20px;
            margin: 20px 0;
            text-align: center;
            border-radius: 5px;
            display: inline-block;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }

          img{
            width:100px;
            height:100px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://goodtrip.storage.c2.liara.space/toolbox.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=6b96162b-d379-44a7-ae3f-e3cd178bbf19%2F20250522%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250522T124440Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=892d468e86cb4cb60a024f045a60b274e5f136ddbc3d08be00c1bccac50531b0" alt="جعبه ابزار">
            <h2>تغییر پسورد</h2>
          </div>
          <div class="content">
            <p>سلام ${data.firstName} ${data.lastName}</p>
            <p>پسورد شما با موفقیت تغییر کرد. روی لینک زیر کلیک کنید تا وارد سایت شوید.</p>
            <div class="">${code}</div>
            <p>اگر شما این درخواست را انجام نداده‌اید، لطفا این ایمیل را نادیده بگیرید.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} جعبه ابزار. تمام حقوق محفوظ است.</p>
          </div>
        </div>
      </body>
      </html>
    `;
}

function returnForgotpasswordHTML(data,link) {
  return `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>  تغییر پسورد </title>
        <style>

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            direction: rtl;
          }
          .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .header img {
            max-width: 150px;
          }
          .content {
            padding: 20px;
          }
          .code {
            background-color: #f0f7ff;
            color: #0066cc;
            font-size: 24px;
            font-weight: bold;
            padding: 10px 20px;
            margin: 20px 0;
            text-align: center;
            border-radius: 5px;
            display: inline-block;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }

          img{
            width:100px;
            height:100px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://goodtrip.storage.c2.liara.space/toolbox.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=6b96162b-d379-44a7-ae3f-e3cd178bbf19%2F20250522%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250522T124440Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=892d468e86cb4cb60a024f045a60b274e5f136ddbc3d08be00c1bccac50531b0" alt="جعبه ابزار">
            <h2>تغییر پسورد</h2>
          </div>
          <div class="content">
            <p>سلام ${data.firstName} ${data.lastName}</p>
            <p>برای تغییر پسورد خود روی لینک زیر کلیک کنید</p>
            <div class="">${link}</div>
            <p>اگر شما این درخواست را انجام نداده‌اید، لطفا این ایمیل را نادیده بگیرید.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} جعبه ابزار. تمام حقوق محفوظ است.</p>
          </div>
        </div>
      </body>
      </html>
    `;
}

function returnOTPHTML(code) {
  return `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>کد تایید جعبه ابزار</title>
        <style>

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            direction: rtl;
          }
          .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .header img {
            max-width: 150px;
          }
          .content {
            padding: 20px;
          }
          .code {
            background-color: #f0f7ff;
            color: #0066cc;
            font-size: 24px;
            font-weight: bold;
            padding: 10px 20px;
            margin: 20px 0;
            text-align: center;
            border-radius: 5px;
            display: inline-block;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }

          img{
            width:100px;
            height:100px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://goodtrip.storage.c2.liara.space/toolbox.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=6b96162b-d379-44a7-ae3f-e3cd178bbf19%2F20250522%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250522T124440Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=892d468e86cb4cb60a024f045a60b274e5f136ddbc3d08be00c1bccac50531b0" alt="جعبه ابزار">
            <h2>کد تایید حساب کاربری</h2>
          </div>
          <div class="content">
            <p>سلام،</p>
            <p>برای تکمیل فرآیند ثبت نام یا ورود به حساب کاربری خود در جعبه ابزار، لطفا از کد زیر استفاده کنید:</p>
            <div class="code">${code}</div>
            <p>این کد به مدت 10 دقیقه معتبر است.</p>
            <p>اگر شما این درخواست را انجام نداده‌اید، لطفا این ایمیل را نادیده بگیرید.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} جعبه ابزار. تمام حقوق محفوظ است.</p>
          </div>
        </div>
      </body>
      </html>
    `;
}

function sendForgotPasswordEmail(data, link) {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // should be replaced with real sender's account
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let mailOptions = {
    // should be replaced with real recipient's account
    to: data.email,
    subject: "تغییر پسورد",
    text: `سلام ${data.name} برای تغییر پسورد روی لینک زیر کلیک کنید`,
    html: returnForgotpasswordHTML(data,link)
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
  });
}

function sendOtpEmailUtil(data, code,email, req, res) {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // should be replaced with real sender's account
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let mailOptions = {
    // should be replaced with real recipient's account
    to: data.email,
    subject: "کد تایید",
    text: `سلام ${data.name} کد تایید را از زیر می توانید ببینید`,
    html: returnOTPHTML(code),
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(httpStatusCode.BAD_REQUEST).json({
        msg: "ایمیل فرستاده نشد. مشکلی وجود دارد",
      });
      return console.log(error);
    }

    res.status(httpStatusCode.OK).json({
      msg: "ایمیل خود را برای دریافت کد تایید بررسی کنید",
    });
    console.log("Message %s sent: %s", info.messageId, info.response);
  });
}

const sendSuccessResetPasswordEmail = (data, code) => {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // should be replaced with real sender's account
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let mailOptions = {
    // should be replaced with real recipient's account
    to: data.email,
    subject: "تغییر پسورد",
    html:returnResetpasswordHTML(data,code)
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
  });
};

module.exports = {
  sendForgotPasswordEmail,
  sendOtpEmailUtil,
  sendSuccessResetPasswordEmail,
};
