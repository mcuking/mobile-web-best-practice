<template>
  <div class="home">
    <van-nav-bar title="编辑个人信息"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <van-cell-group>
      <van-field v-model="formData.name"
                 clearable
                 label="用户名"
                 placeholder="请输入用户名" />
      <van-field v-model="formData.password"
                 type="password"
                 label="密码"
                 placeholder="请输入密码" />
      <van-cell title="出生日期"
                is-link
                :value="textData.birthDateStr"
                @click="dateShow=true" />
    </van-cell-group>
    <div class="form__button--submit">
      <van-button type="primary"
                  size="large">
        提交
      </van-button>
    </div>
    <van-popup v-model="dateShow"
               position="right"
               :style="{ height: '100%', width: '100%' }">
      <DatePicker title="选择日期"
                  :isRange="false"
                  @back="dateShow=false"
                  @select="saveDate" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DatePicker from "@/components/datePicker/index.vue";
import { Cell, Field, CellGroup, Button, Popup, NavBar } from "vant";

Vue.use(Cell)
  .use(Field)
  .use(CellGroup)
  .use(Button)
  .use(Popup)
  .use(NavBar);

@Component({
  components: {
    DatePicker
  }
})
export default class Home extends Vue {
  private dateShow = false;
  private formData = {
    name: "",
    password: "",
    birthDate: ""
  };
  private textData = {
    birthDateStr: ""
  };

  private showPopup() {
    this.dateShow = true;
  }

  private saveDate(...arg: any[]) {
    setTimeout(() => {
      this.dateShow = false;
    }, 300);

    this.formData.birthDate = `${arg[0].year}-${arg[0].month}-${arg[0].day}`;
    this.textData.birthDateStr = `${arg[0].year}年${arg[0].month}月${arg[0].day}日`;
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