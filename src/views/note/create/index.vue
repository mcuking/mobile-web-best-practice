<template>
  <div class="layout__page">
    <div class="layout__header">
      <van-nav-bar :title="isEdit ? '编辑任务' : '新建任务'"
                   :right-text="isEdit ? '删除' : ''"
                   left-arrow
                   @click-left="handleClickLeft"
                   @click-right="confirmDeleteNote" />
    </div>
    <div class="layout__body"
         v-touch:swipe="handleSwipeRight">
      <van-cell-group class="note__create-form">
        <van-field v-model="formModel.name"
                   label="任务名称"
                   placeholder="请输入任务名称"
                   maxlength="16"
                   required />
        <van-cell title="截止时间"
                  :value="deadlineText"
                  @click="setSelectDeadlineShow(true)"
                  is-link></van-cell>
        <van-cell title="同步任务到手机日历"
                  @click="toggleSyncCalendar">
          <van-checkbox v-model="formModel.isSync"
                        slot="right-icon"
                        :disabled="!formModel.deadline" />
        </van-cell>
        <van-field v-model="formModel.remark"
                   label="备注"
                   type="textarea"
                   placeholder="请输入备注"
                   maxlength="50" />
      </van-cell-group>
      <span class="note__create-form--metion extend-click"
            @click="handleMentionClick">每日名言（演示接口缓存效果）</span>
      <div class="bottom-button--submit"
           id="fixed-bottom">
        <van-button type="primary"
                    size="large"
                    @click="handleCreateNote">提交</van-button>
      </div>
    </div>
    <van-popup v-model="selectDeadlineShow"
               position="bottom">
      <van-datetime-picker v-model="formModel.deadline"
                           title="选择截止时间"
                           type="datetime"
                           :formatter="dateTimePickerFormatter"
                           :min-date="minDate"
                           @cancel="setSelectDeadlineShow(false)"
                           @confirm="handleTimePickerConfirm" />
    </van-popup>
    <transition>
      <router-view class="above-loaded-page" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import moment from 'moment';
import ValidatorUtils from '@/utils/validate';
import SwipeRightMixin from '@/utils/swipe-right-mixin';
import { noteInteractor } from '@/core';
import { dateTimePickerFormatter, createRandomNum } from '@/utils/common-tools';
import { INote, ValidateError } from '@/types';

import {
  NavBar,
  Button,
  Field,
  CellGroup,
  Cell,
  Popup,
  DatetimePicker,
  Dialog,
  Checkbox
} from 'vant';

Vue.use(NavBar)
  .use(Button)
  .use(Field)
  .use(CellGroup)
  .use(Cell)
  .use(Popup)
  .use(DatetimePicker)
  .use(Checkbox);

@Component({
  components: {}
})
export default class NoteCreate extends Mixins(SwipeRightMixin) {
  private get id() {
    if (typeof this.$route.query.id === 'string') {
      return parseInt(this.$route.query.id, 10);
    }
    return undefined;
  }

  private get notebookId() {
    return parseInt(this.$route.query.notebookId as string, 10);
  }

  private get isEdit() {
    return !!this.id;
  }

  private validator!: ValidatorUtils;

  private dateTimePickerFormatter = dateTimePickerFormatter;

  private selectDeadlineShow = false;

  private minDate = new Date();

  private formModel: INote = {
    id: createRandomNum(20),
    name: '',
    deadline: undefined,
    isSync: false,
    isDone: false,
    remark: ''
  };

  private deadlineText = '';

  private rules = {
    name: [{ required: true, message: '请填写任务名称' }]
  };

  private handleClickLeft() {
    this.$router.go(-1);
  }

  private setSelectDeadlineShow(val: boolean) {
    this.selectDeadlineShow = val;
  }

  private handleMentionClick() {
    this.$router.push({
      name: 'quote'
    });
  }

  private handleTimePickerConfirm() {
    this.deadlineText = moment(this.formModel.deadline).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    this.setSelectDeadlineShow(false);
  }

  private toggleSyncCalendar() {
    if (!this.formModel.deadline) {
      return this.$toast({
        message: '请先选择截止日期'
      });
    }
    this.formModel.isSync = !this.formModel.isSync;
  }

  private confirmDeleteNote() {
    Dialog.alert({
      title: '删除确认',
      message: '是否删除该任务?'
    }).then(() => {
      this.handleDeleteNote(this.notebookId, this.id!);
    });
  }

  private async handleDeleteNote(notebookId: number, id: number) {
    try {
      await noteInteractor.deleteNote(notebookId, id);
      this.$bus.emit('notebook-change');
      this.$router.go(-1);
    } catch (error) {
      console.log(error);
    }
  }

  private handleCreateNote() {
    this.validator
      .validate()
      .then(async () => {
        try {
          const { formModel, notebookId, isEdit } = this;
          await noteInteractor.saveNote(formModel, notebookId, isEdit);

          if (formModel.isSync && formModel.deadline) {
            const params = {
              id: formModel.id,
              title: formModel.name,
              deadline: formModel.deadline.getTime(),
              alarm: [5]
            };
            await noteInteractor.syncCalendar(params, notebookId);
          }
          this.$bus.emit('notebook-change');
          this.$router.go(-1);
        } catch (error) {
          console.log(error);
        }
      })
      .catch((errors: ValidateError[]) => {
        this.$toast(errors[0].message);
      });
  }

  private async created() {
    if (this.isEdit) {
      try {
        const note = await noteInteractor.getNote(this.notebookId, this.id!);
        if (note) {
          this.formModel = {
            id: note.id,
            name: note.name,
            deadline: note.deadline,
            isDone: note.isDone,
            isSync: note.isSync,
            remark: note.remark
          };
          if (this.formModel.deadline) {
            this.deadlineText = moment(this.formModel.deadline).format(
              'YYYY-MM-DD HH:mm:ss'
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    this.validator = new ValidatorUtils({
      rules: this.rules,
      data: this.formModel
    });
  }
}
</script>

<style lang="less" scoped>
@import '~@/less/var.less';

.note__create-form {
  margin-top: 20px;
}

.note__create-form--metion {
  float: right;
  margin: 16px 16px 0 0;
  font-size: 12px;
  color: @blue;
}
</style>
