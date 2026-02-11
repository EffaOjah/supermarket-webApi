const viewSaleDetailsBtn = document.querySelectorAll(".view-sale-details-btn");

const bName = document.getElementById('bName').innerHTML;

async function viewSaleInvoice(saleId) {
  const invoiceHolder = document.getElementById("invoiceHolder");

  invoiceHolder.innerHTML = "";

  const response = await fetch(`/sale-details/${saleId}`);

  let saleDetails = await response.json();

  saleDetails = saleDetails.saleDetails;
  console.log(saleDetails);

  let theBranchName = bName;

  if (theBranchName == 'CALABAR SOUTH') {
    document.getElementById('branch').innerHTML = 'MARYBILL MABILCO VENTURES';
  } else if (theBranchName == 'TINAPA') {
    document.getElementById('branch').innerHTML = 'MABILCO ENTERPRISE';
  } else {
    document.getElementById('branch').innerHTML = `MaryBill Conglomerate | ${theBranchName}`;
  }

  document.getElementById('customer').innerHTML = saleDetails[0].customer_name;
  document.getElementById('paymentMethod').innerHTML = saleDetails[0].payment_method;
  document.getElementById('saleDate').innerHTML = new Date(saleDetails[0].sale_date).toLocaleString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

  const newDiv = document.createElement("div");
  newDiv.innerHTML = `
  <table id="saleDetailTable" class="table table-bordered invoice-details">
                      <thead>
                <tr>
                    <th>S/N</th>
                    <th>ITEMS</th>
                    <th>PURCHASE TYPE</th>
                    <th>QUANTITY</th>
                    <th>PRICE PER QUANTITY</th>
                    <th>PRICE</th>
                    <th>DISCOUNT RATE</th>
                    <th>DISCOUNT VALUE</th>
                    <th>NET PAY</th>
                </tr>
            </thead>
            <tbody>
                ${saleDetails.map((sale, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${sale.product_name}</td>
                        <td>${sale.sale_type}</td>
                        <td>${sale.quantity}</td>
                        <td>₦${sale.unit_price}</td>
                        <td>₦${sale.quantity * sale.unit_price}</td>
                        <td>${sale.discount}%</td>
                        <td>₦${((sale.discount / 100) * (sale.quantity * sale.unit_price)).toFixed(2)}</td>
                        <td>₦${(sale.quantity * sale.unit_price) - (sale.discount / 100 * (sale.quantity * sale.unit_price))}</td>
                    </tr>`).join("")}
            </tbody>
          </table>
          
          <p class="fs-6 text-end">Total: ₦${saleDetails[0].total_amount}</p>`;

  invoiceHolder.appendChild(newDiv);
}

for (let i = 0; i < viewSaleDetailsBtn.length; i++) {
  viewSaleDetailsBtn[i].addEventListener("click", (e) => {
    viewSaleInvoice(e.target.id);
  });

}


// Handle printing of invoice
document.getElementById("printBtn").addEventListener("click", function () {
  const printContents = document.getElementById("invoiceModal").innerHTML;
  const win = window.open("", "", "height=700,width=900");

  win.document.write(`
		<html>
			<head>
				<title>Invoice</title>
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
				<style>
					body { padding: 20px; }
					.invoice-box {
    background: #fff;
    padding: 40px;
    border-radius: 10px;
    max-width: 800px;
    margin: auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    font-size: 14px;
}

.invoice-header {
    border-bottom: 3px solid #007b8e;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.invoice-title {
    font-size: 30px;
    font-weight: bold;
    color: #007b8e;
}

.invoice-details th {
    background: #f1f1f1;
}

.invoice-footer {
    background: #dfefff;
    padding: 10px;
    text-align: center;
    font-size: 12px;
    color: #555;
    border-top: 1px solid #ccc;
}
.invoice-print-btn {
    background-color: #007b8e !important;
    color: white;
}
.view-invoice-span {
    cursor: pointer;
    background-color: #6C7293 !important;
}
				</style>
			</head>
			<body onload="window.print(); window.close();">
				${printContents}
			</body>
		</html>
	`);
  win.document.close();
});
