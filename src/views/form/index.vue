<template>
  <div class="page">
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
                @click="goToSelectDate" />
    </van-cell-group>
    <div class="form__button--submit">
      <van-button type="primary"
                  size="large"
                  @click="handleSubmit">
        提交
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Cell, Field, CellGroup, Button, NavBar } from 'vant';

Vue.use(Cell)
  .use(Field)
  .use(CellGroup)
  .use(Button)
  .use(NavBar);

@Component({
  components: {}
})
export default class Home extends Vue {
  private dateShow = false;
  private formData = {
    name: '',
    password: '',
    birthDate: ''
  };
  private textData = {
    birthDateStr: ''
  };

  private goToSelectDate() {
    this.$router.push({
      name: 'date-picker',
      query: {
        from: 'add-staff-group'
      }
    });
  }

  private handleSubmit() {
    return;
  }

  private created() {
    this.$bus.on('select-date', (res: any) => {
      this.formData.birthDate = `${res[0].year}-${res[0].month}-${res[0].day}`;
      this.textData.birthDateStr = `${res[0].year}年${res[0].month}月${res[0].day}日`;
    });
  }

  private beforeDestory() {
    this.$bus.off('select-date');
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
