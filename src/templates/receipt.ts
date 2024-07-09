export const Receipt = (data: SaleType) =>
  `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .invoice {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .invoice header {
            text-align: center;
            margin-bottom: 20px;
        }
        .invoice header img {
            max-width: 150px;
        }
        .invoice h1 {
            margin: 0;
            font-size: 24px;
        }
        .invoice .details, .invoice .totals, .invoice .contact {
            margin-bottom: 20px;
        }
        .invoice .details table, .invoice .totals table {
            width: 100%;
            border-collapse: collapse;
        }
        .invoice .details table th, .invoice .details table td, .invoice .totals table th, .invoice .totals table td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        .invoice .totals table th, .invoice .totals table td {
            text-align: right;
        }
        .invoice .totals table th {
            background-color: #f5f5f5;
        }
        .invoice .contact {
            text-align: center;
            font-size: 14px;
        }
        .invoice .contact p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="invoice">
        <header>
            <img src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png" alt="Cristal Optica">
            <h1>Cristal Optica</h1>
            <p>SERVIÇOS DE SAUDE</p>
            <p>NOVA VIDA - ATRIUM</p>
            <p>0000 Luanda</p>
            <p>NIF: 5001484320</p>
        </header>
        <section class="details">
            <h2>Invoice Details</h2>
            <table>
                <tr>
                    <th>Invoice No:</th>
                    <td>FR FR3/2916 2024</td>
                </tr>
                <tr>
                    <th>Name:</th>
                    <td>Santos Buca</td>
                </tr>
                <tr>
                    <th>Contributor:</th>
                    <td>002244948606567</td>
                </tr>
                <tr>
                    <th>Date:</th>
                    <td>2024-05-08</td>
                </tr>
                <tr>
                    <th>Time:</th>
                    <td>15:50:28</td>
                </tr>
            </table>
        </section>
        <section class="items">
            <h2>Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Qty</th>
                        <th>Product</th>
                        <th>Unit</th>
                        <th>Sub-Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>ARMACAO S/M</td>
                        <td>9990,00</td>
                        <td>9990,00</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>PROGRESSIVA CYL PHOTOGREY HMC</td>
                        <td>49950,00</td>
                        <td>99900,00</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <section class="totals">
            <h2>Totals</h2>
            <table>
                <tr>
                    <th>Total:</th>
                    <td>109890,00 Kz</td>
                </tr>
                <tr>
                    <th>IVA:</th>
                    <td>0,00</td>
                </tr>
            </table>
        </section>
        <section class="pickup">
            <p><strong>Pick up in 30 days.</strong></p>
        </section>
        <section class="contact">
            <h2>Contact</h2>
            <p>Phone: 927 966 008</p>
            <p>Website: <a href="http://www.cristaloptica.com">www.cristaloptica.com</a></p>
            <p>Facebook: Cristal Optica</p>
            <p>Instagram & TikTok: <a href="http://www.instagram.com/cristaloptica.ao">@cristaloptica.ao</a></p>
        </section>
    </div>
</body>
</html>
`;
