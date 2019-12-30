import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SwipeRightMixin extends Vue {
  private async handleSwipeRight(e: any) {
    const { deltaX, direction } = e;
    if (direction === 4 && Math.abs(deltaX) > 10) {
      this.$router.go(-1);
    }
  }
}
