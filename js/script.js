/* ===== K'Bookstore – script.js ===== */
$(document).ready(function () {

  /* ──────────────────────────────────────────
     1. SMOOTH SCROLL + ACTIVE NAV HIGHLIGHT
  ────────────────────────────────────────── */
  $('a.nav-link-custom[href^="#"]').on('click', function (e) {
    e.preventDefault();
    var target = $(this).attr('href');
    if ($(target).length) {
      $('html, body').animate({ scrollTop: $(target).offset().top - 66 }, 600, 'swing');
      // close mobile menu
      if ($('.navbar-collapse').hasClass('in')) {
        $('.navbar-collapse').collapse('hide');
      }
    }
  });

  // Highlight active menu on scroll (scrollspy handled by Bootstrap data-spy,
  // but we also manually add class for nav-link-custom)
  $(window).on('scroll', function () {
    var scrollPos = $(document).scrollTop() + 80;
    $('section[id]').each(function () {
      var sectionTop = $(this).offset().top;
      var sectionBottom = sectionTop + $(this).outerHeight();
      var id = $(this).attr('id');
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        $('a.nav-link-custom').parent().removeClass('active');
        $('a.nav-link-custom[href="#' + id + '"]').parent().addClass('active');
      }
    });
  });

  /* ──────────────────────────────────────────
     2. CONTACT FORM VALIDATION
  ────────────────────────────────────────── */
  $('#contactSubmit').on('click', function () {
    var valid = true;

    // Clear errors
    $('.error-msg').text('');
    $('#contactForm .form-group').removeClass('has-error');

    var name    = $.trim($('#c-name').val());
    var email   = $.trim($('#c-email').val());
    var message = $.trim($('#c-message').val());

    // Name: không chứa ký tự số
    if (!name) {
      showError('err-c-name', 'c-name', 'Vui lòng nhập họ tên.');
      valid = false;
    } else if (/\d/.test(name)) {
      showError('err-c-name', 'c-name', 'Họ tên không được chứa ký tự số.');
      valid = false;
    }

    // Email: bắt buộc
    if (!email) {
      showError('err-c-email', 'c-email', 'Vui lòng nhập email.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('err-c-email', 'c-email', 'Email không hợp lệ.');
      valid = false;
    }

    // Nội dung: tối thiểu 20 ký tự
    if (!message) {
      showError('err-c-message', 'c-message', 'Vui lòng nhập nội dung.');
      valid = false;
    } else if (message.length < 20) {
      showError('err-c-message', 'c-message', 'Nội dung phải có ít nhất 20 ký tự (hiện tại: ' + message.length + ').');
      valid = false;
    }

    if (valid) {
      showToast('✓ Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ sớm.');
      $('#contactForm')[0].reset();
    }
  });

  /* ──────────────────────────────────────────
     3. PRICING MODAL: auto-check plan
  ────────────────────────────────────────── */
  $('[data-toggle="modal"][data-target="#registerModal"]').on('click', function () {
    var plan = $(this).data('plan');
    // Uncheck all first
    $('input[name="plan"]').prop('checked', false);
    // Check the matching one
    $('input[name="plan"][value="' + plan + '"]').prop('checked', true);
  });

  /* ──────────────────────────────────────────
     4. MODAL FORM VALIDATION
  ────────────────────────────────────────── */
  $('#modalSubmit').on('click', function () {
    var valid = true;

    // Clear errors
    $('#err-m-name, #err-m-phone, #err-m-email, #err-m-plan').text('');
    $('#modalForm .form-group').removeClass('has-error');

    var name  = $.trim($('#m-name').val());
    var phone = $.trim($('#m-phone').val());
    var email = $.trim($('#m-email').val());
    var plans = $('input[name="plan"]:checked');

    if (!name) {
      showModalError('err-m-name', 'm-name', 'Vui lòng nhập họ tên.');
      valid = false;
    }

    if (!phone) {
      showModalError('err-m-phone', 'm-phone', 'Vui lòng nhập số điện thoại.');
      valid = false;
    }

    if (!email) {
      showModalError('err-m-email', 'm-email', 'Vui lòng nhập email.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showModalError('err-m-email', 'm-email', 'Email không đúng định dạng.');
      valid = false;
    }

    if (plans.length === 0) {
      $('#err-m-plan').text('Vui lòng chọn ít nhất 1 gói dịch vụ.');
      valid = false;
    }

    if (valid) {
      $('#registerModal').modal('hide');
      showToast('✓ Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.');
      $('#modalForm')[0].reset();
    }
  });

  /* ──────────────────────────────────────────
     5. HELPERS
  ────────────────────────────────────────── */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(errId, fieldId, msg) {
    $('#' + errId).text(msg);
    $('#' + fieldId).closest('.form-group').addClass('has-error');
  }

  function showModalError(errId, fieldId, msg) {
    $('#' + errId).text(msg);
    $('#' + fieldId).closest('.form-group').addClass('has-error');
  }

}); // end document.ready

/* ──────────────────────────────────────────
   6. SHOPPING CART (global functions)
────────────────────────────────────────── */
var cart = [];
var prices = {
  'Nhà Giả Kim': 89000,
  'Đắc Nhân Tâm': 75000,
  'Sapiens': 120000,
  'Atomic Habits': 95000
};

function addToCart(title) {
  var existing = cart.find(function (i) { return i.name === title; });
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name: title, qty: 1, price: prices[title] || 0 });
  }
  renderCart();
  showToast('✓ Đã thêm "' + title + '" vào giỏ hàng!');
  return false;
}

function renderCart() {
  var total = 0;
  var html = '';
  cart.forEach(function (item) {
    total += item.price * item.qty;
    html += '<li><span>' + item.name + ' x' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + '</span></li>';
  });
  $('#cartList').html(html || '<li style="color:#999;text-align:center;padding:12px">Giỏ hàng trống</li>');
  $('#cartTotal').text(formatPrice(total));
  $('#cartCount').text(cart.length);
  $('#cartBadge').text(cart.length);
}

function toggleCart() {
  var w = $('#cartWidget');
  if (w.is(':visible')) {
    w.hide();
  } else {
    renderCart();
    w.show();
  }
}

function formatPrice(n) {
  return n.toLocaleString('vi-VN');
}

function showToast(msg) {
  var t = $('#toast');
  t.text(msg).show();
  setTimeout(function () { t.hide(); }, 3000);
}
