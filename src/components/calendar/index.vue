<template>
  <div class="layout__page">
    <div class="layout__header">
      <van-nav-bar :title="title"
                   left-text="返回"
                   left-arrow
                   @click-left="onClickLeft" />
    </div>
    <div class="dpb-week">
      <div class="indicator clearfix"
           v-if="isRange">
        <div class="time left">
          <div class="title">开始日期</div>
          <div class="content"
               v-if="begin.month">{{`${begin.month}月${begin.day}日`}}</div>
          <div class="content"
               v-if="!begin.month">mm月dd日</div>
        </div>
        <div class="split">
          <div class="line">{{length}}天</div>
        </div>
        <div class="time right left">
          <div class="title">结束日期</div>
          <div class="content"
               v-if="end.month">{{`${end.month}月${end.day}日`}}</div>
          <div class="content"
               v-if="!end.month">mm月dd日</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="color: #ED472B">日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th style="color: #ED472B">六</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="dpb-week-days">
      <div class="dpbwd-table"
           v-for="(item,index) in data"
           :key="index">
        <div class="dpbwd-table-month">
          {{(month+index)>12?((year+1)+'年'+'0'+(month+index-12)+ '月') : (year+'年'+(month+index) + '月')}}
        </div>
        <div class="dpbwd-table-items">
          <table class="dpbwd-table-items-table"
                 :class="{'isRange': isRange}"
                 cellpadding=0
                 cellspace=0>
            <tbody>
              <tr v-for="(week, index) in item"
                  :key="index">
                <td :class="
												isActive(day)
												?'active':
												(isInRange(day)
													?'range':
													isDisable(day)?'disable':'')
												"
                    v-for="(day, index) in week"
                    @click="select(day)"
                    :key="index">
                  <div class="page-table-item">
                    <strong class="page-table-text"
                            :class="{'today': isToday(day)}">{{day.day}}</strong>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NavBar } from 'vant';

Vue.use(NavBar);

@Component
export default class Calendar extends Vue {
  @Prop({ type: String, default: '选择日期' })
  private title!: string;

  @Prop({ type: Number, default: 2 })
  private monthLength!: number;

  // 默认可选范围
  @Prop({ type: Number, default: 7 })
  private range!: number;

  @Prop({ type: Boolean, default: true })
  private isReverseAllow!: boolean;

  // 选择日期还是日期范围模式
  @Prop({ type: Boolean, default: false })
  private isRange!: boolean;

  @Prop({
    type: Object,
    default: () => ({ year: '', month: '', day: '' })
  })
  private beginInit!: DateObject;

  @Prop({
    type: Object,
    default: () => ({ year: '', month: '', day: '' })
  })
  private endInit!: DateObject;

  private data: any[] = [];
  private year = new Date().getFullYear();
  private month = new Date().getMonth() + 1;
  private begin = {
    year: '',
    month: '',
    day: ''
  };
  private end = {
    year: '',
    month: '',
    day: ''
  };
  private start = {
    year: '',
    month: '',
    day: ''
  };
  private last = {
    year: '',
    month: '',
    day: ''
  };
  private length = 0;

  private onClickLeft() {
    // this.$emit('back');
    this.$router.go(-1);
  }

  // 是否为不可选择日期
  private isDisable(day: any) {
    const start = this.start;
    const last = this.last;

    const s1 = new Date(
      start.year + '-' + start.month + '-' + start.day
    ).getTime();
    const s2 = new Date(
      last.year + '-' + last.month + '-' + last.day
    ).getTime();
    const s = new Date(day.year + '-' + day.month + '-' + day.day).getTime();

    return s1 > s || s2 < s;
  }

  // 是否选中
  private isActive(day: any) {
    const begin = this.begin;
    const end = this.end;
    const s1 = new Date(
      begin.year + '-' + begin.month + '-' + begin.day
    ).getTime();
    const s2 = new Date(end.year + '-' + end.month + '-' + end.day).getTime();
    const s = new Date(day.year + '-' + day.month + '-' + day.day).getTime();
    return s === s1 || s === s2;
  }

  // 是否是今天
  private isToday(day: any) {
    const s = new Date(new Date().toLocaleDateString()).getTime();
    const s1 = new Date(day.month + '/' + day.day + '/' + day.year).getTime();
    return s === s1;
  }

  // 是否为开始日期
  private isBegin(day: any) {
    const begin = this.begin;
    const end = this.end;
    const s1 = new Date(
      begin.year + '-' + begin.month + '-' + begin.day
    ).getTime();
    const s = new Date(day.year + '-' + day.month + '-' + day.day).getTime();
    return s === s1;
  }

