var branchId = document.getElementById('branchId').innerHTML;

document.addEventListener('DOMContentLoaded', async () => {
    // Get today's date
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timeStamp = `${year}-${month}-${day}`;
    console.log('Date: ', timeStamp);

    // Get the analysis for today(Wholesale and Retail)
    // Send the request to fetch the sales record
    fetch(`/admin/fetch-today-records?date=${timeStamp}&branchId=${branchId.trim()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
        .then(data => {
            const wholesaleAnalysisForToday = data.wholesaleAnalysis;
            const retailAnalysisForToday = data.retailAnalysis;

            console.log(wholesaleAnalysisForToday);
            console.log(retailAnalysisForToday);

            // Update the html
            document.getElementById('wholesaleAmountToday').innerHTML = wholesaleAnalysisForToday[0].total ? (wholesaleAnalysisForToday[0].total).toLocaleString('en-US') : '0,00';
            document.getElementById('retailAmountToday').innerHTML = retailAnalysisForToday[0].total ? (retailAnalysisForToday[0].total).toLocaleString('en-US') : '0,00';
        })
        .catch(err => {
            console.log('Error sending request');
            alert('Error fetching analysis');
        });
});