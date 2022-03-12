<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <q-card class="shadow-1 col-12 col-sm-4 col-md-3 col-xl-2">
      <div class="text-h5 q-pa-md">
        {{ $t('Search Image') }}
      </div>
      <q-separator />
      <q-card-section>
        <q-slide-transition>
          <q-img
            :ratio="1"
            :src="preview"
            class="shadow-1"
            v-show="file"
          ></q-img>
        </q-slide-transition>
      </q-card-section>
      <q-card-section>
        <q-file
          v-model="file"
          :label="$t('Select an image')"
          @update:model-value="onImageChange"
          counter
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
    <q-card class="shadow-2 col-12 col-sm-6">
      <div class="text-h5 q-pa-md">{{ $t('Search Options') }}</div>
      <q-separator />
      <q-card-section>
        <q-tabs v-model="tab">
          <q-tab name="ascii2d" label="ascii2d"></q-tab>
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="ascii2d">
            <search-ascii2d :file="file!" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import SearchAscii2d from 'src/components/SearchAscii2d.vue';

const file = ref<File>(),
  preview = ref<string>(),
  tab = ref<string>();

function onImageChange() {
  if (!file.value) return;
  const reader = new FileReader();
  reader.onload = ({ target }) => {
    console.log(target?.result);
    preview.value = target?.result as string;
  };
  reader.readAsDataURL(file.value);
}
</script>
