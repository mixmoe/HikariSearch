<template>
  <div>
    <div class="text-h6">{{ $t('Search on TraceMoe') }}</div>
    <q-separator spaced />
    <q-list bordered class="rounded-borders shadow-1">
      <q-expansion-item
        v-model="expandOptions"
        icon="settings"
        :label="$t('Search Options')"
      >
        <div class="q-pa-md">
          <q-checkbox v-model="cutBorders" :label="$t('Cut image borders')" />
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
        <q-img
          class="col-4"
          :img-class="result.nsfw ? 'blur-no-hover' : undefined"
          :src="proxy(result.preview)"
          loading="lazy"
        />
        <q-list separator padding class="col-8">
          <q-item>
            <q-item-section avatar>
              <q-icon name="info" color="accent" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>
                {{ $t('Image similarity:') }}
                {{ result.similarity.toFixed(3) }}%
              </q-item-label>
              <q-item-label>{{ result.file }}</q-item-label>
              <q-item-label caption>{{
                Number.isInteger(result.episode)
                  ? $t('Episode:') + ` ${result.episode}`
                  : $t('Unknown episode')
              }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>
                #{{ index + 1 }}/{{ results.length }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="source" color="green" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>{{ $t('Image source:') }}</q-item-label>
              <q-item-label v-if="result.name">
                {{ result.name.native }}
              </q-item-label>
              <q-item-label v-if="result.name?.english">
                {{ $t('English name:') }} <em>{{ result.name.english }}</em>
              </q-item-label>
              <q-item-label v-if="result.name?.romaji">
                {{ $t('Romaji name:') }} <em>{{ result.name.romaji }}</em>
              </q-item-label>
              <q-item-label caption>
                {{ stamp2hms(result.from) }}-{{ stamp2hms(result.to) }}
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
import type { TraceMoeParseResult } from 'src/api/types';
import { API, proxy } from 'src/api';
import { ref } from 'vue';

const cutBorders = ref(true),
  props = defineProps<{ file: File }>(),
  results = ref<TraceMoeParseResult>([]),
  expandOptions = ref(true),
  loading = ref(false);

async function submitImage() {
  if (!props.file) return;
  try {
    loading.value = true;
    results.value = await API.TraceMoe({
      cutBorders: cutBorders.value,
      image: props.file,
    });
    expandOptions.value = false;
  } finally {
    loading.value = false;
  }
}

function stamp2hms(stamp: number) {
  const iso = new Date(stamp).toISOString();
  const [, timeZ] = iso.split('T');
  const [time] = timeZ.split('Z');
  return time;
}
</script>
<style lang="scss">
.blur-no-hover {
  filter: blur(10px);
  transition: 100ms filter ease-in;
}
.blur-no-hover:hover {
  filter: blur(0px);
}
</style>