  // 是否为结束日期
  private isEnd(day: any) {
    const begin = this.begin;
    const end = this.end;
    const s1 = new Date(end.year + '-' + end.month + '-' + end.day).getTime();
    const s = new Date(day.year + '-' + day.month + '-' + day.day).getTime();
    return s === s1;
  }

  // 选中日期
  private select(day: any) {
    this.length = 0;
    if (this.isDisable(day)) {
      return;
    }
    if (!this.isRange) {
      this.end = day;
      this.$emit('select', this.end);
      return;
    }
    if (!this.begin.year || (this.begin.year && this.end.year)) {
      this.begin = day;
      this.end = {
        year: '',
        month: '',
        day: ''
      };
    } else if (this.begin.year && !this.end.year) {
      // 若不支持反向选择，则选中日期
      if (
        !this.isReverseAllow &&
        this.getDaysSize(
          this.begin.year + '-' + this.begin.month + '-' + this.begin.day,
          day.year + '-' + day.month + '-' + day.day
        ) <= 0
      ) {
        this.end = day;
        return;
      }
      // 反选日期
      if (this.isOpposite(day, this.begin)) {
        this.end = this.begin;
        this.begin = day;
      } else {
        this.end = day;
      }
      // 选中日期
      this.$emit('select', this.begin, this.end);

      const s1 = new Date(
        this.begin.year + '-' + this.begin.month + '-' + this.begin.day
      ).getTime();
      const s2 = new Date(
        this.end.year + '-' + this.end.month + '-' + this.end.day
      ).getTime();
      this.length =
        parseInt(JSON.stringify((s2 - s1) / (1000 * 60 * 60 * 24)), 10) + 1;
    }
  }

  // 判断是否反转日期
  private isOpposite(end: any, begin: any) {
    const s1 = new Date(
      begin.year + '-' + begin.month + '-' + begin.day
    ).getTime();
    const s2 = new Date(end.year + '-' + end.month + '-' + end.day).getTime();
    return s2 < s1;
  }

  // 查看是否是已经选中的日期区间中
  private isInRange(day: any) {
    if (!day) {
      return;
    }
    const begin = this.begin;
    const end = this.end;
    const s1 = new Date(
      begin.year + '-' + begin.month + '-' + begin.day
    ).getTime();
    const s2 = new Date(end.year + '-' + end.month + '-' + end.day).getTime();
    const s = new Date(day.year + '-' + day.month + '-' + day.day).getTime();
    if (s < s2 && s > s1) {
      return true;
    }
  }

  // 获取天数差
  private getDaysSize(s1: any, s2: any) {
    const s3 = new Date(s1);
    const s4 = new Date(s2);
    const days = s4.getTime() - s3.getTime();
    const time = parseInt(JSON.stringify(days / (1000 * 60 * 60 * 24)), 10);
    return time;
  }

  // 获取周几
  private getWeekday(date: any) {
    const nowDate = new Date();
    const days = this.getDaysSize(nowDate, date);
    const mydate = new Date(date);
    const myday = mydate.getDay(); // 注:0-6对应为星期日到星期六
    return myday;
  }

  // 将数据格式化表格日期格式
  private monthDate(year: any, month: any) {
    // 或取当前月份最后一天的日期
    const d = new Date(year, month, 0);
    const lastDay = d.getDate();
    // 计算当前月份第一天是星期几
    const weekday = this.getWeekday(year + '-' + month + '-01');
    // 定义存放当前月份的数组
    const data = [];
    // 定义日期表格数组
    const result = [];
    // 计算出当前月份每一天到数组中
    for (let day = 1; day <= lastDay; day++) {
      data.push({
        day: day < 10 ? '0' + day : JSON.stringify(day),
        month,
        year
      });
    }
    // 补全日期前几天
    for (let i = 0; i < weekday; i++) {
      data.unshift('');
    }
    // 切成6行
    for (let i = 0, len = data.length; i < len; i += 7) {
      result.push(data.slice(i, i + 7));
    }
    // 补全日期后几天
    const length = result[result.length - 1].length;
    if (length < 7) {
      for (let i = 0; i < 7 - length; i++) {
        result[result.length - 1].push('');
      }
    }

    return result;
  }

