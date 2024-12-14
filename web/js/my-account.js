var modelList;
async function loadDetailsForAddProduct() {

    const response = await fetch("LoadDetailsForAddProduct");

    if (response.ok) {

        const json = await response.json();

        const categoryList = json.categoryList;
        modelList = json.modelList;
        const brandList = json.brandList;
        const conditionList = json.conditionList;
        const sizeList = json.sizeList;
        const colorList = json.colorList;
        const statusList = json.statusList;

        loadSelectors("select-category", categoryList, ["id", "name"]);
        loadSelectors("select-model", modelList, ["id", "name"]);
        loadSelectors("select-brand", brandList, ["id", "name"]);
        loadSelectors("select-condition", conditionList, ["id", "name"]);
        loadSelectors("select-size", sizeList, ["id", "value"]);
        loadSelectors("select-color", colorList, ["id", "name"]);
        loadSelectors("select-status", statusList, ["id", "name"]);
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

async function addProduct() {

    const modelTag = document.getElementById("select-model");
    const brandTag = document.getElementById("select-brand");
    const sizeTag = document.getElementById("select-size");
    const colorTag = document.getElementById("select-color");
    const conditionTag = document.getElementById("select-condition");
    const statusTag = document.getElementById("select-status");

    const titleTag = document.getElementById("title");
    const descriptionTag = document.getElementById("description");
    const priceTag = document.getElementById("price");
    const qtyTag = document.getElementById("qty");

    const image1Tag = document.getElementById("image1");
    const image2Tag = document.getElementById("image2");
    const image3Tag = document.getElementById("image3");

    const formData = new FormData();

    formData.append("model", modelTag.value);
    formData.append("brand", brandTag.value);
    formData.append("size", sizeTag.value);
    formData.append("color", colorTag.value);
    formData.append("condition", conditionTag.value);
    formData.append("status", statusTag.value);
    formData.append("title", titleTag.value);
    formData.append("description", descriptionTag.value);
    formData.append("price", priceTag.value);
    formData.append("qty", qtyTag.value);
    formData.append("image1", image1Tag.files[0]);
    formData.append("image2", image2Tag.files[0]);
    formData.append("image3", image3Tag.files[0]);


    const response = await fetch("AddProduct", {
        method: "POST",
        body: formData
    }
    );

    if (response.ok) {

        const json = await response.json();

        if (json.success) {

            alert("New Product Added.");

            titleTag.value = "";
            descriptionTag.value = "";
            priceTag.value = "";
            qtyTag.value = "";
            categoryTag.value = 0;
            modelTag.length = 1;
            brandTag.value = 0;
            sizeTag.value = 0;
            colorTag.value = 0;
            conditionTag.value = 0;
            statusTag.value = 0;
            image1Tag.value = null;
            image2Tag.value = null;
            image3Tag.value = null;

        } else {
            alert(json.message);
        }
    } else {
        console.log("Server Error.");
    }
}
