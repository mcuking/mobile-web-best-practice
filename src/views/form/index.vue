<template>
  <div class="layout__page">
    <div class="layout__header">
      <van-nav-bar title="江湖英雄帖"
                   left-text="返回"
                   left-arrow
                   @click-left="onClickLeft" />
    </div>
    <div class="layout__body">
      <van-cell-group>
        <van-field v-model="formData.name"
                   clearable
                   label="尊姓大名"
                   placeholder="请输入大名" />
        <van-field v-model="formData.password"
                   clearable
                   label="会啥绝招"
                   placeholder="请输入绝招" />
        <van-cell title="几时入坑"
                  is-link
                  :value="textData.dateStr"
                  @click="goToSelectDate" />
      </van-cell-group>
    </div>
    <van-popup v-model="popupShow"
               position="right"
               :style="{ height: '100%', width: '100%' }">
      <Calendar title="选择开箱日子"
                @select="selectDate" />
    </van-popup>
    <div class="form__button--submit"
         id="fixed-bottom">
      <van-button type="primary"
                  size="large"
                  @click="handleSubmit">
        提交
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Cell, Field, CellGroup, Button, NavBar, Popup } from 'vant';
import Calendar from '@/components/calendar/index.vue';

Vue.use(Cell)
  .use(Field)
  .use(CellGroup)
  .use(Button)
  .use(NavBar)
  .use(Popup);

@Component({
  components: {
    Calendar
  }
})
export default class Form extends Vue {
  private popupShow = false;

  private formData = {
    name: '',
    password: '',
    date: ''
  };

  private textData = {
    dateStr: ''
  };

  private onClickLeft() {
    this.$router.go(-1);
  }

  private handleSubmit() {
    this.$router.push({ name: 'info-list' });
  }

  private goToSelectDate() {
    this.$router.push({ name: 'form', query: { calendar: 'true' } });
  }

  private selectDate(...res: DateObject[]) {
    this.formData.date = `${res[0].year}-${res[0].month}-${res[0].day}`;
    this.textData.dateStr = `${res[0].year}年${res[0].month}月${res[0].day}日`;
    setTimeout(() => {
      this.$router.go(-1);
    }, 100);
  }

  @Watch('$route.query')
  private handlePopup(val: any) {
    if (val.calendar && val.calendar === 'true') {
      this.popupShow = true;
    } else {
      this.popupShow = false;
    }
  }
}
</script>
<style lang="less" scoped>
.form__button--submit {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 10px 16px;
}
</style>
