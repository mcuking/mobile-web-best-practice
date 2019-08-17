<template>
  <div class="layout__page">
    <div class="layout__header">
      <van-nav-bar title="江湖英雄帖"
                   left-text="返回"
                   left-arrow
                   @click-left="onGoBack" />
    </div>
    <div class="layout__body">
      <van-cell-group>
        <van-field v-model="formData.name"
                   clearable
                   label="尊姓大名"
                   placeholder="请输入大名" />
        <van-field v-model="formData.skill"
                   clearable
                   label="会啥绝招"
                   placeholder="请输入绝招" />
        <van-cell title="几时入坑"
                  is-link
                  :value="textData.pitDateStr"
                  @click="goToSelect('calendar')" />
        <van-cell title="何方门派"
                  is-link
                  :value="textData.sectStr"
                  @click="goToSelect('sect')" />
      </van-cell-group>
    </div>
    <van-popup v-model="showCalendar"
               position="right"
               :style="{ height: '100%', width: '100%' }">
      <Calendar title="选择入坑时间"
                @select="onSelectPitDate" />
    </van-popup>
    <van-popup v-model="showSects"
               position="bottom">
      <van-picker show-toolbar
                  :columns="sects"
                  @cancel="onGoBack"
                  @confirm="onSelectSect" />
    </van-popup>
    <div class="form__button--submit"
         id="fixed-bottom">
      <van-button type="primary"
                  size="large"
                  @click="onSubmit">
        提交
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Cell, Field, CellGroup, Button, NavBar, Popup, Picker } from 'vant';
import Calendar from '@/components/calendar/index.vue';

Vue.use(Cell)
  .use(Field)
  .use(CellGroup)
  .use(Button)
  .use(NavBar)
  .use(Popup)
  .use(Picker);

@Component({
  components: {
    Calendar
  }
})
export default class Form extends Vue {
  private showCalendar = false;

  private showSects = false;

  private sects = ['武当派', '少林派', '峨嵋派', '华山派', '丐帮'];

  private formData = {
    name: '',
    skill: '',
    pitDate: '',
    sect: ''
  };

  private textData = {
    pitDateStr: '',
    sectStr: ''
  };

  private onGoBack() {
    this.$router.go(-1);
  }

  private onSubmit() {
    this.$router.push({ name: 'info-list' });
  }

  private goToSelect(popupName: string) {
    this.$router.push({ name: 'form', query: { [popupName]: 'true' } });
  }

  private onSelectPitDate(...res: DateObject[]) {
    this.formData.pitDate = `${res[0].year}-${res[0].month}-${res[0].day}`;
    this.textData.pitDateStr = `${res[0].year}年${res[0].month}月${res[0].day}日`;
    setTimeout(() => {
      this.onGoBack();
    }, 100);
  }

  private onSelectSect(sect: any) {
    this.formData.sect = sect;
    this.textData.sectStr = sect;
    this.onGoBack();
  }

  @Watch('$route.query')
  private handlePopup(val: any) {
    switch (true) {
      case val.calendar && val.calendar === 'true':
        this.showCalendar = true;
        break;
      case val.sect && val.sect === 'true':
        this.showSects = true;
        break;
      default:
        this.showCalendar = false;
        this.showSects = false;
        break;
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
