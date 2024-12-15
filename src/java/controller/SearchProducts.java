package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Brand;
import entity.Category;
import entity.Color;
import entity.Model;
import entity.Product;
import entity.ProductCondition;
import entity.Size;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SearchProducts", urlPatterns = {"/SearchProducts"})
public class SearchProducts extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject responseJsonObject = new JsonObject();
        responseJsonObject.addProperty("success", false);

        //get request json
        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        Session session = HibernateUtil.getSessionFactory().openSession();

        //search all products
        Criteria criteria1 = session.createCriteria(Product.class);

        //category selected
        String categoryName = requestJsonObject.get("category").getAsString();

        if (!categoryName.equals("Sort by Category")) {

            //get category list from Db
            Criteria criteria2 = session.createCriteria(Category.class);
            criteria2.add(Restrictions.eq("name", categoryName));
            List<Category> categoryList = criteria2.list();

            //get models by category from DB
            Criteria criteria3 = session.createCriteria(Model.class);
            criteria3.add(Restrictions.in("category", categoryList));
            List<Model> modelList = criteria3.list();

            //filter products by model list from DB
            criteria1.add(Restrictions.in("model", modelList));
        }

        // model selected
        String modelName = requestJsonObject.get("model").getAsString();

        if (!modelName.equals("Sort by Model")) {

            //get model from Db
            Criteria criteria4 = session.createCriteria(Model.class);
            criteria4.add(Restrictions.eq("name", modelName));
            Model modelResult = (Model) criteria4.uniqueResult();

            //filter products by model from DB
            criteria1.add(Restrictions.eq("model", modelResult));

        }

        // brand selected
        String brandName = requestJsonObject.get("brand").getAsString();

        if (!brandName.equals("Sort by Brand")) {

            //get brand from Db
            Criteria criteria5 = session.createCriteria(Brand.class);
            criteria5.add(Restrictions.eq("name", brandName));
            Brand brandResult = (Brand) criteria5.uniqueResult();

            //filter products by brand from DB
            criteria1.add(Restrictions.eq("brand", brandResult));

        }

        // size selected
        String sizeName = requestJsonObject.get("size").getAsString();

        if (!sizeName.equals("Sort by Size")) {

            //get size from Db
            Criteria criteria6 = session.createCriteria(Size.class);
            criteria6.add(Restrictions.eq("value", sizeName));
            Size sizeResult = (Size) criteria6.uniqueResult();

            //filter products by size from DB
            criteria1.add(Restrictions.eq("size", sizeResult));

        }

        // color selected
        String colorName = requestJsonObject.get("color").getAsString();

        if (!colorName.equals("Sort by Color")) {

            //get color from Db
            Criteria criteria7 = session.createCriteria(Color.class);
            criteria7.add(Restrictions.eq("name", colorName));
            Color colorResult = (Color) criteria7.uniqueResult();

            //filter products by color from DB
            criteria1.add(Restrictions.eq("color", colorResult));

        }

        //text selected
        String searchText = requestJsonObject.get("searchText").getAsString();

        if (!searchText.isEmpty()) {
            //filter products by text from DB
            criteria1.add(Restrictions.like("title", searchText, MatchMode.ANYWHERE));
        }

        // Price range selected
        Double priceValue1 = requestJsonObject.get("priceValue1").getAsDouble();
        Double priceValue2 = requestJsonObject.get("priceValue2").getAsDouble();

        if (priceValue1 != 0 && priceValue2 != 5000 && priceValue1 < priceValue2) {
            // Filter products by price range
            criteria1.add(Restrictions.between("price", priceValue1, priceValue2));
        }

        //get all product count
        responseJsonObject.addProperty("allProductCount", criteria1.list().size());

        //set product range
        int firstResult = requestJsonObject.get("firstResult").getAsInt();
        criteria1.setFirstResult(firstResult);
        criteria1.setMaxResults(2);

        //get product list
        List<Product> productList = criteria1.list();
        System.out.println(productList.size());

        //get product list
        for (Product product : productList) {
            product.setUser(null);
        }

        responseJsonObject.addProperty("success", true);
        responseJsonObject.add("productList", gson.toJsonTree(productList));

        //send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJsonObject));

    }

}
