const tempPriceMap = {
    "Nhà Giả Kim": 89000,
    "Tôi thấy hoa vàng trên cỏ xanh": 72000,
    "Mắt biếc": 68000,
    "Số đỏ": 55000,
    "Chiến tranh và hòa bình": 150000,
    "Dế Mèn phiêu lưu ký": 45000,
    "Harry Potter": 1490000,
    "The Great Gatsby": 120000,
    "1984": 150000,
    "Atomic Habits": 200000,
    "Nhà đầu tư thông minh": 120000,
    "Dạy con làm giàu": 95000,
    "Từ tốt đến vĩ đại": 135000,
    "7 thói quen hiệu quả": 110000,
    "Khởi nghiệp tinh gọn": 130000,
    "Đắc Nhân Tâm": 75000,
    "Chú mèo đi hia": 30000,
    "Truyện cổ Grim": 55000,
    "Nghìn lẻ một đêm": 65000,
    "Bộ sách tô màu": 40000,
    "Le Petit Prince": 85000,
    "Norwegian Wood": 110000,
    "The Alchemist": 89000,
    "Ikigai": 105000,
    "Vũ trụ trong vỏ hạt dẻ": 125000,
    "Trí tuệ nhân tạo": 150000,
    "Khoa học dữ liệu": 130000,
    "Blockchain": 110000,
    "Lược sử loài người": 160000,
    "Lược sử thời gian": 115000,
    "Đàn ông sao Hỏa, đàn bà sao Kim": 78000,
    "Đàn ông sao Hỏa...": 78000,
    "Nghệ thuật sống": 55000,
    "Không sinh không diệt đừng sợ hãi": 65000,
    "Không sinh không diệt...": 65000,
    "Khéo ăn khéo nói sẽ có được thiên hạ": 102000,
    "Khéo ăn khéo nói...": 102000,
    "Sức mạnh của thói quen": 95000,
    "default": 100000 
};

let cart = JSON.parse(localStorage.getItem('kbook_cart')) || [];

function updateNavCartCount() {
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('.navCartCountBadge').text(count);
}

function addToCart(name) {
    let price = tempPriceMap[name] || tempPriceMap["default"];
    let existingItem = cart.find(item => item.name === name);
    
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({name: name, price: price, quantity: 1});
    }
    
    localStorage.setItem('kbook_cart', JSON.stringify(cart));
    updateNavCartCount();

    let toast = $('#toast');
    if(toast.length) {
        toast.text('Đã thêm "' + name + '" vào giỏ hàng!').fadeIn().delay(2000).fadeOut();
    } else {
        alert('Đã thêm "' + name + '" vào giỏ hàng!');
    }
}

function renderCartPage() {
    if($('#cartTableBody').length === 0) return;

    let tbody = $('#cartTableBody');
    tbody.empty();
    let total = 0;

    if(cart.length === 0) {
        tbody.append('<tr><td colspan="5" class="text-center" style="padding: 30px;">Giỏ hàng của bạn đang trống.</td></tr>');
    } else {
        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;
            tbody.append(`
                <tr>
                    <td style="font-weight: 500; color: #2980b9;">${item.name}</td>
                    <td>${item.price.toLocaleString('vi-VN')} ₫</td>
                    <td>
                        <input type="number" value="${item.quantity}" min="1" class="form-control input-sm" style="width:70px" onchange="updateQuantity(${index}, this.value)">
                    </td>
                    <td style="font-weight: bold;">${itemTotal.toLocaleString('vi-VN')} ₫</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})" title="Xóa">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
    
    $('#cartSubTotal').text(total.toLocaleString('vi-VN') + ' ₫');
    $('#cartTotalPrice').text(total.toLocaleString('vi-VN') + ' ₫');
}

function updateQuantity(index, val) {
    let newQuantity = parseInt(val);
    if(newQuantity >= 1) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('kbook_cart', JSON.stringify(cart));
        updateNavCartCount();
        renderCartPage();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('kbook_cart', JSON.stringify(cart));
    updateNavCartCount();
    renderCartPage();
}

$(document).ready(function() {
    let path = window.location.pathname;
    let baseUrl = "";
    
    if (path.includes("/chitiet/")) {
        baseUrl = "../../";
    } else if (path.includes("/theloai/")) {
        baseUrl = "../";
    }
    
    let navPlaceholder = $('#navbar-placeholder');
    if (navPlaceholder.length) {
        $.get(baseUrl + "navbar.html", function(data) {
            let finalNavHtml = data.replace(/\{\{base_url\}\}/g, baseUrl);
            navPlaceholder.html(finalNavHtml);
            updateNavCartCount();
        });
    } else {
        updateNavCartCount(); 
    }

    if(typeof renderCartPage === "function") {
       renderCartPage(); 
    }
});