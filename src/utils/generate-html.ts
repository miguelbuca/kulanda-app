import { Platform } from "react-native";
import { calCharges, totalCharges } from "../hooks/use-order";
import { formatMoney } from "./format-money";
import { getApiFile } from "./get-api-file";
import qrcode from "qrcode";
import { theme } from "@/tailwind.config";

export type DocType = "credit_note" | "debit_note" | "receipt" | "invoice";

export const prepareOrders = (orders: OrderType[]) => {
  const _products: {
    [Symbol in string]: {
      extra: ProductType | ServiceType;
      qtd: number;
      totalChargers: number;
      total: number;
      charges: number;
    };
  } = {};

  const _services: typeof _products = {};

  orders.forEach(({ products, services }) => {
    products.forEach((product) => {
      const keys = Object.keys(_products);

      if (keys.includes(product.id)) {
        const qtd = _products[product.id].qtd + 1;
        const total = qtd * product.price;
        _products[product.id] = {
          ..._products[product.id],
          totalChargers: qtd * _products[product.id].totalChargers,
          qtd,
          total,
        };
      } else {
        _products[product.id] = {
          extra: product,
          qtd: 1,
          totalChargers:
            calCharges(product.price, product.charges) +
            calCharges(product.price, product.category.charges),
          total: product.price,
          charges:
            totalCharges(product.charges) +
            totalCharges(product.category.charges),
        };
      }
    });
    services.forEach((service) => {
      const keys = Object.keys(_services);

      if (keys.includes(service.id)) {
        const qtd = _services[service.id].qtd + 1;
        _services[service.id] = {
          ..._services[service.id],
          totalChargers: qtd * _services[service.id].totalChargers,
          qtd,
          total: qtd * service.price,
        };
      } else {
        _services[service.id] = {
          extra: service,
          qtd: 1,
          totalChargers:
            calCharges(service.price, service.charges) +
            calCharges(service.price, service.category.charges),
          total: service.price,
          charges:
            totalCharges(service.charges) +
            totalCharges(service.category.charges),
        };
      }
    });
  });

  return {
    products: _products,
    services: _services,
  };
};

