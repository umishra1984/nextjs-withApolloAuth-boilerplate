import Routes, * as nextRoutes from "next-routes";

// @ts-ignore
export const routes = nextRoutes() as Routes;
export const Router = routes.Router;
export const Link = routes.Link;

routes.add(
  "change-password",
  "/user/test/change-password/:id",
  "/user/test/change-password"
);

routes.add("confirm", "/user/confirm/:id", "/user/confirm");

routes.add(
  "update-channel",
  "/settings/channels/update/:id",
  "/settings/channels/update"
);

routes.add(
  "update-country",
  "/settings/countries/update/:id",
  "/settings/countries/update"
);

routes.add(
  "tax-categories",
  "/settings/tax-categories/update/:id",
  "/settings/tax-categories/update/"
);

routes.add(
  "tax-rates",
  "/settings/tax-rates/update/:id",
  "/settings/tax-rates/update/"
);

routes.add(
  "payment-methods",
  "/settings/payment-methods/update/:id",
  "/settings/payment-methods/update/"
);

routes.add(
  "shipping-methods",
  "/settings/shipping-methods/update/:id",
  "/settings/shipping-methods/update/"
);
