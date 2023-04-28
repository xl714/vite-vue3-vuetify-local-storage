import '@/styles/vuetify-missing-spacers.css';
import '@/styles/vuetify-missing-other-styles.css';
import '@/styles/style.css';
import '@/styles/vuetify.scss';

import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import App from '@/App.vue';

const app = createApp(App);

const vuetify = createVuetify();

app.use(vuetify);

app.mount('#app');
