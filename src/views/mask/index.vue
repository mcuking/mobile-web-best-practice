<template>
  <div class="layout__page">
    <div class="layout__header">
      <van-nav-bar title="选择比赛面具"
                   left-text="返回"
                   left-arrow
                   @click-left="onClickLeft" />
    </div>
    <div class="layout__body">
      <main v-touch:pan="onPan">
        <div class="emoji"
             ref="emoji">{{ selectedContent }}</div>
        <section class="slider">
          <ul class="slider__list"
              ref="list">
            <li v-for="(animal, index) in animals"
                :key="animal"
                class="slider__item"
                v-touch:tap="(e) => onTap(e, animal)"
                :style="{backgroundColor: colors[index]}">
              {{ animal }}
            </li>
          </ul>
        </section>
      </main>
    </div>
    <div class="bottom-button--submit"
         id="fixed-bottom">
      <van-button type="primary"
                  size="large"
                  @click="goToApply">前去申请</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { NavBar, Button } from 'vant';
import { TweenMax, Elastic, Sine } from 'gsap';

Vue.use(NavBar).use(Button);

@Component
export default class Masks extends Vue {
  private animals = [
    '猫咪',
    '狗子',
    '熊猫',
    '狮子',
    '青蛙',
    '狗熊',
    '老鼠',
    '老虎',
    '猴子'
  ];

  private emojis = ['🐱', '🐶', '🐼', '🦁', '🐸', '🐻', '🐹', '🐯', '🐵'];
  private colors = [
    '#F7CC45',
    '#AC6909',
    '#272625',
    '#FFAD01',
    '#81DC58',
    '#C68E71',
    '#F2B2BD',
    '#FFCB00',
    '#BE9763'
  ];

  private currentOffset = 0;
  private selected = '猫咪';

  private get overflowRatio() {
    return (
      (this.$refs.list as HTMLElement).scrollWidth /
      (this.$refs.list as HTMLElement).offsetWidth
    );
  }

  private get itemWidth() {
    return (this.$refs.list as HTMLElement).scrollWidth / this.animals.length;
  }

  private get selectedContent() {
    if (this.selected) {
      return this.emojis[this.animals.indexOf(this.selected)];
    }
    return '';
  }

  private get count() {
    return this.animals.length;
  }

  @Watch('selected')
  private handleSelectedChange(newValue: string) {
    TweenMax.fromTo(
      this.$refs.emoji,
      0.6,
      {
        scale: 0
      },
      {
        scale: 1,
        ease: Elastic.easeOut.config(1, 0.8)
      }
    );
  }

  private onPan(e: HammerInput) {
    const dragOffset =
      (((100 / this.itemWidth) * e.deltaX) / this.count) * this.overflowRatio;

    const transform = this.currentOffset + dragOffset;

    (this.$refs.list as HTMLElement).style.setProperty(
      '--x',
      transform.toString()
    );

    if (e.isFinal) {
      this.currentOffset = transform;
      const maxScroll = 100 - this.overflowRatio * 100;
      let finalOffset = this.currentOffset;

      // scrolled to last item
      if (this.currentOffset <= maxScroll) {
        finalOffset = maxScroll;
      } else if (this.currentOffset >= 0) {
        // scroll to first item
        finalOffset = 0;
      } else {
        // animate to next item according to pan direction
        const index =
          (this.currentOffset / this.overflowRatio / 100) * this.count;
        const nextIndex = e.deltaX <= 0 ? Math.floor(index) : Math.ceil(index);
        finalOffset = ((100 * this.overflowRatio) / this.count) * nextIndex;
      }

      // bounce back animation
      TweenMax.fromTo(
        this.$refs.list,
        0.4,
        {
          '--x': this.currentOffset
        },
        {
          '--x': finalOffset,
          ease: Elastic.easeOut.config(1, 0.8),
          onComplete: () => {
            this.currentOffset = finalOffset;
          }
        }
      );
    }
  }

  private onTap(e: HammerInput, value: string) {
    if (value) {
      TweenMax.to(e.target, 0.12, {
        scale: 1.1,
        yoyo: true,
        repeat: 1,
        ease: Sine.easeOut
      });
      this.selected = value;
    }
  }

  private onClickLeft() {
    this.$router.go(-1);
  }

  private goToApply() {
    this.$router.push({ name: 'form' });
  }
}
</script>
<style lang="less" scoped>
.layout__body {
  padding: 60px 20px 0 20px;
}

.slider {
  width: 100%;
  height: 120px;
  overflow: visible;
  position: relative;
  white-space: nowrap;

  &__list {
    display: flex;
    width: 100%;
    height: 100%;

    font-size: 16px;
    backface-visibility: hidden;
    transform: translateX(calc(var(--x, 0) * 1%));
  }

  &__item {
    position: relative;
    flex: 0 0 140px;

    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-right: 12px;
    padding: 6px;
    box-sizing: border-box;

    border-radius: 8px;
    text-align: center;
    transition: opacity 0.15s ease;
    color: #fff;

    &:focus {
      opacity: 0.8;
    }
  }
}

.emoji {
  padding: 40px 0 60px 0;
  font-size: 120px;
  min-height: 140px;
  backface-visibility: hidden;
  text-align: center;
}
</style>
