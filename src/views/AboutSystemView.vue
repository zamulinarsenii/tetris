<template>
  <v-container class="mt-6 d-flex flex-column ga-2 align-center">
    <v-card class="card" id="list">
      <v-card-title> Приложение «Тетрис» </v-card-title>
      <v-card-text>
        <h3>Сведения о системе</h3>
        <p>
          Автоматизированная система «Тетрис» предназначена для создания уровня,
          и игры в тетрис.
        </p>
        <ul>
          <li>
            <a href="#about-system-1">Окно авторизации</a>
          </li>
          <li>
            <a href="#about-system-2">Главное меню</a>
          </li>
          <li>
            <a href="#about-system-3">Экран выбора уровня</a>
          </li>
          <li>
            <a href="#about-system-4">Игровой процесс</a>
          </li>
          <li>
            <a href="#about-system-5">Экран окончания игры</a>
          </li>
        </ul>
      </v-card-text>
    </v-card>
    <v-card class="card" id="about-system-1">
      <v-card-title>Окно авторизации</v-card-title>
      <v-card-text class="d-flex flex-column ga-2">
        <p>
          После запуска приложения открывается окно авторизации. В нем у
          пользователя имеется два варианта: зарегистрироваться в системе или
          войти в собственный профиль.
        </p>
        <img
          class="align-self-center w-50"
          :src="require('@/assets/about-system/1.png')"
          alt="Изменить"
        />
        <a href="#list">Назад</a>
      </v-card-text>
    </v-card>
    <v-card class="card" id="about-system-2">
      <v-card-title>Главное меню</v-card-title>
      <v-card-text class="d-flex flex-column ga-2">
        <p>
          После процесса авторизации перед пользователем открывается форма
          главного меню. Здесь пользователь может выбрать желаемый пункт меню:
          игра, управление, история, просмотр сведений об авторах, просмотр
          сведений о системе, а также выход из профиля.
        </p>
        <img
          class="align-self-center w-50"
          :src="require('@/assets/about-system/2.png')"
          alt="Изменить"
        />
        <a href="#list">Назад</a>
      </v-card-text>
    </v-card>
    <v-card class="card" id="about-system-3">
      <v-card-title>Экран выбора уровня</v-card-title>
      <v-card-text class="d-flex flex-column ga-2">
        <p>
          При выборе игры открывается форма выбора уровня. Пользователь имеет
          возможность выьрать любой из доступных уровней. После чего должен
          нажать кнопку "Новая игра" для запуска игры.
        </p>
        <img
          class="align-self-center w-50"
          :src="require('@/assets/about-system/3.png')"
          alt="Изменить"
        />
        <a href="#list">Назад</a>
      </v-card-text>
    </v-card>
    <v-card class="card" id="about-system-4">
      <v-card-title>Игровой процесс</v-card-title>
      <v-card-text class="d-flex flex-column ga-2">
        <p>
          Пользователь играет в тетрис. Набирает очки и повышает уровень
          сложности.
        </p>
        <img
          class="align-self-center w-50"
          :src="require('@/assets/about-system/4.png')"
          alt="Изменить"
        />
        <a href="#list">Назад</a>
      </v-card-text>
    </v-card>
    <v-card class="card" id="about-system-5">
      <v-card-title>Экран окончания игры</v-card-title>
      <v-card-text class="d-flex flex-column ga-2">
        <p>
          После завершения игры появляется экран окончания игры. Пользователь
          может начать новую игру или вернуться в главное меню.
        </p>
        <img
          class="align-self-center w-50"
          :src="require('@/assets/about-system/5.png')"
          alt="Изменить"
        />
        <a href="#list">Назад</a>
      </v-card-text>
    </v-card>
    <span class="align-self-start">2025 г. Самарский университет</span>
  </v-container>
</template>

<script setup>
const currentUser = sessionStorage.getItem("tetrisUser");
const isAdmin = () => {
  return currentUser === "admin";
};
</script>

<style scoped>
.v-list-item {
  margin-bottom: 1rem;
}
.card {
  width: 100%;
  max-width: 1440px;
}
.card ul {
  padding: 0px 16px;
}
.card img {
  justify-self: center;
}
</style>
