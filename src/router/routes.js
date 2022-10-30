const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", name: "home", component: () => import("pages/IndexPage.vue") },
      { path: "login", name: "login", component: () => import("pages/LoginPage.vue") },
      { path: "bet", name: "bet", component: () => import("pages/BetPage.vue") },
      { path: "betlist", name: "betlist", component: () => import("pages/BetList.vue") },
      { path: "addresults", name: "addresults", component: () => import("pages/AddResults.vue") }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue")
  }
];

export default routes;
