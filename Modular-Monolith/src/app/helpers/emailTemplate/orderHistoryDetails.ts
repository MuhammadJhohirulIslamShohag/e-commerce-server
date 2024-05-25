const orderHistoryDetails = () =>
  `   <!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Bounce Order Confirmation</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif">
<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  style="max-width: 600px; margin: 0 auto; border-collapse: collapse"
>
  <tr>
    <td
      style="background-color: #ffcc00; padding: 20px 0; text-align: center"
    >
      <h1
        style="font-size: 28px; color: #333; margin: 0; font-weight: bold"
      >
        Max e-commerce
      </h1>
      <h2
        style="font-size: 20px; color: #333; margin: 2px 0; font-weight: bold"
      >
        Order Confirmation
      </h2>
    </td>
  </tr>
  <tr>
    <td style="padding: 20px">
      <p
        style="
          margin: 0 0 15px;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        "
      >
        Hi <span style="color: #ffcc00">Bulbul Ahmed</span>,
      </p>
      <p
        style="
          margin: 0 0 15px;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        "
      >
        Thank you for your order for the Bounce Travel Case! Your order
        number is <span style="color: #ffcc00">#F55DD</span>.
      </p>
      <p
        style="
          margin: 0 0 15px;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        "
      >
        Here is a summary of your order:
      </p>
      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          border: 2px solid #ffcc00;
          border-collapse: collapse;
          margin-bottom: 15px;
        "
      >
        <thead>
          <tr>
            <th
              style="
                background-color: #ffcc00;
                padding: 10px;
                font-weight: bold;
              "
            >
              Product
            </th>
            <th
              style="
                background-color: #ffcc00;
                padding: 10px;
                font-weight: bold;
              "
            >
              Quantity
            </th>
            <th
              style="
                background-color: #ffcc00;
                padding: 10px;
                font-weight: bold;
              "
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #B2BEB5">
            <td style="padding: 10px; text-align: center">
              Jara Summer Caps
            </td>
            <td style="padding: 10px; text-align: center">2</td>
            <td style="padding: 10px; text-align: end">$24.99</td>
          </tr>
          <tr style="border-bottom: 1px solid #B2BEB5">
            <td style="padding: 10px; text-align: center">
              Jara Summer Caps
            </td>
            <td style="padding: 10px; text-align: center">2</td>
            <td style="padding: 10px; text-align: end">$24.99</td>
          </tr>

         
        </tbody>
        <tfoot>
          <tr>
            <th style="padding: 10px; background-color: #ffcc00">Total</th>
            <td style="padding: 10px"></td>
            <td style="padding: 10px; font-weight:bold; text-align: end">$96.99</td>
          </tr>
        </tfoot>
      </table>
      <p
        style="
          margin: 0 0 15px;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        "
      >
        We will ship your order as soon as possible and send you an email
        with tracking information once it has shipped.
      </p>
      <p
        style="
          margin: 0 0 15px;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        "
      >
        In the meantime, if you have any questions or concerns, please do
        not hesitate to contact us.
      </p>
      <p
        style="
          margin: 0 0 15px;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        "
      >
        Thank you again for your order!
      </p>
      <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #333">
        Sincerely,
      </p>
      <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #333">
        Max e-commerce team
      </p>
    </td>
  </tr>
  <tr>
    <td
      style="
        background-color: #333;
        color: #fff;
        padding: 15px 0;
        text-align: center;
      "
    >
      <p style="margin: 0">
        <a
          href="https://example.com/shop"
          style="color: #ffcc00; text-decoration: none; font-weight: bold"
          >Shop</a
        >
        |
        <a
          href="https://example.com/about"
          style="color: #ffcc00; text-decoration: none; font-weight: bold"
          >About</a
        >
        |
        <a
          href="https://example.com/contact"
          style="color: #ffcc00; text-decoration: none; font-weight: bold"
          >Contact</a
        >
      </p>
    </td>
  </tr>
</table>
</body>
</html>

    `

export default orderHistoryDetails
