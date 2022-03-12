<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <q-card class="shadow-1 col-12 col-sm-4 col-xl-2">
      <div class="text-h5 q-pa-md">
        {{ $t('Search Image') }}
      </div>
      <q-separator />
      <q-slide-transition>
        <q-card-section v-show="file">
          <q-img :src="preview" class="rounded-borders shadow-2" />
        </q-card-section>
      </q-slide-transition>
      <q-card-section>
        <q-file
          v-model="file"
          :label="$t('Select an image')"
          @update:model-value="onImageChange"
          counter
          clearable
          filled
          accept="image/*"
        >
          <template v-slot:prepend>
            <q-icon name="add_photo_alternate" />
          </template>
        </q-file>
      </q-card-section>
      <q-separator />
    </q-card>
    <q-card class="shadow-2 col-12 col-sm-6 col-xl-8" style="height: 90vh">
      <div class="text-h5 q-pa-md">{{ $t('Search Options') }}</div>
      <q-separator />
      <q-card-section>
        <q-tabs v-model="tab" class="text-primary">
          <q-tab name="sauce" label="SauceNAO"></q-tab>
          <q-tab name="iq" label="IqDB"></q-tab>
          <q-tab name="ascii2d" label="ascii2d"></q-tab>
          <q-tab name="eh" label="EHentai"></q-tab>
          <q-tab name="trace" label="TraceMoe"></q-tab>
        </q-tabs>
        <q-separator />
        <q-scroll-area style="height: 70vh">
          <div v-if="!file" class="text-center q-py-xl text-grey text-h4">
            {{ $t('Please select a image to search') }}
          </div>
          <div v-else-if="!tab" class="text-center q-py-xl text-grey text-h4">
            {{ $t('Please select a site to start searching') }}
          </div>
          <q-tab-panels v-else v-model="tab" animated keep-alive>
            <q-tab-panel name="sauce">
              <search-sauce-n-a-o :file="file" />
            </q-tab-panel>
            <q-tab-panel name="iq">
              <search-iq-d-b :file="file" />
            </q-tab-panel>
            <q-tab-panel name="ascii2d">
              <search-ascii2d :file="file" />
            </q-tab-panel>
            <q-tab-panel name="eh">
              <search-e-hentai :file="file" />
            </q-tab-panel>
            <q-tab-panel name="trace">
              <search-trace-moe :file="file" />
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import SearchAscii2d from 'src/components/SearchAscii2d.vue';
import SearchSauceNAO from 'src/components/SearchSauceNAO.vue';
import SearchIqDB from 'src/components/SearchIqDB.vue';
import SearchEHentai from 'src/components/SearchEHentai.vue';
import SearchTraceMoe from 'src/components/SearchTraceMoe.vue';

const file = ref<File>(),
  preview = ref<string>(),
  tab = ref<string>();

function onImageChange() {
  if (!file.value) return;
  const reader = new FileReader();
  reader.onload = ({ target }) => {
    preview.value = target?.result as string;
  };
  reader.readAsDataURL(file.value);
}
</script>
