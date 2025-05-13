import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import Dashboard from "../views/DashboardView.vue";
import Main from "../views/MainView.vue";
import NewGame from "../views/NewGameView.vue";
import Tetris from "../views/TetrisView.vue";
import ProfileView from "../views/ProfileView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login", // Перенаправление с корня на регистрацию
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/menu",
    name: "menu",
    component: Main,
  },
  {
    path: "/game",
    name: "game",
    component: NewGame,
  },
  {
    path: "/tetris",
    name: "tetris",
    component: Tetris,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
