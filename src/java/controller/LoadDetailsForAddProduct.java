package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Brand;
import entity.Category;
import entity.Color;
import entity.Model;
import entity.ProductCondition;
import entity.ProductStatus;
import entity.Size;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;

@WebServlet(name = "LoadDetailsForAddProduct", urlPatterns = {"/LoadDetailsForAddProduct"})
public class LoadDetailsForAddProduct extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);

        Session session = HibernateUtil.getSessionFactory().openSession();

        //get models
        Criteria criteria1 = session.createCriteria(Model.class);
        List<Model> modelList = criteria1.list();

        //get brands
        Criteria criteria2 = session.createCriteria(Brand.class);
        List<Brand> brandList = criteria2.list();

        //get conditions
        Criteria criteria3 = session.createCriteria(ProductCondition.class);
        List<ProductCondition> conditionsList = criteria3.list();

        //get status
        Criteria criteria4 = session.createCriteria(ProductStatus.class);
        List<ProductStatus> statusList = criteria4.list();

        //get category
        Criteria criteria5 = session.createCriteria(Category.class);
        List<Category> categoryList = criteria5.list();

        //get color
        Criteria criteria6 = session.createCriteria(Color.class);
        List<Color> colorList = criteria6.list();

        //get size
        Criteria criteria7 = session.createCriteria(Size.class);
        List<Size> sizeList = criteria7.list();

        responseJson.add("modelList", gson.toJsonTree(modelList));
        responseJson.add("brandList", gson.toJsonTree(brandList));
        responseJson.add("conditionList", gson.toJsonTree(conditionsList));
        responseJson.add("statusList", gson.toJsonTree(statusList));
        responseJson.add("categoryList", gson.toJsonTree(categoryList));
        responseJson.add("colorList", gson.toJsonTree(colorList));
        responseJson.add("sizeList", gson.toJsonTree(sizeList));
        responseJson.addProperty("success", true);

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(responseJson));
    }
}
