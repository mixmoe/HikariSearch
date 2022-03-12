<template>
  <div>
    <div class="text-h6">{{ $t('Search on IqDB') }}</div>
    <q-separator spaced />
    <q-list bordered class="rounded-borders shadow-1">
      <q-expansion-item
        v-model="expandOptions"
        icon="settings"
        :label="$t('Search Options')"
      >
        <div class="q-pa-md">
          <q-select
            v-model="services"
            :options="[...serviceTypes]"
            multiple
            filled
            counter
            :label="$t('Image databases')"
          />
          <q-checkbox v-model="discolor" :label="$t('Search without color')" />
          <q-separator spaced />
          <q-btn
            :label="$t('Submit')"
            color="accent"
            icon="upload"
            @click="submitImage"
          />
        </div>
      </q-expansion-item>
    </q-list>
    <q-separator v-if="results.length" spaced />
    <div v-for="(result, index) in results" :key="index">
      <q-card class="row justify-evenly items-center q-ma-md">
        <q-img class="col-2" :src="proxy(result.image)" loading="lazy" />
        <q-list separator padding class="col-8">
          <q-item>
            <q-item-section avatar>
              <q-icon name="info" color="accent" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>{{ result.resolution }}</q-item-label>
              <q-item-label>
                {{ $t('Image similarity:') }}
                {{ result.similarity }}%
              </q-item-label>
              <q-item-label caption>
                {{ $t('Image ranking level:') }}
                {{ result.level }}
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>
                #{{ index + 1 }}/{{ results.length }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :href="result.url">
            <q-item-section avatar>
              <q-icon name="source" color="green" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>{{ $t('Image source:') }}</q-item-label>
              <q-item-label>
                {{ result.url }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
    <q-inner-loading :showing="loading" />
  </div>
</template>
<script setup lang="ts">
import type { IqDBParseResult } from 'src/api/types';
import { API, proxy } from 'src/api';
import { ref } from 'vue';

const serviceTypes = [
  'danbooru',
  'konachan',
  'yandere',
  'gelbooru',
  'sankaku_channel',
  'e_shuushuu',
  'zerochan',
  'anime_pictures',
] as const;

const discolor = ref(false),
  services = ref<typeof serviceTypes[number][]>([...serviceTypes]),
  props = defineProps<{ file: File }>(),
  results = ref<IqDBParseResult>([]),
  expandOptions = ref(true),
  loading = ref(false);

async function submitImage() {
  if (!props.file) return;
  try {
    loading.value = true;
    results.value = await API.IqDB({
      services: services.value,
      discolor: discolor.value,
      image: props.file,
    });
    expandOptions.value = false;
  } finally {
    loading.value = false;
  }
}
</script>
