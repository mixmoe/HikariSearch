<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ $t('Hikari Anime Image Search') }}</q-toolbar-title>
        <div v-if="$q.screen.gt.sm">Quasar v{{ $q.version }}</div>
        <q-btn
          flat
          dense
          round
          icon="code"
          href="https://github.com/mixmoe/HikariSearch"
        />
        <q-separator spaced vertical />
        <q-btn
          flat
          dense
          round
          :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'"
          @click="$q.dark.toggle"
        />
        <q-btn flat dense round icon="language" push>
          <q-popup-proxy>
            <q-select
              v-model="locale"
              :options="availableLocales"
              :label="$t('Choose language')"
              style="width: 250px"
              class="q-pa-md"
              borderless
              emit-value
              map-options
              options-dense
            >
              <template v-slot:prepend>
                <q-icon name="translate" color="secondary" />
              </template>
            </q-select>
          </q-popup-proxy>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' });

const availableLocales = [
  { value: 'zh-CN', label: 'Chinese Simplified' },
  { value: 'en-US', label: 'English (United States)' },
];

onBeforeMount(() => (locale.value = navigator.language));
</script>