export async function page(
  type: DocType,
  company?: CompanyType,
  invoice?: InvoiceType,
  content?: string,
  store?: StoreType,
  options?: {
    currentPage: number;
    startIndex: number;
    endIndex: number;
    pageNumber: number;
  }
) {
  const orders = prepareOrders(invoice?.sale.orders ?? []);

  let totalChargersTransport = 0;
  let totalAmountForTransport = 0;

  Object.keys(orders).forEach((elements_key) => {
    const items = orders[elements_key as keyof typeof orders];
    Object.keys(items)
      .slice(0, options?.endIndex)
      .forEach((element_key) => {
        const element = items[element_key];

        totalChargersTransport += element.totalChargers;
        totalAmountForTransport += element.total;
      });
  });

  const header = {
    styles: `
    .header{
      display: flex;
      flex-direction: column;
    
    }
    .header>div:first-child{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 3rem;
    }
    .header-company-logo{
      height: 12rem;
      width: 12rem;
    }
    .header-company-title{
      font-size: 14pt;
    }
    .header-company-info{
      flex:1;
      display: flex;
      flex-direction: column;
      margin-bottom: 3rem;
    }
    .header-company-info *:not(:first-child){
      color: #4e4e4e;
    }

    .header-company-info strong, span{
      font-size: 10px;
    }
    .header-invoice-and-user-info{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 2rem 0;
    }
      .header-invoice-and-user-info>div:last-child{
        display: flex;
        flex-direction: column;
        padding: .5rem;
        border: solid 1px #ddd;
        min-width: 250px;
      }
      .header-invoice-and-user-info>div:last-child>*{
        margin-bottom: .3rem;
      }
      .header-invoice-and-user-info>div strong{
        font-weight: 700 !important;
        font-size: 12pt;
      }
      .header-invoice-and-user-info>div:first-child{
        display: flex;
        flex-direction: column;
      }
      .header-invoice-section{
        display: flex;
        flex-direction: column;
      }
      .header-invoice-section *{
        margin-bottom: .3rem;
        color: #4e4e4e !important;
        font-size: 10px;
      }
    `,
    content: `
    <header class="header">
    <div>
      <div class="header-company-info">
        <div>
          <h1 class="header-company-title">${company?.name}</h1>
        </div>
        <small>
          <strong>
            Contribuente Nº
          </strong>
          <span>
            ${company?.nif}
          </span>
        </small>
        <small>
          <strong>
            Endereço
          </strong>
          <span>
            ${company?.address}
          </span>
        </small>
      </div>
      <div>
      <img class="header-company-logo" src="${getApiFile(
        company?.logo ?? ""
      )}" alt="logo"/>
      </div>
      </div>
      <div class="header-invoice-and-user-info">
        <div>
          <div style="margin-bottom: 1rem;">
            <strong>
              ${invoice?.status === "PAID" ? "Fatura-recibo" : "Fatura"} nº ${
      invoice?.status === "PAID" ? "FR" : "FT"
    } ${
      new Date(invoice?.createdAt ?? "").getFullYear() + "/" + invoice?.number
    }
            </strong>
          </div>
          <div class="header-invoice-section">
            <small>
                Date de entrega:
              <span>
                ${invoice?.updatedAt
                  .toString()
                  .split("T")?.[0]
                  .split("-")
                  .reverse()
                  .join(".")}
              </span>
            </small>
            <small>
                Local de entrega:
              <span>
                ${store?.address}
              </span>
            </small>
            <small>
                Date de emissão:
              <span>
                ${invoice?.createdAt
                  .toString()
                  .split("T")?.[0]
                  .split("-")
                  .reverse()
                  .join(".")}
              </span>
            </small>
            <small style="margin-top: 1rem;">
                Contribuente:
              <span>
                ${invoice?.sale.client?.nif}
              </span>
            </small>
              <small>
                Vencimento:
              <span>
                ${invoice?.dueDate
                  .toString()
                  .split("T")?.[0]
                  .split("-")
                  .reverse()
                  .join(".")}
              </span>
            </small>
          </div>
        </div>
        <div>
          <span>
            Exmo.(s) Sr(s)
          </span>
          <span>
            <strong>${invoice?.sale.client?.fullName}</strong>
          </span>
          <span>
            ${invoice?.sale.client?.address}
          </span>
        </div>
      </div>
    </header>
  `,
  };

  const qrcodeURL =
    Platform.OS === "web"
      ? await qrcode?.toDataURL?.(invoice?.id ?? "preview")
      : undefined;

  const footer = {
    styles: `
    .footer{
      display: flex;
      flex-direction: column;
    }
   .footer small{
      display: flex;
      justify-content: center;
      font-size: 7pt;
   }
      .footer-grid{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 200px;
        grid-template-rows: 1fr 70px;
        margin-bottom: 1rem;
        border: solid 1px #ddd;
      }
      .footer-grid div{
       padding: .5rem;
      }
       .footer-company-qrcode{
        height: 5rem;
        width: 5rem;
       }
    `,
    content: `
    <footer class="footer">
    <div class="footer-grid">
     <div style="display: grid;grid-template-columns: 1fr 1fr 1fr 200px;padding: 0;grid-column-start: 1;grid-column-end: 5;display: flex;flex-direction:row;border-bottom: solid 1px #ddd;"> 
     <div style="flex:1">
     ola mundo
     </div>
     <div style="width: 200px;padding: 0;border-left: solid 1px #ddd;">
         <div style="display: flex; justify-content: start; align-items: center; border-bottom: solid 1px #ddd;">
        <strong style="font-weight: bold;margin-right: .5rem;">ILIQUIDO:</strong>
        <label>${formatMoney(totalAmountForTransport ?? 0)}</label>
      </div>
      <div style="display: flex; justify-content: start; align-items: center; border-bottom: solid 1px #ddd;">
        <strong style="font-weight: bold;margin-right: .5rem;">RETENSÃO:</strong>
        <label>${formatMoney(
          ((totalAmountForTransport ?? 0) * (invoice?.retention ?? 0)) / 100
        )}</label>
      </div>
      <div style="display: flex; justify-content: start; align-items: center; border-bottom: solid 1px #ddd;">
        <strong style="font-weight: bold;margin-right: .5rem;">DESCONTO:</strong>
        <label>${formatMoney(totalChargersTransport ?? 0)}</label>
      </div>
      <div style="display: flex; justify-content: start; align-items: center; border-bottom: solid 1px #ddd;">
        <strong style="font-weight: bold;margin-right: .5rem;">INCIDÊNCIA:</strong>
        <label>${formatMoney(totalChargersTransport ?? 0)}</label>
      </div>
       <div style="display: flex; justify-content: start; align-items: center;">
        <strong style="font-weight: bold;margin-right: .5rem;">${
          options?.currentPage === (options?.pageNumber ?? 0) - 1
            ? "TOTAL A PAGAR:"
            : "TRANSPORTA:"
        }</strong>
        <label>${formatMoney(
          (totalAmountForTransport + totalChargersTransport ?? 0) -
            ((totalAmountForTransport ?? 0) * (invoice?.retention ?? 0)) / 100
        )}</label>
      </div>
     </div>
     </div>
      <div style="border-right: solid 1px #ccc;grid-column-start: 1;grid-column-end: 4;">
        Assinatura:
      </div>
       <div style="display: flex; justify-content: center; align-items: center;">
          <img class="footer-company-qrcode" src="${qrcodeURL}" alt="qrcode"/>
        </div>
    </div>
      <small style="margin-bottom: 2rem;">
        Kulanda - processado por programa valido, SAP n.o XXX/AGT/2024
      </small>
    </footer>
  `,
  };

  return `
        <style>
          ${header.styles}
          ${footer.styles}
          </style>
        <div class="container">
          ${header.content}
          <main class="content">
            ${content}
          </main>
           ${footer.content}
        </div>`;
}

