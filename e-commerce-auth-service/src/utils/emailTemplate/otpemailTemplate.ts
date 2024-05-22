const OtpEmailTemplate = (otp: number) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
      <title>Document</title>
    </head>
    <body style="background-color: #6ee7b7; font-family: 'Lato', sans-serif;">
        <h1
        style="
          text-transform: uppercase;
          font-size: 24px;
          color: white;
          text-align: center;
          padding-top: 40px;
        "
      >
        Aladin E-Commerce
      </h1>
      <div
        style="
          width: 100%;
          max-width: 500px;
          background-color: white;
          margin: 0 auto;
          border-radius: 5px;
          text-align: center;
          padding-top: 20px;
          padding-bottom: 60px
        "
      >
        <img
          style="
            border-radius: 50%;
            width: 150px;
            margin: 20px auto;
            display: block;
          "
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgGWNixrXfkjnfdzBf0kXHROBh-8ZPTLvOnA&usqp=CAU"
          alt=""
        />
        <div>
          <p style="color: #4f4f4f; font-size: 26px; font-weight: 500; margin: 0">Here is your OTP </h2>
          <p style="color: #6C6C6C; font-size: 20px; font-weight: 300; margin: 10px 0">For  Verifying, Please Verify your Email!</h3>
        </div>
        <div>
          <p style="font-size: 60px; font-weight: bold; margin: 25px 0 0 0;">${otp}</p>
          <p style="margin: 0; color: red; font-size: 16px; margin-top: 5px">Valid for ${new Date(
            Date.now() + 5 * 60 * 1000
          )} only</p>
        </div>
      </div>
      <div style="display: flex; align-items:center; justify-content: center; margin-top: 20px;color:#FFF; ">
        <a style="text-decoration: none; color: #ffff" href="#"  >FAQs</a>
        <a style="text-decoration: none; color: #ffff; padding: 0 30px" href="#">Terms & Conditions</a>
        <a style="text-decoration: none; color: #ffff" href="#">Contact Us</a>
      </div>
  
    </body>
  </html>
  `;
};

export default OtpEmailTemplate;
