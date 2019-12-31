<template>
  <div class="card">
    <div class="card__title"
         :class="notebook.themeColor"
         @click="$emit('edit-notebook', notebook.id)">
      {{ notebook.name }}
    </div>
    <draggable class="list-group"
               tag="ul"
               v-model="notebook.notes"
               v-bind="dragOptions"
               @end="$emit('update-note-order', notebook)">
      <transition-group type="transition"
                        :name="'flip-list'">
        <li class="card__note"
            v-for="(note, j) in notebook.notes"
            :key="note.id"
            :class="{ last: j === notebook.notes.length - 1 }"
            @click.stop="$emit('edit-note', note.id, notebook.id)">
          <div class="card__note-action--drag">
            <i class="iconfont memo-icon-drag-hand extend-click"></i>
          </div>
          <div class="card__note-main">
            <div class="card__note-left">
              <span class="card__note-name ellipsis"
                    :class="{ done: note.isDone }">
                {{ note.name }}
              </span>
              <div v-if="note.deadlineStr"
                   class="card__note-time ellipsis"
                   :class="{ expire: note.isExpire, done: note.isDone }">
                {{ note.deadlineStr }}
              </div>
            </div>
            <div class="card__note-right">
              <div v-if="note.isSync"
                   class="card__note-sync-indicator">
                <i class="iconfont memo-icon-clock"></i>
              </div>
              <van-checkbox v-model="note.isDone"
                            class="card__note-action--done extend-click"
                            @click.stop="$emit('toggle-done-status', note.id, notebook.id)"
                            slot="right-icon" />
            </div>
          </div>
        </li>
      </transition-group>
    </draggable>
    <div class="button-wrapper--create-note">
      <div class="button--create-note"
           @click.stop="$emit('create-note', notebook.id)">
        <i class="iconfont memo-icon-plus"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { INotebook } from '@/types';

import { Checkbox } from 'vant';

Vue.use(Checkbox);

@Component({
  components: { draggable }
})
export default class Card extends Vue {
  @Prop({ type: Object, default: () => ({}) })
  private notebook!: INotebook;

  private dragOptions = {
    handler: '.card__note-action--drag',
    filter: '.card__note-main',
    ghostClass: 'ghost',
    animation: 0,
    preventOnFilter: false
  };
}
</script>

<style lang="less" scoped>
@import '~@/less/var.less';

.card {
  position: relative;
  background: #fff;
  box-sizing: border-box;
  min-height: 80px;
  border-radius: 6px;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.12);
  padding: 24px 0;
}

.card__title {
  position: absolute;
  left: 16px;
  top: -16px;
  padding: 6px 12px;
  border-radius: 4px;
  color: #fff;
  &:active {
    opacity: 0.6;
  }
  &.red {
    background: @red-level;
  }
  &.yellow {
    background: @yellow-level;
  }
  &.blue {
    background: @blue-level;
  }
  &.green {
    background: @green-level;
  }
}

.card__note {
  display: flex;
  align-items: center;
  padding-left: 16px;
  &.last {
    margin-bottom: 8px;
  }
}

.card__note-action--drag {
  margin-right: 8px;
}

.card__note-main {
  flex: 1;
  display: flex;
  justify-content: space-between;
  position: relative;
  font-size: 16px;
  background: #fff;
  padding: 16px 16px 16px 0;
  &:active {
    background: @active-color;
  }
}

.card__note-name {
  display: inline-block;
  position: relative;
  max-width: 236px;
  line-height: 1.5;
  &.done {
    color: @gray-light;
  }
  &.done::before {
    content: '';
    border-bottom: 1px solid @gray-light;
    width: 100%;
    position: absolute;
    left: 0;
    top: 50%;
  }
}

.card__note-time {
  max-width: 236px;
  line-height: 1.5;
  font-size: 14px;
  color: @gray-light;
  &.expire {
    color: @red;
  }
  &.expire.done {
    color: @gray-light;
  }
}

.card__note-right {
  display: flex;
  align-items: flex-start;
}

.card__note-sync-indicator {
  margin-top: 4px;
}

.card__note-action--done {
  margin: 3px 0 0 8px;
}

.button-wrapper--create-note {
  padding: 0 16px;
}

.button--create-note {
  display: flex;
  width: 100%;
  height: 40px;
  font-size: 32px;
  justify-content: center;
  align-items: center;
  border: 2px dashed @border-color;
  border-radius: 4px;
  &:active {
    background: @active-color;
  }
}

.ghost {
  opacity: 0.5;
  background: @active-color;
}

.flip-list-move {
  transition: transform 0.5s;
}

.memo-icon-plus {
  font-size: 32px;
  color: @border-color;
}

.memo-icon-drag-hand {
  font-size: 24px;
}
</style>
