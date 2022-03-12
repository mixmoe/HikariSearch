<template>
  <div>
    <div class="text-h6">{{ $t('Search on SauceNAO') }}</div>
    <q-separator spaced />
    <q-list bordered class="rounded-borders shadow-1">
      <q-expansion-item
        v-model="expandOptions"
        icon="settings"
        :label="$t('Search Options')"
      >
        <div class="q-pa-md">
          <q-checkbox v-model="hide" :label="$t('Hide sensitive content')" />
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
      <q-card
        class="row justify-evenly items-center q-ma-md"
        v-if="!result.hidden"
      >
        <q-img class="col-2" :src="proxy(result.image)" loading="lazy" />
        <q-list separator padding class="col-8">
          <q-item>
            <q-item-section avatar>
              <q-icon name="info" color="accent" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ result.title }}</q-item-label>
              <q-item-label caption>
                {{ $t('Image similarity:') }}
                {{ result.similarity.toFixed(3) }}%
              </q-item-label>
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
              <q-item-label
                v-for="(source, index) in result.content"
                :key="index"
              >
                <a v-if="source.link" :href="source.link">{{ source.text }}</a>
                <b v-else>{{ source.text }}</b>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="result.misc.length">
            <q-item-section avatar>
              <q-icon name="more" color="yellow" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>{{ $t('More sources:') }}</q-item-label>
              <q-item-label v-for="(misc, index) in result.misc" :key="index">
                <a :href="misc">{{ misc }}</a>
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
import type { SauceNAOParseResult } from 'src/api/types';
import { API, proxy } from 'src/api';
import { ref } from 'vue';

const hide = ref(true),
  props = defineProps<{ file: File }>(),
  results = ref<SauceNAOParseResult>([]),
  expandOptions = ref(true),
  loading = ref(false);

async function submitImage() {
  if (!props.file) return;
  try {
    loading.value = true;
    results.value = await API.SauceNAO({ hide: hide.value, image: props.file });
    expandOptions.value = false;
  } finally {
    loading.value = false;
  }
}
</script>
