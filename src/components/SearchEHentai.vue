<template>
  <div>
    <div class="text-h6">{{ $t('Search on EHentai') }}</div>
    <q-separator spaced />
    <q-list bordered class="rounded-borders shadow-1">
      <q-expansion-item
        v-model="expandOptions"
        icon="settings"
        :label="$t('Search Options')"
      >
        <div class="q-pa-md">
          <div>
            <b class="text-body1">{{ $t('Search site') }}</b>
            <q-radio v-model="site" val="eh" :label="$t('E-Hentai')" />
            <q-radio v-model="site" val="ex" :label="$t('EXHentai')" />
          </div>
          <q-checkbox v-model="cover" :label="$t('Search cover only')" />
          <q-checkbox v-model="deleted" :label="$t('Search deleted content')" />
          <q-checkbox v-model="similar" :label="$t('Search similar content')" />
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
              <q-item-label overline>{{ result.type }}</q-item-label>
              <q-item-label>{{ result.title }}</q-item-label>
              <q-item-label caption>{{ result.date }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>
                #{{ index + 1 }}/{{ results.length }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable :href="result.link">
            <q-item-section avatar>
              <q-icon name="source" color="green" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>{{ $t('Image source:') }}</q-item-label>
              <q-item-label>
                {{ result.link }}
              </q-item-label>
              <q-item-label caption>
                {{ $t('Image tags:') }}
                <q-chip
                  v-for="(tag, index) in result.tags"
                  :key="index"
                  dense
                  size="sm"
                >
                  {{ tag }}
                </q-chip>
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
import type { EHentaiParseResult } from 'src/api/types';
import { API, proxy } from 'src/api';
import { ref } from 'vue';

const site = ref<'eh' | 'ex'>('eh'),
  cover = ref(false),
  deleted = ref(false),
  similar = ref(true),
  props = defineProps<{ file: File }>(),
  results = ref<EHentaiParseResult>([]),
  expandOptions = ref(true),
  loading = ref(false);

async function submitImage() {
  if (!props.file) return;
  try {
    loading.value = true;
    results.value = await API.EHentai({
      site: site.value,
      cover: cover.value,
      deleted: deleted.value,
      similar: similar.value,
      image: props.file,
    });
    expandOptions.value = false;
  } finally {
    loading.value = false;
  }
}
</script>
