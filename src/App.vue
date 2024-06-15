<script setup lang="ts">
import { ref } from 'vue';
import { DragResizeDirection, useAdjustSize } from '../packages/useAdjustSize.ts';

const demoXRef1 = ref<HTMLElement | null>(null);
const demoXRef2 = ref<HTMLElement | null>(null);

useAdjustSize(demoXRef1, {
  directions: DragResizeDirection.Right,
  persist: true,
  persistKey: 'resize-demo-x-1',
  minWidth: 300,
  maxWidth: 600,
  defaultWidth: 350,
})

useAdjustSize(demoXRef2, {
  directions: DragResizeDirection.Left,
  persist: true,
  persistKey: 'resize-demo-x-2',
  minWidth: 300,
  maxWidth: 600,
  defaultWidth: 350,
})

const demoRef3 = ref<HTMLElement | null>(null);
const demoRef4 = ref<HTMLElement | null>(null);

useAdjustSize(demoRef3, {
  directions: DragResizeDirection.Bottom,
  persist: true,
  persistKey: 'resize-demo-y-1',
  minHeight: 100,
  maxHeight: 300,
  defaultHeight: 200,
})

useAdjustSize(demoRef4, {
  directions: DragResizeDirection.Top,
  persist: true,
  persistKey: 'resize-demo-y-2',
  minHeight: 100,
  maxHeight: 300,
  defaultHeight: 200,
})
</script>

<template>
  <h2>X Axis</h2>
  <div class="demo-area-x">
    <div ref="demoXRef1" class="demo-area-x-item-1">
      Demo area 1
    </div> 
    <div class="demo-middle">
      Demo area middle
    </div>
    <div class="demo-area-x-item-2" ref="demoXRef2">
      Demo area 2
    </div>
  </div>
  <h2> Y Axis</h2>
  <div class="demo-area-y">
    <div ref="demoRef3" class="demo-area-y-item-1">
      Demo area 1
    </div> 
    <div class="demo-middle">
      Demo area middle
    </div>
    <div class="demo-area-y-item-2" ref="demoRef4">
      Demo area 2
    </div>
  </div>
</template>

<style scoped>
.panel {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.panel-item {
  display: flex;
}

.demo-area-x {
  width: 100%;
  height: 500px;
  display: flex;
  margin-top: 20px;
  border: 1px solid black;
}

.demo-area-x-item-1 {
  height: 100%;
  border-right: 1px solid #ccc;
}

.demo-area-x-item-2 {
  height: 100%;
  border-left: 1px solid #ccc;
}

.demo-middle {
  flex: 1 1 0;
}

.demo-area-y {
  width: 100%;
  height: 700px;
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  border: 1px solid black;
}


.demo-area-y-item-1 {
  width: 100%;
  border-bottom: 1px solid #ccc;
}

.demo-area-y-item-2 {
  width: 100%;
  border-top: 1px solid #ccc;
}

</style>
