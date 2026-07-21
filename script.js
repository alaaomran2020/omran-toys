/* ==========================================================================
   متجر شركة عمران التجارية لألعاب الأطفال | Omran Toys Store
   ملف الجافا سكريبت التفاعلي والسريع (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // تشغيل كافة الوظائف التفاعلية فور تحميل الصفحة
  initQuantityButtons();
  initWishlistToggle();
  initCartCalculations();
  initAddToCartNotifications();
});

/* --------------------------------------------------------------------------
   1. التحكم في زيادة ونقصان كميات المنتجات (+ / -)
   -------------------------------------------------------------------------- */
function initQuantityButtons() {
  const qtyControls = document.querySelectorAll('.qty-control');

  qtyControls.forEach(container => {
    const minusBtn = container.querySelector('.btn-qty:first-child');
    const plusBtn = container.querySelector('.btn-qty:last-child');
    const input = container.querySelector('input');

    if (!minusBtn || !plusBtn || !input) return;

    // زر الإنقاص (-)
    minusBtn.addEventListener('click', function () {
      let currentVal = parseInt(input.value) || 1;
      if (currentVal > 1) {
        input.value = currentVal - 1;
        updateCartTotalsIfOnCartPage();
      }
    });

    // زر الزيادة (+)
    plusBtn.addEventListener('click', function () {
      let currentVal = parseInt(input.value) || 1;
      input.value = currentVal + 1;
      updateCartTotalsIfOnCartPage();
    });
  });
}

/* --------------------------------------------------------------------------
   2. حسابات سلة التسوق تلقائياً بالجنيه المصري (ج.م)
   -------------------------------------------------------------------------- */
function initCartCalculations() {
  const cartTable = document.querySelector('.cart-table');
  if (!cartTable) return; // الخروج إذا لم نكن في صفحة السلة

  // إمكانية حذف منتج من السلة عند الضغط على أيقونة سلة المهملات
  cartTable.addEventListener('click', function (e) {
    const deleteBtn = e.target.closest('.btn-link.text-danger');
    if (deleteBtn) {
      e.preventDefault();
      const row = deleteBtn.closest('tr');
      if (row) {
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        setTimeout(() => {
          row.remove();
          calculateCartTotals();
          showQuickToast('تم حذف المنتج من السلة');
        }, 300);
      }
    }
  });

  // حساب الإجمالي المبدئي عند تحميل الصفحة
  calculateCartTotals();
}

function updateCartTotalsIfOnCartPage() {
  if (document.querySelector('.cart-table')) {
    calculateCartTotals();
  }
}

// دالة حساب مجاميع الأسعار بالجنيه المصري
function calculateCartTotals() {
  const rows = document.querySelectorAll('.cart-table tbody tr');
  let grandTotal = 0;

  rows.forEach(row => {
    const priceText = row.querySelector('td:nth-child(2)')?.textContent || '0';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    const qtyInput = row.querySelector('.qty-control input');
    const qty = parseInt(qtyInput?.value) || 1;

    const rowTotal = price * qty;
    const totalCell = row.querySelector('td:nth-child(4)');
    if (totalCell) {
      totalCell.textContent = rowTotal + ' ج.م';
    }

    grandTotal += rowTotal;
  });

  // تحديث خانات صندوق ملخص الطلب
  const subtotalElem = document.querySelector('.summary-item:nth-child(1) strong');
  const totalElem = document.querySelector('.summary-total span:last-child');

  if (subtotalElem) subtotalElem.textContent = grandTotal + ' ج.م';
  if (totalElem) totalElem.textContent = grandTotal + ' ج.م';
}

/* --------------------------------------------------------------------------
   3. تفاعل زر المفضلة (إضافة / إلغاء الإضافة)
   -------------------------------------------------------------------------- */
function initWishlistToggle() {
  const wishlistButtons = document.querySelectorAll('.btn-wishlist, .btn-outline-danger');

  wishlistButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const icon = this.querySelector('i');
      if (!icon) return;

      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-danger');
        showQuickToast('تمت الإضافة للمفضلة ❤️');
      } else {
        icon.classList.remove('fas', 'text-danger');
        icon.classList.add('far');
        showQuickToast('تم الإزالة من المفضلة');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. التنبيه السريع وتحديث عداد السلة عند إضافة منتج
   -------------------------------------------------------------------------- */
function initAddToCartNotifications() {
  const addButtons = document.querySelectorAll('.card-product .btn-primary-custom');

  addButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      // إشعار سريع للمستخدم
      showQuickToast('تم إضافة المنتج لسلة التسوق بنجاح! 🛒');

      // زيادة عداد السلة في الهيدر العلوي تلقائياً
      const cartBadge = document.querySelector('.main-header .badge');
      if (cartBadge) {
        let currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. دالة الإشعار التفاعلي الخفيف (Quick Toast Notification)
   -------------------------------------------------------------------------- */
function showQuickToast(message) {
  let toast = document.getElementById('custom-toast');

  // إنشاء العنصر إذا لم يكن موجوداً من قبل
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 25px;
      right: 25px;
      background-color: #12225B;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 50px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      z-index: 9999;
      font-size: 0.9rem;
      font-weight: 500;
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  // عرض الرسالة
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  // إخفاء الرسالة بعد 2.5 ثانية
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2500);
}
