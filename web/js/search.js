var modelList;
async function loadDetailsForAddProduct() {

    searchProducts(0);

    const response = await fetch("LoadDetailsForAddProduct");

    if (response.ok) {

        const json = await response.json();

        const categoryList = json.categoryList;
        modelList = json.modelList;
        const brandList = json.brandList;
        const sizeList = json.sizeList;
        const colorList = json.colorList;

        loadSelectors("select-category", categoryList, ["id", "name"]);
        loadSelectors("select-model", modelList, ["id", "name"]);
        loadSelectors("select-brand", brandList, ["id", "name"]);
        loadSelectors("select-size", sizeList, ["id", "value"]);
        loadSelectors("select-color", colorList, ["id", "name"]);

    } else {
        console.log("Server Error");
    }
}

function loadSelectors(selector, dataList, properties) {

    let selectTag = document.getElementById(selector);

    dataList.forEach(data => {
        const option = document.createElement("option");
        option.innerHTML = data[properties[1]];
        option.value = data[properties[0]];
        selectTag.appendChild(option);
    });
}

function updateModels() {

    let modelSelectTag = document.getElementById("select-model");
    modelSelectTag.length = 1;
    let selectedCategoryId = document.getElementById("select-category").value;
    modelList.forEach(model => {
        if (model.category.id == selectedCategoryId) {
            let optionTag = document.createElement("option");
            optionTag.value = model.id;
            optionTag.innerHTML = model.name;
            modelSelectTag.appendChild(optionTag);
        }
    });
}

async function searchProducts(firstResult) {

    let categorySelect = document.getElementById('select-category');
    let category = categorySelect.options[categorySelect.selectedIndex].text;

    let brandSelect = document.getElementById('select-brand');
    let brand = brandSelect.options[brandSelect.selectedIndex].text;

    let modelSelect = document.getElementById('select-model');
    let model = modelSelect.options[modelSelect.selectedIndex].text;

    let sizeSelect = document.getElementById('select-size');
    let size = sizeSelect.options[sizeSelect.selectedIndex].text;

    let colorSelect = document.getElementById('select-color');
    let color = colorSelect.options[colorSelect.selectedIndex].text;

    let searchText = document.getElementById('search-text').value;
    let priceValue1 = document.getElementById('price-value1').value;
    let priceValue2 = document.getElementById('price-value2').value;

    const data = {
        firstResult: firstResult,
        category: category,
        brand: brand,
        model: model,
        size: size,
        color: color,
        searchText: searchText,
        priceValue1: priceValue1,
        priceValue2: priceValue2
    };

    const response = await fetch("SearchProducts", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const json = await response.json();
        console.log(json);
        updateProductView(json);
        //currentPage = 0;
    } else {
        alert("Try again later");
    }
}

var st_product = document.getElementById("st-product");
var st_pagination_button = document.getElementById("st-pagination-button");

var currentPage = 0;

function updateProductView(json) {

    let st_product_container = document.getElementById("st-product-container");

    st_product_container.innerHTML = "";

    json.productList.forEach(product => {
        let st_product_clone = st_product.cloneNode(true);

        //update cards
        st_product_clone.querySelector("#st-product-a-1").href = "product-details.html?pid=" + product.id;
        st_product_clone.querySelector("#st-product-img-1").src = "product-images/" + product.id + "/image1.png";
        st_product_clone.querySelector("#st-product-title-1").innerHTML = product.title;
        st_product_clone.querySelector("#st-product-price-1").innerHTML = "Rs. " + new Intl.NumberFormat(
                "en-US",
                {
                    minimumFractionDigits: 2
                }
        ).format(product.price);

        st_product_container.appendChild(st_product_clone);

    });

    //start pagination
    let st_pagination_container = document.getElementById("st-pagination-container");
    st_pagination_container.innerHTML = "";

    let product_count = json.allProductCount;
    const product_per_page = 2;

    let pages = Math.ceil(product_count / product_per_page);

    //add previous button
    if (currentPage != 0) {
        let st_pagination_button_clone_prev = st_pagination_button.cloneNode(true);
        st_pagination_button_clone_prev.innerHTML = "<a class='prev-arrow'><i class='fa fa-long-arrow-left' aria-hidden='true'></i></a>";

        st_pagination_button_clone_prev.addEventListener("click", e => {
            currentPage--;
            searchProducts(currentPage * 2);
        });

        st_pagination_container.appendChild(st_pagination_button_clone_prev);
    }

    //add page buttons
    for (let i = 0; i < pages; i++) {
        let st_pagination_button_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_clone.innerHTML = i + 1;

        st_pagination_button_clone.addEventListener("click", e => {
            currentPage = i;
            searchProducts(i * 2);
        });

        if (i === currentPage) {
            st_pagination_button_clone.className = "active";
        } else {
            st_pagination_button_clone.className = "";
        }

        st_pagination_container.appendChild(st_pagination_button_clone);
    }

    //add Next button
    if (currentPage != (pages - 1)) {
        let st_pagination_button_clone_next = st_pagination_button.cloneNode(true);
        st_pagination_button_clone_next.innerHTML = "<a class='next-arrow'><i class='fa fa-long-arrow-right' aria-hidden='true'></i></a>";

        st_pagination_button_clone_next.addEventListener("click", e => {
            currentPage++;
            searchProducts(currentPage * 2);
        });

        st_pagination_container.appendChild(st_pagination_button_clone_next);
    }

}