  // 初始化表格数据
  private tableDate() {
    const monthLength = this.monthLength;
    const data = [];
    const year = this.year; // 获取完整的年份(4位)
    const month = this.month; // 获取当前月份
    for (let i = 0; i < monthLength; i++) {
      const y = month + i > 12 ? year + 1 : year;
      const m = month + i > 12 ? month + i - 12 : month + i;
      const re = this.monthDate(
        JSON.stringify(y),
        m < 10 ? '0' + m : JSON.stringify(m)
      );
      data.push(re);
    }
    this.data = data;
  }

  private created() {
    const date = new Date();
    this.start = {
      year: JSON.stringify(date.getFullYear()),
      month:
        date.getMonth() + 1 < 10
          ? '0' + JSON.stringify(date.getMonth() + 1)
          : JSON.stringify(date.getMonth() + 1),
      day:
        date.getDate() < 10
          ? '0' + JSON.stringify(date.getDate())
          : JSON.stringify(date.getDate())
    };

    date.setDate(date.getDate() + this.range);
    this.last = {
      year: JSON.stringify(date.getFullYear()),
      month:
        date.getMonth() + 1 < 10
          ? '0' + JSON.stringify(date.getMonth() + 1)
          : JSON.stringify(date.getMonth() + 1),
      day:
        date.getDate() < 10
          ? '0' + JSON.stringify(date.getDate())
          : JSON.stringify(date.getDate())
    };

    this.begin = this.beginInit;
    this.end = this.endInit;
  }

  private mounted() {
    this.tableDate();
  }
}
</script>
<style lang="less" scoped>
.dpb-week {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #f7f7f7;
  .indicator {
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .time {
      width: 200px;
      padding: 16px 0;
      .title {
        color: #999;
        font-size: 12px;
      }
      .content {
        font-weight: 700;
      }
      &.left {
        margin-left: 16px;
      }
      &.right {
        margin-right: 16px;
      }
    }
    .split {
      width: 100%;
      height: 100%;
      .line {
        width: 60px;
        margin: 0 auto;
        font-size: 12px;
        text-align: center;
        color: #51c7f9;
        padding-bottom: 2px;
        border-bottom: 1px solid #51c7f9;
      }
    }
  }
}
.dpb-week > table {
  font-size: 12px;
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.dpb-week > table > thead > tr > th {
  height: 24px;
  text-align: center;
  font-weight: 400;
  width: 14.28571%;
  vertical-align: middle;
}
.dpb-week-days {
  position: relative;
  width: 100%;
  overflow: auto;
  padding-bottom: 120px;
  padding-top: 48px;
  background: #fff;
}
.dpbwd-table-month {
  height: 30px;
  display: -webkit-box;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  font-size: 16px;
  z-index: 1;
}
.page-table-item {
  box-sizing: border-box;
  position: relative;
  /*display: -webkit-box;*/
  -webkit-box-orient: vertical;
  -webkit-box-align: center;
  -webkit-box-pack: end;
}
.page-table-text {
  font-size: 16px;
  height: 15px;
  line-height: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &.today {
    color: #51c7f9;
  }
}
.page-table-note {
  color: #ff5000;
  font-size: 12px;
  height: 15px;
  line-height: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-style: inherit;
}
.page-table-note,
.page-table-text {
  display: block;
  width: 100%;
  text-align: center;
  font-weight: 400;
}
.dpbwd-table {
  margin-bottom: 20px;
}
.dpbwd-table-items {
  background: #fff;
}
.dpbwd-table-items-table > tbody > tr > td > div > strong {
  height: 36px;
  line-height: 36px;
}
.dpbwd-table-items-table > tbody > tr > td.disable .page-table-text,
.dpbwd-table-items-table > tbody > tr > td.disable .page-table-note {
  color: #ccc !important;
  background: none !important;
}
.dpbwd-table-items-table > tbody > tr > td.range > div > strong {
  background: #51c7f9;
  border-bottom-color: #51c7f9 !important;
  color: #fff;
  .page-table-text.today {
    color: #fff;
  }
}
.dpbwd-table-items-table > tbody > tr > td.active > div > strong {
  border-radius: 4px;
  background: #51c7f9;
  border-bottom-color: #51c7f9 !important;
  color: #fff;
  .page-table-text.today {
    color: #fff;
  }
}
.dpbwd-table-items-table.isRange > tbody > tr > td.active > div > strong {
  border-radius: 0;
}
.dpbwd-table-items-table > tbody > tr > td.disable > div > strong {
  border-bottom-color: #ccc !important;
}
.dpbwd-table-items-table > tbody > tr > td {
  height: 60px;
  text-align: center;
  width: 14.28571%;
  position: relative;
}
.dpbwd-table-items-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
</style>
