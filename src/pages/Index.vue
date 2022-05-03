<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <q-card class="shadow-1 col-12 col-sm-4 col-xl-2">
      <div class="text-h5 q-pa-md">
        {{ $t('Search Image') }}
      </div>
      <q-separator />
      <q-slide-transition>
        <q-card-section v-show="preview">
          <q-img :src="preview" class="rounded-borders shadow-2" />
        </q-card-section>
      </q-slide-transition>
      <q-card-section>
        <q-file
          v-model="image"
          :label="$t('Select an image')"
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
          <div v-if="!image" class="text-center q-py-xl text-grey text-h4">
            {{ $t('Please select a image to search') }}
          </div>
          <div v-else-if="!tab" class="text-center q-py-xl text-grey text-h4">
            {{ $t('Please select a site to start searching') }}
          </div>
          <q-tab-panels v-else v-model="tab" animated keep-alive>
            <q-tab-panel name="sauce">
              <search-sauce-n-a-o :file="image" />
            </q-tab-panel>
            <q-tab-panel name="iq">
              <search-iq-d-b :file="image" />
            </q-tab-panel>
            <q-tab-panel name="ascii2d">
              <search-ascii2d :file="image" />
            </q-tab-panel>
            <q-tab-panel name="eh">
              <search-e-hentai :file="image" />
            </q-tab-panel>
            <q-tab-panel name="trace">
              <search-trace-moe :file="image" />
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SearchAscii2d from 'src/components/SearchAscii2d.vue';
import SearchSauceNAO from 'src/components/SearchSauceNAO.vue';
import SearchIqDB from 'src/components/SearchIqDB.vue';
import SearchEHentai from 'src/components/SearchEHentai.vue';
import SearchTraceMoe from 'src/components/SearchTraceMoe.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar(),
  // eslint-disable-next-line @typescript-eslint/unbound-method
  { t } = useI18n({ useScope: 'global' });

const image = ref<File>(),
  preview = ref<string>(),
  tab = ref<string>();

watch(image, (file) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.value = reader.result as string;
  };
  reader.readAsDataURL(file);
});

onMounted(() => {
  document.onpaste = ({ clipboardData }) => {
    const file = (
      clipboardData?.items.length ? [...clipboardData.items] : undefined
    )?.find((item) => item.kind === 'file');
    if (!file || !file.type.startsWith('image/')) return;

    $q.dialog({
      title: t('Paste Image'),
      message: t('Do you want to paste this image'),
    }).onOk(() => (image.value = file.getAsFile() ?? undefined));
  };
});

onBeforeUnmount(() => (document.onpaste = null));
</script>
