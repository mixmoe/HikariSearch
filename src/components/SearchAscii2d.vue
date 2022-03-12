<template>
  <div>
    <div class="text-h6">{{ $t('Search on ascii2d') }}</div>
    <q-separator spaced />
    <q-list bordered class="rounded-borders shadow-1">
      <q-expansion-item
        v-model="expandOptions"
        icon="settings"
        :label="$t('Search Options')"
      >
        <div class="q-pa-md">
          <div class="text-body1">{{ $t('Search mode') }}</div>
          <q-radio v-model="type" val="color" :label="$t('Color Mode')" />
          <q-radio v-model="type" val="bovw" :label="$t('BOVW Mode')" />
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
              <q-item-label>{{ result.hash }}</q-item-label>
              <q-item-label caption>{{ result.info }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>
                #{{ index + 1 }}/{{ results.length }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="result.source" clickable :href="result.source.link">
            <q-item-section avatar>
              <q-icon name="source" color="green" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>{{ $t('Image source:') }}</q-item-label>
              <q-item-label :href="result.source.link">
                {{ result.source.text }}
              </q-item-label>
              <q-item-label caption>
                {{ result.source.link }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="result.author" clickable :href="result.author.link">
            <q-item-section avatar>
              <q-icon name="person" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>{{ $t('Image author:') }}</q-item-label>
              <q-item-label>
                {{ result.author.text }}
              </q-item-label>
              <q-item-label caption>
                {{ result.author.link }}
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
import type { ascii2dParseResult } from 'src/api/types';
import { API, proxy } from 'src/api';
import { ref } from 'vue';

const searchTypes = ['color', 'bovw'] as const;

const type = ref<typeof searchTypes[number]>('color'),
  results = ref<ascii2dParseResult>([]),
  props = defineProps<{ file?: File }>(),
  expandOptions = ref(true),
  loading = ref(false);

async function submitImage() {
  if (!(props.file && type.value)) return;
  try {
    loading.value = true;
    results.value = await API.ascii2d({
      type: type.value,
      image: props.file,
    });
    expandOptions.value = false;
  } finally {
    loading.value = false;
  }
}
</script>
