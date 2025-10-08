import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import History from "../views/HistoryView.vue";
import Main from "../views/MainView.vue";
import NewGame from "../views/NewGameView.vue";
import Tetris from "../views/TetrisView.vue";
import ProfileView from "../views/ProfileView.vue";
import AboutUsView from "../views/AboutUsView.vue";
import ControlsView from "../views/ControlsView.vue";
import AdminView from "@/views/AdminView.vue";
import AboutSystemView from "@/views/AboutSystemView.vue";

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
    path: "/history",
    name: "history",
    component: History,
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
  {
    path: "/aboutus",
    name: "aboutus",
    component: AboutUsView,
  },
  {
    path: "/aboutsystem",
    name: "aboutsystem",
    component: AboutSystemView,
  },
  {
    path: "/controls",
    name: "controls",
    component: ControlsView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
