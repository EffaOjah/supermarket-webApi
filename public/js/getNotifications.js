var notifications = [];
var branchId = document.getElementById('branchId').innerHTML.trim();

const notificationCount = document.querySelectorAll('.notification-count');

const notificationTitle = document.querySelectorAll('.notification-title');

const notificationCenter = document.querySelectorAll('.notif-center');

const notificationIndicator = document.querySelectorAll('.n-indicator');

document.addEventListener('DOMContentLoaded', getLowProductsCount)

// Function to get the number of low level stock
async function getLowProductsCount() {
  try {
    // Fetch the products count
    const response = await fetch(`/low-stock-count/${branchId}`);
    if (!response.ok) {
      throw new Error("Error getting the low products count");
    }

    const fetchLowProductsCount = await response.json();
    console.log(fetchLowProductsCount);


    notificationCount.forEach(nCount => nCount.innerHTML = fetchLowProductsCount.products[0].low_stock_count < 1 ? nCount.classList.add('d-none') : 1);
    notificationTitle.forEach(nTitle => nTitle.innerHTML = `You have ${fetchLowProductsCount.products[0].low_stock_count < 1 ? 0 : 1} notification`);

    notificationIndicator.forEach(nIndicator => {
      if (fetchLowProductsCount.products[0].low_stock_count > 0) {
        nIndicator.classList.add('notify')
      }
    });

    if (fetchLowProductsCount.products[0].low_stock_count < 1) {
      notificationCenter.forEach(nCenter => nCenter.innerHTML = `
        
        `);
      return;
    }
    notificationCenter.forEach(nCenter => nCenter.innerHTML += `
          <a href="/branch/${branchId}/notifications" class="notification-item">
											<div class="notif-icon notif-success"> <i class="la la-comment"></i> </div>
											<div class="notif-content">
												<span class="block mt-2">
													${fetchLowProductsCount.products[0].low_stock_count} products stock level is low
												</span>
											</div>
					</a>
      `);

    // Show the notification
    if (Notification.permission === "granted") {
      // Permission already granted
      showNotification(`${fetchLowProductsCount.products[0].low_stock_count} products stock level is low`);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showNotification();
        }
      });
    }

  } catch (error) {
    console.error(error);
  }
}


// Function to get low level stock
async function getLowLevelStock() {
  try {
    // Fetch the wholesale products
    const fetchWholesaleProducts = fetch(`/get-low-wholesale-stock/${branchId}`);

    // Fetch the retail products
    const fetchRetailProducts = fetch(`/get-low-retail-stock/${branchId}`);

    let [wholesaleProducts, retailProducts] = await Promise.all([fetchWholesaleProducts, fetchRetailProducts]);

    if (!wholesaleProducts.ok || !retailProducts.ok) {
      throw new Error("Error fetching products");
    }

    wholesaleProducts = await wholesaleProducts.json();
    retailProducts = await retailProducts.json();

    // Push into the notification list
    notifications.push(...wholesaleProducts.products, ...retailProducts.products);

    console.log('Notifications: ', notifications);
    notificationCount.forEach(nCount => nCount.innerHTML = notifications.length);
    notificationTitle.forEach(nTitle => nTitle.innerHTML = `You have ${notifications.length} notifications`);

    notifications.forEach(notification => {
      notificationCenter.forEach(nCenter => nCenter.innerHTML += `
          <a href="#">
											<div class="notif-icon notif-success"> <i class="la la-comment"></i> </div>
											<div class="notif-content">
												<span class="block">
													${notification.stock_quantity_wholesale ? 'Wholesale' : 'Retail'} stock level for <span class="fw-bold">${notification.product_name}</span> is low
												</span>
												<span class="time">12 minutes ago</span>
											</div>
					</a>
      `);
    });
  } catch (error) {
    console.log(error);
  }
}

// Show notification
function showNotification(body) {
  const notification = new Notification("Hello!", {
    body: body,
    icon: "/img/app_icon.ico", // Optional
  });

  // Optional: Add click event
  notification.onclick = () => {
    window.focus();
    console.log("Notification clicked!");
  };
}
