<script setup>
import PreviewContentItem from '@/components/PreviewContentItem.vue';
import ImageAndVideoPlayer from '@/components/ImageAndVideoPlayer.vue';

import { getFile } from '@/services/files.service.js'
import { ref, onUnmounted, watch, reactive } from 'vue'

const props = defineProps({
  selectedAction: {type: [Object, null], default: null}
})

let images = ref([])

let player = reactive({
  play: false,
  file: null
})

async function getImage(uuid){
  let res = await getFile(uuid)
  //TODO: video preview
  if( res.data.type.includes("image") ){
    return URL.createObjectURL(res.data)
  }else{
    return null
  }
}

watch(
  ()=>props.selectedAction,
  async ()=>{
    if( !props.selectedAction?.files ) return; 
    
    let imgs = []
    for(let file of props.selectedAction.files){
      imgs.push({src: await getImage(file.id), file: file}) 
    }
    images.value = imgs
  },
  { immediate: true }
)

onUnmounted(()=>images.value.forEach(img=>URL.revokeObjectURL(img)))
</script>

<template>
<div class="content">
  <template v-if="selectedAction !== null">
    <div class="content__action">
      {{ selectedAction.name }}:
    </div>
    <q-separator class="q-mb-lg"/>

    <template v-if="images.length > 0">
      <div class="content__images">
        <preview-content-item 
            :src-image="image.src"
            :data-file="image.file"
            v-for="image in images"
            @click="()=>{
              player.play = true
              player.file = image.file
            }"
        />
      </div>
    </template>

    <template v-else>
      К текущему событию не привязан контент
    </template>
  </template>

  <template v-else>
    Необходимо выбрать событие
  </template>


  <q-dialog v-model="player.play" full-width>
    <image-and-video-player 
        :file="player.file" 
        :content-type="player.file.content_type"
    />
  </q-dialog>
</div>
</template>

<style lang="scss" scoped>
.content{
  &__images{
    display: flex;
    gap: 1rem;
  }

  &__action{
    font-size: 1.8rem;
    text-transform: capitalize;
  }
}
</style>