export async function generateHTML(
  company?: CompanyType,
  invoice?: InvoiceType,
  store?: StoreType,
  type?: DocType
) {
  const limitForTransport = 2;

  const { products, services } = prepareOrders(invoice?.sale?.orders ?? []);

  const _prod = Object.keys(products).map((key) => {
    const product = products[key];

    return `
    <tr>
      <th>
        ${product.extra.id}
      </th>
    <tr>
    `;
  });

  const _serv = Object.keys(services).map((key) => {
    const service = services[key];

    return `
    <tr>
      <td>
         ${service?.extra.code}
      </td>
      <td>
        ${service?.extra.name}
      </td>
      <td>
        ${formatMoney(service?.extra.price)}
      </td>
      <td>
        ${service?.qtd} UN
      </td>
      <td>
        ${service?.totalChargers} %
      </td>
      <td>
        ${service?.charges} %
      </td>
      <td>
        ${formatMoney(service?.total)}
      </td>
    <tr>
    `;
  });

  const all = _serv.concat(_prod);

  const pages = [];

  const totalPages = parseInt(
    Number(Object.keys(all).length / limitForTransport).toFixed(0)
  );

  for (let index = 0; index < totalPages; index++) {
    const startIndex = index * limitForTransport;
    const endIndex = index * limitForTransport + limitForTransport;
    const pg = await page(
      type ?? "invoice",
      company,
      invoice,
      `
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Preço Uni.</th>
            <th>Qtd.</th>
            <th>Taxa/IVA</th>
            <th>Desc.</th>
            <th>Total Ilíquido.</th>
          </tr>
        </thead>
        <tbody>
          ${_prod.slice(startIndex, endIndex).join("")}
          ${_serv.slice(startIndex, endIndex).join("")}
        </tbody>
        ${
          invoice?.observation
            ? `<tfoot>
          <tr>
            <td style="padding-top: 4rem;color: #4e4e4e;" colspan="7">${invoice?.observation}</td>
          </tr>
        </tfoot>`
            : ""
        }
      </table>
      `,
      store,
      {
        startIndex,
        endIndex,
        currentPage: index,
        pageNumber: totalPages,
      }
    );

    pages.push(pg);
  }

  return `<!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=${
              Platform.OS === "web" ? "1" : "0.5"
            }">
            <link href="https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
            <style>
            *{
              font-size: 10px;
               font-family: 'Tinos', serif !important;
                font-weight: 400;
                font-style: normal;
            }
            body{
              display: flex;
              flex-direction: column;
              margin: 0;
              justify-content: center;
              align-items: center; 
              background-color: #fff;
            }
            .container{
              display:flex;
              flex-direction: column;
              flex: 1;
              height: 1123px;
               width: 90%;
            }
              .content{
                display: flex;
                flex-direction: column;
                height: 550px;
              }
              th, td{
                text-align: start;
                padding: 1rem 0;
              }
              th{
                font-weight: 700;
                border-bottom: 1px solid #ddd;
              }
              .separator {
                height: 1rem;
                background: #f9fafb;
                width: 100%;
              }
              @media print {
                .no-print {
                  display: none;
                }
              }
          </style>
        </head>
        <body>
         <span class="no-print separator"></span>
        ${pages.join(`<span class="no-print separator"></span>`)}
        </html>`;
}
