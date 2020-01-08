<template>
  <div class="layout__page">
    <div class="layout__header">
      <van-nav-bar :title="isEdit ? '编辑任务集' : '新建任务集'"
                   :right-text="isEdit ? '删除' : ''"
                   left-arrow
                   @click-left="handleClickLeft"
                   @click-right="confirmDeleteNotebook" />
    </div>
    <div class="layout__body"
         v-touch:swipe="handleSwipeRight">
      <van-cell-group class="notebook__create-form">
        <van-field v-model="formModel.name"
                   label="任务集名称"
                   placeholder="请输入任务集名称"
                   maxlength="15"
                   required />
        <van-cell title="任务集主题色"
                  :value="themeColorText"
                  @click="setSelectThemeColorShow(true)"
                  is-link></van-cell>
      </van-cell-group>
      <div class="bottom-button--submit"
           id="fixed-bottom">
        <van-button type="primary"
                    size="large"
                    @click="handleCreateNotebook">提交</van-button>
      </div>
    </div>
    <van-popup v-model="selectThemeColorShow"
               position="bottom">
      <van-picker show-toolbar
                  title="选择主题色"
                  :columns="THEME_COLOR_ARRAY"
                  @cancel="setSelectThemeColorShow(false)"
                  @confirm="handleSelectThemeColor" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import ValidatorUtils from '@/utils/validate';
import SwipeRightMixin from '@/utils/swipe-right-mixin';
import { notebookInteractor } from '@/core';
import { THEME_COLOR_MAP, THEME_COLOR_ARRAY } from '@/constants/notebook';
import { INotebook, ValidateError } from '@/types';

import {
  NavBar,
  Button,
  Field,
  CellGroup,
  Cell,
  Popup,
  Picker,
  Dialog
} from 'vant';

Vue.use(NavBar)
  .use(Button)
  .use(Field)
  .use(CellGroup)
  .use(Cell)
  .use(Popup)
  .use(Picker);

@Component({
  components: {}
})
export default class NotebookCreate extends Mixins(SwipeRightMixin) {
  private get id() {
    if (typeof this.$route.query.id === 'string') {
      return parseInt(this.$route.query.id, 10);
    }
    return undefined;
  }

  private get isEdit() {
    return !!this.id;
  }

  private get themeColorText() {
    return THEME_COLOR_MAP[this.formModel.themeColor];
  }

  private THEME_COLOR_ARRAY = THEME_COLOR_ARRAY;

  private validator!: ValidatorUtils;

  private selectThemeColorShow = false;

  private formModel: INotebook = {
    name: '',
    themeColor: 'green',
    notes: []
  };

  private rules = {
    name: [{ required: true, message: '请填写任务集名称' }]
  };

  private handleClickLeft() {
    this.$router.go(-1);
  }

  private setSelectThemeColorShow(val: boolean) {
    this.selectThemeColorShow = val;
  }

  private handleSelectThemeColor(val: AnyObject) {
    this.setSelectThemeColorShow(false);
    this.formModel.themeColor = val.value;
  }

  private confirmDeleteNotebook() {
    Dialog.alert({
      title: '删除确认',
      message: '是否删除该任务集?'
    }).then(() => {
      this.handleDeleteNotebook(this.id!);
    });
  }

  private async handleDeleteNotebook(id: number) {
    try {
      await notebookInteractor.deleteNotebook(id);
      this.$bus.emit('notebook-change');
      this.$router.go(-1);
    } catch (error) {
      console.log(error);
    }
  }

  private handleCreateNotebook() {
    this.validator
      .validate()
      .then(async () => {
        try {
          const { formModel, id } = this;
          await notebookInteractor.saveNotebook(formModel, id);
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
        const notebook = await notebookInteractor.getNotebook(this.id!);
        if (notebook) {
          this.formModel = {
            name: notebook.name,
            themeColor: notebook.themeColor,
            notes: notebook.notes
          };
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
.notebook__create-form {
  margin-top: 20px;
}
</style>
